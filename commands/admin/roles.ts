import { defineSlashCommand } from 'chooksie'

export default defineSlashCommand({
  name: 'roles',
  description: 'placeholder',
  async setup() {
    const { button, menu, row } = await import('../../utils/components')
    const option = (value: string, label: string) => ({ value, label })

    const roles = menu({
      id: 'role-handler',
      handler: async ctx => {
        // @todo: Role logic.
        await ctx.interaction.reply({
          content: `Updated ${ctx.interaction.values.length} roles.`,
          ephemeral: true,
        })
      },
      options: [
        // @todo: Softcode roles.
        option('fullstack', 'Fullstack'),
        option('js', 'JavaScript'),
        option('php', 'PHP'),
        option('py', 'Python'),
        option('ruby', 'Ruby'),
        option('uiux', 'UI/UX'),
        option('java', 'Java'),
        option('devops', 'DevOps'),
        option('html-css', 'HTML & CSS'),
        option('anime', 'Anime'),
        option('workshop', 'Workshop'),
      ],
    })

    const clear = button({
      id: 'clear-roles',
      style: 'SECONDARY',
      label: 'Clear All Roles',
      execute: async ctx => {
        // @todo: Role logic.
        await ctx.interaction.reply({
          content: 'Cleared all roles!',
          ephemeral: true,
        })
      },
    })

    return [
      row(roles),
      row(clear),
    ]
  },
  async execute(ctx) {
    // @todo: Discord embed
    await ctx.interaction.reply({
      content: 'Select a Role:',
      components: this,
    })
  },
})
