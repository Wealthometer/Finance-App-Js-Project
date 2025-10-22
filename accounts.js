// Check authentication
const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) {
  window.location.href = "login.html"
}

const userInitials = (currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0)).toUpperCase()
document.querySelectorAll(".avatar").forEach((avatar) => {
  avatar.textContent = userInitials
})
document.getElementById("userName").textContent = `${currentUser.firstName} ${currentUser.lastName}`
document.getElementById("userEmail").textContent = currentUser.email

// Populate accounts
function populateAccounts() {
  const accountsGrid = document.getElementById("accountsGrid")
  accountsGrid.innerHTML = currentUser.accounts
    .map(
      (account) => `
    <div class="account-card" onclick="selectAccount('${account.id}')">
      <div class="account-card-header">
        <h3>${account.name}</h3>
        <span class="account-type">${account.type}</span>
      </div>
      <p class="account-number">${account.accountNumber}</p>
      <p class="account-balance">$${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
      <div class="transaction-actions" style="margin-top: 1rem; display: flex; gap: 0.5rem;">
        <button class="transaction-btn deposit" onclick="openDepositModal('${account.id}'); event.stopPropagation();">💰 Deposit</button>
        <button class="transaction-btn withdraw" onclick="openWithdrawModal('${account.id}'); event.stopPropagation();">💸 Withdraw</button>
      </div>
    </div>
  `,
    )
    .join("")
}

// Select account
let selectedAccountId = null
function selectAccount(accountId) {
  selectedAccountId = accountId
  const account = currentUser.accounts.find((a) => a.id === accountId)
  if (account) {
    document.getElementById("accountHolder").textContent = `${currentUser.firstName} ${currentUser.lastName}`
    document.getElementById("accountNumber").textContent = account.accountNumber
    document.getElementById("accountType").textContent = account.type
    document.getElementById("currentBalance").textContent =
      `$${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`

    populateAccountTransactions(accountId)
  }
}

function populateAccountTransactions(accountId) {
  const account = currentUser.accounts.find((a) => a.id === accountId)
  const transactionsBody = document.getElementById("accountTransactionsBody")

  if (account && account.transactions && account.transactions.length > 0) {
    transactionsBody.innerHTML = account.transactions
      .map(
        (t) => `
        <tr>
          <td>${new Date(t.date).toLocaleDateString()}</td>
          <td>${t.description}</td>
          <td>${t.type}</td>
          <td class="amount ${t.type === "Credit" ? "positive" : "negative"}">
            ${t.type === "Credit" ? "+" : "-"}$${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </td>
          <td>$${t.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
        </tr>
      `,
      )
      .join("")
  } else {
    transactionsBody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: var(--text-light);">No transactions yet</td></tr>'
  }
}

const depositModal = document.createElement("div")
depositModal.id = "depositModal"
depositModal.className = "modal"
depositModal.innerHTML = `
  <div class="modal-content">
    <div class="modal-header">
      <h2>Deposit Money</h2>
      <button class="close-btn" onclick="closeDepositModal()">&times;</button>
    </div>
    <form id="depositForm" class="modal-form">
      <div class="form-group">
        <label for="depositAmount">Amount to Deposit</label>
        <input type="number" id="depositAmount" required placeholder="0.00" min="0.01" step="0.01">
      </div>
      <div class="form-group">
        <label for="depositDescription">Description</label>
        <input type="text" id="depositDescription" placeholder="e.g., Salary, Transfer, etc.">
      </div>
      <div class="modal-buttons">
        <button type="button" class="btn btn-secondary" onclick="closeDepositModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Deposit</button>
      </div>
    </form>
  </div>
`
document.body.appendChild(depositModal)

function openDepositModal(accountId) {
  selectedAccountId = accountId
  depositModal.style.display = "block"
}

function closeDepositModal() {
  depositModal.style.display = "none"
}

document.getElementById("depositForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const amount = Number.parseFloat(document.getElementById("depositAmount").value)
  const description = document.getElementById("depositDescription").value || "Deposit"

  const account = currentUser.accounts.find((a) => a.id === selectedAccountId)
  if (account) {
    account.balance += amount

    if (!account.transactions) account.transactions = []
    account.transactions.unshift({
      date: new Date().toISOString(),
      description: description,
      type: "Credit",
      amount: amount,
      balance: account.balance,
    })

    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    populateAccounts()
    selectAccount(selectedAccountId)
    closeDepositModal()
    document.getElementById("depositForm").reset()

    // Show success message
    alert(`Successfully deposited $${amount.toFixed(2)}`)
  }
})

const withdrawModal = document.createElement("div")
withdrawModal.id = "withdrawModal"
withdrawModal.className = "modal"
withdrawModal.innerHTML = `
  <div class="modal-content">
    <div class="modal-header">
      <h2>Withdraw Money</h2>
      <button class="close-btn" onclick="closeWithdrawModal()">&times;</button>
    </div>
    <form id="withdrawForm" class="modal-form">
      <div class="form-group">
        <label for="withdrawAmount">Amount to Withdraw</label>
        <input type="number" id="withdrawAmount" required placeholder="0.00" min="0.01" step="0.01">
      </div>
      <div class="form-group">
        <label for="withdrawDescription">Description</label>
        <input type="text" id="withdrawDescription" placeholder="e.g., ATM Withdrawal, Transfer, etc.">
      </div>
      <div class="modal-buttons">
        <button type="button" class="btn btn-secondary" onclick="closeWithdrawModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Withdraw</button>
      </div>
    </form>
  </div>
`
document.body.appendChild(withdrawModal)

