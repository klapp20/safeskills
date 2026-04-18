document.addEventListener("DOMContentLoaded", () => {
  ensureAdminPageAccess("#adminStudentContent");
  if (sessionStorage.getItem("wow-admin-auth") !== "1") return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const course = getAdminCourse();
  const enrollments = getAdminEnrollments();
  const student = enrollments.find((item) => item.id === id);
  const approvedProfile = student?.registrationProfile || getAdminStudentProfileByEmail(student?.memberEmail || "");
  const overview = document.querySelector("#studentDetailsOverview");
  const progressList = document.querySelector("#studentProgressList");
  const actions = document.querySelector("#studentDetailsActions");

  if (!student) {
    overview.innerHTML = `<div class="empty-state">Student record not found.</div>`;
    progressList.innerHTML = "";
    if (actions) actions.innerHTML = "";
    return;
  }

  const step = getEnrollmentCurrentStep(student, course);
  const summary = buildStudentRecordSummary(student, approvedProfile, course);
  const progressRows = buildStudentProgressRows(student, course);
  const courseContract = normalizeCourseContract(course.contract || adminDefaultContract);

  overview.innerHTML = renderStudentRecordGrid(summary);

  if (actions) {
    actions.innerHTML = `
      <button class="primary-button" id="printStudentRecordButton" type="button">Print Or Save PDF</button>
      <button class="secondary-button" id="printStudentContractButton" type="button">Print Contract</button>
      <button class="small-button" id="markStudentCompletedButton" type="button">Mark Student Completed</button>
      <button class="small-button" id="removeStudentButton" type="button">Remove Student</button>
      <span class="activity-meta">Status: ${adminEscapeHtml(student.statusLabel)} | Current page: ${adminEscapeHtml(step.label)} | Time on step: ${adminEscapeHtml(step.elapsed)}</span>
    `;
  }

  progressList.innerHTML = renderStudentProgressTable(progressRows);

  document.querySelector("#printStudentRecordButton")?.addEventListener("click", () => {
    printStudentRecordPdf(summary, progressRows);
  });

  document.querySelector("#printStudentContractButton")?.addEventListener("click", () => {
    if (!approvedProfile) {
      window.alert("No signed contract was found in this browser for this student yet.");
      return;
    }

    printCourseContractPdf(approvedProfile, courseContract);
  });

  document.querySelector("#markStudentCompletedButton")?.addEventListener("click", () => {
    const shouldComplete = window.confirm(`Mark ${student.memberName} as completed? They will no longer be able to access the course.`);

    if (!shouldComplete) {
      return;
    }

    markAdminEnrollmentCompleted(student.id);
    window.location.reload();
  });

  document.querySelector("#removeStudentButton")?.addEventListener("click", () => {
    const shouldRemove = window.confirm(`Remove ${student.memberName} from the student list?`);

    if (!shouldRemove) {
      return;
    }

    removeAdminEnrollmentById(student.id);
    window.location.href = "admin-students.html";
  });
});
