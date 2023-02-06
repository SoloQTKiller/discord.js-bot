const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Displays information about the bot"),
    async execute(client, interaction) {
        const msg = await interaction.deferReply({fetchReply: true})

        const infoEmbed = new EmbedBuilder()
            .setTitle("🤖・Bot Info")
            .setThumbnail(`${client.user.displayAvatarURL()}`)
            .setColor("#fa4454")
            .setFields(
                { name: "Bot Name", value: `${client.user.username}`, inline: true},
                { name: "Bot Id", value: `${client.user.id}`, inline: true},
                { name: "Created at", value: `<t:${Math.round(client.user.createdTimestamp / 1000)}:d>`, inline: true},
                { name: "Bot Owner", value: `<@!399301340326789120>`, inline: true},
                { name: "Bot Latency", value: `${msg.createdTimestamp - interaction.createdTimestamp}`, inline: true},
                { name: "Websocket Latency", value: `${client.ws.ping}`, inline: true},
                { name: "Bot Version", value: `${require(`${process.cwd()}/package.json`).version}`, inline: true}, 
                { name: "Discord.js Version", value: `${require("discord.js/package.json").version}`, inline: true}, 
                { name: "Node.js Version", value: `${process.version}`, inline: true}, 
                { name: "Uptime", value: `${Math.floor(Math.round(process.uptime()))}s`, inline: true},
                { name: "Commands", value: `${client.commands.size}`, inline: true},
                { name: "Servers", value: `${client.guilds.cache.size}`, inline: true},
            )

        await interaction.editReply({embeds: [infoEmbed]})
    }
}