import { Box, Container, type BoxProps } from '@chakra-ui/react'
import type { PropsWithChildren } from 'react'

type PageLayoutProps = PropsWithChildren<BoxProps>

export function PageLayout({ children, ...rest }: PageLayoutProps) {
  return (
    <Box minH="100vh" bg="surface.900" {...rest}>
      <Container maxW="6xl" py={{ base: 16, md: 24 }}>
        {children}
      </Container>
    </Box>
  )
}
