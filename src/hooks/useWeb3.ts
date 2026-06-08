import { BrowserProvider, type Eip1193Provider } from 'ethers'
import { useCallback, useEffect, useMemo, useState } from 'react'

type EthereumProvider = Eip1193Provider & {
  on?: (event: 'accountsChanged', handler: (accounts: string[]) => void) => void
  removeListener?: (
    event: 'accountsChanged',
    handler: (accounts: string[]) => void,
  ) => void
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

export function useWeb3() {
  const [address, setAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const isAvailable = useMemo(
    () => typeof window !== 'undefined' && !!window.ethereum,
    [],
  )

  const connect = useCallback(async () => {
    setError(null)

    if (!window?.ethereum) {
      setError('MetaMask not detected. Install it to continue.')
      return
    }

    setIsConnecting(true)

    try {
      const provider = new BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const nextAddress = await signer.getAddress()
      setAddress(nextAddress)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect wallet.'
      setError(message)
    } finally {
      setIsConnecting(false)
    }
  }, [])

  useEffect(() => {
    if (!window?.ethereum) {
      return
    }

    const provider = new BrowserProvider(window.ethereum)
    const syncAccounts = async () => {
      const accounts = (await provider.send('eth_accounts', [])) as string[]
      setAddress(accounts[0] ?? null)
    }

    syncAccounts().catch((err) => {
      const message =
        err instanceof Error ? err.message : 'Failed to load wallet state.'
      setError(message)
    })

    const handleAccountsChanged = (accounts: string[]) => {
      setAddress(accounts[0] ?? null)
    }

    window.ethereum.on?.('accountsChanged', handleAccountsChanged)

    return () => {
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged)
    }
  }, [])

  return {
    address,
    isConnected: Boolean(address),
    isConnecting,
    isAvailable,
    error,
    connect,
  }
}
