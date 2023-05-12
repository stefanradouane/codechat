import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import * as random from "lib0/random";
import * as themes from "@uiw/codemirror-themes-all";

export const ydocs = {
  js: new Y.Doc(),
  css: new Y.Doc(),
  html: new Y.Doc(),
};

/**
 *
 * @param {String} lang js | css | html
 */
export const providers = {
  js: new WebrtcProvider("js", ydocs["js"], {}),
  css: new WebrtcProvider("css", ydocs["css"], {}),
  html: new WebrtcProvider("html", ydocs["html"], {}),
};

export const syntaxHighlights = {
  js: javascript(),
  css: css(),
  html: html(),
};

export const usercolors = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

export const userColor = usercolors[random.uint32() % usercolors.length];

export function clearEditors() {
  const editors = document.querySelectorAll(".editor");
  editors.forEach((editor) => {
    editor.innerHTML = "";
  });
}

export const filteredThemes = Object.entries(themes)
  .filter(([key, value]) => !key.includes("Init") && !key.includes("default"))
  .reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {});

export const styleOptions = (def) => {
  return Object.entries(filteredThemes).map(([key, value]) => {
    return Object.assign(document.createElement("option"), {
      value: key,
      text: key,
      selected: key === def ? true : false,
    });
  });
};
