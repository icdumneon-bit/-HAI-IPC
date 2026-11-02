import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Hospital, UserCheck, Lock } from 'lucide-react';
import { UserProfile } from '../types/surveillance';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('icdumneon@gmail.com');
  const [name, setName] = useState('พว. สุภาพร พงษ์สวัสดิ์ (ICN)');
  const [role, setRole] = useState<UserProfile['role']>('IC_NURSE');
  const [hospital, setHospital] = useState('โรงพยาบาลศูนย์การแพทย์ (IC Unit)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const roleMap: Record<UserProfile['role'], string> = {
      IC_NURSE: 'พยาบาลควบคุมการติดเชื้อ (ICN)',
      IC_DOCTOR: 'แพทย์ควบคุมโรค / ประธาน IC',
      WARD_NURSE: 'พยาบาลประจำหอผู้ป่วย',
      DIRECTOR: 'ผู้อำนวยการโรงพยาบาล',
      VIEWER: 'ผู้สังเกตการณ์',
    };

    const newUser: UserProfile = {
      email,
      name: name || email.split('@')[0],
      role,
      roleLabel: roleMap[role],
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}&backgroundColor=0d9488`,
      hospital,
    };

    onLogin(newUser);
    onClose();
  };

  const handleQuickPreset = (presetEmail: string, presetName: string, presetRole: UserProfile['role']) => {
    setEmail(presetEmail);
    setName(presetName);
    setRole(presetRole);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-teal-700 to-emerald-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">เข้าสู่ระบบด้วย Gmail</h2>
              <p className="text-xs text-teal-100">ระบบควบคุมและเฝ้าระวังการติดเชื้อในโรงพยาบาล</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              เลือกบัญชีด่วน (Quick Profiles)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleQuickPreset('icdumneon@gmail.com', 'พว. นริศรา รัตนศิริ (ICN)', 'IC_NURSE')
                }
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  email === 'icdumneon@gmail.com'
                    ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="font-semibold text-teal-700">icdumneon@gmail.com</div>
                <div className="text-[11px] text-slate-500 truncate">พยาบาล ICN ประจำ ร.พ.</div>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickPreset('director.ic@hospital.org', 'นพ. วิวัฒน์ (ประธาน IC)', 'IC_DOCTOR')
                }
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  email === 'director.ic@hospital.org'
                    ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="font-semibold text-slate-800">IC Chairman</div>
                <div className="text-[11px] text-slate-500 truncate">แพทย์ระบาดวิทยา</div>
              </button>
            </div>
          </div>

          {/* Email input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ที่อยู่อีเมล Gmail <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Name input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">ชื่อ-สกุล / รหัสเจ้าหน้าที่</label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อ-นามสกุล หรือ รหัส ICN"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">บทบาทหน้าที่ (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserProfile['role'])}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
            >
              <option value="IC_NURSE">พยาบาลควบคุมการติดเชื้อ (Infection Control Nurse - ICN)</option>
              <option value="IC_DOCTOR">แพทย์ควบคุมโรค / ประธานคณะกรรมการ IC</option>
              <option value="WARD_NURSE">พยาบาลประจำหอผู้ป่วย (Ward Staff Nurse)</option>
              <option value="DIRECTOR">ผู้บริหาร / ผู้อำนวยการโรงพยาบาล</option>
            </select>
          </div>

          {/* Hospital unit */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">หน่วยงาน / โรงพยาบาล</label>
            <div className="relative">
              <Hospital className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="ชื่อโรงพยาบาล"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Official Google sign-in style button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-300 rounded-xl shadow-xs transition-all hover:shadow-md cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>ยืนยันเข้าสู่ระบบด้วย Gmail</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" />
            ข้อมูลได้รับการเข้ารหัสและบันทึกความปลอดภัยตามมาตรฐาน PDPA ด้านสาธารณสุข
          </p>
        </form>
      </div>
    </div>
  );
};
