const content = document.querySelector(".content");
const modalTab = document.querySelector("[data-content-tab]");

const btns = document.querySelectorAll(".nav__list-control ");

const classes = {
  chat: "content--chat",
  code: "content--clean",
  users: "content--users",
};

if (btns) {
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((btn) => {
        btn.classList.remove("nav__list-control--active");
      });
      btn.classList.add("nav__list-control--active");
      content.className = "content";
      console.log(btn.dataset);
      content.classList.add(classes[btn.dataset.navControl]);
    });
  });
}
