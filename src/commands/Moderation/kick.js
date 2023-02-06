const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, PermissionsBitField } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks an user from server")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
    .addUserOption((option) => option
        .setName("target")
        .setDescription("target user")
        .setRequired(true)
    ),
    async execute(client, interaction){
        const target = interaction.options.get("target")

        if(!target.member) throw "User not found"
        if(target.user.id == interaction.user.id) throw "You cant kick yourself"


        try{
            await target.member.kick()

            const kickEmbed = new EmbedBuilder()
                .setDescription(`<@!${interaction.user.id}> kicked <@!${target.user.id}>`)
                .setColor("#fa4454")
            interaction.reply({embeds: [kickEmbed]})
        } catch(err) {
            throw "Couldn't kick user"
        }
    }
}