import { defineSlashCommand } from 'chooksie'

export default defineSlashCommand({
  name: 'ping',
  description: 'Ping one of the help roles. You may only ping once per hour, and twice daily.',
  async execute({ interaction }) {
    // @todo: Ping limits
    const user = interaction.user
    const helper = interaction.options.getString('role', true)

    // @todo: Roles config.
    await interaction.reply({
      content: `${user} requested help from ${helper}`,
      allowedMentions: {
        repliedUser: false,
        // @todo: Put mentioned role here.
        roles: [],
      },
    })
  },
  options: [
    {
      name: 'role',
      description: 'The helper role to ping.',
      type: 'STRING',
      required: true,
      // @todo: Add roles.
      // Either: Use choices (upto 25, instant) OR
      //         Use autocomplete (unlimited, slow)
    },
  ],
})
