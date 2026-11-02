import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Bed,
  Stethoscope,
  HeartPulse,
  Syringe,
  Scissors,
  Droplets,
  AlertOctagon,
  ArrowRight,
} from 'lucide-react';
import { WardSurveillanceRecord, SurveillanceAlert } from '../types/surveillance';
import { SurveillanceSummary, safeRate } from '../utils/calculations';

interface DashboardOverviewProps {
  records: WardSurveillanceRecord[];
  summary: SurveillanceSummary;
  alerts: SurveillanceAlert[];
  onSelectWard: (ward: string) => void;
  onNavigateToAlerts: () => void;
  onNavigateToTable: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  records,
  summary,
  alerts,
  onSelectWard,
  onNavigateToAlerts,
  onNavigateToTable,
}) => {
  // Find wards with infections
  const wardsWithInfections = records.filter(
    (r) =>
      r.totalInfections > 0 ||
      r.utiCases > 0 ||
      r.vapCases > 0 ||
      r.phlebitisCases > 0 ||
      r.ssiCases > 0 ||
      r.uvcClabsiCases > 0
  );

  // Benchmarks
  const benchmarks = {
    cauti: 1.5,
    vap: 2.0,
    phlebitis: 1.0,
    ssi: 1.5,
    clabsi: 2.0,
    hai: 2.5,
  };

  // High risk alerts
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical');

  return (
    <div className="space-y-6">
      {/* Real-time Outbreak / Critical Alert Warning Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-linear-to-r from-rose-600 to-red-700 text-white p-4 sm:p-5 rounded-2xl shadow-lg shadow-rose-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 bg-white/20 rounded-xl mt-0.5 animate-pulse">
              <AlertOctagon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg">
                  การแจ้งเตือนระดับวิกฤต (Real-time Critical HAI Alert)
                </span>
                <span className="bg-white text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {criticalAlerts.length} เหตุการณ์
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-100 mt-1">
                ตรวจพบอัตราการติดเชื้อเกินเกณฑ์มาตรฐาน: NICU (UVC-BSI {records.find(r => r.ward === 'NICU')?.uvcClabsiRate} ‰), อญ (VAP {records.find(r => r.ward === 'อญ')?.vapRate} ‰), ICU (Phlebitis {records.find(r => r.ward === 'ICU')?.phlebitisRate} ‰)
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToAlerts}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all whitespace-nowrap self-end md:self-center cursor-pointer"
          >
            <span>ดูมาตรการและส่งแจ้งเตือน</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary KPI Cards Grid (The 5 Target Infection Types + Overall HAI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. CAUTI Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">CAUTI (สายสวน)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {summary.overallUtiRate}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">/ 1,000 วันคาสาย</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
            <span className="text-slate-500">ติดเชื้อ: <strong className="text-slate-800">{summary.totalUtiCases}</strong> ครั้ง</span>
            <span
              className={`px-1.5 py-0.5 rounded-md font-semibold text-[10px] ${
                summary.overallUtiRate <= benchmarks.cauti
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              เกณฑ์ &lt; {benchmarks.cauti}
            </span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            คาสาย: {summary.totalCatheterDays.toLocaleString()} วัน
          </div>
        </div>

        {/* 2. VAP Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">VAP (เครื่องช่วยหายใจ)</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {summary.overallVapRate}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">/ 1,000 วันครองเครื่อง</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
            <span className="text-slate-500">ติดเชื้อ: <strong className="text-slate-800">{summary.totalVapCases}</strong> ครั้ง</span>
            <span
              className={`px-1.5 py-0.5 rounded-md font-semibold text-[10px] ${
                summary.overallVapRate <= benchmarks.vap
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              เกณฑ์ &lt; {benchmarks.vap}
            </span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            ครองเครื่อง: {summary.totalVentilatorDays.toLocaleString()} วัน
          </div>
        </div>

        {/* 3. Phlebitis Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Phlebitis (IV)</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Syringe className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {summary.overallPhlebitisRate}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">/ 1,000 วันให้ IV</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
            <span className="text-slate-500">เกิด: <strong className="text-slate-800">{summary.totalPhlebitisCases}</strong> ครั้ง</span>
            <span
              className={`px-1.5 py-0.5 rounded-md font-semibold text-[10px] ${
                summary.overallPhlebitisRate <= benchmarks.phlebitis
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              เกณฑ์ &lt; {benchmarks.phlebitis}
            </span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            ให้ IV: {summary.totalIvDays.toLocaleString()} วัน
          </div>
        </div>

        {/* 4. SSI Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">SSI (แผลผ่าตัด01)</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {summary.overallSsiRate}%
            </span>
            <span className="text-[11px] text-slate-500 font-medium">ของแผลผ่าตัด</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
            <span className="text-slate-500">ติดเชื้อ: <strong className="text-slate-800">{summary.totalSsiCases}</strong> ราย</span>
            <span
              className={`px-1.5 py-0.5 rounded-md font-semibold text-[10px] ${
                summary.overallSsiRate <= benchmarks.ssi
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}
            >
              เกณฑ์ &lt; {benchmarks.ssi}%
            </span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            แผลผ่าตัด: {summary.totalSurgicalWounds.toLocaleString()} แผล
          </div>
        </div>

        {/* 5. CLABSI & UVC-BSI Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">CLABSI / UVC</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <HeartPulse className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight text-rose-600">
              {summary.overallUvcClabsiRate}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">/ 1,000 วัน UVC</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
            <span className="text-slate-500">ติดเชื้อ: <strong className="text-rose-600">{summary.totalUvcClabsiCases}</strong> ครั้ง</span>
            <span className="px-1.5 py-0.5 rounded-md font-semibold text-[10px] bg-rose-100 text-rose-800">
              วิกฤต NICU
            </span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400">
            วันคาสาย: {summary.totalUvcDays.toLocaleString()} วัน
          </div>
        </div>

        {/* 6. Overall Hospital HAI Rate */}
        <div className="bg-linear-to-br from-teal-500 to-emerald-600 text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-teal-100 uppercase">ติดเชื้อใน ร.พ. รวม</span>
            <div className="p-2 bg-white/20 text-white rounded-xl">
              <Hospital className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black tracking-tight text-white">
              {summary.overallHaiRate}
            </span>
            <span className="text-[11px] text-teal-100 font-medium">/ 1,000 วันนอน</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-teal-400/40">
            <span className="text-teal-100">รวม: <strong>{summary.totalInfections}</strong> ราย</span>
            <span className="px-1.5 py-0.5 rounded-md font-semibold text-[10px] bg-white/20 text-white">
              เกณฑ์ &lt; {benchmarks.hai}
            </span>
          </div>
          <div className="mt-1 text-[10px] text-teal-100/80">
            วันนอน: {summary.totalPatientDays.toLocaleString()} วัน
          </div>
        </div>
      </div>

      {/* Middle Section: Analytical Charts & Hospital Ward Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ward Infection Rate Comparison Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                การกระจายอัตราการติดเชื้อรายหอผู้ป่วย (Infection Rate by Ward)
              </h3>
              <p className="text-xs text-slate-500">
                เปรียบเทียบอุบัติการณ์เฉพาะหอผู้ป่วยที่ตรวจพบการติดเชื้อ
              </p>
            </div>
            <button
              onClick={onNavigateToTable}
              className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <span>ดูตารางฉบับเต็ม</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {wardsWithInfections.map((w) => {
              const maxRate = Math.max(w.utiRate, w.vapRate, w.phlebitisRate, w.uvcClabsiRate, w.hospitalInfectionRate);
              return (
                <div key={w.id} className="p-3 bg-slate-50 hover:bg-teal-50/40 rounded-xl border border-slate-200/60 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900">{w.ward}</span>
                      <span className="text-xs text-slate-500 truncate max-w-[180px] sm:max-w-none">
                        {w.wardName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-500">ติดเชื้อรวม:</span>
                      <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {w.totalInfections} ราย
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className="font-bold text-teal-700">
                        {w.hospitalInfectionRate} ‰ วันนอน
                      </span>
                    </div>
                  </div>

                  {/* Multi-rate indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] pt-1">
                    <div className={`p-1.5 rounded-lg border ${w.utiCases > 0 ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                      <div className="text-[10px] text-slate-400">UTI (CAUTI)</div>
                      <div className="font-bold">{w.utiRate} ‰ <span className="font-normal text-[10px]">({w.utiCases} ราย)</span></div>
                    </div>
                    <div className={`p-1.5 rounded-lg border ${w.vapCases > 0 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                      <div className="text-[10px] text-slate-400">VAP (ปอดอักเสบ)</div>
                      <div className="font-bold" style={{ backgroundColor: '#000000' }}>{w.vapRate} ‰ <span className="font-normal text-[10px]">({w.vapCases} ราย)</span></div>
                    </div>
                    <div className={`p-1.5 rounded-lg border ${w.phlebitisCases > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                      <div className="text-[10px] text-slate-400">Phlebitis</div>
                      <div className="font-bold">{w.phlebitisRate} ‰ <span className="font-normal text-[10px]">({w.phlebitisCases} ราย)</span></div>
                    </div>
                    <div className={`p-1.5 rounded-lg border ${w.ssiCases > 0 ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                      <div className="text-[10px] text-slate-400">SSI แผลผ่าตัด</div>
                      <div className="font-bold">{w.ssiRate}% <span className="font-normal text-[10px]">({w.ssiCases} ราย)</span></div>
                    </div>
                    <div className={`p-1.5 rounded-lg border ${w.uvcClabsiCases > 0 ? 'bg-red-50 border-red-200 text-red-900 font-bold' : 'bg-white border-slate-200 text-slate-600'}`}>
                      <div className="text-[10px] text-slate-400">UVC / BSI</div>
                      <div className="font-bold">{w.uvcClabsiRate} ‰ <span className="font-normal text-[10px]">({w.uvcClabsiCases} ราย)</span></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Utilization & Surveillance Ratios */}
        <div className="space-y-6">
          {/* Device Utilization Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              อัตราการใช้อุปกรณ์ทางการแพทย์ (Device Utilization Ratio)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              สัดส่วนวันใช้อุปกรณ์ต่อวันนอนผู้ป่วยทั้งหมดในโรงพยาบาล
            </p>

            <div className="space-y-4">
              {/* Foley Catheter Device Utilization */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">สายสวนปัสสาวะ (Foley Ratio)</span>
                  <span className="font-bold text-slate-900">
                    {((summary.totalCatheterDays / (summary.totalPatientDays || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(100, (summary.totalCatheterDays / (summary.totalPatientDays || 1)) * 100)}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>{summary.totalCatheterDays.toLocaleString()} วันคาสาย</span>
                  <span>จาก {summary.totalPatientDays.toLocaleString()} วันนอน</span>
                </div>
              </div>

              {/* Ventilator Utilization */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">เครื่องช่วยหายใจ (Ventilator Ratio)</span>
                  <span className="font-bold text-slate-900">
                    {((summary.totalVentilatorDays / (summary.totalPatientDays || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-rose-500 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(100, (summary.totalVentilatorDays / (summary.totalPatientDays || 1)) * 100)}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>{summary.totalVentilatorDays.toLocaleString()} วันครองเครื่อง</span>
                  <span>จาก {summary.totalPatientDays.toLocaleString()} วันนอน</span>
                </div>
              </div>

              {/* Peripheral IV Utilization */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">การให้สารน้ำ IV (IV Ratio)</span>
                  <span className="font-bold text-slate-900">
                    {((summary.totalIvDays / (summary.totalPatientDays || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-2.5 rounded-full"
                    style={{
                      width: `${Math.min(100, (summary.totalIvDays / (summary.totalPatientDays || 1)) * 100)}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>{summary.totalIvDays.toLocaleString()} วันให้สารน้ำ</span>
                  <span>จาก {summary.totalPatientDays.toLocaleString()} วันนอน</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Ward Status Directory */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 mb-2">
              สถานะเฝ้าระวัง 19 หอผู้ป่วย (Hospital Ward Status)
            </h3>
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {records.map((r) => {
                const hasCritical = alerts.some((a) => a.ward === r.ward && a.severity === 'critical');
                const hasWarning = alerts.some((a) => a.ward === r.ward && a.severity === 'warning');

                let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                if (hasCritical) {
                  badgeColor = 'bg-rose-50 text-rose-700 border-rose-300 font-bold';
                } else if (hasWarning) {
                  badgeColor = 'bg-amber-50 text-amber-700 border-amber-300 font-semibold';
                }

                return (
                  <button
                    key={r.id}
                    onClick={() => onSelectWard(r.ward)}
                    className={`p-2 rounded-xl border text-xs transition-all hover:scale-105 cursor-pointer ${badgeColor}`}
                    title={`${r.wardName}: ติดเชื้อ ${r.totalInfections} ราย`}
                  >
                    <div>{r.ward}</div>
                    <div className="text-[10px] opacity-75">
                      {r.totalInfections > 0 ? `${r.totalInfections} ราย` : 'ปลอดภัย'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Hospital(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 6v4" />
      <path d="M14 8h-4" />
      <path d="M18 18V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v13" />
      <path d="M3 21h18" />
    </svg>
  );
}
