const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DEX", function () {

  let dex
  let token

  before(async () => {
    const Token = await ethers.getContractFactory("ChowToken")
    const DEX = await ethers.getContractFactory("DEX")
    
    token = await Token.deploy()
    await token.deployed()

    dex = await DEX.deploy(token.address)
    await dex.deployed()

    await token.approve(dex.address, ethers.utils.parseEther('100'))
    await dex.init(ethers.utils.parseEther('5'), {value: ethers.utils.parseEther('5')})
  })
  it("Should load ETH and CHOW to DEX", async () => {

    const dexBal = await token.balanceOf(dex.address)
    const dexEth = await ethers.provider.getBalance(dex.address)
    expect(dexBal).to.equal(ethers.utils.parseEther('5', 'ether'))
    expect(dexEth).to.equal(ethers.utils.parseEther('5', 'ether'))

  });

  it("Should swap ETH for Token", async () => {
    const [_, swapper] = await ethers.getSigners()

    const bought = await dex.connect(swapper).ethToToken({value: ethers.utils.parseEther('1')})
    const swapperChow = await token.balanceOf(swapper.address)
    console.log(ethers.utils.formatEther(swapperChow.toString()).toString())
    const swapperEth = await ethers.provider.getBalance(swapper.address)
    console.log(ethers.utils.formatEther(swapperEth.toString()).toString())

  })
});
