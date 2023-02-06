const { SlashCommandBuilder } = require("@discordjs/builders")
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder} = require("discord.js")
const fs = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows Help"),
    async execute(client, interaction) {
        const categories = fs.readdirSync("./src/commands")

        const Emojis = {
            Fun: "🎡",
            Information: "🌎",
            NSFW: "🔞",
            VALORANT: `${client.emojis.cache.find(emoji => emoji.name === "lx_VALORANT_icon")}`,
            Moderation: "🛡️"
        }

        const Embed = new EmbedBuilder()
        .setTitle("Help Menu")
        .setColor("#fa4454")
        .setDescription("Please use the Select Menu below to get information about a module.\n`Note: After 15 seconds disables the Select Menu`\n\u200b")
        .addFields(
            {name: "Bot Links:", value: "• [Github](https://github.com/lxstarino)\n• [Steam](https://steamcommunity.com/id/lxstarino/)"}
        )
        .setFooter({iconURL: `${interaction.user.displayAvatarURL()}`, text: `${interaction.user.tag}`})

        const SelectMenu = (state) => [
            new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId(`help-menu`)
					.setPlaceholder('Select a category')
                    .setDisabled(state)
                    .addOptions(
                    categories.map((category) => {     
                        return{
                            label: category,
                            value: category,
                            description: `Commands from ${category} module`,
                            emoji: Emojis[category] || 0
                        }
                    })
                )
			)
        ]

        await interaction.reply({embeds: [Embed], components: SelectMenu(false), ephemeral: true}).then((setTimeout(() => {
            interaction.editReply({components: SelectMenu(true)})
        }, 15000)))
    }
}