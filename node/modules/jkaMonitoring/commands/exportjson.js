module.exports = ({discord, db}) => {
    discord.on("message", async message => {
        const content = message.content;
        const args = content.split(/ +/);

        if (args[0] !== "!exportjson") return

        const collectionReference = await db.collection(`${message.guild.name}-servers`)
        const snapshot = await collectionReference.get();
        let servers = {};

        (await snapshot).forEach((doc) => {
            const serverName = doc.id
            servers[serverName] = doc.data()
        })

        message.channel.send("```json\n" + JSON.stringify(servers, null, "\t") + "\n```")
    })
}