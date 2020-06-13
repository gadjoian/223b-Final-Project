var HDWalletProvider = require("truffle-hdwallet-provider");
//var mnemonic = "grace noodle vicious observe glass install cup option bless abandon mushroom casino";
var privateKeys = [
  "0x77A675E23F69592D3D11465AAEF8FE42FA7AA1DDB6A159104AB0A6253284B836",
  "0x2a7456ab13929c556cf5c0670c2cda9afe50044021cd0e1cfa40674bfb8948ab",
  "0xf81549451649a29bfb8426fb27e975b6ac38790834203df603ead1b7681e87fb"
]


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      //from: "0x07a1c045c79b3ed85ea262765e0b71994f0e2c7e",
      //gas: 4600000
    },
    develop: {
      port: 8545
    },
    rinkeby: {
      provider: function() { 
       return new HDWalletProvider(privateKeys, "https://rinkeby.infura.io/v3/b2a5a43f39fc407984540ef62717eee9", 0, 3);
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
  }
  },
  mocha: {
    reporter: "mocha-truffle-reporter"
    // timeout: 100000
  },
  compilers: {
    solc: {
      version: "0.6.8",
    },
  }
};
