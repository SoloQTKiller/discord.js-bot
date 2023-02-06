const { EmbedBuilder, Embed } = require("discord.js")

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if(!interaction.isStringSelectMenu()) return;
        if(interaction.customId.slice(0,8) != "vl-rmenu") return;
        if(interaction.customId.slice(9, 128) != interaction.user.id) return await interaction.reply({content: "You cant use this Select Menu", ephemeral: true})

        const [selected] = interaction.values
        const selectedArray = selected.split(" ")

        const matchEmbed = new EmbedBuilder()
            .setTitle(`${selectedArray[0]} - ${selectedArray[1]}`)
            .setColor("#fa4454")
            .addFields(
                {name: "Player", value: `${selectedArray[10]}`, inline: true},
                {name: "Cluster", value: `${selectedArray[5]}`,inline: true},
                {name: "Platform", value: `${selectedArray[4]}`, inline: true},
                {name: "Agent", value: `${selectedArray[6]}`, inline: true},
                {name: "Match Started", value: `<t:${selectedArray[2]}:d>`, inline: true},
                {name: "Rounds played", value: `${selectedArray[3]}`, inline: true},
                {name: "K/D", value: `${selectedArray[7]}`, inline: true},
                {name: "Kills", value: `${selectedArray[8]}`, inline: true},
                {name: "Deaths", value: `${selectedArray[9]}`, inline: true},
            )
        
    
        try{
            await interaction.update({embeds: [matchEmbed]})
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