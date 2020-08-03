module.exports = (host, port, password) => {
    let address = host + ":" + port;
    switch (password) {
        case "null":
            return `To connect, type in console: "/connect ${address}"`;
        case "private":
            return `This is a private server`;
        default:
            return `To connect, type in console: "/connect ${address};password ${password}"`;
    }
};