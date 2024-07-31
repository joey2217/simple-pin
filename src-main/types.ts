export type Theme = 'system' | 'light' | 'dark'

export type UpdateType = 'auto' | 'hint' | 'manual'

export type PinType = 'image'

interface PinBasePayload {
  type: PinType
  id: number
}

export interface PinImagePayload extends PinBasePayload {
  filePath: string
}

export type PinPayload = PinImagePayload
