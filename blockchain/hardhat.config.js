// blockchain/hardhat.config.js

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // A modern, stable version of the Solidity compiler
  networks: {
    // This defines the 'localhost' network you are trying to use
    localhost: {
      url: "http://127.0.0.1:8545", // The standard Hardhat Network RPC URL
    },
  },
};