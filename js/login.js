const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");
const existingLogin = JSON.parse(localStorage.getItem("loggedInUser"));

if (existingLogin) {
  window.location.href = "index.html";
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(
      user => user.email === email && user.password === password
    );

    if (!foundUser) {
      loginMessage.textContent = "Invalid email or password.";
      loginMessage.style.color = "red";
      return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

    loginMessage.textContent = "Login successful. Redirecting...";
    loginMessage.style.color = "green";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  });
}