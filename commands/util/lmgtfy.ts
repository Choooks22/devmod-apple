import type { Command } from '@types'
import { red } from '../../utils/colors'

const lmgtfy: Command = {
  regex: /^lmgtfy\s/,
  usage: 'lmgtfy <query>',
  description: 'Post a LMGTFY link.',

  async callback({ message, embed, args }): Promise<void> {
    // Set up type and site options.
    const types = {
      '-w': 'w', // web
      '-i': 'i', // image
    }
    const sites = {
      '-g': 'g', // google
      '-y': 'y', // yahoo
      '-b': 'b', // bing
      '-k': 'k', // ask
      '-a': 'a', // aol
      '-d': 'd', // duckduckgo
    }

    // Set default options to web & google.
    let type = types['-w']
    let site = sites['-g']

    // If a query isn't specified, send an error message and terminate the command.
    if (args.length < 1) {
      await message.channel.send(embed({
        title: 'Please specify a query.',
        color: red,
      }))

      return
    }

    const query = args.filter(a => a[0] !== '-')
    const options = args.filter(args => args[0] === '-')

    // If the specified options exists, set them.
    for (const option of options) {
      if (Object.keys(sites).includes(option.toLowerCase())) {
        site = sites[option]
      }
    }

    // LMGTFY only supports image for google searches
    if (site === 'g') {
      for (const option of options) {
        if (Object.keys(types).includes(option.toLowerCase())) {
          type = types[option]
        }
      }
    }

    await message.delete()

    // Send a let me google that for you link in an embedded message.
    // noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
    await message.channel.send(embed({
      title: query.join(' '),
      url: `https://lmgtfy.com/?q=${query.join('+')}&s=${site}&t=${type}`,
      description: 'Here you go!',
    }))
  },
}

export default lmgtfy
