const crypto = require('crypto');

// const randomHexBuffer = crypto.randomBytes(16);
// const randomHex = randomHexBuffer.toString('hex');
// console.log(randomHexBuffer,randomHex);

class SecureRandomGenerator {
    static generateKey(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    static generateInt(min, max) {
        const range = max - min + 1;
        let randomValue;
        do {
            randomValue = crypto.randomBytes(4).readUInt32BE(0);
        } while (randomValue >= Math.floor(0xFFFFFFFF / range) * range);

        return min + (randomValue % range);
    }
}
console.log(crypto.randomBytes(34).toString('hex'))
