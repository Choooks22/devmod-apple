import type { Command } from '@types'

const ping: Command = {
  regex: /^ping$/,
  usage: 'ping',
  description: 'Ping the bot.',

  async callback({ message, embed }): Promise<void> {
    await message.channel.send(embed({
      title: 'Pong!',
    }))
  },
}

export default ping
