document.addEventListener("DOMContentLoaded", () => {
  ensureAdminPageAccess("#adminDashboardContent");
  if (sessionStorage.getItem("wow-admin-auth") !== "1") return;

  const course = getAdminCourse();
  const enrollments = getAdminEnrollments();
  const courseSummary = document.querySelector("#adminDashboardCourseSummary");
  const studentSummary = document.querySelector("#adminDashboardStudentSummary");
  const overview = document.querySelector("#adminDashboardOverview");
  const highlights = document.querySelector("#adminDashboardHighlights");
  const studentsTable = document.querySelector("#adminDashboardStudentsTable");
  const totalMinutes = course.pages.reduce((sum, page) => sum + Number(page.minutesRequired || 0), 0);
  const savedStripeLink = getAdminStripePaymentLink();
  const savedStripeSuccessUrl = getAdminStripeSuccessUrl();
  const savedStripeCancelUrl = getAdminStripeCancelUrl();

  courseSummary.textContent = `${course.title} with ${course.pages.length} lesson page(s) and ${course.finalExam.length} final test question(s).`;
  studentSummary.textContent = `${enrollments.length} current student enrollment(s) are being tracked in the course.`;
  overview.textContent = `Current course price ${course.price}, passing score ${course.passingScore}%, total lesson time ${totalMinutes} minutes.`;

  highlights.innerHTML = `
    <article class="activity-item">
      <h5>${adminEscapeHtml(course.title)}</h5>
      <p class="activity-meta">${adminEscapeHtml(course.description)}</p>
      <p class="activity-meta">${course.pages.length} pages | ${course.finalExam.length} final questions | ${totalMinutes} minutes total</p>
    </article>
    <article class="activity-item">
      <h5>Course administration</h5>
      <p class="activity-meta">Create a new course draft, update current course options, add pages, and manage final exam questions from the Course Admin page.</p>
    </article>
    <article class="activity-item">
      <h5>Payment setup</h5>
      <p class="activity-meta">${savedStripeLink ? `Stripe payment link saved: ${adminEscapeHtml(savedStripeLink)}` : "No Stripe payment link saved yet."}</p>
      <p class="activity-meta">${savedStripeSuccessUrl ? `Success URL: ${adminEscapeHtml(savedStripeSuccessUrl)}` : "No success URL saved yet."}</p>
      <p class="activity-meta">${savedStripeCancelUrl ? `Cancel URL: ${adminEscapeHtml(savedStripeCancelUrl)}` : "No cancel URL saved yet."}</p>
    </article>
  `;

  if (!enrollments.length) {
    studentsTable.innerHTML = `<div class="empty-state">No current students enrolled yet.</div>`;
    return;
  }

  studentsTable.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Status</th>
          <th>Current Page</th>
          <th>Time On Step</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        ${enrollments.map((student) => {
          const step = getEnrollmentCurrentStep(student, course);
          return `
            <tr>
              <td>${adminEscapeHtml(student.memberName)}<br><span class="activity-meta">${adminEscapeHtml(student.memberEmail)}</span></td>
              <td>${adminEscapeHtml(student.statusLabel)}</td>
              <td>${adminEscapeHtml(step.label)}</td>
              <td>${adminEscapeHtml(step.elapsed)}</td>
              <td><a class="small-button" href="admin-student-details.html?id=${encodeURIComponent(student.id)}">Open</a></td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;
});
