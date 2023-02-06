const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans an user from server")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .addUserOption((option) => option
        .setName("target")
        .setDescription("target user")
        .setRequired(true)
    ),
    async execute(client, interaction){
        const target = interaction.options.get("target")

        if(target.user.id == interaction.user.id) throw "You cant ban yourself"
        
        const banList = await interaction.guild.bans.fetch()
        if(banList.get(target.user.id)) throw "User is already banned"

        try{
            await interaction.guild.members.ban(target.user.id)

            const banEmbed = new EmbedBuilder()
                .setDescription(`<@!${interaction.user.id}> banned <@!${target.user.id}>`)
                .setColor("#fa4454")
            interaction.reply({embeds: [banEmbed]})
        } catch(err) {
            throw "Couldn't ban user"
        }
    }
}