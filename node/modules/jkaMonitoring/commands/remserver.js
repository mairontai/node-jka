module.exports = function ({discord, db}) {
    discord.on("message", async message => {
        const content = message.content;
        const args = content.split(/ +/);

        if (args[0] !== "!remserver") return

        const collectionReference = await db.collection(`${message.guild.name}-servers`).doc(args[2])
        const snapshot = await collectionReference.get()
        const snapshotData = snapshot.data();

        if (snapshotData === undefined) {
            return message.reply(`Server not found`)
        }

        await snapshot.ref.delete();
        return message.reply(`**${snapshotData.name}** Removed.`)
    })
}