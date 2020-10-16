const Discord = require("discord.js");
const winston = require("winston")

const {DISCORD_TOKEN} = process.env.DISCORD_TOKEN;
const {db} = require("../lib/db.js");

const discord = new Discord.Client();

discord.on("ready", () => {
    console.log(`Logged in as ${discord.user.tag}!`);
})

// Init modules
require("./modules/jkaMonitoring")({discord, db});
require("./modules/logger")({discord, db})

require("../utils/winston")

// Start
discord.login(DISCORD_TOKEN)
    .catch((e) => {
        winston.error(`discord login ${e.stack}`)
    });