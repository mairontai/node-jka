const getDiscordId = require("../../../../utils/getDiscordId.js");

module.exports = function ({discord, db}) {
    discord.on("message", async message => {
        const content = message.content;

        const args = content.split(/ +/);

        if (args[0] === "!addserver") {

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

            const messageSend = await message.guild.channels.resolve(textChannel.id)
                .send("WIP");
            const messageId = messageSend.id;

            const collectionReference = db.collection(`${message.guild.name}-servers`).doc(args[3])

            try {
                await collectionReference.set({
                    name: args[3],
                    ip: args[2],
                    pass: args[4],
                    messageId: messageId,
                    textChannelId: textChannel.id
                })
            } catch (e) {
                console.error(e)
            }
        }
    });
};