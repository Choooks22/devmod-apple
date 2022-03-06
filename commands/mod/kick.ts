import type { Command } from '@types'
import config from '../../config'
import { red } from '../../utils/colors'
import type { TextChannel } from 'discord.js'

const kick: Command = {
  regex: /^(kick)(\s|$)/,
  usage: 'kick <member> <reason>',
  description: 'Kicks a member.',
  permissions: ['KICK_MEMBERS'],

  async callback({
    message,
    args,
    embed,
    client,
  }): Promise<void> {
    const [userId, ...restArgs] = args

    const snowflake = userId.replace(/<@!?([0-9]+)>/, '$1')
    const reason = restArgs.join(' ')
    const user = await client.users.fetch(snowflake)
    const name = `${user.tag} (${user.id})`

    const reasonString = reason
      ? ` for ${reason}.`
      : '.'

    try {
      const member = await message.guild.members.fetch(snowflake)

      if (!member.kickable) {
        await message.channel.send(embed({
          title: 'This member is unkickable.',
          color: red,

          footer: {
            icon_url: user.avatarURL(),
            text: name,
          },
        }))

        return
      }

      await member.kick(reasonString)
    } catch (error) {
      console.log(error)
    }

    message.delete().catch(console.error)

    await user.send(embed({
      title: 'Kicked',
      description: `You've been kicked from Devcord${reasonString}`,
    })).catch(console.error)

    try {
      if (!config.channels?.log) return

      const logChannel = await message.guild.channels.resolve(config.channels.log) as TextChannel

      await logChannel.send(embed({
        title: 'Kick',
        description: `<@${user.id}> has been kicked${reasonString}`,

        footer: {
          icon_url: user.avatarURL(),
          text: name,
        },
      }))
    } catch (error) {
      await message.channel.send(embed({
        title: 'Failed to kick member.',
        color: red,

        footer: {
          icon_url: user.avatarURL(),
          text: name,
        },
      }))

      throw error
    }
  },
}

export default kick
