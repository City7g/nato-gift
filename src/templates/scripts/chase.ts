import type { ScriptTemplate } from './types'

export const chase: ScriptTemplate = {
  id: 'chase',
  title: 'Убегающая кнопка',
  description: 'Отказ убегает, согласие остаётся',
  steps: [
    {
      step: 'hello',
      text: 'У меня есть один серьёзный вопрос',
      buttons: [{ text: 'Слушаю', route: 'question' }],
    },
    {
      step: 'question',
      text: 'Ты пойдёшь со мной на свидание?',
      buttons: [
        { text: 'Да', route: 'finale' },
        {
          text: ['Нет', 'Точно нет?', 'Ладно, кнопка сдалась'],
          route: 'finale',
          decorate: true,
        },
      ],
    },
    {
      step: 'finale',
      text: 'Я так и думал',
      subtitle: 'Спасибо, что не сбежала',
      celebrate: true,
    },
  ],
}
