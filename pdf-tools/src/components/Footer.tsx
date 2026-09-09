import Link from "next/link";
import { tools } from "@/lib/tools";

export default function Footer() {
  const toolsByCategory = {
    organize: tools.filter((t) => t.category === "organize"),
    convert: tools.filter((t) => t.category === "convert"),
    edit: tools.filter((t) => t.category === "edit"),
    other: tools.filter((t) => ["optimize", "security", "intelligence"].includes(t.category)),
  };

  return (
    <footer className="bg-secondary text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-sm mb-3">Organize PDF</h3>
            <ul className="space-y-1.5">
              {toolsByCategory.organize.map((t) => (
                <li key={t.slug}>
                  <Link href={t.available ? `/${t.slug}` : "#"} className="text-sm hover:text-white transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm mb-3">Convert PDF</h3>
            <ul className="space-y-1.5">
              {toolsByCategory.convert.slice(0, 8).map((t) => (
                <li key={t.slug}>
                  <Link href={t.available ? `/${t.slug}` : "#"} className="text-sm hover:text-white transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm mb-3">Edit PDF</h3>
            <ul className="space-y-1.5">
              {toolsByCategory.edit.map((t) => (
                <li key={t.slug}>
                  <Link href={t.available ? `/${t.slug}` : "#"} className="text-sm hover:text-white transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm mb-3">More Tools</h3>
            <ul className="space-y-1.5">
              {toolsByCategory.other.map((t) => (
                <li key={t.slug}>
                  <Link href={t.available ? `/${t.slug}` : "#"} className="text-sm hover:text-white transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} PDF Tools. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/api-docs" className="hover:text-white transition-colors">API</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
