module.exports = (host, port, password) => {
    let address = host + ":" + port
    switch (password) {
        case "null":
            return `/connect ${address}`
        case "private":
            return `This is a private server`
        default:
            return `/connect ${address};password ${password}`
    }
}