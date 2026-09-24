import type { ThemeId } from '../templates/themes'
import type { StepConfig } from '../lib/steps'

export type Invite = {
  id: string
  slug: string
  title: string
  theme: ThemeId
  steps: StepConfig[]
  createdAt: string
  updatedAt: string
}

export type InviteDraft = {
  title: string
  theme: ThemeId
  steps: StepConfig[]
}

export type VisitEventType = 'enter' | 'step' | 'end'

export type VisitEvent = {
  id: string
  inviteId: string
  sessionId: string
  type: VisitEventType
  step?: string
  button?: string
  device: string
  createdAt: string
}

export type VisitEventInput = {
  sessionId: string
  type: VisitEventType
  step?: string
  button?: string
  device: string
}
