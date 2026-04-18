document.addEventListener("DOMContentLoaded", () => {
  ensureAdminPageAccess("#adminPagesContent");
  if (sessionStorage.getItem("wow-admin-auth") !== "1") return;

  const pages = [
    {
      title: "Public Home Page",
      file: "index.html",
      description: "Main public-facing home page for the site.",
      openHref: "index.html",
      editHref: "admin-page-editor.html?page=index.html",
      editLabel: "Edit Page"
    },
    {
      title: "Portal",
      file: "portal.html",
      description: "Member and admin access portal.",
      openHref: "portal.html",
      editHref: "admin-page-editor.html?page=portal.html",
      editLabel: "Edit Page"
    },
    {
      title: "Course Page",
      file: "course.html",
      description: "Dedicated member course experience with progress and quizzes.",
      openHref: "course.html",
      editHref: "admin-page-editor.html?page=course.html",
      editLabel: "Edit Page"
    },
    {
      title: "Registration Page",
      file: "registration.html",
      description: "Student profile creation page before Stripe payment.",
      openHref: "registration.html",
      editHref: "admin-registration.html",
      editLabel: "Edit Registration"
    },
    {
      title: "Registration Success Page",
      file: "registration-success.html",
      description: "Student return page after payment is completed.",
      openHref: "registration-success.html",
      editHref: "admin-registration.html",
      editLabel: "Edit Registration"
    },
    {
      title: "Student Contract Page",
      file: "contract.html",
      description: "Student agreement page shown after payment and before course access.",
      openHref: "contract.html",
      editHref: "admin-page-editor.html?page=contract.html",
      editLabel: "Edit Page"
    },
    {
      title: "Course Admin",
      file: "admin-course.html",
      description: "Course list and publishing controls.",
      openHref: "admin-course.html",
      editHref: "admin-course.html",
      editLabel: "Open Admin Page"
    },
    {
      title: "Create Course",
      file: "admin-create-course.html",
      description: "Step-by-step builder for course details, topics, sub-pages, and quizzes.",
      openHref: "admin-create-course.html",
      editHref: "admin-create-course.html",
      editLabel: "Open Builder"
    },
    {
      title: "Course Details",
      file: "admin-course-details.html",
      description: "Topic and sub-page management page for a selected course.",
      openHref: "admin-course.html",
      editHref: "admin-course.html",
      editLabel: "Choose Course First"
    },
    {
      title: "Admin Dashboard",
      file: "admin.html",
      description: "Main admin dashboard overview.",
      openHref: "admin.html",
      editHref: "admin.html",
      editLabel: "Open Admin Page"
    },
    {
      title: "Registration Settings",
      file: "admin-registration.html",
      description: "Admin settings page for registration text and success messaging.",
      openHref: "admin-registration.html",
      editHref: "admin-registration.html",
      editLabel: "Open Admin Page"
    },
    {
      title: "Payment Settings",
      file: "admin-payments.html",
      description: "Admin settings page for Stripe payment links and return URLs.",
      openHref: "admin-payments.html",
      editHref: "admin-payments.html",
      editLabel: "Open Admin Page"
    },
    {
      title: "Backend Settings",
      file: "admin-backend.html",
      description: "Admin settings page for cross-device student login and backend sync.",
      openHref: "admin-backend.html",
      editHref: "admin-backend.html",
      editLabel: "Open Admin Page"
    },
    {
      title: "Student Details",
      file: "admin-student-details.html",
      description: "Student progress detail page opened from course admin.",
      openHref: "admin-course.html#students",
      editHref: "admin-course.html#students",
      editLabel: "Open Student List"
    },
    {
      title: "SEO Landing Page",
      file: "failure-to-yield-homepage.html",
      description: "Public SEO page for the Wisconsin failure to yield course.",
      openHref: "failure-to-yield-homepage.html",
      editHref: "admin-page-editor.html?page=failure-to-yield-homepage.html",
      editLabel: "Edit Page"
    }
  ];

  const pagesList = document.querySelector("#adminPagesList");
  pagesList.innerHTML = pages.map((page) => `
    <article class="activity-item">
      <div class="section-title-row">
        <h5>${adminEscapeHtml(page.title)}</h5>
        <span class="section-chip gold">${adminEscapeHtml(page.file)}</span>
      </div>
      <p class="activity-meta">${adminEscapeHtml(page.description)}</p>
      <div class="activity-actions">
        <a class="small-button" href="${page.openHref}">Open Page</a>
        <a class="small-button" href="${page.editHref}">${adminEscapeHtml(page.editLabel)}</a>
      </div>
    </article>
  `).join("");
});
