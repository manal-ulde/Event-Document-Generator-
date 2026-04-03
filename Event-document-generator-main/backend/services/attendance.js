import xlsx from "xlsx";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { bufferToBase64, clampText } from "../utils.js";

const detectColumns = (row = {}) => {
  const keys = Object.keys(row);
  const nameKey = keys.find((key) => /name/i.test(key)) || keys[0];
  const rollKey = keys.find((key) => /(roll|enroll|reg)/i.test(key)) || keys[1];
  const yearKey = keys.find((key) => /year/i.test(key));
  const branchKey = keys.find((key) => /branch|dept/i.test(key));
  const divisionKey = keys.find((key) => /division|div/i.test(key));

  return { nameKey, rollKey, yearKey, branchKey, divisionKey };
};

export const parseAttendanceFile = (fileBuffer, fileName = "students.csv") => {
  const workbook = xlsx.read(fileBuffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawRows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
  const columns = detectColumns(rawRows[0]);

  const students = rawRows
    .map((row, index) => ({
      id: `${index + 1}`,
      name: clampText(row[columns.nameKey], 120) || `Student ${index + 1}`,
      roll: clampText(row[columns.rollKey], 60) || `ROLL-${index + 1}`,
      year: columns.yearKey ? clampText(row[columns.yearKey], 20) : "",
      branch: columns.branchKey ? clampText(row[columns.branchKey], 50) : "",
      division: columns.divisionKey ? clampText(row[columns.divisionKey], 20) : "",
      selected: true,
    }))
    .filter((student) => student.name || student.roll);

  const metadata = {
    sourceFile: fileName,
    rowsParsed: students.length,
    years: [...new Set(students.map((student) => student.year).filter(Boolean))],
    branches: [...new Set(students.map((student) => student.branch).filter(Boolean))],
    divisions: [...new Set(students.map((student) => student.division).filter(Boolean))],
  };

  return { students, metadata };
};

export const buildAttendancePdf = async (payload) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 790;
  page.drawText(payload.collegeName || "College Name", { x: 50, y, size: 16, font: bold });
  y -= 18;
  page.drawText(payload.collegeAddress || "College Address", { x: 50, y, size: 10, font: regular });
  y -= 28;
  page.drawText(`Attendance Sheet: ${payload.eventTitle || "Event"}`, { x: 50, y, size: 14, font: bold });
  y -= 18;
  page.drawText(`Club: ${payload.clubName || "General"} | Year: ${payload.year || "-"} | Branch: ${payload.branch || "-"} | Division: ${payload.division || "-"}`, {
    x: 50,
    y,
    size: 10,
    font: regular,
  });
  y -= 28;

  page.drawText("#", { x: 50, y, size: 10, font: bold });
  page.drawText("Name", { x: 90, y, size: 10, font: bold });
  page.drawText("Roll Number", { x: 310, y, size: 10, font: bold });
  page.drawText("Signature", { x: 430, y, size: 10, font: bold });
  y -= 16;

  page.drawLine({ start: { x: 50, y }, end: { x: 540, y }, thickness: 1 });
  y -= 16;

  payload.students.forEach((student, index) => {
    if (y < 70) {
      return;
    }
    page.drawText(String(index + 1), { x: 50, y, size: 10, font: regular });
    page.drawText(clampText(student.name, 34), { x: 90, y, size: 10, font: regular });
    page.drawText(clampText(student.roll, 18), { x: 310, y, size: 10, font: regular });
    page.drawLine({ start: { x: 430, y: y - 2 }, end: { x: 530, y: y - 2 }, thickness: 0.7 });
    y -= 22;
  });

  return {
    fileName: `${(payload.eventTitle || "attendance-sheet").replace(/\s+/g, "-").toLowerCase()}.pdf`,
    pdfBase64: bufferToBase64(await pdfDoc.save()),
  };
};
