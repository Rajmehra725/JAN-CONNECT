"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Download,
  Loader2,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { usersApi } from "@/lib/api";

interface FlexibleImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (summary: { createdCount: number; updatedCount: number; skippedCount: number }) => void;
}

export default function FlexibleImportModal({
  isOpen,
  onClose,
  onSuccess,
}: FlexibleImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [previewData, setPreviewData] = useState<{
    headers: string[];
    detectedMapping: Record<string, string>;
    totalRows: number;
    validRows: number;
    duplicateInFileRows: number;
    existingInDbRows: number;
    invalidRows: number;
    preview: Array<{
      rowNumber: number;
      fullName: string;
      mobileNumber: string;
      rawMobile: string;
      role: string;
      designation?: string;
      district?: string;
      isValid: boolean;
      isDuplicateInFile: boolean;
      duplicateOfRow: number | null;
      isExistingInDb: boolean;
      existingRecord?: { fullName: string; role: string; accountStatus: string };
      errors: string[];
    }>;
    rows: Array<any>;
    errors: Array<{ rowNumber: number; name?: string; mobile?: string; reason: string }>;
  } | null>(null);

  const [importMode, setImportMode] = useState<"CREATE_NEW" | "UPDATE_EXISTING" | "CREATE_OR_UPDATE" | "SKIP_MATCHED">("CREATE_NEW");
  const [confirming, setConfirming] = useState(false);
  const [downloadingErrors, setDownloadingErrors] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewData(null);
      setErrorMsg("");
    }
  };

  const handleGeneratePreview = async () => {
    if (!file) {
      setErrorMsg("कृपया पहले एक एक्सेल (.xlsx, .xls) या .csv फाइल चुनें।");
      return;
    }

    setPreviewing(true);
    setErrorMsg("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await usersApi.previewImport(formData);
      if (res.success && res.data) {
        setPreviewData(res.data);
      } else {
        setErrorMsg(res.message || "एक्सेल पूर्वावलोकन तैयार करने में विफलता।");
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorMsg(e.message || "फ़ाइल अपलोड एवं पार्स करने में त्रुटि।");
    } finally {
      setPreviewing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewData || !previewData.rows) return;

    setConfirming(true);
    setErrorMsg("");
    try {
      const res = await usersApi.confirmImport({
        rows: previewData.rows,
        importMode,
      });

      if (res.success && res.data) {
        onSuccess({
          createdCount: res.data.createdCount || 0,
          updatedCount: res.data.updatedCount || 0,
          skippedCount: res.data.skippedCount || 0,
        });
        onClose();
      } else {
        setErrorMsg(res.message || "आयात निष्पादन विफल रहा।");
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setErrorMsg(e.message || "आयात में त्रुटि हुई।");
    } finally {
      setConfirming(false);
    }
  };

  const handleDownloadErrorReport = async () => {
    if (!previewData || !previewData.errors || previewData.errors.length === 0) return;
    setDownloadingErrors(true);
    try {
      await usersApi.downloadErrorReport(previewData.errors);
    } catch {
      setErrorMsg("त्रुटि रिपोर्ट डाउनलोड करने में असमर्थ।");
    } finally {
      setDownloadingErrors(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-linear-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/15 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">एक्सेल से सदस्य आयात (Bulk Member Import)</h3>
              <p className="text-xs text-orange-100">
                2-कॉलम (नाम + मोबाइल) या विस्तृत स्प्रेडशीट का समर्थन | 4 आयात मोड उपलब्ध
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: File Upload Box */}
          {!previewData && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-orange-50/30"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  {file ? file.name : "एक्सेल (.xlsx, .xls) या .csv फ़ाइल यहाँ खींचें अथवा क्लिक करें"}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  आपकी स्प्रेडशीट में केवल <strong>नाम</strong> और <strong>मोबाइल नंबर</strong> होना पर्याप्त है।
                  हिंदी और अंग्रेजी दोनों प्रारूप समर्थित हैं।
                </p>
                {file && (
                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    फ़ाइल चुनी गई: {(file.size / 1024).toFixed(1)} KB
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    सभी आयातित सदस्य डिफ़ॉल्ट रूप से <strong>CITIZEN</strong> भूमिका और सक्रिय स्थिति में पंजीकृत होंगे।
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => usersApi.downloadTemplate()}
                  className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold hover:underline shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  मानक टेम्पलेट डाउनलोड करें
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!file || previewing}
                  onClick={handleGeneratePreview}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-sm disabled:opacity-50 transition-colors"
                >
                  {previewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>फ़ाइल सत्यापित करें एवं पूर्वावलोकन देखें</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Preview & Metrics */}
          {previewData && (
            <div className="space-y-5 animate-in fade-in">
              {/* Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <div className="text-xl font-extrabold text-slate-800">{previewData.totalRows}</div>
                  <div className="text-[11px] font-semibold text-slate-500">कुल पंक्तियां (Total)</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xl font-extrabold text-emerald-700">{previewData.validRows}</div>
                  <div className="text-[11px] font-semibold text-emerald-700">वैध एवं नए (Valid New)</div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="text-xl font-extrabold text-amber-700">{previewData.existingInDbRows}</div>
                  <div className="text-[11px] font-semibold text-amber-700">DB में मौजूद (In DB)</div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="text-xl font-extrabold text-blue-700">{previewData.duplicateInFileRows}</div>
                  <div className="text-[11px] font-semibold text-blue-700">फाइल डुप्लीकेट</div>
                </div>

                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <div className="text-xl font-extrabold text-red-700">{previewData.invalidRows}</div>
                  <div className="text-[11px] font-semibold text-red-700">अमान्य (Invalid)</div>
                </div>
              </div>

              {/* Import Mode Selector */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  आयात मोड चयन (Select Import Mode)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      importMode === "CREATE_NEW"
                        ? "bg-orange-50 border-orange-500 text-orange-950 ring-1 ring-orange-500"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="CREATE_NEW"
                      checked={importMode === "CREATE_NEW"}
                      onChange={() => setImportMode("CREATE_NEW")}
                      className="mt-0.5 text-orange-600"
                    />
                    <div>
                      <span className="font-bold block">केवल नए बनाएं (Create New - अनुशंसित)</span>
                      <span className="text-[11px] text-slate-500 block">
                        केवल नए फोन नंबर पंजीकृत करें। डेटाबेस में पहले से मौजूद सदस्यों को छोड़ें।
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      importMode === "CREATE_OR_UPDATE"
                        ? "bg-orange-50 border-orange-500 text-orange-950 ring-1 ring-orange-500"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="CREATE_OR_UPDATE"
                      checked={importMode === "CREATE_OR_UPDATE"}
                      onChange={() => setImportMode("CREATE_OR_UPDATE")}
                      className="mt-0.5 text-orange-600"
                    />
                    <div>
                      <span className="font-bold block">नया बनाएं अथवा अपडेट करें (Create or Update)</span>
                      <span className="text-[11px] text-slate-500 block">
                        नए बनाएं और यदि फोन नंबर पहले से है तो उसका विवरण अद्यतित करें।
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      importMode === "UPDATE_EXISTING"
                        ? "bg-orange-50 border-orange-500 text-orange-950 ring-1 ring-orange-500"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="UPDATE_EXISTING"
                      checked={importMode === "UPDATE_EXISTING"}
                      onChange={() => setImportMode("UPDATE_EXISTING")}
                      className="mt-0.5 text-orange-600"
                    />
                    <div>
                      <span className="font-bold block">केवल मौजूदा अपडेट करें (Update Existing Only)</span>
                      <span className="text-[11px] text-slate-500 block">
                        केवल पहले से पंजीकृत सदस्यों की जानकारी अपडेट करें, नया कोई न बनाएं।
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-colors ${
                      importMode === "SKIP_MATCHED"
                        ? "bg-orange-50 border-orange-500 text-orange-950 ring-1 ring-orange-500"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="SKIP_MATCHED"
                      checked={importMode === "SKIP_MATCHED"}
                      onChange={() => setImportMode("SKIP_MATCHED")}
                      className="mt-0.5 text-orange-600"
                    />
                    <div>
                      <span className="font-bold block">सख्त स्किप (Strict Skip Matched)</span>
                      <span className="text-[11px] text-slate-500 block">
                        मौजूदा रिकॉर्ड्स को बिना किसी संशोधन के सुरक्षित रूप से छोड़ें।
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Preview Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">डेटा पूर्वावलोकन (प्रथम 30 पंक्तियां):</span>
                  {previewData.errors.length > 0 && (
                    <button
                      type="button"
                      disabled={downloadingErrors}
                      onClick={handleDownloadErrorReport}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{previewData.errors.length} त्रुटि/स्किप रिपोर्ट (.xlsx) डाउनलोड करें</span>
                    </button>
                  )}
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 uppercase font-semibold sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3">पंक्ति</th>
                        <th className="py-2.5 px-3">नाम (Name)</th>
                        <th className="py-2.5 px-3">मोबाइल (Mobile)</th>
                        <th className="py-2.5 px-3">पद / ज़िला</th>
                        <th className="py-2.5 px-3">स्थिति (Validation)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewData.preview.map((row) => (
                        <tr
                          key={row.rowNumber}
                          className={
                            !row.isValid
                              ? "bg-red-50/50"
                              : row.isExistingInDb
                              ? "bg-amber-50/40"
                              : "hover:bg-slate-50"
                          }
                        >
                          <td className="py-2 px-3 font-mono text-slate-500">#{row.rowNumber}</td>
                          <td className="py-2 px-3 font-medium text-slate-800">{row.fullName || "—"}</td>
                          <td className="py-2 px-3 font-mono text-slate-700">{row.mobileNumber}</td>
                          <td className="py-2 px-3 text-slate-500">
                            {row.designation || "—"} {row.district ? `(${row.district})` : ""}
                          </td>
                          <td className="py-2 px-3">
                            {row.isValid && !row.isExistingInDb && (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                <CheckCircle2 className="w-3 h-3" />
                                नया सदस्य (Valid)
                              </span>
                            )}
                            {row.isExistingInDb && (
                              <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                <AlertTriangle className="w-3 h-3" />
                                DB में पंजीकृत ({row.existingRecord?.fullName})
                              </span>
                            )}
                            {row.isDuplicateInFile && (
                              <span className="inline-flex items-center gap-1 text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                फाइल में दोहराया गया (#{row.duplicateOfRow})
                              </span>
                            )}
                            {!row.isValid && !row.isDuplicateInFile && (
                              <span className="inline-flex items-center gap-1 text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                                <AlertCircle className="w-3 h-3" />
                                {row.errors.join(", ")}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {previewData ? (
            <button
              type="button"
              onClick={() => {
                setPreviewData(null);
                setFile(null);
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>अन्य फ़ाइल चुनें</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-lg"
            >
              रद्द करें
            </button>

            {previewData && (
              <button
                type="button"
                disabled={confirming || (importMode === "CREATE_NEW" && previewData.validRows === 0)}
                onClick={handleConfirmImport}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors"
              >
                {confirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>
                  {importMode === "CREATE_NEW"
                    ? `${previewData.validRows} सदस्य सुरक्षित आयात करें`
                    : "आयात प्रक्रिया प्रारंभ करें"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
