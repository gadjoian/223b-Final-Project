var Adoption = artifacts.require("Adoption");
var ArtCoinFactory = artifacts.require("ArtCoinFactory");

module.exports = function(deployer) {
  deployer.deploy(ArtCoinFactory);
};