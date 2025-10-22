// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  })
})

// Get Started button functionality
document.querySelectorAll(".btn-primary").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    if (this.textContent.includes("Get Started")) {
      e.preventDefault()
      window.location.href = "signup.html"
    }
  })
})

// Form validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Email input handling
document.querySelectorAll('.form-input[type="email"]').forEach((input) => {
  input.addEventListener("blur", function () {
    if (this.value && !validateEmail(this.value)) {
      this.style.borderColor = "var(--accent-red)"
    } else {
      this.style.borderColor = ""
    }
  })
})
