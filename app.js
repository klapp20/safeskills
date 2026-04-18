const adminAccount = {
  email: "kim@wingsoverwisconsin.org",
  password: "testadmin"
};

const studentAccessKeys = {
  approvedRegistration: "safe-skills-registration-approved",
  studentSession: "safe-skills-student-auth"
};

const defaultDocuments = [
  {
    id: "starter-brand-kit",
    title: "Brand Standards Starter",
    category: "Marketing",
    description: "Upload your official logo sheet, approved colors, and event branding guide here.",
    filename: "Add your file here",
    uploadedAt: "April 17, 2026",
    fileId: null
  }
];

const defaultTemplates = [
  {
    id: "supply-request",
    title: "Supply Request",
    description: "Use this form to request brochures, banners, booth supplies, or printed materials.",
    fields: ["Needed item", "Event date", "Quantity", "Notes"]
  },
  {
    id: "marketing-help",
    title: "Marketing Support Request",
    description: "Use this form to request social graphics, flyer help, or messaging support.",
    fields: ["Campaign or event", "Due date", "Audience", "Requested support"]
  }
];

const defaultCourse = {
  title: "Safe Skills Driving School Member Course",
  description: "Build your 2-hour member course here. Members must complete each page in order, pass checkpoint quizzes, and finish the final exam to earn a certificate.",
  price: "$49.00",
  passingScore: 80,
  pages: [
    {
      id: "lesson-1",
      title: "Lesson 1 - Welcome",
      minutesRequired: 5,
      content: "Use the admin course builder to replace this sample lesson with your real training material. Members stay on each page until the required time has passed before they can continue.",
      quiz: {
        question: "What happens before a member can go to the next page?",
        options: [
          "They must finish the required time on the page",
          "They can skip any time lock",
          "They only need to refresh the page"
        ],
        correctAnswer: "They must finish the required time on the page"
      }
    }
  ],
  finalExam: [
    {
      id: "final-1",
      question: "What do members receive after passing the final test?",
      options: ["A certificate", "A toolkit upload", "A chapter code"],
      correctAnswer: "A certificate"
    }
  ]
};

const storageKeys = {
  documents: "wow-documents",
  templates: "wow-request-templates",
  memberships: "wow-membership-uploads",
  requests: "wow-chapter-requests",
  course: "wow-course",
  enrollments: "wow-course-enrollments"
};

const elements = {
  jumpToAccess: document.querySelector("#jumpToAccess"),
  jumpToAdminLogin: document.querySelector("#jumpToAdminLogin"),
  logoutSession: document.querySelector("#logoutSession"),
  hero: document.querySelector(".hero"),
  portalLayout: document.querySelector(".portal-layout"),
  accessPanel: document.querySelector(".access-panel"),
  dashboardPanel: document.querySelector(".dashboard-panel"),
  openAdminDemo: document.querySelector("#openAdminDemo"),
  chapterLoginForm: document.querySelector("#chapterLoginForm"),
  adminLoginForm: document.querySelector("#adminLoginForm"),
  chapterEmail: document.querySelector("#chapterEmail"),
  chapterPassword: document.querySelector("#chapterPassword"),
  adminEmail: document.querySelector("#adminEmail"),
  adminPassword: document.querySelector("#adminPassword"),
  fillChapterDemo: document.querySelector("#fillChapterDemo"),
  fillAdminDemo: document.querySelector("#fillAdminDemo"),
  chapterLoginFeedback: document.querySelector("#chapterLoginFeedback"),
  adminLoginFeedback: document.querySelector("#adminLoginFeedback"),
  welcomeTitle: document.querySelector("#welcomeTitle"),
  welcomeText: document.querySelector("#welcomeText"),
  portalStatus: document.querySelector("#portalStatus"),
  lockedState: document.querySelector("#lockedState"),
  chapterPortal: document.querySelector("#chapterPortal"),
  adminPortal: document.querySelector("#adminPortal"),
  memberNav: document.querySelector("#memberNav"),
  chapterWelcomeName: document.querySelector("#chapterWelcomeName"),
  chapterWelcomeMeta: document.querySelector("#chapterWelcomeMeta"),
  toolkitCount: document.querySelector("#toolkitCount"),
  chapterCoursePageCount: document.querySelector("#chapterCoursePageCount"),
  chapterDocuments: document.querySelector("#chapterDocuments"),
  membershipUploadForm: document.querySelector("#membershipUploadForm"),
  membershipChapterName: document.querySelector("#membershipChapterName"),
  membershipMonth: document.querySelector("#membershipMonth"),
  membershipFile: document.querySelector("#membershipFile"),
  membershipFeedback: document.querySelector("#membershipFeedback"),
  requestForm: document.querySelector("#requestForm"),
  requestTypeSelect: document.querySelector("#requestTypeSelect"),
  dynamicRequestFields: document.querySelector("#dynamicRequestFields"),
  requestFeedback: document.querySelector("#requestFeedback"),
  chapterActivity: document.querySelector("#chapterActivity"),
  courseTitle: document.querySelector("#courseTitle"),
  courseSummary: document.querySelector("#courseSummary"),
  memberCourseName: document.querySelector("#memberCourseName"),
  memberCourseEmail: document.querySelector("#memberCourseEmail"),
  enrollInCourse: document.querySelector("#enrollInCourse"),
  courseEnrollmentFeedback: document.querySelector("#courseEnrollmentFeedback"),
  courseNav: document.querySelector("#courseNav"),
  courseLessonState: document.querySelector("#courseLessonState"),
  courseCertificate: document.querySelector("#courseCertificate"),
  adminMembershipCount: document.querySelector("#adminMembershipCount"),
  adminEnrollmentCount: document.querySelector("#adminEnrollmentCount"),
  documentUploadForm: document.querySelector("#documentUploadForm"),
  documentTitle: document.querySelector("#documentTitle"),
  documentCategory: document.querySelector("#documentCategory"),
  documentDescription: document.querySelector("#documentDescription"),
  documentFile: document.querySelector("#documentFile"),
  documentFeedback: document.querySelector("#documentFeedback"),
  requestTemplateForm: document.querySelector("#requestTemplateForm"),
  templateTitle: document.querySelector("#templateTitle"),
  templateDescription: document.querySelector("#templateDescription"),
  templateFields: document.querySelector("#templateFields"),
  templateFeedback: document.querySelector("#templateFeedback"),
  courseSettingsForm: document.querySelector("#courseSettingsForm"),
  courseSettingsTitle: document.querySelector("#courseSettingsTitle"),
  courseSettingsPrice: document.querySelector("#courseSettingsPrice"),
  courseSettingsDescription: document.querySelector("#courseSettingsDescription"),
  courseSettingsPassingScore: document.querySelector("#courseSettingsPassingScore"),
  courseSettingsFeedback: document.querySelector("#courseSettingsFeedback"),
  coursePageForm: document.querySelector("#coursePageForm"),
  coursePageTitle: document.querySelector("#coursePageTitle"),
  coursePageMinutes: document.querySelector("#coursePageMinutes"),
  coursePageContent: document.querySelector("#coursePageContent"),
  coursePageQuizQuestion: document.querySelector("#coursePageQuizQuestion"),
  coursePageQuizOptions: document.querySelector("#coursePageQuizOptions"),
  coursePageQuizCorrect: document.querySelector("#coursePageQuizCorrect"),
  coursePageFeedback: document.querySelector("#coursePageFeedback"),
  finalExamForm: document.querySelector("#finalExamForm"),
  finalExamQuestion: document.querySelector("#finalExamQuestion"),
  finalExamOptions: document.querySelector("#finalExamOptions"),
  finalExamCorrect: document.querySelector("#finalExamCorrect"),
  finalExamFeedback: document.querySelector("#finalExamFeedback"),
  adminCourseOverview: document.querySelector("#adminCourseOverview"),
  adminDocuments: document.querySelector("#adminDocuments"),
  adminMembershipUploads: document.querySelector("#adminMembershipUploads"),
  adminTemplates: document.querySelector("#adminTemplates"),
  adminRequests: document.querySelector("#adminRequests"),
  adminEnrollments: document.querySelector("#adminEnrollments")
};

