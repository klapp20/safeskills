document.addEventListener("DOMContentLoaded", () => {
  ensureAdminPageAccess("#adminStudentsContent");
  if (sessionStorage.getItem("wow-admin-auth") !== "1") return;

  const rowsContainer = document.querySelector("#adminStudentsRows");
  const course = getAdminCourse();
  const enrollments = getAdminEnrollments();

  if (!rowsContainer) {
    return;
  }

  if (!enrollments.length) {
    rowsContainer.innerHTML = `<div class="empty-state">No students are currently taking the course.</div>`;
    return;
  }

  rowsContainer.innerHTML = `
    <table class="admin-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Date Started</th>
          <th>% Finished</th>
          <th>Password</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        ${enrollments.map((student) => {
          const startedDate = student.purchasedAt || student.startedAt || "Not started";
          const percentFinished = getEnrollmentCompletionPercent(student, course);
          return `
            <tr>
              <td>${adminEscapeHtml(student.memberName)}</td>
              <td>${adminEscapeHtml(startedDate)}</td>
              <td>${adminEscapeHtml(String(percentFinished))}%</td>
              <td>
                <button class="small-button" type="button" data-change-password="${encodeURIComponent(student.memberEmail)}" data-student-name="${adminEscapeHtml(student.memberName)}">
                  Change Password
                </button>
              </td>
              <td>
                <a class="small-button" href="admin-student-details.html?id=${encodeURIComponent(student.id)}">Student Details</a>
              </td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  `;

  rowsContainer.querySelectorAll("[data-change-password]").forEach((button) => {
    button.addEventListener("click", () => {
      const email = decodeURIComponent(button.dataset.changePassword || "");
      const studentName = button.dataset.studentName || "student";
      const currentPassword = getAdminStudentPassword(email);
      const nextPassword = window.prompt(`Enter a new password for ${studentName}:`, currentPassword);

      if (!nextPassword) {
        return;
      }

      saveAdminStudentPassword(email, nextPassword);
      window.alert(`Password updated for ${studentName}.`);
    });
  });
});
