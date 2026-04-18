const registrationStorageKeys = {
  pending: "safe-skills-registration-pending",
  approved: "safe-skills-registration-approved",
  stripeLink: "safe-skills-stripe-payment-link",
  stripeSuccessUrl: "safe-skills-stripe-success-url",
  stripeCancelUrl: "safe-skills-stripe-cancel-url",
  contractNumberSeed: "safe-skills-contract-seed"
};

const registrationDefaultStripeLink = "https://buy.stripe.com/test_placeholder";

function loadPublishedRegistrationCourse() {
  return window.safeSkillsPublishedCourse || { price: "$49.00", title: "Safe Skills Driving School Member Course" };
}

function saveApprovedRegistration(profile) {
  localStorage.setItem(registrationStorageKeys.approved, JSON.stringify(profile));
  if (typeof upsertAdminStudentProfile === "function") {
    upsertAdminStudentProfile(profile);
  }
}

function formatIsoDateForDisplay(value) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  }).format(parsed);
}

function buildRegistrationFullName(profile) {
  return `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
}

document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.querySelector("#registrationForm");
  const coursePrice = document.querySelector("#registrationCoursePrice");
  const successMessage = document.querySelector("#registrationSuccessMessage");
  const registrationTitle = document.querySelector("#registrationPageTitle");
  const registrationIntro = document.querySelector("#registrationPageIntro");
  const registrationSuccessIntro = document.querySelector("#registrationSuccessIntro");
  const course = loadPublishedRegistrationCourse();
  const savedRegistrationTitle = localStorage.getItem("safe-skills-registration-title") || "";
  const savedRegistrationIntro = localStorage.getItem("safe-skills-registration-intro") || "";
  const savedRegistrationSuccessMessage = localStorage.getItem("safe-skills-registration-success-message") || "";

  if (registrationTitle && savedRegistrationTitle) {
    registrationTitle.textContent = savedRegistrationTitle;
  }
  if (registrationIntro && savedRegistrationIntro) {
    registrationIntro.textContent = savedRegistrationIntro;
  }
  if (registrationSuccessIntro && savedRegistrationSuccessMessage) {
    registrationSuccessIntro.textContent = savedRegistrationSuccessMessage;
  }

  if (coursePrice) {
    coursePrice.textContent = course.price || "$49.00";
  }

  if (registrationForm) {
    registrationForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const profile = {
        firstName: document.querySelector("#registrationFirstName").value.trim(),
        lastName: document.querySelector("#registrationLastName").value.trim(),
        email: document.querySelector("#registrationEmail").value.trim(),
        phone: document.querySelector("#registrationPhone").value.trim(),
        address1: document.querySelector("#registrationAddress1").value.trim(),
        address2: document.querySelector("#registrationAddress2").value.trim(),
        city: document.querySelector("#registrationCity").value.trim(),
        state: document.querySelector("#registrationState").value.trim(),
        zip: document.querySelector("#registrationZip").value.trim(),
        birthDate: document.querySelector("#registrationBirthDate").value.trim(),
        driverLicenseNumber: document.querySelector("#registrationDriverLicense").value.trim(),
        password: document.querySelector("#registrationPassword").value.trim(),
        contractNumber: assignNextStudentContractNumber(),
        permitTestDate: "",
        studentSchool: getStudentSchoolName(),
        courseTitle: course.title,
        amount: course.price,
        registeredAt: new Date().toISOString()
      };

      localStorage.setItem(registrationStorageKeys.pending, JSON.stringify(profile));
      if (typeof upsertAdminStudentProfile === "function") {
        upsertAdminStudentProfile({
          ...profile,
          fullName: buildRegistrationFullName(profile)
        });
      }
      if (window.safeSkillsBackendClient?.isReady()) {
        await window.safeSkillsBackendClient.upsertStudent({
          ...profile,
          fullName: buildRegistrationFullName(profile)
        });
      }
      const feedback = document.querySelector("#registrationFeedback");
      const stripeLink = localStorage.getItem(registrationStorageKeys.stripeLink) || registrationDefaultStripeLink;
      const successUrl = localStorage.getItem(registrationStorageKeys.stripeSuccessUrl) || "registration-success.html";
      const cancelUrl = localStorage.getItem(registrationStorageKeys.stripeCancelUrl) || "registration.html";

      if (stripeLink === registrationDefaultStripeLink) {
        feedback.textContent = "Add your real Stripe payment link in registration.js or localStorage before going live. Redirecting to the success page now for testing.";
        saveApprovedRegistration(profile);
        window.setTimeout(() => {
          window.location.href = "registration-success.html";
        }, 800);
        return;
      }

      feedback.textContent = "Profile saved. Redirecting to Stripe payment now.";
      const joiner = stripeLink.includes("?") ? "&" : "?";
      window.location.href = `${stripeLink}${joiner}client_reference_id=${encodeURIComponent(profile.email)}&success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;
    });
  }

  if (successMessage) {
    let pending = null;
    try {
      pending = JSON.parse(localStorage.getItem(registrationStorageKeys.pending) || "null");
    } catch (error) {
      pending = null;
    }

    if (pending) {
      const approvedProfile = {
        fullName: buildRegistrationFullName(pending),
        email: pending.email,
        phone: pending.phone,
        address1: pending.address1,
        address2: pending.address2,
        city: pending.city,
        state: pending.state,
        zip: pending.zip,
        birthDate: pending.birthDate,
        driverLicenseNumber: pending.driverLicenseNumber,
        contractNumber: pending.contractNumber,
        permitTestDate: pending.permitTestDate,
        studentSchool: pending.studentSchool,
        password: pending.password,
        courseTitle: pending.courseTitle,
        paidAt: new Date().toISOString(),
        amount: pending.amount,
        contractDate: formatIsoDateForDisplay(new Date().toISOString()),
        paymentNumber: `PAY-${pending.contractNumber}`
      };
      saveApprovedRegistration(approvedProfile);
      if (window.safeSkillsBackendClient?.isReady()) {
        window.safeSkillsBackendClient.upsertStudent(approvedProfile);
      }
      localStorage.removeItem(registrationStorageKeys.pending);
      successMessage.innerHTML = `
        <article class="activity-item">
          <h5>Registration complete for ${pending.firstName} ${pending.lastName}</h5>
          <p class="activity-meta">${pending.email}</p>
          <p class="activity-meta">Contract number ${pending.contractNumber}</p>
          <p class="activity-meta">Payment recorded for ${pending.courseTitle} at ${pending.amount}.</p>
        </article>
      `;
      return;
    }

    successMessage.innerHTML = `<div class="empty-state">No pending registration was found in this browser. If you just paid through Stripe, return here from the same browser session.</div>`;
  }
});