const state = {
  currentChapter: null,
  documents: loadCollection(storageKeys.documents, defaultDocuments),
  templates: loadCollection(storageKeys.templates, defaultTemplates),
  memberships: loadCollection(storageKeys.memberships, []),
  requests: loadCollection(storageKeys.requests, []),
  course: loadCollection(storageKeys.course, defaultCourse),
  enrollments: loadCollection(storageKeys.enrollments, []),
  activeEnrollmentId: null,
  currentCoursePageIndex: 0,
  currentTimerId: null,
  memberPortalView: "home"
};

const isAdminPage = window.location.pathname.toLowerCase().endsWith("/admin.html")
  || window.location.pathname.toLowerCase().endsWith("\\admin.html");

function loadCollection(key, fallback) {
  const stored = localStorage.getItem(key);

  if (!stored) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return structuredClone(fallback);
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return structuredClone(fallback);
  }
}

function saveCollection(key, collection) {
  localStorage.setItem(key, JSON.stringify(collection));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function getApprovedRegistration() {
  try {
    return JSON.parse(localStorage.getItem(studentAccessKeys.approvedRegistration) || "null");
  } catch (error) {
    return null;
  }
}

function getStudentSession() {
  try {
    return JSON.parse(sessionStorage.getItem(studentAccessKeys.studentSession) || "null");
  } catch (error) {
    return null;
  }
}

function setStudentSession(account) {
  sessionStorage.setItem(studentAccessKeys.studentSession, JSON.stringify({
    email: account.email,
    leaderName: account.leaderName,
    chapterName: account.chapterName
  }));
}

function clearStudentSession() {
  sessionStorage.removeItem(studentAccessKeys.studentSession);
}

function buildStudentPortalAccount() {
  const approved = getApprovedRegistration();

  if (!approved) {
    return null;
  }

  return {
    email: approved.email,
    password: approved.password,
    chapterName: approved.fullName || "Registered Student",
    leaderName: approved.fullName || "Registered Student"
  };
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("wings-over-wisconsin-hub", 1);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains("files")) {
        database.createObjectStore("files", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveFileRecord(id, file) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.put({ id, file });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function getFileRecord(id) {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction("files", "readonly");
    const store = transaction.objectStore("files");
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function deleteFileRecord(id) {
  if (!id) {
    return;
  }

  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.delete(id);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function showPortalState(mode) {
  elements.lockedState?.classList.toggle("hidden", mode !== "locked");
  elements.chapterPortal?.classList.toggle("hidden", mode !== "chapter");
  elements.adminPortal?.classList.toggle("hidden", mode !== "admin");

  if (elements.hero) {
    elements.hero.classList.toggle("hidden", mode === "chapter");
  }

  if (elements.portalLayout) {
    elements.portalLayout.classList.toggle("member-logged-in", mode === "chapter");
    elements.portalLayout.classList.toggle("portal-locked", mode === "locked");
  }

  if (elements.accessPanel) {
    elements.accessPanel.classList.toggle("hidden", mode === "chapter");
  }

  if (elements.dashboardPanel) {
    elements.dashboardPanel.classList.toggle("member-full-width", mode === "chapter");
  }
}

function updateLogoutVisibility() {
  if (!elements.logoutSession) {
    return;
  }

  const shouldShow = isAdminPage
    ? sessionStorage.getItem("wow-admin-auth") === "1"
    : Boolean(state.currentChapter) || Boolean(getStudentSession()) || sessionStorage.getItem("wow-admin-auth") === "1";

  elements.logoutSession.classList.toggle("hidden", !shouldShow);
}

function setMemberPortalView(view) {
  state.memberPortalView = view;

  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.viewPanel !== view);
  });

  document.querySelectorAll("[data-member-view]").forEach((button) => {
    if (button.classList.contains("member-nav-link")) {
      button.classList.toggle("active", button.dataset.memberView === view);
    }
  });
}

function setStatus(text, variant = "locked") {
  elements.portalStatus.textContent = text;
  elements.portalStatus.className = "status-pill";

  if (variant === "chapter") {
    elements.portalStatus.classList.add("active");
  }

  if (variant === "admin") {
    elements.portalStatus.classList.add("admin");
  }
}

function saveCourse() {
  saveCollection(storageKeys.course, state.course);
}

function saveEnrollments() {
  saveCollection(storageKeys.enrollments, state.enrollments);
}

function totalCourseMinutes() {
  return state.course.pages.reduce((total, page) => total + Number(page.minutesRequired || 0), 0);
}

function getActiveEnrollment() {
  return state.enrollments.find((item) => item.id === state.activeEnrollmentId) || null;
}

function renderDocumentsForChapters() {
  if (!elements.chapterDocuments) {
    return;
  }

  if (elements.toolkitCount) {
    elements.toolkitCount.textContent = `${state.documents.length} documents`;
  }

  if (!state.documents.length) {
    elements.chapterDocuments.innerHTML = `<div class="empty-state">No toolkit documents have been uploaded yet.</div>`;
    return;
  }

  elements.chapterDocuments.innerHTML = state.documents.map((document) => {
    const buttonLabel = document.fileId ? "Download file" : "File coming soon";
    const buttonDisabled = document.fileId ? "" : "disabled";

    return `
      <article class="resource-card">
        <span class="resource-badge">${escapeHtml(document.category)}</span>
        <h4>${escapeHtml(document.title)}</h4>
        <p>${escapeHtml(document.description)}</p>
        <ul class="document-meta">
          <li>File: ${escapeHtml(document.filename)}</li>
          <li>Added: ${escapeHtml(document.uploadedAt)}</li>
        </ul>
        <div class="activity-actions">
          <button class="small-button" data-action="download-doc" data-id="${document.id}" ${buttonDisabled}>${buttonLabel}</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderRequestTemplateOptions() {
  if (!elements.requestTypeSelect || !elements.dynamicRequestFields) {
    return;
  }

  if (!state.templates.length) {
    elements.requestTypeSelect.innerHTML = `<option value="">No request forms available</option>`;
    elements.dynamicRequestFields.innerHTML = `<div class="empty-state">Create request forms in the admin area first.</div>`;
    return;
  }

  elements.requestTypeSelect.innerHTML = state.templates.map((template, index) => {
    return `<option value="${template.id}" ${index === 0 ? "selected" : ""}>${escapeHtml(template.title)}</option>`;
  }).join("");

  renderDynamicRequestFields(elements.requestTypeSelect.value);
}

function renderDynamicRequestFields(templateId) {
  const template = state.templates.find((item) => item.id === templateId);

  if (!template) {
    elements.dynamicRequestFields.innerHTML = "";
    return;
  }

  const fieldMarkup = template.fields.map((field, index) => {
    return `
      <label>
        ${escapeHtml(field)}
        <input type="text" name="field-${index}" data-field-label="${escapeHtml(field)}" placeholder="${escapeHtml(field)}" required>
      </label>
    `;
  }).join("");

  elements.dynamicRequestFields.innerHTML = `
    <div class="activity-item">
      <h5>${escapeHtml(template.title)}</h5>
      <p class="activity-meta">${escapeHtml(template.description)}</p>
    </div>
    ${fieldMarkup}
  `;
}

function renderChapterActivity() {
  if (!elements.chapterActivity) {
    return;
  }

  if (!state.currentChapter) {
    elements.chapterActivity.innerHTML = `<div class="empty-state">Sign in from the home page to see your portal activity.</div>`;
    return;
  }

  const membershipItems = state.memberships
    .filter((item) => item.chapterEmail === state.currentChapter.email)
    .map((item) => `
      <article class="activity-item">
        <h5>Membership upload: ${escapeHtml(item.chapterName)}</h5>
        <p class="activity-meta">${escapeHtml(item.reportingMonth)} | ${escapeHtml(item.filename)} | Submitted ${escapeHtml(item.submittedAt)}</p>
        <div class="activity-actions">
          <button class="small-button" data-action="download-membership" data-id="${item.id}">Download file</button>
        </div>
      </article>
    `);

  const requestItems = state.requests
    .filter((item) => item.chapterEmail === state.currentChapter.email)
    .map((item) => {
      const answers = item.answers.map((answer) => `${escapeHtml(answer.label)}: ${escapeHtml(answer.value)}`).join(" | ");
      return `
        <article class="activity-item">
          <h5>${escapeHtml(item.templateTitle)}</h5>
          <p class="activity-meta">${answers}</p>
          <p class="activity-meta">Submitted ${escapeHtml(item.submittedAt)}</p>
        </article>
      `;
    });

  const enrollmentItems = state.enrollments
    .filter((item) => item.memberEmail?.toLowerCase() === state.currentChapter.email.toLowerCase())
    .map((item) => `
      <article class="activity-item">
        <h5>Course signup: ${escapeHtml(item.memberName)}</h5>
        <p class="activity-meta">${escapeHtml(item.memberEmail)} | Receipt ${escapeHtml(item.receiptNumber)} | ${escapeHtml(item.statusLabel)}</p>
      </article>
    `);

  const items = [...membershipItems, ...requestItems, ...enrollmentItems];
  elements.chapterActivity.innerHTML = items.length ? items.join("") : `<div class="empty-state">No submissions yet for this chapter.</div>`;
}

function renderCourseSidebar() {
  if (!elements.courseTitle || !elements.courseSummary || !elements.courseNav) {
    return;
  }

  elements.courseTitle.textContent = state.course.title;
  elements.courseSummary.textContent = `${state.course.description} Price shown: ${state.course.price}.`;
  if (elements.chapterCoursePageCount) {
    elements.chapterCoursePageCount.textContent = `${state.course.pages.length} lessons`;
  }

  const enrollment = getActiveEnrollment();

  if (!enrollment) {
    elements.courseNav.innerHTML = `<div class="empty-state">Enroll to unlock lesson navigation.</div>`;
    return;
  }

  elements.courseNav.innerHTML = state.course.pages.map((page, index) => {
    const completed = enrollment.progress.completedPageIds.includes(page.id);
    const isActive = index === state.currentCoursePageIndex;
    return `
      <li>
        <button type="button" class="${isActive ? "active" : ""}" data-action="open-course-page" data-index="${index}">
          <strong>${escapeHtml(page.title)}</strong><br>
          <span class="activity-meta">${page.minutesRequired} minutes${completed ? " | Complete" : ""}</span>
        </button>
      </li>
    `;
  }).join("");
}

function renderCourseLesson() {
  if (!elements.courseLessonState) {
    return;
  }

  const enrollment = getActiveEnrollment();

  if (!enrollment) {
    elements.courseLessonState.innerHTML = `<div class="empty-state">Members can enroll in the course here after registration.</div>`;
    elements.courseCertificate.classList.add("hidden");
    return;
  }

  if (state.currentCoursePageIndex >= state.course.pages.length) {
    renderFinalExam();
    return;
  }

  const page = state.course.pages[state.currentCoursePageIndex];
  const timerInfo = enrollment.progress.pageTimers[page.id] || null;
  const remainingMs = timerInfo ? Math.max(0, timerInfo.unlockedAt - Date.now()) : page.minutesRequired * 60 * 1000;
  const mins = Math.floor(remainingMs / 60000);
  const secs = Math.floor((remainingMs % 60000) / 1000);
  const timerLabel = remainingMs > 0 ? `${mins}:${String(secs).padStart(2, "0")} remaining` : "Time requirement complete";
  const timeRequirementLabel = `Time requirement: ${page.minutesRequired} minute${page.minutesRequired === 1 ? "" : "s"}`;
  const timerFinished = remainingMs <= 0;
  const quizPassed = !page.quiz || enrollment.progress.completedPageIds.includes(`${page.id}-quiz`);
  const canContinue = timerFinished && quizPassed;

  elements.courseLessonState.innerHTML = `
    <div class="course-progress-row">
      <div>
        <p class="card-label">Lesson ${state.currentCoursePageIndex + 1}</p>
        <h4>${escapeHtml(page.title)}</h4>
      </div>
      <div class="course-time-box">
        <span class="course-time-status">${escapeHtml(timerLabel)}</span>
        <p class="course-time-meta">${escapeHtml(timeRequirementLabel)}</p>
      </div>
    </div>
    <div class="slide-preview-frame">
      <div class="slide-preview-content">
        <div class="slide-preview-body">${escapeHtml(page.content)}</div>
      </div>
    </div>
    <div id="courseLessonFeedback"></div>
    ${page.quiz ? `
      <div class="quiz-panel">
        <p class="card-label">Page Quiz</p>
        <h5>${escapeHtml(page.quiz.question)}</h5>
        <div class="quiz-options">
          ${page.quiz.options.map((option) => `
            <label class="quiz-option">
              <input type="radio" name="page-quiz-answer" value="${escapeHtml(option)}">
              <span>${escapeHtml(option)}</span>
            </label>
          `).join("")}
        </div>
        <div class="activity-actions">
          <button class="secondary-button compact-course-button" type="button" data-action="submit-page-quiz">Submit Quiz</button>
        </div>
      </div>
    ` : ""}
    <div class="lesson-footer">
      <div class="activity-meta">${canContinue ? "Page requirements complete." : "Complete the timer and quiz to continue."}</div>
      <div class="activity-actions course-action-buttons">
        <button class="primary-button compact-course-button" type="button" data-action="complete-course-page" ${canContinue ? "" : "disabled"}>${state.currentCoursePageIndex === state.course.pages.length - 1 ? "Go To Final Quiz" : "Next"}</button>
      </div>
    </div>
  `;

  elements.courseCertificate.classList.add("hidden");
}

function renderFinalExam() {
  const enrollment = getActiveEnrollment();

  if (!enrollment) {
    return;
  }

  elements.courseLessonState.innerHTML = `
    <div class="course-progress-row">
      <div>
        <p class="card-label">Final Test</p>
        <h4>${escapeHtml(state.course.title)}</h4>
        <p class="course-meta">Pass with ${state.course.passingScore}% or higher.</p>
      </div>
    </div>
    <div class="stack-form">
      ${state.course.finalExam.map((question, index) => `
        <div class="quiz-panel">
          <p class="card-label">Question ${index + 1}</p>
          <h5>${escapeHtml(question.question)}</h5>
          <div class="quiz-options">
            ${question.options.map((option) => `
              <label class="quiz-option">
                <input type="radio" name="final-${index}-answer" value="${escapeHtml(option)}" ${enrollment.progress.finalAnswers[question.id] === option ? "checked" : ""}>
                <span>${escapeHtml(option)}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `).join("")}
      <div class="activity-actions">
        <button class="primary-button compact-course-button" type="button" data-action="submit-final-exam">Submit Final Exam</button>
      </div>
    </div>
  `;

  renderCertificate();
}

function renderCertificate() {
  const enrollment = getActiveEnrollment();

  if (!enrollment || !elements.courseCertificate) {
    return;
  }

  if (!enrollment.certificateIssuedAt) {
    elements.courseCertificate.classList.add("hidden");
    return;
  }

  elements.courseCertificate.classList.remove("hidden");
  elements.courseCertificate.innerHTML = `
    <div class="certificate-card">
      <p class="card-label">Certificate</p>
      <h4 class="certificate-title">Certificate of Completion</h4>
      <p>This certifies that <strong>${escapeHtml(enrollment.memberName)}</strong> completed <strong>${escapeHtml(state.course.title)}</strong>.</p>
      <p class="activity-meta">Issued ${escapeHtml(enrollment.certificateIssuedAt)} | Score ${escapeHtml(String(enrollment.progress.finalScore))}%</p>
      <div class="activity-actions">
        <button class="primary-button compact-course-button" type="button" data-action="download-certificate">Download Certificate</button>
      </div>
    </div>
  `;
}

function startLessonTimer(pageIndex) {
  clearInterval(state.currentTimerId);
  state.currentCoursePageIndex = pageIndex;

  const enrollment = getActiveEnrollment();
  const page = state.course.pages[pageIndex];

  if (!enrollment || !page) {
    return;
  }

  if (!enrollment.progress.pageTimers[page.id]) {
    enrollment.progress.pageTimers[page.id] = {
      startedAt: Date.now(),
      unlockedAt: Date.now() + Number(page.minutesRequired) * 60 * 1000
    };
    saveEnrollments();
  }

  const tick = () => renderAll();
  tick();
  state.currentTimerId = setInterval(tick, 1000);
}

function renderAdminPanels() {
  if (elements.adminMembershipCount) {
    elements.adminMembershipCount.textContent = `${state.memberships.length} files`;
  }

  if (elements.adminEnrollmentCount) {
    elements.adminEnrollmentCount.textContent = `${state.enrollments.length} signups`;
  }

  if (elements.adminCourseOverview) {
    elements.adminCourseOverview.innerHTML = `
      <article class="activity-item">
        <h5>${escapeHtml(state.course.title)}</h5>
        <p class="activity-meta">${escapeHtml(state.course.description)}</p>
        <p class="activity-meta">${state.course.pages.length} lesson page(s) | ${state.course.finalExam.length} final question(s) | ${totalCourseMinutes()} minutes</p>
      </article>
      ${state.course.pages.map((page) => `
        <article class="activity-item">
          <h5>${escapeHtml(page.title)}</h5>
          <p class="activity-meta">${page.minutesRequired} minutes${page.quiz ? " | Quiz included" : ""}</p>
          <p class="activity-meta">${escapeHtml(page.content.slice(0, 180))}${page.content.length > 180 ? "..." : ""}</p>
          <div class="activity-actions">
            <button class="small-button" type="button" data-action="delete-course-page" data-id="${page.id}">Delete</button>
          </div>
        </article>
      `).join("")}
      ${state.course.finalExam.map((question) => `
        <article class="activity-item">
          <h5>Final test: ${escapeHtml(question.question)}</h5>
          <p class="activity-meta">Correct answer: ${escapeHtml(question.correctAnswer)}</p>
          <div class="activity-actions">
            <button class="small-button" type="button" data-action="delete-final-question" data-id="${question.id}">Delete</button>
          </div>
        </article>
      `).join("")}
    `;
  }

  if (elements.adminDocuments) {
    elements.adminDocuments.innerHTML = state.documents.map((document) => `
      <article class="activity-item">
        <h5>${escapeHtml(document.title)}</h5>
        <p class="activity-meta">${escapeHtml(document.category)} | ${escapeHtml(document.filename)} | ${escapeHtml(document.uploadedAt)}</p>
        <div class="activity-actions">
          <button class="small-button" type="button" data-action="download-doc" data-id="${document.id}" ${document.fileId ? "" : "disabled"}>Download</button>
          <button class="small-button" type="button" data-action="delete-doc" data-id="${document.id}">Delete</button>
        </div>
      </article>
    `).join("") || `<div class="empty-state">No documents uploaded yet.</div>`;
  }

  if (elements.adminMembershipUploads) {
    elements.adminMembershipUploads.innerHTML = state.memberships.map((item) => `
      <article class="activity-item">
        <h5>${escapeHtml(item.chapterName)}</h5>
        <p class="activity-meta">${escapeHtml(item.reportingMonth)} | ${escapeHtml(item.filename)} | Submitted ${escapeHtml(item.submittedAt)}</p>
        <div class="activity-actions">
          <button class="small-button" type="button" data-action="download-membership" data-id="${item.id}">Download file</button>
        </div>
      </article>
    `).join("") || `<div class="empty-state">No membership files yet.</div>`;
  }

  if (elements.adminTemplates) {
    elements.adminTemplates.innerHTML = state.templates.map((template) => `
      <article class="activity-item">
        <h5>${escapeHtml(template.title)}</h5>
        <p class="activity-meta">${escapeHtml(template.description)}</p>
        <p class="activity-meta">Fields: ${escapeHtml(template.fields.join(", "))}</p>
        <div class="activity-actions">
          <button class="small-button" type="button" data-action="delete-template" data-id="${template.id}">Delete</button>
        </div>
      </article>
    `).join("") || `<div class="empty-state">No request forms created yet.</div>`;
  }

  if (elements.adminRequests) {
    elements.adminRequests.innerHTML = state.requests.map((item) => `
      <article class="activity-item">
        <h5>${escapeHtml(item.templateTitle)}</h5>
        <p class="activity-meta">${escapeHtml(item.chapterName)} | Submitted ${escapeHtml(item.submittedAt)}</p>
        <p class="activity-meta">${item.answers.map((answer) => `${escapeHtml(answer.label)}: ${escapeHtml(answer.value)}`).join(" | ")}</p>
      </article>
    `).join("") || `<div class="empty-state">No chapter requests yet.</div>`;
  }

  if (elements.adminEnrollments) {
    elements.adminEnrollments.innerHTML = state.enrollments.map((item) => `
      <article class="activity-item">
        <h5>${escapeHtml(item.memberName)}</h5>
        <p class="activity-meta">${escapeHtml(item.memberEmail)} | Receipt ${escapeHtml(item.receiptNumber)} | ${escapeHtml(item.amountPaid)} | ${escapeHtml(item.statusLabel)}</p>
        <p class="activity-meta">Purchased ${escapeHtml(item.purchasedAt)}${item.certificateIssuedAt ? ` | Certificate ${escapeHtml(item.certificateIssuedAt)}` : ""}</p>
      </article>
    `).join("") || `<div class="empty-state">No member enrollments yet.</div>`;
  }

  if (elements.courseSettingsTitle) {
    elements.courseSettingsTitle.value = state.course.title;
    elements.courseSettingsPrice.value = state.course.price;
    elements.courseSettingsDescription.value = state.course.description;
    elements.courseSettingsPassingScore.value = state.course.passingScore;
  }
}

function renderAll() {
  renderDocumentsForChapters();
  renderRequestTemplateOptions();
  renderChapterActivity();
  renderCourseSidebar();
  renderCourseLesson();
  renderAdminPanels();
  updateLogoutVisibility();
  if (elements.chapterPortal) {
    setMemberPortalView(state.memberPortalView);
  }
}

async function downloadStoredFile(recordId) {
  const result = await getFileRecord(recordId);

  if (!result?.file) {
    return;
  }

  const url = URL.createObjectURL(result.file);
  const link = document.createElement("a");
  link.href = url;
  link.download = result.file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadCertificate() {
  const enrollment = getActiveEnrollment();

  if (!enrollment) {
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Certificate of Completion</title>
      <style>
        body { font-family: Georgia, serif; padding: 40px; background: #f7f2e8; color: #1e201c; }
        .cert { max-width: 900px; margin: 0 auto; padding: 48px; background: white; border: 8px solid #255f4f; }
        h1 { font-size: 46px; margin-bottom: 12px; }
        p { font-size: 20px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="cert">
        <h1>Certificate of Completion</h1>
        <p>This certifies that <strong>${escapeHtml(enrollment.memberName)}</strong> successfully completed the course <strong>${escapeHtml(state.course.title)}</strong>.</p>
        <p>Issued on ${escapeHtml(enrollment.certificateIssuedAt)} with a final score of ${escapeHtml(String(enrollment.progress.finalScore))}%.</p>
        <p>Safe Skills Driving School</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.course.title.replaceAll(/\s+/g, "-").toLowerCase()}-certificate.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function loginChapter(account) {
  state.currentChapter = account;
  setStudentSession(account);
  state.memberPortalView = "home";
  elements.welcomeTitle.textContent = `Welcome, ${account.leaderName}`;
  elements.welcomeText.textContent = "Your student portal is ready. Use the navigation below to open each area.";
  if (elements.chapterWelcomeName) {
    elements.chapterWelcomeName.textContent = account.leaderName;
  }
  if (elements.chapterWelcomeMeta) {
    elements.chapterWelcomeMeta.textContent = account.chapterName;
  }
  setStatus("Chapter Access", "chapter");
  showPortalState("chapter");
  if (elements.membershipChapterName) {
    elements.membershipChapterName.value = account.chapterName;
  }
  renderAll();
}

function loginAdmin() {
  elements.welcomeTitle.textContent = "Executive Office Admin";
  elements.welcomeText.textContent = "Admin tools are unlocked for document management, forms, course building, and enrollment tracking.";
  setStatus("Admin Access", "admin");
  showPortalState("admin");
  renderAll();
}

function logoutCurrentSession() {
  sessionStorage.removeItem("wow-admin-auth");
  clearStudentSession();
  state.currentChapter = null;
  state.activeEnrollmentId = null;
  state.currentCoursePageIndex = 0;
  clearInterval(state.currentTimerId);
  state.currentTimerId = null;

  if (elements.adminLoginForm) {
    elements.adminLoginForm.reset();
  }

  if (elements.chapterLoginForm) {
    elements.chapterLoginForm.reset();
  }

  if (elements.membershipChapterName) {
    elements.membershipChapterName.value = "";
  }

  state.memberPortalView = "home";

  if (elements.welcomeTitle) {
    elements.welcomeTitle.textContent = "Safe Skills Driving School Hub";
  }

  if (elements.welcomeText) {
    elements.welcomeText.textContent = "Registered students can open this portal from the home page after payment.";
  }

  setStatus("Locked");
  showPortalState("locked");
  renderAll();

  if (isAdminPage) {
    window.location.href = "portal.html";
    return;
  }

  window.location.href = "index.html";
}

function buildEnrollmentRecord(memberName, memberEmail) {
  const receiptNumber = `WOW-${Date.now()}`;

  return {
    id: createId("enrollment"),
    chapterEmail: state.currentChapter?.email || "",
    chapterName: state.currentChapter?.chapterName || "",
    memberName,
    memberEmail,
    receiptNumber,
    amountPaid: state.course.price,
    purchasedAt: formatDate(),
    statusLabel: "Enrolled",
    progress: {
      completedPageIds: [],
      pageTimers: {},
      finalAnswers: {},
      finalScore: null
    },
    certificateIssuedAt: null
  };
}

if (elements.jumpToAccess) {
  elements.jumpToAccess.addEventListener("click", () => {
    document.querySelector("#access-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (elements.jumpToAdminLogin) {
  elements.jumpToAdminLogin.addEventListener("click", () => {
    window.location.href = "index.html#homeAdminLogin";
  });
}

if (elements.adminLoginForm) {
  elements.adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = elements.adminEmail.value.toLowerCase().trim();
    const password = elements.adminPassword.value.trim();

    if (email !== adminAccount.email || password !== adminAccount.password) {
      elements.adminLoginFeedback.textContent = "Admin login did not match. Use kim@wingsoverwisconsin.org with password testadmin for this prototype.";
      return;
    }

    elements.adminLoginFeedback.textContent = "Admin access granted.";

    if (isAdminPage) {
      sessionStorage.setItem("wow-admin-auth", "1");
      loginAdmin();
      return;
    }

    sessionStorage.setItem("wow-admin-auth", "1");
    window.location.href = "admin.html";
  });
}

if (elements.logoutSession) {
  elements.logoutSession.addEventListener("click", () => {
    logoutCurrentSession();
  });
}

document.addEventListener("click", (event) => {
  const memberViewTarget = event.target.closest("[data-member-view]");

  if (memberViewTarget && elements.chapterPortal && !memberViewTarget.classList.contains("section-chip")) {
    setMemberPortalView(memberViewTarget.dataset.memberView);
  }
});

if (elements.requestTypeSelect) {
  elements.requestTypeSelect.addEventListener("change", (event) => {
    renderDynamicRequestFields(event.target.value);
  });
}

if (elements.membershipUploadForm) {
  elements.membershipUploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!state.currentChapter) {
      elements.membershipFeedback.textContent = "Please log in as a chapter leader first.";
      return;
    }

    const file = elements.membershipFile.files[0];

    if (!file) {
      elements.membershipFeedback.textContent = "Please choose a membership file to upload.";
      return;
    }

    const fileId = createId("membership-file");
    const item = {
      id: createId("membership"),
      chapterEmail: state.currentChapter.email,
      chapterName: elements.membershipChapterName.value.trim(),
      reportingMonth: elements.membershipMonth.value,
      filename: file.name,
      submittedAt: formatDate(),
      fileId
    };

    await saveFileRecord(fileId, file);
    state.memberships.unshift(item);
    saveCollection(storageKeys.memberships, state.memberships);
    elements.membershipUploadForm.reset();
    elements.membershipChapterName.value = state.currentChapter.chapterName;
    elements.membershipFeedback.textContent = "Membership file uploaded for admin review in this browser.";
    renderAll();
  });
}

if (elements.requestForm) {
  elements.requestForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!state.currentChapter) {
      elements.requestFeedback.textContent = "Please log in as a chapter leader first.";
      return;
    }

    const template = state.templates.find((item) => item.id === elements.requestTypeSelect.value);

    if (!template) {
      elements.requestFeedback.textContent = "Choose a request form first.";
      return;
    }

    const answers = [...elements.dynamicRequestFields.querySelectorAll("input")].map((input) => ({
      label: input.dataset.fieldLabel,
      value: input.value.trim()
    }));

    state.requests.unshift({
      id: createId("request"),
      chapterEmail: state.currentChapter.email,
      chapterName: state.currentChapter.chapterName,
      templateId: template.id,
      templateTitle: template.title,
      answers,
      submittedAt: formatDate()
    });

    saveCollection(storageKeys.requests, state.requests);
    elements.requestFeedback.textContent = "Request sent to the executive office queue in this browser.";
    renderAll();
    renderDynamicRequestFields(template.id);
  });
}

if (elements.enrollInCourse) {
  elements.enrollInCourse.addEventListener("click", () => {
    if (!state.currentChapter) {
      elements.courseEnrollmentFeedback.textContent = "Please log in as a chapter leader first.";
      return;
    }

    const memberName = elements.memberCourseName.value.trim();
    const memberEmail = elements.memberCourseEmail.value.trim();

    if (!memberName || !memberEmail) {
      elements.courseEnrollmentFeedback.textContent = "Add the member name and member email before signing up.";
      return;
    }

    const enrollment = buildEnrollmentRecord(memberName, memberEmail);
    state.enrollments.unshift(enrollment);
    state.activeEnrollmentId = enrollment.id;
    state.currentCoursePageIndex = 0;
    saveEnrollments();
    elements.courseEnrollmentFeedback.textContent = `Signup recorded. Receipt ${enrollment.receiptNumber} was logged for the member and for Kim.`;
    renderAll();
    startLessonTimer(0);
  });
}

if (elements.documentUploadForm) {
  elements.documentUploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = elements.documentFile.files[0];

    if (!file) {
      elements.documentFeedback.textContent = "Please choose a toolkit file to upload.";
      return;
    }

    const fileId = createId("toolkit-file");
    const documentItem = {
      id: createId("document"),
      title: elements.documentTitle.value.trim(),
      category: elements.documentCategory.value.trim(),
      description: elements.documentDescription.value.trim(),
      filename: file.name,
      uploadedAt: formatDate(),
      fileId
    };

    await saveFileRecord(fileId, file);
    state.documents.unshift(documentItem);
    saveCollection(storageKeys.documents, state.documents);
    elements.documentUploadForm.reset();
    elements.documentFeedback.textContent = "Toolkit document uploaded and visible to chapter leaders.";
    renderAll();
  });
}

if (elements.requestTemplateForm) {
  elements.requestTemplateForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = elements.templateFields.value
      .split(",")
      .map((field) => field.trim())
      .filter(Boolean);

    if (!fields.length) {
      elements.templateFeedback.textContent = "Please add at least one field for the request form.";
      return;
    }

    state.templates.unshift({
      id: createId("template"),
      title: elements.templateTitle.value.trim(),
      description: elements.templateDescription.value.trim(),
      fields
    });

    saveCollection(storageKeys.templates, state.templates);
    elements.requestTemplateForm.reset();
    elements.templateFeedback.textContent = "Request form created for chapter leaders.";
    renderAll();
  });
}

if (elements.courseSettingsForm) {
  elements.courseSettingsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    state.course.title = elements.courseSettingsTitle.value.trim();
    state.course.price = elements.courseSettingsPrice.value.trim();
    state.course.description = elements.courseSettingsDescription.value.trim();
    state.course.passingScore = Number(elements.courseSettingsPassingScore.value);
    saveCourse();
    elements.courseSettingsFeedback.textContent = "Course settings saved.";
    renderAll();
  });
}

