let currentId = ''
let activeSlug = ''
let cachedDevice = ''
let closed = false

export function getSessionId() {
  if (!currentId) currentId = crypto.randomUUID()
  return currentId
}

export function rememberVisit(slug: string, device: string) {
  activeSlug = slug
  if (device) cachedDevice = device
}

export function takeLeave() {
  if (closed || !activeSlug || !currentId) return null
  closed = true
  return { slug: activeSlug, sessionId: currentId, device: cachedDevice }
}
