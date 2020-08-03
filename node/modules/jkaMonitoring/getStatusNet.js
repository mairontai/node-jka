const dgram = require('dgram');

const TIMEOUT = 5;

module.exports = async (HOST, PORT) => {
    async function getStatusNet() {
        const promise = new Promise((resolve, reject) => {
            const packet = new Buffer.from("\xFF\xFF\xFF\xFFgetstatus", "latin1");
            const socket = dgram.createSocket('udp4');

            socket.send(packet, 0, packet.length, PORT, HOST);

            socket.on('message', (msg, rinfo) => {
                resolve(msg.toString());
            })
        });
        return await promise;
    }

    async function getStatusNetTimeout() {
        const promise = new Promise(function (resolve, reject) {
            setTimeout(reject, 1000 * TIMEOUT);
        });
        return await promise;
    }

    return await Promise.race([getStatusNet(), getStatusNetTimeout()]);
}