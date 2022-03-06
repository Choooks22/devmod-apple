import type { TextChannel } from 'discord.js'
import {
  Client,
} from 'discord.js'

import MessageHandler from './messageHandler'
import ReactionAddHandler from './reactionAddHandler'
import ReactionRemoveHandler from './reactionRemoveHandler'

import Secrets from '../config'

const client = new Client({ partials: ['CHANNEL', 'MESSAGE'] })

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', MessageHandler({
  client,
}))

client.on('raw', async ({ d: data, t: event }) => {
  if (['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(event)) {
    const {
      channel_id, user_id, message_id, emoji,
    } = data

    const channel = await client.channels.fetch(channel_id) as TextChannel
    const message = await channel.messages.fetch(message_id)

    const reaction = await message.reactions.resolve(
      emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name,
    )

    const member = await channel.guild.members.fetch(user_id)

    if (event === 'MESSAGE_REACTION_ADD') ReactionAddHandler(reaction, member)
    else ReactionRemoveHandler(reaction, member)
  }
})

client.login(Secrets.token)
