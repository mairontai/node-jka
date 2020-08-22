const Embed = require("discord.js").MessageEmbed;

const emb = new Embed();

module.exports = function ({discord, db}) {
    discord.on("message", async message => {
        const content = message.content;
        const args = content.split(/ +/);
        if (args[0] !== "!listservers") return

        const snapshot = db.collection(`${message.guild.name}-servers`).get();

        let messageText = "";
        let counter = 0;

        (await snapshot).forEach((doc) => {
            const serverName = doc.id;
            const serverProps = doc.data()
            const channel = discord.channels.resolve(serverProps.textChannelId)

            if (channel == null) {
                return message.reply(`something wrong with the text channel!!! (${serverName})`);
            }
            messageText += channel.toString()
            messageText += " : "
            messageText += ++counter
            messageText += ") "
            messageText += serverName
            messageText += " (`"
            messageText += serverProps.ip
            messageText += "`)";
            messageText += "\n";
        })

        if (messageText !== "") {
            emb.setTitle("Servers list");
            emb.setDescription(messageText);
            message.channel.send(emb);
        }
    });
};