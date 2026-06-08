import RevenueRouterABI from './RevenueRouter.json'

export type ContractConfig = {
  address: string
  abi: unknown[]
}

export const CONTRACTS: Record<string, ContractConfig> = {
  RevenueRouter: {
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Update this with your deployed contract address
    abi: RevenueRouterABI.abi, // We specifically target the .abi array inside the JSON
  },
}
