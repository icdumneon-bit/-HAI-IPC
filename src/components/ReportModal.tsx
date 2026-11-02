import React from 'react';
import { X, Printer, Download, FileText, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WardSurveillanceRecord, UserProfile } from '../types/surveillance';
import { SurveillanceSummary } from '../utils/calculations';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: WardSurveillanceRecord[];
  summary: SurveillanceSummary;
  user: UserProfile | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  records,
  summary,
  user,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const highRiskWards = records.filter(
    (r) =>
      r.uvcClabsiRate >= 2.0 ||
      r.vapRate >= 2.0 ||
      r.utiRate >= 1.5 ||
      r.phlebitisRate >= 1.0 ||
      r.hospitalInfectionRate >= 2.0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-6 print:m-0 print:border-none print:shadow-none">
        {/* Top Action Bar (Hidden on print) */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base">รายงานสรุปผลการเฝ้าระวังการติดเชื้อในโรงพยาบาล (IC Monthly Report)</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์รายงาน (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 text-slate-800 font-['Sarabun',sans-serif]">
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              รายงานสรุปอุบัติการณ์และการเฝ้าระวังโรคติดเชื้อในโรงพยาบาล (HAI Surveillance Summary)
            </h1>
            <p className="text-sm font-semibold text-slate-700">
              คณะกรรมการควบคุมและป้องกันโรคติดเชื้อในโรงพยาบาล (Infection Control Committee)
            </p>
            <div className="flex justify-between items-center text-xs text-slate-500 pt-2">
              <span>งวดข้อมูล: ประจำเดือน ตุลาคม 2569</span>
              <span>วันที่พิมพ์รายงาน: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>ผู้จัดทำรายงาน: {user?.name || 'พว. สุภาพร พงษ์สวัสดิ์ (ICN)'}</span>
            </div>
          </div>

          {/* KPI Summary Grid */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 border border-slate-300 rounded-xl bg-slate-50">
              <div className="font-bold text-slate-600">CAUTI (สายสวนปัสสาวะ)</div>
              <div className="text-lg font-black text-slate-900 mt-1">{summary.overallUtiRate} ‰</div>
              <div className="text-[11px] text-slate-500">พบ {summary.totalUtiCases} ครั้ง / {summary.totalCatheterDays.toLocaleString()} วันคาสาย (เกณฑ์ &lt; 1.5)</div>
            </div>
            <div className="p-3 border border-slate-300 rounded-xl bg-slate-50">
              <div className="font-bold text-slate-600">VAP (เครื่องช่วยหายใจ)</div>
              <div className="text-lg font-black text-slate-900 mt-1">{summary.overallVapRate} ‰</div>
              <div className="text-[11px] text-slate-500">พบ {summary.totalVapCases} ครั้ง / {summary.totalVentilatorDays.toLocaleString()} วันครองเครื่อง (เกณฑ์ &lt; 2.0)</div>
            </div>
            <div className="p-3 border border-slate-300 rounded-xl bg-slate-50">
              <div className="font-bold text-slate-600">Phlebitis (หลอดเลือดดำอักเสบ)</div>
              <div className="text-lg font-black text-slate-900 mt-1">{summary.overallPhlebitisRate} ‰</div>
              <div className="text-[11px] text-slate-500">พบ {summary.totalPhlebitisCases} ครั้ง / {summary.totalIvDays.toLocaleString()} วันให้ IV (เกณฑ์ &lt; 1.0)</div>
            </div>
            <div className="p-3 border border-slate-300 rounded-xl bg-slate-50">
              <div className="font-bold text-slate-600">SSI (แผลผ่าตัด 01)</div>
              <div className="text-lg font-black text-slate-900 mt-1">{summary.overallSsiRate}%</div>
              <div className="text-[11px] text-slate-500">พบ {summary.totalSsiCases} ราย / {summary.totalSurgicalWounds.toLocaleString()} แผลผ่าตัด (เกณฑ์ &lt; 1.5%)</div>
            </div>
            <div className="p-3 border border-slate-300 rounded-xl bg-rose-50 border-rose-200">
              <div className="font-bold text-rose-800">CLABSI / UVC-BSI (สายสวนสะดือ)</div>
              <div className="text-lg font-black text-rose-700 mt-1">{summary.overallUvcClabsiRate} ‰</div>
              <div className="text-[11px] text-rose-600">พบ {summary.totalUvcClabsiCases} ครั้ง / {summary.totalUvcDays.toLocaleString()} วัน UVC (เกณฑ์ &lt; 2.0)</div>
            </div>
            <div className="p-3 border border-slate-300 rounded-xl bg-teal-50 border-teal-200">
              <div className="font-bold text-teal-800">ภาพรวมการติดเชื้อใน ร.พ. (HAI)</div>
              <div className="text-lg font-black text-teal-900 mt-1">{summary.overallHaiRate} ‰</div>
              <div className="text-[11px] text-teal-700">ติดเชื้อรวม {summary.totalInfections} ราย / {summary.totalPatientDays.toLocaleString()} วันนอน</div>
            </div>
          </div>

          {/* High Priority Wards Section */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-2">
              1. หอผู้ป่วยที่ตรวจพบอุบัติการณ์เกินเกณฑ์มาตรฐาน (Outbreak & High Alert Wards)
            </h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5">หอผู้ป่วย</th>
                    <th className="p-2.5">ประเภทการติดเชื้อ</th>
                    <th className="p-2.5 text-right">จำนวนเคส</th>
                    <th className="p-2.5 text-right">อัตราที่คำนวณได้</th>
                    <th className="p-2.5">เกณฑ์มาตรฐาน</th>
                    <th className="p-2.5">มาตรการแก้ไขเร่งด่วน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-rose-50/50">
                    <td className="p-2.5 font-bold">NICU</td>
                    <td className="p-2.5 text-rose-700 font-semibold">UVC-BSI (สายสะดือ)</td>
                    <td className="p-2.5 text-right font-bold text-rose-700">4 ราย</td>
                    <td className="p-2.5 text-right font-black text-rose-700">14.98 ‰</td>
                    <td className="p-2.5">&lt; 2.0 ‰</td>
                    <td className="p-2.5 text-slate-600">ทบทวนเทคนิค Maximal Sterile Barrier และ Scrub the Hub 15 วิ</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td className="p-2.5 font-bold">อญ (อายุรกรรมหญิง)</td>
                    <td className="p-2.5 text-amber-800 font-semibold">VAP (เครื่องช่วยหายใจ)</td>
                    <td className="p-2.5 text-right font-bold">3 ราย</td>
                    <td className="p-2.5 text-right font-black text-amber-800">4.97 ‰</td>
                    <td className="p-2.5">&lt; 2.0 ‰</td>
                    <td className="p-2.5 text-slate-600">เน้นย้ำยกหัวเตียง 30-45° และการแปรงฟันด้วย 0.12% Chlorhexidine</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">ICU</td>
                    <td className="p-2.5 text-indigo-800 font-semibold">Phlebitis (หลอดเลือดดำ)</td>
                    <td className="p-2.5 text-right font-bold">2 ราย</td>
                    <td className="p-2.5 text-right font-black text-indigo-800">1.19 ‰</td>
                    <td className="p-2.5">&lt; 1.0 ‰</td>
                    <td className="p-2.5 text-slate-600">ประเมินคะแนน VIP Score ทุกเวร และเปลี่ยนตำแหน่งแทงเข็มเมื่อปวด/บวม</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures Row */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div className="space-y-8">
              <p className="font-semibold text-slate-700">ลงชื่อ............................................................</p>
              <p>({user?.name || 'พว. สุภาพร พงษ์สวัสดิ์'})<br />พยาบาลควบคุมการติดเชื้อในโรงพยาบาล (ICN)</p>
            </div>
            <div className="space-y-8">
              <p className="font-semibold text-slate-700">ลงชื่อ............................................................</p>
              <p>(นพ. ประธานคณะกรรมการ IC)<br />ประธานคณะกรรมการควบคุมการติดเชื้อในโรงพยาบาล</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
