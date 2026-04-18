document.addEventListener("DOMContentLoaded", () => {
  ensureAdminPageAccess("#adminPaymentsContent");
  if (sessionStorage.getItem("wow-admin-auth") !== "1") return;

  const stripeForm = document.querySelector("#stripePaymentSettingsForm");
  const stripePaymentLinkInput = document.querySelector("#stripePaymentLink");
  const stripeSuccessUrlInput = document.querySelector("#stripeSuccessUrl");
  const stripeCancelUrlInput = document.querySelector("#stripeCancelUrl");
  const stripePaymentFeedback = document.querySelector("#stripePaymentFeedback");
  const overview = document.querySelector("#adminPaymentsOverview");

  function renderOverview() {
    const savedStripeLink = getAdminStripePaymentLink();
    const savedStripeSuccessUrl = getAdminStripeSuccessUrl();
    const savedStripeCancelUrl = getAdminStripeCancelUrl();

    stripePaymentLinkInput.value = savedStripeLink;
    stripeSuccessUrlInput.value = savedStripeSuccessUrl;
    stripeCancelUrlInput.value = savedStripeCancelUrl;

    overview.innerHTML = `
      <article class="activity-item">
        <h5>Stripe payment link</h5>
        <p class="activity-meta">${savedStripeLink ? adminEscapeHtml(savedStripeLink) : "No Stripe payment link saved yet."}</p>
      </article>
      <article class="activity-item">
        <h5>Success URL</h5>
        <p class="activity-meta">${savedStripeSuccessUrl ? adminEscapeHtml(savedStripeSuccessUrl) : "No success URL saved yet."}</p>
      </article>
      <article class="activity-item">
        <h5>Cancel URL</h5>
        <p class="activity-meta">${savedStripeCancelUrl ? adminEscapeHtml(savedStripeCancelUrl) : "No cancel URL saved yet."}</p>
      </article>
    `;
  }

  stripeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveAdminStripePaymentLink(stripePaymentLinkInput.value.trim());
    saveAdminStripeSuccessUrl(stripeSuccessUrlInput.value.trim());
    saveAdminStripeCancelUrl(stripeCancelUrlInput.value.trim());
    stripePaymentFeedback.textContent = "Stripe payment settings saved.";
    renderOverview();
  });

  renderOverview();
});
