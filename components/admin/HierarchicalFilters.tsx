"use client";

import { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp, RotateCcw, Search, CheckCircle2 } from "lucide-react";
import { GeographyHierarchy, DesignationItem, DepartmentItem } from "@/lib/api";

export interface FilterState {
  search: string;
  role: string;
  status: string;
  verificationStatus: string;
  isPublicDirectoryVisible: string;
  // Geography
  state: string;
  district: string;
  areaType: string;
  tehsil: string;
  developmentBlock: string;
  gramPanchayat: string;
  village: string;
  localBodyType: string;
  localBody: string;
  wardNumber: string;
  assemblyConstituency: string;
  parliamentaryConstituency: string;
  // Professional
  designationCategory: string;
  designation: string;
  department: string;
  // Missing Info
  designationStatus: string;
  locationStatus: string;
}

export const initialFilterState: FilterState = {
  search: "",
  role: "ALL",
  status: "ALL",
  verificationStatus: "ALL",
  isPublicDirectoryVisible: "ALL",
  state: "Madhya Pradesh",
  district: "ALL",
  areaType: "ALL",
  tehsil: "ALL",
  developmentBlock: "ALL",
  gramPanchayat: "ALL",
  village: "ALL",
  localBodyType: "ALL",
  localBody: "ALL",
  wardNumber: "ALL",
  assemblyConstituency: "ALL",
  parliamentaryConstituency: "ALL",
  designationCategory: "ALL",
  designation: "ALL",
  department: "ALL",
  designationStatus: "ALL",
  locationStatus: "ALL",
};

interface HierarchicalFiltersProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  hierarchy: GeographyHierarchy | null;
  designations: DesignationItem[];
  departments: DepartmentItem[];
  totalMatches: number;
  loading?: boolean;
}

