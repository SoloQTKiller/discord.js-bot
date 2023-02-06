module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if(!interaction.isCommand()) return

        const command = client.commands.get(interaction.commandName)

        if(!command) return
        if(command.devOnly && interaction.user.id != "399301340326789120") return interaction.reply({content: "This command is only accessable for developers", ephemeral: true}) 
        if(command.nsfw && !interaction.channel.nsfw) return interaction.reply({content: "This command is only available in NSFW-Channel's", ephemeral: true}) 

        try{
            await command.execute(client, interaction)
        } catch(err){
            console.error(err)

            if(interaction.deferred || interaction.replied) {
                interaction.editReply({content: `An error occured while executing command:\n\`${err}\``, ephemeral: true})
            } else {
                interaction.reply({content: `An error occured while executing command:\n\`${err}\``, ephemeral: true})
            }
        }
    }
}