function openWithdrawModal(accountId) {
  selectedAccountId = accountId
  withdrawModal.style.display = "block"
}

function closeWithdrawModal() {
  withdrawModal.style.display = "none"
}

document.getElementById("withdrawForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const amount = Number.parseFloat(document.getElementById("withdrawAmount").value)
  const description = document.getElementById("withdrawDescription").value || "Withdrawal"

  const account = currentUser.accounts.find((a) => a.id === selectedAccountId)
  if (account) {
    if (account.balance < amount) {
      alert("Insufficient funds")
      return
    }

    account.balance -= amount

    if (!account.transactions) account.transactions = []
    account.transactions.unshift({
      date: new Date().toISOString(),
      description: description,
      type: "Debit",
      amount: amount,
      balance: account.balance,
    })

    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    populateAccounts()
    selectAccount(selectedAccountId)
    closeWithdrawModal()
    document.getElementById("withdrawForm").reset()

    // Show success message
    alert(`Successfully withdrew $${amount.toFixed(2)}`)
  }
})

function printReceipt(accountId) {
  const account = currentUser.accounts.find((a) => a.id === accountId)
  if (!account) return

  const receiptWindow = window.open("", "", "width=400,height=600")
  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Account Statement - ${account.name}</title>
      <style>
        body { font-family: 'Courier New', monospace; margin: 20px; }
        .receipt { max-width: 400px; margin: 0 auto; border: 2px dashed #ccc; padding: 20px; text-align: center; }
        .header { margin-bottom: 20px; border-bottom: 1px solid #000; padding-bottom: 10px; }
        .header h2 { margin: 0; }
        .body { text-align: left; margin: 20px 0; }
        .item { display: flex; justify-content: space-between; margin: 10px 0; }
        .total { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0; font-weight: bold; margin: 20px 0; }
        .footer { margin-top: 20px; border-top: 1px solid #000; padding-top: 10px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h2>PROSPERIX BANK</h2>
          <p>Account Statement</p>
        </div>
        <div class="body">
          <div class="item">
            <span>Account Holder:</span>
            <span>${currentUser.firstName} ${currentUser.lastName}</span>
          </div>
          <div class="item">
            <span>Account Name:</span>
            <span>${account.name}</span>
          </div>
          <div class="item">
            <span>Account Type:</span>
            <span>${account.type}</span>
          </div>
          <div class="item">
            <span>Account Number:</span>
            <span>${account.accountNumber}</span>
          </div>
          <div class="item">
            <span>Date:</span>
            <span>${new Date().toLocaleDateString()}</span>
          </div>
          <div class="item">
            <span>Time:</span>
            <span>${new Date().toLocaleTimeString()}</span>
          </div>
          <div class="total">
            <div class="item">
              <span>Current Balance:</span>
              <span>$${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>Thank you for banking with Prosperix</p>
          <p>This is a computer-generated statement</p>
        </div>
      </div>
    </body>
    </html>
  `
  receiptWindow.document.write(receiptHTML)
  receiptWindow.document.close()
  receiptWindow.print()
}

// Modal functionality
const modal = document.getElementById("newAccountModal")
const newAccountBtn = document.getElementById("newAccountBtn")
const closeModal = document.getElementById("closeModal")
const cancelBtn = document.getElementById("cancelBtn")
const newAccountForm = document.getElementById("newAccountForm")

newAccountBtn.addEventListener("click", () => {
  modal.style.display = "block"
})

closeModal.addEventListener("click", () => {
  modal.style.display = "none"
})

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none"
})

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none"
  }
})

// Create new account
newAccountForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const accountName = document.getElementById("accountName").value
  const accountType = document.getElementById("accountType").value
  const initialDeposit = Number.parseFloat(document.getElementById("initialDeposit").value)

  const newAccount = {
    id: `ACC${Date.now()}`,
    type: accountType,
    name: accountName,
    balance: initialDeposit,
    accountNumber: `****${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    transactions:
      initialDeposit > 0
        ? [
            {
              date: new Date().toISOString(),
              description: "Initial Deposit",
              type: "Credit",
              amount: initialDeposit,
              balance: initialDeposit,
            },
          ]
        : [],
  }

  currentUser.accounts.push(newAccount)
  localStorage.setItem("currentUser", JSON.stringify(currentUser))

  populateAccounts()
  modal.style.display = "none"
  newAccountForm.reset()
  alert(`Account "${accountName}" created successfully!`)
})

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
})

// Mobile menu
const menuToggle = document.getElementById("menuToggle")
const sidebar = document.querySelector(".sidebar")

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active")
})

// Initialize
populateAccounts()
selectAccount(currentUser.accounts[0].id)
