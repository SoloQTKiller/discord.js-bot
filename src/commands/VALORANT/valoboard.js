const { SlashCommandBuilder, embedLength } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

const valorant = require("../../api/valorant")
const valorant1 = new valorant()

module.exports = {
    data: new SlashCommandBuilder()
    .setName("vl-leaderboard")
    .setDescription("Valorant leaderboard statistics")
    .addStringOption((option) => option
        .setName("region")
        .setDescription("Region leaderboard")
        .setRequired(true)
        .addChoices(
            {name: "North America/Latin America/Brazil", value: "na"},
            {name: "Europe", value: "eu"},
            {name: "Korea", value: "kr"},
            {name: "Asia Pacific", value: "ap"}
    )),
    async execute(client, interaction) {
        const region = interaction.options.get("region").value

        await interaction.deferReply()

        const lb_data = await valorant1.getLeaderBoardData(region)
        const leaderboardEmbed = new EmbedBuilder()
        .setTitle(`Valorant Leaderboard (${region.toUpperCase()})`)
        .setColor("#fa4454")
        .addFields(lb_data.slice(0, 10).map(player => {
                return{
                    name: `#${player.leaderboardRank} - ${player.gameName}#${player.tagLine}`,
                    value: `\`Total Wins: ${player.numberOfWins} | ${player.rankedRating}RR\``
                }
            })
        )
        
        await interaction.editReply({embeds: [leaderboardEmbed]})       
    }
}