
import { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import Pool from './Pool'
import Swap from './Swap'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { TokenAddress, DEXAddress } from '../config'
import CloudToken from '../artifacts/contracts/CloudToken.sol/CloudToken.json'
import DEX from '../artifacts/contracts/DEX.sol/DEX.json'
import Image from 'next/image'
import cloud from '../public/cloud.gif'
import cloud1 from '../public/cloud1.gif'
import {BsX} from 'react-icons/bs'




export default function Exchange() {


    const {swapView, toggleView, walletAddress} = useAppContext()
    const [ethBalance, setEthBalance] = useState(0)
    const [cloudBalance, setCloudBalance] = useState(0)
    const [totalLiquidity, setTotalLiquidity] = useState(0)
    const [show, setShow] = useState()

    useEffect(async () => {
        await getLiquidity()

        console.log(walletAddress)
        if (walletAddress !== '') {
            await getBalances()
        }

        
    }, [walletAddress])

    async function getLiquidity() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.JsonRpcProvider()
        const dex = new ethers.Contract(DEXAddress, DEX.abi, provider)
        let totalLiquidity = await dex.totalLiquidity()
        totalLiquidity = ethers.utils.formatEther(totalLiquidity.toString())
        totalLiquidity = parseFloat(totalLiquidity)
        totalLiquidity = (Math.round(totalLiquidity * 100) / 100).toFixed(2)
        setTotalLiquidity(totalLiquidity)

    }
    async function getBalances() {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.JsonRpcProvider()
 

        let ethBal = await provider.getBalance(walletAddress)
        ethBal = ethers.utils.formatEther(ethBal)
        ethBal = parseFloat(ethBal)
        ethBal = (Math.round(ethBal * 100) / 100).toFixed(2)
        setEthBalance(ethBal)

        const token = new ethers.Contract(TokenAddress, CloudToken.abi, provider)
        let cloudBal = await token.balanceOf(walletAddress)
        cloudBal = ethers.utils.formatEther(cloudBal.toString())
        cloudBal = parseFloat(cloudBal)
        cloudBal = (Math.round(cloudBal * 100) / 100).toFixed(2)
        setCloudBalance(cloudBal)


    }
    

    return (
        <div className="bg-blue-200 flex-1 flex">
            <div className="bg-blue-200 flex flex-col justify-between items-start">
                <div className="ml-4 mt-5 py-1 px-1 bg-white rounded-xl space-x-1 ">
                    {
                        swapView ? 
                        <div>
                            <button className="rounded-xl bg-blue-500 hover:bg-blue-400 text-white w-16 h-8">Swap</button>
                            <button className="rounded-xl text-black hover:text-gray-500 w-16 h-8" onClick={toggleView}>Pool</button>
                        </div>
                        :
                        <div>
                            <button className="rounded-xl text-black hover:text-gray-500 w-16 h-8" onClick={toggleView}>Swap</button>
                            <button className="rounded-xl bg-blue-500 hover:bg-blue-400 text-white w-16 h-8">Pool</button>
                        </div>


                    }
                </div>
                <div style={{width:"300px"}} className="mr-10">
                    <Image src={cloud} width="300px" height="171px" layout="fixed" />
                </div>


            </div>
            {
                swapView ?
                <Swap 
                ethBalance={ethBalance}
                cloudBalance={cloudBalance} getBalances={getBalances} 
                totalLiquidity={totalLiquidity}
                />
                :
                <Pool 
                ethBalance={ethBalance}
                cloudBalance={cloudBalance} getBalances={getBalances} 
                totalLiquidity={totalLiquidity} 
                />

            }

            <div style={{width:"300px"}} className="ml-5" >
                <Image src={cloud1} width="300px" height="171px" layout="fixed" />
            </div>
            <div class="absolute bottom-0 right-0 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-600 p-4 rounded w-1/3">
                <div className="flex justify-between">
                    <p class="font-bold">Wrong Network</p>
                    <button onClick={() => setShow(false)}><BsX size={24}/></button>
                </div>
                <p>Please connect to Rinkeby.</p>
            </div>



        </div>
    )
} 