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
    <footer className="bg-[#1a1a2e] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Organize PDF</h3>
            <ul className="space-y-2">
              {toolsByCategory.organize.map((t) => (
                <li key={t.slug}>
                  <Link href={t.available ? `/${t.slug}` : "#"} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Convert PDF</h3>
            <ul className="space-y-2">
              {toolsByCategory.convert.slice(0, 8).map((t) => (
                <li key={t.slug}>
                  <Link href={t.available ? `/${t.slug}` : "#"} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Edit PDF</h3>
            <ul className="space-y-2">
              {toolsByCategory.edit.map((t) => (
                <li key={t.slug}>
                  <Link href={t.available ? `/${t.slug}` : "#"} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">More Tools</h3>
            <ul className="space-y-2">
              {toolsByCategory.other.map((t) => (
                <li key={t.slug}>
                  <Link href={t.available ? `/${t.slug}` : "#"} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="text-white font-semibold text-sm mt-6 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/api-docs" className="text-sm text-gray-400 hover:text-white transition-colors">API</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} PDF Tools Online. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
