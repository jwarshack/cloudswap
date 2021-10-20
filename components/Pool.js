import { useEffect, useState } from "react"
import { DEXAddress, TokenAddress } from '../config'
import DEXContract from '../artifacts/contracts/DEX.sol/DEX.json'
import TokenContract from '../artifacts/contracts/CloudToken.sol/CloudToken.json'
import Web3Modal from 'web3modal'
import { ethers } from "ethers"
import { useAppContext } from "../context/AppContext"

export default function Pool(props) {

    const {walletAddress, provider} = useAppContext()

    const [amount, setAmount] = useState(0)
    const [reload, setReload] = useState(false)

    useEffect(async () => {
        await getMyLiquidity()

    }, [reload])

    async function deposit() {
        if (provider) {
            if (amount&&parseFloat(amount) > 0) { 
                try {
                    const signer = provider.getSigner()
                    const dex = new ethers.Contract(DEXAddress, DEXContract.abi, signer)
                    const token = new ethers.Contract(TokenAddress, TokenContract.abi, signer)
                    const val = ethers.utils.parseEther(amount, 'ether')
                    await token.approve(DEXAddress, val.toString())
                    await dex.deposit({value: val})
                    setReload(true)
                } catch(e) {
                    console.log(e)
                }
            }    
        }
    }

    async function getMyLiquidity() {
        if(provider) {
            const signer = provider.getSigner()
            const dex = new ethers.Contract(DEXAddress, DEXContract.abi, signer)
            let liquidity = await dex.liquidity(walletAddress)
            console.log(liquidity)
        }
        
    }

    async function withdraw() {
        if (provider) {
            if (amount&&parseFloat(amount) > 0) { 
                try {
                    const signer = provider.getSigner()
                    const dex = new ethers.Contract(DEXAddress, DEXContract.abi, signer)
                    const val = ethers.utils.parseEther(amount, 'ether')
                    await dex.withdraw(val)
                    setReload(true)
                } catch(e) {
                    console.log(e)
                }
            }    
        }
    }

    return (
    <div className="flex flex-col rounded-3xl shadow-xl bg-white p-4 my-auto self-start mx-auto">
        <div className="mb-2 flex justify-between items-center">
            <p className="text-md">Pool</p>
            <p className="text-gray-400 text-sm">My Liquidity: {props.totalLiquidity}</p>
        </div>
        <div className="flex flex-col space-y-4 relative">
            <div className="relative">
                <div className="flex justify-between border rounded-xl p-3 overflow-hidden">
                    <div className="flex flex-col items-start">
                        <div className="bg-blue-500 rounded-xl py-2 px-4">
                            <p className="text-sm text-center font-bold text-white">ETH</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Balance: {props.ethBalance}</p>
                    </div>
                    <input
                    dir="rtl"
                    placeholder="0.0"
                    className="outline-none placeholder-gray-400"
                    onChange={e => setAmount(e.target.value)}
                    />
                </div>
                <div className="flex justify-between border rounded-xl p-3 overflow-hidden">
                    <div className="flex flex-col items-start">
                        <div className="bg-blue-500 rounded-xl py-2 px-4">
                            <p className="text-sm text-center font-bold text-white">CLOUD</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Balance: {props.cloudBalance}</p>
                    </div>
                    <input
                    dir="rtl"
                    className="outline-none"
                    placeholder="0.0"


                    />
                </div>

            </div>

            <div className="flex justify-center space-x-4">
                <button className="bg-blue-500 hover:bg-blue-400 text-white py-2 flex-1 rounded-xl" onClick={() => deposit()}>Deposit</button>
                <button className="bg-gray-400 hover:bg-gray-300 text-white py-2 flex-1 rounded-xl" onClick={() => withdraw()}>Withdraw</button>
            </div>
            
        </div>
    </div>
    )
}