import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { SurveillanceTable } from './components/SurveillanceTable';
import { RealTimeAlerts } from './components/RealTimeAlerts';
import { LoginModal } from './components/LoginModal';
import { DataEntryModal } from './components/DataEntryModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { CareBundleGuideModal } from './components/CareBundleGuideModal';
import { ReportModal } from './components/ReportModal';
import { INITIAL_SURVEILLANCE_DATA, INITIAL_BENCHMARKS } from './data/initialData';
import {
  WardSurveillanceRecord,
  UserProfile,
  GoogleSheetsConfig,
  SurveillanceAlert,
} from './types/surveillance';
import { calculateSummary, generateAlerts, calculateWardRates } from './utils/calculations';
import { ShieldCheck, Activity, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

const LOCAL_STORAGE_DATA_KEY = 'ic_surveillance_records_v1';
const LOCAL_STORAGE_USER_KEY = 'ic_surveillance_user_v1';
const LOCAL_STORAGE_SHEETS_KEY = 'ic_surveillance_sheets_config_v1';

export default function App() {
  // 1. Current Logged-in Gmail User
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Default initial user from metadata request
    return {
      email: 'icdumneon@gmail.com',
      name: 'พว. สุภาพร พงษ์สวัสดิ์ (ICN)',
      role: 'IC_NURSE',
      roleLabel: 'พยาบาลควบคุมการติดเชื้อ (ICN)',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=icdumneon&backgroundColor=0d9488',
      hospital: 'โรงพยาบาลศูนย์การแพทย์ (กลุ่มงาน IC)',
    };
  });

  // 2. Surveillance Records
  const [records, setRecords] = useState<WardSurveillanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_SURVEILLANCE_DATA;
  });

  // 3. Google Sheets Config
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SHEETS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      sheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      sheetName: 'ข้อมูลเฝ้าระวัง IC 2026',
      webAppUrl: '',
      autoSync: false,
      syncIntervalMinutes: 15,
      lastSyncedAt: new Date().toISOString(),
      status: 'idle',
    };
  });

  // 4. Navigation & Modals State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedWardFilter, setSelectedWardFilter] = useState<string | null>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDataEntryOpen, setIsDataEntryOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<WardSurveillanceRecord | null>(null);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isCareBundleOpen, setIsCareBundleOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Persist records
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(records));
    } catch (e) {}
  }, [records]);

  // Persist user
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
      }
    } catch (e) {}
  }, [user]);

  // Persist sheets config
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SHEETS_KEY, JSON.stringify(sheetsConfig));
    } catch (e) {}
  }, [sheetsConfig]);

  // Computed Summaries & Alerts
  const summary = calculateSummary(records);
  const alerts = generateAlerts(records, INITIAL_BENCHMARKS);

  // Handlers
  const handleSaveRecord = (updatedRecord: WardSurveillanceRecord) => {
    setRecords((prev) => {
      const idx = prev.findIndex((r) => r.ward === updatedRecord.ward);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedRecord;
        return next;
      }
      return [updatedRecord, ...prev];
    });
    showToast(`บันทึกข้อมูลหอผู้ป่วย ${updatedRecord.ward} สำเร็จ และคำนวณอัตราใหม่เรียบร้อย`);
  };

  const handleEditRecord = (rec: WardSurveillanceRecord) => {
    setRecordToEdit(rec);
    setIsDataEntryOpen(true);
  };

  const handleImportRecords = (newRecords: WardSurveillanceRecord[]) => {
    setRecords(newRecords);
    showToast(`อัปเดตข้อมูลจาก Google Sheet สำเร็จ (${newRecords.length} หอผู้ป่วย)`);
    setIsSheetsModalOpen(false);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    showToast('รับทราบและบันทึกการติดตามเหตุการณ์เรียบร้อย');
  };

  const handleSelectWardFromOverview = (ward: string) => {
    setSelectedWardFilter(ward);
    setActiveTab('table1');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={() => {
          setUser(null);
          showToast('ออกจากระบบเรียบร้อย');
        }}
        onOpenSheets={() => setIsSheetsModalOpen(true)}
        onOpenDataEntry={() => {
          setRecordToEdit(null);
          setIsDataEntryOpen(true);
        }}
        onOpenCareBundle={() => setIsCareBundleOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        activeAlertsCount={summary.activeAlertsCount}
        criticalAlertsCount={summary.criticalAlertsCount}
        sheetsConfig={sheetsConfig}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'sheets') {
            setIsSheetsModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onSyncSheets={() => {
          showToast('กำลังซิงค์ข้อมูลกับฐานข้อมูล Google Sheets...');
        }}
      />

      {/* Main Dashboard Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <DashboardOverview
            records={records}
            summary={summary}
            alerts={alerts}
            onSelectWard={handleSelectWardFromOverview}
            onNavigateToAlerts={() => setActiveTab('alerts')}
            onNavigateToTable={() => setActiveTab('table1')}
          />
        )}

        {activeTab === 'table1' && (
          <SurveillanceTable
            records={records}
            summary={summary}
            onEditRecord={handleEditRecord}
            selectedWard={selectedWardFilter}
            tableType="table1"
          />
        )}

        {activeTab === 'table2' && (
          <SurveillanceTable
            records={records}
            summary={summary}
            onEditRecord={handleEditRecord}
            selectedWard={selectedWardFilter}
            tableType="table2"
          />
        )}

        {activeTab === 'alerts' && (
          <RealTimeAlerts
            alerts={alerts}
            currentUser={user}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onOpenCareBundle={() => setIsCareBundleOpen(true)}
          />
        )}
      </main>

      {/* Hospital Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-800">
              ระบบเฝ้าระวังการติดเชื้อในโรงพยาบาล (IC-Surveillance Pro)
            </span>
            <span>• พัฒนาสำหรับงานควบคุมโรคติดเชื้อ (Infection Control)</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>ฐานข้อมูล: Google Sheets Real-time Database</span>
            <span>ผู้ใช้ระบบ: {user?.email || 'Guest'}</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={(newUser) => {
          setUser(newUser);
          showToast(`ยินดีต้อนรับ ${newUser.name} (${newUser.email})`);
        }}
      />

      <DataEntryModal
        isOpen={isDataEntryOpen}
        onClose={() => {
          setIsDataEntryOpen(false);
          setRecordToEdit(null);
        }}
        recordToEdit={recordToEdit}
        onSave={handleSaveRecord}
        currentUser={user}
      />

      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        config={sheetsConfig}
        onSaveConfig={(newConfig) => {
          setSheetsConfig(newConfig);
          showToast('บันทึกการตั้งค่า Google Sheets เรียบร้อย');
        }}
        records={records}
        onImportRecords={handleImportRecords}
      />

      <CareBundleGuideModal
        isOpen={isCareBundleOpen}
        onClose={() => setIsCareBundleOpen(false)}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        records={records}
        summary={summary}
        user={user}
      />
    </div>
  );
}
