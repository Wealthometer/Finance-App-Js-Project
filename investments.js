const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) window.location.href = "login.html";

if (!currentUser.investments) {
  currentUser.investments = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      quantity: 10,
      purchasePrice: 140,
      currentPrice: 150,
    },
    {
      symbol: "MSFT",
      name: "Microsoft",
      quantity: 5,
      purchasePrice: 300,
      currentPrice: 320,
    },
  ];
}

function updatePortfolio() {
  const totalValue = currentUser.investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentPrice,
    0,
  );
  const totalCost = currentUser.investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.purchasePrice,
    0,
  );
  const gainLoss = totalValue - totalCost;

  document.getElementById("portfolioValue").textContent =
    `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  document.getElementById("gainLoss").textContent =
    `${gainLoss >= 0 ? "+" : ""}$${gainLoss.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  document.getElementById("holdingsCount").textContent =
    currentUser.investments.length;

  const holdingsBody = document.getElementById("holdingsBody");
  holdingsBody.innerHTML = currentUser.investments
    .map(
      (inv) => `
    <tr>
      <td>${inv.symbol}</td>
      <td>${inv.name}</td>
      <td>${inv.quantity}</td>
      <td>$${inv.currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
      <td>$${(inv.quantity * inv.currentPrice).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
      <td class="amount ${inv.currentPrice >= inv.purchasePrice ? "positive" : "negative"}">
        ${inv.currentPrice >= inv.purchasePrice ? "+" : ""}$${(inv.quantity * inv.currentPrice - inv.quantity * inv.purchasePrice).toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </td>
      <td><button class="btn-small" onclick="sellInvestment('${inv.symbol}')">Sell</button></td>
    </tr>
  `,
    )
    .join("");
}

const buyModal = document.getElementById("buyModal");
document.getElementById("buyBtn").addEventListener("click", () => {
  buyModal.style.display = "block";
});

document.getElementById("closeBuy").addEventListener("click", () => {
  buyModal.style.display = "none";
});

document.getElementById("cancelBuy").addEventListener("click", () => {
  buyModal.style.display = "none";
});

document.getElementById("buyForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const symbol = document.getElementById("symbol").value.toUpperCase();
  const quantity = Number.parseInt(document.getElementById("quantity").value);
  const price = Number.parseFloat(document.getElementById("price").value);

  const existing = currentUser.investments.find((i) => i.symbol === symbol);
  if (existing) {
    existing.quantity += quantity;
  } else {
    currentUser.investments.push({
      symbol,
      name: symbol,
      quantity,
      purchasePrice: price,
      currentPrice: price,
    });
  }

  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  updatePortfolio();
  buyModal.style.display = "none";
  document.getElementById("buyForm").reset();
});

function sellInvestment(symbol) {
  const inv = currentUser.investments.find((i) => i.symbol === symbol);
  if (inv && confirm(`Sell ${inv.quantity} shares of ${symbol}?`)) {
    currentUser.investments = currentUser.investments.filter(
      (i) => i.symbol !== symbol,
    );
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    updatePortfolio();
  }
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("active");
});

updatePortfolio();
