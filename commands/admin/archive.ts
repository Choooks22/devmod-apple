import type { Command } from '@types'
import * as fs from 'fs'

import type {
  DMChannel,
  Message,
  NewsChannel,
  TextChannel,
} from 'discord.js'

const buildRoles: Command = {
  regex: /^archive\b/,
  usage: 'archive',
  description: 'archives the current channel into a markdown file',
  permissions: ['ADMINISTRATOR'],

  async callback({
    message,
    embed,
  }): Promise<void> {
    const currentChannel = message.channel

    const msgs: Message[] = (await getMessages(currentChannel, message, [])).reverse()
    const time = new Date().getTime()

    for (const msg of msgs) {
      const created = new Date(msg.createdTimestamp)
      const attachments = Array.from(msg.attachments.values())

      let cleanContent = msg.cleanContent.length > 0 ? msg.cleanContent : ''

      cleanContent = `\n${cleanContent.split('```')[0]}\n\`\`\`\n${cleanContent.split('```')[1]}\n\`\`\``

      let data = `**${msg.author.id}** [${created.toUTCString()}]:\n ${msg.cleanContent}`
      msg?.embeds.length > 0
        ? msg.embeds.forEach(embed => {
          data += `\n \`\`\` 
title: ${embed.title}
description: ${embed.description}
${embed?.image?.proxyURL ? ` image: ${embed?.image?.proxyURL} ` : ''}
\`\`\` 
      `
        })
        : ''
      attachments.length > 0 ? data += `Attachments: ${attachments.map(a => a.proxyURL).join(', ')}` : ''

      fs.appendFileSync(`./archives/${currentChannel.id}-${time}.md`, `${data}\n\n`)
    }

    await message.channel.send(embed({
      title: 'Archive',
      description: 'Archived the current channel.',
    }))
  },
}

const getMessages = async (channel: (TextChannel | DMChannel | NewsChannel), lastMessage: Message, pastMessages: Message[]) => {
  const msgs = await channel.messages.fetch({
    before: lastMessage.id,
    limit: 100,
  })

  if (Array.from(msgs.values()).length === 0)
    return pastMessages

  pastMessages.push(...Array.from(msgs.values()))

  return await getMessages(channel, msgs.last(), pastMessages)
}

export default buildRoles
