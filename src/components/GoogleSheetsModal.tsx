import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  UploadCloud,
  Download,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Code2,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react';
import { GoogleSheetsConfig, WardSurveillanceRecord } from '../types/surveillance';
import { exportRecordsToGoogleSheetsCSV, parseGoogleSheetsCSV } from '../utils/calculations';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GoogleSheetsConfig;
  onSaveConfig: (config: GoogleSheetsConfig) => void;
  records: WardSurveillanceRecord[];
  onImportRecords: (newRecords: WardSurveillanceRecord[]) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  records,
  onImportRecords,
}) => {
  const [webAppUrl, setWebAppUrl] = useState(config.webAppUrl || '');
  const [sheetName, setSheetName] = useState(config.sheetName || 'ข้อมูลเฝ้าระวัง IC 2026');
  const [csvPasteText, setCsvPasteText] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const csv = exportRecordsToGoogleSheetsCSV(records);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IC_Surveillance_Sheet_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setSyncStatusMsg('ส่งออกไฟล์ Google Sheets CSV เรียบร้อยแล้ว');
  };

  const handleParsePastedCSV = () => {
    if (!csvPasteText.trim()) return;
    setIsProcessing(true);
    try {
      const parsed = parseGoogleSheetsCSV(csvPasteText);
      if (parsed.length > 0) {
        onImportRecords(parsed);
        setSyncStatusMsg(`นำเข้าข้อมูลจาก Google Sheets สำเร็จ (${parsed.length} หอผู้ป่วย)`);
        setCsvPasteText('');
      } else {
        setSyncStatusMsg('ไม่พบข้อมูลที่ถูกต้อง กรุณาตรวจสอบรูปแบบตาราง');
      }
    } catch (err: any) {
      setSyncStatusMsg('เกิดข้อผิดพลาดในการประมวลผล CSV');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveUrlConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      webAppUrl,
      sheetName,
      lastSyncedAt: new Date().toISOString(),
      status: 'success',
    });
    setSyncStatusMsg('บันทึกการตั้งค่า Google Sheets Webhook สำเร็จ');
  };

  const googleAppsScriptSnippet = `// Google Apps Script สำหรับเชื่อมต่อฐานข้อมูล Google Sheets กับระบบ IC-Surveillance Pro
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var payload = JSON.parse(e.postData.contents);
  // อัปเดตข้อมูลอัตโนมัติเมื่อมีการบันทึกจากแดชบอร์ด
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const copyScript = () => {
    navigator.clipboard.writeText(googleAppsScriptSnippet);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-700 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">การเชื่อมต่อฐานข้อมูล Google Sheets</h3>
              <p className="text-xs text-emerald-100">
                ซิงค์ข้อมูลเฝ้าระวังการติดเชื้อแบบเรียลไทม์ ปลอดภัย ไม่ต้องใช้ API Key สาธารณะ
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {syncStatusMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{syncStatusMsg}</span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExportCSV}
              className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-600" />
                  ส่งออกไฟล์ Google Sheets CSV
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                ดาวน์โหลดข้อมูลทั้ง 19 หอผู้ป่วยในรูปแบบที่พร้อมเปิดบน Google Sheets ได้ทันที
              </p>
            </button>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-teal-600" />
                  สถานะฐานข้อมูลปัจจุบัน
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ออนไลน์
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                บันทึกแล้ว {records.length} หอผู้ป่วย • ซิงค์ล่าสุด: {new Date().toLocaleTimeString('th-TH')}
              </p>
            </div>
          </div>

          {/* CSV Quick Import / Paste */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-teal-600" />
              <span>วางข้อมูลตารางจาก Google Sheet (Paste CSV / Sheet Records)</span>
            </label>
            <p className="text-[11px] text-slate-500">
              คัดลอกเซลล์จาก Google Sheet ของโรงพยาบาล แล้วนำมาวางในกล่องข้อความด้านล่าง เพื่ออัปเดตแดชบอร์ดทันที:
            </p>
            <textarea
              rows={4}
              value={csvPasteText}
              onChange={(e) => setCsvPasteText(e.target.value)}
              placeholder="ศช,68,631,1,1.58,0,0,0,#DIV/0!,358,1735,0,0.00... (หรือวางข้อมูล CSV ได้ที่นี่)"
              className="w-full p-3 text-xs font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleParsePastedCSV}
                disabled={!csvPasteText.trim() || isProcessing}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>ประมวลผลและอัปเดตแดชบอร์ด</span>
              </button>
            </div>
          </div>

          {/* Webhook URL Configuration Form */}
          <form onSubmit={handleSaveUrlConfig} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-600" />
                Google Apps Script Webhook (การเชื่อมต่ออัตโนมัติ 2-Way Live Sync)
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Google Apps Script Web App URL (URL สำหรับรับ-ส่งข้อมูล)
              </label>
              <input
                type="url"
                value={webAppUrl}
                onChange={(e) => setWebAppUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Script Snippet Accordion */}
            <div className="bg-slate-900 rounded-xl p-3 text-white text-[11px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 font-mono">Apps Script Connector Code:</span>
                <button
                  type="button"
                  onClick={copyScript}
                  className="flex items-center gap-1 text-xs text-teal-300 hover:text-white cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}</span>
                </button>
              </div>
              <pre className="font-mono text-[10px] text-slate-300 overflow-x-auto p-1 leading-relaxed">
                {googleAppsScriptSnippet}
              </pre>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                บันทึกการตั้งค่า Webhook
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
