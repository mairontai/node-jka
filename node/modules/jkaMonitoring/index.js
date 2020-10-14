const getStatusNet = require("./getStatusNet");
const monEmbedBuilder = require("./embedBuilder");

module.exports = ({discord, db}) => {
    discord.on("ready", async () => {

        //initialize commands
        require("./commands/addserver")({discord, db});
        require("./commands/importjson")({discord, db});
        require("./commands/exportjson")({discord, db});
        require("./commands/listservers")({discord, db});
        require("./commands/remserver")({discord, db});

        discord.guilds.cache.map(async guild => {
            setInterval(async () => {
                await readServers({db, guild});
            }, 1000 * 60)
        })
    });

    async function editMessage(message, serverProps) {
        const ip = serverProps.ip.split(":")[0]
        const port = serverProps.ip.split(":")[1]
        getStatusNet(ip, port)
            .then(async status => {
                if (status.split("\n").length > 3) {
                    return monEmbedBuilder.online(
                        message,
                        status,
                        ip,
                        port,
                        serverProps.pass
                    )
                }

                if (status.split("\n").length === 3) {
                    return monEmbedBuilder.onlineShort(
                        message,
                        status,
                        ip,
                        port,
                        serverProps.pass
                    )
                }

                return monEmbedBuilder.offline(message);

            })
            .catch((e) => {
                console.error(`err in call getstatus ${e}`);
            })
    }

    async function readServers({db, guild}) {
        const snapshot = db.collection(`${guild.name}-servers`).get();

        (await snapshot).forEach((doc) => {
            const serverName = doc.id;
            const serverProps = doc.data()
            const channel = guild.channels.resolve(serverProps.textChannelId);

            if (channel == null) {
                return console.error(`something wrong with the text channel!!! (${serverName})`)
            }

            channel.messages.fetch(serverProps.messageId)
                .then(msg => {
                    editMessage(msg, serverProps);
                })
        })
    }
}