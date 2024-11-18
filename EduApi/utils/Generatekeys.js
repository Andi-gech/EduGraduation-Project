const crypto = require("crypto");
const fs = require("fs");
const createkeys = () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
      });
    
      // Convert keys to PEM format
      const privateKeyPEM = privateKey.export({ type: "pkcs1", format: "pem" });
      const publicKeyPEM = publicKey.export({ type: "pkcs1", format: "pem" });
    
      // Save keys to files
      fs.writeFileSync("../server/private-key.pem", privateKeyPEM);
      fs.writeFileSync("../server/public-key.pem", publicKeyPEM);
}

createkeys()