export default function HierarchicalFilters({
  filters,
  onFilterChange,
  onReset,
  hierarchy,
  designations,
  departments,
  totalMatches,
  loading = false,
}: HierarchicalFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Derive active chips
  const activeChips: Array<{ key: keyof FilterState; label: string; value: string }> = [];

  if (filters.role !== "ALL") activeChips.push({ key: "role", label: "भूमिका", value: filters.role });
  if (filters.status !== "ALL") activeChips.push({ key: "status", label: "स्थिति", value: filters.status });
  if (filters.verificationStatus !== "ALL") activeChips.push({ key: "verificationStatus", label: "सत्यापन", value: filters.verificationStatus });
  if (filters.district !== "ALL") activeChips.push({ key: "district", label: "ज़िला", value: filters.district });
  if (filters.areaType !== "ALL") activeChips.push({ key: "areaType", label: "क्षेत्र", value: filters.areaType === "RURAL" ? "ग्रामीण" : "शहरी" });
  if (filters.developmentBlock !== "ALL") activeChips.push({ key: "developmentBlock", label: "ब्लॉक", value: filters.developmentBlock });
  if (filters.gramPanchayat !== "ALL") activeChips.push({ key: "gramPanchayat", label: "पंचायत", value: filters.gramPanchayat });
  if (filters.localBody !== "ALL") activeChips.push({ key: "localBody", label: "निकाय", value: filters.localBody });
  if (filters.wardNumber !== "ALL") activeChips.push({ key: "wardNumber", label: "वार्ड", value: filters.wardNumber });
  if (filters.assemblyConstituency !== "ALL") activeChips.push({ key: "assemblyConstituency", label: "विधानसभा", value: filters.assemblyConstituency });
  if (filters.designationCategory !== "ALL") activeChips.push({ key: "designationCategory", label: "पद श्रेणी", value: filters.designationCategory });
  if (filters.designation !== "ALL") activeChips.push({ key: "designation", label: "पदनाम", value: filters.designation });
  if (filters.department !== "ALL") activeChips.push({ key: "department", label: "विभाग", value: filters.department });
  if (filters.designationStatus !== "ALL") {
    activeChips.push({
      key: "designationStatus",
      label: "पद स्थिति",
      value: filters.designationStatus === "ASSIGNED" ? "पद आवंटित" : "पद रिक्त",
    });
  }
  if (filters.locationStatus !== "ALL") {
    activeChips.push({
      key: "locationStatus",
      label: "स्थान स्थिति",
      value: filters.locationStatus === "COMPLETE" ? "स्थान पूर्ण" : filters.locationStatus === "INCOMPLETE" ? "स्थान अधूरा" : "स्थान रिक्त",
    });
  }

  // Filtered designations based on category
  const filteredDesignations = designations.filter((d) => {
    if (filters.designationCategory !== "ALL" && d.category !== filters.designationCategory) return false;
    return d.isActive;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 transition-all">
      {/* Top Bar: Search + Quick Filters + Expand Toggle */}
      <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 border-b border-slate-200">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              placeholder="नाम, मोबाइल, पद, जिला, पंचायत या वार्ड खोजें..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: "" })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <select
              value={filters.district}
              onChange={(e) => onFilterChange({ district: e.target.value })}
              className="text-xs py-2 px-3 border border-slate-300 rounded-lg bg-white font-medium text-slate-700 focus:ring-orange-500"
            >
              <option value="ALL">सभी ज़िले (All Districts)</option>
              {hierarchy?.districts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>

            <select
              value={filters.verificationStatus}
              onChange={(e) => onFilterChange({ verificationStatus: e.target.value })}
              className="text-xs py-2 px-3 border border-slate-300 rounded-lg bg-white font-medium text-slate-700 focus:ring-orange-500"
            >
              <option value="ALL">सभी सत्यापन स्थिति</option>
              <option value="VERIFIED">सत्यापित (Verified)</option>
              <option value="UNVERIFIED">असत्यापित (Unverified)</option>
              <option value="FLAGGED">जांच लंबित (Flagged)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
            {loading ? "लोड हो रहा है..." : `${totalMatches.toLocaleString("en-IN")} सदस्य`}
          </span>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              isExpanded || activeChips.length > 0
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>उन्नत फ़िल्टर</span>
            {activeChips.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-orange-600 text-[10px] font-bold">
                {activeChips.length}
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {activeChips.length > 0 && (
            <button
              onClick={onReset}
              title="सभी फिल्टर हटाएं"
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">रीसेट</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium mr-1">सक्रिय फ़िल्टर:</span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-slate-300 text-slate-800 shadow-2xs"
            >
              <span className="text-slate-500 text-[11px]">{chip.label}:</span>
              <span className="font-semibold">{chip.value}</span>
              <button
                onClick={() => onFilterChange({ [chip.key]: "ALL" })}
                className="hover:text-red-600 transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={onReset}
            className="text-[11px] text-red-600 font-semibold hover:underline ml-2"
          >
            सभी हटाएं (Clear All)
          </button>
        </div>
      )}

      {/* Collapsible Cascading Filters Panel */}
      {isExpanded && (
        <div className="p-4 bg-slate-50/50 space-y-4">
          {/* Section 1: Geographical Hierarchy */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              भौगोलिक पदानुक्रम (Geographical Hierarchy)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">ज़िला (District)</label>
                <select
                  value={filters.district}
                  onChange={(e) =>
                    onFilterChange({
                      district: e.target.value,
                      developmentBlock: "ALL",
                      gramPanchayat: "ALL",
                      village: "ALL",
                      localBody: "ALL",
                      wardNumber: "ALL",
                    })
                  }
                  className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
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
                <label className="block text-slate-600 font-medium mb-1">क्षेत्र प्रकार (Area Type)</label>
                <select
                  value={filters.areaType}
                  onChange={(e) => onFilterChange({ areaType: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="ALL">सभी क्षेत्र</option>
                  <option value="RURAL">ग्रामीण (Rural)</option>
                  <option value="URBAN">शहरी (Urban)</option>
                </select>
              </div>

              {/* Rural Specific */}
              {filters.areaType !== "URBAN" && (
                <>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">विकासखंड (Block)</label>
                    <select
                      value={filters.developmentBlock}
                      onChange={(e) => onFilterChange({ developmentBlock: e.target.value })}
                      className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                    >
                      <option value="ALL">सभी ब्लॉक</option>
                      {hierarchy?.rural.developmentBlocks.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">ग्राम पंचायत (GP)</label>
                    <select
                      value={filters.gramPanchayat}
                      onChange={(e) => onFilterChange({ gramPanchayat: e.target.value })}
                      className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                    >
                      <option value="ALL">सभी पंचायतें</option>
                      {hierarchy?.rural.gramPanchayats.map((gp) => (
                        <option key={gp} value={gp}>
                          {gp}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Urban Specific */}
              {filters.areaType !== "RURAL" && (
                <>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">शहरी निकाय (Local Body)</label>
                    <select
                      value={filters.localBody}
                      onChange={(e) => onFilterChange({ localBody: e.target.value })}
                      className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                    >
                      <option value="ALL">सभी निकाय</option>
                      {hierarchy?.urban.localBodies.map((lb) => (
                        <option key={lb} value={lb}>
                          {lb}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">वार्ड नंबर (Ward No)</label>
                    <select
                      value={filters.wardNumber}
                      onChange={(e) => onFilterChange({ wardNumber: e.target.value })}
                      className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                    >
                      <option value="ALL">सभी वार्ड</option>
                      {hierarchy?.urban.wards.map((w) => (
                        <option key={w.wardNumber} value={w.wardNumber}>
                          वार्ड {w.wardNumber} {w.wardName ? `(${w.wardName})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-slate-600 font-medium mb-1">विधानसभा (Constituency)</label>
                <select
                  value={filters.assemblyConstituency}
                  onChange={(e) => onFilterChange({ assemblyConstituency: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="ALL">सभी विधानसभा</option>
                  {hierarchy?.assemblyConstituencies.map((ac) => (
                    <option key={ac} value={ac}>
                      {ac}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">लोकसभा (Parliamentary)</label>
                <select
                  value={filters.parliamentaryConstituency}
                  onChange={(e) => onFilterChange({ parliamentaryConstituency: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="ALL">सभी लोकसभा</option>
                  {hierarchy?.parliamentaryConstituencies.map((pc) => (
                    <option key={pc} value={pc}>
                      {pc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Professional & Designation */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              पद एवं विभाग (Designation & Department)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">पद श्रेणी (Category)</label>
                <select
                  value={filters.designationCategory}
                  onChange={(e) =>
                    onFilterChange({
                      designationCategory: e.target.value,
                      designation: "ALL",
                    })
                  }
                  className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="ALL">सभी श्रेणियां</option>
                  <option value="POLITICAL">राजनीतिक (Political)</option>
                  <option value="ORGANIZATIONAL">संगठनात्मक (Organizational)</option>
                  <option value="ADMINISTRATIVE">प्रशासनिक (Administrative)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">विशिष्ट पदनाम (Designation)</label>
                <select
                  value={filters.designation}
                  onChange={(e) => onFilterChange({ designation: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="ALL">सभी पदनाम</option>
                  {filteredDesignations.map((d) => (
                    <option key={d._id} value={d.title}>
                      {d.title} {d.titleHi ? `(${d.titleHi})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">विभाग (Department)</label>
                <select
                  value={filters.department}
                  onChange={(e) => onFilterChange({ department: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="ALL">सभी विभाग</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept.name}>
                      {dept.name} {dept.nameHi ? `(${dept.nameHi})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">पद आवंटन स्थिति</label>
                <select
                  value={filters.designationStatus}
                  onChange={(e) => onFilterChange({ designationStatus: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="ALL">सभी सदस्य</option>
                  <option value="ASSIGNED">पद आवंटित (Designation Assigned)</option>
                  <option value="NOT_ASSIGNED">बिना पद वाले (No Designation)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Status, Missing Info & Verification */}
          <div className="pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              खाता, स्थान पूर्णता एवं सत्यापन (Account & Completeness)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">स्थान पूर्णता (Location Completeness)</label>
                <select
                  value={filters.locationStatus}
                  onChange={(e) => onFilterChange({ locationStatus: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="ALL">सभी स्थिति</option>
                  <option value="COMPLETE">पूर्ण स्थान (District + Block/ULB)</option>
                  <option value="INCOMPLETE">अधूरा स्थान (Incomplete)</option>
                  <option value="NOT_ASSIGNED">स्थान रिक्त (No Location)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">भूमिका (Account Role)</label>
                <select
                  value={filters.role}
                  onChange={(e) => onFilterChange({ role: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="ALL">सभी भूमिकाएं</option>
                  <option value="CITIZEN">नागरिक (CITIZEN)</option>
                  <option value="BOOTH_WORKER">बूथ कार्यकर्ता (BOOTH_WORKER)</option>
                  <option value="PA_STAFF">पीए स्टाफ (PA_STAFF)</option>
                  <option value="POLITICIAN">जनप्रतिनिधि (POLITICIAN)</option>
                  <option value="SUPER_ADMIN">सुपर एडमिन (SUPER_ADMIN)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">सत्यापन स्थिति (Verification)</label>
                <select
                  value={filters.verificationStatus}
                  onChange={(e) => onFilterChange({ verificationStatus: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="ALL">सभी स्थितियां</option>
                  <option value="VERIFIED">सत्यापित (Verified)</option>
                  <option value="UNVERIFIED">असत्यापित (Unverified)</option>
                  <option value="FLAGGED">जांच लंबित (Flagged)</option>
                  <option value="REJECTED">अस्वीकृत (Rejected)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">खाता स्थिति (Account Status)</label>
                <select
                  value={filters.status}
                  onChange={(e) => onFilterChange({ status: e.target.value })}
                  className="w-full py-1.5 px-2.5 border border-slate-300 rounded bg-white text-slate-800"
                >
                  <option value="ALL">सभी स्थितियां</option>
                  <option value="ACTIVE">सक्रिय (Active)</option>
                  <option value="SUSPENDED">निलंबित (Suspended)</option>
                  <option value="DEACTIVATED">निष्क्रिय (Deactivated)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
