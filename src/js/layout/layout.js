const content = document.querySelector(".content");
const modalTab = document.querySelector("[data-content-tab]");

const btns = document.querySelectorAll(".nav__list-control ");
const chat = document.querySelector(".chat");

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
      content.classList.add(classes[btn.dataset.navControl]);

      if (btn.dataset.navControl == "chat") {
        const chatTab = document.querySelector("[data-nav-control='chat']");
        chatTab.classList.remove("nav__list-control--new-message");
        chat.scrollTop = chat.scrollHeight;
      }
    });
  });
}
