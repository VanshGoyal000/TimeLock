# TimeLock Vault - Decentralized Inheritance System on Bitcoin

![TimeLock Vault Logo](./frontend/public/logo.png)

A decentralized inheritance and time-locked asset vault system built on Bitcoin using Stacks blockchain and Clarity smart contracts.

## Project Overview

TimeLock Vault enables users to secure their digital assets (STX, Fungible Tokens, and NFTs) in time-locked vaults with customizable inheritance rules. The system provides two unlock mechanisms:

1. **Time-Based Release**: Assets unlock after a specific time period (block height)
2. **Inactivity-Based Release (Dead Man's Switch)**: Assets unlock if the owner doesn't "ping" the vault for a specified duration

## Smart Contract ADDR->
``` STX1EXGFVE2TXBGY35E6334Z9E9EV7RZNZ5WPCMN.timelock-vault ```


### Core Vault Contract Workflow

1. **Vault Creation**:
   - User creates a new vault by calling `create-vault` with parameters:
     - `unlock-height`: Block height when the vault becomes unlockable
     - `inactivity-timeout`: Number of blocks after which inactivity is triggered

2. **Asset Management**:
   - Deposit STX: Owner transfers STX to the vault using `deposit-stx`
   - Deposit FTs: Owner deposits fungible tokens using appropriate functions
   - NFTs: When enabled, owner can deposit NFTs through the NFT extension

3. **Heir Management**:
   - Owner designates heirs using `add-heir` with an address and percentage allocation
   - Total heir allocations must sum to 100%

4. **Inactivity Prevention**:
   - Owner "proves life" periodically by calling `ping` function
   - Each ping resets the inactivity counter by updating `last-active-height`

5. **Asset Claiming**:
   - Assets can be claimed by heirs under two conditions:
     - The unlock height has been reached (time-based)
     - The inactivity period has elapsed (dead man's switch)
   - Heirs call `claim-as-heir` to receive their allocated percentage

6. **Guardian System (Optional)**:
   - Multi-signature functionality where designated guardians must approve claims
   - Guardians sign using `sign-as-guardian`
   - Claims require a threshold number of guardian signatures

### NFT Extension Workflow

1. **NFT Deposit**: 
   - Owner deposits NFTs to an existing vault
   - Only NFTs implementing SIP-009 standard are supported

2. **NFT Claiming**:
   - Heirs claim NFTs when vault conditions are met
   - NFTs are distributed based on heir percentages

## Technical Stack

- **Blockchain**: Bitcoin (via Stacks)
- **Smart Contracts**: Clarity
- **Frontend**: React, TypeScript, TailwindCSS
- **Testing**: Clarinet, Node.js test scripts

## Contract Details

```clarity
;; Key functions in timelock-vault.clar

;; Create a new vault with unlock conditions
(define-public (create-vault (unlock-height uint) (inactivity-timeout uint))...)

;; Deposit STX to the vault
(define-public (deposit-stx (vault-id uint) (amount uint))...)

;; Add an heir with specified percentage
(define-public (add-heir (vault-id uint) (heir principal) (percentage uint))...)

;; Owner "proves life" to prevent inactivity trigger
(define-public (ping (vault-id uint))...)

;; Heir claims their portion of assets
(define-public (claim-as-heir (vault-id uint))...)
```