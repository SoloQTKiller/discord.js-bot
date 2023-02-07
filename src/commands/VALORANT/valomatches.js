const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, Embed } = require("discord.js")

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
                        matchHistory.data.map(data => {
                            return {
                                metadata: data.metadata,
                                label: `${data.metadata.map} - ${data.metadata.mode}`,
                                value: `${data.metadata.matchid}`,
                                description: `Played at ${data.metadata.game_start_patched}`
                            }
                        }).filter(data => data.metadata.mode !== "Custom Game" && data.metadata.mode !== "Deathmatch")
                    )
                )
            ]

            const vl_msg = await interaction.editReply({embeds: [matchHistoryEmbed], components: SelectMenu(false)})

            const collector = vl_msg.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 15000 })
            collector.on("collect", async(interaction) => {
                const [selected] = interaction.values

                const match_data = await matchHistory.data.map(data => {
                    return{
                        metadata: data.metadata,
                        team_a: data.players.red,
                        team_b: data.players.blue,
                        teams: data.teams
                    } 
                }).filter(data => data.metadata.matchid === `${selected}`)

                const team_a = match_data[0].team_a.map(player => {
                    return(`Name: ${player.name} \`#${player.tag}\`\n➤ Agent: ${player.character}\n➤ K/D/A: ${player.stats.kills}/${player.stats.deaths}/${player.stats.assists}\n➤ K/D: ${(player.stats.kills / player.stats.deaths).toFixed(2)}\n\n`)
                })

                const team_b = match_data[0].team_b.map(player => {
                    return(`Name: ${player.name} \`#${player.tag}\`\n➤ Agent: ${player.character}\n➤ K/D/A: ${player.stats.kills}/${player.stats.deaths}/${player.stats.assists}\n➤ K/D: ${(player.stats.kills / player.stats.deaths).toFixed(2)}\n\n`)
                })
            
                const minutes = Math.round(match_data[0].metadata.game_length / 1000) / 60
                const seconds = (minutes - minutes.toString().slice(0, 2)) * 60

                const matchEmbed = new EmbedBuilder()
                .setTitle(`${match_data[0].metadata.map} - ${match_data[0].metadata.mode} (${match_data[0].metadata.region.toUpperCase()})`)
                .setDescription(`Match Id ${match_data[0].metadata.matchid}`)
                .setColor("#fa4454")
                .addFields(
                    {name: "Match started", value: `<t:${match_data[0].metadata.game_start}:t>`, inline: true},
                    {name: "Match length", value: `${Math.trunc(minutes)}m ${Math.trunc(seconds)}s`, inline: true},
                    {name: "Server", value: `${match_data[0].metadata.cluster}`, inline: true},
                    {name: "Team A Team B", value: `**${match_data[0].teams.red.rounds_won}**  :  **${match_data[0].teams.blue.rounds_won}**`, inline: true},
                    {name: "Winner", value: `${match_data[0].teams.blue.has_won ? "Team B" : "Team A"}`, inline: true},
                    {name: "Played rounds", value: `${match_data[0].metadata.rounds_played}`, inline: true},
                    {name: "Team A", value: `${team_a.join("")}`, inline: true},
                    {name: "\u200b", value: `\u200b`, inline: true},
                    {name: "Team B", value: `${team_b.join("")}`, inline: true},
                )

                try{
                    await interaction.update({embeds: [matchEmbed]})
                } catch{
                    const errorEmbed = new EmbedBuilder()
                    .setTitle("Error")
                    .setColor("Red")
                    .setDescription("An error occured while updating message")
                    await interaction.update({embeds: [errorEmbed], ephemeral: true, components: SelectMenu(true)})
                }
            })

            collector.on("end", async() => {
                await interaction.editReply({components: SelectMenu(true)})
            })
        }
}
