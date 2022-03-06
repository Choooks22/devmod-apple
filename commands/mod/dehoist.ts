import type { Command } from '@types'

const dehoist: Command = {
  regex: /^(dehoist|dh)/,
  usage: 'dehoist',
  description: 'Dehoists all hoisted users',
  permissions: ['MANAGE_MESSAGES'],

  async callback({
    message,
    embed,
    args,
  }): Promise<void> {
    const guild = message.guild

    guild.members.cache.each(member => {
      if (!member.manageable) return


      if (member.nickname && member.nickname.startsWith('!')) {
        let nickname = member.nickname.split('')
          .slice(1)
          .join()

        nickname = `zzzz ${nickname}`
        member.setNickname(nickname)
      }
    })
  },
}

export default dehoist
