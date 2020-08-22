module.exports = function ({discord, db}) {
    discord.on("message", async message => {
        const content = message.content;

        if (!(content.startsWith("!importjson") && content.includes("```json"))) return;

        const json = JSON.parse(content
            .slice("!importjson".length)
            .replace("```json\n", "")
            .replace("\n```", ""));

        for (let i = 0; i < Object.keys(json).length; i++) {
            const key = Object.keys(json)[i]
            const serverProps = json[key];
            const server = {}

            const textChannel = discord.channels.resolve(serverProps.textChannelId)
            if (textChannel === undefined) {
                return message.reply(`Bad textChannel ${serverProps.name}`);
            }

            const messageSend = await message.guild.channels.resolve(textChannel.id)
                .send("WIP");
            const messageId = messageSend.id;

            server[serverProps.name] = {
                name: serverProps.name,
                ip: serverProps.ip,
                pass: serverProps.pass,
                messageId: messageId,
                textChannelId: textChannel.id
            }

            const collectionReference = await db.collection(`${message.guild.name}-servers`).doc(serverProps.name)
            await collectionReference.set(server[serverProps.name]);
        }
    })
}