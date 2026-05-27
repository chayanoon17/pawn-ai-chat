import * as XLSX from "xlsx";

export type ExportFormat = "xlsx" | "csv" | "pdf";

export interface ExportColumn {
  header: string;
  key: string;
}

export function exportToXlsx(
  rows: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string
): { blob: Blob; size: number } {
  const wsData = [
    columns.map((c) => c.header),
    ...rows.map((row) => columns.map((c) => row[c.key] ?? "")),
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const buf = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, `${filename}.xlsx`);
  return { blob, size: blob.size };
}

export function exportToCsv(
  rows: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string
): { blob: Blob; size: number } {
  const escape = (val: unknown) => {
    const str = String(val ?? "").replace(/"/g, '""');
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str}"`
      : str;
  };
  const lines = [
    columns.map((c) => escape(c.header)).join(","),
    ...rows.map((row) =>
      columns.map((c) => escape(row[c.key])).join(",")
    ),
  ];
  const bom = "﻿";
  const blob = new Blob([bom + lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  triggerDownload(blob, `${filename}.csv`);
  return { blob, size: blob.size };
}

export async function exportToPdf(
  rows: Record<string, unknown>[],
  columns: ExportColumn[],
  filename: string,
  title?: string
): Promise<{ blob: Blob; size: number }> {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape" });
  if (title) {
    doc.setFontSize(14);
    doc.text(title, 14, 15);
  }

  autoTable(doc, {
    head: [columns.map((c) => c.header)],
    body: rows.map((row) => columns.map((c) => String(row[c.key] ?? ""))),
    startY: title ? 22 : 10,
    styles: { font: "helvetica", fontSize: 9 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  const blob = doc.output("blob");
  triggerDownload(blob, `${filename}.pdf`);
  return { blob, size: blob.size };
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
