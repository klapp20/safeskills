document.addEventListener("DOMContentLoaded", () => {
  ensureAdminPageAccess("#adminCourseDetailsContent");
  if (sessionStorage.getItem("wow-admin-auth") !== "1") return;

  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");
  let course = getAdminCourseById(courseId);
  let editingTopicId = null;
  let editingSubpageId = null;

  const summary = document.querySelector("#courseDetailsSummary");
  const topicsList = document.querySelector("#courseTopicsList");
  const topicForm = document.querySelector("#courseTopicForm");
  const topicFeedback = document.querySelector("#courseTopicFeedback");
  const subpageForm = document.querySelector("#courseSubpageForm");
  const subpageFeedback = document.querySelector("#courseSubpageFeedback");
  const subpageTopicSelect = document.querySelector("#courseSubpageTopic");
  const contractForm = document.querySelector("#courseContractForm");
  const contractFeedback = document.querySelector("#courseContractFeedback");

  if (!course) {
    summary.textContent = "Course not found.";
    topicsList.innerHTML = `<div class="empty-state">Course not found.</div>`;
    return;
  }

  function saveCourse() {
    saveAdminCourse(course);
    const courses = getAdminCourses().map((item) => item.id === course.id ? course : item);
    saveAdminCourses(courses);
    if (getActiveAdminCourseId() === course.id) {
      localStorage.setItem("wow-course", JSON.stringify(course));
    }
  }

  function refreshCourse() {
    course = getAdminCourseById(courseId);
  }

  function renderTopicSelect() {
    subpageTopicSelect.innerHTML = (course.topics || []).map((topic) => `<option value="${topic.id}">${adminEscapeHtml(topic.title)}</option>`).join("");
  }

  function fillContractForm() {
    const contract = course.contract || normalizeCourseContract();
    document.querySelector("#courseContractOnlineLabel").value = contract.onlineLabel || "";
    document.querySelector("#courseContractOnlineCopy").value = contract.onlineCopy || "";
    document.querySelector("#courseContractParagraph1").value = contract.paragraph1 || "";
    document.querySelector("#courseContractParagraph2").value = contract.paragraph2 || "";
    document.querySelector("#courseContractParagraph3").value = contract.paragraph3 || "";
    document.querySelector("#courseContractParagraph4").value = contract.paragraph4 || "";
    document.querySelector("#courseContractParagraph5").value = contract.paragraph5 || "";
    document.querySelector("#courseContractAgreementCopy").value = contract.agreementCopy || "";
  }

  function resetTopicForm() {
    editingTopicId = null;
    topicForm.reset();
  }

  function resetSubpageForm() {
    editingSubpageId = null;
    subpageForm.reset();
    document.querySelector("#courseSubpageMinutes").value = 5;
    renderTopicSelect();
  }

  function renderPage() {
    refreshCourse();
    summary.textContent = `${course.title} | ${(course.topics || []).length} topic(s) | ${course.pages.length} sub-page(s)`;
    renderTopicSelect();
    fillContractForm();
    topicsList.innerHTML = (course.topics || []).length ? course.topics.map((topic, topicIndex) => `
      <article class="activity-item">
        <div class="section-title-row">
          <h5>${topicIndex + 1}. ${adminEscapeHtml(topic.title)}</h5>
          <div class="activity-actions">
            <button class="small-button" type="button" data-topic-edit="${topic.id}">Edit Topic</button>
            <button class="small-button" type="button" data-topic-move="up" data-topic-id="${topic.id}" ${topicIndex === 0 ? "disabled" : ""}>Move Up</button>
            <button class="small-button" type="button" data-topic-move="down" data-topic-id="${topic.id}" ${topicIndex === course.topics.length - 1 ? "disabled" : ""}>Move Down</button>
            <button class="small-button" type="button" data-topic-delete="${topic.id}">Remove Topic</button>
          </div>
        </div>
        <p class="activity-meta">${adminEscapeHtml(topic.summary || "")}</p>
        ${(topic.subpages || []).length ? topic.subpages.map((subpage, subpageIndex) => `
          <div class="builder-inline-card">
            <div class="section-title-row">
              <strong>${topicIndex + 1}.${subpageIndex + 1} ${adminEscapeHtml(subpage.title)}</strong>
              <div class="activity-actions">
                <button class="small-button" type="button" data-subpage-edit="${subpage.id}" data-topic-id="${topic.id}">Edit</button>
                <button class="small-button" type="button" data-subpage-move="up" data-subpage-id="${subpage.id}" data-topic-id="${topic.id}" ${subpageIndex === 0 ? "disabled" : ""}>Move Up</button>
                <button class="small-button" type="button" data-subpage-move="down" data-subpage-id="${subpage.id}" data-topic-id="${topic.id}" ${subpageIndex === topic.subpages.length - 1 ? "disabled" : ""}>Move Down</button>
                <button class="small-button" type="button" data-subpage-delete="${subpage.id}" data-topic-id="${topic.id}">Remove</button>
              </div>
            </div>
            <p class="activity-meta">${adminEscapeHtml(String(subpage.minutesRequired))} minutes required</p>
          </div>
        `).join("") : `<div class="empty-state">No sub-pages under this topic yet.</div>`}
      </article>
    `).join("") : `<div class="empty-state">No topics added yet.</div>`;

    topicsList.querySelectorAll("[data-topic-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        const topic = course.topics.find((item) => item.id === button.dataset.topicEdit);
        if (!topic) return;
        editingTopicId = topic.id;
        document.querySelector("#courseTopicTitle").value = topic.title;
        document.querySelector("#courseTopicSummary").value = topic.summary || "";
      });
    });

    topicsList.querySelectorAll("[data-topic-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        course.topics = course.topics.filter((item) => item.id !== button.dataset.topicDelete);
        saveCourse();
        renderPage();
      });
    });

    topicsList.querySelectorAll("[data-topic-move]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = course.topics.findIndex((item) => item.id === button.dataset.topicId);
        if (index < 0) return;
        if (button.dataset.topicMove === "up" && index > 0) {
          [course.topics[index - 1], course.topics[index]] = [course.topics[index], course.topics[index - 1]];
        }
        if (button.dataset.topicMove === "down" && index < course.topics.length - 1) {
          [course.topics[index + 1], course.topics[index]] = [course.topics[index], course.topics[index + 1]];
        }
        saveCourse();
        renderPage();
      });
    });

    topicsList.querySelectorAll("[data-subpage-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        const topic = course.topics.find((item) => item.id === button.dataset.topicId);
        const subpage = topic?.subpages?.find((item) => item.id === button.dataset.subpageEdit);
        if (!topic || !subpage) return;
        editingSubpageId = subpage.id;
        document.querySelector("#courseSubpageTopic").value = topic.id;
        document.querySelector("#courseSubpageTitle").value = subpage.title;
        document.querySelector("#courseSubpageMinutes").value = subpage.minutesRequired;
        document.querySelector("#courseSubpageContent").value = subpage.content || "";
      });
    });

    topicsList.querySelectorAll("[data-subpage-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        const topic = course.topics.find((item) => item.id === button.dataset.topicId);
        if (!topic) return;
        topic.subpages = (topic.subpages || []).filter((item) => item.id !== button.dataset.subpageDelete);
        saveCourse();
        renderPage();
      });
    });

    topicsList.querySelectorAll("[data-subpage-move]").forEach((button) => {
      button.addEventListener("click", () => {
        const topic = course.topics.find((item) => item.id === button.dataset.topicId);
        if (!topic) return;
        const subpages = topic.subpages || [];
        const index = subpages.findIndex((item) => item.id === button.dataset.subpageId);
        if (index < 0) return;
        if (button.dataset.subpageMove === "up" && index > 0) {
          [subpages[index - 1], subpages[index]] = [subpages[index], subpages[index - 1]];
        }
        if (button.dataset.subpageMove === "down" && index < subpages.length - 1) {
          [subpages[index + 1], subpages[index]] = [subpages[index], subpages[index + 1]];
        }
        topic.subpages = subpages;
        saveCourse();
        renderPage();
      });
    });
  }

  topicForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.querySelector("#courseTopicTitle").value.trim();
    const topicSummary = document.querySelector("#courseTopicSummary").value.trim();
    if (editingTopicId) {
      const topic = course.topics.find((item) => item.id === editingTopicId);
      if (topic) {
        topic.title = title;
        topic.summary = topicSummary;
      }
      topicFeedback.textContent = "Topic updated.";
    } else {
      course.topics.push({ id: adminCreateId("topic"), title, summary: topicSummary, subpages: [], quiz: [] });
      topicFeedback.textContent = "Topic added.";
    }
    saveCourse();
    resetTopicForm();
    renderPage();
  });

  subpageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const topic = course.topics.find((item) => item.id === subpageTopicSelect.value);
    if (!topic) {
      subpageFeedback.textContent = "Choose a topic first.";
      return;
    }
    const subpage = {
      id: editingSubpageId || adminCreateId("subpage"),
      title: document.querySelector("#courseSubpageTitle").value.trim(),
      minutesRequired: Number(document.querySelector("#courseSubpageMinutes").value),
      content: document.querySelector("#courseSubpageContent").value.trim(),
      imageUrl: "",
      videoUrl: "",
      pptSourceName: ""
    };
    if (editingSubpageId) {
      course.topics.forEach((item) => {
        item.subpages = (item.subpages || []).filter((page) => page.id !== editingSubpageId);
      });
      topic.subpages.push(subpage);
      subpageFeedback.textContent = "Sub-page updated.";
    } else {
      topic.subpages.push(subpage);
      subpageFeedback.textContent = "Sub-page added.";
    }
    saveCourse();
    resetSubpageForm();
    renderPage();
  });

  document.querySelector("#courseTopicReset").addEventListener("click", resetTopicForm);
  document.querySelector("#courseSubpageReset").addEventListener("click", resetSubpageForm);

  contractForm.addEventListener("submit", (event) => {
    event.preventDefault();
    course.contract = normalizeCourseContract({
      onlineLabel: document.querySelector("#courseContractOnlineLabel").value.trim(),
      onlineCopy: document.querySelector("#courseContractOnlineCopy").value.trim(),
      paragraph1: document.querySelector("#courseContractParagraph1").value.trim(),
      paragraph2: document.querySelector("#courseContractParagraph2").value.trim(),
      paragraph3: document.querySelector("#courseContractParagraph3").value.trim(),
      paragraph4: document.querySelector("#courseContractParagraph4").value.trim(),
      paragraph5: document.querySelector("#courseContractParagraph5").value.trim(),
      agreementCopy: document.querySelector("#courseContractAgreementCopy").value.trim()
    });
    saveCourse();
    contractFeedback.textContent = "Course contract saved.";
    renderPage();
  });

  renderPage();
});
