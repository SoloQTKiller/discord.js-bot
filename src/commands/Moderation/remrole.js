const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("removerole")
    .setDescription("Removes an role from a user")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
    .addUserOption((option) => option
        .setName("target")
        .setDescription("target user")
        .setRequired(true)
    )
    .addRoleOption((option) => option
        .setName("role")
        .setDescription("target role")
        .setRequired(true)
    ),
    async execute(client, interaction) {
        const target = interaction.options.get("target")
        const role = interaction.options.get("role")

        if(role.role.name == "@everyone") throw `You cant remove the "@everyone" role from a user`

        try{
            await target.member.roles.remove(role.value)

            const roleEmbed = new EmbedBuilder()
                .setDescription(`\`${interaction.user.tag}\` removed <@&${role.value}> from \`${target.user.tag}\``)
                .setColor("#fa4454")
            interaction.reply({embeds: [roleEmbed]})
        } catch{
            throw "Missing Permissions"
        }

    }
}