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
