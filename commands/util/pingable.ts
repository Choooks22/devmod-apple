import type { Command } from '@types'

import config from '../../config'
import { red } from '../../utils/colors'

const pingable: Command = {
  regex: /^pingable$/,
  usage: 'pingable',
  description: 'List all pingable roles.',

  async callback({ message, embed }) {
    if (!config.roles?.pingable) {
      await message.channel.send(embed({
        title: 'Pingable roles aren\'t configured.',
        color: red,
      }))

      return
    }

    await message.delete()

    await message.channel.send(embed({
      title: 'Pingable Roles',
      description: Object
        .entries(config.roles.pingable)
        .map(([key]) => `\`${key}\``)
        .join('\n'),
    }))
  },
}

export default pingable
