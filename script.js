const pencarianForm = document.getElementById("pencarianForm");

pencarianForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const query = document.querySelector(
    '#pencarianForm input[type="text"]',
  ).value;
  // Add your search logic here
});

const btn = document.getElementById("btn");
btn.addEventListener("click", function () {
  const query = document.querySelector(
    '#pencarianForm input[type="text"]',
  ).value;
  // Add your search logic here
});

console.log("Script loaded successfully!");

addEventListener("DOMContentLoaded", function () {
  const fontSizeToggle = document.getElementById("fontSizeToggle");
  fontSizeToggle.addEventListener("click", function () {
    document.body.classList.toggle("large-font");
  });
});
