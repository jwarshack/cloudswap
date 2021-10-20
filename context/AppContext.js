import { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers'
import Web3Modal, { providers } from 'web3modal'

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [swapView, setSwapView] = useState(true)
  const [walletAddress, setWalletAddress] = useState('')
  const [provider, setProvider] = useState(undefined)

  function toggleView() {
    setSwapView(!swapView)
  }
 

  const state = {
    swapView,
    toggleView,
    walletAddress,
    setWalletAddress,
    provider,
    setProvider
  }


  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}