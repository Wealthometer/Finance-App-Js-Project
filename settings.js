const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) window.location.href = "login.html";

// Populate profile form
document.getElementById("firstName").value = currentUser.firstName;
document.getElementById("lastName").value = currentUser.lastName;
document.getElementById("email").value = currentUser.email;
document.getElementById("phone").value = currentUser.phone;

// Profile form submission
document.getElementById("profileForm").addEventListener("submit", (e) => {
  e.preventDefault();
  currentUser.firstName = document.getElementById("firstName").value;
  currentUser.lastName = document.getElementById("lastName").value;
  currentUser.email = document.getElementById("email").value;
  currentUser.phone = document.getElementById("phone").value;

  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  alert("Profile updated successfully!");
});

// Password modal
const passwordModal = document.getElementById("passwordModal");
document.getElementById("changePasswordBtn").addEventListener("click", () => {
  passwordModal.style.display = "block";
});

document.getElementById("closePassword").addEventListener("click", () => {
  passwordModal.style.display = "none";
});

document.getElementById("cancelPassword").addEventListener("click", () => {
  passwordModal.style.display = "none";
});

document.getElementById("passwordForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmNewPassword").value;

  if (currentPassword !== currentUser.password) {
    alert("Current password is incorrect");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New passwords do not match");
    return;
  }

  currentUser.password = newPassword;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  passwordModal.style.display = "none";
  document.getElementById("passwordForm").reset();
  alert("Password updated successfully!");
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
});

// Mobile menu
document.getElementById("menuToggle").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("active");
});
