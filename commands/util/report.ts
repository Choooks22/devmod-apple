import type { Command } from '@types'

import config from '../../config'

import type {
  TextChannel,
} from 'discord.js'

import {
  red,
} from '../../utils/colors'

const report: Command = {
  regex: /^(report)\s/,
  usage: 'report <member> <reason>',
  description: 'Reports a user.',

  async callback({
    message,
    embed,
    args,
  }): Promise<void> {
    if (!config.channels?.reports) {
      message.channel.send(embed({
        title: '`reports` channel not configured.',
        color: red,
      }))

      return
    }

    const [userId, ...restArgs] = args

    const reason = restArgs.join(' ')

    const member = await message.guild.members.fetch(userId.replace(/<@!?([0-9]+)>/, '$1'))

    const { user } = member

    const name = `${user.tag} (${user.id})`

    if (!reason) {
      await message.channel.send(embed({
        title: 'Please provide a reason',
        color: red,
      }))

      return
    }

    const reasonString = ` for \`${reason}\`.`

    message.delete().catch(console.error)

    const reportsChannel = await message.guild.channels.resolve(config.channels.reports) as TextChannel

    await reportsChannel.send(embed({
      title: 'Report',
      description: `<@${user.id}> has been reported${reasonString}`,

      footer: {
        icon_url: user.avatarURL(),
        text: name,
      },
    }))
  },
}

export default report
