const courseStorageKeys = {
  course: "wow-course",
  enrollments: "wow-course-enrollments",
  approvedRegistration: "safe-skills-registration-approved",
  studentSession: "safe-skills-student-auth"
};

const defaultCoursePageCourse = {
  title: "Safe Skills Driving School Member Course",
  description: "Build your 2-hour member course here. Members must complete each topic in order, meet each sub-page timer, pass topic quizzes, and finish the final exam to earn a certificate.",
  price: "$49.00",
  passingScore: 80,
  topics: [
    {
      id: "topic-1",
      title: "Topic 1 - Welcome",
      summary: "A sample topic showing how the new topic and sub-page flow works.",
      subpages: [
        {
          id: "lesson-1",
          title: "Slide 1 - Welcome",
          minutesRequired: 5,
          content: "<p>Use the admin course builder to replace this sample sub-page with your real training material.</p>",
          imageUrl: "",
          videoUrl: ""
        }
      ],
      quiz: [
        {
          id: "topic-quiz-1",
          question: "What must be completed before moving to the next course topic?",
          options: [
            "All sub-pages and the topic quiz",
            "Only one sub-page",
            "Nothing, topics can be skipped"
          ],
          correctAnswer: "All sub-pages and the topic quiz"
        }
      ]
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

const bundledPublishedCourse = window.safeSkillsPublishedCourse || defaultCoursePageCourse;

const coursePageElements = {
  courseLogoutButton: document.querySelector("#courseLogoutButton"),
  courseNavSelect: document.querySelector("#courseNavSelect"),
  courseNavMobileList: document.querySelector("#courseNavMobileList"),
  courseNav: document.querySelector("#courseNav"),
  courseOverallProgress: document.querySelector("#courseOverallProgress"),
  courseLessonState: document.querySelector("#courseLessonState"),
  courseCertificate: document.querySelector("#courseCertificate")
};

const coursePageState = {
  course: normalizeCoursePageCourse(bundledPublishedCourse),
  enrollments: loadCoursePageCollection(courseStorageKeys.enrollments, []),
  activeEnrollmentId: null,
  currentTopicIndex: 0,
  currentSubpageIndex: 0,
  currentTimerId: null
};

function loadCoursePageCollection(key, fallback) {
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

function saveCoursePageCollection(key, collection) {
  localStorage.setItem(key, JSON.stringify(collection));
}

function coursePageCreateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function coursePageFormatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

function coursePageEscapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function normalizeCoursePageCourse(course) {
  if (!Array.isArray(course.topics) || !course.topics.length) {
    const pages = Array.isArray(course.pages) ? course.pages : [];
    return {
      title: course.title || defaultCoursePageCourse.title,
      description: course.description || defaultCoursePageCourse.description,
      price: course.price || defaultCoursePageCourse.price,
      passingScore: Number(course.passingScore || defaultCoursePageCourse.passingScore),
      topics: [
        {
          id: "topic-imported",
          title: "Imported Topic",
          summary: "Imported from the earlier course structure.",
          subpages: pages.map((page) => ({
            id: page.id,
            title: page.title,
            minutesRequired: Number(page.minutesRequired || 0),
            content: page.content || "",
            imageUrl: "",
            videoUrl: ""
          })),
          quiz: []
        }
      ],
      finalExam: course.finalExam || []
    };
  }
  return {
    title: course.title || defaultCoursePageCourse.title,
    description: course.description || defaultCoursePageCourse.description,
    price: course.price || defaultCoursePageCourse.price,
    passingScore: Number(course.passingScore || defaultCoursePageCourse.passingScore),
    topics: course.topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      summary: topic.summary || "",
      subpages: (topic.subpages || []).map((subpage) => ({
        id: subpage.id,
        title: subpage.title,
        minutesRequired: Number(subpage.minutesRequired || 0),
        content: subpage.content || "",
        imageUrl: subpage.imageUrl || "",
        videoUrl: subpage.videoUrl || ""
      })),
      quiz: (topic.quiz || []).map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options || [],
        correctAnswer: question.correctAnswer
      }))
    })),
    finalExam: (course.finalExam || []).map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options || [],
      correctAnswer: question.correctAnswer
    }))
  };
}

function getCoursePageActiveEnrollment() {
  return coursePageState.enrollments.find((item) => item.id === coursePageState.activeEnrollmentId) || null;
}

