import { createCanvas, loadImage } from 'canvas'
import { defineSlashSubcommand, defineSubcommand } from 'chooksie'
import type { TextBasedChannel } from 'discord.js'
import { MessageAttachment, MessageEmbed, TextChannel } from 'discord.js'

const lmgtfy = defineSubcommand({
  name: 'lmgtfy',
  description: 'Post a LMGTFY link.',
  type: 'SUB_COMMAND',
  async execute({ interaction }) {
    const query = interaction.options.getString('query', true)
    const site = interaction.options.getString('site')
    const type = interaction.options.getString('type')

    const searchParams = new URLSearchParams({
      q: query,
      s: site ?? undefined!,
      t: type ?? undefined!,
    })

    const embed = new MessageEmbed()
      .setTitle(query)
      .setURL(`https://lmgtfy.app/${searchParams}`)
      .setDescription('Here you go!')

    await interaction.reply({ embeds: [embed] })
  },
  options: [
    {
      name: 'query',
      description: 'The query to LMGTFY.',
      type: 'STRING',
      required: true,
    },
    {
      name: 'site',
      description: 'Use a different search engine.',
      type: 'STRING',
      choices: [
        {
          name: 'Google',
          value: 'g',
        },
        {
          name: 'Yahoo',
          value: 'y',
        },
        {
          name: 'Bing',
          value: 'b',
        },
        {
          name: 'Ask',
          value: 'k',
        },
        {
          name: 'AOL',
          value: 'a',
        },
        {
          name: 'DuckDuckGo',
          value: 'd',
        },
      ],
    },
    {
      name: 'type',
      description: 'Search type.',
      type: 'STRING',
      choices: [
        {
          name: 'Web',
          value: 'w',
        },
        {
          name: 'Images',
          value: 'i',
        },
      ],
    },
  ],
})

const noAnime = defineSubcommand({
  name: 'no-anime',
  description: 'Issue an anime violation.',
  type: 'SUB_COMMAND',
  async setup() {
    const image = await loadImage('anime.png')

    const getChannelName = (channel: TextBasedChannel | null) => {
      if (!channel) return 'Invalid Channel.'
      return channel instanceof TextChannel
        ? channel.name.replace(/[^\w]/g, '')
        : channel.id
    }

    const formatDate = (date: Date) => date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })

    return { image, getChannelName, formatDate }
  },
  async execute({ interaction }) {
    const issuedBy = interaction.user
    const issuedTo = interaction.options.getUser('user', true)
    const penalty = interaction.options.getString('penalty', true)
    await interaction.deferReply()

    const canvas = createCanvas(1088, 631)
    const canvasCtx = canvas.getContext('2d')
    canvasCtx.font = '32px Verdana'

    const channelName = `#${this.getChannelName(interaction.channel)}`
    const date = this.formatDate(new Date())

    canvasCtx.drawImage(this.image, 0, 0, 1088, 631)
    canvasCtx.fillText(date, 130, 430)
    canvasCtx.fillText(channelName, 150, 470)
    canvasCtx.fillText(issuedTo.username, 230, 515)
    canvasCtx.fillText(issuedBy.username, 230, 560)
    canvasCtx.fillText(penalty, 190, 600)

    const attachment = new MessageAttachment(canvas.toBuffer(), 'attachment.png')
    await interaction.editReply({ attachments: [attachment] })
  },
  options: [
    {
      name: 'user',
      description: 'User to issue violation to.',
      type: 'USER',
      required: true,
    },
    {
      name: 'penalty',
      description: 'The penalty of the violation.',
      type: 'STRING',
      required: true,
    },
  ],
})

const yeet = defineSubcommand({
  name: 'yeet',
  description: 'Yeet.',
  type: 'SUB_COMMAND',
  async setup() {
    const { default: randomize } = await import('../utils/randomize')
    const getId = randomize([
      'J1ABRhlfvQNwIOiAas',
      'YnBthdanxDqhB99BGU',
      'M9aM4NXS8q29W6Ia6S',
      '11HkufsiNrBXK8',
      '5PhDdJQd2yG1MvHzJ6',
      'Izi543BvWEbAVXZLG6',
      '4EEIsDmNJCiNcvAERef',
      'KzoZUrq40MaazLgHsg',
      'DvMHwFYLVHlZe',
    ])

    return () => `https://media.giphy.com/media/${getId()}/giphy.gif`
  },
  async execute({ interaction }) {
    await interaction.reply(this())
  },
})

export default defineSlashSubcommand({
  name: 'meme',
  description: 'Bunch of memes.',
  options: [
    lmgtfy,
    noAnime,
    yeet,
  ],
})
