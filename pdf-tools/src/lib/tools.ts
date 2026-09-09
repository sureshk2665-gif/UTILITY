export interface Tool {
  name: string;
  slug: string;
  description: string;
  category: string;
  color: string;
  icon: string;
  available: boolean;
}

export const categories = [
  { id: "all", label: "All Tools" },
  { id: "organize", label: "Organize PDF" },
  { id: "convert", label: "Convert PDF" },
  { id: "edit", label: "Edit PDF" },
  { id: "optimize", label: "Optimize PDF" },
  { id: "security", label: "PDF Security" },
  { id: "intelligence", label: "PDF Intelligence" },
] as const;

export const tools: Tool[] = [
  // Organize PDF
  { name: "Merge PDF", slug: "merge-pdf", description: "Combine multiple PDFs into one file in the order you want.", category: "organize", color: "#E74C3C", icon: "merge", available: true },
  { name: "Split PDF", slug: "split-pdf", description: "Separate a PDF into individual single-page files.", category: "organize", color: "#E74C3C", icon: "split", available: true },
  { name: "Remove Pages", slug: "remove-pages", description: "Delete specific pages from your PDF document.", category: "organize", color: "#E74C3C", icon: "remove", available: true },
  { name: "Extract Pages", slug: "extract-pages", description: "Pull selected pages into a new PDF file.", category: "organize", color: "#E74C3C", icon: "extract", available: true },
  { name: "Rotate PDF", slug: "rotate-pdf", description: "Rotate your PDF pages the way you need them.", category: "organize", color: "#E74C3C", icon: "rotate", available: true },
  { name: "Compress PDF", slug: "compress-pdf", description: "Reduce file size while optimizing for quality.", category: "organize", color: "#E67E22", icon: "compress", available: true },
  { name: "Organize PDF", slug: "organize-pdf", description: "Sort pages in any order. Delete or add pages.", category: "organize", color: "#E74C3C", icon: "organize", available: true },
  { name: "Page Numbers", slug: "page-numbers", description: "Add page numbers to your PDF with custom position.", category: "organize", color: "#E74C3C", icon: "numbers", available: true },

  // Convert to PDF
  { name: "JPG to PDF", slug: "jpg-to-pdf", description: "Convert JPG images to PDF in seconds.", category: "convert", color: "#3498DB", icon: "image", available: true },
  { name: "Word to PDF", slug: "word-to-pdf", description: "Convert DOC and DOCX files to PDF.", category: "convert", color: "#3498DB", icon: "word", available: true },
  { name: "PowerPoint to PDF", slug: "ppt-to-pdf", description: "Convert PPT and PPTX slides to PDF.", category: "convert", color: "#3498DB", icon: "ppt", available: true },
  { name: "Excel to PDF", slug: "excel-to-pdf", description: "Convert XLSX spreadsheets to PDF.", category: "convert", color: "#3498DB", icon: "excel", available: true },
  { name: "HTML to PDF", slug: "html-to-pdf", description: "Convert webpages to PDF by URL.", category: "convert", color: "#3498DB", icon: "html", available: true },

  // Convert from PDF
  { name: "PDF to JPG", slug: "pdf-to-jpg", description: "Convert each PDF page into a JPG image.", category: "convert", color: "#3498DB", icon: "image", available: true },
  { name: "PDF to Word", slug: "pdf-to-word", description: "Convert PDF to editable DOCX documents.", category: "convert", color: "#3498DB", icon: "word", available: true },
  { name: "PDF to PowerPoint", slug: "pdf-to-ppt", description: "Turn your PDF into a PPTX slideshow.", category: "convert", color: "#3498DB", icon: "ppt", available: true },
  { name: "PDF to Excel", slug: "pdf-to-excel", description: "Extract PDF tables into XLSX spreadsheets.", category: "convert", color: "#3498DB", icon: "excel", available: true },
  { name: "PDF to PDF/A", slug: "pdf-to-pdfa", description: "Convert to ISO-standard archive format.", category: "convert", color: "#3498DB", icon: "archive", available: false },
  { name: "PDF to Markdown", slug: "pdf-to-markdown", description: "Convert PDF to Markdown for notes and docs.", category: "convert", color: "#3498DB", icon: "markdown", available: false },

  // Edit PDF
  { name: "Edit PDF", slug: "edit-pdf", description: "Add text, images, shapes, and annotations.", category: "edit", color: "#27AE60", icon: "edit", available: true },
  { name: "Sign PDF", slug: "sign-pdf", description: "Sign or request electronic signatures.", category: "edit", color: "#27AE60", icon: "sign", available: true },
  { name: "Watermark", slug: "watermark", description: "Stamp text or image watermarks on pages.", category: "edit", color: "#27AE60", icon: "watermark", available: true },
  { name: "PDF Forms", slug: "pdf-forms", description: "Create and fill interactive form fields.", category: "edit", color: "#27AE60", icon: "forms", available: false },
  { name: "Redact PDF", slug: "redact-pdf", description: "Permanently remove sensitive content.", category: "edit", color: "#27AE60", icon: "redact", available: true },
  { name: "Crop PDF", slug: "crop-pdf", description: "Adjust margins and crop page areas.", category: "edit", color: "#27AE60", icon: "crop", available: true },

  // Optimize PDF
  { name: "Repair PDF", slug: "repair-pdf", description: "Fix damaged or corrupted PDF files.", category: "optimize", color: "#E67E22", icon: "repair", available: false },
  { name: "Compare PDF", slug: "compare-pdf", description: "Side-by-side comparison of two PDFs.", category: "optimize", color: "#E67E22", icon: "compare", available: false },
  { name: "Scan to PDF", slug: "scan-to-pdf", description: "Capture document scans from your camera.", category: "optimize", color: "#E67E22", icon: "scan", available: false },

  // Security
  { name: "Unlock PDF", slug: "unlock-pdf", description: "Remove PDF password protection.", category: "security", color: "#8E44AD", icon: "unlock", available: false },
  { name: "Protect PDF", slug: "protect-pdf", description: "Encrypt PDF with a password.", category: "security", color: "#8E44AD", icon: "lock", available: false },

  // Intelligence
  { name: "OCR PDF", slug: "ocr-pdf", description: "Extract text from scanned documents.", category: "intelligence", color: "#16A085", icon: "ocr", available: false },
  { name: "AI Summarizer", slug: "ai-summarizer", description: "Generate concise AI-powered summaries.", category: "intelligence", color: "#16A085", icon: "ai", available: false },
  { name: "Translate PDF", slug: "translate-pdf", description: "AI-powered document translation.", category: "intelligence", color: "#16A085", icon: "translate", available: false },
];
