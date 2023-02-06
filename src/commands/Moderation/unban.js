const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans an user from server")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .addUserOption((option) => option
        .setName("target")
        .setDescription("target user")
        .setRequired(true)
    ),
    async execute(client, interaction){
        const target = interaction.options.get("target")

        if(target.user.id == interaction.user.id) throw "You cant unban yourself"

        const banList = await interaction.guild.bans.fetch()
        if(!banList.get(target.user.id)) throw "User is not banned"

        try{
            await interaction.guild.members.unban(target.user.id)

            const unbanEmbed = new EmbedBuilder()
                .setDescription(`<@!${interaction.user.id}> unbanned <@!${target.user.id}>`)
                .setColor("#fa4454")
            interaction.reply({embeds: [unbanEmbed]})
        } catch(err) {
            throw "Couldn't unban user"
        }
    }
}