import type { Command } from '@types'

import commands from '../'

const help: Command = {
  regex: /^(help|\?|commands)$/,
  usage: 'help',
  description: 'Get a list of commands.',

  async callback({ message, embed }): Promise<void> {
    await message.channel.send(embed({
      title: 'Help',
      description: commands
        .filter(({ permissions }) => {
          return !permissions || message.member.hasPermission(permissions, {
            checkAdmin: true,
            checkOwner: true,
          })
        })
        .map(({ usage, description }) => `\`${usage}\` - ${description}`)
        .join('\n'),
    }))
  },
}

export default help
