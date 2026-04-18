const studentAccessKeys = {
  approved: "safe-skills-registration-approved",
  studentSession: "safe-skills-student-auth"
};

function getApprovedStudentRegistration() {
  try {
    const approved = JSON.parse(localStorage.getItem(studentAccessKeys.approved) || "null");
    const storedPasswords = JSON.parse(localStorage.getItem("safe-skills-student-passwords") || "{}");

    if (approved?.email && storedPasswords[approved.email.toLowerCase()]) {
      approved.password = storedPasswords[approved.email.toLowerCase()];
    }

    return approved;
  } catch (error) {
    return null;
  }
}

function setStudentSession(registration) {
  if (!registration) {
    return;
  }

  sessionStorage.setItem(studentAccessKeys.studentSession, JSON.stringify({
    email: registration.email,
    fullName: registration.fullName
  }));
}

async function findStudentForLogin(email, password) {
  const approved = getApprovedStudentRegistration();

  if (approved?.email?.toLowerCase() === email && approved.password === password) {
    return approved;
  }

  if (window.safeSkillsBackendClient?.isReady()) {
    return window.safeSkillsBackendClient.verifyStudent(email, password);
  }

  return null;
}

function getStudentEnrollmentStatus(email) {
  try {
    const enrollments = JSON.parse(localStorage.getItem("wow-course-enrollments") || "[]");
    const enrollment = enrollments.find((item) => item.memberEmail?.toLowerCase() === email?.toLowerCase());
    return enrollment?.statusLabel || "";
  } catch (error) {
    return "";
  }
}

function initializeStudentHomeLogin() {
  const loginForm = document.querySelector("#studentHomeLoginForm");
  const forgotForm = document.querySelector("#studentForgotLoginForm");
  const forgotModal = document.querySelector("#studentForgotPasswordModal");
  const showForgotButton = document.querySelector("#showForgotStudentLogin");
  const closeForgotButton = document.querySelector("#closeForgotStudentLogin");
  const loginFeedback = document.querySelector("#studentHomeLoginFeedback");
  const forgotFeedback = document.querySelector("#studentForgotLoginFeedback");
  const studentStatus = document.querySelector("#studentCourseStatus");
  const studentStatusActions = document.querySelector("#studentCourseStatusActions");

  if (!loginForm || !forgotForm || !loginFeedback || !forgotFeedback) {
    return;
  }

  async function renderStudentStatus() {
    const approved = getApprovedStudentRegistration();
    const session = JSON.parse(sessionStorage.getItem(studentAccessKeys.studentSession) || "null");

    if (!studentStatus || !studentStatusActions) {
      return;
    }

    if (session?.email && approved?.email && session.email.toLowerCase() === approved.email.toLowerCase()) {
      const firstName = (approved.fullName || approved.email || "").trim().split(/\s+/)[0] || approved.email;
      studentStatus.innerHTML = `Student course status: <a class="student-status-link student-status-name-link" href="course.html">Hello ${escapeStudentHtml(firstName)}</a>`;
      studentStatusActions.innerHTML = `
        <a class="student-status-link" href="course.html">Go To Course</a>
      `;
      return;
    }

    studentStatus.innerHTML = `Student course status: <strong class="student-status-alert">Not logged in.</strong>`;
    studentStatusActions.innerHTML = `<a class="student-status-link" href="#signup">Log Into Course</a>`;
  }

  renderStudentStatus();

  function resetForgotModalState() {
    forgotForm.reset();
    forgotFeedback.textContent = "Enter your registration email if you need to reset your password.";
  }

  function openForgotModal(event) {
    event?.preventDefault();
    resetForgotModalState();
    forgotModal?.classList.remove("hidden");
    forgotModal?.setAttribute("aria-hidden", "false");
    document.querySelector("#studentForgotEmail")?.focus();
  }

  function closeForgotModal(event) {
    event?.preventDefault();
    forgotModal?.classList.add("hidden");
    forgotModal?.setAttribute("aria-hidden", "true");
  }

  showForgotButton?.addEventListener("click", openForgotModal);
  closeForgotButton?.addEventListener("click", closeForgotModal);
  forgotModal?.addEventListener("click", (event) => {
    if (
      event.target instanceof HTMLElement
      && (event.target.dataset.closeStudentModal === "true" || event.target.id === "closeForgotStudentLogin")
    ) {
      closeForgotModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && forgotModal && !forgotModal.classList.contains("hidden")) {
      closeForgotModal();
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#studentHomeEmail")?.value.trim().toLowerCase();
    const password = document.querySelector("#studentHomePassword")?.value.trim();
    const approved = await findStudentForLogin(email, password);

    if (!approved) {
      loginFeedback.textContent = "That login was not found in this browser. Use your registration email and password, or choose Forgot login.";
      return;
    }

    if (getStudentEnrollmentStatus(approved.email) === "Completed by Admin") {
      loginFeedback.textContent = "This course has been marked completed by the admin and is no longer available for access.";
      return;
    }

    setStudentSession(approved);
    localStorage.setItem(studentAccessKeys.approved, JSON.stringify(approved));
    renderStudentStatus();
    window.location.href = "portal.html";
  });

  forgotForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const approved = getApprovedStudentRegistration();
    const email = document.querySelector("#studentForgotEmail")?.value.trim().toLowerCase();

    if (!approved || approved.email.toLowerCase() !== email) {
      forgotFeedback.textContent = "No saved registration was found for that email in this browser yet.";
      return;
    }

    const resetToken = `reset-${Date.now().toString(36)}`;
    const resetLink = `${window.location.origin}${window.location.pathname.replace(/index\.html$/i, "")}reset-password.html?token=${resetToken}`;
    forgotFeedback.innerHTML = `Reset link sent for <strong>${approved.email}</strong>.<br>This prototype shows the link here: <a href="${resetLink}">Reset Password</a>`;
  });
}

initializeStudentHomeLogin();

function escapeStudentHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
