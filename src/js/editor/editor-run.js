function runScript(viewJS, viewHTML, viewCSS) {
  const value = {
    html: viewHTML.state.doc.toString(),
    css: viewCSS.state.doc.toString(),
    js: viewJS.state.doc.toString(),
  };

  const iframe = document.querySelector("[data-iframe]");
  const x = iframe.contentDocument;
  const head = x.head;

  if (head.children.length >= 1) {
    head.removeChild(head.children[0]);
  }
  head.appendChild(
    Object.assign(document.createElement("style"), {
      classList: "stylesheet-editor",
      innerHTML: value.css,
    })
  );

  const body = x.body;

  const main = Object.assign(document.createElement("main"), {
    classList: "html-editor",
    innerHTML: value.html,
  });

  const newScript = Object.assign(document.createElement("script"), {
    classList: "script-editor",
    innerHTML: baseScript(value.js),
    defer: true,
  });

  function baseScript(script) {
    return "(function() {" + script + "})()";
  }
  var oldScript = body.querySelector("script");
  if (oldScript) {
    oldScript.parentNode.removeChild(oldScript);
  }
  body.innerHTML = main.outerHTML;
  body.appendChild(newScript);
}

export default runScript;
