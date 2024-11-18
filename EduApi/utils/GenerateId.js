const crypto = require('crypto');
const GenerateId = () => {
    return crypto.randomBytes(20).toString('hex');
}