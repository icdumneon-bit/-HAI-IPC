import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Edit3,
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { WardSurveillanceRecord } from '../types/surveillance';
import { SurveillanceSummary, exportRecordsToGoogleSheetsCSV } from '../utils/calculations';

interface SurveillanceTableProps {
  records: WardSurveillanceRecord[];
  summary: SurveillanceSummary;
  onEditRecord: (record: WardSurveillanceRecord) => void;
  selectedWard?: string | null;
  tableType: 'table1' | 'table2';
}

export const SurveillanceTable: React.FC<SurveillanceTableProps> = ({
  records,
  summary,
  onEditRecord,
  selectedWard,
  tableType,
}) => {
  const [search, setSearch] = useState(selectedWard || '');
  const [filterType, setFilterType] = useState<'all' | 'infected' | 'critical'>('all');
  const [sortField, setSortField] = useState<keyof WardSurveillanceRecord>('ward');
  const [sortAsc, setSortAsc] = useState(true);

  // Filter records
  const filteredRecords = records
    .filter((r) => {
      const matchSearch =
        r.ward.toLowerCase().includes(search.toLowerCase()) ||
        r.wardName.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;

      if (filterType === 'infected') {
        return (
          r.totalInfections > 0 ||
          r.utiCases > 0 ||
          r.vapCases > 0 ||
          r.phlebitisCases > 0 ||
          r.ssiCases > 0 ||
          r.uvcClabsiCases > 0
        );
      }
      if (filterType === 'critical') {
        return (
          r.uvcClabsiRate >= 2.0 ||
          r.vapRate >= 2.0 ||
          r.utiRate >= 1.5 ||
          r.phlebitisRate >= 1.0 ||
          r.hospitalInfectionRate >= 2.0
        );
      }
      return true;
    })
    .sort((a, b) => {
      const valA = a[sortField] ?? 0;
      const valB = b[sortField] ?? 0;
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
    });

  const handleSort = (field: keyof WardSurveillanceRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for rates
    }
  };

  const handleDownloadCSV = () => {
    const csvData = exportRecordsToGoogleSheetsCSV(records);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `IC_Surveillance_Data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {tableType === 'table1'
                ? 'ตารางที่ 1: การติดเชื้อสัมพันธ์กับการใช้อุปกรณ์ทางการแพทย์ (Device-Associated Infections)'
                : 'ตารางที่ 2: การเฝ้าระวังเพิ่มเติม (SST, HAP, เชื้อดื้อยา NI-MDR, C-Line)'}
            </h2>
            <span className="bg-teal-50 text-teal-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-teal-200">
              {records.length} หอผู้ป่วย
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ข้อมูลการเฝ้าระวังโรคติดเชื้อในโรงพยาบาล อัตราคำนวณตามมาตรฐานระบาดวิทยาแห่งประเทศไทย
          </p>
        </div>

        {/* Search & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาหอผู้ป่วย..."
              className="pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none w-44 sm:w-56"
            />
          </div>

          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterType === 'all' ? 'bg-white font-semibold text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterType('infected')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterType === 'infected' ? 'bg-white font-semibold text-teal-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              พบติดเชื้อ
            </button>
            <button
              onClick={() => setFilterType('critical')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterType === 'critical' ? 'bg-white font-semibold text-rose-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              เกินเกณฑ์
            </button>
          </div>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer"
            title="ดาวน์โหลดเป็นไฟล์ CSV สำหรับ Google Sheets / Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Responsive Horizontal Scroll Table */}
      <div className="overflow-x-auto scrollbar-thin">
        {tableType === 'table1' ? (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              {/* Main Super Headers */}
              <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-300 text-[11px] whitespace-nowrap">
                <th rowSpan={2} className="py-2.5 px-3 border-r border-slate-200 sticky left-0 bg-slate-100 z-10">
                  <button onClick={() => handleSort('ward')} className="flex items-center gap-1 hover:text-teal-700">
                    หอผู้ป่วย <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th colSpan={4} className="py-1 px-3 text-center bg-amber-50/80 text-amber-900 border-r border-amber-200">
                  สายสวนปัสสาวะ (UTI / CAUTI)
                </th>
                <th colSpan={4} className="py-1 px-3 text-center bg-rose-50/80 text-rose-900 border-r border-rose-200">
                  เครื่องช่วยหายใจ (VAP)
                </th>
                <th colSpan={4} className="py-1 px-3 text-center bg-indigo-50/80 text-indigo-900 border-r border-indigo-200">
                  หลอดเลือดดำ (Phlebitis)
                </th>
                <th colSpan={3} className="py-1 px-3 text-center bg-purple-50/80 text-purple-900 border-r border-purple-200">
                  แผลผ่าตัด (SSI 01)
                </th>
                <th colSpan={4} className="py-1 px-3 text-center bg-red-50/80 text-red-900 border-r border-red-200">
                  สายสวนส่วนกลาง/สายสะดือ (UVC/CLABSI)
                </th>
                <th colSpan={6} className="py-1 px-3 text-center bg-teal-50/80 text-teal-900">
                  ภาพรวมการติดเชื้อใน ร.พ. (Overall Hospital HAI)
                </th>
                <th rowSpan={2} className="py-2.5 px-3 text-center">
                  จัดการ
                </th>
              </tr>
              {/* Detailed Sub Headers */}
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[10px] whitespace-nowrap">
                {/* UTI */}
                <th className="py-2 px-2 text-right">Pt ใส่สาย</th>
                <th className="py-2 px-2 text-right">วันคาสาย</th>
                <th className="py-2 px-2 text-right">ครั้งเกิด UTI</th>
                <th className="py-2 px-2 text-right border-r border-amber-200 text-amber-900 font-bold">อัตรา UTI (‰)</th>
                {/* VAP */}
                <th className="py-2 px-2 text-right">Pt ใส่เครื่อง</th>
                <th className="py-2 px-2 text-right">วันครองเครื่อง</th>
                <th className="py-2 px-2 text-right">ครั้งเกิด VAP</th>
                <th className="py-2 px-2 text-right border-r border-rose-200 text-rose-900 font-bold">อัตรา VAP (‰)</th>
                {/* Phlebitis */}
                <th className="py-2 px-2 text-right">Pt ให้ IV</th>
                <th className="py-2 px-2 text-right">วันให้ IV</th>
                <th className="py-2 px-2 text-right">เกิด Phlebitis</th>
                <th className="py-2 px-2 text-right border-r border-indigo-200 text-indigo-900 font-bold">อัตรา Phlebitis (‰)</th>
                {/* SSI */}
                <th className="py-2 px-2 text-right">แผลผ่าตัด01</th>
                <th className="py-2 px-2 text-right">ติดเชื้อ SSI</th>
                <th className="py-2 px-2 text-right border-r border-purple-200 text-purple-900 font-bold">อัตรา SSI (%)</th>
                {/* UVC / CLABSI */}
                <th className="py-2 px-2 text-right">Pt UVC</th>
                <th className="py-2 px-2 text-right">วัน UVC</th>
                <th className="py-2 px-2 text-right">เกิด CLABSI</th>
                <th className="py-2 px-2 text-right border-r border-red-200 text-red-900 font-bold">อัตรา CLABSI (‰)</th>
                {/* Overall */}
                <th className="py-2 px-2 text-right">Pt ติดเชื้อ</th>
                <th className="py-2 px-2 text-right">วันนอนผู้ป่วย</th>
                <th className="py-2 px-2 text-right">ครั้งติดเชื้อ</th>
                <th className="py-2 px-2 text-right font-bold text-teal-900">อัตราติดเชื้อ (‰)</th>
                <th className="py-2 px-2 text-right">Pt เชื้อใน ร.พ.</th>
                <th className="py-2 px-2 text-right">วันจำหน่าย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => {
                const isUtiAlert = r.utiRate >= 1.5;
                const isVapAlert = r.vapRate >= 2.0;
                const isPhlebitisAlert = r.phlebitisRate >= 1.0;
                const isClabsiAlert = r.uvcClabsiRate >= 2.0;
                const isHaiAlert = r.hospitalInfectionRate >= 2.0;

                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors whitespace-nowrap">
                    {/* Ward Column */}
                    <td className="py-2 px-3 font-bold text-slate-800 border-r border-slate-200 sticky left-0 bg-white z-10 flex items-center justify-between gap-2">
                      <div>
                        <span>{r.ward}</span>
                        <div className="text-[10px] font-normal text-slate-400 max-w-[120px] truncate">{r.wardName}</div>
                      </div>
                      {(isUtiAlert || isVapAlert || isPhlebitisAlert || isClabsiAlert || isHaiAlert) && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      )}
                    </td>

                    {/* UTI */}
                    <td className="py-2 px-2 text-right text-slate-600">{r.utiPatients.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right text-slate-600">{r.catheterDays.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-semibold text-slate-800">{r.utiCases}</td>
                    <td
                      className={`py-2 px-2 text-right font-bold border-r border-amber-200 ${
                        isUtiAlert ? 'bg-amber-100 text-amber-900' : r.utiRate > 0 ? 'text-amber-700' : 'text-slate-400'
                      }`}
                    >
                      {r.utiRate.toFixed(2)}
                    </td>

                    {/* VAP */}
                    <td className="py-2 px-2 text-right text-slate-600">{r.vapPatients.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right text-slate-600">{r.ventilatorDays.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-semibold text-slate-800">{r.vapCases}</td>
                    <td
                      className={`py-2 px-2 text-right font-bold border-r border-rose-200 ${
                        isVapAlert ? 'bg-rose-100 text-rose-900' : r.vapRate > 0 ? 'text-rose-700' : 'text-slate-400'
                      }`}
                    >
                      {r.vapRate.toFixed(2)}
                    </td>

                    {/* Phlebitis */}
                    <td className="py-2 px-2 text-right text-slate-600">{r.ivPatients.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right text-slate-600">{r.ivDays.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-semibold text-slate-800">{r.phlebitisCases}</td>
                    <td
                      className={`py-2 px-2 text-right font-bold border-r border-indigo-200 ${
                        isPhlebitisAlert ? 'bg-indigo-100 text-indigo-900' : r.phlebitisRate > 0 ? 'text-indigo-700' : 'text-slate-400'
                      }`}
                    >
                      {r.phlebitisRate.toFixed(2)}
                    </td>

                    {/* SSI */}
                    <td className="py-2 px-2 text-right text-slate-600">{r.surgicalWounds.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-semibold text-slate-800">{r.ssiCases}</td>
                    <td
                      className={`py-2 px-2 text-right font-bold border-r border-purple-200 ${
                        r.ssiRate > 0 ? 'text-purple-700' : 'text-slate-400'
                      }`}
                    >
                      {r.ssiRate.toFixed(2)}%
                    </td>

                    {/* UVC / CLABSI */}
                    <td className="py-2 px-2 text-right text-slate-600">{r.uvcPatients.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right text-slate-600">{r.uvcDays.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-semibold text-slate-800">{r.uvcClabsiCases}</td>
                    <td
                      className={`py-2 px-2 text-right font-bold border-r border-red-200 ${
                        isClabsiAlert ? 'bg-red-200 text-red-900 animate-pulse' : r.uvcClabsiRate > 0 ? 'text-red-700' : 'text-slate-400'
                      }`}
                    >
                      {r.uvcClabsiRate.toFixed(2)}
                    </td>

                    {/* Overall Hospital */}
                    <td className="py-2 px-2 text-right text-slate-600">{r.infectedPatients.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right text-slate-600">{r.totalPatientDays.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-bold text-slate-800">{r.totalInfections}</td>
                    <td
                      className={`py-2 px-2 text-right font-black ${
                        isHaiAlert ? 'bg-teal-100 text-teal-900' : r.hospitalInfectionRate > 0 ? 'text-teal-700' : 'text-slate-400'
                      }`}
                    >
                      {r.hospitalInfectionRate.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-right text-slate-600">{r.hospitalInfectedPatients.toLocaleString()}</td>
                    <td className="py-2 px-2 text-right text-slate-600">{r.dischargeDays.toLocaleString()}</td>

                    {/* Action */}
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => onEditRecord(r)}
                        className="p-1 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
                        title="แก้ไขข้อมูลหอผู้ป่วยนี้"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Total Row "รวม" exactly as in Google Sheets */}
            <tfoot>
              <tr className="bg-slate-200/90 text-slate-900 font-black text-[11px] border-t-2 border-slate-400 whitespace-nowrap">
                <td className="py-3 px-3 border-r border-slate-300 sticky left-0 bg-slate-200 z-10 text-teal-900">
                  รวมทั้งสิ้น ({records.length} หอ)
                </td>
                {/* UTI Totals */}
                <td className="py-3 px-2 text-right">{summary.totalCatheterPatients.toLocaleString()}</td>
                <td className="py-3 px-2 text-right">{summary.totalCatheterDays.toLocaleString()}</td>
                <td className="py-3 px-2 text-right">{summary.totalUtiCases}</td>
                <td className="py-3 px-2 text-right text-amber-900 border-r border-amber-300">
                  {summary.overallUtiRate.toFixed(2)}
                </td>
                {/* VAP Totals */}
                <td className="py-3 px-2 text-right">{summary.totalVentilatorPatients.toLocaleString()}</td>
                <td className="py-3 px-2 text-right">{summary.totalVentilatorDays.toLocaleString()}</td>
                <td className="py-3 px-2 text-right">{summary.totalVapCases}</td>
                <td className="py-3 px-2 text-right text-rose-900 border-r border-rose-300">
                  {summary.overallVapRate.toFixed(2)}
                </td>
                {/* Phlebitis Totals */}
                <td className="py-3 px-2 text-right">{summary.totalIvPatients.toLocaleString()}</td>
                <td className="py-3 px-2 text-right">{summary.totalIvDays.toLocaleString()}</td>
                <td className="py-3 px-2 text-right">{summary.totalPhlebitisCases}</td>
                <td className="py-3 px-2 text-right text-indigo-900 border-r border-indigo-300">
                  {summary.overallPhlebitisRate.toFixed(2)}
                </td>
                {/* SSI Totals */}
                <td className="py-3 px-2 text-right">{summary.totalSurgicalWounds.toLocaleString()}</td>
                <td className="py-3 px-2 text-right">{summary.totalSsiCases}</td>
                <td className="py-3 px-2 text-right text-purple-900 border-r border-purple-300">
                  {summary.overallSsiRate.toFixed(2)}%
                </td>
                {/* UVC Totals */}
                <td className="py-3 px-2 text-right">{summary.totalUvcPatients.toLocaleString()}</td>
                <td className="py-3 px-2 text-right">{summary.totalUvcDays.toLocaleString()}</td>
                <td className="py-3 px-2 text-right">{summary.totalUvcClabsiCases}</td>
                <td className="py-3 px-2 text-right text-red-900 border-r border-red-300">
                  {summary.overallUvcClabsiRate.toFixed(2)}
                </td>
                {/* Overall Totals */}
                <td className="py-3 px-2 text-right">-</td>
                <td className="py-3 px-2 text-right">{summary.totalPatientDays.toLocaleString()}</td>
                <td className="py-3 px-2 text-right">{summary.totalInfections}</td>
                <td className="py-3 px-2 text-right text-teal-900">
                  {summary.overallHaiRate.toFixed(2)}
                </td>
                <td className="py-3 px-2 text-right">-</td>
                <td className="py-3 px-2 text-right">-</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        ) : (
          /* Table 2: Extended Surveillance (SST, HAP, MDR, C-Line) */
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[11px] whitespace-nowrap">
                <th className="py-2.5 px-3 border-r border-slate-200 sticky left-0 bg-slate-100 z-10">
                  หอผู้ป่วย
                </th>
                <th colSpan={4} className="py-1 px-3 text-center bg-emerald-50 text-emerald-900 border-r border-emerald-200">
                  SST (ผิวหนังและเนื้อเยื่ออ่อน)
                </th>
                <th colSpan={4} className="py-1 px-3 text-center bg-cyan-50 text-cyan-900 border-r border-cyan-200">
                  HAP (ปอดอักเสบใน ร.พ.)
                </th>
                <th colSpan={4} className="py-1 px-3 text-center bg-amber-50 text-amber-900 border-r border-amber-200">
                  เชื้อดื้อยาหลายขนาน (NI-MDR)
                </th>
                <th colSpan={4} className="py-1 px-3 text-center bg-rose-50 text-rose-900 border-r border-rose-200">
                  C-line (Central Line)
                </th>
                <th className="py-2.5 px-3 text-center">จัดการ</th>
              </tr>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[10px] whitespace-nowrap">
                <th className="py-2 px-3 border-r border-slate-200"></th>
                {/* SST */}
                <th className="py-2 px-2 text-right">Pt SST</th>
                <th className="py-2 px-2 text-right">นอน ร.พ.</th>
                <th className="py-2 px-2 text-right">เกิด SST</th>
                <th className="py-2 px-2 text-right border-r border-emerald-200 font-bold text-emerald-900">อัตรา SST (‰)</th>
                {/* HAP */}
                <th className="py-2 px-2 text-right">Pt HAP</th>
                <th className="py-2 px-2 text-right">นอน ร.พ.</th>
                <th className="py-2 px-2 text-right">เกิด HAP</th>
                <th className="py-2 px-2 text-right border-r border-cyan-200 font-bold text-cyan-900">อัตรา HAP (‰)</th>
                {/* MDR */}
                <th className="py-2 px-2 text-right">MDR ทั้งหมด</th>
                <th className="py-2 px-2 text-right">นอน MDR</th>
                <th className="py-2 px-2 text-right">NI MDR</th>
                <th className="py-2 px-2 text-right border-r border-amber-200 font-bold text-amber-900">อัตรา MDR (‰)</th>
                {/* C-line */}
                <th className="py-2 px-2 text-right">Pt C-line</th>
                <th className="py-2 px-2 text-right">วัน C-line</th>
                <th className="py-2 px-2 text-right">เกิด CLABSI</th>
                <th className="py-2 px-2 text-right border-r border-rose-200 font-bold text-rose-900">อัตรา CLABSI (‰)</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors whitespace-nowrap">
                  <td className="py-2 px-3 font-bold text-slate-800 border-r border-slate-200 sticky left-0 bg-white z-10">
                    {r.ward} <span className="text-[10px] font-normal text-slate-400">({r.wardName})</span>
                  </td>
                  {/* SST */}
                  <td className="py-2 px-2 text-right text-slate-600">{r.sstPatients || 0}</td>
                  <td className="py-2 px-2 text-right text-slate-600">{r.sstDays || 0}</td>
                  <td className="py-2 px-2 text-right font-semibold text-slate-800">{r.sstCases || 0}</td>
                  <td className="py-2 px-2 text-right font-bold text-emerald-800 border-r border-emerald-200">
                    {r.sstRate ? r.sstRate.toFixed(2) : '0.00'}
                  </td>

                  {/* HAP */}
                  <td className="py-2 px-2 text-right text-slate-600">-</td>
                  <td className="py-2 px-2 text-right text-slate-600">{r.hapDays || 0}</td>
                  <td className="py-2 px-2 text-right font-semibold text-slate-800">{r.hapCases || 0}</td>
                  <td className="py-2 px-2 text-right font-bold text-cyan-800 border-r border-cyan-200">
                    {r.hapRate ? r.hapRate.toFixed(2) : '0.00'}
                  </td>

                  {/* MDR */}
                  <td className="py-2 px-2 text-right text-slate-600">{r.mdrTotal || 0}</td>
                  <td className="py-2 px-2 text-right text-slate-600">{r.mdrDays || 0}</td>
                  <td className="py-2 px-2 text-right font-semibold text-slate-800">{r.mdrNiCases || 0}</td>
                  <td className="py-2 px-2 text-right font-bold text-amber-800 border-r border-amber-200">
                    {r.mdrRate ? r.mdrRate.toFixed(2) : '0.00'}
                  </td>

                  {/* C-line */}
                  <td className="py-2 px-2 text-right text-slate-600">{r.clinePatients || 0}</td>
                  <td className="py-2 px-2 text-right text-slate-600">{r.clineDays || 0}</td>
                  <td className="py-2 px-2 text-right font-semibold text-slate-800">{r.clineClabsiCases || 0}</td>
                  <td className="py-2 px-2 text-right font-bold text-rose-800 border-r border-rose-200">
                    {r.clineClabsiRate ? r.clineClabsiRate.toFixed(2) : '0.00'}
                  </td>

                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => onEditRecord(r)}
                      className="p-1 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
