import { defineSlashCommand } from 'chooksie'
import { TextChannel, ThreadChannel } from 'discord.js'

export default defineSlashCommand({
  name: 'prune',
  description: 'Removes up to 100 messages.',
  async setup() {
    const { createPermChecker } = await import('../../utils/checks')
    return createPermChecker('MANAGE_MESSAGES')
  },
  async execute(ctx) {
    if (!await this(ctx)) return
    const { channel, options } = ctx.interaction

    if (!(channel instanceof TextChannel || channel instanceof ThreadChannel)) {
      return ctx.interaction.reply('Cannot prune outside threads or text channels!')
    }

    const count = options.getNumber('count', true)
    await ctx.interaction.deferReply({ ephemeral: true })

    try {
      ctx.logger.info(`Bulk deleting ${count} messages...`)
      await channel.bulkDelete(count)
    } catch {
      ctx.logger.warn('Failed to bulk delete messages. Falling back to manual deletion...')

      const messages = await channel.messages.fetch({ limit: count })
      const jobs = messages
        .filter(message => message.deletable)
        .map(message => message.delete())

      await Promise.all(jobs)
    }

    const message = `Pruned ${count} messages.`
    await ctx.interaction.editReply(message)
    ctx.logger.info(message)
  },
  options: [
    {
      name: 'count',
      description: 'How many messages to remove.',
      minValue: 1,
      maxValue: 100,
      type: 'NUMBER',
    },
  ],
})
