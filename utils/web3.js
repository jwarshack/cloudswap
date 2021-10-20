import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import WalletConnectProvider from "@walletconnect/web3-provider"


export async function getAccount() {

    // const web3Modal = new Web3Modal({
    //     providerOptions: {
    //       walletconnect: {
    //         package: WalletConnectProvider,
    //         options: {
    //             infuraId: process.env.RINKEBY_INFURA_ID
    //           }
    //       }
    //     }
    //   });
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection)
    const network = await provider.getNetwork()
    console.log(network)
    const accounts = await provider.listAccounts()
    const account = accounts[0]
    return account

}

export default async function ethBalance(address) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection)
    const balance = await provider.getBalance(address)
    console.log(balance)
    return balance

}

