function adminClone(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

const adminStorageKeys = {
  course: "wow-course",
  enrollments: "wow-course-enrollments",
  studentProfiles: "safe-skills-student-profiles",
  studentPasswords: "safe-skills-student-passwords",
  courseDraft: "wow-course-draft",
  courses: "wow-courses",
  activeCourseId: "wow-active-course-id",
  stripePaymentLink: "safe-skills-stripe-payment-link",
  stripeSuccessUrl: "safe-skills-stripe-success-url",
  stripeCancelUrl: "safe-skills-stripe-cancel-url",
  registrationTitle: "safe-skills-registration-title",
  registrationIntro: "safe-skills-registration-intro",
  registrationSuccessMessage: "safe-skills-registration-success-message",
  nextContractNumber: "safe-skills-next-contract-number"
};

const adminDefaultContract = {
  onlineLabel: "Online Classroom Only",
  onlineCopy: "Includes 2 hours of online classroom. No behind the wheel instruction.",
  paragraph1: "I agree to pay the course fee for 2 hours of online classroom. Full payment is due for the instruction listed above.",
  paragraph2: "I acknowledge that online learning must be completed within 30 days, beginning on the date the first lesson is started. If the lessons are not completed within 90 days, a $25 extension fee will be applied to allow for an additional 90 days.",
  paragraph3: "This school will not refund any tuition or part of tuition if the school is ready, willing and able to fulfill their part of this agreement.",
  paragraph4: "I agree to receive text messages and e-mails from Safe Skills Driving School for appointment reminders and other information.",
  paragraph5: "This constitutes the entire agreement between the school and the student, no verbal statement or promises will be recognized.",
  agreementCopy: "I understand and agree to this Safe Skills Driving School contract."
};

const adminDefaultCourse = {
  title: "Safe Skills Driving School Member Course",
  description: "Build your 2-hour member course here. Members must complete each page in order, pass checkpoint quizzes, and finish the final exam to earn a certificate.",
  price: "$49.00",
  passingScore: 80,
  topics: [
    {
      id: "topic-1",
      title: "Topic 1 - Welcome",
      summary: "Use the admin course builder to replace this sample topic with your real training material.",
      subpages: [
        {
          id: "lesson-1",
          title: "Slide 1 - Welcome",
          minutesRequired: 5,
          content: "<p>Use the admin course builder to replace this sample sub-page with your real training material.</p>",
          imageUrl: "",
          videoUrl: "",
          pptSourceName: ""
        }
      ],
      quiz: []
    }
  ],
  pages: [
    {
      id: "lesson-1",
      topicId: "topic-1",
      topicTitle: "Topic 1 - Welcome",
      title: "Slide 1 - Welcome",
      minutesRequired: 5,
      content: "<p>Use the admin course builder to replace this sample sub-page with your real training material.</p>",
      quiz: null
    }
  ],
  finalExam: [],
  contract: adminClone(adminDefaultContract)
};

function adminLoadCollection(key, fallback) {
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return adminClone(fallback);
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return adminClone(fallback);
  }
}

function adminSaveCollection(key, collection) {
  localStorage.setItem(key, JSON.stringify(collection));
}

function adminEscapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function adminFormatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

function adminCreateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function getAdminCourse() {
  const courses = getAdminCourses();
  const activeCourseId = getActiveAdminCourseId();
  const activeCourse = courses.find((course) => course.id === activeCourseId) || courses[0] || normalizeAdminCourse(adminDefaultCourse);
  return normalizeAdminCourse(activeCourse);
}

function normalizeCourseContract(contract = {}) {
  return {
    onlineLabel: contract.onlineLabel || adminDefaultContract.onlineLabel,
    onlineCopy: contract.onlineCopy || adminDefaultContract.onlineCopy,
    paragraph1: contract.paragraph1 || adminDefaultContract.paragraph1,
    paragraph2: contract.paragraph2 || adminDefaultContract.paragraph2,
    paragraph3: contract.paragraph3 || adminDefaultContract.paragraph3,
    paragraph4: contract.paragraph4 || adminDefaultContract.paragraph4,
    paragraph5: contract.paragraph5 || adminDefaultContract.paragraph5,
    agreementCopy: contract.agreementCopy || adminDefaultContract.agreementCopy
  };
}

