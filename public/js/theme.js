const theme = document.getElementById("themeToggle");
const icon = theme.querySelector("i");
const loadedtheme = document.documentElement.getAttribute("data-bs-theme");
const label = document.querySelector("#themeLabel");

if(loadedtheme === "dark"){
  icon.classList.replace("fa-sun", "fa-moon");
  label.textContent = "Dark";
}

theme.addEventListener("click", () => {
const currTheme = document.documentElement.getAttribute("data-bs-theme");
if(currTheme === "dark"){
    document.documentElement.setAttribute("data-bs-theme", "light");
    localStorage.setItem("theme", "light");
    icon.classList.replace("fa-moon", "fa-sun");
    label.textContent = "Light";

} else {
    document.documentElement.setAttribute("data-bs-theme", "dark");
    localStorage.setItem("theme", "dark");
    icon.classList.replace("fa-sun", "fa-moon");
    label.textContent = "Dark";
    
}
});