import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from 'wagmi'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Wallet, LogOut, Copy, ExternalLink } from 'lucide-react'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const openEtherscan = () => {
    if (address) {
      window.open(`https://etherscan.io/address/${address}`, '_blank')
    }
  }

  const handleDisconnect = () => {
    try {
      disconnect()
      // Force reload to ensure clean state
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      console.warn('Disconnect error:', error)
      // Fallback: reload the page to clear wallet state
      window.location.reload()
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="hidden sm:flex items-center space-x-2 rounded-lg border border-gray-800 px-3 py-1.5 bg-gray-900">
          <Wallet className="h-4 w-4 text-emerald-500" />
          <span className="text-sm font-medium">{formatAddress(address)}</span>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={copyAddress}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={openEtherscan}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={handleDisconnect}
            >
              <LogOut className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Mobile version */}
        <div className="sm:hidden flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Wallet className="h-4 w-4 text-emerald-500" />
          </Button>
          <Badge variant="success" className="text-xs">
            Connected
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading'
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated')

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button 
                      onClick={() => {
                        try {
                          openConnectModal()
                        } catch (error) {
                          console.warn('Connection error:', error)
                        }
                      }} 
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Connect Wallet</span>
                      <span className="sm:hidden">Connect</span>
                    </Button>
                  )
                }

                if (chain.unsupported) {
                  return (
                    <Button onClick={openChainModal} variant="destructive">
                      Wrong network
                    </Button>
                  )
                }

                return (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={openChainModal}
                      variant="outline"
                      size="sm"
                      className="hidden sm:flex"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </Button>

                    <Button onClick={openAccountModal} variant="outline">
                      <Wallet className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">{account.displayName}</span>
                      <span className="sm:hidden">Wallet</span>
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </Button>
                  </div>
                )
              })()}
            </div>
          )
        }}
      </ConnectButton.Custom>
    </div>
  )
}