import type { Command } from '@types'

import config from '../../config'

import type {
  TextChannel,
} from 'discord.js'

import {
  red,
} from '../../utils/colors'

const mute: Command = {
  regex: /^(warn)\s/,
  usage: 'warn <member> <reason>',
  description: 'Sends a user a warning message.',
  permissions: ['MANAGE_MESSAGES'],

  async callback({
    message,
    embed,
    args,
  }): Promise<void> {
    const [userId, ...restArgs] = args

    const snowflake = userId.replace(/<@!?([0-9]+)>/, '$1')
    const reason = restArgs.join(' ')
    const member = await message.guild.members.fetch(snowflake)
    const { user } = member
    const name = `${user.tag} (${user.id})`

    if (!reason) {
      await message.channel.send(embed({
        title: 'Please provide a reason',
        color: red,
      }))

      return
    }

    await message.delete()

    try {
      await user.send(embed({
        title: 'Warning from Devcord',
        description: reason,
      }))

      if (!config.channels?.log) return

      const logChannel = await message.guild.channels.resolve(config.channels.log) as TextChannel

      await logChannel.send(embed({
        title: 'Warning',
        description: `<@${user.id}> has been warned: ${reason}`,

        footer: {
          icon_url: user.avatarURL(),
          text: name,
        },
      }))
    } catch (error) {
      await message.channel.send(embed({
        title: 'Failed to warn member.',
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

export default mute
