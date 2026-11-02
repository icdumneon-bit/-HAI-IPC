import React, { useState } from 'react';
import { X, BookOpen, CheckSquare, ShieldCheck, HeartPulse, Activity, Syringe, Scissors, Droplets } from 'lucide-react';

interface CareBundleGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareBundleGuideModal: React.FC<CareBundleGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'cauti' | 'vap' | 'phlebitis' | 'ssi' | 'clabsi'>('cauti');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-linear-to-r from-teal-800 to-indigo-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-5 h-5 text-teal-300" />
            <div>
              <h3 className="font-bold text-base">คู่มือมาตรฐานการปฏิบัติการป้องกันการติดเชื้อ (Care Bundles)</h3>
              <p className="text-xs text-teal-200">
                Evidence-Based Infection Control Protocols & Bundles for Healthcare Personnel
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-white/80 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('cauti')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'cauti'
                ? 'border-amber-600 text-amber-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>CAUTI Bundle (สายสวนปัสสาวะ)</span>
          </button>

          <button
            onClick={() => setActiveTab('vap')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'vap'
                ? 'border-rose-600 text-rose-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>VAP Bundle (เครื่องช่วยหายใจ)</span>
          </button>

          <button
            onClick={() => setActiveTab('phlebitis')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'phlebitis'
                ? 'border-indigo-600 text-indigo-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Syringe className="w-3.5 h-3.5" />
            <span>Phlebitis & IV Care</span>
          </button>

          <button
            onClick={() => setActiveTab('ssi')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'ssi'
                ? 'border-purple-600 text-purple-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>SSI Bundle (แผลผ่าตัด)</span>
          </button>

          <button
            onClick={() => setActiveTab('clabsi')}
            className={`px-3 py-2 border-b-2 rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'clabsi'
                ? 'border-red-600 text-red-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>CLABSI & UVC Bundle</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 text-xs text-slate-700">
          {activeTab === 'cauti' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                มาตรการป้องกันการติดเชื้อในระบบทางเดินปัสสาวะจากการคาสายสวน (CAUTI Bundle)
              </h4>
              <ul className="space-y-2 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>ประเมินความจำเป็นทุกวัน (Daily Assessment):</strong> ถอดสายสวนทันทีที่หมดข้อบ่งชี้เพื่อลดจำนวนวันคาสายสวน (Catheter-days)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>เทคนิคปลอดเชื้อขณะใส่ (Aseptic Technique):</strong> ล้างมือก่อนและหลัง ใส่ถุงมือ sterile และใช้อุปกรณ์ sterile เท่านั้น</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>รักษาระบบปิด (Closed Drainage System):</strong> ห้ามปลดข้อต่อสายสวนโดยไม่จำเป็น และเทปัสสาวะก่อนเต็ม 3/4 ของถุง</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>ตำแหน่งถุงปัสสาวะ:</strong> แขวนถุงต่ำกว่าระดับกระเพาะปัสสาวะเสมอ และไม่ให้ถุงสัมผัสพื้น</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>สุขอนามัย Meatal Hygiene:</strong> ทำความสะอาดอวัยวะสืบพันธุ์ภายนอกด้วยน้ำสะอาดหรือน้ำสบู่ทุกวัน หลีกเลี่ยงน้ำยาฆ่าเชื้อแรง</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'vap' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                มาตรการป้องกันปอดอักเสบจากการใช้เครื่องช่วยหายใจ (Ventilator Bundle)
              </h4>
              <ul className="space-y-2 bg-rose-50/50 p-4 rounded-xl border border-rose-200">
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <span><strong>จัดท่านอนศีรษะสูง (Head-of-bed elevation):</strong> ยกหัวเตียงสูง 30-45 องศาตลอดเวลาเพื่อป้องกันการสำลัก (Aspiration)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <span><strong>การดูแลสุขอนามัยช่องปาก (Oral Care):</strong> ทำความสะอาดช่องปากด้วย 0.12% Chlorhexidine วันละ 2-4 ครั้ง</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <span><strong>ประเมินความพร้อมในการหย่าเครื่อง (Sedation Vacation & SBT):</strong> ลดการใช้ยาสงบประสาทและประเมินถอดท่อทุกวัน</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  <span><strong>Subglottic Secretion Drainage:</strong> ดูดเสมหะเหนือ Cuff อย่างสม่ำเสมอ และตรวจวัด Cuff pressure ให้อยู่ในช่วง 20-30 cmH2O</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'phlebitis' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                มาตรการป้องกันและประเมินหลอดเลือดดำส่วนปลายอักเสบ (Visual Infusion Phlebitis - VIP Score)
              </h4>
              <ul className="space-y-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-200">
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                  <span><strong>ประเมิน VIP Score ทุกเวร (Every shift):</strong> สังเกตอาการบวม แดง ร้อน ปวด หรือคลำได้เส้นเลือดแข็ง</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                  <span><strong>Skin Antisepsis:</strong> ฟอกผิวหนังด้วย 2% Chlorhexidine in 70% Alcohol นาน 30 วินาทีและรอให้แห้งสนิทก่อนแทงเข็ม</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                  <span><strong>ปิดด้วยแผ่นฟิล์มใสปลอดเชื้อ (Transparent Dressing):</strong> เพื่อให้มองเห็นตำแหน่งแทงเข็มได้ตลอดเวลา</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                  <span><strong>ถอดสายทันทีเมื่อ VIP Score ≥ 2:</strong> หรือเมื่อผู้ป่วยมีอาการปวดเส้นเลือด บวมแดง หรือมีหนอง</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'ssi' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                มาตรการป้องกันการติดเชื้อตำแหน่งแผลผ่าตัด (Surgical Site Infection Bundle)
              </h4>
              <ul className="space-y-2 bg-purple-50/50 p-4 rounded-xl border border-purple-200">
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <span><strong>ยาปฏิชีวนะป้องกันก่อนผ่าตัด (Prophylactic Antibiotics):</strong> ให้ยาเข้าทางหลอดเลือดดำเสร็จสิ้นภายใน 60 นาทีก่อนลงมีดผ่าตัด</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <span><strong>การเตรียมผิวหนัง:</strong> ห้ามโกนขนด้วยมีดโกน (ใช้ Clipper เฉพาะบริเวณที่จำเป็นเท่านั้น) และฟอกด้วยน้ำยาฆ่าเชื้อ</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <span><strong>ควบคุมระดับน้ำตาลในเลือด (Glycemic Control):</strong> ควบคุม Blood Glucose &lt; 200 mg/dL ในช่วงระหว่างและหลังผ่าตัด</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                  <span><strong>ควบคุมอุณหภูมิกาย (Normothermia):</strong> รักษาระดับอุณหภูมิร่างกายผู้ป่วยให้อยู่ในช่วงปกติระหว่างผ่าตัด</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'clabsi' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                มาตรการป้องกันการติดเชื้อในกระแสเลือดจากสายสวนหลอดเลือดดำส่วนกลางและสายสะดือ (CLABSI & UVC Bundle)
              </h4>
              <ul className="space-y-2 bg-red-50/50 p-4 rounded-xl border border-red-200">
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span><strong>Maximal Sterile Barrier Precautions:</strong> ผู้ใส่สายสวนต้องสวมหมวก หน้ากาก เสื้อกาวน์ปลอดเชื้อ ถุงมือ และใช้ผ้าคลุมตัวขนาดใหญ่เต็มตัว</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span><strong>Skin Prep:</strong> ฟอกผิวหนังด้วย 2% Chlorhexidine gluconate ใน 70% Isopropyl alcohol และรอให้แห้งสนิท</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span><strong>Scrub the Hub:</strong> เช็ดถูจุกต่อ (Access hub / Needleless connector) ด้วย 70% Alcohol นานอย่างน้อย 15 วินาทีทุกครั้งก่อนให้ยา</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckSquare className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span><strong>การประเมินถอดสาย UVC ใน NICU:</strong> ติดตามและถอดสายสะดือ UVC ทันทีที่ผู้ป่วยรับสารอาหารทางลำไส้ได้ดี ไม่คาสายเกินความจำเป็น</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
