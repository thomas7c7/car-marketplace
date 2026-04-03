const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      registerMessage.textContent = "An account with this email already exists.";
      registerMessage.style.color = "red";
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    registerMessage.textContent = "Account created successfully. Redirecting to login...";
    registerMessage.style.color = "green";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
  });
}