const { verifyData } = require("./Signiture");
const { decrypt } = require("./Crypto");
const verifyDigitalId = (qrurl) => {
console.log("verifying digital id");
    const data = qrurl.split(":");
    
  
    if (data.length !== 3) {
      throw new Error("Invalid QR format.");
    }
  
  
    const encrypted = `${data[0]}:${data[1]}`;
    const signed = data[2];
  
  
    const studentid = decrypt(encrypted);
    if (!studentid) {
      throw new Error("Decryption failed.");
    }
  

    const verified = verifyData(encrypted, signed);
    if (!verified) {
      throw new Error("Invalid QR code signature.");
    }
  
    return studentid;
  };

module.exports = { verifyDigitalId };