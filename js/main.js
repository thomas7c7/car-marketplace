const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!currentUser) {
  window.location.href = "login.html";
}
const logoutLink = document.getElementById("logout-link");

if (logoutLink) {
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  });
}