if (elements.coursePageForm) {
  elements.coursePageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const minutesRequired = Number(elements.coursePageMinutes.value);
    const nextTotal = totalCourseMinutes() + minutesRequired;

    if (nextTotal > 120) {
      elements.coursePageFeedback.textContent = "Adding this page would put the course over the 120 minute limit.";
      return;
    }

    const quizQuestion = elements.coursePageQuizQuestion.value.trim();
    const quizOptions = elements.coursePageQuizOptions.value
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean);
    const quizCorrect = elements.coursePageQuizCorrect.value.trim();
    const hasQuiz = quizQuestion && quizOptions.length >= 2 && quizCorrect;

    state.course.pages.push({
      id: createId("page"),
      title: elements.coursePageTitle.value.trim(),
      minutesRequired,
      content: elements.coursePageContent.value.trim(),
      quiz: hasQuiz ? {
        question: quizQuestion,
        options: quizOptions,
        correctAnswer: quizCorrect
      } : null
    });

    saveCourse();
    elements.coursePageForm.reset();
    elements.coursePageMinutes.value = 5;
    elements.coursePageFeedback.textContent = "Course page added.";
    renderAll();
  });
}

if (elements.finalExamForm) {
  elements.finalExamForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const options = elements.finalExamOptions.value
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean);

    if (options.length < 2) {
      elements.finalExamFeedback.textContent = "Add at least two answer options.";
      return;
    }

    state.course.finalExam.push({
      id: createId("final-question"),
      question: elements.finalExamQuestion.value.trim(),
      options,
      correctAnswer: elements.finalExamCorrect.value.trim()
    });

    saveCourse();
    elements.finalExamForm.reset();
    elements.finalExamFeedback.textContent = "Final test question added.";
    renderAll();
  });
}

