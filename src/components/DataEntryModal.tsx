import React, { useState, useEffect } from 'react';
import { X, Save, Calculator, AlertCircle, Activity, Bed, Syringe, Scissors, Droplets } from 'lucide-react';
import { WardSurveillanceRecord, UserProfile } from '../types/surveillance';
import { calculateWardRates, safeRate } from '../utils/calculations';
import { WARD_METADATA } from '../data/initialData';

interface DataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordToEdit?: WardSurveillanceRecord | null;
  onSave: (record: WardSurveillanceRecord) => void;
  currentUser: UserProfile | null;
}

export const DataEntryModal: React.FC<DataEntryModalProps> = ({
  isOpen,
  onClose,
  recordToEdit,
  onSave,
  currentUser,
}) => {
  const [ward, setWard] = useState('ICU');
  const [wardName, setWardName] = useState('หอผู้ป่วยวิกฤต (ICU)');
  const [month, setMonth] = useState('2026-10');

  // UTI
  const [utiPatients, setUtiPatients] = useState<number>(0);
  const [catheterDays, setCatheterDays] = useState<number>(0);
  const [utiCases, setUtiCases] = useState<number>(0);

  // VAP
  const [vapPatients, setVapPatients] = useState<number>(0);
  const [ventilatorDays, setVentilatorDays] = useState<number>(0);
  const [vapCases, setVapCases] = useState<number>(0);

  // Phlebitis
  const [ivPatients, setIvPatients] = useState<number>(0);
  const [ivDays, setIvDays] = useState<number>(0);
  const [phlebitisCases, setPhlebitisCases] = useState<number>(0);

  // SSI
  const [surgicalWounds, setSurgicalWounds] = useState<number>(0);
  const [ssiCases, setSsiCases] = useState<number>(0);

  // UVC / CLABSI
  const [uvcPatients, setUvcPatients] = useState<number>(0);
  const [uvcDays, setUvcDays] = useState<number>(0);
  const [uvcClabsiCases, setUvcClabsiCases] = useState<number>(0);

  // Hospital Totals
  const [infectedPatients, setInfectedPatients] = useState<number>(0);
  const [totalPatientDays, setTotalPatientDays] = useState<number>(0);
  const [totalInfections, setTotalInfections] = useState<number>(0);
  const [hospitalInfectedPatients, setHospitalInfectedPatients] = useState<number>(0);
  const [dischargeDays, setDischargeDays] = useState<number>(0);

  // Populate when editing
  useEffect(() => {
    if (recordToEdit) {
      setWard(recordToEdit.ward);
      setWardName(recordToEdit.wardName);
      setMonth(recordToEdit.month || '2026-10');
      setUtiPatients(recordToEdit.utiPatients || 0);
      setCatheterDays(recordToEdit.catheterDays || 0);
      setUtiCases(recordToEdit.utiCases || 0);

      setVapPatients(recordToEdit.vapPatients || 0);
      setVentilatorDays(recordToEdit.ventilatorDays || 0);
      setVapCases(recordToEdit.vapCases || 0);

      setIvPatients(recordToEdit.ivPatients || 0);
      setIvDays(recordToEdit.ivDays || 0);
      setPhlebitisCases(recordToEdit.phlebitisCases || 0);

      setSurgicalWounds(recordToEdit.surgicalWounds || 0);
      setSsiCases(recordToEdit.ssiCases || 0);

      setUvcPatients(recordToEdit.uvcPatients || 0);
      setUvcDays(recordToEdit.uvcDays || 0);
      setUvcClabsiCases(recordToEdit.uvcClabsiCases || 0);

      setInfectedPatients(recordToEdit.infectedPatients || 0);
      setTotalPatientDays(recordToEdit.totalPatientDays || 0);
      setTotalInfections(recordToEdit.totalInfections || 0);
      setHospitalInfectedPatients(recordToEdit.hospitalInfectedPatients || 0);
      setDischargeDays(recordToEdit.dischargeDays || 0);
    }
  }, [recordToEdit, isOpen]);

  if (!isOpen) return null;

  const handleWardChange = (newWard: string) => {
    setWard(newWard);
    if (WARD_METADATA[newWard]) {
      setWardName(WARD_METADATA[newWard].name);
    }
  };

  // Live Calculated Rates
  const liveUtiRate = safeRate(utiCases, catheterDays, 1000);
  const liveVapRate = safeRate(vapCases, ventilatorDays, 1000);
  const livePhlebitisRate = safeRate(phlebitisCases, ivDays, 1000);
  const liveSsiRate = safeRate(ssiCases, surgicalWounds, 100);
  const liveUvcRate = safeRate(uvcClabsiCases, uvcDays, 1000);
  const liveHaiRate = safeRate(totalInfections, totalPatientDays, 1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: WardSurveillanceRecord = {
      id: recordToEdit ? recordToEdit.id : `rec-${ward}-${Date.now()}`,
      ward,
      wardName: wardName || `หอผู้ป่วย ${ward}`,
      wardType: (WARD_METADATA[ward]?.type as any) || 'medical',
      month,
      utiPatients: Number(utiPatients) || 0,
      catheterDays: Number(catheterDays) || 0,
      utiCases: Number(utiCases) || 0,
      utiRate: liveUtiRate,
      vapPatients: Number(vapPatients) || 0,
      ventilatorDays: Number(ventilatorDays) || 0,
      vapCases: Number(vapCases) || 0,
      vapRate: liveVapRate,
      ivPatients: Number(ivPatients) || 0,
      ivDays: Number(ivDays) || 0,
      phlebitisCases: Number(phlebitisCases) || 0,
      phlebitisRate: livePhlebitisRate,
      surgicalWounds: Number(surgicalWounds) || 0,
      ssiCases: Number(ssiCases) || 0,
      ssiRate: liveSsiRate,
      uvcPatients: Number(uvcPatients) || 0,
      uvcDays: Number(uvcDays) || 0,
      uvcClabsiCases: Number(uvcClabsiCases) || 0,
      uvcClabsiRate: liveUvcRate,
      infectedPatients: Number(infectedPatients) || 0,
      totalPatientDays: Number(totalPatientDays) || 0,
      totalInfections: Number(totalInfections) || 0,
      hospitalInfectionRate: liveHaiRate,
      hospitalInfectedPatients: Number(hospitalInfectedPatients) || 0,
      dischargeDays: Number(dischargeDays) || 0,
      lastUpdated: new Date().toISOString(),
      updatedBy: currentUser?.email || 'icdumneon@gmail.com',
    };

    onSave(calculateWardRates(newRecord));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-linear-to-r from-teal-700 to-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Calculator className="w-5 h-5 text-teal-200" />
            <div>
              <h3 className="font-bold text-base">
                {recordToEdit ? `แก้ไขข้อมูลเฝ้าระวัง: ${recordToEdit.ward}` : 'บันทึกข้อมูลการเฝ้าระวังการติดเชื้อใหม่'}
              </h3>
              <p className="text-xs text-teal-100">
                ระบบคำนวณอัตราการติดเชื้อ (Infection Rate) อัตโนมัติ ป้องกันข้อผิดพลาด #DIV/0!
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Ward & Month Header Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">หอผู้ป่วย (Ward)</label>
              <select
                value={ward}
                onChange={(e) => handleWardChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white font-semibold outline-none focus:ring-2 focus:ring-teal-500"
              >
                {Object.keys(WARD_METADATA).map((wKey) => (
                  <option key={wKey} value={wKey}>
                    {wKey} - {WARD_METADATA[wKey].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อเต็มหอผู้ป่วย</label>
              <input
                type="text"
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ประจำเดือน/งวดข้อมูล</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* 1. UTI Section */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-amber-900 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-amber-600" />
                1. การติดเชื้อระบบทางเดินปัสสาวะ (UTI / CAUTI)
              </span>
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                อัตรา: {liveUtiRate.toFixed(2)} ‰ วันคาสาย
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">จำนวน Pt ใส่สายสวน</label>
                <input
                  type="number"
                  min="0"
                  value={utiPatients}
                  onChange={(e) => setUtiPatients(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">จำนวนวันคาสายสวน</label>
                <input
                  type="number"
                  min="0"
                  value={catheterDays}
                  onChange={(e) => setCatheterDays(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-bold text-amber-900">ครั้งเกิด UTI</label>
                <input
                  type="number"
                  min="0"
                  value={utiCases}
                  onChange={(e) => setUtiCases(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                />
              </div>
            </div>
          </div>

          {/* 2. VAP Section */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-rose-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-600" />
                2. การติดเชื้อระบบทางเดินหายใจ (VAP - เครื่องช่วยหายใจ)
              </span>
              <span className="text-xs font-black text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md">
                อัตรา: {liveVapRate.toFixed(2)} ‰ วันครองเครื่อง
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">จำนวน Pt ใส่เครื่อง</label>
                <input
                  type="number"
                  min="0"
                  value={vapPatients}
                  onChange={(e) => setVapPatients(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">จำนวนวันครองเครื่อง</label>
                <input
                  type="number"
                  min="0"
                  value={ventilatorDays}
                  onChange={(e) => setVentilatorDays(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-bold text-rose-900">ครั้งเกิด VAP</label>
                <input
                  type="number"
                  min="0"
                  value={vapCases}
                  onChange={(e) => setVapCases(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                />
              </div>
            </div>
          </div>

          {/* 3. Phlebitis Section */}
          <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-indigo-900 flex items-center gap-1.5">
                <Syringe className="w-4 h-4 text-indigo-600" />
                3. หลอดเลือดดำอักเสบในผู้ป่วยให้ IV (Phlebitis)
              </span>
              <span className="text-xs font-black text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-md">
                อัตรา: {livePhlebitisRate.toFixed(2)} ‰ วันให้ IV
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">จำนวน Pt ให้ IV</label>
                <input
                  type="number"
                  min="0"
                  value={ivPatients}
                  onChange={(e) => setIvPatients(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">จำนวนวันให้ IV</label>
                <input
                  type="number"
                  min="0"
                  value={ivDays}
                  onChange={(e) => setIvDays(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-bold text-indigo-900">ครั้งเกิด Phlebitis</label>
                <input
                  type="number"
                  min="0"
                  value={phlebitisCases}
                  onChange={(e) => setPhlebitisCases(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
              </div>
            </div>
          </div>

          {/* 4. SSI & 5. UVC/CLABSI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SSI */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-purple-900 flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-purple-600" />
                  4. แผลผ่าตัด (SSI 01)
                </span>
                <span className="text-xs font-black text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md">
                  {liveSsiRate.toFixed(2)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">แผลผ่าตัด01</label>
                  <input
                    type="number"
                    min="0"
                    value={surgicalWounds}
                    onChange={(e) => setSurgicalWounds(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1 font-bold text-purple-900">ติดเชื้อ SSI</label>
                  <input
                    type="number"
                    min="0"
                    value={ssiCases}
                    onChange={(e) => setSsiCases(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none font-bold"
                  />
                </div>
              </div>
            </div>

            {/* UVC / CLABSI */}
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-red-900 flex items-center gap-1.5">
                  5. UVC / CLABSI (หลอดเลือดส่วนกลาง)
                </span>
                <span className="text-xs font-black text-red-800 bg-red-100 px-2 py-0.5 rounded-md">
                  {liveUvcRate.toFixed(2)} ‰ วัน
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Pt UVC</label>
                  <input
                    type="number"
                    min="0"
                    value={uvcPatients}
                    onChange={(e) => setUvcPatients(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">วัน UVC</label>
                  <input
                    type="number"
                    min="0"
                    value={uvcDays}
                    onChange={(e) => setUvcDays(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1 font-bold text-red-900">เกิด CLABSI</label>
                  <input
                    type="number"
                    min="0"
                    value={uvcClabsiCases}
                    onChange={(e) => setUvcClabsiCases(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hospital-Wide Stats */}
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase text-teal-900">
                ข้อมูลภาพรวมหอผู้ป่วย & วันนอน (Hospital Patient Days)
              </span>
              <span className="text-xs font-black text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                อัตราติดเชื้อรวม: {liveHaiRate.toFixed(2)} ‰ วันนอน
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">จำนวนวันนอนทั้งหมด</label>
                <input
                  type="number"
                  min="0"
                  value={totalPatientDays}
                  onChange={(e) => setTotalPatientDays(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-bold text-teal-900">ครั้งการติดเชื้อรวม</label>
                <input
                  type="number"
                  min="0"
                  value={totalInfections}
                  onChange={(e) => setTotalInfections(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Pt ติดเชื้อใน ร.พ.</label>
                <input
                  type="number"
                  min="0"
                  value={hospitalInfectedPatients}
                  onChange={(e) => setHospitalInfectedPatients(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">จำนวนวันจำหน่าย</label>
                <input
                  type="number"
                  min="0"
                  value={dischargeDays}
                  onChange={(e) => setDischargeDays(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-6 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกข้อมูลและคำนวณอัตรา</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
