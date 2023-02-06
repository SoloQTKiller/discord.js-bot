const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin")
    .addStringOption((option) => option
        .setName('coinside')
        .setDescription("Coin Side")
        .setRequired(true)
        .addChoices(
            {name: "Tail", value: "Tail"},
            {name: "Head", value: "Head"}
        )
    ),
    async execute(client, interaction) {
        const coinside = interaction.options.get('coinside').value
        const coin_side = ["Head", "Tail"]

        const result = coin_side[Math.floor(Math.random() * coin_side.length)]
        const coinflipEmbed = new EmbedBuilder()
        .setTitle(`🪙・Coinflip`)
        .setColor("#fa4454")
        if(coinside == result){
            coinflipEmbed.addFields(
                {name: "Coin Side", value: `${coinside}=${result}`},
                {name: "Result", value: ` You Won`}
            )
        } else {
            coinflipEmbed.addFields(
                {name: "Coin Side", value: `${coinside}≠${result}`},
                {name: "Result", value: ` You Lost`}
            )
        }



        interaction.reply({embeds: [coinflipEmbed]})
    }
}