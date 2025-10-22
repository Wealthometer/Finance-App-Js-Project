const currentUser = JSON.parse(localStorage.getItem("currentUser"))
if (!currentUser) window.location.href = "login.html"

if (!currentUser.cards) {
  currentUser.cards = [{ id: "CARD001", type: "Debit", lastFour: "1234", balance: 5000, status: "Active" }]
}

function displayCards() {
  const cardsGrid = document.getElementById("cardsGrid")
  cardsGrid.innerHTML = currentUser.cards
    .map(
      (card) => `
    <div class="card-display">
      <div class="card-visual">
        <div class="card-chip">💳</div>
        <div class="card-number">•••• •••• •••• ${card.lastFour}</div>
        <div class="card-holder">${currentUser.firstName} ${currentUser.lastName}</div>
      </div>
      <div class="card-info">
        <p><strong>Type:</strong> ${card.type}</p>
        <p><strong>Status:</strong> ${card.status}</p>
        <p><strong>Balance:</strong> $${card.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
      </div>
    </div>
  `,
    )
    .join("")
}

const orderCardModal = document.getElementById("orderCardModal")
document.getElementById("orderCardBtn").addEventListener("click", () => {
  orderCardModal.style.display = "block"
})

document.getElementById("closeOrder").addEventListener("click", () => {
  orderCardModal.style.display = "none"
})

document.getElementById("cancelOrder").addEventListener("click", () => {
  orderCardModal.style.display = "none"
})

document.getElementById("orderCardForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const cardType = document.getElementById("cardType").value
  const cardDesign = document.getElementById("cardDesign").value

  const newCard = {
    id: `CARD${Date.now()}`,
    type: cardType.charAt(0).toUpperCase() + cardType.slice(1),
    lastFour: Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0"),
    balance: 0,
    status: "Pending",
  }

  currentUser.cards.push(newCard)
  localStorage.setItem("currentUser", JSON.stringify(currentUser))
  displayCards()
  orderCardModal.style.display = "none"
  document.getElementById("orderCardForm").reset()
  alert("Card order placed! It will arrive in 7-10 business days.")
})

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
})

document.getElementById("menuToggle").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("active")
})

displayCards()
