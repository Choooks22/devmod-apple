export interface Config {
  token: string
  prefix?: RegExp

  channels?: {
    log?: string
    roles?: string
    reports?: string

    help?: string[]
  }

  roles?: {
    muted?: string

    pingable?: Record<string, string>

    assignableEmbeds?: {
      [key: string]: unknown

      items: Record<string, string>
    }[]
  }
}
