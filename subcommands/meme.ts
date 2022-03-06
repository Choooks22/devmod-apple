import { defineSlashSubcommand, defineSubcommand } from 'chooksie'
import { MessageEmbed } from 'discord.js'

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
    yeet,
  ],
})
