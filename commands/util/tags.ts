import type { Command } from '@types'

import { tags } from './tagsList'

const tagDescription = Object.entries(tags)
  .map(([key, props]) => {
    return props.title
      ? `\`${key}\` - ${props.title}`
      : `\`${key}\``
  })
  .join('\n')

const tagList = Object.keys(tags)
const getRandomTag = () => tagList[Math.floor(Math.random() * tagList.length)]

const tagsCommand: Command = {
  regex: /^(tags)$/,
  usage: 'tags',
  description: 'List all available tags.',

  async callback({ message, embed }): Promise<void> {
    await message.channel.send(embed({
      title: 'Tags',
      description: tagDescription,
      footer: { text: `Example: .tag ${getRandomTag()}` },
    }))
  },
}

export default tagsCommand
