import type {
  MessageReaction,
  GuildMember,
} from 'discord.js'

import config from '../config'

export default async (reaction: MessageReaction, member: GuildMember): Promise<void> => {
  if (member.user.bot || !config.channels?.roles || !config.roles?.assignableEmbeds || reaction.message.channel.id !== config.channels?.roles) return

  const roles = {}

  Object.assign(roles, ...config.roles.assignableEmbeds.map(({ items }) => items))

  await member.roles.remove(roles[reaction.emoji.name])
}
