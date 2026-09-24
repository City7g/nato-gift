const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789'

export function createSlug(length = 8) {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('')
}
