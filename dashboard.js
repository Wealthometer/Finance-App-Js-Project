function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "login.html";
    return null;
  }
  return currentUser;
}

const currentUser = checkAuth();

if (currentUser) {
  document.getElementById(
    "userName"
  ).textContent = `${currentUser.firstName} ${currentUser.lastName}`;
  document.getElementById("userEmail").textContent = currentUser.email;
  document.getElementById("firstName").textContent = currentUser.firstName;

  const totalBalance = currentUser.accounts.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );
  const investmentTotal = currentUser.investments.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );

  document.getElementById(
    "totalBalance"
  ).textContent = `$${totalBalance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;
  document.getElementById(
    "investmentTotal"
  ).textContent = `$${investmentTotal.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;

  const monthlySpending = currentUser.transactions
    .filter((t) => {
      const transDate = new Date(t.date);
      const now = new Date();
      return (
        transDate.getMonth() === now.getMonth() &&
        transDate.getFullYear() === now.getFullYear() &&
        t.type === "expense"
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  document.getElementById(
    "monthlySpending"
  ).textContent = `$${monthlySpending.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;

  const transactionsBody = document.getElementById("transactionsBody");
  if (currentUser.transactions && currentUser.transactions.length > 0) {
    transactionsBody.innerHTML = currentUser.transactions
      .slice(0, 4)
      .map(
        (t) => `
      <tr>
        <td>
          <div class="transaction-info">
            <span class="transaction-icon">${t.icon || "💳"}</span>
            <span>${t.description}</span>
          </div>
        </td>
        <td>${t.category}</td>
        <td>${new Date(t.date).toLocaleDateString()}</td>
        <td class="amount ${t.type === "income" ? "positive" : "negative"}">
          ${t.type === "income" ? "+" : "-"}$${t.amount.toLocaleString(
          "en-US",
          { minimumFractionDigits: 2 }
        )}
        </td>
        <td><span class="status completed">Completed</span></td>
      </tr>
    `
      )
      .join("");
  }
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
}

function drawChart(canvasId, data, type) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = canvas.parentElement.offsetWidth - 40;
  canvas.height = 250;

  if (type === "bar") {
    drawBarChart(ctx, data);
  } else if (type === "line") {
    drawLineChart(ctx, data);
  }
}

function drawBarChart(ctx, data) {
  const barWidth = ctx.canvas.width / (data.length + 1);
  const maxValue = Math.max(...data.map((d) => d.value));
  const scale = (ctx.canvas.height - 40) / maxValue;

  data.forEach((item, index) => {
    const x = (index + 1) * barWidth;
    const height = item.value * scale;
    const y = ctx.canvas.height - height - 20;

    ctx.fillStyle = item.color || "#1a9b8e";
    ctx.fillRect(x - barWidth / 3, y, (barWidth * 2) / 3, height);

    ctx.fillStyle = "#666";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(item.label, x, ctx.canvas.height - 5);
  });
}

function drawLineChart(ctx, data) {
  const pointSpacing = ctx.canvas.width / (data.length - 1);
  const maxValue = Math.max(...data.map((d) => d.value));
  const scale = (ctx.canvas.height - 40) / maxValue;

  ctx.strokeStyle = "#1a9b8e";
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.forEach((item, index) => {
    const x = index * pointSpacing;
    const y = ctx.canvas.height - item.value * scale - 20;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  ctx.fillStyle = "#1a9b8e";
  data.forEach((item, index) => {
    const x = index * pointSpacing;
    const y = ctx.canvas.height - item.value * scale - 20;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

drawChart(
  "spendingChart",
  [
    { label: "Food", value: 450, color: "#ff6b6b" },
    { label: "Transport", value: 300, color: "#4ecdc4" },
    { label: "Shopping", value: 600, color: "#ffd93d" },
    { label: "Entertainment", value: 200, color: "#6bcf7f" },
    { label: "Utilities", value: 150, color: "#95a5a6" },
  ],
  "bar"
);

drawChart(
  "balanceChart",
  [
    { value: 18000 },
    { value: 18500 },
    { value: 19200 },
    { value: 19800 },
    { value: 20000 },
  ],
  "line"
);
