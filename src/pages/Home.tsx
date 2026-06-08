import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Divider
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { BrowserProvider, Contract, parseEther, formatEther } from 'ethers'
import { PageLayout } from '../components/PageLayout'
import { StatusIndicator } from '../components/StatusIndicator'
import { useWeb3 } from '../hooks/useWeb3'
import { CONTRACTS } from '../contracts'

const highlights = [
  { title: 'Non-custodial access', description: 'Connect your wallet instantly and keep full control of funds.' },
  { title: 'Greenline execution', description: 'Optimized UX for fast DeFi actions and liquidity flows.' },
  { title: 'Live on-chain metrics', description: 'Real-time syncing of creator revenue and dividend pools.' },
]

const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`

export function Home() {
  const { address, isConnected, isConnecting, connect, error, isAvailable } = useWeb3()
  
  // Transaction State
  const [isTransacting, setIsTransacting] = useState(false)
  const [txStatus, setTxStatus] = useState<string>('')

  // NEW: Dashboard State
  const [creatorBalance, setCreatorBalance] = useState<string>('0.0')
  const [poolBalance, setPoolBalance] = useState<string>('0.0')
  const [isFetchingStats, setIsFetchingStats] = useState(false)

  // NEW: Function to Read Blockchain Data
  const fetchContractStats = async () => {
    if (!window.ethereum) return
    try {
      setIsFetchingStats(true)
      const provider = new BrowserProvider(window.ethereum)
      
      // For reading data, we only need the Provider, not the Signer
      const routerContract = new Contract(
        CONTRACTS.RevenueRouter.address,
        CONTRACTS.RevenueRouter.abi,
        provider
      )

      // 1. Get the 20% dividend pool stored inside the contract
      const poolWei = await routerContract.totalDividendPool()
      
      // 2. Find out who the creator is, then ask the blockchain for their wallet balance
      const creatorAddress = await routerContract.creatorAddress()
      const creatorWei = await provider.getBalance(creatorAddress)

      // formatEther converts raw BigInt Wei back into human-readable ETH
      setPoolBalance(formatEther(poolWei))
      setCreatorBalance(formatEther(creatorWei))

    } catch (err) {
      console.error("Failed to fetch contract stats:", err)
    } finally {
      setIsFetchingStats(false)
    }
  }

  // NEW: Automatically fetch stats when wallet connects
  useEffect(() => {
    if (isConnected) {
      fetchContractStats()
    }
  }, [isConnected])

  // The core Web3 Transaction Logic
  const handleSendPayment = async () => {
    if (!window.ethereum) return

    try {
      setIsTransacting(true)
      setTxStatus('Initiating transaction in MetaMask...')

      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const routerContract = new Contract(
        CONTRACTS.RevenueRouter.address,
        CONTRACTS.RevenueRouter.abi,
        signer
      )

      const paymentAmount = parseEther("0.01")
      const tx = await routerContract.routePayment({ value: paymentAmount })
      
      setTxStatus('Transaction submitted. Waiting for block confirmation...')
      
      await tx.wait()
      setTxStatus('Success! 80% sent to creator, 20% to the pool.')
      
      // NEW: Refresh the dashboard numbers automatically after success!
      fetchContractStats()

    } catch (err: any) {
      console.error(err)
      setTxStatus(err.info?.error?.message || err.message || 'Transaction failed or rejected.')
    } finally {
      setIsTransacting(false)
    }
  }

  return (
    <PageLayout>
      <Stack spacing={12}>
        <Flex direction={{ base: 'column', lg: 'row' }} align="flex-start" justify="space-between" gap={12}>
          
          <Stack spacing={6} flex="1">
            <Badge alignSelf="flex-start" colorScheme="brand" variant="subtle" px={3} py={1} borderRadius="full">
              ProjexFi Gateway
            </Badge>
            <Heading size="2xl" lineHeight="1.05">
              The secure gateway to ProjexFi's decentralized economy.
            </Heading>
            <Text fontSize="lg" color="gray.300">
              A production-ready Web3 experience designed for fast onboarding, clear wallet status, and real-time economics.
            </Text>

            {/* Wallet Connection Section */}
            <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} align={{ base: 'stretch', sm: 'center' }}>
              <Button size="lg" colorScheme="gray" onClick={connect} isLoading={isConnecting} isDisabled={isConnected}>
                {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
              </Button>
              <StatusIndicator isConnected={isConnected} />
            </Stack>

            <Stack spacing={2}>
              {isConnected && address && <Text fontSize="sm" color="gray.400">Connected as {formatAddress(address)}</Text>}
              {!isAvailable && <Text fontSize="sm" color="orange.200">MetaMask not detected. Install it to continue.</Text>}
            </Stack>

            {/* Test Network Interaction Section */}
            <Stack spacing={4} mt={4} p={6} borderWidth="1px" borderColor="whiteAlpha.200" borderRadius="xl" bg="surface.900">
              <Text fontSize="md" fontWeight="bold" color="white">
                Network Gateway
              </Text>
              <Text fontSize="sm" color="gray.400" mb={2}>
                Send a test payment. 80% will route to the creator's wallet, and 20% will stay in the contract pool.
              </Text>
              
              <Button size="lg" colorScheme="brand" onClick={handleSendPayment} isLoading={isTransacting} loadingText="Confirming..." isDisabled={!isConnected}>
                Send 0.01 ETH Payment
              </Button>
              
              {txStatus && (
                <Text fontSize="sm" color={txStatus.includes('Success') ? 'brand.400' : txStatus.includes('failed') ? 'red.400' : 'orange.300'}>
                  {txStatus}
                </Text>
              )}
            </Stack>
          </Stack>

          {/* Right Column: Dashboard & Info */}
          <Stack flex="1" w="full" spacing={6}>
            
            {/* NEW: Live Economy Dashboard */}
            <Box bg="surface.800" borderWidth="1px" borderColor="whiteAlpha.200" borderRadius="2xl" p={{ base: 6, md: 8 }}>
              <Stack spacing={4}>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="brand.400" textTransform="uppercase" letterSpacing="0.1em" fontWeight="bold">
                    Live Economy
                  </Text>
                  {isConnected && (
                    <Button size="xs" variant="outline" colorScheme="gray" onClick={fetchContractStats} isLoading={isFetchingStats}>
                      Refresh
                    </Button>
                  )}
                </Flex>
                <Divider borderColor="whiteAlpha.200" />
                
                <StatGroup gap={4}>
                  <Stat>
                    <StatLabel color="gray.400">Creator Treasury</StatLabel>
                    <StatNumber fontSize="3xl" color="white">
                      {isConnected ? creatorBalance : '---'} <Text as="span" fontSize="sm" color="gray.500">ETH</Text>
                    </StatNumber>
                  </Stat>

                  <Stat>
                    <StatLabel color="gray.400">Dividend Pool</StatLabel>
                    <StatNumber fontSize="3xl" color="white">
                      {isConnected ? poolBalance : '---'} <Text as="span" fontSize="sm" color="gray.500">ETH</Text>
                    </StatNumber>
                  </Stat>
                </StatGroup>
              </Stack>
            </Box>

            {/* Info Box */}
            <Box bg="surface.800" borderWidth="1px" borderColor="whiteAlpha.200" borderRadius="2xl" p={{ base: 6, md: 8 }}>
              <Stack spacing={6}>
                <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.2em">
                  Architecture Overview
                </Text>
                <Stack spacing={4}>
                  {highlights.map((item) => (
                    <Box key={item.title}>
                      <Text fontSize="md" fontWeight="semibold" color="gray.100">{item.title}</Text>
                      <Text fontSize="sm" color="gray.400">{item.description}</Text>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Stack>

        </Flex>
      </Stack>
    </PageLayout>
  )
}