document.addEventListener("DOMContentLoaded", () => {
  ensureAdminPageAccess("#adminBackendContent");
  if (sessionStorage.getItem("wow-admin-auth") !== "1") return;

  const form = document.querySelector("#backendSettingsForm");
  const enabled = document.querySelector("#backendEnabled");
  const url = document.querySelector("#backendUrl");
  const secret = document.querySelector("#backendSecret");
  const feedback = document.querySelector("#backendSettingsFeedback");
  const settings = window.safeSkillsBackendClient.getSettings();

  enabled.checked = settings.enabled;
  url.value = settings.url;
  secret.value = settings.secret;

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    window.safeSkillsBackendClient.saveSettings({
      enabled: enabled.checked,
      url: url.value.trim(),
      secret: secret.value.trim()
    });
    feedback.textContent = "Backend settings saved.";
  });
});
