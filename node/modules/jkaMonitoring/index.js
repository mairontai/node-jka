const getStatusNet = require("./getStatusNet");
const monEmbedBuilder = require("./embedBuilder");

module.exports = ({discord, db}) => {

    const serversInDb = {};

    discord.on("ready", async () => {

        //initialize commands
        require("./commands/addserver")({discord, db});
        require("./commands/remserver")({discord, db});

        discord.guilds.cache.map(async guild => {
            readServers({db, guild});
        })
    });

    async function editMessage(msg, server) {
        getStatusNet(server.ip, server.port).then(async status => {
            const message = await discord.channels.cache.get(server.textChannelId).messages
                .fetch(server.messageId);

            if (status.split("\n").length > 3) {
                return monEmbedBuilder.online(
                    message,
                    status,
                    server.ip,
                    server.port,
                    server.pass
                )
            }

            if (status.split("\n").length === 3) {
                return monEmbedBuilder.onlineShort(
                    message,
                    status,
                    server.ip,
                    server.port
                )
            }

            return monEmbedBuilder.offline(message);

        })
    }

    async function readServers({db, guild}) {
        const ref = db.database().ref(guild.name);
        const snapshot = await ref.once("value");

        try {
            ref.child("servers")
                .once("value")
                .then(async value => {
                    const obj = value.val();
                    let timerId;

                    for (let prop in obj) {
                        const monitoringChannelId = obj[prop].textChannelId;
                        discord.channels.cache.get(monitoringChannelId).messages.fetch(obj[prop].messageId)
                            .then(msg => {
                                timerId = setTimeout(function tick() {
                                    serversInDb[prop] = {
                                        ip: obj[prop].ip.split(":")[0],
                                        port: obj[prop].ip.split(":")[1],
                                        pass: obj[prop].pass,
                                        messageId: obj[prop].messageId,
                                        textChannelId: obj[prop].textChannelId
                                    };
                                    editMessage(msg, serversInDb[prop]);
                                    timerId = setTimeout(tick, 1000 * 60)
                                }, 1000);
                            })
                            .catch((e) => {
                                clearTimeout(timerId);
                                console.error(e);
                            })
                    }
                })
                .catch(console.error);
        } catch (e) {
            console.log(JSON.stringify(e));
        }
    }
}