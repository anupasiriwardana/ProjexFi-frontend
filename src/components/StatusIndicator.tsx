import { Box, HStack, Text } from '@chakra-ui/react'

interface StatusIndicatorProps {
  isConnected: boolean
}

export function StatusIndicator({ isConnected }: StatusIndicatorProps) {
  const label = isConnected ? 'Wallet connected' : 'Wallet not connected'
  const dotColor = isConnected ? 'brand.400' : 'gray.500'
  const textColor = isConnected ? 'green.200' : 'gray.400'

  return (
    <HStack spacing={2}>
      <Box w="8px" h="8px" borderRadius="full" bg={dotColor} />
      <Text fontSize="sm" color={textColor}>
        {label}
      </Text>
    </HStack>
  )
}
