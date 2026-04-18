(function applyPageContentOverrides() {
  const page = document.body?.dataset?.pageEditorId;
  if (!page) return;

  const storageKey = `safe-skills-page-overrides::${page}`;
  let localOverrides = {};
  const publishedOverrides = window.safeSkillsPublishedPageOverrides?.[page] || {};

  try {
    localOverrides = JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch (error) {
    localOverrides = {};
  }

  const overrides = { ...publishedOverrides, ...localOverrides };

  Object.entries(overrides).forEach(([key, value]) => {
    const element = document.querySelector(`[data-edit-key="${key}"]`);
    if (!element || !value) return;

    if (value.type === "text") {
      element.textContent = value.value;
    }

    if (value.type === "html") {
      element.innerHTML = value.value;
    }

    if (value.type === "href") {
      element.setAttribute("href", value.value);
    }
  });
})();
