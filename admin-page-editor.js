document.addEventListener("DOMContentLoaded", () => {
  ensureAdminPageAccess("#adminPageEditorContent");
  if (sessionStorage.getItem("wow-admin-auth") !== "1") return;

  function collectSavedPageOverrides() {
    const pages = ["index.html", "portal.html", "course.html", "contract.html", "failure-to-yield-homepage.html"];
    const collected = {};

    pages.forEach((pageName) => {
      try {
        const overrides = JSON.parse(localStorage.getItem(`safe-skills-page-overrides::${pageName}`) || "{}");
        if (Object.keys(overrides).length) {
          collected[pageName] = overrides;
        }
      } catch (error) {
        // Ignore invalid saved overrides for a single page.
      }
    });

    return collected;
  }

  function downloadPublishedOverridesFile() {
    const overrides = collectSavedPageOverrides();
    const fileContents = `window.safeSkillsPublishedPageOverrides = ${JSON.stringify(overrides, null, 2)};\n`;
    const blob = new Blob([fileContents], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "published-page-overrides.js";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const configs = {
    "index.html": {
      title: "Edit Home Page",
      description: "Update the main public home page content.",
      previewHref: "index.html",
      fields: [
        { key: "home-top-announcement", label: "Top announcement", type: "text", defaultValue: "Driving Lessons conducted in Watertown, Beaver Dam, Mayville and Waupun!" },
        { key: "home-brand", label: "Brand name", type: "text", defaultValue: "Safe Skills Driving School" },
        { key: "home-headline", label: "Main headline", type: "text", defaultValue: "Wisconsin Failure to Yield Course" },
        { key: "home-badge-1-title", label: "Badge 1 title", type: "text", defaultValue: "WISCONSIN APPROVED" },
        { key: "home-badge-1-sub", label: "Badge 1 subtext", type: "text", defaultValue: "DOT Course" },
        { key: "home-badge-2-title", label: "Badge 2 title", type: "text", defaultValue: "LOCATED IN" },
        { key: "home-badge-2-sub", label: "Badge 2 subtext", type: "text", defaultValue: "WISCONSIN" },
        { key: "home-badge-3-title", label: "Badge 3 title", type: "text", defaultValue: "EMAIL US" },
        { key: "home-badge-3-sub", label: "Badge 3 subtext", type: "text", defaultValue: "FOR QUESTIONS & SUPPORT" },
        { key: "home-approval-label", label: "Approval label", type: "text", defaultValue: "Approved by Wisconsin State DMV (#457)" },
        { key: "home-hero-title", label: "Hero title", type: "text", defaultValue: "Failure to Yield Right of Way Course Wisconsin drivers can complete online" },
        { key: "home-hero-copy", label: "Hero copy", type: "html", defaultValue: "Safe Skills Driving School offers a Wisconsin failure to yield right of way course for drivers who need to complete a state-approved 2-hour online course. The course is self-paced, easy to access, and designed for Wisconsin drivers who want a clear, fast online option." },
        { key: "home-cta-title", label: "CTA title", type: "text", defaultValue: "EASILY COMPLETE, 100% ONLINE" },
        { key: "home-cta-copy", label: "CTA copy", type: "html", defaultValue: "Our Failure to Yield / Right of Way course is completely online, and Wisconsin DOT approved." },
        { key: "home-price", label: "Price", type: "text", defaultValue: "$35" },
        { key: "home-price-note", label: "Price note", type: "text", defaultValue: "No Hidden Fees" },
        { key: "home-account-title", label: "Account card title", type: "text", defaultValue: "Create an Account" },
        { key: "home-account-copy", label: "Account card copy", type: "html", defaultValue: "If you are here first time, please create your account by clicking on the button below:" },
        { key: "home-cta-link", label: "Signup button link", type: "href", defaultValue: "registration.html" },
        { key: "home-login-title", label: "Login card title", type: "text", defaultValue: "Student Login" },
        { key: "home-login-copy", label: "Login card copy", type: "html", defaultValue: "If you already have an account, please login below." },
        { key: "home-login-link", label: "Login button link", type: "href", defaultValue: "course.html" },
        { key: "home-details-title", label: "Details section title", type: "text", defaultValue: "Right of Way Course Details" },
        { key: "home-details-subtitle", label: "Details section subtitle", type: "text", defaultValue: "Failure to Yield Traffic School in Wisconsin" },
        { key: "home-details-copy-1", label: "Details paragraph 1", type: "html", defaultValue: "Receiving a Failure To Yield traffic citation can be stressful. The state of Wisconsin requires some drivers to complete a specific traffic safety course. Safe Skills Driving School gives Wisconsin drivers a simple way to complete that requirement online with a self-paced 2-hour course." },
        { key: "home-details-copy-2", label: "Details paragraph 2", type: "html", defaultValue: "This Wisconsin failure to yield course covers right-of-way responsibilities, lawful driving procedures, pedestrian and bicyclist awareness, and Wisconsin-specific yield laws in a format that is easy to follow." },
        { key: "home-highlights-title", label: "Highlights card title", type: "text", defaultValue: "Course highlights" },
        { key: "home-why-title", label: "Why choose us title", type: "text", defaultValue: "Why students choose it" },
        { key: "home-school-title", label: "Traffic school section title", type: "text", defaultValue: "Wisconsin Traffic School Made Easy" },
        { key: "home-school-subtitle", label: "Traffic school section subtitle", type: "text", defaultValue: "Fast and easy - Right of Way / Failure to Yield Course built around the themes ranking sites emphasize" },
        { key: "home-portal-title", label: "Portal section title", type: "text", defaultValue: "Chapter Hub and Member Portal" },
        { key: "home-portal-subtitle", label: "Portal section subtitle", type: "text", defaultValue: "Your private member/admin platform now lives behind the public homepage" },
        { key: "home-portal-link", label: "Portal button link", type: "href", defaultValue: "portal.html" },
        { key: "home-signup-link-secondary", label: "Secondary signup button link", type: "href", defaultValue: "#signup" },
        { key: "home-faq-title", label: "FAQ section title", type: "text", defaultValue: "Failure to Yield - Wisconsin FAQ" },
        { key: "home-faq-subtitle", label: "FAQ section subtitle", type: "text", defaultValue: "SEO-focused answers for common Wisconsin right of way course searches" },
        { key: "home-footer-title", label: "Footer business title", type: "text", defaultValue: "Safe Skills Driving School, llc" },
        { key: "home-footer-phone-title", label: "Footer phone title", type: "text", defaultValue: "Phone Numbers" },
        { key: "home-footer-pay-title", label: "Footer payment title", type: "text", defaultValue: "We Accept" },
        { key: "home-footer-links-title", label: "Footer links title", type: "text", defaultValue: "Student Links" }
      ]
    },
    "portal.html": {
      title: "Edit Portal Page",
      description: "Update the portal branding, hero text, and login area language.",
      previewHref: "portal.html",
      fields: [
        { key: "portal-brand", label: "Portal brand", type: "text", defaultValue: "Safe Skills Driving School" },
        { key: "portal-title", label: "Portal title", type: "text", defaultValue: "Chapter Leadership Hub" },
        { key: "portal-hero-title", label: "Portal headline", type: "text", defaultValue: "One secure place for toolkits, chapter workflow, and paid member training." },
        { key: "portal-hero-copy", label: "Portal intro copy", type: "html", defaultValue: "This prototype now includes the Safe Skills Driving School chapter workspace and a members-only course area with timed lesson pages, quizzes, a final exam, and certificate completion." },
        { key: "portal-login-title", label: "Login area title", type: "text", defaultValue: "Login to the Safe Skills Driving School hub" }
      ]
    },
    "course.html": {
      title: "Edit Course Page",
      description: "Update the course page layout text and course experience messaging.",
      previewHref: "course.html",
      fields: [
        { key: "course-brand-kicker", label: "Sidebar brand", type: "text", defaultValue: "Safe Skills Driving School" },
        { key: "course-page-title", label: "Course page title", type: "text", defaultValue: "Safe Skills Driving School Member Course" },
        { key: "course-page-summary", label: "Course page summary", type: "html", defaultValue: "Complete the full course in this dedicated course view." },
        { key: "course-nav-title", label: "Navigation title", type: "text", defaultValue: "Course Navigation" },
        { key: "course-nav-hint", label: "Navigation hint", type: "text", defaultValue: "Follow each topic in order" },
        { key: "course-nav-select-label", label: "Mobile navigation label", type: "text", defaultValue: "Choose a lesson" },
        { key: "course-hero-kicker", label: "Hero kicker", type: "text", defaultValue: "Student Course Area" },
        { key: "course-hero-title", label: "Hero title", type: "text", defaultValue: "Work through each lesson, complete the quizzes, and finish strong." },
        { key: "course-hero-copy", label: "Hero copy", type: "html", defaultValue: "Your progress updates as you complete each required step. When you finish the final quiz successfully, your certificate is ready immediately." },
        { key: "course-stat-1-label", label: "Stat 1 label", type: "text", defaultValue: "Format" },
        { key: "course-stat-1-value", label: "Stat 1 value", type: "text", defaultValue: "Self-paced" },
        { key: "course-stat-2-label", label: "Stat 2 label", type: "text", defaultValue: "Access" },
        { key: "course-stat-2-value", label: "Stat 2 value", type: "text", defaultValue: "Purchased Course" },
        { key: "course-stat-3-label", label: "Stat 3 label", type: "text", defaultValue: "Finish" },
        { key: "course-stat-3-value", label: "Stat 3 value", type: "text", defaultValue: "Certificate Ready" }
      ]
    },
    "contract.html": {
      title: "Edit Contract Page",
      description: "Update the student contract page content and button links.",
      previewHref: "contract.html",
      fields: [
        { key: "contract-top-announcement", label: "Top announcement", type: "text", defaultValue: "Driving Lessons conducted in Watertown, Beaver Dam, Mayville and Waupun!" },
        { key: "contract-page-title", label: "Page title", type: "text", defaultValue: "Safe Skills Driving School Contract" },
        { key: "contract-page-chip", label: "Page chip label", type: "text", defaultValue: "Agreement" },
        { key: "contract-online-label", label: "Online label", type: "text", defaultValue: "Online Classroom Only" },
        { key: "contract-online-copy", label: "Online classroom copy", type: "html", defaultValue: "Includes 2 hours of online classroom. No behind the wheel instruction." },
        { key: "contract-copy-1", label: "Contract paragraph 1", type: "html", defaultValue: "I agree to pay the course fee for 2 hours of online classroom. Full payment is due for the instruction listed above." },
        { key: "contract-copy-2", label: "Contract paragraph 2", type: "html", defaultValue: "I acknowledge that online learning must be completed within 30 days, beginning on the date the first lesson is started. If the lessons are not completed within 90 days, a $25 extension fee will be applied to allow for an additional 90 days." },
        { key: "contract-copy-3", label: "Contract paragraph 3", type: "html", defaultValue: "This school will not refund any tuition or part of tuition if the school is ready, willing and able to fulfill their part of this agreement." },
        { key: "contract-copy-4", label: "Contract paragraph 4", type: "html", defaultValue: "I agree to receive text messages and e-mails from Safe Skills Driving School for appointment reminders and other information." },
        { key: "contract-copy-5", label: "Contract paragraph 5", type: "html", defaultValue: "This constitutes the entire agreement between the school and the student, no verbal statement or promises will be recognized." },
        { key: "contract-agree-copy", label: "Agreement checkbox copy", type: "html", defaultValue: "I understand and agree to this Safe Skills Driving School contract." },
        { key: "contract-submit-label", label: "Submit button label", type: "text", defaultValue: "Sign Contract And Continue" },
        { key: "contract-feedback-copy", label: "Signature helper text", type: "html", defaultValue: "Type your full name to e-sign this agreement." },
        { key: "contract-signed-title", label: "Signed state title", type: "text", defaultValue: "Contract signed" },
        { key: "contract-course-link", label: "Course link after signing", type: "href", defaultValue: "course.html" },
        { key: "contract-print-label", label: "Print button label", type: "text", defaultValue: "Print Or Save PDF" }
      ]
    },
    "failure-to-yield-homepage.html": {
      title: "Edit SEO Landing Page",
      description: "Update the public SEO landing page content.",
      previewHref: "failure-to-yield-homepage.html",
      fields: [
        { key: "landing-top-announcement", label: "Top announcement", type: "text", defaultValue: "Driving Lessons conducted in Watertown, Beaver Dam, Mayville and Waupun!" },
        { key: "landing-brand", label: "Brand name", type: "text", defaultValue: "Safe Skills Driving School" },
        { key: "landing-headline", label: "Main headline", type: "text", defaultValue: "Wisconsin Failure to Yield Course" },
        { key: "landing-badge-1-title", label: "Badge 1 title", type: "text", defaultValue: "WISCONSIN APPROVED" },
        { key: "landing-badge-1-sub", label: "Badge 1 subtext", type: "text", defaultValue: "DOT Course" },
        { key: "landing-badge-2-title", label: "Badge 2 title", type: "text", defaultValue: "LOCATED IN" },
        { key: "landing-badge-2-sub", label: "Badge 2 subtext", type: "text", defaultValue: "WISCONSIN" },
        { key: "landing-badge-3-title", label: "Badge 3 title", type: "text", defaultValue: "EMAIL US" },
        { key: "landing-badge-3-sub", label: "Badge 3 subtext", type: "text", defaultValue: "FOR QUESTIONS & SUPPORT" },
        { key: "landing-approval-label", label: "Approval label", type: "text", defaultValue: "Approved by Wisconsin State DMV (#457)" },
        { key: "landing-hero-title", label: "Hero title", type: "text", defaultValue: "Failure to Yield Right of Way Course Wisconsin drivers can complete online" },
        { key: "landing-hero-copy", label: "Hero copy", type: "html", defaultValue: "Safe Skills Driving School offers a Wisconsin failure to yield right of way course for drivers who need to complete a state-approved 2-hour online course. The course is self-paced, easy to access, and designed for Wisconsin drivers who want a clear, fast online option." },
        { key: "landing-cta-title", label: "CTA title", type: "text", defaultValue: "EASILY COMPLETE, 100% ONLINE" },
        { key: "landing-cta-copy", label: "CTA copy", type: "html", defaultValue: "Our Failure to Yield / Right of Way course is completely online, and Wisconsin DOT approved." },
        { key: "landing-price", label: "Price", type: "text", defaultValue: "$35" },
        { key: "landing-price-note", label: "Price note", type: "text", defaultValue: "No Hidden Fees" },
        { key: "landing-account-title", label: "Account card title", type: "text", defaultValue: "Create an Account" },
        { key: "landing-account-copy", label: "Account card copy", type: "html", defaultValue: "If you are here first time, please create your account by clicking on the button below:" },
        { key: "landing-signup-link", label: "Signup button link", type: "href", defaultValue: "registration.html" },
        { key: "landing-login-title", label: "Login card title", type: "text", defaultValue: "Student Login" },
        { key: "landing-login-copy", label: "Login card copy", type: "html", defaultValue: "If you already have an account, please login below." },
        { key: "landing-login-link", label: "Login button link", type: "href", defaultValue: "https://www.safeskillsdrivingschool.com/right-of-way-course-details-wis" },
        { key: "landing-details-title", label: "Details section title", type: "text", defaultValue: "Right of Way Course Details" },
        { key: "landing-details-subtitle", label: "Details section subtitle", type: "text", defaultValue: "Failure to Yield Traffic School in Wisconsin" },
        { key: "landing-details-copy-1", label: "Details paragraph 1", type: "html", defaultValue: "Receiving a Failure To Yield traffic citation can be stressful. The state of Wisconsin requires some drivers to complete a specific traffic safety course. Safe Skills Driving School gives Wisconsin drivers a simple way to complete that requirement online with a self-paced 2-hour course." },
        { key: "landing-details-copy-2", label: "Details paragraph 2", type: "html", defaultValue: "This Wisconsin failure to yield course covers right-of-way responsibilities, lawful driving procedures, pedestrian and bicyclist awareness, and Wisconsin-specific yield laws in a format that is easy to follow." },
        { key: "landing-highlights-title", label: "Highlights card title", type: "text", defaultValue: "Course highlights" },
        { key: "landing-why-title", label: "Why choose us title", type: "text", defaultValue: "Why students choose it" },
        { key: "landing-school-title", label: "Traffic school section title", type: "text", defaultValue: "Wisconsin Traffic School Made Easy" },
        { key: "landing-school-subtitle", label: "Traffic school section subtitle", type: "text", defaultValue: "Fast and easy - Right of Way / Failure to Yield Course built around the themes ranking sites emphasize" },
        { key: "landing-seo-title", label: "SEO section title", type: "text", defaultValue: "Why this page is optimized for Wisconsin search intent" },
        { key: "landing-seo-subtitle", label: "SEO section subtitle", type: "text", defaultValue: "Built from the strongest common on-page patterns used by current ranking right of way course websites" },
        { key: "landing-portal-title", label: "Portal section title", type: "text", defaultValue: "Chapter Hub and Member Portal" },
        { key: "landing-portal-subtitle", label: "Portal section subtitle", type: "text", defaultValue: "Restored from the original Codex-built membership website so your site keeps its broader functionality" },
        { key: "landing-portal-link", label: "Portal button link", type: "href", defaultValue: "index.html" },
        { key: "landing-signup-link-secondary", label: "Secondary signup button link", type: "href", defaultValue: "#signup" },
        { key: "landing-membership-title", label: "Membership section title", type: "text", defaultValue: "How the membership app works" },
        { key: "landing-membership-subtitle", label: "Membership section subtitle", type: "text", defaultValue: "Everything originally built in the Codex membership project is now summarized on the homepage" },
        { key: "landing-features-title", label: "Features section title", type: "text", defaultValue: "Member course features included in the app" },
        { key: "landing-features-subtitle", label: "Features section subtitle", type: "text", defaultValue: "The public homepage now explains the private course system that exists inside your portal" },
        { key: "landing-faq-title", label: "FAQ section title", type: "text", defaultValue: "Failure to Yield - Wisconsin FAQ" },
        { key: "landing-faq-subtitle", label: "FAQ section subtitle", type: "text", defaultValue: "SEO-focused answers for common Wisconsin right of way course searches" },
        { key: "landing-website-title", label: "Website section title", type: "text", defaultValue: "What your website includes now" },
        { key: "landing-website-subtitle", label: "Website section subtitle", type: "text", defaultValue: "The search-friendly homepage and the original Codex-built portal can work together as one website" },
        { key: "landing-footer-title", label: "Footer business title", type: "text", defaultValue: "Safe Skills Driving School, llc" },
        { key: "landing-footer-phone-title", label: "Footer phone title", type: "text", defaultValue: "Phone Numbers" },
        { key: "landing-footer-pay-title", label: "Footer payment title", type: "text", defaultValue: "We Accept" },
        { key: "landing-footer-links-title", label: "Footer links title", type: "text", defaultValue: "Student Links" }
      ]
    }
  };

  const page = new URLSearchParams(window.location.search).get("page");
  const config = configs[page];
  const title = document.querySelector("#pageEditorTitle");
  const description = document.querySelector("#pageEditorDescription");
  const previewLink = document.querySelector("#pagePreviewLink");
  const form = document.querySelector("#pageEditorForm");
  const publishFeedback = document.querySelector("#pagePublishFeedback");
  const downloadButton = document.querySelector("#downloadPublishedOverrides");

  if (!config) {
    title.textContent = "Page Not Available";
    description.textContent = "This page does not have a browser editor yet.";
    form.innerHTML = `<div class="empty-state">Choose index.html, portal.html, or failure-to-yield-homepage.html from the Page Manager.</div>`;
    previewLink.classList.add("hidden");
    return;
  }

  const storageKey = `safe-skills-page-overrides::${page}`;
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
  } catch (error) {
    saved = {};
  }

  title.textContent = config.title;
  description.textContent = config.description;
  previewLink.href = config.previewHref;

  form.innerHTML = `
    ${config.fields.map((field) => {
      const value = saved[field.key]?.value ?? field.defaultValue;
      if (field.type === "html") {
        return `<label>${field.label}<textarea data-editor-key="${field.key}" data-editor-type="${field.type}" rows="6">${value}</textarea></label>`;
      }
      return `<label>${field.label}<input data-editor-key="${field.key}" data-editor-type="${field.type}" type="text" value="${String(value).replaceAll('"', "&quot;")}"></label>`;
    }).join("")}
    <div class="builder-actions">
      <button class="primary-button" type="submit">Save Page Content</button>
      <button class="secondary-button" id="resetPageOverrides" type="button">Reset Page</button>
    </div>
    <p class="form-note" id="pageEditorFeedback">Saved changes will show on this browser for the selected page.</p>
  `;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const overrides = {};
    form.querySelectorAll("[data-editor-key]").forEach((field) => {
      overrides[field.dataset.editorKey] = {
        type: field.dataset.editorType,
        value: field.value
      };
    });
    localStorage.setItem(storageKey, JSON.stringify(overrides));
    document.querySelector("#pageEditorFeedback").textContent = "Page content saved.";
  });

  document.querySelector("#resetPageOverrides").addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    window.location.reload();
  });

  downloadButton?.addEventListener("click", () => {
    downloadPublishedOverridesFile();
    if (publishFeedback) {
      publishFeedback.textContent = "Downloaded `published-page-overrides.js`. Upload that file to Tiiny so everyone sees the saved page edits.";
    }
  });
});
