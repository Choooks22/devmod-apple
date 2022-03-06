import type { Command } from '@types'
import type { TextChannel } from 'discord.js'
import { MessageAttachment } from 'discord.js'
const { createCanvas, loadImage } = require('canvas')

const anime: Command = {
  regex: /^(anime)(\s|$)/,
  usage: 'anime <member> <penalty>',
  description: 'Sends an anime violation.',

  async callback({
    message,
    args,
    embed,
    client,
  }): Promise<void> {
    const [userId, ...restArgs] = args

    if (!userId) return

    const date = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

    const channel = await message.guild.channels.resolve(message.channel.id) as TextChannel
    const channelName = channel.name.replace(/[^a-zA-Z0-9\-]/g, '')

    const snowflake = userId.replace(/<@!?([0-9]+)>/, '$1')
    const issuedTo = await client.users.fetch(snowflake)

    const issuedBy = message.author

    const penalty = restArgs.join(' ').replace(/[^a-zA-Z0-9 ]/g, '')

    const canvas = createCanvas(1088, 631)
    const canvasCtx = canvas.getContext('2d')
    canvasCtx.font = '32px Verdana'

    try {
      const image = await loadImage('anime.png')

      canvasCtx.drawImage(image, 0, 0, 1088, 631)
      canvasCtx.fillText(date, 130, 430)
      canvasCtx.fillText(`#${channelName}`, 150, 470)
      canvasCtx.fillText(issuedTo.username, 230, 515)
      canvasCtx.fillText(issuedBy.username, 230, 560)
      canvasCtx.fillText(penalty, 190, 600)

      const attachment = new MessageAttachment(canvas.toBuffer(), 'attachment.png')

      await message.channel.send(attachment)
    } catch (error) {
      message.react('❌')
      console.log(error)
    }
  },
}

export default anime
