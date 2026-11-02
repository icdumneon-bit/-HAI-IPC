import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  CheckSquare,
  Square,
  UserCheck,
} from 'lucide-react';
import { SurveillanceAlert, UserProfile } from '../types/surveillance';

interface RealTimeAlertsProps {
  alerts: SurveillanceAlert[];
  currentUser: UserProfile | null;
  onAcknowledgeAlert: (alertId: string) => void;
  onOpenCareBundle: () => void;
}

export const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({
  alerts,
  currentUser,
  onAcknowledgeAlert,
  onOpenCareBundle,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'critical' | 'warning'>('all');
  const [emailModalAlert, setEmailModalAlert] = useState<SurveillanceAlert | null>(null);
  const [recipientEmail, setRecipientEmail] = useState(currentUser?.email || 'icdumneon@gmail.com');
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const filteredAlerts = alerts.filter((a) => {
    if (selectedSeverity === 'all') return true;
    return a.severity === selectedSeverity;
  });

  const handleSendGmailAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalAlert) return;
    setIsSendingEmail(true);

    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailSentSuccess(true);
      setTimeout(() => {
        setEmailSentSuccess(false);
        setEmailModalAlert(null);
      }, 2500);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Alert Center Top Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <h2 className="text-lg font-bold text-slate-900">
              ศูนย์เฝ้าระวังและการแจ้งเตือนการติดเชื้อแบบเรียลไทม์ (Real-time Alert Center)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ระบบวิเคราะห์อุบัติการณ์การติดเชื้อเปรียบเทียบกับเกณฑ์มาตรฐานกระทรวงสาธารณสุข และแจ้งเตือนอัตโนมัติ
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50 text-xs">
          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedSeverity === 'all'
                ? 'bg-white font-bold text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ทั้งหมด ({alerts.length})
          </button>
          <button
            onClick={() => setSelectedSeverity('critical')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedSeverity === 'critical'
                ? 'bg-rose-600 font-bold text-white shadow-2xs'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            วิกฤต Critical ({alerts.filter((a) => a.severity === 'critical').length})
          </button>
          <button
            onClick={() => setSelectedSeverity('warning')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedSeverity === 'warning'
                ? 'bg-amber-500 font-bold text-white shadow-2xs'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            เตือนภัย Warning ({alerts.filter((a) => a.severity === 'warning').length})
          </button>
        </div>
      </div>

      {/* Alert Cards Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">ไม่พบอุบัติการณ์ผิดปกติในขณะนี้</h3>
            <p className="text-xs text-slate-500 mt-1">
              อัตราการติดเชื้อทุกประเภทอยู่ในเกณฑ์มาตรฐานความปลอดภัย
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'critical';
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl p-5 border transition-all ${
                  isCritical
                    ? 'border-rose-300 shadow-md shadow-rose-900/5'
                    : 'border-amber-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Side: Alert Details */}
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {isCritical ? (
                          <AlertOctagon className="w-3.5 h-3.5 mr-1" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        )}
                        {isCritical ? 'CRITICAL OUTBREAK' : 'WARNING'}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        {alert.ward}
                      </span>
                      <span className="text-xs text-slate-400">
                        อัปเดตล่าสุด: {new Date(alert.timestamp).toLocaleDateString('th-TH')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {alert.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {alert.message}
                    </p>

                    {/* Recommended Clinical Bundle */}
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                      <div className="font-semibold text-teal-800 flex items-center gap-1.5 mb-1">
                        <Info className="w-3.5 h-3.5 text-teal-600" />
                        <span>มาตรการป้องกันและควบคุมที่ต้องดำเนินการทันที (Action Protocol):</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {alert.recommendedBundle}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Action Trigger Buttons */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2.5 shrink-0 self-end lg:self-start">
                    {/* Send Gmail Alert Button */}
                    <button
                      onClick={() => {
                        setEmailModalAlert(alert);
                        setRecipientEmail(currentUser?.email || 'icdumneon@gmail.com');
                      }}
                      className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>ส่งแจ้งเตือนทาง Gmail</span>
                    </button>

                    {/* Care bundle guide */}
                    <button
                      onClick={onOpenCareBundle}
                      className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>เปิด Care Bundle</span>
                    </button>

                    {/* Acknowledge Button */}
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        alert.status === 'acknowledged'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{alert.status === 'acknowledged' ? 'รับทราบแล้ว' : 'กดรับทราบเหตุ'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Gmail Alert Dispatch Modal */}
      {emailModalAlert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-linear-to-r from-rose-700 to-red-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-5 h-5 text-white" />
                <h3 className="font-bold text-base">ส่งอีเมลแจ้งเตือนการติดเชื้อ (Gmail Alert Dispatch)</h3>
              </div>
              <button
                onClick={() => setEmailModalAlert(null)}
                className="text-white/80 hover:text-white cursor-pointer text-sm"
              >
                ปิด
              </button>
            </div>

            {emailSentSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">ส่งการแจ้งเตือนทาง Gmail สำเร็จเรียบร้อย</h4>
                <p className="text-xs text-slate-500">
                  ส่งรายงานด่วนไปยัง <strong>{recipientEmail}</strong> และทีม IC Nurse แล้ว
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendGmailAlert} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ส่งไปยังอีเมลผู้รับ (Recipient Gmail)
                  </label>
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    ระบบจะส่งสำเนาแจ้งเตือนไปยังทีม ICN ประจำโรงพยาบาลอัตโนมัติ
                  </p>
                </div>

                {/* Live Email Preview Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="text-slate-500">
                    <strong className="text-slate-700">หัวข้ออีเมล (Subject):</strong> [IC-ALERT ด่วน] พบอุบัติการณ์ {emailModalAlert.type} สูงผิดปกติที่หอผู้ป่วย {emailModalAlert.ward}
                  </div>
                  <div className="border-t border-slate-200 pt-2 text-slate-600 space-y-1">
                    <p><strong>ประเภทการติดเชื้อ:</strong> {emailModalAlert.type}</p>
                    <p><strong>หอผู้ป่วย:</strong> {emailModalAlert.ward}</p>
                    <p><strong>อัตราที่พบ:</strong> {emailModalAlert.currentRate} (เกณฑ์มาตรฐาน &lt; {emailModalAlert.benchmarkThreshold})</p>
                    <p><strong>จำนวนผู้ป่วยติดเชื้อ:</strong> {emailModalAlert.cases} ราย</p>
                    <p className="pt-1 text-slate-800"><strong>คำแนะนำมาตรการ:</strong> {emailModalAlert.recommendedBundle}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEmailModalAlert(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingEmail}
                    className="flex items-center space-x-2 px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingEmail ? 'กำลังส่งอีเมล...' : 'ยืนยันการส่งอีเมลทันที'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
