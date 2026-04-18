document.addEventListener("DOMContentLoaded", () => {
  ensureAdminPageAccess("#adminCreateCourseContent");
  if (sessionStorage.getItem("wow-admin-auth") !== "1") return;

  const cloneCourseData = typeof adminClone === "function"
    ? adminClone
    : ((value) => JSON.parse(JSON.stringify(value)));

  let draftCourse = getAdminCourseDraft();
  let currentStep = 1;
  let editingTopicId = null;
  let editingSubpageId = null;
  let editingTopicQuizId = null;
  let editingFinalQuizId = null;
  let pendingImageDataUrl = "";
  let pendingVideoDataUrl = "";

  const stepLabel = document.querySelector("#createCourseStepLabel");
  const stepButtons = Array.from(document.querySelectorAll("[data-step-target]"));
  const stepPanels = Array.from(document.querySelectorAll("[data-step-panel]"));
  const detailsForm = document.querySelector("#courseBuilderDetailsForm");
  const detailsFeedback = document.querySelector("#courseBuilderDetailsFeedback");
  const topicForm = document.querySelector("#builderTopicForm");
  const topicFeedback = document.querySelector("#builderTopicFeedback");
  const subpageForm = document.querySelector("#builderSubpageForm");
  const subpageFeedback = document.querySelector("#builderSubpageFeedback");
  const topicQuizForm = document.querySelector("#builderTopicQuizForm");
  const topicQuizFeedback = document.querySelector("#builderTopicQuizFeedback");
  const finalQuizForm = document.querySelector("#builderFinalQuizForm");
  const finalQuizFeedback = document.querySelector("#builderFinalQuizFeedback");
  const topicsList = document.querySelector("#builderTopicsList");
  const topicsEditor = document.querySelector("#builderTopicsEditor");
  const subpagesList = document.querySelector("#builderSubpagesList");
  const finalQuizList = document.querySelector("#builderFinalQuizList");
  const summary = document.querySelector("#courseBuilderSummary");
  const preview = document.querySelector("#builderSubpagePreview");
  const topicTitleInput = document.querySelector("#builderTopicTitle");
  const topicSummaryInput = document.querySelector("#builderTopicSummary");

  function totalDraftMinutes() {
    return draftCourse.topics.reduce((topicSum, topic) => topicSum + (topic.subpages || []).reduce((sum, subpage) => sum + Number(subpage.minutesRequired || 0), 0), 0);
  }

  function saveDraft() {
    saveAdminCourseDraft(draftCourse);
  }

  function getTopicById(topicId) {
    return draftCourse.topics.find((topic) => topic.id === topicId) || null;
  }

  function fillDetailsForm() {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("courseId");
    if (courseId) {
      const existingCourse = getAdminCourseById(courseId);
      if (existingCourse && (!draftCourse.id || draftCourse.id !== courseId)) {
        draftCourse = {
          id: existingCourse.id,
          title: existingCourse.title,
          description: existingCourse.description,
          price: existingCourse.price,
          passingScore: existingCourse.passingScore,
          durationMinutes: existingCourse.pages.reduce((sum, page) => sum + Number(page.minutesRequired || 0), 0) || 120,
          topics: cloneCourseData(existingCourse.topics || []),
          finalExam: cloneCourseData(existingCourse.finalExam || []),
          contract: cloneCourseData(existingCourse.contract || adminDefaultContract)
        };
        saveDraft();
      }
    }
    document.querySelector("#builderCourseTitle").value = draftCourse.title || "";
    document.querySelector("#builderCourseDescription").value = draftCourse.description || "";
    document.querySelector("#builderCourseDuration").value = draftCourse.durationMinutes || totalDraftMinutes() || 120;
    document.querySelector("#builderCoursePrice").value = draftCourse.price || "";
    document.querySelector("#builderCoursePassingScore").value = draftCourse.passingScore || 80;
  }

  function setStep(stepNumber) {
    currentStep = stepNumber;
    stepLabel.textContent = `Step ${stepNumber} of 4`;
    stepButtons.forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.stepTarget) === stepNumber);
    });
    stepPanels.forEach((panel) => {
      panel.classList.toggle("hidden", Number(panel.dataset.stepPanel) !== stepNumber);
    });
  }

  function updateTopicSelects() {
    const options = draftCourse.topics.length
      ? draftCourse.topics.map((topic) => `<option value="${adminEscapeHtml(topic.id)}">${adminEscapeHtml(topic.title)}</option>`).join("")
      : `<option value="">Add a topic first</option>`;
    [
      document.querySelector("#builderSubpageTopic"),
      document.querySelector("#builderTopicQuizTopic")
    ].forEach((select) => {
      const previous = select.value;
      select.innerHTML = options;
      if (draftCourse.topics.length) {
        select.value = draftCourse.topics.some((topic) => topic.id === previous) ? previous : draftCourse.topics[0].id;
      }
    });
  }

  function resetTopicForm() {
    topicForm.reset();
    editingTopicId = null;
    topicForm.querySelector('button[type="submit"]').textContent = "Add Topic";
  }

  function loadTopicIntoForm(topic) {
    if (!topic) return;
    editingTopicId = topic.id;
    topicTitleInput.value = topic.title || "";
    topicSummaryInput.value = topic.summary || "";
    topicForm.querySelector('button[type="submit"]').textContent = "Save Topic";
    topicFeedback.textContent = `Editing topic: ${topic.title}`;
    setStep(2);
    topicTitleInput.focus();
    topicForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetSubpageForm() {
    subpageForm.reset();
    editingSubpageId = null;
    pendingImageDataUrl = "";
    pendingVideoDataUrl = "";
    document.querySelector("#builderSubpageMinutes").value = 5;
    subpageForm.querySelector('button[type="submit"]').textContent = "Add Sub-Page";
    renderPreview();
  }

  function resetTopicQuizForm() {
    topicQuizForm.reset();
    editingTopicQuizId = null;
    topicQuizForm.querySelector('button[type="submit"]').textContent = "Add Topic Quiz Question";
  }

  function resetFinalQuizForm() {
    finalQuizForm.reset();
    editingFinalQuizId = null;
    finalQuizForm.querySelector('button[type="submit"]').textContent = "Add Final Quiz Question";
  }

  function renderPreview() {
    const rawHtml = document.querySelector("#builderSubpageContent").value.trim();
    const title = document.querySelector("#builderSubpageTitle").value.trim() || "Sub-page title";
    const videoUrl = document.querySelector("#builderSubpageVideoUrl").value.trim() || pendingVideoDataUrl;
    const imageUrl = pendingImageDataUrl;
    preview.innerHTML = `
      <div class="slide-preview-content">
        <div>
          <p class="card-label">Presentation Slide</p>
          <h4>${adminEscapeHtml(title)}</h4>
        </div>
        <div class="slide-preview-body">${rawHtml || "<p>Add text, images, or video for this course sub-page.</p>"}</div>
        ${imageUrl ? `<img class="slide-preview-media" src="${imageUrl}" alt="Sub-page preview image">` : ""}
        ${videoUrl ? `<div class="slide-preview-video-wrap"><video class="slide-preview-media" controls src="${videoUrl}"></video></div>` : ""}
      </div>
    `;
  }

  function renderTopicsList() {
    if (!draftCourse.topics.length) {
      topicsList.innerHTML = `<div class="empty-state">No course topics added yet.</div>`;
      return;
    }
    topicsList.innerHTML = draftCourse.topics.map((topic, index) => `
      <article class="activity-item">
        <h5>${index + 1}. ${adminEscapeHtml(topic.title)}</h5>
        <p class="activity-meta">${adminEscapeHtml(topic.summary)}</p>
        <p class="activity-meta">${(topic.subpages || []).length} sub-page(s) | ${(topic.quiz || []).length} topic quiz question(s)</p>
        <div class="activity-actions">
          <button class="small-button" type="button" data-topic-action="edit" data-topic-id="${topic.id}">Edit</button>
          <button class="small-button" type="button" data-topic-action="up" data-topic-id="${topic.id}" ${index === 0 ? "disabled" : ""}>Move Up</button>
          <button class="small-button" type="button" data-topic-action="down" data-topic-id="${topic.id}" ${index === draftCourse.topics.length - 1 ? "disabled" : ""}>Move Down</button>
          <button class="small-button" type="button" data-topic-action="delete" data-topic-id="${topic.id}">Delete</button>
        </div>
      </article>
    `).join("");

    topicsList.querySelectorAll("[data-topic-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const { topicAction, topicId } = button.dataset;
        const index = draftCourse.topics.findIndex((topic) => topic.id === topicId);
        if (index < 0) return;
        if (topicAction === "edit") {
          const topic = draftCourse.topics[index];
          loadTopicIntoForm(topic);
          return;
        }
        if (topicAction === "delete") {
          draftCourse.topics.splice(index, 1);
        }
        if (topicAction === "up" && index > 0) {
          [draftCourse.topics[index - 1], draftCourse.topics[index]] = [draftCourse.topics[index], draftCourse.topics[index - 1]];
        }
        if (topicAction === "down" && index < draftCourse.topics.length - 1) {
          [draftCourse.topics[index + 1], draftCourse.topics[index]] = [draftCourse.topics[index], draftCourse.topics[index + 1]];
        }
        saveDraft();
        renderAll();
      });
    });
  }

  function renderTopicsEditor() {
    if (!draftCourse.topics.length) {
      topicsEditor.innerHTML = `<div class="empty-state">Add a topic in Step 2 before building sub-pages or topic quizzes.</div>`;
      return;
    }

    topicsEditor.innerHTML = draftCourse.topics.map((topic) => `
      <article class="activity-item">
        <h5>${adminEscapeHtml(topic.title)}</h5>
        <p class="activity-meta">${adminEscapeHtml(topic.summary)}</p>
        <div class="builder-manager-grid">
          <div>
            <p class="card-label">Sub-Pages</p>
            ${(topic.subpages || []).length ? topic.subpages.map((subpage, index) => `
              <div class="builder-inline-card">
                <strong>${index + 1}. ${adminEscapeHtml(subpage.title)}</strong>
                <p class="activity-meta">${adminEscapeHtml(String(subpage.minutesRequired))} minutes required${subpage.pptSourceName ? ` | Source ${adminEscapeHtml(subpage.pptSourceName)}` : ""}</p>
                <div class="activity-actions">
                  <button class="small-button" type="button" data-subpage-action="edit" data-topic-id="${topic.id}" data-subpage-id="${subpage.id}">Edit</button>
                  <button class="small-button" type="button" data-subpage-action="up" data-topic-id="${topic.id}" data-subpage-id="${subpage.id}" ${index === 0 ? "disabled" : ""}>Move Up</button>
                  <button class="small-button" type="button" data-subpage-action="down" data-topic-id="${topic.id}" data-subpage-id="${subpage.id}" ${index === topic.subpages.length - 1 ? "disabled" : ""}>Move Down</button>
                  <button class="small-button" type="button" data-subpage-action="delete" data-topic-id="${topic.id}" data-subpage-id="${subpage.id}">Delete</button>
                </div>
              </div>
            `).join("") : `<div class="empty-state">No sub-pages added for this topic yet.</div>`}
          </div>
          <div>
            <p class="card-label">Topic Quiz</p>
            ${(topic.quiz || []).length ? topic.quiz.map((question, index) => `
              <div class="builder-inline-card">
                <strong>${index + 1}. ${adminEscapeHtml(question.question)}</strong>
                <p class="activity-meta">${adminEscapeHtml(question.options.join(", "))}</p>
                <div class="activity-actions">
                  <button class="small-button" type="button" data-topic-quiz-action="edit" data-topic-id="${topic.id}" data-quiz-id="${question.id}">Edit</button>
                  <button class="small-button" type="button" data-topic-quiz-action="up" data-topic-id="${topic.id}" data-quiz-id="${question.id}" ${index === 0 ? "disabled" : ""}>Move Up</button>
                  <button class="small-button" type="button" data-topic-quiz-action="down" data-topic-id="${topic.id}" data-quiz-id="${question.id}" ${index === topic.quiz.length - 1 ? "disabled" : ""}>Move Down</button>
                  <button class="small-button" type="button" data-topic-quiz-action="delete" data-topic-id="${topic.id}" data-quiz-id="${question.id}">Delete</button>
                </div>
              </div>
            `).join("") : `<div class="empty-state">No topic quiz questions added yet.</div>`}
          </div>
        </div>
      </article>
    `).join("");

    topicsEditor.querySelectorAll("[data-subpage-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const topic = getTopicById(button.dataset.topicId);
        if (!topic) return;
        const index = topic.subpages.findIndex((subpage) => subpage.id === button.dataset.subpageId);
        if (index < 0) return;
        const action = button.dataset.subpageAction;
        if (action === "edit") {
          const subpage = topic.subpages[index];
          document.querySelector("#builderSubpageTopic").value = topic.id;
          document.querySelector("#builderSubpageTitle").value = subpage.title;
          document.querySelector("#builderSubpageMinutes").value = subpage.minutesRequired;
          document.querySelector("#builderSubpageContent").value = subpage.content;
          document.querySelector("#builderSubpageVideoUrl").value = subpage.videoUrl || "";
          pendingImageDataUrl = subpage.imageUrl || "";
          pendingVideoDataUrl = subpage.videoUrl && subpage.videoUrl.startsWith("data:") ? subpage.videoUrl : "";
          editingSubpageId = subpage.id;
          subpageForm.querySelector('button[type="submit"]').textContent = "Save Sub-Page";
          setStep(3);
          renderPreview();
          return;
        }
        if (action === "delete") {
          topic.subpages.splice(index, 1);
        }
        if (action === "up" && index > 0) {
          [topic.subpages[index - 1], topic.subpages[index]] = [topic.subpages[index], topic.subpages[index - 1]];
        }
        if (action === "down" && index < topic.subpages.length - 1) {
          [topic.subpages[index + 1], topic.subpages[index]] = [topic.subpages[index], topic.subpages[index + 1]];
        }
        saveDraft();
        renderAll();
      });
    });

    topicsEditor.querySelectorAll("[data-topic-quiz-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const topic = getTopicById(button.dataset.topicId);
        if (!topic) return;
        topic.quiz = topic.quiz || [];
        const index = topic.quiz.findIndex((question) => question.id === button.dataset.quizId);
        if (index < 0) return;
        const action = button.dataset.topicQuizAction;
        if (action === "edit") {
          const question = topic.quiz[index];
          document.querySelector("#builderTopicQuizTopic").value = topic.id;
          document.querySelector("#builderTopicQuizQuestion").value = question.question;
          document.querySelector("#builderTopicQuizOptions").value = question.options.join(", ");
          document.querySelector("#builderTopicQuizCorrect").value = question.correctAnswer;
          editingTopicQuizId = question.id;
          topicQuizForm.querySelector('button[type="submit"]').textContent = "Save Topic Quiz Question";
          setStep(3);
          return;
        }
        if (action === "delete") {
          topic.quiz.splice(index, 1);
        }
        if (action === "up" && index > 0) {
          [topic.quiz[index - 1], topic.quiz[index]] = [topic.quiz[index], topic.quiz[index - 1]];
        }
        if (action === "down" && index < topic.quiz.length - 1) {
          [topic.quiz[index + 1], topic.quiz[index]] = [topic.quiz[index], topic.quiz[index + 1]];
        }
        saveDraft();
        renderAll();
      });
    });
  }

  function renderSubpagesList() {
    const rows = draftCourse.topics.flatMap((topic) =>
      (topic.subpages || []).map((subpage, index) => ({ topic, subpage, index }))
    );
    if (!rows.length) {
      subpagesList.innerHTML = `<div class="empty-state">No sub-pages added yet.</div>`;
      return;
    }

    subpagesList.innerHTML = rows.map(({ topic, subpage, index }) => `
      <article class="activity-item compact-subpage-row">
        <div class="compact-subpage-main">
          <strong>${adminEscapeHtml(subpage.title)}</strong>
          <span class="compact-subpage-meta">${adminEscapeHtml(topic.title)} | ${adminEscapeHtml(String(subpage.minutesRequired))} minutes | ${index + 1} in topic</span>
        </div>
        <div class="compact-subpage-meta">${subpage.imageUrl ? "Image" : "No image"} | ${(subpage.videoUrl ? "Video" : "No video")}</div>
        <div class="activity-actions">
          <button class="small-button" type="button" data-subpage-row-action="edit" data-topic-id="${topic.id}" data-subpage-id="${subpage.id}">Edit</button>
          <button class="small-button" type="button" data-subpage-row-action="delete" data-topic-id="${topic.id}" data-subpage-id="${subpage.id}">Delete</button>
        </div>
      </article>
    `).join("");

    subpagesList.querySelectorAll("[data-subpage-row-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const topic = getTopicById(button.dataset.topicId);
        if (!topic) return;
        const subpage = (topic.subpages || []).find((item) => item.id === button.dataset.subpageId);
        if (!subpage) return;
        if (button.dataset.subpageRowAction === "edit") {
          document.querySelector("#builderSubpageTopic").value = topic.id;
          document.querySelector("#builderSubpageTitle").value = subpage.title;
          document.querySelector("#builderSubpageMinutes").value = subpage.minutesRequired;
          document.querySelector("#builderSubpageContent").value = subpage.content;
          document.querySelector("#builderSubpageVideoUrl").value = subpage.videoUrl || "";
          pendingImageDataUrl = subpage.imageUrl || "";
          pendingVideoDataUrl = subpage.videoUrl && subpage.videoUrl.startsWith("data:") ? subpage.videoUrl : "";
          editingSubpageId = subpage.id;
          subpageForm.querySelector('button[type="submit"]').textContent = "Save Sub-Page";
          subpageFeedback.textContent = `Editing sub-page: ${subpage.title}`;
          renderPreview();
          subpageForm.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        topic.subpages = (topic.subpages || []).filter((item) => item.id !== subpage.id);
        saveDraft();
        renderAll();
      });
    });
  }

  function renderFinalQuizList() {
    if (!draftCourse.finalExam.length) {
      finalQuizList.innerHTML = `<div class="empty-state">No final quiz questions added yet.</div>`;
      return;
    }
    finalQuizList.innerHTML = draftCourse.finalExam.map((question, index) => `
      <article class="activity-item">
        <h5>${index + 1}. ${adminEscapeHtml(question.question)}</h5>
        <p class="activity-meta">${adminEscapeHtml(question.options.join(", "))}</p>
        <div class="activity-actions">
          <button class="small-button" type="button" data-final-action="edit" data-final-id="${question.id}">Edit</button>
          <button class="small-button" type="button" data-final-action="up" data-final-id="${question.id}" ${index === 0 ? "disabled" : ""}>Move Up</button>
          <button class="small-button" type="button" data-final-action="down" data-final-id="${question.id}" ${index === draftCourse.finalExam.length - 1 ? "disabled" : ""}>Move Down</button>
          <button class="small-button" type="button" data-final-action="delete" data-final-id="${question.id}">Delete</button>
        </div>
      </article>
    `).join("");

    finalQuizList.querySelectorAll("[data-final-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = draftCourse.finalExam.findIndex((question) => question.id === button.dataset.finalId);
        if (index < 0) return;
        const action = button.dataset.finalAction;
        if (action === "edit") {
          const question = draftCourse.finalExam[index];
          document.querySelector("#builderFinalQuizQuestion").value = question.question;
          document.querySelector("#builderFinalQuizOptions").value = question.options.join(", ");
          document.querySelector("#builderFinalQuizCorrect").value = question.correctAnswer;
          editingFinalQuizId = question.id;
          finalQuizForm.querySelector('button[type="submit"]').textContent = "Save Final Quiz Question";
          setStep(4);
          return;
        }
        if (action === "delete") {
          draftCourse.finalExam.splice(index, 1);
        }
        if (action === "up" && index > 0) {
          [draftCourse.finalExam[index - 1], draftCourse.finalExam[index]] = [draftCourse.finalExam[index], draftCourse.finalExam[index - 1]];
        }
        if (action === "down" && index < draftCourse.finalExam.length - 1) {
          [draftCourse.finalExam[index + 1], draftCourse.finalExam[index]] = [draftCourse.finalExam[index], draftCourse.finalExam[index + 1]];
        }
        saveDraft();
        renderAll();
      });
    });
  }

  function renderSummary() {
    const lessonMinutes = totalDraftMinutes();
    summary.innerHTML = `
      <article class="activity-item">
        <h5>${adminEscapeHtml(draftCourse.title || "Untitled course")}</h5>
        <p class="activity-meta">${adminEscapeHtml(draftCourse.description || "No description added yet.")}</p>
        <p class="activity-meta">Planned length: ${adminEscapeHtml(String(draftCourse.durationMinutes || 0))} minutes | Current sub-page minutes: ${adminEscapeHtml(String(lessonMinutes))} | Cost: ${adminEscapeHtml(draftCourse.price || "")}</p>
        <p class="activity-meta">Topics: ${adminEscapeHtml(String(draftCourse.topics.length))} | Sub-pages: ${adminEscapeHtml(String(draftCourse.topics.reduce((sum, topic) => sum + (topic.subpages || []).length, 0)))} | Topic quiz questions: ${adminEscapeHtml(String(draftCourse.topics.reduce((sum, topic) => sum + (topic.quiz || []).length, 0)))} | Final quiz questions: ${adminEscapeHtml(String(draftCourse.finalExam.length))}</p>
      </article>
    `;
  }

  function renderAll() {
    draftCourse = getAdminCourseDraft();
    fillDetailsForm();
    updateTopicSelects();
    renderTopicsList();
    renderSubpagesList();
    renderTopicsEditor();
    renderFinalQuizList();
    renderSummary();
    renderPreview();
    setStep(currentStep);
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Unable to read file."));
      reader.readAsDataURL(file);
    });
  }

  stepButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setStep(Number(button.dataset.stepTarget));
    });
  });

  ["#builderSubpageTitle", "#builderSubpageContent", "#builderSubpageVideoUrl"].forEach((selector) => {
    document.querySelector(selector).addEventListener("input", renderPreview);
  });

  document.querySelector("#builderSubpageImage").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    pendingImageDataUrl = file ? await readFileAsDataUrl(file) : "";
    renderPreview();
  });

  document.querySelector("#builderSubpageVideo").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    pendingVideoDataUrl = file ? await readFileAsDataUrl(file) : "";
    if (pendingVideoDataUrl) document.querySelector("#builderSubpageVideoUrl").value = "";
    renderPreview();
  });

  detailsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    draftCourse.title = document.querySelector("#builderCourseTitle").value.trim();
    draftCourse.description = document.querySelector("#builderCourseDescription").value.trim();
    draftCourse.durationMinutes = Number(document.querySelector("#builderCourseDuration").value);
    draftCourse.price = document.querySelector("#builderCoursePrice").value.trim();
    draftCourse.passingScore = Number(document.querySelector("#builderCoursePassingScore").value);
    saveDraft();
    detailsFeedback.textContent = "Step 1 saved.";
    renderAll();
  });

  topicForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const topicTitle = document.querySelector("#builderTopicTitle").value.trim();
    const topicSummary = document.querySelector("#builderTopicSummary").value.trim();
    if (editingTopicId) {
      const topic = getTopicById(editingTopicId);
      if (topic) {
        topic.title = topicTitle;
        topic.summary = topicSummary;
      }
      topicFeedback.textContent = "Topic updated.";
    } else {
      draftCourse.topics.push({
        id: adminCreateId("topic"),
        title: topicTitle,
        summary: topicSummary,
        subpages: [],
        quiz: []
      });
      topicFeedback.textContent = "Topic added.";
    }
    saveDraft();
    resetTopicForm();
    renderAll();
  });

  subpageForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const topic = getTopicById(document.querySelector("#builderSubpageTopic").value);
    if (!topic) {
      subpageFeedback.textContent = "Add a topic first so the sub-page has a place to go.";
      return;
    }
    const minutesRequired = Number(document.querySelector("#builderSubpageMinutes").value);
    const currentMinutes = totalDraftMinutes() - (editingSubpageId ? Number((topic.subpages.find((subpage) => subpage.id === editingSubpageId) || {}).minutesRequired || 0) : 0);
    if (draftCourse.durationMinutes && currentMinutes + minutesRequired > draftCourse.durationMinutes) {
      subpageFeedback.textContent = "This sub-page would put the course over the total course length from Step 1.";
      return;
    }
    const subpageData = {
      id: editingSubpageId || adminCreateId("subpage"),
      title: document.querySelector("#builderSubpageTitle").value.trim(),
      minutesRequired,
      content: document.querySelector("#builderSubpageContent").value.trim(),
      imageUrl: pendingImageDataUrl,
      videoUrl: document.querySelector("#builderSubpageVideoUrl").value.trim() || pendingVideoDataUrl,
      pptSourceName: ""
    };
    if (editingSubpageId) {
      const existingIndex = topic.subpages.findIndex((subpage) => subpage.id === editingSubpageId);
      if (existingIndex >= 0) topic.subpages[existingIndex] = subpageData;
      subpageFeedback.textContent = "Sub-page updated.";
    } else {
      topic.subpages.push(subpageData);
      subpageFeedback.textContent = "Sub-page added.";
    }
    saveDraft();
    resetSubpageForm();
    renderAll();
  });

  topicQuizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const topic = getTopicById(document.querySelector("#builderTopicQuizTopic").value);
    if (!topic) {
      topicQuizFeedback.textContent = "Add a topic first before creating a topic quiz.";
      return;
    }
    const options = document.querySelector("#builderTopicQuizOptions").value.split(",").map((option) => option.trim()).filter(Boolean);
    if (options.length < 2) {
      topicQuizFeedback.textContent = "Add at least two answer options for the topic quiz question.";
      return;
    }
    const question = {
      id: editingTopicQuizId || adminCreateId("topic-quiz"),
      question: document.querySelector("#builderTopicQuizQuestion").value.trim(),
      options,
      correctAnswer: document.querySelector("#builderTopicQuizCorrect").value.trim()
    };
    topic.quiz = topic.quiz || [];
    if (editingTopicQuizId) {
      const existingIndex = topic.quiz.findIndex((item) => item.id === editingTopicQuizId);
      if (existingIndex >= 0) topic.quiz[existingIndex] = question;
      topicQuizFeedback.textContent = "Topic quiz question updated.";
    } else {
      topic.quiz.push(question);
      topicQuizFeedback.textContent = "Topic quiz question added.";
    }
    saveDraft();
    resetTopicQuizForm();
    renderAll();
  });

  finalQuizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const options = document.querySelector("#builderFinalQuizOptions").value.split(",").map((option) => option.trim()).filter(Boolean);
    if (options.length < 2) {
      finalQuizFeedback.textContent = "Add at least two answer options for the final quiz question.";
      return;
    }
    const question = {
      id: editingFinalQuizId || adminCreateId("draft-final"),
      question: document.querySelector("#builderFinalQuizQuestion").value.trim(),
      options,
      correctAnswer: document.querySelector("#builderFinalQuizCorrect").value.trim()
    };
    if (editingFinalQuizId) {
      const existingIndex = draftCourse.finalExam.findIndex((item) => item.id === editingFinalQuizId);
      if (existingIndex >= 0) draftCourse.finalExam[existingIndex] = question;
      finalQuizFeedback.textContent = "Final quiz question updated.";
    } else {
      draftCourse.finalExam.push(question);
      finalQuizFeedback.textContent = "Final quiz question added.";
    }
    saveDraft();
    resetFinalQuizForm();
    renderAll();
  });

  document.querySelector("#goToStep2Button").addEventListener("click", () => {
    detailsForm.requestSubmit();
    setStep(2);
  });

  document.querySelector("#goToStep3Button").addEventListener("click", () => {
    setStep(3);
  });

  document.querySelector("#goToStep4Button").addEventListener("click", () => {
    setStep(4);
  });

  document.querySelector("#publishCourseButton").addEventListener("click", () => {
    if (!draftCourse.title || !draftCourse.price || !draftCourse.description) {
      finalQuizFeedback.textContent = "Complete Step 1 before publishing the course.";
      setStep(1);
      return;
    }
    if (!draftCourse.topics.length) {
      finalQuizFeedback.textContent = "Add at least one topic before publishing.";
      setStep(2);
      return;
    }
    if (!draftCourse.topics.some((topic) => (topic.subpages || []).length)) {
      finalQuizFeedback.textContent = "Add at least one sub-page before publishing.";
      setStep(3);
      return;
    }
    if (!draftCourse.finalExam.length) {
      finalQuizFeedback.textContent = "Add at least one final quiz question before publishing.";
      return;
    }
    saveAdminCourse({
      id: draftCourse.id || adminCreateId("course"),
      title: draftCourse.title,
      description: draftCourse.description,
      price: draftCourse.price,
      passingScore: draftCourse.passingScore,
      topics: cloneCourseData(draftCourse.topics),
      finalExam: cloneCourseData(draftCourse.finalExam),
      contract: cloneCourseData(draftCourse.contract || adminDefaultContract)
    });
    finalQuizFeedback.textContent = "Course published to the live member course area.";
  });

  renderAll();
});
