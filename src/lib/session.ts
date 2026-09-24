const SESSION_KEY = 'nato.session'

export function getSessionId() {
  const existing = sessionStorage.getItem(SESSION_KEY)
  if (existing) return existing

  const id = crypto.randomUUID()
  sessionStorage.setItem(SESSION_KEY, id)
  return id
}
