import type { Command } from '@types'
import { red } from '../../utils/colors'
import { tags } from './tagsList'

const tagCommand: Command = {
  regex: /^(tag)\s/,
  usage: 'tag <tag>',
  description: 'Post a tag to the current channel.',

  async callback({ message, embed, args }): Promise<void> {
    const [tag, ...restArgs] = args

    await message.delete()

    if (!tags[tag]) {
      await message.channel.send(embed({
        title: tag,
        description: 'This tag doesn\'t exist. Use `.tags` to get a list of available tags.',
        color: red,
      }))
    } else {
      await message.channel.send(embed({
        ...tags[tag],
        footer: { text: `.tag ${tag}` },
      }, {
        content: restArgs.join(' '),
      }))
    }
  },
}

export default tagCommand
