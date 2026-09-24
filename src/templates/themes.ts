export const themeIds = ['cats', 'hearts', 'clouds'] as const

export type ThemeId = (typeof themeIds)[number]

export type ThemeTemplate = {
  id: ThemeId
  title: string
  description: string
}

export const themes: ThemeTemplate[] = [
  { id: 'cats', title: 'Котики', description: 'Котики и сердечки, как сейчас' },
  { id: 'hearts', title: 'Сердца', description: 'Крупное сердце и вспышка в финале' },
  { id: 'clouds', title: 'Облака', description: 'Мягкий розовый фон' },
]

export function isThemeId(value: string): value is ThemeId {
  return themeIds.includes(value as ThemeId)
}
