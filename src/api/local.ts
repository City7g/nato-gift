import { cloneSteps } from '../lib/normalizeSteps'
import { createSlug } from '../lib/slug'
import { fourMonths } from '../templates/scripts/fourMonths'
import type { Invite, InviteDraft, VisitEvent, VisitEventInput } from '../lib/invite'

const STORAGE_KEY = 'nato.db'
export const SEED_SLUG = 'home'

type Database = {
  invites: Invite[]
  events: VisitEvent[]
}

function emptyDb(): Database {
  const now = new Date().toISOString()
  const invite: Invite = {
    id: crypto.randomUUID(),
    slug: SEED_SLUG,
    title: '4 месяца',
    theme: 'cats',
    steps: cloneSteps(fourMonths.steps),
    createdAt: now,
    updatedAt: now,
  }

  return { invites: [invite], events: [] }
}

function readDb(): Database {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const seeded = emptyDb()
    writeDb(seeded)
    return seeded
  }

  try {
    const parsed = JSON.parse(raw) as Database
    if (!Array.isArray(parsed.invites) || !Array.isArray(parsed.events)) {
      const seeded = emptyDb()
      writeDb(seeded)
      return seeded
    }
    return parsed
  } catch {
    const seeded = emptyDb()
    writeDb(seeded)
    return seeded
  }
}

function writeDb(db: Database) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

function requireToken(token: string | null) {
  if (!token) throw new Error('Нужен код доступа')
}

export const localApi = {
  login(code: string) {
    const expected = import.meta.env.VITE_STUDIO_CODE
    if (!code.trim()) throw new Error('Введите код')
    if (expected && code !== expected) throw new Error('Неверный код')
    return crypto.randomUUID()
  },

  listInvites(token: string | null) {
    requireToken(token)
    return readDb().invites
  },

  getInvite(token: string | null, id: string) {
    requireToken(token)
    const invite = readDb().invites.find((item) => item.id === id)
    if (!invite) throw new Error('Приглашение не найдено')
    return invite
  },

  getInviteBySlug(slug: string) {
    const invite = readDb().invites.find((item) => item.slug === slug)
    if (!invite) throw new Error('Страница не найдена')
    return invite
  },

  createInvite(token: string | null, draft: InviteDraft) {
    requireToken(token)
    const db = readDb()
    const now = new Date().toISOString()
    let slug = createSlug()
    while (db.invites.some((item) => item.slug === slug)) slug = createSlug()

    const invite: Invite = {
      id: crypto.randomUUID(),
      slug,
      title: draft.title.trim(),
      theme: draft.theme,
      steps: draft.steps,
      createdAt: now,
      updatedAt: now,
    }

    db.invites.unshift(invite)
    writeDb(db)
    return invite
  },

  updateInvite(token: string | null, id: string, draft: InviteDraft) {
    requireToken(token)
    const db = readDb()
    const invite = db.invites.find((item) => item.id === id)
    if (!invite) throw new Error('Приглашение не найдено')

    invite.title = draft.title.trim()
    invite.theme = draft.theme
    invite.steps = draft.steps
    invite.updatedAt = new Date().toISOString()
    writeDb(db)
    return invite
  },

  deleteInvite(token: string | null, id: string) {
    requireToken(token)
    const db = readDb()
    db.invites = db.invites.filter((item) => item.id !== id)
    writeDb(db)
  },

  addEvent(slug: string, input: VisitEventInput) {
    const db = readDb()
    const invite = db.invites.find((item) => item.slug === slug)
    if (!invite) throw new Error('Страница не найдена')

    const event: VisitEvent = {
      id: crypto.randomUUID(),
      inviteId: invite.id,
      sessionId: input.sessionId,
      type: input.type,
      step: input.step,
      button: input.button,
      device: input.device,
      createdAt: new Date().toISOString(),
    }

    db.events.push(event)
    writeDb(db)
    return event
  },

  listEvents(token: string | null, inviteId: string) {
    requireToken(token)
    return readDb()
      .events.filter((event) => event.inviteId === inviteId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  },
}
