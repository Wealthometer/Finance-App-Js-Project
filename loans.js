const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) window.location.href = "login.html"

if (!currentUser.loans) {
  currentUser.loans = [
    {
      id: "LOAN001",
      type: "Personal Loan",
      amount: 10000,
      interestRate: 5.5,
      remaining: 8500,
      monthlyPayment: 250,
      status: "Active",
    },
  ]
}

function updateLoans() {
  const totalBorrowed = currentUser.loans.reduce((sum, loan) => sum + loan.amount, 0)
  const monthlyPayment = currentUser.loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0)

  document.getElementById("totalBorrowed").textContent =
    `$${totalBorrowed.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
  document.getElementById("monthlyPayment").textContent =
    `$${monthlyPayment.toLocaleString("en-US", { minimumFractionDigits: 2 })}`

  const loansBody = document.getElementById("loansBody")
  loansBody.innerHTML = currentUser.loans
    .map(
      (loan) => `
    <tr>
      <td>${loan.type}</td>
      <td>$${loan.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
      <td>${loan.interestRate}%</td>
      <td>$${loan.remaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
      <td>$${loan.monthlyPayment.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
      <td><span class="status completed">${loan.status}</span></td>
    </tr>
  `,
    )
    .join("")
}

const loanModal = document.getElementById("loanModal")
document.getElementById("applyLoanBtn").addEventListener("click", () => {
  loanModal.style.display = "block"
})

document.getElementById("closeLoan").addEventListener("click", () => {
  loanModal.style.display = "none"
})

document.getElementById("cancelLoan").addEventListener("click", () => {
  loanModal.style.display = "none"
})

document.getElementById("loanForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const loanType = document.getElementById("loanType").value
  const loanAmount = Number.parseFloat(document.getElementById("loanAmount").value)
  const loanTerm = Number.parseInt(document.getElementById("loanTerm").value)

  const monthlyPayment = (loanAmount * 0.055) / 12 + loanAmount / loanTerm

  const newLoan = {
    id: `LOAN${Date.now()}`,
    type: loanType,
    amount: loanAmount,
    interestRate: 5.5,
    remaining: loanAmount,
    monthlyPayment: monthlyPayment,
    status: "Active",
  }

  currentUser.loans.push(newLoan)
  localStorage.setItem("currentUser", JSON.stringify(currentUser))
  updateLoans()
  loanModal.style.display = "none"
  document.getElementById("loanForm").reset()
  alert("Loan application submitted!")
})

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
})

document.getElementById("menuToggle").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("active")
})

updateLoans()
