"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Search,
  Filter,
  CheckCircle2,
  Building2,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  directoryApi,
  geographyApi,
  PublicDirectoryMember,
  GeographyHierarchy,
} from "@/lib/api";

export default function PublicDirectoryPage() {
  const [members, setMembers] = useState<PublicDirectoryMember[]>([]);
  const [hierarchy, setHierarchy] = useState<GeographyHierarchy | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("ALL");
  const [areaType, setAreaType] = useState("ALL");
  const [developmentBlock, setDevelopmentBlock] = useState("ALL");
  const [gramPanchayat, setGramPanchayat] = useState("ALL");
  const [localBody, setLocalBody] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [assemblyConstituency, setAssemblyConstituency] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // Load geography hierarchy once
  useEffect(() => {
    async function loadHierarchy() {
      try {
        const res = await geographyApi.getHierarchy();
        if (res.success && res.data) {
          setHierarchy(res.data);
        }
      } catch {
        // Hierarchy lookup failure is non-fatal
      }
    }
    loadHierarchy();
  }, []);

  // Fetch directory members
  const fetchMembers = useCallback(
    async (targetPage = 1) => {
      setLoading(true);
      try {
        const params: Record<string, string> = {
          page: String(targetPage),
          limit: "12",
        };

        if (search.trim()) params.search = search.trim();
        if (district !== "ALL") params.district = district;
        if (areaType !== "ALL") params.areaType = areaType;
        if (developmentBlock !== "ALL") params.developmentBlock = developmentBlock;
        if (gramPanchayat !== "ALL") params.gramPanchayat = gramPanchayat;
        if (localBody !== "ALL") params.localBody = localBody;
        if (category !== "ALL") params.category = category;
        if (assemblyConstituency !== "ALL") params.assemblyConstituency = assemblyConstituency;

        const res = await directoryApi.getDirectory(params);
        if (res.success && res.data) {
          setMembers(res.data.members || []);
          if (res.data.pagination) {
            setTotalPages(res.data.pagination.totalPages || 1);
            setTotalMembers(res.data.pagination.total || 0);
            setPage(res.data.pagination.page || 1);
          }
        }
      } catch {
        // Handle fetch error gracefully
      } finally {
        setLoading(false);
      }
    },
    [search, district, areaType, developmentBlock, gramPanchayat, localBody, category, assemblyConstituency]
  );

  useEffect(() => {
    fetchMembers(1);
  }, [fetchMembers]);

  const handleResetFilters = () => {
    setSearch("");
    setDistrict("ALL");
    setAreaType("ALL");
    setDevelopmentBlock("ALL");
    setGramPanchayat("ALL");
    setLocalBody("ALL");
    setCategory("ALL");
    setAssemblyConstituency("ALL");
  };

  const hasActiveFilters =
    search ||
    district !== "ALL" ||
    areaType !== "ALL" ||
    developmentBlock !== "ALL" ||
    gramPanchayat !== "ALL" ||
    localBody !== "ALL" ||
    category !== "ALL" ||
    assemblyConstituency !== "ALL";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <div className="bg-linear-to-b from-orange-600 via-orange-500 to-amber-500 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold text-orange-100">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>प्रमाणित एवं सत्यापित नागरिक निर्देशिका</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              सार्वजनिक जनप्रतिनिधि एवं प्रशासनिक निर्देशिका
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-orange-100">
              मध्य प्रदेश के अपने सांसद, विधायक, महापौर, पार्षद, सरपंच एवं प्रशासनिक अधिकारियों से सीधे संपर्क करें।
            </p>

            {/* Quick Search Input */}
            <div className="max-w-2xl mx-auto pt-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="नाम, पदनाम, विभाग, ज़िला या पंचायत से खोजें..."
                  className="w-full pl-12 pr-4 py-3.5 text-sm sm:text-base rounded-2xl bg-white text-slate-800 shadow-xl focus:outline-hidden focus:ring-4 focus:ring-orange-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Directory Controls & Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-colors ${
                    showFilters || hasActiveFilters
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>भौगोलिक एवं पद फ़िल्टर</span>
                </button>

                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>रीसेट</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="font-bold text-slate-800 bg-orange-100 text-orange-800 px-3 py-1 rounded-full border border-orange-200">
                  {totalMembers} जनसेवक उपलब्ध
                </span>
              </div>
            </div>

            {/* Expandable Cascading Filters */}
            {showFilters && (
              <div className="pt-4 mt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs animate-in fade-in">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">ज़िला (District)</label>
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setDevelopmentBlock("ALL");
                      setGramPanchayat("ALL");
                      setLocalBody("ALL");
                    }}
                    className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ALL">सभी ज़िले</option>
                    {hierarchy?.districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">क्षेत्र (Area Type)</label>
                  <select
                    value={areaType}
                    onChange={(e) => setAreaType(e.target.value)}
                    className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ALL">समस्त क्षेत्र</option>
                    <option value="RURAL">ग्रामीण (Rural)</option>
                    <option value="URBAN">शहरी (Urban)</option>
                  </select>
                </div>

                {areaType !== "URBAN" && (
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">ब्लॉक (Block)</label>
                    <select
                      value={developmentBlock}
                      onChange={(e) => setDevelopmentBlock(e.target.value)}
                      className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="ALL">सभी ब्लॉक</option>
                      {hierarchy?.rural.developmentBlocks.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {areaType !== "RURAL" && (
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">शहरी निकाय (Local Body)</label>
                    <select
                      value={localBody}
                      onChange={(e) => setLocalBody(e.target.value)}
                      className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="ALL">सभी निकाय</option>
                      {hierarchy?.urban.localBodies.map((lb) => (
                        <option key={lb} value={lb}>
                          {lb}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">पद श्रेणी (Category)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ALL">सभी श्रेणियां</option>
                    <option value="POLITICAL">राजनीतिक प्रतिनिधि</option>
                    <option value="ORGANIZATIONAL">संगठनात्मक पदाधिकारी</option>
                    <option value="ADMINISTRATIVE">प्रशासनिक अधिकारी</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">विधानसभा (Constituency)</label>
                  <select
                    value={assemblyConstituency}
                    onChange={(e) => setAssemblyConstituency(e.target.value)}
                    className="w-full py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ALL">सभी विधानसभा</option>
                    {hierarchy?.assemblyConstituencies.map((ac) => (
                      <option key={ac} value={ac}>
                        {ac}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Members Grid */}
          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">जनप्रतिनिधि निर्देशिका लोड हो रही है...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 py-16 px-4 text-center space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">कोई प्रतिनिधि नहीं मिला</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                चयनित फ़िल्टर के अनुसार कोई सत्यापित जनप्रतिनिधि या अधिकारी उपलब्ध नहीं है। कृपया फ़िल्टर बदलें।
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl border border-orange-200 transition-colors"
                >
                  फ़िल्टर रीसेट करें
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-200 hover:border-orange-300 transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Photo + Name + Badge */}
                    <div className="flex items-start gap-3.5 mb-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-orange-100 to-amber-200 border-2 border-orange-300 flex items-center justify-center font-bold text-orange-800 text-lg shrink-0 shadow-2xs">
                        {member.fullName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              member.designationCategory === "POLITICAL"
                                ? "bg-orange-100 text-orange-800 border border-orange-200"
                                : member.designationCategory === "ADMINISTRATIVE"
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                            }`}
                          >
                            {member.designationCategory}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            सत्यापित
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                          {member.fullName}
                        </h3>
                        <p className="text-xs font-semibold text-orange-600 mt-0.5">
                          {member.designation || "जनप्रतिनिधि"}
                        </p>
                      </div>
                    </div>

                    {/* Department / Entity */}
                    {member.department && (
                      <div className="mb-3 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{member.department}</span>
                      </div>
                    )}

                    {/* Location Information */}
                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      {member.district && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            ज़िला: <strong>{member.district}</strong>
                            {member.assemblyConstituency ? ` | वि.स.: ${member.assemblyConstituency}` : ""}
                          </span>
                        </div>
                      )}

                      {(member.developmentBlock || member.localBody) && (
                        <div className="flex items-center gap-2 pl-5.5 text-slate-500 text-[11px]">
                          {member.developmentBlock && <span>ब्लॉक: {member.developmentBlock}</span>}
                          {member.gramPanchayat && <span>• पं.: {member.gramPanchayat}</span>}
                          {member.localBody && <span>निकाय: {member.localBody}</span>}
                          {member.wardNumber && <span>• वार्ड: {member.wardNumber}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact / Office Footer */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    {member.officeContact && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-mono">{member.officeContact}</span>
                      </div>
                    )}

                    {member.officialEmail && (
                      <div className="flex items-center gap-2 text-slate-700 truncate">
                        <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate font-mono text-[11px]">{member.officialEmail}</span>
                      </div>
                    )}

                    {member.officeAddress && (
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        पता: {member.officeAddress}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => fetchMembers(page - 1)}
                className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>पिछला</span>
              </button>

              <span className="text-xs font-bold text-slate-600 px-3">
                पृष्ठ {page} / {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => fetchMembers(page + 1)}
                className="flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40"
              >
                <span>अगला</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
