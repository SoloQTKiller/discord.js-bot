const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("addrole")
    .setDescription("Adds an role to a user")
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

        if(role.role.name == "@everyone") throw `You cant add the "@everyone" role to a user`

        try{
            await target.member.roles.add(role.value)

            const roleEmbed = new EmbedBuilder()
                .setDescription(`\`${interaction.user.tag}\` added <@&${role.value}> to \`${target.user.tag}\``)
                .setColor("#fa4454")
            interaction.reply({embeds: [roleEmbed]})
        } catch{
            throw "Missing Permissions"
        }

    }
}