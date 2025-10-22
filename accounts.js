const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
  window.location.href = "login.html";
}

function populateAccounts() {
  const accountsGrid = document.getElementById("accountsGrid");
  accountsGrid.innerHTML = currentUser.accounts
    .map(
      (account) => `
    <div class="account-card" onclick="selectAccount('${account.id}')">
      <div class="account-card-header">
        <h3>${account.name}</h3>
        <span class="account-type">${account.type}</span>
      </div>
      <p class="account-number">${account.accountNumber}</p>
      <p class="account-balance">$${account.balance.toLocaleString("en-US", {
        minimumFractionDigits: 2,
      })}</p>
    </div>
  `
    )
    .join("");
}

function selectAccount(accountId) {
  const account = currentUser.accounts.find((a) => a.id === accountId);
  if (account) {
    document.getElementById(
      "accountHolder"
    ).textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById("accountNumber").textContent =
      account.accountNumber;
    document.getElementById("accountType").textContent = account.type;
    document.getElementById(
      "currentBalance"
    ).textContent = `$${account.balance.toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })}`;
  }
}

const modal = document.getElementById("newAccountModal");
const newAccountBtn = document.getElementById("newAccountBtn");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const newAccountForm = document.getElementById("newAccountForm");

newAccountBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

newAccountForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const accountName = document.getElementById("accountName").value;
  const accountType = document.getElementById("accountType").value;
  const initialDeposit = Number.parseFloat(
    document.getElementById("initialDeposit").value
  );

  const newAccount = {
    id: `ACC${Date.now()}`,
    type: accountType,
    name: accountName,
    balance: initialDeposit,
    accountNumber: `****${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
  };

  currentUser.accounts.push(newAccount);
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  populateAccounts();
  modal.style.display = "none";
  newAccountForm.reset();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

populateAccounts();
selectAccount(currentUser.accounts[0].id);
