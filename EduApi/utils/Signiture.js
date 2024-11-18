const crypto = require("crypto");
const fs = require("fs");

// const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
//     namedCurve: 'sect239k1',
//   });

const privateKey = fs.readFileSync("server/private-key.pem", "utf8");
const publicKey = fs.readFileSync("server/public-key.pem", "utf8");

function signData(data) {
  try {
    const sign = crypto.createSign("SHA256");
    sign.update(data);
    sign.end();
    const signature = sign.sign(privateKey, "hex");

    return signature;
  } catch (error) {
    console.log("Error in sign:", error);
    return null;
  }
}

function verifyData(data, signature) {
  console.log(data, signature);
  try {
    const verify = crypto.createVerify("SHA256");
    verify.update(data);
    verify.end();
    const isVerified = verify.verify(publicKey, signature, "hex");
    console.log("Verification result:", isVerified);
    return isVerified;
  } catch (error) {
    console.log("Error in verify:", error);
    return false;
  }
}

module.exports = {
  signData,
  verifyData,
};
