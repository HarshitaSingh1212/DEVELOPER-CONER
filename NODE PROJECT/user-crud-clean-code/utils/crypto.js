const crypto = require('node:crypto')

async function createHash(data){
    const hashAlgo = crypto.createHash('sha256')
    hashAlgo.update(data);
    const hash = hashAlgo.digest('hex');

    return hash;
}

async function verifyHash({ data, hash }){
    const dataHash = await createHash(data)
    return hash === dataHash
}

module.exports = {
    createHash, verifyHash
}