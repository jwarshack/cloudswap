
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory("CloudToken")
  const token = await Token.deploy()
  await token.deployed()

  console.log("CloudToken deployed at: ", token.address)

  const DEX = await hre.ethers.getContractFactory("DEX")
  const dex = await DEX.deploy(token.address)
  await dex.deployed()

  console.log("CloudSwap deployed at: ", dex.address)

  await token.approve(dex.address, ethers.utils.parseEther('100'))
  await dex.init(ethers.utils.parseEther('100'), {value: ethers.utils.parseEther('100')})



}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
