module.exports = function ({discord, db}) {
    discord.on("message", async message => {
        const content = message.content;

        if (!content.startsWith("!remserver")) return;

        const args = content
            .slice(content.split(/ +/)[0].length + 1)
            .split(/ +/);

        if (args.length !== 2) {
            return message.reply("Usage: !remserver #textChannel serverName");
        }

        const ref = db.database().ref(message.guild.name);
        const textChannel = await message.guild.channels.resolve(args[0].replace(/\D/g, ''));

        ref.child("servers").once("value")
            .then(value => {
                let obj = value.val();
                if (obj === null) return message.reply("answer database is null");
                let monMessage = textChannel.messages.cache.get(obj[args[1]].messageId);
                delete obj[args[1]];
                monMessage.delete();

                ref.set(obj)
                    .then(() => message.channel.send("Removed."))
                    .catch((err) => {
                        console.error(err);
                        message.channel.send(JSON.stringify(err))
                    });
            })
            .catch((err) => {
                console.error(err);
                message.channel.send(JSON.stringify(err))
            });
    })
}