function saveAdminCourse(course) {
  const normalized = normalizeAdminCourse(course);
  const courses = getAdminCourses();
  const index = courses.findIndex((item) => item.id === normalized.id);
  if (index >= 0) {
    courses[index] = normalized;
  } else {
    courses.unshift(normalized);
  }
  saveAdminCourses(courses);
  setActiveAdminCourseId(normalized.id);
  adminSaveCollection(adminStorageKeys.course, normalized);
}

function getAdminCourseDraft() {
  const activeCourse = getAdminCourse();
  const fallbackDraft = {
    title: activeCourse.title,
    description: activeCourse.description,
    price: activeCourse.price,
    passingScore: activeCourse.passingScore,
    durationMinutes: activeCourse.pages.reduce((sum, page) => sum + Number(page.minutesRequired || 0), 0) || 120,
    topics: adminClone(activeCourse.topics || []),
    finalExam: adminClone(activeCourse.finalExam),
    contract: adminClone(activeCourse.contract || adminDefaultContract)
  };
  return normalizeAdminCourseDraft(adminLoadCollection(adminStorageKeys.courseDraft, fallbackDraft));
}

function saveAdminCourseDraft(courseDraft) {
  adminSaveCollection(adminStorageKeys.courseDraft, normalizeAdminCourseDraft(courseDraft));
}

function getAdminCourses() {
  const stored = adminLoadCollection(adminStorageKeys.courses, [adminDefaultCourse]);
  const normalizedCourses = stored.map((course) => normalizeAdminCourse(course));
  if (!normalizedCourses.length) normalizedCourses.push(normalizeAdminCourse(adminDefaultCourse));
  adminSaveCollection(adminStorageKeys.courses, normalizedCourses);
  if (!localStorage.getItem(adminStorageKeys.activeCourseId) && normalizedCourses[0]) {
    localStorage.setItem(adminStorageKeys.activeCourseId, normalizedCourses[0].id);
  }
  return normalizedCourses;
}

function saveAdminCourses(courses) {
  adminSaveCollection(adminStorageKeys.courses, courses.map((course) => normalizeAdminCourse(course)));
}

function getActiveAdminCourseId() {
  const existing = localStorage.getItem(adminStorageKeys.activeCourseId);
  if (existing) return existing;
  const firstCourse = getAdminCourses()[0];
  if (firstCourse) {
    localStorage.setItem(adminStorageKeys.activeCourseId, firstCourse.id);
    return firstCourse.id;
  }
  return "";
}

function setActiveAdminCourseId(courseId) {
  localStorage.setItem(adminStorageKeys.activeCourseId, courseId);
}

function getAdminCourseById(courseId) {
  return getAdminCourses().find((course) => course.id === courseId) || null;
}

function getAdminStripePaymentLink() {
  return localStorage.getItem(adminStorageKeys.stripePaymentLink) || "";
}

function saveAdminStripePaymentLink(link) {
  localStorage.setItem(adminStorageKeys.stripePaymentLink, link);
}

function getAdminStripeSuccessUrl() {
  return localStorage.getItem(adminStorageKeys.stripeSuccessUrl) || "";
}

function saveAdminStripeSuccessUrl(url) {
  localStorage.setItem(adminStorageKeys.stripeSuccessUrl, url);
}

function getAdminStripeCancelUrl() {
  return localStorage.getItem(adminStorageKeys.stripeCancelUrl) || "";
}

function saveAdminStripeCancelUrl(url) {
  localStorage.setItem(adminStorageKeys.stripeCancelUrl, url);
}

function getAdminRegistrationTitle() {
  return localStorage.getItem(adminStorageKeys.registrationTitle) || "";
}

function saveAdminRegistrationTitle(value) {
  localStorage.setItem(adminStorageKeys.registrationTitle, value);
}

function getAdminRegistrationIntro() {
  return localStorage.getItem(adminStorageKeys.registrationIntro) || "";
}

function saveAdminRegistrationIntro(value) {
  localStorage.setItem(adminStorageKeys.registrationIntro, value);
}

function getAdminRegistrationSuccessMessage() {
  return localStorage.getItem(adminStorageKeys.registrationSuccessMessage) || "";
}

function saveAdminRegistrationSuccessMessage(value) {
  localStorage.setItem(adminStorageKeys.registrationSuccessMessage, value);
}

function getNextStudentContractNumber() {
  const existing = Number(localStorage.getItem(adminStorageKeys.nextContractNumber) || "1000");
  return Number.isFinite(existing) && existing >= 1000 ? existing : 1000;
}

function assignNextStudentContractNumber() {
  const next = getNextStudentContractNumber();
  localStorage.setItem(adminStorageKeys.nextContractNumber, String(next + 1));
  return next;
}

