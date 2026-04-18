const SHEET_NAME = "students";
const SHARED_SECRET = "change-this-secret";

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    if (SHARED_SECRET && payload.secret !== SHARED_SECRET) {
      return jsonResponse({ ok: false, error: "Unauthorized" });
    }

    if (payload.action === "getStudent") {
      const student = findStudentByEmail_(String(payload.email || ""));
      return jsonResponse({ ok: true, student: student || null });
    }

    if (payload.action === "upsertStudent") {
      upsertStudent_(payload.student || {});
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: "Unknown action" });
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  const headers = [
    "email",
    "fullName",
    "phone",
    "address1",
    "address2",
    "city",
    "state",
    "zip",
    "birthDate",
    "driverLicenseNumber",
    "contractNumber",
    "permitTestDate",
    "studentSchool",
    "courseTitle",
    "amount",
    "contractDate",
    "paymentNumber",
    "contractSignedName",
    "contractSignedAt",
    "registeredAt",
    "paidAt",
    "passwordHash",
    "updatedAt"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const needsHeaders = headers.some((header, index) => currentHeaders[index] !== header);

  if (needsHeaders) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  return sheet;
}

function getHeaders_() {
  const sheet = getSheet_();
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function findStudentByEmail_(email) {
  if (!email) {
    return null;
  }

  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    const row = values[rowIndex];
    if (String(row[0] || "").toLowerCase() === email.toLowerCase()) {
      const student = {};
      headers.forEach((header, columnIndex) => {
        student[header] = row[columnIndex] || "";
      });
      return student;
    }
  }

  return null;
}

function upsertStudent_(student) {
  const email = String(student.email || "").trim().toLowerCase();
  if (!email) {
    throw new Error("Student email is required.");
  }

  const sheet = getSheet_();
  const headers = getHeaders_();
  const values = sheet.getDataRange().getValues();
  const normalizedStudent = {
    email,
    fullName: String(student.fullName || ""),
    phone: String(student.phone || ""),
    address1: String(student.address1 || ""),
    address2: String(student.address2 || ""),
    city: String(student.city || ""),
    state: String(student.state || ""),
    zip: String(student.zip || ""),
    birthDate: String(student.birthDate || ""),
    driverLicenseNumber: String(student.driverLicenseNumber || ""),
    contractNumber: String(student.contractNumber || ""),
    permitTestDate: String(student.permitTestDate || ""),
    studentSchool: String(student.studentSchool || ""),
    courseTitle: String(student.courseTitle || ""),
    amount: String(student.amount || ""),
    contractDate: String(student.contractDate || ""),
    paymentNumber: String(student.paymentNumber || ""),
    contractSignedName: String(student.contractSignedName || ""),
    contractSignedAt: String(student.contractSignedAt || ""),
    registeredAt: String(student.registeredAt || ""),
    paidAt: String(student.paidAt || ""),
    passwordHash: String(student.passwordHash || ""),
    updatedAt: new Date().toISOString()
  };

  const rowData = headers.map((header) => normalizedStudent[header] || "");
  let existingRow = -1;

  for (let rowIndex = 1; rowIndex < values.length; rowIndex += 1) {
    if (String(values[rowIndex][0] || "").toLowerCase() === email) {
      existingRow = rowIndex + 1;
      break;
    }
  }

  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}
