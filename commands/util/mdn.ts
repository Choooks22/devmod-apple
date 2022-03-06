import type { Command } from '@types'
import axios from 'axios'
import { red } from '../../utils/colors'

const mdn: Command = {
  regex: /^mdn\s/,
  usage: 'mdn <query>',
  description: 'Search for an article on MDN.',

  async callback({ message, embed, args }): Promise<void> {
    // If a query isn't specified send an error message and terminate the command.
    if (args.length < 1) {
      await message.channel.send(embed({
        title: 'Please specify a query',
        color: red,
      }))

      return
    }

    const query = encodeURIComponent(args.join(' '))

    // Query the MDN search API
    const { data: { documents } } = await axios.get(`https://developer.mozilla.org/api/v1/search/en-US?q=${query}&highlight=false`)
    const [result] = documents

    // Remove the user's message.
    await message.delete()

    // Send the MDN result.
    // noinspection JSUnresolvedFunction
    await message.channel.send(embed({
      title: result.title,
      description:
`...${result.excerpt}...
[Search on MDN](https://developer.mozilla.org/en-US/search?q=${query})`,
      url: `https://developer.mozilla.org/en-US/${result.slug}`,
    }))
  },
}

export default mdn
