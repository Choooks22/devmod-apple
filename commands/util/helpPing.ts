import type { Command } from '@types'

import config from '../../config'
import { red } from '../../utils/colors'

const pings = {}

const helpPing: Command = {
  regex: /^ping\s/,
  usage: 'ping <role>',
  description: 'Ping one of the help roles (without the `help-` prefix). You can ping help roles to notify helpers about your question. You may only ping once per hour, and twice daily.',

  async callback({
    message,
    args,
    embed,
  }) {
    if (!config.channels?.help) {
      await message.channel.send(embed({
        title: 'Help channels are not configured.',
        color: red,
      }))

      return
    }

    if (!config.channels?.help?.includes(message.channel.id)) return

    const [role] = args

    if (!config.roles?.pingable) {
      await message.channel.send(embed({
        title: 'Pingable roles are not configured.',
        color: red,
      }))

      return
    } else if (!config.roles?.pingable[role]) {
      await message.channel.send(embed({
        title: `Role \`${role}\` does not exist.`,
        color: red,
      }))

      return
    }

    if (!pings[message.author.id]) pings[message.author.id] = []

    const hour = 3600000

    const hourlyPings = pings[message.author.id].filter(({ date }) => {
      return Date.now() - date < hour
    })

    const dailyPings = pings[message.author.id].filter(({ date }) => {
      return Date.now() - date < hour * 24
    })

    if (hourlyPings.length >= 1) {
      await message.channel.send(embed({
        title: 'You may only ping once an hour.',
        color: red,
      }))

      return
    }

    if (dailyPings.length >= 2) {
      await message.channel.send(embed({
        title: 'You may only ping twice a day.',
        color: red,
      }))

      return
    }

    await message.delete()

    pings[message.author.id].push({
      date: Date.now(),
    })

    await message.channel.send(
      `<@${message.author.id}> requested help from <@&${config.roles?.pingable[role]}>`,
    )
  },
}

export default helpPing
