const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

const homeLink = document.getElementById("home-link");
const browseLink = document.getElementById("browse-link");
const sellLink = document.getElementById("sell-link");

const loginLink = document.getElementById("login-link");
const registerLink = document.getElementById("register-link");

const logoutLink = document.getElementById("logout-link");
const welcomeUser = document.getElementById("welcome-user");

if (loggedInUser) {
  // show protected nav
  homeLink?.style.setProperty("display", "inline");
  browseLink?.style.setProperty("display", "inline");
  sellLink?.style.setProperty("display", "inline");

  // hide auth nav
  loginLink?.style.setProperty("display", "none");
  registerLink?.style.setProperty("display", "none");

  // show logout
  logoutLink?.style.setProperty("display", "inline");

  // welcome text
  if (welcomeUser) {
    welcomeUser.textContent = `Welcome, ${loggedInUser.name}`;
    welcomeUser.style.marginLeft = "15px";
    welcomeUser.style.fontWeight = "bold";
  }
} else {
  // hide protected nav before login
  homeLink?.style.setProperty("display", "none");
  browseLink?.style.setProperty("display", "none");
  sellLink?.style.setProperty("display", "none");
}

logoutLink?.addEventListener("click", (e) => {
  e.preventDefault();

  localStorage.removeItem("loggedInUser");

  window.location.href = "login.html";
});