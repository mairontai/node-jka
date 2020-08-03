const Discord = require("discord.js");

const {DISCORD_TOKEN} = process.env.DISCORD_TOKEN;
const {db} = require("../lib/Db.js");

const discord = new Discord.Client();

discord.on("ready", () => {
    console.log(`Logged in as ${discord.user.tag}!`);
})

// Init modules

require("./modules/jkaMonitoring")({discord, db});

// Start
discord.login(DISCORD_TOKEN);