export type DeviceKind = 'phone' | 'tablet' | 'computer'

export type DeviceInfo = {
  kind: DeviceKind
  model: string
  os: string
  browser: string
  screen: string
}

type BrandVersion = { brand: string; version: string }

type NavigatorUAData = {
  mobile?: boolean
  getHighEntropyValues(hints: string[]): Promise<{
    model?: string
    platform?: string
    platformVersion?: string
    fullVersionList?: BrandVersion[]
  }>
}

const emptyDevice: DeviceInfo = {
  kind: 'computer',
  model: '',
  os: '',
  browser: '',
  screen: '',
}

function browserFromBrands(brands: BrandVersion[] | undefined) {
  const brand = brands?.find((item) => !/not.a.brand|chromium/i.test(item.brand))
  if (!brand) return ''
  const version = brand.version.split('.')[0]
  return version ? `${brand.brand} ${version}` : brand.brand
}

function parseUserAgent(ua: string): DeviceInfo {
  let kind: DeviceKind = 'computer'
  let model = ''
  let os = ''

  if (/iPhone/.test(ua)) {
    kind = 'phone'
    model = 'iPhone'
    const version = ua.match(/OS (\d+)[_.](\d+)/)
    os = version ? `iOS ${version[1]}.${version[2]}` : 'iOS'
  } else if (/iPad/.test(ua)) {
    kind = 'tablet'
    model = 'iPad'
    const version = ua.match(/OS (\d+)[_.](\d+)/)
    os = version ? `iPadOS ${version[1]}.${version[2]}` : 'iPadOS'
  } else if (/Android/.test(ua)) {
    kind = /Mobile/.test(ua) ? 'phone' : 'tablet'
    const version = ua.match(/Android (\d+(?:\.\d+)?)/)
    os = version ? `Android ${version[1]}` : 'Android'
    const modelMatch = ua.match(/Android [^;]*;\s*([^;)]+?)\s*(?:Build|[);])/)
    const rawModel = modelMatch?.[1]?.trim() ?? ''
    model = /^(K|Mobile|Linux)$/i.test(rawModel) ? '' : rawModel
  } else if (/Mac OS X/.test(ua)) {
    const version = ua.match(/Mac OS X (\d+)[_.](\d+)/)
    os = version ? `macOS ${version[1]}.${version[2]}` : 'macOS'
  } else if (/Windows NT/.test(ua)) {
    const names: Record<string, string> = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7' }
    const version = ua.match(/Windows NT ([\d.]+)/)
    os = version ? `Windows ${names[version[1]] ?? version[1]}` : 'Windows'
  } else if (/Linux/.test(ua)) {
    os = 'Linux'
  }

  let browser = ''
  const edge = ua.match(/Edg\/(\d+)/)
  const opera = ua.match(/OPR\/(\d+)/)
  const firefox = ua.match(/Firefox\/(\d+)/)
  const chrome = ua.match(/Chrome\/(\d+)/)
  const safari = ua.match(/Version\/(\d+).+Safari/)
  if (edge) browser = `Edge ${edge[1]}`
  else if (opera) browser = `Opera ${opera[1]}`
  else if (firefox) browser = `Firefox ${firefox[1]}`
  else if (chrome) browser = `Chrome ${chrome[1]}`
  else if (safari) browser = `Safari ${safari[1]}`

  return { kind, model, os, browser, screen: '' }
}

export async function getDeviceInfo(): Promise<DeviceInfo> {
  const fallback = parseUserAgent(navigator.userAgent)
  const screenSize = `${screen.width}×${screen.height}`
  const uaData = (navigator as Navigator & { userAgentData?: NavigatorUAData }).userAgentData

  if (!uaData) return { ...fallback, screen: screenSize }

  try {
    const hints = await uaData.getHighEntropyValues([
      'model',
      'platform',
      'platformVersion',
      'fullVersionList',
    ])
    const model = hints.model?.trim() || fallback.model
    const osVersion = hints.platformVersion?.replace(/(\.0)+$/, '') ?? ''
    const os = [hints.platform, osVersion].filter(Boolean).join(' ') || fallback.os
    const browser = browserFromBrands(hints.fullVersionList) || fallback.browser
    const kind: DeviceKind = uaData.mobile
      ? 'phone'
      : /ipad|tablet/i.test(`${model} ${fallback.model}`)
        ? 'tablet'
        : fallback.kind

    return { kind, model, os, browser, screen: screenSize }
  } catch {
    return { ...fallback, screen: screenSize }
  }
}

export function serializeDevice(info: DeviceInfo) {
  return JSON.stringify(info)
}

export function parseDevice(raw: string): DeviceInfo {
  if (raw.startsWith('{')) {
    try {
      const parsed = JSON.parse(raw) as Partial<DeviceInfo>
      if (parsed.kind) {
        return {
          kind: parsed.kind,
          model: parsed.model ?? '',
          os: parsed.os ?? '',
          browser: parsed.browser ?? '',
          screen: parsed.screen ?? '',
        }
      }
    } catch {
      return emptyDevice
    }
  }

  if (raw.includes('Mozilla')) return parseUserAgent(raw)
  return { ...emptyDevice, os: raw }
}

const kindLabel: Record<DeviceKind, string> = {
  phone: 'Телефон',
  tablet: 'Планшет',
  computer: 'Компьютер',
}

export function deviceTitle(raw: string) {
  const info = parseDevice(raw)
  return info.model ? `${kindLabel[info.kind]} · ${info.model}` : kindLabel[info.kind]
}

export function deviceMeta(raw: string) {
  const info = parseDevice(raw)
  return [info.os, info.browser, info.screen ? `экран ${info.screen}` : ''].filter(Boolean).join(' · ')
}