document.addEventListener("change", (event) => {
  const enrollment = getActiveEnrollment();

  if (!enrollment) {
    return;
  }

  const radio = event.target.closest('input[type="radio"]');

  if (!radio) {
    return;
  }

  if (radio.name.startsWith("final-")) {
    const index = Number(radio.name.replace("final-", "").replace("-answer", ""));
    const question = state.course.finalExam[index];

    if (question) {
      enrollment.progress.finalAnswers[question.id] = radio.value;
      saveEnrollments();
    }
  }
});

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");

  if (!target) {
    return;
  }

  const { action, id, index } = target.dataset;

  if (action === "download-doc") {
    const documentItem = state.documents.find((item) => item.id === id);

    if (documentItem?.fileId) {
      await downloadStoredFile(documentItem.fileId);
    }
  }

  if (action === "download-membership") {
    const membershipItem = state.memberships.find((item) => item.id === id);

    if (membershipItem?.fileId) {
      await downloadStoredFile(membershipItem.fileId);
    }
  }

  if (action === "delete-doc") {
    const documentItem = state.documents.find((item) => item.id === id);
    state.documents = state.documents.filter((item) => item.id !== id);
    saveCollection(storageKeys.documents, state.documents);
    await deleteFileRecord(documentItem?.fileId);
    renderAll();
  }

  if (action === "delete-template") {
    state.templates = state.templates.filter((item) => item.id !== id);
    saveCollection(storageKeys.templates, state.templates);
    renderAll();
  }

  if (action === "delete-course-page") {
    state.course.pages = state.course.pages.filter((item) => item.id !== id);
    saveCourse();
    state.currentCoursePageIndex = 0;
    renderAll();
  }

  if (action === "delete-final-question") {
    state.course.finalExam = state.course.finalExam.filter((item) => item.id !== id);
    saveCourse();
    renderAll();
  }

  if (action === "open-course-page") {
    state.currentCoursePageIndex = Number(index);
    startLessonTimer(state.currentCoursePageIndex);
  }

  if (action === "submit-page-quiz") {
    const enrollment = getActiveEnrollment();
    const page = state.course.pages[state.currentCoursePageIndex];

    if (!enrollment || !page?.quiz) {
      return;
    }

    const selected = document.querySelector('input[name="page-quiz-answer"]:checked');
    const feedback = document.querySelector("#courseLessonFeedback");

    if (!selected) {
      feedback.innerHTML = `<p class="pill-alert">Select an answer before submitting the quiz.</p>`;
      return;
    }

    if (selected.value !== page.quiz.correctAnswer) {
      feedback.innerHTML = `<p class="pill-alert">That answer is not correct yet. Review the lesson and try again.</p>`;
      return;
    }

    enrollment.progress.completedPageIds = [...new Set([...enrollment.progress.completedPageIds, `${page.id}-quiz`])];
    saveEnrollments();
    feedback.innerHTML = `<p class="course-badge">Quiz passed. You can continue once the time requirement is complete.</p>`;
    renderCourseLesson();
  }

  if (action === "complete-course-page") {
    const enrollment = getActiveEnrollment();
    const page = state.course.pages[state.currentCoursePageIndex];

    if (!enrollment || !page) {
      return;
    }

    const timerInfo = enrollment.progress.pageTimers[page.id];
    const timerFinished = timerInfo && timerInfo.unlockedAt <= Date.now();
    const quizPassed = !page.quiz || enrollment.progress.completedPageIds.includes(`${page.id}-quiz`);

    if (!timerFinished || !quizPassed) {
      return;
    }

    enrollment.progress.completedPageIds = [...new Set([...enrollment.progress.completedPageIds, page.id])];
    enrollment.statusLabel = "In progress";
    saveEnrollments();

    if (state.currentCoursePageIndex < state.course.pages.length - 1) {
      state.currentCoursePageIndex += 1;
      startLessonTimer(state.currentCoursePageIndex);
    } else {
      clearInterval(state.currentTimerId);
      state.currentCoursePageIndex = state.course.pages.length;
      renderAll();
    }
  }

  if (action === "submit-final-exam") {
    const enrollment = getActiveEnrollment();

    if (!enrollment) {
      return;
    }

    let correct = 0;

    state.course.finalExam.forEach((question) => {
      if (enrollment.progress.finalAnswers[question.id] === question.correctAnswer) {
        correct += 1;
      }
    });

    const score = Math.round((correct / state.course.finalExam.length) * 100);
    enrollment.progress.finalScore = score;

    if (score >= state.course.passingScore) {
      enrollment.statusLabel = "Passed";
      enrollment.certificateIssuedAt = formatDate();
    } else {
      enrollment.statusLabel = "Needs retake";
      enrollment.certificateIssuedAt = null;
    }

    saveEnrollments();
    renderAll();
  }

  if (action === "download-certificate") {
    downloadCertificate();
  }
});

renderAll();

if (isAdminPage && sessionStorage.getItem("wow-admin-auth") === "1") {
  loginAdmin();
}

if (!isAdminPage) {
  const approved = getApprovedRegistration();
  const session = getStudentSession();

  state.enrollments = state.enrollments.filter((item) => {
    if (!approved) {
      return false;
    }

    return item.memberEmail?.toLowerCase() === approved.email.toLowerCase();
  });
  saveEnrollments();

  if (session?.email && approved && session.email.toLowerCase() === approved.email.toLowerCase()) {
    const studentAccount = buildStudentPortalAccount();

    if (studentAccount) {
      loginChapter(studentAccount);
    }
  }
}
