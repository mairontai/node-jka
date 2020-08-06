module.exports = function ({discord, db}) {
    discord.on("message", async message => {
        const content = message.content;
        if (content.startsWith("!listservers")) {
            const ref = db.database().ref(message.guild.name);
            const serversList = await ref.child("servers").once("value");

            //let index = 1;
            let messageText = "";

            let counter = 0;
            for (let x in serversList.val()) {
                messageText += ++counter;
                messageText += ") ";
                messageText += serversList.val()[x].name;
                messageText += "\n";
            }
            message.channel.send(messageText);
        }
    });
};