module.exports = (status) => {
    const statusNet = status.split("\n");
    if (statusNet.length === 3) {
        return '#1c5717'
    }
    if (statusNet.length > 3) {
        return '#20e310'
    }
};