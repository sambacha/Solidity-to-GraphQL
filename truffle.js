require("dotenv").config();
const PrivateKeyProvider = require("@truffle/hdwallet-provider");
const privateKey = "0x73c3a87bbf749eafb19f97fffb8cebc3393417461a8819762ea3e9e7ba28437a";
const privateKeyProvider = new PrivateKeyProvider(privateKey, "http://localhost:8545");
const fs = require('fs');
 
// provider: () => new HDWalletProvider(
module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // for more about customizing your Truffle configuration!
    networks: {
        besu: {
            provider: privateKeyProvider,
            network_id: "*"
 
        },
        compilers: {
            solc: {
                version: '0.5.16'  // ex:  "0.4.20". (Default: Truffle's installed solc)
 
            }
 
        }
 
    }
 
};