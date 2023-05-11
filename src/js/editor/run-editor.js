const run = document.querySelector("[data-code-run]");

if (run) {
  run.addEventListener("click", (event) => {
    const value = {
      html: cmHTML.state.doc.toString(),
      css: cmCSS.state.doc.toString(),
      js: view.state.doc.toString(),
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
  });
}
