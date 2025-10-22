// Check authentication
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "login.html";
}

// Populate accounts
function populateFromAccounts() {
  const select = document.getElementById("fromAccount");
  select.innerHTML = '<option value="">Select Account</option>';
  currentUser.accounts.forEach((account) => {
    const option = document.createElement("option");
    option.value = account.id;
    option.textContent = `${account.name} - $${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    select.appendChild(option);
  });
}

function populateToAccounts() {
  const toType = document.getElementById("toType").value;
  const select = document.getElementById("toAccount");
  select.innerHTML = '<option value="">Select Account</option>';

  if (toType === "own") {
    currentUser.accounts.forEach((account) => {
      const option = document.createElement("option");
      option.value = account.id;
      option.textContent = `${account.name} - $${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
      select.appendChild(option);
    });
  } else if (toType === "external") {
    const option = document.createElement("option");
    option.value = "external";
    option.textContent = "External Bank Account";
    select.appendChild(option);
  }
}

// Set today's date as default
document.getElementById("transferDate").valueAsDate = new Date();

// Event listeners
document
  .getElementById("toType")
  .addEventListener("change", populateToAccounts);
document.getElementById("recurring").addEventListener("change", (e) => {
  document.getElementById("recurringOptions").style.display = e.target.checked
    ? "block"
    : "none";
});

// Transfer form submission
const transferForm = document.getElementById("transferForm");
const confirmModal = document.getElementById("confirmModal");

transferForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fromAccountId = document.getElementById("fromAccount").value;
  const toAccountId = document.getElementById("toAccount").value;
  const amount = Number.parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("transferDate").value;

  const fromAccount = currentUser.accounts.find((a) => a.id === fromAccountId);
  const toAccount = currentUser.accounts.find((a) => a.id === toAccountId);

  if (!fromAccount || !toAccount) {
    alert("Please select valid accounts");
    return;
  }

  if (amount > fromAccount.balance) {
    alert("Insufficient funds");
    return;
  }

  // Show confirmation
  document.getElementById("confirmFrom").textContent = fromAccount.name;
  document.getElementById("confirmTo").textContent = toAccount.name;
  document.getElementById("confirmAmount").textContent =
    `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  document.getElementById("confirmDate").textContent = new Date(
    date,
  ).toLocaleDateString();

  confirmModal.style.display = "block";

  // Store transfer data for confirmation
  window.pendingTransfer = {
    fromAccountId,
    toAccountId,
    amount,
    date,
    description: document.getElementById("description").value,
  };
});

// Confirm transfer
document.getElementById("confirmTransfer").addEventListener("click", () => {
  const transfer = window.pendingTransfer;
  const fromAccount = currentUser.accounts.find(
    (a) => a.id === transfer.fromAccountId,
  );
  const toAccount = currentUser.accounts.find(
    (a) => a.id === transfer.toAccountId,
  );

  // Update balances
  fromAccount.balance -= transfer.amount;
  toAccount.balance += transfer.amount;

  // Add to transactions
  if (!currentUser.transactions) {
    currentUser.transactions = [];
  }

  currentUser.transactions.push({
    id: `TXN${Date.now()}`,
    type: "transfer",
    description: transfer.description || "Transfer",
    amount: transfer.amount,
    date: transfer.date,
    fromAccount: fromAccount.name,
    toAccount: toAccount.name,
    status: "completed",
  });

  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  confirmModal.style.display = "none";
  transferForm.reset();
  alert("Transfer completed successfully!");
  location.reload();
});

// Modal controls
document.getElementById("closeConfirm").addEventListener("click", () => {
  confirmModal.style.display = "none";
});

document.getElementById("cancelConfirm").addEventListener("click", () => {
  confirmModal.style.display = "none";
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Initialize
populateFromAccounts();
populateToAccounts();
