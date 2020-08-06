const getDiscordId = require("../../../../utils/getDiscordId.js");

module.exports = function ({discord, db}) {
    discord.on("message", async message => {
        const content = message.content;
        if (content.startsWith("!addserver")) {
            const args = content
                .split(/ +/);

            if (args.length < 5) {
                return message.reply(
                    "Usage: `cmd <#textChannel> <serverIp:port> <serverName> <password or null> [serverIndex]`" +
                    "\n `cmd #mon 127.0.0.1:29071 eslhome esl`" +
                    "\n `cmd #membermon 127.0.0.1:29070 eslmain null 1`"
                );
            }

            const textChannel = getDiscordId.getTextChannel(discord, args[1]);
            if (textChannel === undefined) {
                return message.reply("Bad textChannel");
            }

            const ref = db.database().ref(message.guild.name);
            const messageSend = await message.guild.channels.resolve(textChannel.id)
                .send("WIP");
            const messageId = messageSend.id;

            ref.child("servers")
                .once("value")
                .then(value => {
                    let obj = value.val();
                    if (obj === null) {
                        obj = {}
                    }
                    obj[args[3]] = {
                        name: args[3],
                        ip: args[2],
                        pass: args[4],
                        //index: args.length===3? 0 : parseInt(args[3]),
                        messageId: messageId,
                        textChannelId: textChannel.id
                    };
                    ref.child("servers")
                        .set(obj)
                        .catch(console.error);
                })
                .catch(console.error);
        }
    });
};