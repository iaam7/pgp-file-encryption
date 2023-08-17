const openpgp = require('openpgp')
const fsp = require("fs/promises");

async function generateKeyPair() {
  const { privateKey, publicKey } = await openpgp.generateKey({
    type: "rsa", // Type of the key
    rsaBits: 4096, // RSA key size (defaults to 4096 bits)
    userIDs: [{ name: "name", email: "name@example.com" }], // you can pass multiple user IDs
    passphrase: "test", // protects the private key
  });
  await fsp.writeFile("./secure_keys/private.key", privateKey);
  await fsp.writeFile("./secure_keys/public.key", publicKey);
  return { privateKey, publicKey };
}

generateKeyPair().then(console.log("success")).catch(console.error);
