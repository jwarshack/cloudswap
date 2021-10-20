// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CloudToken.sol";
import "hardhat/console.sol";


contract DEX {
    // Total ETH of the contract
    uint256 public totalLiquidity;

    mapping(address => uint256) public liquidity;

    CloudToken token;

    constructor(address tokenAddr) {
        token = CloudToken(tokenAddr);
    }

    // Loads contract with both ETH and Chow
    function init(uint256 tokens) public payable returns(uint256) {
        // Requires that there is no liquidity
        require(totalLiquidity == 0, "DEX:init - already has liquidity");
        // assigns totalLiquidity to the balance of the contract
        totalLiquidity = address(this).balance;
        // assigns user liquidity to the liquidity that has been inputed
        liquidity[msg.sender] = totalLiquidity;
        // transfer's Chow from sender to token address
        require(token.transferFrom(msg.sender, address(this), tokens));
        return totalLiquidity;
    }

    function price(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) public pure returns(uint256) {
        // 0.3% fee attached
        uint256 inputAmountWithFee = inputAmount * 997;
        uint256 numerator = inputAmountWithFee * outputReserve;
        uint256 denominator = inputReserve * 1000 + inputAmountWithFee;
        return numerator / denominator;
    }

    function ethToToken() public payable returns(uint256) {
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 tokensBought = price(msg.value, address(this).balance - msg.value, tokenReserve);
        require(token.transfer(msg.sender, tokensBought));
        return tokensBought;
    }

    function tokenToEth(uint256 tokens) public returns(uint256) {
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 ethBought = price(tokens, tokenReserve, address(this).balance);
        payable(msg.sender).transfer(ethBought);
        require(token.transferFrom(msg.sender, address(this), tokens));
        return ethBought;
    }

    function deposit() public payable returns (uint256) {
        uint256 ethReserve = address(this).balance - msg.value;
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 tokenAmount = (msg.value*tokenReserve/ethReserve)+1;
        uint256 liquidityMinted = msg.value*totalLiquidity/ethReserve;
        liquidity[msg.sender] = liquidity[msg.sender]+liquidityMinted;
        totalLiquidity = totalLiquidity+liquidityMinted;
        require(token.transferFrom(msg.sender, address(this), tokenAmount));
        return liquidityMinted;
    }

    function withdraw(uint256 amount) public returns(uint256, uint256) {
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 ethAmount = amount*address(this).balance/totalLiquidity;
        uint256 tokenAmount = amount*tokenReserve/totalLiquidity;
        console.log(tokenAmount);
        liquidity[msg.sender] = liquidity[msg.sender]-ethAmount;
        totalLiquidity = totalLiquidity-ethAmount;
        payable(msg.sender).transfer(ethAmount);
        require(token.transfer(msg.sender, tokenAmount));
        return (ethAmount, tokenAmount);
    }

    function getCloudPrice(uint256 amount) public view returns(uint256) {
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 ethReserve = address(this).balance;
        return price(amount, ethReserve, tokenReserve);

    }

    function getEthPrice(uint256 amount) public view returns(uint256) {
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 ethReserve = address(this).balance;
        return price(amount, tokenReserve, ethReserve);
    }
}