function getCurrentTopic() {
  return coursePageState.course.topics[coursePageState.currentTopicIndex] || null;
}

function getCurrentSubpage() {
  const topic = getCurrentTopic();
  return topic?.subpages?.[coursePageState.currentSubpageIndex] || null;
}

async function getApprovedCourseRegistration() {
  try {
    const approved = JSON.parse(localStorage.getItem(courseStorageKeys.approvedRegistration) || "null");
    const storedPasswords = JSON.parse(localStorage.getItem("safe-skills-student-passwords") || "{}");

    if (approved?.email && storedPasswords[approved.email.toLowerCase()]) {
      approved.password = storedPasswords[approved.email.toLowerCase()];
    }

    if (approved) {
      return approved;
    }

    const session = JSON.parse(sessionStorage.getItem(courseStorageKeys.studentSession) || "null");
    if (session?.email && window.safeSkillsBackendClient?.isReady()) {
      const remoteStudent = await window.safeSkillsBackendClient.fetchStudentByEmail(session.email);
      if (remoteStudent) {
        const normalized = {
          email: remoteStudent.email,
          fullName: remoteStudent.full_name || session.fullName || "",
          phone: remoteStudent.phone || "",
          address1: remoteStudent.address1 || "",
          address2: remoteStudent.address2 || "",
          city: remoteStudent.city || "",
          state: remoteStudent.state || "",
          zip: remoteStudent.zip || "",
          birthDate: remoteStudent.birth_date || "",
          driverLicenseNumber: remoteStudent.driver_license_number || "",
          contractNumber: remoteStudent.contract_number || "",
          permitTestDate: remoteStudent.permit_test_date || "",
          studentSchool: remoteStudent.student_school || "",
          courseTitle: remoteStudent.course_title || "",
          amount: remoteStudent.amount || "",
          contractDate: remoteStudent.contract_date || "",
          paymentNumber: remoteStudent.payment_number || "",
          contractSignedName: remoteStudent.contract_signed_name || "",
          contractSignedAt: remoteStudent.contract_signed_at || ""
        };
        localStorage.setItem(courseStorageKeys.approvedRegistration, JSON.stringify(normalized));
        return normalized;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

function getCourseEnrollmentStatus(email) {
  try {
    const enrollments = JSON.parse(localStorage.getItem(courseStorageKeys.enrollments) || "[]");
    const enrollment = enrollments.find((item) => item.memberEmail?.toLowerCase() === email?.toLowerCase());
    return enrollment?.statusLabel || "";
  } catch (error) {
    return "";
  }
}

function buildCourseEnrollmentRecord(memberName, memberEmail) {
  return {
    id: coursePageCreateId("enrollment"),
    memberName,
    memberEmail,
    receiptNumber: `WOW-${Date.now()}`,
    amountPaid: coursePageState.course.price,
    purchasedAt: coursePageFormatDate(),
    statusLabel: "Enrolled",
    progress: {
      completedPageIds: [],
      pageTimers: {},
      topicQuizAnswers: {},
      completedTopicQuizIds: [],
      finalAnswers: {},
      finalScore: null
    },
    certificateIssuedAt: null
  };
}

function renderCoursePageHeader() {
  return;
}

function renderCoursePageNav() {
  const enrollment = getCoursePageActiveEnrollment();
  if (!enrollment) {
    coursePageElements.courseNav.innerHTML = `<div class="empty-state">Enroll to unlock the lesson list.</div>`;
    if (coursePageElements.courseNavMobileList) {
      coursePageElements.courseNavMobileList.innerHTML = "";
    }
    if (coursePageElements.courseNavSelect) {
      coursePageElements.courseNavSelect.innerHTML = `<option value="">Course navigation locked</option>`;
      coursePageElements.courseNavSelect.disabled = true;
    }
    return;
  }
  const selectOptions = [];
  const topicUnlockStates = coursePageState.course.topics.map((topic, topicIndex) => topicIndex === 0 || coursePageState.course.topics[topicIndex - 1].subpages.every((subpage) => enrollment.progress.completedPageIds.includes(subpage.id)) && (coursePageState.course.topics[topicIndex - 1].quiz?.length ? enrollment.progress.completedTopicQuizIds.includes(coursePageState.course.topics[topicIndex - 1].id) : true));
  coursePageElements.courseNav.innerHTML = coursePageState.course.topics.map((topic, topicIndex) => {
    const allSubpagesComplete = (topic.subpages || []).every((subpage) => enrollment.progress.completedPageIds.includes(subpage.id));
    const topicQuizComplete = !topic.quiz?.length || enrollment.progress.completedTopicQuizIds.includes(topic.id);
    const topicUnlocked = topicUnlockStates[topicIndex];
    return `
      <div class="course-topic-group">
        <div class="course-topic-label">${coursePageEscapeHtml(topic.title)} ${allSubpagesComplete && topicQuizComplete ? "- Complete" : topicUnlocked ? "- Open" : "- Locked"}</div>
        ${(topic.subpages || []).map((subpage, subpageIndex) => {
          const prevSubpage = subpageIndex > 0 ? topic.subpages[subpageIndex - 1] : null;
          const unlocked = topicUnlocked && (!prevSubpage || enrollment.progress.completedPageIds.includes(prevSubpage.id));
          const isActive = topicIndex === coursePageState.currentTopicIndex && subpageIndex === coursePageState.currentSubpageIndex;
          const status = enrollment.progress.completedPageIds.includes(subpage.id) ? "Complete" : unlocked ? "Open" : "Locked";
          selectOptions.push({
            value: `${topicIndex}:${subpageIndex}`,
            label: `${topic.title} - ${subpage.title} (${status})`,
            disabled: !unlocked,
            selected: isActive
          });
          return `<button type="button" class="course-topic-button ${isActive ? "active" : ""} ${unlocked ? "" : "locked"}" data-topic-index="${topicIndex}" data-subpage-index="${subpageIndex}" ${unlocked ? "" : "disabled"}><strong>${coursePageEscapeHtml(subpage.title)}</strong><br><span class="activity-meta">${coursePageEscapeHtml(String(subpage.minutesRequired))} min | ${status}</span></button>`;
        }).join("")}
      </div>
    `;
  }).join("");

  if (coursePageElements.courseNavSelect) {
    coursePageElements.courseNavSelect.disabled = false;
    coursePageElements.courseNavSelect.innerHTML = selectOptions.map((option) => `
      <option value="${coursePageEscapeHtml(option.value)}" ${option.disabled ? "disabled" : ""} ${option.selected ? "selected" : ""}>${coursePageEscapeHtml(option.label)}</option>
    `).join("");
  }

  if (coursePageElements.courseNavMobileList) {
    const activeTopic = coursePageState.course.topics[coursePageState.currentTopicIndex] || null;
    if (!activeTopic) {
      coursePageElements.courseNavMobileList.innerHTML = "";
    } else {
      const activeTopicUnlocked = topicUnlockStates[coursePageState.currentTopicIndex];
      coursePageElements.courseNavMobileList.innerHTML = `
        <div class="course-nav-mobile-topic">${coursePageEscapeHtml(activeTopic.title)}</div>
        <div class="course-nav-mobile-items">
          ${(activeTopic.subpages || []).map((subpage, subpageIndex) => {
            const prevSubpage = subpageIndex > 0 ? activeTopic.subpages[subpageIndex - 1] : null;
            const unlocked = activeTopicUnlocked && (!prevSubpage || enrollment.progress.completedPageIds.includes(prevSubpage.id));
            const isActive = subpageIndex === coursePageState.currentSubpageIndex;
            const status = enrollment.progress.completedPageIds.includes(subpage.id) ? "Complete" : unlocked ? "Open" : "Locked";
            return `<button type="button" class="course-mobile-subpage ${isActive ? "active" : ""} ${unlocked ? "" : "locked"}" data-mobile-topic-index="${coursePageState.currentTopicIndex}" data-mobile-subpage-index="${subpageIndex}" ${unlocked ? "" : "disabled"}>${coursePageEscapeHtml(subpage.title)}<span>${coursePageEscapeHtml(status)}</span></button>`;
          }).join("")}
        </div>
      `;
    }
  }

  coursePageElements.courseNav.querySelectorAll("[data-topic-index]").forEach((button) => {
    button.addEventListener("click", () => {
      coursePageState.currentTopicIndex = Number(button.dataset.topicIndex);
      coursePageState.currentSubpageIndex = Number(button.dataset.subpageIndex);
      startCoursePageLessonTimer();
    });
  });

  if (coursePageElements.courseNavSelect) {
    coursePageElements.courseNavSelect.onchange = handleCourseNavSelectChange;
  }

  coursePageElements.courseNavMobileList?.querySelectorAll("[data-mobile-topic-index]").forEach((button) => {
    button.addEventListener("click", () => {
      coursePageState.currentTopicIndex = Number(button.dataset.mobileTopicIndex);
      coursePageState.currentSubpageIndex = Number(button.dataset.mobileSubpageIndex);
      startCoursePageLessonTimer();
    });
  });
}

function handleCourseNavSelectChange(event) {
  const value = event.target.value;

  if (!value.includes(":")) {
    return;
  }

  const [topicIndex, subpageIndex] = value.split(":").map(Number);
  coursePageState.currentTopicIndex = topicIndex;
  coursePageState.currentSubpageIndex = subpageIndex;
  startCoursePageLessonTimer();
}

function renderCourseOverallProgress() {
  const enrollment = getCoursePageActiveEnrollment();
  if (!enrollment) {
    coursePageElements.courseOverallProgress.innerHTML = `<div class="empty-state">Course progress will appear here after enrollment.</div>`;
    return;
  }
  const totalSubpages = coursePageState.course.topics.reduce((sum, topic) => sum + (topic.subpages || []).length, 0);
  const completedSubpages = enrollment.progress.completedPageIds.length;
  const totalTopicQuizCount = coursePageState.course.topics.filter((topic) => topic.quiz?.length).length;
  const completedTopicQuizzes = enrollment.progress.completedTopicQuizIds.length;
  const totalUnits = totalSubpages + totalTopicQuizCount + 1;
  const completedUnits = completedSubpages + completedTopicQuizzes + (enrollment.certificateIssuedAt ? 1 : 0);
  const percent = totalUnits ? Math.round((completedUnits / totalUnits) * 100) : 0;
  const progressMeta = `${completedSubpages} of ${totalSubpages} sub-pages complete | ${completedTopicQuizzes} of ${totalTopicQuizCount} topic quiz check-point(s) complete`;
  coursePageElements.courseOverallProgress.innerHTML = `
    <div class="course-progress-row">
      <div>
        <p class="card-label">Course Progress</p>
        <h4>${percent}% Complete</h4>
        <p class="course-meta" data-course-progress-meta>${coursePageEscapeHtml(progressMeta)}</p>
      </div>
    </div>
    <div class="progress-meter"><div class="progress-meter-bar" style="width: ${percent}%;"></div></div>
  `;
}

function startCoursePageLessonTimer() {
  clearInterval(coursePageState.currentTimerId);
  const enrollment = getCoursePageActiveEnrollment();
  const subpage = getCurrentSubpage();
  if (!enrollment || !subpage) return;
  if (!enrollment.progress.pageTimers[subpage.id]) {
    enrollment.progress.pageTimers[subpage.id] = {
      startedAt: Date.now(),
      unlockedAt: Date.now() + Number(subpage.minutesRequired) * 60 * 1000
    };
    saveCoursePageCollection(courseStorageKeys.enrollments, coursePageState.enrollments);
  }
  const tick = () => renderCoursePageLesson();
  tick();
  coursePageState.currentTimerId = setInterval(tick, 1000);
}

function renderCoursePageQuiz(prefix, quiz, selectedAnswer = "") {
  return `<div class="quiz-panel"><p class="card-label">${prefix.startsWith("topic-quiz") ? "Topic quiz" : "Final exam question"}</p><h5>${coursePageEscapeHtml(quiz.question)}</h5><div class="quiz-options">${quiz.options.map((option) => `<label class="quiz-option"><input type="radio" name="${prefix}-answer" value="${coursePageEscapeHtml(option)}" ${selectedAnswer === option ? "checked" : ""}><span>${coursePageEscapeHtml(option)}</span></label>`).join("")}</div></div>`;
}

function renderSubpageRichContent(subpage) {
  return `
    <div class="lesson-rich-body">
      <div>${subpage.content || ""}</div>
      ${subpage.imageUrl ? `<img class="course-rich-media" src="${subpage.imageUrl}" alt="${coursePageEscapeHtml(subpage.title)} image">` : ""}
      ${subpage.videoUrl ? `<div class="course-video-wrap"><video class="course-rich-media" controls src="${subpage.videoUrl}"></video></div>` : ""}
    </div>
  `;
}

function renderCoursePageLesson() {
  const enrollment = getCoursePageActiveEnrollment();
  if (!enrollment) {
    coursePageElements.courseLessonState.innerHTML = `<div class="empty-state">Open the course to begin.</div>`;
    coursePageElements.courseCertificate.classList.add("hidden");
    renderCourseOverallProgress();
    return;
  }

  const topic = getCurrentTopic();
  const subpage = getCurrentSubpage();
  if (!topic || !subpage) {
    renderCoursePageFinalExam();
    return;
  }

  const timerInfo = enrollment.progress.pageTimers[subpage.id];
  const remainingMs = Math.max(0, (timerInfo?.unlockedAt || Date.now()) - Date.now());
  const mins = Math.floor(remainingMs / 60000);
  const secs = Math.floor((remainingMs % 60000) / 1000);
  const remainingLabel = remainingMs > 0 ? `${mins}:${String(secs).padStart(2, "0")} remaining` : "Time requirement complete";
  const isLastSubpageInTopic = coursePageState.currentSubpageIndex === topic.subpages.length - 1;
  const isLastTopic = coursePageState.currentTopicIndex === coursePageState.course.topics.length - 1;
  const hasPreviousSubpage = coursePageState.currentSubpageIndex > 0;
  const previousButtonDisabled = hasPreviousSubpage ? "" : "disabled";
  const nextAllowed = remainingMs <= 0;
  const nextButtonLabel = isLastSubpageInTopic && isLastTopic ? "Go To Final Quiz" : "Next";

  coursePageElements.courseLessonState.innerHTML = `
    <div class="course-progress-row">
      <div>
        <p class="card-label">${coursePageEscapeHtml(topic.title)}</p>
        <h4>${coursePageEscapeHtml(subpage.title)}</h4>
      </div>
      <div class="course-time-box">
        <span class="course-time-status">${remainingLabel}</span>
        <p class="course-time-meta">Time requirement: ${coursePageEscapeHtml(String(subpage.minutesRequired))} minute${Number(subpage.minutesRequired) === 1 ? "" : "s"}</p>
      </div>
    </div>
    <div class="slide-preview-frame">${renderSubpageRichContent(subpage)}</div>
    <div id="coursePageLessonFeedback"></div>
    <div class="lesson-footer">
      <div class="activity-meta">${isLastSubpageInTopic ? "Finish this timer to review this topic quiz and continue." : "Finish this timer before the next course page opens."}</div>
      <div class="activity-actions course-action-buttons">
        <button class="secondary-button compact-course-button" id="coursePagePreviousLesson" type="button" ${previousButtonDisabled}>Previous</button>
        <button class="primary-button compact-course-button" id="coursePageNextLesson" type="button" ${nextAllowed ? "" : "disabled"}>${nextButtonLabel}</button>
      </div>
    </div>
  `;

  document.querySelector("#coursePagePreviousLesson")?.addEventListener("click", () => {
    if (!hasPreviousSubpage) {
      return;
    }

    coursePageState.currentSubpageIndex -= 1;
    startCoursePageLessonTimer();
    renderCoursePageNav();
    renderCourseOverallProgress();
  });

  document.querySelector("#coursePageNextLesson")?.addEventListener("click", () => {
    enrollment.progress.completedPageIds = [...new Set([...enrollment.progress.completedPageIds, subpage.id])];
    enrollment.statusLabel = "In progress";
    saveCoursePageCollection(courseStorageKeys.enrollments, coursePageState.enrollments);
    if (!isLastSubpageInTopic) {
      coursePageState.currentSubpageIndex += 1;
      startCoursePageLessonTimer();
    } else if (topic.quiz?.length) {
      clearInterval(coursePageState.currentTimerId);
      renderTopicQuiz();
    } else if (coursePageState.currentTopicIndex < coursePageState.course.topics.length - 1) {
      coursePageState.currentTopicIndex += 1;
      coursePageState.currentSubpageIndex = 0;
      startCoursePageLessonTimer();
    } else {
      clearInterval(coursePageState.currentTimerId);
      renderCoursePageFinalExam();
    }
    renderCoursePageNav();
    renderCourseOverallProgress();
  });

  coursePageElements.courseCertificate.classList.add("hidden");
  renderCourseOverallProgress();
}

function renderTopicQuiz() {
  const enrollment = getCoursePageActiveEnrollment();
  const topic = getCurrentTopic();
  if (!enrollment || !topic) return;
  const isLastTopic = coursePageState.currentTopicIndex === coursePageState.course.topics.length - 1;
  coursePageElements.courseLessonState.innerHTML = `
    <div class="course-progress-row">
      <div>
        <p class="card-label">Topic Quiz</p>
        <h4>${coursePageEscapeHtml(topic.title)}</h4>
        <p class="course-meta">Review your understanding here. You can continue after submission or retake the quiz.</p>
      </div>
    </div>
    <div class="course-quiz-block stack-form">
      ${(topic.quiz || []).map((question, index) => renderCoursePageQuiz(`topic-quiz-${index}`, question, enrollment.progress.topicQuizAnswers?.[question.id] || "")).join("")}
      <div id="courseTopicQuizFeedback"></div>
      <div class="activity-actions"><button class="primary-button" id="courseTopicQuizSubmit" type="button">Submit Topic Quiz</button></div>
    </div>
  `;

  coursePageElements.courseLessonState.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", () => {
      const index = Number(input.name.replace("topic-quiz-", "").replace("-answer", ""));
      const question = topic.quiz[index];
      enrollment.progress.topicQuizAnswers[question.id] = input.value;
      saveCoursePageCollection(courseStorageKeys.enrollments, coursePageState.enrollments);
    });
  });

  document.querySelector("#courseTopicQuizSubmit")?.addEventListener("click", () => {
    const incorrectQuestions = (topic.quiz || []).filter((question) => enrollment.progress.topicQuizAnswers?.[question.id] !== question.correctAnswer);
    const feedback = document.querySelector("#courseTopicQuizFeedback");

    enrollment.progress.completedTopicQuizIds = [...new Set([...enrollment.progress.completedTopicQuizIds, topic.id])];
    saveCoursePageCollection(courseStorageKeys.enrollments, coursePageState.enrollments);

    if (feedback) {
      feedback.innerHTML = `
        ${incorrectQuestions.length ? `
          <div class="quiz-review-list">
            <p class="pill-alert">These questions were answered incorrectly:</p>
            <ul class="quiz-miss-list">
              ${incorrectQuestions.map((question) => `<li>${coursePageEscapeHtml(question.question)}</li>`).join("")}
            </ul>
          </div>
        ` : `<p class="course-badge">All questions were answered correctly.</p>`}
        <div class="activity-actions">
          <button class="primary-button" id="courseTopicNextButton" type="button">${isLastTopic ? "Go To Final Quiz" : "Go To Next Topic"}</button>
          <button class="secondary-button" id="courseTopicRetryButton" type="button">Take Quiz Again</button>
        </div>
      `;
    }

    document.querySelector("#courseTopicNextButton")?.addEventListener("click", () => {
      if (coursePageState.currentTopicIndex < coursePageState.course.topics.length - 1) {
        coursePageState.currentTopicIndex += 1;
        coursePageState.currentSubpageIndex = 0;
        startCoursePageLessonTimer();
      } else {
        renderCoursePageFinalExam();
      }
      renderCoursePageNav();
      renderCourseOverallProgress();
    });

    document.querySelector("#courseTopicRetryButton")?.addEventListener("click", () => {
      renderTopicQuiz();
    });
  });
}

