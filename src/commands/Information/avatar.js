const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Displays an users avatar")
    .addUserOption((option) => option
        .setName('target')
        .setDescription("target")
        .setRequired(true)
    ),
    async execute(client, interaction) {
        const target = interaction.options.get('target') 

        const avatarEmbed = new EmbedBuilder()
        .setTitle(`Avatar of ${target.user.tag}`)
        .setURL(`${target.user.displayAvatarURL({size: 1024})}`)
        .setColor("#fa4454")
        .setImage(`${target.user.displayAvatarURL({size: 1024})}`)

        interaction.reply({embeds: [avatarEmbed]})
    }
}