function removeAdminCourseById(courseId) {
  const courses = getAdminCourses().filter((course) => course.id !== courseId);
  saveAdminCourses(courses.length ? courses : [normalizeAdminCourse(adminDefaultCourse)]);
  const nextCourse = getAdminCourses()[0];
  if (nextCourse) {
    setActiveAdminCourseId(nextCourse.id);
    adminSaveCollection(adminStorageKeys.course, nextCourse);
  }
}

function getAdminEnrollments() {
  const enrollments = adminLoadCollection(adminStorageKeys.enrollments, []);
  const profiles = adminLoadCollection(adminStorageKeys.studentProfiles, []);
  const merged = profiles.map((profile) => {
    const matchingEnrollment = enrollments.find((item) => item.memberEmail?.toLowerCase() === profile.email?.toLowerCase());

    if (matchingEnrollment) {
      return {
        ...matchingEnrollment,
        memberName: matchingEnrollment.memberName || profile.fullName || "",
        memberEmail: matchingEnrollment.memberEmail || profile.email || "",
        purchasedAt: matchingEnrollment.purchasedAt || profile.paidAt || profile.registeredAt || "Not started",
        amountPaid: matchingEnrollment.amountPaid || profile.amount || "",
        contractNumber: matchingEnrollment.contractNumber || profile.contractNumber || "",
        registrationProfile: profile
      };
    }

    return {
      id: `profile-${profile.contractNumber || profile.email}`,
      memberName: profile.fullName || "",
      memberEmail: profile.email || "",
      purchasedAt: profile.paidAt || profile.registeredAt || "Not started",
      amountPaid: profile.amount || "",
      contractNumber: profile.contractNumber || "",
      receiptNumber: profile.paymentNumber || "",
      statusLabel: "Profile Created",
      progress: {
        completedPageIds: [],
        pageTimers: {},
        topicQuizAnswers: {},
        completedTopicQuizIds: [],
        finalAnswers: {},
        finalScore: null
      },
      certificateIssuedAt: null,
      registrationProfile: profile
    };
  });

  enrollments.forEach((enrollment) => {
    if (!merged.some((item) => item.memberEmail?.toLowerCase() === enrollment.memberEmail?.toLowerCase())) {
      merged.push(enrollment);
    }
  });

  return merged;
}

function saveAdminEnrollments(enrollments) {
  adminSaveCollection(adminStorageKeys.enrollments, enrollments);
}

function getAdminStudentProfiles() {
  return adminLoadCollection(adminStorageKeys.studentProfiles, []);
}

function saveAdminStudentProfiles(profiles) {
  adminSaveCollection(adminStorageKeys.studentProfiles, profiles);
}

function upsertAdminStudentProfile(profile) {
  if (!profile?.email) {
    return;
  }

  const profiles = getAdminStudentProfiles();
  const index = profiles.findIndex((item) => item.email?.toLowerCase() === profile.email.toLowerCase());

  if (index >= 0) {
    profiles[index] = {
      ...profiles[index],
      ...profile
    };
  } else {
    profiles.unshift(profile);
  }

  saveAdminStudentProfiles(profiles);
}

function getAdminStudentProfileByEmail(email) {
  if (!email) {
    return null;
  }

  return getAdminStudentProfiles().find((item) => item.email?.toLowerCase() === email.toLowerCase()) || null;
}

function removeAdminEnrollmentById(enrollmentId) {
  const enrollments = getAdminEnrollments().filter((item) => item.id !== enrollmentId);
  saveAdminEnrollments(enrollments.filter((item) => !String(item.id || "").startsWith("profile-")));
}

function markAdminEnrollmentCompleted(enrollmentId) {
  const enrollments = getAdminEnrollments().map((item) => {
    if (item.id !== enrollmentId) {
      return item;
    }

    return {
      ...item,
      statusLabel: "Completed by Admin",
      certificateIssuedAt: item.certificateIssuedAt || adminFormatDate(),
      progress: {
        ...item.progress,
        finalScore: typeof item.progress?.finalScore === "number" ? item.progress.finalScore : 100
      }
    };
  });

  saveAdminEnrollments(enrollments);
}

function getAdminStudentPasswords() {
  return adminLoadCollection(adminStorageKeys.studentPasswords, {});
}

function getAdminStudentPassword(email, fallbackPassword = "") {
  const passwords = getAdminStudentPasswords();
  return passwords[email?.toLowerCase?.() || ""] || fallbackPassword;
}