function renderCoursePageFinalExam() {
  const enrollment = getCoursePageActiveEnrollment();
  const questions = coursePageState.course.finalExam;
  if (!questions.length) {
    coursePageElements.courseLessonState.innerHTML = `<div class="empty-state">No final exam questions have been added yet.</div>`;
    renderCourseOverallProgress();
    return;
  }
  coursePageElements.courseLessonState.innerHTML = `<div class="course-progress-row"><div><p class="card-label">Final exam</p><h4>${coursePageEscapeHtml(coursePageState.course.title)}</h4><p class="course-meta">Pass with ${coursePageEscapeHtml(String(coursePageState.course.passingScore))}% or higher to receive a certificate.</p></div></div><div class="stack-form">${questions.map((question, index) => renderCoursePageQuiz(`final-${index}`, question, enrollment.progress.finalAnswers?.[question.id] || "")).join("")}<div class="activity-actions"><button class="primary-button" id="coursePageSubmitFinal" type="button">Submit Final Exam</button></div></div>`;
  coursePageElements.courseLessonState.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", () => {
      const index = Number(input.name.replace("final-", "").replace("-answer", ""));
      const question = questions[index];
      enrollment.progress.finalAnswers[question.id] = input.value;
      saveCoursePageCollection(courseStorageKeys.enrollments, coursePageState.enrollments);
    });
  });
  document.querySelector("#coursePageSubmitFinal")?.addEventListener("click", () => {
    let correct = 0;
    questions.forEach((question) => {
      if (enrollment.progress.finalAnswers[question.id] === question.correctAnswer) correct += 1;
    });
    const score = Math.round((correct / questions.length) * 100);
    enrollment.progress.finalScore = score;
    enrollment.statusLabel = score >= coursePageState.course.passingScore ? "Passed" : "Needs retake";
    enrollment.certificateIssuedAt = score >= coursePageState.course.passingScore ? coursePageFormatDate() : null;
    saveCoursePageCollection(courseStorageKeys.enrollments, coursePageState.enrollments);
    renderCoursePage();
  });
  renderCoursePageCertificate();
  renderCourseOverallProgress();
}

