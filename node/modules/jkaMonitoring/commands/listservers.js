const Embed = require("discord.js").MessageEmbed;
const getDiscordId = require("../../../../utils/getDiscordId.js");

const emb = new Embed();

module.exports = function ({discord, db}) {
    discord.on("message", async message => {
        const content = message.content;
        if (content.startsWith("!listservers")) {
            const ref = db.database().ref(message.guild.name);
            const serversList = await ref.child("servers").once("value");

            let messageText = "";
            let counter = 0;

            for (let x in serversList.val()) {
                let channel = discord.channels.cache.get(serversList.val()[x].textChannelId);

                if (channel === undefined) {
                    message.reply(`something wrong with the text channel!!! (${serversList.val()[x].name})`);
                    continue;
                }

                messageText += channel.toString()
                messageText += " : "
                messageText += ++counter;
                messageText += ") ";
                messageText += serversList.val()[x].name;
                messageText += " (`";
                messageText += serversList.val()[x].ip;
                messageText += "`)";
                messageText += "\n";
            }

            emb.setTitle("Servers list");
            emb.setDescription(messageText);

            message.channel.send(emb);
        }
    });
};