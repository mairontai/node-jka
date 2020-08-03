const messageEmbed = require("discord.js").MessageEmbed;
const embAuthor = require("./embedAuthor");
const embColor = require("./embedColor");
const embFields = require("./embedFields");
const embFooter = require("./embedFooter");
const embTitle = require("./embedTitle");

const emb = new messageEmbed();
const emojiOnline = `:white_check_mark:`;

module.exports.online = (msg, statusNet, HOST, PORT, PASSWORD) => {

    emb.setAuthor(embAuthor(statusNet))
    emb.setTitle(embTitle(HOST, PORT));
    emb.addField("Map", embFields.mapName(statusNet), true);
    emb.addField("GameType", embFields.gameType(statusNet), true);
    emb.addField("FragLimit", embFields.fragLimit(statusNet), true);
    emb.addField("TimeLimit", embFields.timeLimit(statusNet), true);
    emb.addField("Online: ", embFields.players(statusNet), false);
    emb.setColor(embColor(statusNet));
    emb.setFooter(embFooter(HOST, PORT, PASSWORD));
    emb.setTimestamp(Date.now());

    msg.edit(null, {embed: emb})
        .catch((e) => console.error(e));
};

module.exports.onlineShort = (msg, statusNet, HOST, PORT) => {
    let title = emojiOnline + ' **';

    title += embFields.gameType(statusNet) + " | ";
    title += embAuthor(statusNet) + " | ";
    title += HOST + ":" + PORT + '**';

    emb.setTitle(title);
    emb.setColor('#1c5717');

    msg.edit(null, emb);
};

module.exports.offline = (msg) => {

    msg.edit(null, emb);
};