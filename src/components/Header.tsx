import React from 'react';
import { Activity, Bell, ShieldAlert, FileSpreadsheet, PlusCircle, LogOut, BookOpen, RefreshCw, UserCheck, FileText } from 'lucide-react';
import { UserProfile, GoogleSheetsConfig } from '../types/surveillance';

interface HeaderProps {
  user: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenSheets: () => void;
  onOpenDataEntry: () => void;
  onOpenCareBundle: () => void;
  onOpenReport: () => void;
  activeAlertsCount: number;
  criticalAlertsCount: number;
  sheetsConfig: GoogleSheetsConfig;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSyncSheets: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenLogin,
  onLogout,
  onOpenSheets,
  onOpenDataEntry,
  onOpenCareBundle,
  onOpenReport,
  activeAlertsCount,
  criticalAlertsCount,
  sheetsConfig,
  activeTab,
  setActiveTab,
  onSyncSheets,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & Hospital Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">IC-Surveillance Pro</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
                  ระบบเฝ้าระวังการติดเชื้อใน ร.พ.
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Hospital-Acquired Infection Surveillance & Outbreak Early Warning System
              </p>
            </div>
          </div>

          {/* Action buttons & User profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Google Sheets Status / Sync Button */}
            <button
              onClick={onOpenSheets}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                sheetsConfig.status === 'syncing'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
              }`}
              title="Google Sheets Database Connection"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Google Sheets</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>

            {/* Care Bundle Guidelines Button */}
            <button
              onClick={onOpenCareBundle}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
              title="แนวทางปฏิบัติ Care Bundles"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Care Bundles</span>
            </button>

            {/* Monthly Report Button */}
            <button
              onClick={onOpenReport}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all"
              title="พิมพ์รายงานประจำเดือน"
            >
              <FileText className="w-4 h-4 text-teal-600" />
              <span className="hidden md:inline">พิมพ์รายงาน IC</span>
            </button>

            {/* Quick Record Add Button */}
            <button
              onClick={onOpenDataEntry}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="font-semibold">+ บันทึกข้อมูล</span>
            </button>

            {/* Real-time Alert Tab Trigger with Ping */}
            <button
              onClick={() => setActiveTab('alerts')}
              className={`relative p-2 rounded-lg border transition-all ${
                activeTab === 'alerts'
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="การแจ้งเตือนแบบเรียลไทม์"
            >
              <Bell className="w-4 h-4" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 text-[10px] font-bold text-white items-center justify-center">
                    {activeAlertsCount}
                  </span>
                </span>
              )}
            </button>

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center pl-2 border-l border-slate-200 space-x-2">
                <div className="flex items-center space-x-2 bg-slate-50 py-1 px-2.5 rounded-lg border border-slate-200">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full border border-teal-500/40 object-cover"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-teal-600 font-medium truncate max-w-[120px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-all"
              >
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span>เข้าสู่ระบบ Gmail</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-teal-600 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            แดชบอร์ดสรุปภาพรวม (Overview)
          </button>
          <button
            onClick={() => setActiveTab('table1')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'table1'
                ? 'bg-teal-600 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            ตารางที่ 1: UTI / VAP / Phlebitis / SSI / CLABSI
          </button>
          <button
            onClick={() => setActiveTab('table2')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'table2'
                ? 'bg-teal-600 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            ตารางที่ 2: SST / HAP / เชื้อดื้อยา NI-MDR
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'alerts'
                ? 'bg-rose-600 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>การแจ้งเตือน Real-time</span>
            {activeAlertsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-rose-600 font-bold ml-1">
                {activeAlertsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'sheets'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>จัดการ Google Sheet</span>
          </button>
        </div>
      </div>
    </header>
  );
};
