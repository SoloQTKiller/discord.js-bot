const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, Embed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pat")
    .setDescription("pat a user")
    .addUserOption((option) => option
        .setName('target')
        .setDescription("target")
        .setRequired(true)
    ),
    async execute(client, interaction) {
        const target = interaction.options.get('target')

        if(interaction.user.id == target.user.id) throw "You cant pat yourself"

        const image = await fetch("https://some-random-api.ml/animu/pat")
            .then(response => response.json())
            .catch(() => {
                throw "An error occured while fetching image"
            })

        const hugEmbed = new EmbedBuilder()
        .setDescription(`<@!${interaction.user.id}> pats <@!${target.user.id}>`)
        .setColor("#fa4454")
        .setImage(`${image.link}`)

        interaction.reply({embeds: [hugEmbed]})
    }
}