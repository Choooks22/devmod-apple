import type { CommandContext } from 'chooksie'
import type { CommandInteraction, ContextMenuInteraction, PermissionString } from 'discord.js'
import { MessageEmbed, Formatters } from 'discord.js'
import { red } from './colors'

type Context = CommandContext<CommandInteraction | ContextMenuInteraction>

export async function checkPerms(ctx: Context, perms: PermissionString[]): Promise<boolean> {
  if (!ctx.interaction.memberPermissions) {
    throw new TypeError('Could not access member permissions. Please check your intents.')
  }

  const missing = ctx.interaction.memberPermissions.missing(perms)
  const isMissing = missing.length > 0

  if (isMissing) {
    const missingPerms = perms
      .map(perm => `${missing.includes(perm) ? '-' : '+'} ${perm}`)
      .join()

    const embed = new MessageEmbed()
      .setColor(red)
      .setTitle('You don\'t have enough permissions to run this command!')
      .setDescription(`Permissions required:${Formatters.codeBlock('diff', missingPerms)}`)
      .setTimestamp()

    await ctx.interaction.reply({
      embeds: [embed],
      ephemeral: true,
    })
  }

  return isMissing
}

export function createPermChecker(...perms: PermissionString[]): (ctx: Context) => Promise<boolean> {
  return ctx => checkPerms(ctx, perms)
}