function saveAdminStudentPassword(email, password) {
  const normalizedEmail = email?.toLowerCase?.();
  if (!normalizedEmail) return;
  const passwords = getAdminStudentPasswords();
  passwords[normalizedEmail] = password;
  adminSaveCollection(adminStorageKeys.studentPasswords, passwords);

  try {
    const approved = JSON.parse(localStorage.getItem("safe-skills-registration-approved") || "null");
    if (approved?.email?.toLowerCase() === normalizedEmail) {
      approved.password = password;
      localStorage.setItem("safe-skills-registration-approved", JSON.stringify(approved));
    }
  } catch (error) {
  }
}

function getEnrollmentCompletionPercent(enrollment, course) {
  const totalPages = course.pages?.length || 0;
  const completedPages = (enrollment.progress?.completedPageIds || []).filter((pageId) => {
    return course.pages.some((page) => page.id === pageId);
  }).length;
  const totalFinalQuestions = course.finalExam?.length || 0;
  const answeredFinalQuestions = Object.keys(enrollment.progress?.finalAnswers || {}).length;
  const totalUnits = totalPages + totalFinalQuestions;

  if (!totalUnits) {
    return 0;
  }

  const percent = Math.round(((completedPages + answeredFinalQuestions) / totalUnits) * 100);
  return Math.max(0, Math.min(100, percent));
}

function getEnrollmentCurrentStep(enrollment, course) {
  if (enrollment.certificateIssuedAt) {
    return { label: "Certificate issued", elapsed: "-" };
  }

  if (typeof enrollment.progress?.finalScore === "number" && enrollment.progress.finalScore < course.passingScore) {
    return { label: "Final exam retake", elapsed: "-" };
  }

  const completedPageIds = enrollment.progress?.completedPageIds || [];
  const firstIncompletePage = course.pages.find((page) => !completedPageIds.includes(page.id));

  if (!firstIncompletePage) {
    return { label: "Final exam", elapsed: "-" };
  }

  const timer = enrollment.progress?.pageTimers?.[firstIncompletePage.id];

  if (!timer?.startedAt) {
    return { label: firstIncompletePage.title, elapsed: "Not started" };
  }

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timer.startedAt) / 60000));
  return { label: firstIncompletePage.title, elapsed: `${elapsedMinutes} min` };
}

function buildStudentAddress(profile) {
  const parts = [
    profile.address1,
    profile.address2,
    [profile.city, profile.state, profile.zip].filter(Boolean).join(", ").replace(", ,", ",")
  ].filter(Boolean);

  return parts.join(", ");
}

function getStudentSchoolName() {
  return "Safe Skills Driving School";
}

function buildStudentProgressRows(enrollment, course) {
  const pages = course.pages || [];
  const completedPageIds = enrollment.progress?.completedPageIds || [];

  return pages.map((page) => {
    const timer = enrollment.progress?.pageTimers?.[page.id];
    const minutes = timer?.startedAt ? Math.max(1, Math.floor((Date.now() - timer.startedAt) / 60000)) : 0;
    const date = timer?.startedAt ? adminFormatDate(new Date(timer.startedAt)) : enrollment.purchasedAt || "Not started";

    return {
      date,
      type: "online",
      time: `${minutes} min`,
      instructorNumber: "5510",
      instructorName: "Kim Lapp",
      title: page.title,
      status: completedPageIds.includes(page.id) ? "Complete" : timer?.startedAt ? "In progress" : "Not started"
    };
  });
}

function buildStudentRecordSummary(enrollment, approvedProfile, course) {
  const profile = approvedProfile || enrollment.registrationProfile || {};
  return {
    studentName: enrollment.memberName || profile.fullName || "",
    contactNumber: profile.phone || "",
    contractNumber: profile.contractNumber || enrollment.contractNumber || "",
    studentAddress: buildStudentAddress(profile),
    permitTestDate: profile.permitTestDate || "",
    courseFee: enrollment.amountPaid || profile.amount || course.price || "",
    birthDate: profile.birthDate || "",
    permitNumber: profile.driverLicenseNumber || profile.permitNumber || "",
    studentSchool: profile.studentSchool || getStudentSchoolName()
  };
}

