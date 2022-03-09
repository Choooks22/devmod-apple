import { defineMessageCommand } from 'chooksie'
import { Message, MessageEmbed } from 'discord.js'

export default defineMessageCommand({
  name: 'Flag Message',
  async execute({ interaction, logger }) {
    const { user, targetMessage: message } = interaction

    if (user === message.author) {
      return interaction.reply({
        content: 'You cannot report yourself!',
        ephemeral: true,
      })
    }

    // @Choooks22: For now it's not really an issue, but maybe soon once reporting is enabled. idk.
    if (!(message instanceof Message)) {
      logger.warn(new TypeError('Did not receive a full Message object! Please check your intents.'))
      return interaction.reply({
        content: 'The bot is misconfigured! Please contact staff about this issue.',
        ephemeral: true,
      })
    }

    const target = message.author
    const targetLink = `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`
    await interaction.deferReply({ ephemeral: true })

    // @todo: Reports channel.
    logger.info(`${user} flagged message from ${target} <${targetLink}>.`)

    const embed = new MessageEmbed()
      .setAuthor({
        iconURL: user.avatarURL({ size: 64 })!,
        name: `${user.username}#${user.tag}`,
      })
      .setColor('RED')
      .setTitle('Flagged Message.')
      .addField('Channel', `<#${message.channel.id}>`, true)
      .addField('Message', `[Jump to Message](${targetLink})`, true)
      .setFooter({
        iconURL: target.avatar! && `https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.png`,
        text: `${target.username}#${target.discriminator}`,
      })
      .setTimestamp(interaction.createdTimestamp)

    await interaction.editReply({ embeds: [embed] })
  },
})
