import type { GenericHandler } from 'chooksie'
import { defineEvent } from 'chooksie'
import { randomUUID } from 'crypto'
import type { ButtonInteraction, SelectMenuInteraction } from 'discord.js'
import { MessageEmbed } from 'discord.js'

type Store = Map<string, GenericHandler>

async function sendGenericError(interaction: ButtonInteraction | SelectMenuInteraction, id: string) {
  const iconURL = interaction.client.user!.avatarURL({ size: 64 }) ?? undefined
  const errorEmbed = new MessageEmbed()
    .setColor('RED')
    .setAuthor({ name: 'An unexpected error has occured!', iconURL })
    .setDescription('Please contact the developers with the Request ID about this issue.')
    .addField('Request ID', id)
    .setTimestamp(interaction.createdTimestamp)

  if (interaction.deferred) {
    await interaction.editReply({ embeds: [errorEmbed] })
  } else {
    await interaction.reply({ embeds: [errorEmbed], ephemeral: true })
  }
}

// @Choooks22: custom component listener since I don't have framework support for components yet.
// Related: https://github.com/chookscord/framework/issues/61
export default defineEvent({
  name: 'interactionCreate',
  async setup() {
    const { getComponents } = await import('../utils/components')
    return getComponents()
  },
  async execute(ctx, interaction) {
    const isButton = interaction.isButton()
    if (!isButton && !interaction.isSelectMenu()) return

    let prefix: string
    let store: Store

    if (isButton) {
      prefix = 'btn'
      store = this.buttons as Store
    } else {
      prefix = 'mnu'
      store = this.selectMenus as Store
    }

    const key = `${prefix}:${interaction.customId}`
    if (!store.has(key)) return

    const reqId = randomUUID()
    const client = ctx.client
    const logger = ctx.logger.child({ type: prefix })
    const handler = store.get(key)!

    try {
      ctx.logger.info(`Running handler for "${key}"...`)

      const now = process.hrtime()
      await handler({ client, interaction, logger })
      const [s, ns] = process.hrtime(now)

      ctx.logger.info({
        responseTime: s * 1e3 + ns / 1e6,
        msg: `Successfully ran handler for "${key}".`,
      })
    } catch (error) {
      ctx.logger.error(`Handler for "${key}" did not run successfully.`)

      logger.error('An unexpected error has occured!')
      logger.error(error)

      // If interaction hasn't been handled, reply with a generic error message.
      if (interaction.isCommand() || interaction.isContextMenu()) {
        if (interaction.replied) return

        try {
          await sendGenericError(interaction, reqId)
        } catch {
          ctx.logger.error('Failed to notify user of unhandled error!')
        }
      }
    }
  },
})
