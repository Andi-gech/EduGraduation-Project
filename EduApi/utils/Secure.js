const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
    securePassword,
    comparePassword
};

function securePassword(password) {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}
function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}