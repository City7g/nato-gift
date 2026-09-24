import type { ScriptTemplate } from './types'

export const askOut: ScriptTemplate = {
  id: 'ask-out',
  title: 'Просто спросить',
  description: 'Короткий вопрос без длинной истории',
  steps: [
    {
      step: 'hello',
      text: 'Привет. Можно тебя на минуту?',
      buttons: [
        { text: 'Конечно', route: 'ask' },
        { text: 'Смотря зачем', route: 'ask' },
      ],
    },
    {
      step: 'ask',
      text: 'Пойдём сегодня гулять? Я уже придумал куда',
      buttons: [
        { text: 'Пойдём', route: 'finale' },
        { text: 'А куда?', route: 'place' },
      ],
    },
    {
      step: 'place',
      text: 'Туда, где можно не спешить и просто быть рядом',
      buttons: [{ text: 'Звучит хорошо', route: 'finale' }],
    },
    {
      step: 'finale',
      text: 'Тогда я за тобой',
      subtitle: 'Напиши, во сколько тебе удобно',
      celebrate: true,
    },
  ],
}