function renderCoursePageCertificate() {
  const enrollment = getCoursePageActiveEnrollment();
  if (!enrollment || !enrollment.certificateIssuedAt) {
    coursePageElements.courseCertificate.classList.add("hidden");
    return;
  }
  coursePageElements.courseCertificate.classList.remove("hidden");
  coursePageElements.courseCertificate.innerHTML = `<div class="certificate-card"><p class="card-label">Certificate unlocked</p><h4 class="certificate-title">Certificate of Completion</h4><p>This certifies that <strong>${coursePageEscapeHtml(enrollment.memberName)}</strong> completed <strong>${coursePageEscapeHtml(coursePageState.course.title)}</strong>.</p><p class="activity-meta">Issued ${coursePageEscapeHtml(enrollment.certificateIssuedAt)} | Score ${coursePageEscapeHtml(String(enrollment.progress.finalScore))}%</p></div>`;
}

function renderCoursePage() {
  coursePageState.course = normalizeCoursePageCourse(bundledPublishedCourse);
  renderCoursePageHeader();
  renderCoursePageNav();
  renderCourseOverallProgress();
  renderCoursePageLesson();
}

async function initializePurchasedCourseAccess() {
  const approvedRegistration = await getApprovedCourseRegistration();

  if (!approvedRegistration?.email || !approvedRegistration?.fullName) {
    coursePageElements.courseNav.innerHTML = `<div class="empty-state">This course page is only available after registration and payment.</div>`;
    coursePageElements.courseOverallProgress.innerHTML = `<div class="empty-state">Return to registration to purchase access.</div>`;
    coursePageElements.courseLessonState.innerHTML = `<div class="empty-state">No purchased course was found in this browser yet.</div>`;
    coursePageElements.courseCertificate.classList.add("hidden");
    return false;
  }

  if (getCourseEnrollmentStatus(approvedRegistration.email) === "Completed by Admin") {
    coursePageElements.courseNav.innerHTML = `<div class="empty-state">This student has been marked completed and can no longer access the course.</div>`;
    coursePageElements.courseOverallProgress.innerHTML = `<div class="empty-state">Course access has been closed by the admin.</div>`;
    coursePageElements.courseLessonState.innerHTML = `<div class="empty-state">Contact the executive office if you need help with your completion record.</div>`;
    coursePageElements.courseCertificate.classList.add("hidden");
    return false;
  }

  let existingEnrollment = coursePageState.enrollments.find((item) => item.memberEmail?.toLowerCase() === approvedRegistration.email.toLowerCase());

  if (!existingEnrollment) {
    existingEnrollment = buildCourseEnrollmentRecord(approvedRegistration.fullName, approvedRegistration.email);
    coursePageState.enrollments.unshift(existingEnrollment);
    saveCoursePageCollection(courseStorageKeys.enrollments, coursePageState.enrollments);
  }

  coursePageState.activeEnrollmentId = existingEnrollment.id;
  return true;
}

initializePurchasedCourseAccess().then((allowed) => {
  if (allowed) {
    renderCoursePage();
    if (getCurrentSubpage()) {
      startCoursePageLessonTimer();
    }
  }
});

coursePageElements.courseLogoutButton?.addEventListener("click", () => {
  sessionStorage.removeItem(courseStorageKeys.studentSession);
  window.location.href = "index.html";
});
