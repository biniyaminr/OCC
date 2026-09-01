import { jsPDF } from "jspdf";

type DatasheetProduct = {
  name: string;
  categoryTitle: string;
  tagline: string;
  overview: string;
  regions: string[];
  specs: { label: string; value: string }[];
  packaging: string[];
  uses: string[];
};

export function downloadTechnicalDataSheet(product: DatasheetProduct) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  let y = margin;

  const line = (text: string, size: number, style: "normal" | "bold" | "italic" = "normal") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    const parts = doc.splitTextToSize(text, width);
    for (const part of parts) {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(part, margin, y);
      y += size + 4;
    }
  };

  line("ORAGON COMMODITY CENTER", 10, "bold");
  line("Technical Data Sheet", 9);
  y += 10;
  line(product.name, 22, "bold");
  line(`${product.categoryTitle} — ${product.tagline}`, 11, "italic");
  y += 8;
  line(product.overview, 10);
  y += 12;

  line("Specifications", 13, "bold");
  for (const s of product.specs) line(`• ${s.label}: ${s.value}`, 10);
  y += 10;

  line("Packaging", 13, "bold");
  for (const p of product.packaging) line(`• ${p}`, 10);
  y += 10;

  line("Applications", 13, "bold");
  for (const u of product.uses) line(`• ${u}`, 10);
  y += 10;

  line("Sourcing Regions", 13, "bold");
  line(product.regions.join(", "), 10);
  y += 16;

  line("Oragon Commodity Center | TM5 Building, 2nd Floor, Dembel Area, Addis Ababa, Ethiopia", 9);
  line("plcoragon@gmail.com | +251 98 177 7779", 9);

  doc.save(`OCC-${product.name.replace(/[^a-z0-9]+/gi, "-")}-datasheet.pdf`);
}
