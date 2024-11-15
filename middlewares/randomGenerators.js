const crypto = require('crypto')

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
class HMACGenerator {
    static calculateHMAC(message, key) {
        const hmac = crypto.createHmac('sha3-256', key);
        hmac.update(message);
        return hmac.digest('hex');
    }
}
class FairRandomProtocol {
    static generateProof(range) {
        const key = SecureRandomGenerator.generateKey();
        const randomValue = SecureRandomGenerator.generateInt(0, range - 1);
        const hmac = HMACGenerator.calculateHMAC(randomValue.toString(), key);
        return { randomValue, key, hmac };
    }
}

module.exports ={
    HMACGenerator,
    SecureRandomGenerator,
    FairRandomProtocol
}