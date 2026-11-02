export interface WardSurveillanceRecord {
  id: string;
  ward: string; // e.g. 'ศช', 'ศญ', 'ICU', 'NICU', etc.
  wardName: string; // Friendly name e.g. 'ศัลยกรรมชาย'
  wardType: 'surgical' | 'medical' | 'icu' | 'pediatric' | 'special' | 'other';
  month: string; // e.g. '2026-10'

  // 1. UTI (Urinary Tract Infection / CAUTI)
  utiPatients: number; // จำนวน Pt ใส่สายสวน
  catheterDays: number; // จำนวนวันคาสายสวน
  utiCases: number; // จำนวนครั้งเกิด UTI
  utiRate: number; // อัตราการเกิด UTI ต่อ 1,000 วันคาสายสวน

  // 2. VAP (Ventilator-Associated Pneumonia)
  vapPatients: number; // จำนวน Pt ใส่เครื่อง
  ventilatorDays: number; // จำนวนวันครองเครื่อง
  vapCases: number; // จำนวนครั้งเกิด VAP
  vapRate: number; // อัตราการเกิด VAP ต่อ 1,000 วันครองเครื่อง

  // 3. Phlebitis (หลอดเลือดดำส่วนปลายอักเสบ)
  ivPatients: number; // จำนวน Pt ให้ IV
  ivDays: number; // จำนวนวันให้ IV
  phlebitisCases: number; // จำนวนครั้งเกิด Phlebitis
  phlebitisRate: number; // อัตราการเกิด Phlebitis ต่อ 1,000 วันให้ IV

  // 4. SSI (Surgical Site Infection)
  surgicalWounds: number; // จำนวนแผลผ่าตัด01
  ssiCases: number; // จำนวนครั้งติดเชื้อ แผลผ่าตัด01
  ssiRate: number; // อัตราการเกิด SSI (%)

  // 5. CLABSI & UVC-BSI (Central Line & Umbilical Venous Catheter BSI)
  uvcPatients: number; // จำนวน Pt UVC
  uvcDays: number; // จำนวนวัน UVC
  uvcClabsiCases: number; // จำนวนครั้งเกิด CLABSI (UVC)
  uvcClabsiRate: number; // อัตราการเกิดเกิด CLABSI (UVC)

  clinePatients?: number; // C-line patients
  clineDays?: number; // C-line days
  clineClabsiCases?: number; // เกิด CLABSI (C-line)
  clineClabsiRate?: number; // อัตรา CLABSI (C-line)

  // Overall Hospital Stats
  infectedPatients: number; // จำนวน Pt ที่ติดเชื้อ
  totalPatientDays: number; // จำนวนวันนอนของผู้ป่วย
  totalInfections: number; // ของการติดเชื้อ
  hospitalInfectionRate: number; // อัตราการติดเชื้อใน ร.พ ต่อ 1,000 วันนอน
  hospitalInfectedPatients: number; // จำนวนผู้ป่วยเชื้อใน ร.พ
  dischargeDays: number; // จำนวนวันจำหน่าย

  // Extended Metrics (Table 2)
  sstPatients?: number; // SST
  sstDays?: number; // นอน ร.พ. SST
  sstCases?: number; // เกิด SST
  sstRate?: number; // SST rate

  hapDays?: number; // นอน ร.พ. HAP
  hapCases?: number; // เกิด HAP
  hapRate?: number; // HAP rate

  mdrTotal?: number; // MDR ทั้งหมด
  mdrDays?: number; // นอน MDR
  mdrNiCases?: number; // NI MDR
  mdrRate?: number; // MDR rate

  surgicalCsCases?: number; // ติดเชื้อ C/S
  surgicalCsWounds?: number; // แผลผ่าตัด C/S
  ssiCsRate?: number; // SSI C/S rate

  lastUpdated: string;
  updatedBy: string;
}

export interface SurveillanceAlert {
  id: string;
  ward: string;
  type: 'UTI' | 'VAP' | 'Phlebitis' | 'SSI' | 'CLABSI' | 'MDR' | 'HAP' | 'OVERALL';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  currentRate: number;
  benchmarkThreshold: number;
  cases: number;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  recommendedBundle: string;
}

export interface UserProfile {
  email: string;
  name: string;
  role: 'IC_NURSE' | 'IC_DOCTOR' | 'WARD_NURSE' | 'DIRECTOR' | 'VIEWER';
  roleLabel: string;
  ward?: string;
  avatarUrl: string;
  hospital: string;
}

export interface GoogleSheetsConfig {
  sheetId: string;
  sheetName: string;
  webAppUrl: string; // Google Apps Script Webhook URL
  autoSync: boolean;
  syncIntervalMinutes: number;
  lastSyncedAt: string | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}

export interface InfectionBenchmark {
  type: 'UTI' | 'VAP' | 'Phlebitis' | 'SSI' | 'CLABSI' | 'OVERALL';
  name: string;
  unit: string;
  thresholdWarning: number;
  thresholdCritical: number;
  description: string;
}
