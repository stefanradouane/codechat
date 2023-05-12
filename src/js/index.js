import "./editor/editor.js";
import "./layout/layout.js";

const socket = io();
const socketIdSpan = document.getElementById("socketId");
const usernameSpan = document.getElementById("username");
const avatarImg = document.getElementById("avatar");

socket.on("connect", () => {
  socketIdSpan.innerText = socket.id;

  socket.emit("whoami", (user) => {
    // console.log(user);
    usernameSpan.innerText = `${user.name} ${user.surname}`;
    createAvatar(user.avatar);
  });
});

let chat = document.querySelector(".chat");
let input = document.querySelector("input");

document.getElementById("test")?.addEventListener("submit", (event) => {
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
    document.querySelector("[data-users]")?.appendChild(
      Object.assign(document.createElement("li"), {
        classList: "connection connection--connected",
        innerHTML: `${user.user.name} ${
          user.user.surname
        } <span class="connection__room">Room: ${
          user.room == null ? "lobby" : user.room
        }</span>`,
      })
    );
  });
});

socket.on("message", (message) => {
  addMessage(message);

  const isOpen = document.querySelector(".content--chat");
  console.log(isOpen);
  if (!isOpen) {
    const chatTab = document.querySelector("[data-nav-control='chat']");
    chatTab.classList.add("nav__list-control--new-message");
  }
});

function messageToHtml(message, isSelf) {
  console.log(message, isSelf);
  return `
      <p class="message__user">${isSelf ? "U" : message.username}</p>
      <p class="message__content">${message.message}</p>
      <p class="message__date">${message.date}</p>`;
}

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

function createAvatar(avatar) {
  if (avatar.startsWith(`https://`) || avatar.startsWith(`http://`)) {
    avatarImg.src = avatar;
  } else {
    const parsedEmoji = JSON.parse(avatar.replaceAll(`'`, `"`));
    const emoji = parsedEmoji[Math.floor(Math.random() * parsedEmoji.length)];
    avatarImg.parentElement.replaceChild(
      Object.assign(document.createElement("div"), {
        classList: avatarImg.classList,
        innerHTML: emoji,
      }),
      avatarImg
    );
  }
}
