const MessageEmbed = require('discord.js').MessageEmbed

module.exports = ({discord, db}) => {

    discord.on('ready', async () => {
        discord.guilds.cache.map(async (guild) => {
            const snapshot = await db.collection(`${guild.name}-messages`).get()
            snapshot.forEach((doc) => {
                doc.ref.delete()
            })
        })
    })

    discord.on("message", async message => {
        if (message.author.bot) {
            return
        }
        if (message.channel.type !== 'text') {
            return
        }
        if (message.guild === null) {
            return
        }

        try {
            const collectionReference = db.collection(`${message.guild.name}-messages`)
                .doc(message.id)

            await collectionReference.set({
                memberName: message.member.displayName,
                memberId: message.author.id,
                messageId: message.id,
                userTag: message.author.tag,
                text: message.content,
                textChannelId: message.channel.id,
                timestamp: message.createdAt
            })

        } catch (e) {
            console.error(e)
        }
    })

    discord.on('messageUpdate', async (oldMessage, newMessage) => {
        if (oldMessage.author.bot || newMessage.author.bot) {
            return;
        }
        if (oldMessage.channel.type !== 'text' || newMessage.channel.type !== 'text') {
            return;
        }
        if (oldMessage.guild === null || newMessage.guild === null) {
            return;
        }

        let logChannelId;

        try {
            const collectionReference = db.collection(`${oldMessage.guild.name}-messages`)
                .doc(oldMessage.id);

            await collectionReference.set({
                memberName: oldMessage.member.displayName,
                memberId: oldMessage.author.id,
                messageId: oldMessage.id,
                userTag: oldMessage.author.tag,
                text: newMessage.content,
                textChannelId: oldMessage.channel.id,
                timestamp: oldMessage.createdTimestamp
            })

            const guildSettingsCollectionReference = db.collection(`${oldMessage.guild.name}-settings`)
                .doc('settings')
            const documentSnapshot = await guildSettingsCollectionReference.get();
            logChannelId = documentSnapshot.get("logTextChannelId")
        } catch (e) {
            console.error(e)
        }

        const logChannel = await oldMessage.guild.channels.cache.get(logChannelId);
        const member = await oldMessage.guild.members.cache.get(oldMessage.author.id);

        const emb = new MessageEmbed();
        emb.setColor('#0099ff');
        emb.setTitle('Edited message')
        emb.setAuthor(member.displayName, member.user.avatarURL());
        emb.addField("Channel", oldMessage.channel.toString())
        emb.addField("Old Content", oldMessage.content);
        emb.addField("New Content", newMessage.content);
        await logChannel.send(emb)
    })

    discord.on('messageDelete', async (message) => {
        if (message.author.bot) {
            return
        }
        if (message.channel.type !== 'text') {
            return
        }
        if (message.guild === null) {
            return
        }

        let logChannelId

        try {
            const guildSettingsCollectionReference = db.collection(`${message.guild.name}-settings`)
                .doc('settings')
            const documentSnapshot = await guildSettingsCollectionReference.get();
            logChannelId = documentSnapshot.get("logTextChannelId")

            const collectionReference = db.collection(`${message.guild.name}-messages`)
                .doc(message.id);

            const snapshot = await collectionReference.get()
            const snapshotData = snapshot.data()

            if (snapshotData === undefined) return

            const logChannel = await message.guild.channels.cache.get(logChannelId)
            const member = await message.guild.members.cache.get(message.author.id)
            const channel = await message.guild.channels.cache.get(snapshotData.textChannelId)

            const emb = new MessageEmbed()
            emb.setColor('#0099ff')
            emb.setTitle("Removed message")
            emb.addField("Channel", channel.toString())
            emb.addField("Content", snapshotData.text)
            emb.setAuthor(member.displayName, member.user.avatarURL())
            await logChannel.send(emb)
        } catch (e) {
            console.error(e)
        }
    })
}