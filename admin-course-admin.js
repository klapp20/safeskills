document.addEventListener("DOMContentLoaded", () => {
  ensureAdminPageAccess("#adminCourseContent");
  if (sessionStorage.getItem("wow-admin-auth") !== "1") return;

  const adminCourseList = document.querySelector("#adminCourseList");
  const adminCourseOverview = document.querySelector("#adminCourseOverview");
  const downloadPublishedCourseButton = document.querySelector("#downloadPublishedCourseButton");

  function downloadPublishedCourseFile(course) {
    const fileContents = `window.safeSkillsPublishedCourse = ${JSON.stringify(course, null, 2)};\n`;
    const blob = new Blob([fileContents], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "published-course.js";
    link.click();
    URL.revokeObjectURL(url);
  }

  function renderCourseAdmin() {
    const courses = getAdminCourses();
    const activeCourseId = getActiveAdminCourseId();
    const activeCourse = getAdminCourse();
    const totalMinutes = activeCourse.pages.reduce((sum, page) => sum + Number(page.minutesRequired || 0), 0);

    adminCourseList.innerHTML = courses.map((course) => {
      const courseMinutes = course.pages.reduce((sum, page) => sum + Number(page.minutesRequired || 0), 0);
      const isActive = course.id === activeCourseId;
      return `
        <article class="activity-item">
          <div class="section-title-row">
            <h5>${adminEscapeHtml(course.title)}</h5>
            <span class="section-chip gold">${isActive ? "Published" : "Draft"}</span>
          </div>
          <p class="activity-meta">${adminEscapeHtml(course.description)}</p>
          <p class="activity-meta">${adminEscapeHtml(String((course.topics || []).length))} topic(s) | ${adminEscapeHtml(String(course.pages.length))} sub-page(s) | ${adminEscapeHtml(String(course.finalExam.length))} final question(s) | ${adminEscapeHtml(String(courseMinutes))} minutes</p>
          <div class="activity-actions">
            <a class="small-button" href="admin-course-details.html?id=${encodeURIComponent(course.id)}">Open Course</a>
            <a class="small-button" href="admin-create-course.html?courseId=${encodeURIComponent(course.id)}">Edit In Builder</a>
            ${isActive ? "" : `<button class="small-button" type="button" data-publish-course="${course.id}">Set Published</button>`}
            <button class="small-button" type="button" data-delete-course="${course.id}">Delete</button>
          </div>
        </article>
      `;
    }).join("");

    adminCourseOverview.innerHTML = `
      <article class="activity-item">
        <h5>${adminEscapeHtml(activeCourse.title)}</h5>
        <p class="activity-meta">${adminEscapeHtml(activeCourse.description)}</p>
        <p class="activity-meta">Price: ${adminEscapeHtml(activeCourse.price)} | Passing score: ${adminEscapeHtml(String(activeCourse.passingScore))}% | Total lesson time: ${adminEscapeHtml(String(totalMinutes))} minutes</p>
        <p class="activity-meta">Topics: ${adminEscapeHtml(String((activeCourse.topics || []).length))} | Sub-pages: ${adminEscapeHtml(String(activeCourse.pages.length))} | Final questions: ${adminEscapeHtml(String(activeCourse.finalExam.length))}</p>
      </article>
    `;

    adminCourseList.querySelectorAll("[data-publish-course]").forEach((button) => {
      button.addEventListener("click", () => {
        const course = getAdminCourseById(button.dataset.publishCourse);
        if (!course) return;
        setActiveAdminCourseId(course.id);
        localStorage.setItem("wow-course", JSON.stringify(course));
        renderCourseAdmin();
      });
    });

    adminCourseList.querySelectorAll("[data-delete-course]").forEach((button) => {
      button.addEventListener("click", () => {
        removeAdminCourseById(button.dataset.deleteCourse);
        renderCourseAdmin();
      });
    });
  }

  downloadPublishedCourseButton?.addEventListener("click", () => {
    downloadPublishedCourseFile(getAdminCourse());
  });

  renderCourseAdmin();
});
