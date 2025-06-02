;; TimeLock Vault - A decentralized inheritance vault system for STX

(define-constant err-not-owner (err u100))
(define-constant err-invalid-amount (err u101))
(define-constant err-already-deposited (err u102))
(define-constant err-not-eligible (err u103))
(define-constant err-no-deposit (err u104))
(define-constant err-already-claimed (err u105))

;; Data structure to represent each vault
(define-map vaults
  principal
  {
    amount: uint,
    beneficiary: principal,
    unlock-height: uint,
    claimed: bool
  }
)

;; Track total deposits
(define-data-var total-locked uint u0)

;; Deposit STX into the vault with a beneficiary and lock duration
(define-public (deposit (amount uint) (beneficiary principal) (lock-period uint))
  (begin
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (> lock-period u0) err-invalid-amount)
    (asserts! (is-none (map-get? vaults tx-sender)) err-already-deposited)
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set vaults tx-sender {
      amount: amount,
      beneficiary: beneficiary,
      unlock-height: (+ block-height lock-period),
      claimed: false
    })
    (var-set total-locked (+ (var-get total-locked) amount))
    (ok true)
  )
)

;; Beneficiary claims the locked funds after unlock block
(define-public (claim (vault-owner principal))
  (let (
    (vault (map-get? vaults vault-owner))
  )
    (match vault v
      (begin
        (asserts! (is-eq tx-sender v.beneficiary) err-not-owner)
        (asserts! (>= block-height v.unlock-height) err-not-eligible)
        (asserts! (is-eq v.claimed false) err-already-claimed)
        (try! (stx-transfer? v.amount (as-contract tx-sender) tx-sender))
        (map-set vaults vault-owner {
          amount: v.amount,
          beneficiary: v.beneficiary,
          unlock-height: v.unlock-height,
          claimed: true
        })
        (var-set total-locked (- (var-get total-locked) v.amount))
        (ok true)
      )
      err-no-deposit
    )
  )
)

;; Get vault info for a user
(define-read-only (get-vault (owner principal))
  (ok (map-get? vaults owner))
)

;; Get total locked STX
(define-read-only (get-total-locked)
  (ok (var-get total-locked))
)