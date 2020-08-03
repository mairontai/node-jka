module.exports = (status) => {
    let r = /\\sv_hostname\\(.+?)\\/gm;
    let m = r.exec(status);
    return m[1].replace(/\^\d/gm, "");
};