const { SlashCommandBuilder } = require("@discordjs/builders")
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ComponentType } = require("discord.js")
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

        const msg = await interaction.reply({embeds: [Embed], components: SelectMenu(false), ephemeral: true})

        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 15000 });
        collector.on('collect', async(interaction) => {
            if(!interaction.isStringSelectMenu()) return;
            if(interaction.customId != "help-menu") return;

            const [selected] = interaction.values
            
            const category_cmds = fs.readdirSync(`./src/commands/${selected}/`).filter(file => file.endsWith(".js"))
        
            const categoryEmbed = new EmbedBuilder()
            .setTitle(selected)
            .setColor("#fa4454")
            .addFields(category_cmds.map(cmd => {
                const cmdData = require(`../../commands/${selected}/${cmd}`)
                return{
                    name: `\`/${cmdData.data.name}\``,
                    value: `${cmdData.data.description}`,
                    inline: false,
                }
            }))
            .setFooter({iconURL: `${interaction.user.displayAvatarURL()}`, text: `${interaction.user.username}`})

            try{
                await interaction.update({embeds: [categoryEmbed]})
            } catch{
                const errorEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setColor("Red")
                .setDescription("An error occured while updating message")
                interaction.update({embeds: [errorEmbed], ephemeral: true, components: SelectMenu(true)})
            }
        })

        collector.on('end', async() => {
            interaction.editReply({components: SelectMenu(true)})
        })
    }
}
