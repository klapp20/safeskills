document.addEventListener("DOMContentLoaded", () => {
  ensureAdminPageAccess("#adminRegistrationContent");
  if (sessionStorage.getItem("wow-admin-auth") !== "1") return;

  const form = document.querySelector("#registrationSettingsForm");
  const titleInput = document.querySelector("#registrationSettingsTitle");
  const introInput = document.querySelector("#registrationSettingsIntro");
  const successInput = document.querySelector("#registrationSettingsSuccessMessage");
  const feedback = document.querySelector("#registrationSettingsFeedback");
  const overview = document.querySelector("#adminRegistrationOverview");

  function renderOverview() {
    const title = getAdminRegistrationTitle();
    const intro = getAdminRegistrationIntro();
    const successMessage = getAdminRegistrationSuccessMessage();

    titleInput.value = title;
    introInput.value = intro;
    successInput.value = successMessage;

    overview.innerHTML = `
      <article class="activity-item">
        <h5>Registration title</h5>
        <p class="activity-meta">${title ? adminEscapeHtml(title) : "Using default registration title."}</p>
      </article>
      <article class="activity-item">
        <h5>Registration intro</h5>
        <p class="activity-meta">${intro ? adminEscapeHtml(intro) : "Using default registration intro."}</p>
      </article>
      <article class="activity-item">
        <h5>Success message</h5>
        <p class="activity-meta">${successMessage ? adminEscapeHtml(successMessage) : "Using default success message."}</p>
      </article>
    `;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveAdminRegistrationTitle(titleInput.value.trim());
    saveAdminRegistrationIntro(introInput.value.trim());
    saveAdminRegistrationSuccessMessage(successInput.value.trim());
    feedback.textContent = "Registration settings saved.";
    renderOverview();
  });

  renderOverview();
});
