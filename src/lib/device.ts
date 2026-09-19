type NavigatorUAData = {
  getHighEntropyValues(hints: string[]): Promise<{
    model?: string
    platform?: string
    platformVersion?: string
  }>
}

export async function getDeviceModel(): Promise<string> {
  const uaData = (navigator as Navigator & { userAgentData?: NavigatorUAData }).userAgentData

  if (uaData) {
    try {
      const hints = await uaData.getHighEntropyValues(['model', 'platform', 'platformVersion'])
      const label = [hints.platform, hints.model, hints.platformVersion].filter(Boolean).join(' ')
      if (label) return label
    } catch {
      // Client Hints are unavailable in Safari / Firefox
    }
  }

  return navigator.userAgent
}
