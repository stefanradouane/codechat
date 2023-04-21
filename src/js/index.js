import "./editor/editor.js";

const socket = io();
const socketIdSpan = document.getElementById("socketId");
const usernameSpan = document.getElementById("username");

socket.on("connect", () => {
  socketIdSpan.innerText = socket.id;

  socket.emit("whoami", (username) => {
    usernameSpan.innerText = username;
  });
});

let messages = document.querySelector("section ul");
let input = document.querySelector("input");

document.getElementById("test").addEventListener("submit", (event) => {
  event.preventDefault();
  if (input.value) {
    socket.emit("message", input.value);
    input.value = "";
  }
});

socket.on("message", (message) => {
  console.log(message);
  const messageN = message.username;
  const usernameN = usernameSpan.innerText;
  const isSelf = messageN == usernameN;
  const className = isSelf ? "message message--own" : "message";

  messages.appendChild(
    Object.assign(document.createElement("li"), {
      classList: className,
      innerHTML: messageToHtml(message, isSelf),
    })
  );
  messages.scrollTop = messages.scrollHeight;

  const isOpen = document.querySelector("[data-content-tab='chat']").ariaHidden;
  if (isOpen == "true") {
    const chatTab = document.querySelector("[data-nav-control='chat']");
    chatTab.classList.add("nav__list-control--new-message");
  }

  console.log(className);
});

function messageToHtml(message, isSelf) {
  const now = new Intl.DateTimeFormat("nl-NL", {
    hour: "numeric",
    minute: "numeric",
  }).format(Date.now());
  return `
      <p class="message__user">${isSelf ? "U" : message.username}</p>
      <p class="message__content">${message.message}</p>
      <p class="message__date">${now}</p>`;
}

// Text editor

const textarea = document.querySelector("textarea");
const lineNumbers = document.querySelector(".line-numbers");

let numberOfLines = textarea.value.split("\n").length;
lineNumbers.innerHTML = Array(numberOfLines).fill("<span></span>").join("");

textarea.addEventListener("keyup", (event) => {
  calculateLineNumbers();
});

textarea.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    textarea.value =
      textarea.value.substring(0, start) + "\t" + textarea.value.substring(end);

    event.preventDefault();
  }
});

textarea.addEventListener("input", () => {
  const iframe = document.querySelector("[data-iframe]");
  const x = iframe.contentDocument;
  x.body.innerHTML = textarea.value;

  socket.emit("code", textarea.value);

  calculateLineNumbers();
});

function calculateLineNumbers() {
  const numberOfLines = textarea.value.split("\n").length;
  lineNumbers.innerHTML = Array(numberOfLines).fill("<span></span>").join("");
}

socket.on("code", (code) => {
  textarea.value = code;
});

const controls = document.querySelectorAll("[data-nav-control]");
const tabs = document.querySelectorAll("[data-content-tab]");

controls.forEach((control) => {
  control.addEventListener("click", () => {
    controls.forEach((crt) => {
      crt.classList.remove("nav__list-control--active");
    });

    console.log("click");
    tabs.forEach((tab) => {
      if (tab.dataset.contentTab === control.dataset.navControl) {
        tab.ariaHidden = "false";
        control.classList.add("nav__list-control--active");

        if (control.dataset.navControl === "chat") {
          control.classList.remove("nav__list-control--new-message");
        }
      } else {
        tab.ariaHidden = "true";
      }
    });
  });
});
