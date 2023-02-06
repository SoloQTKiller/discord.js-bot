const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

const valorant = require("../../api/valorant")
const valorant1 = new valorant()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vl-matches")
        .setDescription("Displays the last 5 matches of a player")
        .addStringOption((option) => option
            .setName("username")
            .setDescription("Players username")
            .setMaxLength(16)
            .setMinLength(3)
            .setRequired(true)
        ).addStringOption((option) => option
            .setName("tag")
            .setDescription("Players tagline")
            .setMaxLength(5)
            .setMinLength(3)
            .setRequired(true)
        ).addStringOption((option) => option
            .setName("region")
            .setDescription("Region leaderboard")
            .setRequired(true)
            .addChoices(
                {name: "North America/Latin America/Brazil", value: "na"},
                {name: "Europe", value: "eu"},
                {name: "Korea", value: "kr"},
                {name: "Asia Pacific", value: "ap"}
        )),
        async execute(client, interaction)
        {
            const user = interaction.options.get("username").value
            const tagline = interaction.options.get("tag").value
            const region = interaction.options.get("region").value

            await interaction.deferReply()

            const matchHistory = await valorant1.getMatchData(region, user, tagline)

            const matchHistoryEmbed = new EmbedBuilder()
                .setTitle(`Valorant Recent Matches [${user}#${tagline}]`)
                .setColor("#fa4454")
                .setAuthor({name: `Match History requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .addFields(
                    {name: "Select a Recent Match", value: "Max. 5 last Matches are shown."}
                )

            const SelectMenu = (state) => [
                new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`vl-rmenu ${interaction.user.id}`)
                        .setPlaceholder('Select a match')
                        .setDisabled(state)
                        .addOptions(
                        matchHistory.data.map(matchCluster => {
                            const match_data = []
                            Object.entries(matchCluster.players.all_players).map(([key, val] = entry) =>{
                                if(val.name.toLowerCase().includes(`${user.toLowerCase()}`) & val.tag.toLowerCase().includes(`${tagline.toLowerCase()}`)){
                                    match_data.push(val)
                                }
                            })

                            return{
                                label: `${matchCluster.metadata.map} - ${matchCluster.metadata.mode}`,
                                value: `${matchCluster.metadata.map} ${matchCluster.metadata.mode.replace(/\s/g, "")} ${matchCluster.metadata.game_start} ${matchCluster.metadata.rounds_played} ${matchCluster.metadata.platform} ${matchCluster.metadata.cluster.replace(/\s/g, "")} ${match_data[0].character} ${(match_data[0].stats.kills / match_data[0].stats.deaths).toFixed(2)} ${match_data[0].stats.kills} ${match_data[0].stats.deaths} ${user.replace(/\s/g, "")}#${tagline}`,
                                description: `Played at ${matchCluster.metadata.game_start_patched}`
                            }
                        })
                    )
                )
            ]

            await interaction.editReply({embeds: [matchHistoryEmbed], components: SelectMenu(false)}).then((setTimeout(() => {
                interaction.editReply({components: SelectMenu(true)})
            }, 10000)))
        }
}