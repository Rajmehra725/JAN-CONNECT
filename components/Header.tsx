"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Building2,
  ChevronDown,
  LogIn,
  LogOut,
  Menu,
  X,
  UserPlus,
  FileText,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Languages,
  User,
  LayoutDashboard,
} from "lucide-react";
import { useAuth, getDashboardPath } from "@/lib/auth-context";

const NAV_ITEMS = [
  { href: "/", label: "होम", labelEn: "Home" },
  { href: "/about", label: "हमारे बारे में", labelEn: "About" },
  { href: "/services", label: "सेवाएँ", labelEn: "Services" },
  { href: "/schemes", label: "योजनाएँ", labelEn: "Schemes" },
  { href: "/notices", label: "सूचनाएँ", labelEn: "Notices" },
  { href: "/contact", label: "संपर्क", labelEn: "Contact" },
];

const LOGIN_ROLES = [
  {
    title: "नागरिक लॉगिन",
    titleEn: "Citizen Login",
    desc: "मोबाइल नंबर और पासवर्ड के माध्यम से प्रवेश",
    href: "/login/citizen",
    icon: UserPlus,
    color: "bg-blue-100 text-blue-900 border-blue-200",
  },
  {
    title: "जनप्रतिनिधि लॉगिन",
    titleEn: "Politician Login",
    desc: "अधिकृत प्रतिनिधि खाता",
    href: "/login/politician",
    icon: Building2,
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    title: "PA / कार्यालय स्टाफ",
    titleEn: "Office Staff",
    desc: "कार्यालय प्रबंधन एवं समन्वय खाता",
    href: "/login/staff",
    icon: FileText,
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    title: "बूथ कार्यकर्ता",
    titleEn: "Booth Worker",
    desc: "निर्धारित बूथ स्तर कार्यकर्ता खाता",
    href: "/login/booth-worker",
    icon: MapPin,
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
];

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLoginDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-800">सुपर एडमिन</span>;
      case "POLITICIAN":
        return <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-800">जनप्रतिनिधि</span>;
      case "PA_STAFF":
        return <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-800">स्टाफ</span>;
      case "BOOTH_WORKER":
        return <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">बूथ कार्यकर्ता</span>;
      case "CITIZEN":
      default:
        return <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800">नागरिक</span>;
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-slate-900 text-slate-200 text-xs sm:text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="font-medium truncate">
              जन कनेक्ट — नागरिक सेवा एवं संपर्क पोर्टल
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline text-slate-400">भाषा / Language:</span>
            <div className="inline-flex items-center gap-1.5 rounded bg-slate-800/80 px-2 py-1 text-slate-300">
              <Languages size={13} className="text-orange-400" />
              <span className="font-semibold text-white">हिंदी</span>
              <span className="text-slate-500">|</span>
              <span className="hover:text-white cursor-pointer transition">English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-900 text-white shadow-sm transition group-hover:bg-blue-800">
              <ShieldCheck size={24} className="text-orange-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-blue-900">
                  JAN CONNECT
                </span>
                <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-700">
                  नागरिक मंच
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Citizen Connectivity & Public Service Portal
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="मुख्य नेविगेशन">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3.5 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-blue-50 text-blue-900 font-bold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-blue-900"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="ml-1 text-[11px] font-normal text-slate-400">
                    ({item.labelEn})
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden items-center gap-3 sm:flex">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50">
                  <User size={15} className="text-slate-600" />
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                    {user.fullName}
                  </span>
                  {getRoleBadge(user.role)}
                </div>

                <Link
                  href={getDashboardPath(user.role)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800"
                >
                  <LayoutDashboard size={14} />
                  <span>डैशबोर्ड</span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                  title="लॉगआउट करें"
                >
                  <LogOut size={14} className="text-rose-600" />
                  <span>लॉगआउट</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 rounded-md border border-orange-600 bg-orange-600 px-3.5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-orange-700"
                >
                  <UserPlus size={16} />
                  <span>पंजीकरण</span>
                </Link>

                {/* Login Role Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <div className="inline-flex rounded-md shadow-xs">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-2 rounded-l-md bg-blue-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                    >
                      <LogIn size={16} />
                      <span>लॉगिन</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                      aria-expanded={loginDropdownOpen}
                      className="inline-flex items-center rounded-r-md border-l border-blue-800 bg-blue-900 px-2 py-2 text-white hover:bg-blue-800"
                      title="पोर्टल चुनें"
                    >
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 ${
                          loginDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {loginDropdownOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                      <div className="border-b border-slate-100 px-3 py-2.5 flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          खाता प्रकार चुनें / Select Role
                        </p>
                        <Link
                          href="/login"
                          onClick={() => setLoginDropdownOpen(false)}
                          className="text-[11px] font-bold text-orange-600 hover:underline"
                        >
                          मुख्य लॉगिन →
                        </Link>
                      </div>

                      <div className="mt-1 space-y-1">
                        {LOGIN_ROLES.map((role) => {
                          const Icon = role.icon;
                          return (
                            <Link
                              key={role.href}
                              href={role.href}
                              onClick={() => setLoginDropdownOpen(false)}
                              className="flex items-start gap-3 rounded-md p-2.5 transition hover:bg-slate-50"
                            >
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${role.color}`}
                              >
                                <Icon size={18} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-bold text-slate-900">
                                    {role.title}
                                  </p>
                                  <ArrowRight size={13} className="text-slate-400" />
                                </div>
                                <p className="text-[11px] text-slate-500 truncate">
                                  {role.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {user ? (
              <Link
                href={getDashboardPath(user.role)}
                className="inline-flex items-center gap-1 rounded bg-blue-900 px-2.5 py-1.5 text-xs font-bold text-white"
              >
                <LayoutDashboard size={13} />
                <span>डैशबोर्ड</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1 rounded bg-blue-900 px-2.5 py-1.5 text-xs font-bold text-white"
              >
                <LogIn size={13} />
                <span>लॉगिन</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 focus:outline-hidden"
              aria-label="मेनू खोलें या बंद करें"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Responsive Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden animate-in fade-in">
            {user && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                  <p className="text-[10px] text-slate-500">+91 {user.mobileNumber}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getRoleBadge(user.role)}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                    title="लॉगआउट"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                नेविगेशन मेनू
              </p>
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${
                      active
                        ? "bg-blue-50 font-bold text-blue-900"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-slate-400">{item.labelEn}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile User / Auth Links */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href={getDashboardPath(user.role)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-900 py-2.5 text-sm font-bold text-white shadow-xs"
                  >
                    <LayoutDashboard size={16} />
                    <span>डैशबोर्ड खोलें</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <LogOut size={16} className="text-rose-600" />
                    <span>लॉगआउट करें</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-900 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-blue-800"
                  >
                    <LogIn size={16} />
                    <span>पोर्टल लॉगिन करें</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-orange-700"
                  >
                    <UserPlus size={16} />
                    <span>नया नागरिक पंजीकरण करें</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
