import { clearEditors, filteredThemes, styleOptions } from "./editor-config.js";
import editor from "./editor-editor.js";
import runScript from "./editor-run.js";

const styleSelect = document.querySelector("[data-editor-style]");
const defaultStyle = "abcdef";
// const pages = [
//   "home",
//   "product",
//   "lijst",
//   "bestel",
//   "faq",
//   "contact",
//   "overons",
//   "portfolio",
//   "blog",
// ];

if (styleSelect) {
  styleSelect.append(...styleOptions(defaultStyle));
}

const socket = io();

const run = document.querySelector("[data-code-run]");

socket.on("connect", () => {
  socket.emit("whoami", (name) => {
    function editors(type, lobby) {
      clearEditors();
      const theme = type;
      const viewJS = editor(`${name.name} ${name.surname}`, "js", theme, lobby);
      const viewHTML = editor(
        `${name.name} ${name.surname}`,
        "html",
        theme,
        lobby
      );
      const viewCSS = editor(
        `${name.name} ${name.surname}`,
        "css",
        theme,
        lobby
      );

      if (run) {
        run.addEventListener("click", () =>
          runScript(viewJS, viewHTML, viewCSS)
        );
      }
    }

    const room = new URL(window.location.href).searchParams.get("room");

    if (styleSelect) {
      styleSelect.addEventListener("change", (event) => {
        editors(event.target.value, room);

        if (event.target.value == "default") {
          const editors = document.querySelectorAll(".editor");
          editors.forEach((editor) => {
            editor.classList.add("editor--default");
          });
        } else {
          const editors = document.querySelectorAll(".editor");
          editors.forEach((editor) => {
            editor.classList.remove("editor--default");
          });
        }
      });
    }
    // Start !
    if (room) {
      editors(defaultStyle, room);
    }
  });
});
