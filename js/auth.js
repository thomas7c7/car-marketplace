// This file controls what links show in the navbar based on login state.
const navUser = JSON.parse(localStorage.getItem("loggedInUser"));

const homeLink = document.getElementById("home-link");
const browseLink = document.getElementById("browse-link");
const sellLink = document.getElementById("sell-link");

const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");

const logoutLink = document.getElementById("logout-link");
const welcomeUser = document.getElementById("welcome-user");

if (navUser) {
  if (homeLink) homeLink.style.display = "inline";
  if (browseLink) browseLink.style.display = "inline";
  if (sellLink) sellLink.style.display = "inline";

  if (loginLink) loginLink.style.display = "none";
  if (registerLink) registerLink.style.display = "none";

  if (logoutLink) logoutLink.style.display = "inline";

  if (welcomeUser) {
    welcomeUser.textContent = `Welcome, ${navUser.name}`;
  }
} else {
  if (homeLink) homeLink.style.display = "none";
  if (browseLink) browseLink.style.display = "none";
  if (sellLink) sellLink.style.display = "none";
}

if (logoutLink) {
  logoutLink.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("editCar");
    localStorage.removeItem("selectedCar");
    window.location.href = "login.html";
  });
}