import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'
import { isAbsolute, relative, resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const projectDir = resolve(import.meta.dirname, '..')
const runtimeDir = join(process.env.HOME || '', '.local/share/omgithub-playwright')
const require = createRequire(join(runtimeDir, 'package.json'))
const { chromium } = require('playwright')
const config = require(join(runtimeDir, process.platform === 'darwin' ? 'metal.json' : 'linux.json'))

function timed(label, operation) {
  const start = process.hrtime.bigint()
  return Promise.resolve().then(operation).finally(() => {
    const seconds = Number(process.hrtime.bigint() - start) / 1e9
    console.log(`${label}: real ${seconds.toFixed(2)}`)
  })
}

function failure(message, exitCode = 1) {
  return Object.assign(new Error(message), { exitCode })
}

function infrastructureError(error) {
  error.exitCode ??= 75
  return error
}

const urlValue = process.env.CAPTURE_URL
const outputValue = process.env.CAPTURE_DIR
if (!urlValue || !outputValue) throw failure('Set CAPTURE_URL and CAPTURE_DIR.')

let target
try {
  target = new URL(urlValue)
  if (!['http:', 'https:'].includes(target.protocol)) throw new Error('Unsupported protocol')
} catch {
  throw failure(`CAPTURE_URL must be an absolute HTTP(S) URL: ${urlValue}`)
}

const outputDir = resolve(outputValue)
const fromProject = relative(projectDir, outputDir)
if (fromProject === '' || (!fromProject.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) && fromProject !== '..' && !isAbsolute(fromProject))) {
  throw failure('CAPTURE_DIR must be outside the project source directory.')
}

if (process.platform === 'linux') {
  try {
    process.env.DISPLAY ||= require('node:fs').readFileSync(join(runtimeDir, 'display'), 'utf8').trim().replace(/^/, ':')
  } catch (error) {
    throw infrastructureError(error)
  }
}

let browser
let exitCode = 0
try {
  await timed('Create capture directory', () => mkdirSync(outputDir, { recursive: true }))
  browser = await timed('Launch browser', () => chromium.launch({ ...config.browser.launchOptions, timeout: 30000 }).catch(infrastructureError))

  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await timed(`Open ${name} page`, () => browser.newPage({ viewport: { width, height } }).catch(infrastructureError))
    const pageErrors = []
    const httpFailures = []
    page.setDefaultTimeout(30000)
    page.on('pageerror', error => pageErrors.push(error.message))
    page.on('response', response => {
      if (response.status() >= 400 && new URL(response.url()).origin === target.origin) {
        httpFailures.push(`${response.status()} ${response.url()}`)
      }
    })

    let response
    try {
      response = await timed(`Navigate ${name}`, () => page.goto(target.href, { waitUntil: 'load', timeout: 45000 }).catch(infrastructureError))
    } catch (error) {
      await page.close().catch(() => {})
      throw error
    }

    if (!response) {
      await page.close().catch(() => {})
      throw failure(`No HTTP response while loading ${target.href}.`, 75)
    }
    if (!response.ok()) {
      const status = response.status()
      let body = ''
      try { body = await page.locator('body').innerText({ timeout: 3000 }) } catch {}
      const frpNotFound = status === 404 && /page you requested was not found/i.test(body) && /frp/i.test(body)
      const transientStatus = [408, 425, 429, 500, 502, 503, 504].includes(status)
      await page.close().catch(() => {})
      throw failure(`Preview returned HTTP ${status} for ${target.href}.`, frpNotFound || transientStatus ? 75 : 1)
    }

    try {
      await timed(`Wait for ${name} rendering`, async () => {
        await page.locator('body').waitFor({ state: 'visible', timeout: 15000 })
        await page.waitForFunction(() => document.fonts.status === 'loaded', { timeout: 15000 })
        await page.waitForFunction(() => {
          const body = document.body
          return Boolean(body && (body.innerText.trim() || body.querySelector('canvas, img, svg, video')))
        }, { timeout: 15000 })
        await page.waitForTimeout(1000)
      })
      if (pageErrors.length) throw failure(`Page JavaScript error: ${pageErrors.join('; ')}`)
      if (httpFailures.length) throw failure(`Same-origin resource failure: ${httpFailures.join('; ')}`)
      await timed(`Save ${name} screenshot`, () => page.screenshot({ path: join(outputDir, `final-${name}.png`), timeout: 30000 }).catch(infrastructureError))
      console.log(`Saved ${join(outputDir, `final-${name}.png`)}`)
    } catch (error) {
      await page.close().catch(() => {})
      throw error
    }
    await timed(`Close ${name} page`, () => page.close())
  }
} catch (error) {
  exitCode = error.exitCode ?? 1
  console.error(error)
} finally {
  if (browser) {
    try {
      await timed('Close capture browser', () => browser.close())
    } catch (error) {
      console.error(error)
      exitCode ||= 75
    }
  }
}
process.exitCode = exitCode
