const fs = require("fs")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if(!interaction.isStringSelectMenu()) return;
        if(interaction.customId != "help-menu") return;

        const [selected] = interaction.values
        
        const category_cmds = fs.readdirSync(`./src/commands/${selected}/`).filter(file => file.endsWith(".js"))
    
        const categoryEmbed = new EmbedBuilder()
        .setTitle(selected)
        .setColor("#fa4454")
        .addFields(category_cmds.map(cmd => {
            const cmdData = require(`../commands/${selected}/${cmd}`)
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
            if(interaction.deferred || interaction.replied) {
                interaction.editReply({embeds: [errorEmbed], ephemeral: true})
            } else {
                interaction.reply({embeds: [errorEmbed], ephemeral: true})
            }
        }
    }
}