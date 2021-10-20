import { getAccount } from "../utils/web3"
import { shortAddress } from "../utils/helpers"
import { useAppContext } from '../context/AppContext'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'



export default function Navbar() {
    const {walletAddress, setWalletAddress, setProvider} = useAppContext()



    async function getProvider() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection)
        setProvider(provider)

        const accounts = await provider.listAccounts()
        const account = accounts[0]
        setWalletAddress(account)
        

    }



    return (
        <nav className="p-5 bg-blue-500 flex justify-between">
            <a href="/"><h1 className="text-4xl logo text-white">CloudSwap</h1></a>
            {
            !walletAddress ?
            <button className="text-xl font-bold text-blue-500 bg-white hover:bg-gray-200 rounded-xl py-2 px-4" onClick={getProvider}>Connect</button>
            :
            <button className="text-xl font-bold text-blue-500 bg-white hover:bg-gray-200 rounded-xl py-2 px-4">{shortAddress(walletAddress)}</button>


            }
        </nav>
    )
}