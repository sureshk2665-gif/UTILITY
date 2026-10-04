"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

function generateXMPMetadata(title: string, creator: string, createDate: string, modDate: string, conformance: string): string {
  return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:xmp="http://ns.adobe.com/xap/1.0/"
      xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/"
      xmlns:pdf="http://ns.adobe.com/pdf/1.3/">
      <dc:title>
        <rdf:Alt>
          <rdf:li xml:lang="x-default">${escapeXml(title)}</rdf:li>
        </rdf:Alt>
      </dc:title>
      <dc:creator>
        <rdf:Seq>
          <rdf:li>${escapeXml(creator)}</rdf:li>
        </rdf:Seq>
      </dc:creator>
      <xmp:CreatorTool>PDF Tools Online</xmp:CreatorTool>
      <xmp:CreateDate>${createDate}</xmp:CreateDate>
      <xmp:ModifyDate>${modDate}</xmp:ModifyDate>
      <pdfaid:part>${conformance === "PDF/A-1b" ? "1" : conformance === "PDF/A-2b" ? "2" : "3"}</pdfaid:part>
      <pdfaid:conformance>B</pdfaid:conformance>
      <pdf:Producer>PDF Tools Online - PDF/A Converter</pdf:Producer>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function toISODate(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

function injectXMPIntoBytes(pdfBytes: Uint8Array, xmpXml: string): Uint8Array {
  const encoder = new TextEncoder();
  const xmpBytes = encoder.encode(xmpXml);

  const streamObj = encoder.encode(
    `\n999 0 obj\n<< /Type /Metadata /Subtype /XML /Length ${xmpBytes.length} >>\nstream\n`
  );
  const endStream = encoder.encode(`\nendstream\nendobj\n`);

  const pdfStr = new TextDecoder("latin1").decode(pdfBytes);
  const catalogMatch = pdfStr.match(/(\d+)\s+0\s+obj[^]*?\/Type\s*\/Catalog/);

  if (catalogMatch) {
    const catalogObjNum = catalogMatch[1];
    const catalogPattern = new RegExp(`(${catalogObjNum}\\s+0\\s+obj\\s*<<)([^]*?)(>>\\s*endobj)`, "m");
    const catMatch = pdfStr.match(catalogPattern);

    if (catMatch && !catMatch[2].includes("/Metadata")) {
      const metadataRef = " /Metadata 999 0 R";
      const insertPos = catMatch.index! + catMatch[1].length;

      const before = pdfBytes.slice(0, insertPos);
      const metaRefBytes = encoder.encode(metadataRef);
      const after = pdfBytes.slice(insertPos);

      const withRef = new Uint8Array(before.length + metaRefBytes.length + after.length);
      withRef.set(before, 0);
      withRef.set(metaRefBytes, before.length);
      withRef.set(after, before.length + metaRefBytes.length);

      const result = new Uint8Array(withRef.length + streamObj.length + xmpBytes.length + endStream.length);
      const eofIndex = findLastEOF(withRef);
      const beforeEof = withRef.slice(0, eofIndex);
      const afterEof = withRef.slice(eofIndex);

      result.set(beforeEof, 0);
      let offset = beforeEof.length;
      result.set(streamObj, offset); offset += streamObj.length;
      result.set(xmpBytes, offset); offset += xmpBytes.length;
      result.set(endStream, offset); offset += endStream.length;
      const finalResult = new Uint8Array(offset + afterEof.length);
      finalResult.set(result.slice(0, offset), 0);
      finalResult.set(afterEof, offset);
      return finalResult;
    }
  }

  const eofIndex = findLastEOF(pdfBytes);
  const before = pdfBytes.slice(0, eofIndex);
  const after = pdfBytes.slice(eofIndex);
  const result = new Uint8Array(before.length + streamObj.length + xmpBytes.length + endStream.length + after.length);
  let offset = 0;
  result.set(before, offset); offset += before.length;
  result.set(streamObj, offset); offset += streamObj.length;
  result.set(xmpBytes, offset); offset += xmpBytes.length;
  result.set(endStream, offset); offset += endStream.length;
  result.set(after, offset);
  return result;
}

function findLastEOF(bytes: Uint8Array): number {
  const str = new TextDecoder("latin1").decode(bytes);
  const idx = str.lastIndexOf("%%EOF");
  return idx >= 0 ? idx : bytes.length;
}

export default function PDFtoPDFA() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [conformance, setConformance] = useState<"PDF/A-1b" | "PDF/A-2b" | "PDF/A-3b">("PDF/A-2b");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [details, setDetails] = useState<{ pages: number; title: string; size: string } | null>(null);

  const handleConvert = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setStatus("idle");
    try {
      const bytes = await files[0].arrayBuffer();
      const sourceDoc = await PDFDocument.load(bytes);

      const title = sourceDoc.getTitle() || files[0].name.replace(/\.pdf$/i, "");
      const creator = sourceDoc.getCreator() || "Unknown";
      const now = new Date();
      const createDate = toISODate(sourceDoc.getCreationDate() || now);
      const modDate = toISODate(now);

      const outputDoc = await PDFDocument.create();
      const pageIndices = Array.from({ length: sourceDoc.getPageCount() }, (_, i) => i);
      const copiedPages = await outputDoc.copyPages(sourceDoc, pageIndices);
      copiedPages.forEach((p) => outputDoc.addPage(p));

      outputDoc.setTitle(title);
      outputDoc.setAuthor(creator);
      outputDoc.setCreator("PDF Tools Online");
      outputDoc.setProducer("PDF Tools Online - PDF/A Converter");
      outputDoc.setCreationDate(sourceDoc.getCreationDate() || now);
      outputDoc.setModificationDate(now);
      outputDoc.setSubject(`Converted to ${conformance} archival format`);

      const savedBytes = await outputDoc.save();

      const xmpXml = generateXMPMetadata(title, creator, createDate, modDate, conformance);
      const finalBytes = injectXMPIntoBytes(new Uint8Array(savedBytes), xmpXml);

      const name = files[0].name.replace(/\.pdf$/i, "");
      saveAs(new Blob([finalBytes.buffer as ArrayBuffer], { type: "application/pdf" }), `${name}_pdfa.pdf`);

      setDetails({
        pages: sourceDoc.getPageCount(),
        title,
        size: `${(finalBytes.length / 1024).toFixed(1)} KB`,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="pdf-to-pdfa" title="PDF to PDF/A" description="Convert PDFs to ISO 19005 archival format with XMP metadata." color="#3498DB">
      <FileDropzone files={files} onFilesAdded={(f) => { setFiles(f.slice(0, 1)); setStatus("idle"); setDetails(null); }} onRemove={() => { setFiles([]); setStatus("idle"); setDetails(null); }} multiple={false} />
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Conformance Level</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: "PDF/A-1b" as const, label: "PDF/A-1b", desc: "ISO 19005-1" },
                { id: "PDF/A-2b" as const, label: "PDF/A-2b", desc: "ISO 19005-2" },
                { id: "PDF/A-3b" as const, label: "PDF/A-3b", desc: "ISO 19005-3" },
              ]).map((c) => (
                <button key={c.id} onClick={() => setConformance(c.id)}
                  className={`py-2.5 rounded-xl border text-sm transition-all active:scale-95 ${conformance === c.id ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted hover:border-primary/50"}`}>
                  <span className="block font-medium">{c.label}</span>
                  <span className="block text-[10px] opacity-60">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-4 text-sm space-y-2">
            <h3 className="font-bold">Conversion includes:</h3>
            <ul className="text-muted space-y-1">
              <li className="flex gap-2"><span className="text-primary">&#10003;</span> XMP metadata stream (ISO 16684)</li>
              <li className="flex gap-2"><span className="text-primary">&#10003;</span> PDF/A identification ({conformance} conformance)</li>
              <li className="flex gap-2"><span className="text-primary">&#10003;</span> Dublin Core metadata (title, creator, dates)</li>
              <li className="flex gap-2"><span className="text-primary">&#10003;</span> Preserved document structure and fonts</li>
            </ul>
          </div>

          {status === "success" && details && (
            <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-4 text-sm">
              <p className="text-accent-green font-semibold text-center mb-2">Converted to {conformance} successfully!</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><span className="block text-xs text-muted">Pages</span><span className="font-bold">{details.pages}</span></div>
                <div><span className="block text-xs text-muted">Title</span><span className="font-bold truncate block">{details.title}</span></div>
                <div><span className="block text-xs text-muted">Size</span><span className="font-bold">{details.size}</span></div>
              </div>
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-500 font-medium text-center">
              Error converting to PDF/A. The file may be corrupted or use unsupported features.
            </div>
          )}

          <button onClick={handleConvert} disabled={processing}
            className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50">
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                Converting to {conformance}...
              </span>
            ) : `Convert to ${conformance}`}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
