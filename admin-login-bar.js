document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".js-admin-login-bar");

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const emailInput = form.querySelector('input[name="admin_email"]');
      const passwordInput = form.querySelector('input[name="admin_password"]');
      const feedback = form.parentElement?.querySelector(".js-admin-login-feedback");

      const email = emailInput?.value.trim().toLowerCase();
      const password = passwordInput?.value.trim();

      if (email !== "kim@wingsoverwisconsin.org" || password !== "testadmin") {
        if (feedback) {
          feedback.textContent = "Admin login did not match.";
        }
        return;
      }

      sessionStorage.setItem("wow-admin-auth", "1");
      window.location.href = "admin.html";
    });
  });
});
