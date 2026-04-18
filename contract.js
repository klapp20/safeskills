document.addEventListener("DOMContentLoaded", () => {
  const approvedProfileKey = "safe-skills-registration-approved";
  let approvedProfile = null;

  function formatContractDate(value) {
    if (!value) {
      return "";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    }).format(parsed);
  }

  try {
    approvedProfile = JSON.parse(localStorage.getItem(approvedProfileKey) || "null");
  } catch (error) {
    approvedProfile = null;
  }

  const contractNumberValue = document.querySelector("#contractNumberValue");
  const contractDateValue = document.querySelector("#contractDateValue");
  const contractCourseFeeValue = document.querySelector("#contractCourseFeeValue");
  const contractPaymentNumberValue = document.querySelector("#contractPaymentNumberValue");
  const contractOnlineLabel = document.querySelector("#contractOnlineLabel");
  const contractOnlineCopy = document.querySelector("#contractOnlineCopy");
  const contractParagraph1 = document.querySelector("#contractParagraph1");
  const contractParagraph2 = document.querySelector("#contractParagraph2");
  const contractParagraph3 = document.querySelector("#contractParagraph3");
  const contractParagraph4 = document.querySelector("#contractParagraph4");
  const contractParagraph5 = document.querySelector("#contractParagraph5");
  const contractAgreementCopy = document.querySelector("#contractAgreementCopy");
  const contractStudentProfile = document.querySelector("#contractStudentProfile");
  const contractSignatureForm = document.querySelector("#contractSignatureForm");
  const contractSignatureName = document.querySelector("#contractSignatureName");
  const contractAgreeCheckbox = document.querySelector("#contractAgreeCheckbox");
  const contractSignatureFeedback = document.querySelector("#contractSignatureFeedback");
  const contractSignedState = document.querySelector("#contractSignedState");
  const contractSignedSummary = document.querySelector("#contractSignedSummary");
  const contractPrintButton = document.querySelector("#contractPrintButton");
  const courseLink = document.querySelector('[data-edit-key="contract-course-link"]');

  if (!approvedProfile || !contractStudentProfile) {
    if (contractStudentProfile) {
      contractStudentProfile.innerHTML = `<div class="empty-state">No student registration was found in this browser yet.</div>`;
    }
    if (contractSignatureForm) {
      contractSignatureForm.classList.add("hidden");
    }
    return;
  }

  const activeCourse = getAdminCourse();
  const courseContract = normalizeCourseContract(activeCourse.contract || adminDefaultContract);

  const summary = {
    studentName: approvedProfile.fullName || "",
    contactNumber: approvedProfile.phone || "",
    contractNumber: approvedProfile.contractNumber || "",
    studentAddress: buildStudentAddress(approvedProfile),
    permitTestDate: approvedProfile.permitTestDate || "",
    courseFee: approvedProfile.amount || "",
    birthDate: approvedProfile.birthDate || "",
    permitNumber: approvedProfile.driverLicenseNumber || "",
    studentSchool: approvedProfile.studentSchool || getStudentSchoolName()
  };

  function renderStudentProfileColumns() {
    const items = [
      ["Student Name", approvedProfile.fullName],
      ["Email Address", approvedProfile.email],
      ["Contact Number", approvedProfile.phone],
      ["Street Address", approvedProfile.address1],
      ["Address Line 2", approvedProfile.address2 || "-"],
      ["City, State ZIP", [approvedProfile.city, approvedProfile.state, approvedProfile.zip].filter(Boolean).join(", ")],
      ["Birth Date", approvedProfile.birthDate || "-"],
      ["Driver License Number", approvedProfile.driverLicenseNumber || "-"]
    ];

    contractStudentProfile.innerHTML = items.map(([label, value]) => `
      <article class="student-record-card">
        <span class="student-record-label">${adminEscapeHtml(label)}</span>
        <strong>${adminEscapeHtml(value || "-")}</strong>
      </article>
    `).join("");
  }

  function renderSignedState() {
    const isSigned = Boolean(approvedProfile.contractSignedName && approvedProfile.contractSignedAt);
    contractSignatureForm?.classList.toggle("hidden", isSigned);
    contractSignedState?.classList.toggle("hidden", !isSigned);

    if (isSigned && contractSignedSummary) {
      contractSignedSummary.textContent = `Signed by ${approvedProfile.contractSignedName} on ${approvedProfile.contractSignedAt}.`;
    }
  }

  contractNumberValue.textContent = approvedProfile.contractNumber || "202537";
  contractDateValue.textContent = approvedProfile.contractDate || adminFormatDate();
  contractCourseFeeValue.textContent = approvedProfile.amount || "$49.00";
  contractPaymentNumberValue.textContent = approvedProfile.paymentNumber || `PAY-${approvedProfile.contractNumber || "202537"}`;
  if (contractOnlineLabel) contractOnlineLabel.textContent = courseContract.onlineLabel;
  if (contractOnlineCopy) contractOnlineCopy.textContent = courseContract.onlineCopy;
  if (contractParagraph1) contractParagraph1.textContent = courseContract.paragraph1;
  if (contractParagraph2) contractParagraph2.textContent = courseContract.paragraph2;
  if (contractParagraph3) contractParagraph3.textContent = courseContract.paragraph3;
  if (contractParagraph4) contractParagraph4.textContent = courseContract.paragraph4;
  if (contractParagraph5) contractParagraph5.textContent = courseContract.paragraph5;
  if (contractAgreementCopy) contractAgreementCopy.textContent = courseContract.agreementCopy;
  renderStudentProfileColumns();
  renderSignedState();

  contractSignatureForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contractAgreeCheckbox?.checked) {
      contractSignatureFeedback.textContent = "Check the agreement box before signing.";
      return;
    }

    approvedProfile.contractSignedName = contractSignatureName.value.trim();
    approvedProfile.contractSignedAt = formatContractDate(new Date().toISOString()) || adminFormatDate();
    localStorage.setItem(approvedProfileKey, JSON.stringify(approvedProfile));
    contractSignatureFeedback.textContent = "Contract signed.";
    renderSignedState();
    window.setTimeout(() => {
      window.location.href = courseLink?.getAttribute("href") || "course.html";
    }, 500);
  });

  contractPrintButton?.addEventListener("click", () => {
    const printWindow = window.open("", "_blank", "width=980,height=720");

    if (!printWindow) {
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Safe Skills Driving School Contract</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #2E2E2E; }
          h1 { color: #4A6FA5; margin-bottom: 8px; }
          .meta, .profile { display: grid; gap: 12px; }
          .meta { grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 20px 0; }
          .profile { grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 24px; }
          .card { border: 1px solid #D9D4CC; border-radius: 10px; padding: 12px; }
          .label { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #4A6FA5; margin-bottom: 6px; }
          p { line-height: 1.6; }
        </style>
      </head>
      <body>
        <h1>Safe Skills Driving School Contract</h1>
        <div class="meta">
          <div class="card"><span class="label">Contract Number</span><strong>${adminEscapeHtml(String(approvedProfile.contractNumber || ""))}</strong></div>
          <div class="card"><span class="label">Contract Date</span><strong>${adminEscapeHtml(approvedProfile.contractDate || "")}</strong></div>
          <div class="card"><span class="label">Course Fee</span><strong>${adminEscapeHtml(approvedProfile.amount || "")}</strong></div>
          <div class="card"><span class="label">${adminEscapeHtml(courseContract.onlineLabel)}</span><strong>${adminEscapeHtml(courseContract.onlineCopy)}</strong></div>
          <div class="card"><span class="label">Payment Number</span><strong>${adminEscapeHtml(approvedProfile.paymentNumber || "")}</strong></div>
        </div>
        <p>${adminEscapeHtml(courseContract.paragraph1)}</p>
        <p>${adminEscapeHtml(courseContract.paragraph2)}</p>
        <p>${adminEscapeHtml(courseContract.paragraph3)}</p>
        <p>${adminEscapeHtml(courseContract.paragraph4)}</p>
        <p>${adminEscapeHtml(courseContract.paragraph5)}</p>
        <div class="profile">
          <div class="card"><span class="label">Student Name</span><strong>${adminEscapeHtml(approvedProfile.fullName || "")}</strong></div>
          <div class="card"><span class="label">Email Address</span><strong>${adminEscapeHtml(approvedProfile.email || "")}</strong></div>
          <div class="card"><span class="label">Contact Number</span><strong>${adminEscapeHtml(approvedProfile.phone || "")}</strong></div>
          <div class="card"><span class="label">Street Address</span><strong>${adminEscapeHtml(approvedProfile.address1 || "")}</strong></div>
          <div class="card"><span class="label">Address Line 2</span><strong>${adminEscapeHtml(approvedProfile.address2 || "-")}</strong></div>
          <div class="card"><span class="label">City, State ZIP</span><strong>${adminEscapeHtml([approvedProfile.city, approvedProfile.state, approvedProfile.zip].filter(Boolean).join(", "))}</strong></div>
          <div class="card"><span class="label">Birth Date</span><strong>${adminEscapeHtml(approvedProfile.birthDate || "")}</strong></div>
          <div class="card"><span class="label">Driver License Number</span><strong>${adminEscapeHtml(approvedProfile.driverLicenseNumber || "")}</strong></div>
        </div>
        <p style="margin-top: 28px;"><strong>E-signed by:</strong> ${adminEscapeHtml(approvedProfile.contractSignedName || "")}</p>
        <p><strong>Signed date:</strong> ${adminEscapeHtml(approvedProfile.contractSignedAt || "")}</p>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  });
});
