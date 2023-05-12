import "./editor/editor.js";
import "./layout/layout.js";
import { createAvatar, messageToHtml } from "./lib/utils.js";

const socket = io();
const socketIdSpan = document.getElementById("socketId");
const usernameSpan = document.getElementById("username");
const avatarImg = document.getElementById("avatar");
let chat = document.querySelector(".chat");
let input = document.querySelector("input");

// Submit message

document.getElementById("chat-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (input.value) {
    socket.emit("message", {
      message: input.value,
      username: usernameSpan.innerText,
      date: new Intl.DateTimeFormat("nl-NL", {
        hour: "numeric",
        minute: "numeric",
      }).format(Date.now()),
      room: new URL(window.location.href).searchParams.get("room"),
    });
    input.value = "";
  }
});

// Socket events

socket.on("connect", () => {
  socketIdSpan.innerText = socket.id;

  socket.emit("whoami", (user) => {
    // console.log(user);
    usernameSpan.innerText = `${user.name} ${user.surname}`;
    createAvatar(user.avatar, avatarImg);
  });
});

socket.on("history", (history) => {
  history?.forEach((message) => {
    addMessage(message);
  });
});

socket.on("activeUsers", (users) => {
  const uniqueArray = users.filter((item, index, self) => {
    return (
      index ===
      self.findIndex((obj) => {
        return obj.userName === item.userName && obj.room === item.room;
      })
    );
  });

  document.querySelector("[data-users]")
    ? Array.from(document.querySelector("[data-users]")?.children).forEach(
        (child) => {
          child.remove();
        }
      )
    : undefined;

  uniqueArray.forEach((user) => {
    if (user.room)
      document.querySelector("[data-users]")?.appendChild(
        Object.assign(document.createElement("li"), {
          classList: "connection connection--connected",
          innerHTML: `${user.user.name} ${
            user.user.surname
          } <a class="connection__room" href="/?room=${
            user.room ? user.room : ""
          }">${user.room == null ? "lobby" : user.room}</a>`,
        })
      );
  });
});

socket.on("message", (message) => {
  addMessage(message);

  const isOpen = document.querySelector(".content--chat");
  if (!isOpen) {
    const chatTab = document.querySelector("[data-nav-control='chat']");
    chatTab.classList.add("nav__list-control--new-message");
  }
});

function addMessage(message) {
  const messageN = message.username;
  const usernameN = usernameSpan.innerText;
  const isSelf = messageN == usernameN;
  const className = isSelf ? "message message--own" : "message";

  chat.appendChild(
    Object.assign(document.createElement("li"), {
      classList: className,
      innerHTML: messageToHtml(message, isSelf),
    })
  );
  chat.scrollTop = chat.scrollHeight;
}
