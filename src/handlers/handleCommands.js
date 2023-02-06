require("dotenv").config()
const fs = require("fs")
const { REST, Routes } = require("discord.js")

const commands = []
module.exports = (client) => {
    const commandFolders = fs.readdirSync("./src/commands")

    commandFolders.forEach(Folder => {
        const commandFiles = fs.readdirSync(`./src/commands/${Folder}/`).filter(file => file.endsWith(".js"))
        
        commandFiles.forEach(commandFile => {
            const command = require(`../commands/${Folder}/${commandFile}`)
            client.commands.set(command.data.name, command)
            commands.push(command.data.toJSON())
        })
    })

    

    const restClient = new REST({version: "9"}).setToken(process.env.token)
    
    restClient.put(Routes.applicationCommands("YourApplicationId"), {
        body: commands})
        .then(() => console.log("Commands registerd"))
        .catch(console.error)
}





