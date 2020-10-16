const messageEmbed = require("discord.js").MessageEmbed;
const embAuthor = require("./embedAuthor");
const embColor = require("./embedColor");
const embFields = require("./embedFields");
const embFooter = require("./embedFooter");
const embTitle = require("./embedTitle")
const mapUrlMap = require("./mapIconUrlMap")

const emojiOnline = `:white_check_mark:`;

module.exports.online = (msg, statusNet, HOST, PORT, PASSWORD) => {
    const emb = new messageEmbed();

    emb.setAuthor(embAuthor(statusNet), "http://icons.iconarchive.com/icons/3xhumed/mega-games-pack-18/256/StarWars-Jedi-Knight-Academy-2-icon.png")
    emb.setTitle(embTitle(HOST, PORT));
    emb.addField("Map", embFields.mapName(statusNet), true);
    emb.addField("GameType", embFields.gameType(statusNet), true);
    emb.addField("FragLimit", embFields.fragLimit(statusNet), true);
    emb.addField("TimeLimit", embFields.timeLimit(statusNet), true);
    emb.addField("Online: ", embFields.players(statusNet), false);
    emb.setColor(embColor(statusNet));
    emb.setFooter(embFooter(HOST, PORT, PASSWORD));
    emb.setTimestamp(Date.now())
    emb.setThumbnail(mapUrlMap[embFields.mapName(statusNet)] || "http://icons.iconarchive.com/icons/3xhumed/mega-games-pack-18/256/StarWars-Jedi-Knight-Academy-2-icon.png")

    msg.edit(null, emb)
        .catch((e) => {
            winston.error(e);
        });
};

module.exports.onlineShort = (msg, statusNet, HOST, PORT, PASSWORD) => {
    const emb = new messageEmbed();

    let title = `${emojiOnline} **`

    const greenDotEmoji = msg.client.emojis.cache.find(emoji => emoji.name === 'greendot')
    if (greenDotEmoji !== undefined) {
        title = `${greenDotEmoji} **`
    }

    title += embFields.gameType(statusNet) + " | "
    title += embAuthor(statusNet)
    title += "**"

    emb.setTitle(title);
    emb.setFooter(`/connect ${HOST}:${PORT};password ${PASSWORD}`)
    emb.setColor('#1c5717');

    msg.edit(null, emb)
        .catch((e) => {
            winston.error(e);
        });
};

module.exports.offline = (msg) => {
    const emb = new messageEmbed();

    msg.edit(null, emb)
        .catch((e) => {
            winston.error(e);
        });
};