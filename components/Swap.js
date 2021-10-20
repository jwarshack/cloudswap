import {BsArrowDown} from 'react-icons/bs'
import Web3Modal, { providers } from 'web3modal'
import { ethers } from 'ethers'
import {BsX} from 'react-icons/bs'
import { useAppContext } from '../context/AppContext'


import { DEXAddress, TokenAddress } from '../config'
import DEXContract from '../artifacts/contracts/DEX.sol/DEX.json'
import { useEffect, useRef, useState } from 'react'

export default function Swap( props) {
    const {provider} = useAppContext()


    const [ethIn, setEthIn] = useState('0')
    const [ethOut, setEthOut] = useState('0')
    const [cloudIn, setCloudIn] = useState('0')
    const [cloudOut, setCloudOut] = useState('0')
    const [reload, setReload] = useState(false)

    const ethInRef = useRef()
    const cloudInRef = useRef()

    const [show, setShow] = useState(false)

    useEffect(async () => {

        await getCloudPrice()
    }, [ethIn])
    useEffect(async () => {

        await getEthPrice()
    }, [cloudIn])

    useEffect(async () => {
        
    }, [reload])


    async function swap() {
        if(provider) {
            if (ethIn&&parseFloat(ethIn) > 0) { 
                try {
                    const signer = await provider.getSigner()
                    const dex = new ethers.Contract(DEXAddress, DEXContract.abi, signer)
                    const val = ethers.utils.parseEther(ethIn, 'ether')
                    await dex.ethToToken({value: val})
                    setReload(true)
                } catch(e) {
                    console.log(e)
                }
            } else {
                setShow(true)
            }
        }
    }

    async function getCloudPrice() {
        if(ethIn) {
            const jsonProvider = new ethers.providers.JsonRpcProvider()
            const dex = new ethers.Contract(DEXAddress, DEXContract.abi, jsonProvider)
            const val = ethers.utils.parseEther(ethIn, 'ether')
            console.log(ethIn)
            let price = await dex.getCloudPrice(val.toString())
            price = ethers.utils.formatEther(price)
            price = (Math.round(price * 100) / 100).toFixed(2)
            console.log(price)

            setEthOut(price.toString())
            cloudInRef.current.value = ''
        } else {
            cloudInRef.current.placeholder = '0.00'
            ethInRef.current.placeholder = '0.00'

        }
    }
    async function getEthPrice() {
        if(cloudIn) {
            const jsonProvider = new ethers.providers.JsonRpcProvider()
            const dex = new ethers.Contract(DEXAddress, DEXContract.abi, jsonProvider)
            const val = ethers.utils.parseEther(cloudIn, 'ether')
            let price = await dex.getEthPrice(val.toString())
            price = ethers.utils.formatEther(price)
            price = (Math.round(price * 100) / 100).toFixed(2)

            setCloudOut(price.toString())
            ethInRef.current.value = ''
        } else {
            cloudInRef.current.placeholder = '0.00'
            ethInRef.current.placeholder = '0.00'

        }


    }


    return (
    <div className="flex flex-col rounded-3xl shadow-xl bg-white p-4 my-auto self-start mx-auto">
        <div className="mb-2 flex justify-between items-center">
            <p className="text-md">Swap</p>
            <p className="text-gray-400 text-sm">Total Liquidity: {props.totalLiquidity}</p>
        </div>
        <div className="flex flex-col space-y-4 relative">
            <div className="relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center flex justify-center">
                    <div className="border rounded-3xl p-2 overflow-hidden"><BsArrowDown size={15}/></div>

                </div>

                <div className="flex justify-between border rounded-xl p-3 overflow-hidden">
                    <div className="flex flex-col items-start">
                        <div className="bg-blue-500 rounded-xl py-2 px-4">
                            <p className="text-sm text-center font-bold text-white">ETH</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Balance: {props.ethBalance}</p>
                    </div>
                    <input
                    dir="rtl"
                    placeholder={cloudOut}
                    className="outline-none placeholder-gray-400"
                    ref={ethInRef}
                    type="number"
                    onChange={e => {
                        setEthIn(e.target.value.toString())
                        console.log("hello")
                        }
                    }
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
                    type="number"
                    className="outline-none"
                    ref={cloudInRef}
                    placeholder={ethOut}
                    onChange={e => setCloudIn(e.target.value.toString())}

                    />
                </div>
            </div>
            {
                show && 
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg flex items-center justify-between">
                    <p className="text-sm">Please enter an amount greater than 0.</p>
                    <button onClick={() => setShow(false)}><BsX size={20}/></button>
                </div> 
            }
           
            <button className="bg-blue-500 hover:bg-blue-400 text-white py-2 rounded-xl" onClick={() => swap()}>Swap</button>
        </div>
    </div>
    )
}