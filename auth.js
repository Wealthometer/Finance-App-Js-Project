const users = JSON.parse(localStorage.getItem("users")) || [];

// Login form handler
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
      showError("email", "Please fill in all fields");
      return;
    }

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));

      window.location.href = "dashboard.html";
    } else {
      showError("email", "Invalid email or password");
    }
  });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("signupEmail").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.querySelector('input[name="terms"]').checked;

    let isValid = true;

    if (!firstName) {
      showError("firstName", "First name is required");
      isValid = false;
    }
    if (!lastName) {
      showError("lastName", "Last name is required");
      isValid = false;
    }
    if (!email) {
      showError("signupEmail", "Email is required");
      isValid = false;
    }
    if (!validateEmail(email)) {
      showError("signupEmail", "Invalid email format");
      isValid = false;
    }
    if (!phone) {
      showError("phone", "Phone number is required");
      isValid = false;
    }
    if (password.length < 8) {
      showError("signupPassword", "Password must be at least 8 characters");
      isValid = false;
    }
    if (password !== confirmPassword) {
      showError("confirmPassword", "Passwords do not match");
      isValid = false;
    }
    if (!terms) {
      alert("You must agree to the terms and conditions");
      isValid = false;
    }

    if (!isValid) return;

    if (users.find((u) => u.email === email)) {
      showError("signupEmail", "Email already registered");
      return;
    }

    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      phone,
      password,
      createdAt: new Date().toISOString(),
      accounts: [
        {
          id: "ACC001",
          type: "Checking",
          name: "Primary Checking",
          balance: 5000,
          accountNumber: "****1234",
        },
        {
          id: "ACC002",
          type: "Savings",
          name: "Emergency Fund",
          balance: 15000,
          accountNumber: "****5678",
        },
      ],
      cards: [
        {
          id: "CARD001",
          type: "Debit",
          lastFour: "1234",
          balance: 5000,
          status: "Active",
        },
      ],
      transactions: [],
      investments: [],
      loans: [],
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("currentUser", JSON.stringify(newUser));

    window.location.href = "dashboard.html";
  });
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.style.borderColor = "var(--accent-red)";
    const errorSpan = field.parentElement.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.textContent = message;
    }
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

document.querySelectorAll(".form-group input").forEach((input) => {
  input.addEventListener("focus", function () {
    this.style.borderColor = "";
    const errorSpan = this.parentElement.querySelector(".error-message");
    if (errorSpan) {
      errorSpan.textContent = "";
    }
  });
});
