const crypto = require('crypto');

const message = '0';
const secretKey = '48e93b6f80e011ee6762313fd575a93848851806ce9daf59ad6bcc2aa5156e3c';

const hmac = crypto.createHmac('sha3-256', secretKey);
hmac.update(message);
const hash = hmac.digest('hex');

console.log(hash);