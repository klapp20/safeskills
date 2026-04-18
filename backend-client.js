const safeSkillsBackendStorageKeys = {
  enabled: "safe-skills-backend-enabled",
  url: "safe-skills-backend-url",
  secret: "safe-skills-backend-secret"
};

function getBackendSettings() {
  return {
    enabled: localStorage.getItem(safeSkillsBackendStorageKeys.enabled) === "1",
    url: localStorage.getItem(safeSkillsBackendStorageKeys.url) || "",
    secret: localStorage.getItem(safeSkillsBackendStorageKeys.secret) || ""
  };
}

function saveBackendSettings(settings) {
  localStorage.setItem(safeSkillsBackendStorageKeys.enabled, settings.enabled ? "1" : "0");
  localStorage.setItem(safeSkillsBackendStorageKeys.url, settings.url || "");
  localStorage.setItem(safeSkillsBackendStorageKeys.secret, settings.secret || "");
}

function backendIsReady() {
  const settings = getBackendSettings();
  return Boolean(settings.enabled && settings.url);
}

async function hashStudentPassword(password) {
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, "0")).join("");
  }

  let hash = 0;
  const text = String(password || "");
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(index);
    hash |= 0;
  }
  return `legacy-${Math.abs(hash)}`;
}

async function backendRequest(action, payload = {}) {
  if (!backendIsReady()) {
    return null;
  }

  const settings = getBackendSettings();
  const response = await fetch(settings.url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      action,
      secret: settings.secret || "",
      ...payload
    })
  });

  if (!response.ok) {
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function backendFetchStudentByEmail(email) {
  if (!email) {
    return null;
  }

  const result = await backendRequest("getStudent", { email });
  return result?.student || null;
}

async function backendUpsertStudent(profile) {
  if (!profile?.email) {
    return false;
  }

  const payload = {
    student: {
      email: profile.email,
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      address1: profile.address1 || "",
      address2: profile.address2 || "",
      city: profile.city || "",
      state: profile.state || "",
      zip: profile.zip || "",
      birthDate: profile.birthDate || "",
      driverLicenseNumber: profile.driverLicenseNumber || "",
      contractNumber: profile.contractNumber || "",
      permitTestDate: profile.permitTestDate || "",
      studentSchool: profile.studentSchool || "",
      courseTitle: profile.courseTitle || "",
      amount: profile.amount || "",
      contractDate: profile.contractDate || "",
      paymentNumber: profile.paymentNumber || "",
      contractSignedName: profile.contractSignedName || "",
      contractSignedAt: profile.contractSignedAt || "",
      registeredAt: profile.registeredAt || "",
      paidAt: profile.paidAt || "",
      passwordHash: profile.password ? await hashStudentPassword(profile.password) : ""
    }
  };

  const result = await backendRequest("upsertStudent", payload);
  return Boolean(result?.ok);
}

async function backendVerifyStudent(email, password) {
  const student = await backendFetchStudentByEmail(email);
  if (!student) {
    return null;
  }

  const hash = await hashStudentPassword(password);
  if ((student.passwordHash || "") !== hash) {
    return null;
  }

  return {
    email: student.email,
    fullName: student.fullName || "",
    phone: student.phone || "",
    address1: student.address1 || "",
    address2: student.address2 || "",
    city: student.city || "",
    state: student.state || "",
    zip: student.zip || "",
    birthDate: student.birthDate || "",
    driverLicenseNumber: student.driverLicenseNumber || "",
    contractNumber: student.contractNumber || "",
    permitTestDate: student.permitTestDate || "",
    studentSchool: student.studentSchool || "",
    courseTitle: student.courseTitle || "",
    amount: student.amount || "",
    contractDate: student.contractDate || "",
    paymentNumber: student.paymentNumber || "",
    contractSignedName: student.contractSignedName || "",
    contractSignedAt: student.contractSignedAt || "",
    password
  };
}

window.safeSkillsBackendClient = {
  getSettings: getBackendSettings,
  saveSettings: saveBackendSettings,
  isReady: backendIsReady,
  upsertStudent: backendUpsertStudent,
  verifyStudent: backendVerifyStudent,
  fetchStudentByEmail: backendFetchStudentByEmail
};
