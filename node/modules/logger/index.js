module.exports = ({discord, db}) => {
    discord.on('ready', async () => {
        require("./messageLogger")({discord, db})
    })
}