import type {
  Message,
  Client,
  BitFieldResolvable,
  PermissionString,
} from 'discord.js'

export interface Command {
  regex: RegExp
  usage: string
  description: string
  noPrefix?: boolean
  permissions?: BitFieldResolvable<PermissionString>

  callback: (props: {
    message: Message
    content: string
    contentWithCommand: string
    args: string[]
    embed: (props, messageProps?) => Record<string, unknown>
    client: Client
  }) => void | Promise<void>
}
