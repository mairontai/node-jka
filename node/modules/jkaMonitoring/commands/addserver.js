module.exports = function ({discord, db}) {
    discord.on("message", async message => {
        const content = message.content;
        if (content.startsWith("!addserver")) {
            const args = content
                .slice(content.split(/ +/)[0].length + 1)
                .split(/ +/);

            if (args.length === 1) {
                return message.reply(
                    "Usage: `!addserver #textChannel serverName serverAddress serverPassword`"
                );
            }

            if (args.length < 3 || args.length > 4) {
                return message.reply("arguments err!");
            }

            /*const ipPortRegex = /^([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3}):\d{5}$/gm;

            if (!args[1].match(ipPortRegex)) {
                return message.reply("Something wrong in **serverAddress**");
            }*/

            /*if (args.length === 4) {
                if (!args[3].match(/\d+/gm)) {
                    return message.reply("Something wrong in **serverIndex**");
                }
            }*/

            const ref = db.database().ref(message.guild.name);
            const textChannel = await message.guild.channels.resolve(args[0].replace(/\D/g, ''));
            const textChannelId = textChannel.id;
            const messageSend = await message.guild.channels.resolve(textChannelId)
                .send("WIP");
            const messageId = messageSend.id;

            ref.child("servers")
                .once("value")
                .then(value => {
                    let obj = value.val();
                    if (obj === null) {
                        obj = {}
                    }
                    obj[args[1]] = {
                        name: args[1],
                        ip: args[2],
                        pass: args[3],
                        //index: args.length===3? 0 : parseInt(args[3]),
                        messageId: messageId,
                        textChannelId: textChannelId
                    };
                    ref.child("servers")
                        .set(obj)
                        .catch(console.error);
                })
                .catch(console.error);
        }
    });
};