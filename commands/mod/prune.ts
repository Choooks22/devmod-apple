import type { Command } from '@types'
import type { TextChannel } from 'discord.js'

const prune: Command = {
  regex: /^prune\s/,
  usage: 'prune <count>',
  description: 'Removes up to 100 messages.',
  permissions: ['MANAGE_MESSAGES'],

  async callback({
    message,
    args,
  }) {
    const count = Number(args[0])

    await message.delete()

    const channel = message.channel as TextChannel

    try {
      await channel.bulkDelete(count)
    } catch {
      const oldMessages = await channel.messages.fetch({
        limit: count,
      })

      for (const message of oldMessages.array()) {
        message.delete()
      }
    }
  },
}

export default prune