function renderStudentRecordGrid(summary) {
  const items = [
    ["Student Name", summary.studentName],
    ["Contact Number", summary.contactNumber],
    ["Contract Number", summary.contractNumber],
    ["Student Address", summary.studentAddress],
    ["Permit Test Date", summary.permitTestDate],
    ["Course Fee", summary.courseFee],
    ["Student Birth Date", summary.birthDate],
    ["Permit Number", summary.permitNumber],
    ["Student School", summary.studentSchool]
  ];

  return items.map(([label, value]) => `
    <article class="student-record-card">
      <span class="student-record-label">${adminEscapeHtml(label)}</span>
      <strong>${adminEscapeHtml(value || "-")}</strong>
    </article>
  `).join("");
}

function renderStudentProgressTable(rows) {
  if (!rows.length) {
    return `<div class="empty-state">No progress activity has been recorded yet.</div>`;
  }

  return `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Time</th>
          <th>Instructor</th>
          <th>Instructor Name</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((row) => `
          <tr>
            <td>${adminEscapeHtml(row.date)}</td>
            <td>${adminEscapeHtml(row.type)}</td>
            <td>${adminEscapeHtml(row.time)}</td>
            <td>${adminEscapeHtml(row.instructorNumber)}</td>
            <td>${adminEscapeHtml(row.instructorName)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function printStudentRecordPdf(summary, rows) {
  const printWindow = window.open("", "_blank", "width=980,height=720");

  if (!printWindow) {
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Student Record</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #2E2E2E; }
        h1 { color: #4A6FA5; margin-bottom: 10px; }
        .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-bottom: 28px; }
        .card { border: 1px solid #D9D4CC; border-radius: 10px; padding: 12px; }
        .label { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #4A6FA5; margin-bottom: 6px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #D9D4CC; padding: 10px; text-align: left; }
        th { color: #4A6FA5; }
      </style>
    </head>
    <body>
      <h1>Safe Skills Driving School Student Record</h1>
      <div class="grid">
        ${renderStudentRecordGrid(summary)}
      </div>
      ${renderStudentProgressTable(rows)}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function buildContractPrintHtml(approvedProfile, courseContract) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Safe Skills Driving School Contract</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 32px; color: #2E2E2E; }
        h1 { color: #4A6FA5; margin-bottom: 8px; }
        .meta, .profile { display: grid; gap: 12px; }
        .meta { grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 20px 0; }
        .profile { grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 24px; }
        .card { border: 1px solid #D9D4CC; border-radius: 10px; padding: 12px; }
        .label { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #4A6FA5; margin-bottom: 6px; }
        p { line-height: 1.6; }
      </style>
    </head>
    <body>
      <h1>Safe Skills Driving School Contract</h1>
      <div class="meta">
        <div class="card"><span class="label">Contract Number</span><strong>${adminEscapeHtml(String(approvedProfile.contractNumber || ""))}</strong></div>
        <div class="card"><span class="label">Contract Date</span><strong>${adminEscapeHtml(approvedProfile.contractDate || "")}</strong></div>
        <div class="card"><span class="label">Course Fee</span><strong>${adminEscapeHtml(approvedProfile.amount || "")}</strong></div>
        <div class="card"><span class="label">${adminEscapeHtml(courseContract.onlineLabel)}</span><strong>${adminEscapeHtml(courseContract.onlineCopy)}</strong></div>
        <div class="card"><span class="label">Payment Number</span><strong>${adminEscapeHtml(approvedProfile.paymentNumber || "")}</strong></div>
      </div>
      <p>${adminEscapeHtml(courseContract.paragraph1)}</p>
      <p>${adminEscapeHtml(courseContract.paragraph2)}</p>
      <p>${adminEscapeHtml(courseContract.paragraph3)}</p>
      <p>${adminEscapeHtml(courseContract.paragraph4)}</p>
      <p>${adminEscapeHtml(courseContract.paragraph5)}</p>
      <div class="profile">
        <div class="card"><span class="label">Student Name</span><strong>${adminEscapeHtml(approvedProfile.fullName || "")}</strong></div>
        <div class="card"><span class="label">Email Address</span><strong>${adminEscapeHtml(approvedProfile.email || "")}</strong></div>
        <div class="card"><span class="label">Contact Number</span><strong>${adminEscapeHtml(approvedProfile.phone || "")}</strong></div>
        <div class="card"><span class="label">Street Address</span><strong>${adminEscapeHtml(approvedProfile.address1 || "")}</strong></div>
        <div class="card"><span class="label">Address Line 2</span><strong>${adminEscapeHtml(approvedProfile.address2 || "-")}</strong></div>
        <div class="card"><span class="label">City, State ZIP</span><strong>${adminEscapeHtml([approvedProfile.city, approvedProfile.state, approvedProfile.zip].filter(Boolean).join(", "))}</strong></div>
        <div class="card"><span class="label">Birth Date</span><strong>${adminEscapeHtml(approvedProfile.birthDate || "")}</strong></div>
        <div class="card"><span class="label">Driver License Number</span><strong>${adminEscapeHtml(approvedProfile.driverLicenseNumber || "")}</strong></div>
      </div>
      <p style="margin-top: 28px;"><strong>E-signed by:</strong> ${adminEscapeHtml(approvedProfile.contractSignedName || "")}</p>
      <p><strong>Signed date:</strong> ${adminEscapeHtml(approvedProfile.contractSignedAt || "")}</p>
    </body>
    </html>
  `;
}

function printCourseContractPdf(approvedProfile, courseContract) {
  const printWindow = window.open("", "_blank", "width=980,height=720");

  if (!printWindow) {
    return;
  }

  printWindow.document.write(buildContractPrintHtml(approvedProfile, courseContract));
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function buildPagesFromTopics(topics = []) {
  return topics.flatMap((topic) => (topic.subpages || []).map((subpage) => ({
    id: subpage.id,
    topicId: topic.id,
    topicTitle: topic.title,
    title: subpage.title,
    minutesRequired: subpage.minutesRequired,
    content: subpage.content,
    quiz: null
  })));
}

function normalizeAdminCourse(course) {
  const normalizedCourse = {
    id: course.id || adminCreateId("course"),
    title: course.title || adminDefaultCourse.title,
    description: course.description || adminDefaultCourse.description,
    price: course.price || adminDefaultCourse.price,
    passingScore: Number(course.passingScore || adminDefaultCourse.passingScore),
    topics: adminClone(course.topics || []),
    finalExam: adminClone(course.finalExam || []),
    contract: normalizeCourseContract(course.contract || adminDefaultContract)
  };
  if (!normalizedCourse.topics.length && Array.isArray(course.pages) && course.pages.length) {
    normalizedCourse.topics = [
      {
        id: adminCreateId("topic"),
        title: "Imported Topic",
        summary: "Imported from the previous course builder.",
        subpages: course.pages.map((page) => ({
          id: page.id || adminCreateId("subpage"),
          title: page.title,
          minutesRequired: Number(page.minutesRequired || 0),
          content: page.content || "",
          imageUrl: "",
          videoUrl: "",
          pptSourceName: ""
        })),
        quiz: []
      }
    ];
  }
  normalizedCourse.pages = buildPagesFromTopics(normalizedCourse.topics);
  return normalizedCourse;
}

function normalizeAdminCourseDraft(courseDraft) {
  const draft = {
    id: courseDraft.id || "",
    title: courseDraft.title || adminDefaultCourse.title,
    description: courseDraft.description || adminDefaultCourse.description,
    price: courseDraft.price || adminDefaultCourse.price,
    passingScore: Number(courseDraft.passingScore || adminDefaultCourse.passingScore),
    durationMinutes: Number(courseDraft.durationMinutes || 120),
    topics: adminClone(courseDraft.topics || []),
    finalExam: adminClone(courseDraft.finalExam || []),
    contract: normalizeCourseContract(courseDraft.contract || adminDefaultContract)
  };
  if (!draft.topics.length && Array.isArray(courseDraft.pages) && courseDraft.pages.length) {
    draft.topics = [
      {
        id: adminCreateId("topic"),
        title: "Imported Topic",
        summary: "Imported from the previous course builder.",
        subpages: courseDraft.pages.map((page) => ({
          id: page.id || adminCreateId("subpage"),
          title: page.title,
          minutesRequired: Number(page.minutesRequired || 0),
          content: page.content || "",
          imageUrl: "",
          videoUrl: "",
          pptSourceName: ""
        })),
        quiz: []
      }
    ];
  }
  return draft;
}

function ensureAdminPageAccess(contentId) {
  const locked = document.querySelector("#adminLocked");
  const content = document.querySelector(contentId);
  const authed = sessionStorage.getItem("wow-admin-auth") === "1";
  if (locked) locked.classList.toggle("hidden", authed);
  if (content) content.classList.toggle("hidden", !authed);
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#adminLogoutButton").forEach((button) => {
    button.addEventListener("click", () => {
      sessionStorage.removeItem("wow-admin-auth");
      window.location.href = "admin.html";
    });
  });
});
