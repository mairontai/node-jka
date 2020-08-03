module.exports.mapName = (status) => {
    let r = /\\mapname\\(.+?)\\/gm;
    let m = r.exec(status);
    return m[1].replace(/\^\d/gm, "");
};

module.exports.gameType = (status) => {
    let r = /\\g_gametype\\(.+?)\\/gm;
    let m = r.exec(status);
    switch (m[1]) {
        case "0":
            return "FFA";
        case "3":
            return "DUEL";
        case "6":
            return "TFFA";
        case "4":
            return "POWER DUEL";
        case "7":
            return "SIEGE";
        case "8":
            return "CTF";
    }
};

module.exports.fragLimit = (status) => {
    let r = /\\fraglimit\\(.+?)\\/gm;
    let m = r.exec(status);
    return m[1].replace(/\^\d/gm, "");
};

module.exports.timeLimit = (status) => {
    let r = /\\timelimit\\(.+?)\\/gm;
    let m = r.exec(status);
    return m[1].replace(/\^\d/gm, "");
};

module.exports.players = (status) => {
    let players = "";
    let indexPlayer = 1;
    let statusNet = status.split("\n");

    //offline server (?)
    if (statusNet < 3) return;

    for (let i = 2; i < statusNet.length - 1; i++) {
        let split = statusNet[i].split(/\d\s"/m);
        try {
            if (split[1].includes("*")) {
                split[1] = split[1].replace("*", "\\*");
            }
            if (split[1].includes("_")) {
                split[1] = split[1].replace("_", "\\_");
            }
            if (split[1].includes("\"")) {
                split[1] = split[1].replace("\"", "");
            }
            if (split[1].includes("|")) {
                split[1] = split[1].replace("|", "\\|");
            }
            players += indexPlayer;
            players += ") ";
            players += split[1];
            players += " (score: ";
            players += statusNet[i].split(new RegExp("\\s+"))[0];
            players += ", ping: ";
            players += statusNet[i].split(new RegExp("\\s+"))[1];
            players += ") ";
            players += "\n";
            indexPlayer++;
        } catch (e) {
            console.log(e);
        }
    }

    //empty server
    if (statusNet.length === 3) return "-";
    return players.replace(/\^\d/gm, "");
};