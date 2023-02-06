const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Displays information about a user")
    .addUserOption((option) => option
        .setName("target")
        .setDescription("target")
        .setRequired(true)
    ),
    async execute(client, interaction){
        const target = interaction.options.get("target")

        const userEmbed = new EmbedBuilder()
        .setColor("#fa4454")
        .setThumbnail(`${target.user.displayAvatarURL() || target.user.defaultAvatarURL}`)
        .addFields(
            {name: `${target.user.tag}`, value: `(${target.user.id})`, inline: false},
            {name: `Created at`, value: `<t:${Math.round(target.user.createdTimestamp / 1000)}:d>`, inline: true},
            {name: `Joined at`, value: `<t:${Math.round(target.member.joinedTimestamp / 1000)}:d>`, inline: true},
            {name: `\u200b`, value: `\u200b`, inline: true},
            {name: `Server Roles`, value: `${target.member.roles.cache.size - 1}`, inline: true},
            {name: `Avatar Url`, value: `[Link](${target.user.displayAvatarURL({size: 1024}) || target.user.defaultAvatarURL})`, inline: true},
            {name: `\u200b`, value: `\u200b`, inline: true},
            {name: `Bot`, value: `${target.user.bot ? "Yes" : "No"}`, inline: true},
            {name: `Verified`, value: `${target.user.verified ? "Yes" : "No"}`, inline: true},
            {name: `MFA`, value: `${target.user.mfaEnabled ? "Yes" : "No"}`, inline: true},
        )

        await interaction.reply({embeds: [userEmbed]})
    }
}