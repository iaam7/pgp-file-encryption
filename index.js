const fsp = require("fs/promises");
const openpgp = require("openpgp");

async function encryptFile() {
  const publicKeyArmored = await fsp.readFile(
    "./secure_keys/public.key",
    "utf8"
  );
  const fileData =await fsp.readFile("file.txt");
  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

  const encrypted = await openpgp.encrypt({
    message: await openpgp.createMessage({ binary: fileData }),
    encryptionKeys: publicKey,
    format: "binary",
  });

  await fsp.writeFile("file.txt.pgp", encrypted);
  console.log("File encrypted successfully.");
}

async function decryptFile() {
  const privateKeyArmored = await fsp.readFile(
    "./secure_keys/private.key",
    "utf8"
  );
  const encryptedData =await fsp.readFile("file.txt.pgp");

  const privateKey = await openpgp.decryptKey({
    privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
    passphrase: "test",
  });

  const decrypted = await openpgp.decrypt({
    message: await openpgp.readMessage({ binaryMessage: encryptedData }),
    decryptionKeys: privateKey,
  });

  await fsp.writeFile("file-decrypted.txt", decrypted.data);
  console.log("File decrypted successfully.");
}

(async () => {
  await encryptFile();
  console.log('Message encrypted:');

  await decryptFile().catch(console.error);
  console.log('Message decrypted:');
})();
