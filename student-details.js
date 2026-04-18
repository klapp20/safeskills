document.addEventListener("DOMContentLoaded", () => {
  const approvedProfileKey = "safe-skills-registration-approved";
  let approvedProfile = null;
  try {
    approvedProfile = JSON.parse(localStorage.getItem(approvedProfileKey) || "null");
  } catch (error) {
    approvedProfile = null;
  }
  const course = getAdminCourse();
  const enrollments = getAdminEnrollments();
  const student = enrollments[0] || null;
  const recordGrid = document.querySelector("#studentRecordGrid");
  const progressTable = document.querySelector("#studentProgressTable");
  const printButton = document.querySelector("#studentRecordPrintButton");
  const editButton = document.querySelector("#editStudentProfileButton");
  const editForm = document.querySelector("#studentProfileEditForm");
  const cancelEditButton = document.querySelector("#cancelStudentProfileEdit");
  const editFeedback = document.querySelector("#studentProfileEditFeedback");

  const fieldMap = {
    fullName: document.querySelector("#studentEditFullName"),
    phone: document.querySelector("#studentEditPhone"),
    permitTestDate: document.querySelector("#studentEditPermitTestDate"),
    address1: document.querySelector("#studentEditAddress1"),
    address2: document.querySelector("#studentEditAddress2"),
    city: document.querySelector("#studentEditCity"),
    state: document.querySelector("#studentEditState"),
    zip: document.querySelector("#studentEditZip"),
    birthDate: document.querySelector("#studentEditBirthDate"),
    driverLicenseNumber: document.querySelector("#studentEditPermitNumber"),
    studentSchool: document.querySelector("#studentEditSchool")
  };

  if (!recordGrid || !progressTable) {
    return;
  }

  if (!approvedProfile) {
    recordGrid.innerHTML = `<div class="empty-state">No student record was found in this browser yet. Complete registration and payment first.</div>`;
    progressTable.innerHTML = `<div class="empty-state">Progress tracking will appear after the course begins.</div>`;
    return;
  }

  const fallbackStudent = student || {
    memberName: approvedProfile.fullName || "",
    amountPaid: approvedProfile.amount || course.price || "",
    progress: {}
  };

  function populateEditForm(profile) {
    fieldMap.fullName.value = profile.fullName || "";
    fieldMap.phone.value = profile.phone || "";
    fieldMap.permitTestDate.value = profile.permitTestDate || "";
    fieldMap.address1.value = profile.address1 || "";
    fieldMap.address2.value = profile.address2 || "";
    fieldMap.city.value = profile.city || "";
    fieldMap.state.value = profile.state || "WI";
    fieldMap.zip.value = profile.zip || "";
    fieldMap.birthDate.value = profile.birthDate || "";
    fieldMap.driverLicenseNumber.value = profile.driverLicenseNumber || "";
    fieldMap.studentSchool.value = profile.studentSchool || getStudentSchoolName();
  }

  function renderStudentDetails() {
    const currentProfile = approvedProfile || {};
    const summary = buildStudentRecordSummary(fallbackStudent, currentProfile, course);
    const progressRows = student ? buildStudentProgressRows(student, course) : [];

    recordGrid.innerHTML = renderStudentRecordGrid(summary);
    progressTable.innerHTML = renderStudentProgressTable(progressRows);
    printButton?.addEventListener("click", () => {
      printStudentRecordPdf(summary, progressRows);
    }, { once: true });
  }

  function setEditMode(isEditing) {
    recordGrid.classList.toggle("editing-view", isEditing);
    editForm?.classList.toggle("hidden", !isEditing);
    editButton?.classList.toggle("hidden", isEditing);
    printButton?.classList.toggle("hidden", isEditing);
    if (isEditing) {
      populateEditForm(approvedProfile || {});
      editFeedback.textContent = "Update your profile information and save it here.";
    }
  }

  renderStudentDetails();

  editButton?.addEventListener("click", () => {
    setEditMode(true);
  });

  cancelEditButton?.addEventListener("click", () => {
    setEditMode(false);
  });

  editForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    approvedProfile = {
      ...approvedProfile,
      fullName: fieldMap.fullName.value.trim(),
      phone: fieldMap.phone.value.trim(),
      permitTestDate: fieldMap.permitTestDate.value,
      address1: fieldMap.address1.value.trim(),
      address2: fieldMap.address2.value.trim(),
      city: fieldMap.city.value.trim(),
      state: fieldMap.state.value.trim(),
      zip: fieldMap.zip.value.trim(),
      birthDate: fieldMap.birthDate.value,
      driverLicenseNumber: fieldMap.driverLicenseNumber.value.trim(),
      studentSchool: fieldMap.studentSchool.value.trim()
    };

    localStorage.setItem(approvedProfileKey, JSON.stringify(approvedProfile));
    fallbackStudent.memberName = approvedProfile.fullName || fallbackStudent.memberName;
    editFeedback.textContent = "Profile saved.";
    setEditMode(false);
    renderStudentDetails();
  });
});
