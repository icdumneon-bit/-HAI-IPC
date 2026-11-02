import { WardSurveillanceRecord, SurveillanceAlert, InfectionBenchmark } from '../types/surveillance';
import { INITIAL_BENCHMARKS } from '../data/initialData';

// Clinical Infection Rate Calculations
export const safeRate = (cases: number, daysOrDenominator: number, multiplier = 1000): number => {
  if (!daysOrDenominator || daysOrDenominator <= 0) return 0;
  const rate = (cases / daysOrDenominator) * multiplier;
  return Number(rate.toFixed(2));
};

export const calculateWardRates = (record: WardSurveillanceRecord): WardSurveillanceRecord => {
  const utiRate = safeRate(record.utiCases, record.catheterDays, 1000);
  const vapRate = safeRate(record.vapCases, record.ventilatorDays, 1000);
  const phlebitisRate = safeRate(record.phlebitisCases, record.ivDays, 1000);
  const ssiRate = safeRate(record.ssiCases, record.surgicalWounds, 100);
  const uvcClabsiRate = safeRate(record.uvcClabsiCases, record.uvcDays, 1000);
  const hospitalInfectionRate = safeRate(record.totalInfections, record.totalPatientDays, 1000);

  const clineClabsiRate = record.clineDays ? safeRate(record.clineClabsiCases || 0, record.clineDays, 1000) : 0;
  const sstRate = record.sstDays ? safeRate(record.sstCases || 0, record.sstDays, 1000) : 0;
  const hapRate = record.hapDays ? safeRate(record.hapCases || 0, record.hapDays, 1000) : 0;
  const mdrRate = record.mdrDays ? safeRate(record.mdrNiCases || 0, record.mdrDays, 1000) : 0;

  return {
    ...record,
    utiRate,
    vapRate,
    phlebitisRate,
    ssiRate,
    uvcClabsiRate,
    hospitalInfectionRate,
    clineClabsiRate,
    sstRate,
    hapRate,
    mdrRate,
  };
};

export interface SurveillanceSummary {
  totalWards: number;
  totalPatientDays: number;
  totalInfections: number;
  overallHaiRate: number;

  totalCatheterPatients: number;
  totalCatheterDays: number;
  totalUtiCases: number;
  overallUtiRate: number;

  totalVentilatorPatients: number;
  totalVentilatorDays: number;
  totalVapCases: number;
  overallVapRate: number;

  totalIvPatients: number;
  totalIvDays: number;
  totalPhlebitisCases: number;
  overallPhlebitisRate: number;

  totalSurgicalWounds: number;
  totalSsiCases: number;
  overallSsiRate: number;

  totalUvcPatients: number;
  totalUvcDays: number;
  totalUvcClabsiCases: number;
  overallUvcClabsiRate: number;

  activeAlertsCount: number;
  criticalAlertsCount: number;
}

export const calculateSummary = (records: WardSurveillanceRecord[]): SurveillanceSummary => {
  let totalPatientDays = 0;
  let totalInfections = 0;

  let totalCatheterPatients = 0;
  let totalCatheterDays = 0;
  let totalUtiCases = 0;

  let totalVentilatorPatients = 0;
  let totalVentilatorDays = 0;
  let totalVapCases = 0;

  let totalIvPatients = 0;
  let totalIvDays = 0;
  let totalPhlebitisCases = 0;

  let totalSurgicalWounds = 0;
  let totalSsiCases = 0;

  let totalUvcPatients = 0;
  let totalUvcDays = 0;
  let totalUvcClabsiCases = 0;

  records.forEach((r) => {
    totalPatientDays += r.totalPatientDays || 0;
    totalInfections += r.totalInfections || 0;

    totalCatheterPatients += r.utiPatients || 0;
    totalCatheterDays += r.catheterDays || 0;
    totalUtiCases += r.utiCases || 0;

    totalVentilatorPatients += r.vapPatients || 0;
    totalVentilatorDays += r.ventilatorDays || 0;
    totalVapCases += r.vapCases || 0;

    totalIvPatients += r.ivPatients || 0;
    totalIvDays += r.ivDays || 0;
    totalPhlebitisCases += r.phlebitisCases || 0;

    totalSurgicalWounds += r.surgicalWounds || 0;
    totalSsiCases += r.ssiCases || 0;

    totalUvcPatients += r.uvcPatients || 0;
    totalUvcDays += r.uvcDays || 0;
    totalUvcClabsiCases += r.uvcClabsiCases || 0;
  });

  const alerts = generateAlerts(records, INITIAL_BENCHMARKS);

  return {
    totalWards: records.length,
    totalPatientDays,
    totalInfections,
    overallHaiRate: safeRate(totalInfections, totalPatientDays, 1000),

    totalCatheterPatients,
    totalCatheterDays,
    totalUtiCases,
    overallUtiRate: safeRate(totalUtiCases, totalCatheterDays, 1000),

    totalVentilatorPatients,
    totalVentilatorDays,
    totalVapCases,
    overallVapRate: safeRate(totalVapCases, totalVentilatorDays, 1000),

    totalIvPatients,
    totalIvDays,
    totalPhlebitisCases,
    overallPhlebitisRate: safeRate(totalPhlebitisCases, totalIvDays, 1000),

    totalSurgicalWounds,
    totalSsiCases,
    overallSsiRate: safeRate(totalSsiCases, totalSurgicalWounds, 100),

    totalUvcPatients,
    totalUvcDays,
    totalUvcClabsiCases,
    overallUvcClabsiRate: safeRate(totalUvcClabsiCases, totalUvcDays, 1000),

    activeAlertsCount: alerts.length,
    criticalAlertsCount: alerts.filter((a) => a.severity === 'critical').length,
  };
};

export const generateAlerts = (
  records: WardSurveillanceRecord[],
  benchmarks: InfectionBenchmark[] = INITIAL_BENCHMARKS
): SurveillanceAlert[] => {
  const alerts: SurveillanceAlert[] = [];

  const utiBench = benchmarks.find((b) => b.type === 'UTI') || INITIAL_BENCHMARKS[0];
  const vapBench = benchmarks.find((b) => b.type === 'VAP') || INITIAL_BENCHMARKS[1];
  const phlebitisBench = benchmarks.find((b) => b.type === 'Phlebitis') || INITIAL_BENCHMARKS[2];
  const ssiBench = benchmarks.find((b) => b.type === 'SSI') || INITIAL_BENCHMARKS[3];
  const clabsiBench = benchmarks.find((b) => b.type === 'CLABSI') || INITIAL_BENCHMARKS[4];
  const overallBench = benchmarks.find((b) => b.type === 'OVERALL') || INITIAL_BENCHMARKS[5];

  records.forEach((r) => {
    // 1. UTI Alert
    if (r.utiCases > 0 && r.utiRate >= utiBench.thresholdWarning) {
      alerts.push({
        id: `alert-uti-${r.ward}`,
        ward: r.ward,
        type: 'UTI',
        severity: r.utiRate >= utiBench.thresholdCritical ? 'critical' : 'warning',
        title: `พบอุบัติการณ์ CAUTI สูงผิดปกติที่ ${r.wardName}`,
        message: `อัตราการเกิด UTI อยู่ที่ ${r.utiRate} ต่อ 1,000 วันคาสายสวน (พบ ${r.utiCases} ราย เกณฑ์มาตรฐาน < ${utiBench.thresholdWarning})`,
        currentRate: r.utiRate,
        benchmarkThreshold: utiBench.thresholdWarning,
        cases: r.utiCases,
        timestamp: r.lastUpdated,
        status: 'active',
        recommendedBundle: 'CAUTI Prevention Care Bundle: ประเมินความจำเป็นในการคาสายสวนทุกวัน, ระบบปิด sterile, การทำความสะอาด Meatal hygiene ด้วยน้ำต้มสุก/น้ำเกลือ',
      });
    }

    // 2. VAP Alert
    if (r.vapCases > 0 && r.vapRate >= vapBench.thresholdWarning) {
      alerts.push({
        id: `alert-vap-${r.ward}`,
        ward: r.ward,
        type: 'VAP',
        severity: r.vapRate >= vapBench.thresholdCritical ? 'critical' : 'warning',
        title: `พบอุบัติการณ์ VAP สูงเกินเกณฑ์ที่ ${r.wardName}`,
        message: `อัตราการเกิด VAP อยู่ที่ ${r.vapRate} ต่อ 1,000 วันครองเครื่อง (พบ ${r.vapCases} ราย เกณฑ์มาตรฐาน < ${vapBench.thresholdWarning})`,
        currentRate: r.vapRate,
        benchmarkThreshold: vapBench.thresholdWarning,
        cases: r.vapCases,
        timestamp: r.lastUpdated,
        status: 'active',
        recommendedBundle: 'VAP Prevention Care Bundle: จัดท่านอนศีรษะสูง 30-45 องศา, การดูดเสมหะ Subglottic suctioning, ทำความสะอาดช่องปากด้วย 0.12% Chlorhexidine วันละ 2-4 ครั้ง, ประเมินการหย่าเครื่องช่วยหายใจ (SBT)',
      });
    }

    // 3. Phlebitis Alert
    if (r.phlebitisCases > 0 && r.phlebitisRate >= phlebitisBench.thresholdWarning) {
      alerts.push({
        id: `alert-phlebitis-${r.ward}`,
        ward: r.ward,
        type: 'Phlebitis',
        severity: r.phlebitisRate >= phlebitisBench.thresholdCritical ? 'critical' : 'warning',
        title: `อัตราหลอดเลือดดำอักเสบ (Phlebitis) เกินเกณฑ์ที่ ${r.wardName}`,
        message: `อัตรา Phlebitis อยู่ที่ ${r.phlebitisRate} ต่อ 1,000 วันให้ IV (พบ ${r.phlebitisCases} ราย เกณฑ์มาตรฐาน < ${phlebitisBench.thresholdWarning})`,
        currentRate: r.phlebitisRate,
        benchmarkThreshold: phlebitisBench.thresholdWarning,
        cases: r.phlebitisCases,
        timestamp: r.lastUpdated,
        status: 'active',
        recommendedBundle: 'VIP Score Assessment: ประเมินคะแนนหลอดเลือดดำอักเสบทุกเวร, ล้างมือและ Aseptic non-touch technique, เปลี่ยนตำแหน่งให้สารน้ำเมื่อมีอาการปวด/บวมแดงทันที',
      });
    }

    // 4. SSI Alert
    if (r.ssiCases > 0 && r.ssiRate >= ssiBench.thresholdWarning) {
      alerts.push({
        id: `alert-ssi-${r.ward}`,
        ward: r.ward,
        type: 'SSI',
        severity: r.ssiRate >= ssiBench.thresholdCritical ? 'critical' : 'warning',
        title: `พบการติดเชื้อตำแหน่งแผลผ่าตัด (SSI) เกินเป้าหมายที่ ${r.wardName}`,
        message: `อัตรา SSI อยู่ที่ ${r.ssiRate}% (พบ ${r.ssiCases} ราย จาก ${r.surgicalWounds} แผล เกณฑ์ < ${ssiBench.thresholdWarning}%)`,
        currentRate: r.ssiRate,
        benchmarkThreshold: ssiBench.thresholdWarning,
        cases: r.ssiCases,
        timestamp: r.lastUpdated,
        status: 'active',
        recommendedBundle: 'SSI Prevention Bundle: การให้ยาปฏิชีวนะป้องกันก่อนผ่าตัดภายใน 60 นาที (Prophylactic Antibiotics), อาบน้ำด้วยน้ำยาฆ่าเชื้อ, ควบคุมระดับน้ำตาลในเลือด, การดูแลแผลปลอดเชื้อ',
      });
    }

    // 5. CLABSI & UVC-BSI Alert
    if (r.uvcClabsiCases > 0 && r.uvcClabsiRate >= clabsiBench.thresholdWarning) {
      alerts.push({
        id: `alert-clabsi-${r.ward}`,
        ward: r.ward,
        type: 'CLABSI',
        severity: r.uvcClabsiRate >= clabsiBench.thresholdCritical ? 'critical' : 'warning',
        title: `วิกฤต! อัตราติดเชื้อ UVC-BSI สูงผิดปกติที่ ${r.wardName}`,
        message: `อัตราการเกิด CLABSI (UVC) อยู่ที่ ${r.uvcClabsiRate} ต่อ 1,000 วัน (พบ ${r.uvcClabsiCases} ราย เกณฑ์มาตรฐาน < ${clabsiBench.thresholdWarning})`,
        currentRate: r.uvcClabsiRate,
        benchmarkThreshold: clabsiBench.thresholdWarning,
        cases: r.uvcClabsiCases,
        timestamp: r.lastUpdated,
        status: 'active',
        recommendedBundle: 'CLABSI Insertion & Maintenance Bundle: เทคนิคปลอดเชื้อระดับสูงสุด (Full Barrier Precautions), ฟอกผิวหนังด้วย 2% Chlorhexidine in 70% Alcohol, Scrub the hub 15 วินาที, ประเมินถอดสายสะดือ/สายสวนทันทีที่ไม่จำเป็น',
      });
    }

    // 6. Overall HAI Rate Alert
    if (r.totalInfections > 0 && r.hospitalInfectionRate >= overallBench.thresholdCritical) {
      alerts.push({
        id: `alert-overall-${r.ward}`,
        ward: r.ward,
        type: 'OVERALL',
        severity: 'critical',
        title: `อัตราการติดเชื้อในโรงพยาบาลรวมสูงผิดปกติที่ ${r.wardName}`,
        message: `อัตราติดเชื้อรวม ${r.hospitalInfectionRate} ต่อ 1,000 วันนอน (พบผู้ป่วยติดเชื้อ ${r.totalInfections} ราย)`,
        currentRate: r.hospitalInfectionRate,
        benchmarkThreshold: overallBench.thresholdCritical,
        cases: r.totalInfections,
        timestamp: r.lastUpdated,
        status: 'active',
        recommendedBundle: 'Hospital-Wide IC Surveillance: ทบทวนมาตรการล้างมือ 5 Moments, การแยกผู้ป่วยติดเชื้อ (Isolation Precautions), การทำความสะอาดสิ่งแวดล้อมและพื้นผิวสัมผัสสูง (High-touch surfaces)',
      });
    }
  });

  return alerts;
};

// Export to Google Sheets compatible CSV
export const exportRecordsToGoogleSheetsCSV = (records: WardSurveillanceRecord[]): string => {
  const headers = [
    'หอผู้ป่วย',
    'จำนวน Pt ใส่สายสวน',
    'จำนวนวันคาสายสวน',
    'จำนวนครั้งเกิด UTI',
    'อัตราการเกิดUTI (ต่อ 1,000 วัน)',
    'จำนวน Pt ใส่เครื่อง',
    'จำนวนวันครองเครื่อง',
    'จำนวนครั้งเกิด VAP',
    'อัตราการเกิดVAP (ต่อ 1,000 วัน)',
    'จำนวน Pt ให้ IV',
    'จำนวนวันให้ IV',
    'จำนวนครั้งเกิด Phlebitis',
    'อัตราการเกิดPhlebitis (ต่อ 1,000 วัน)',
    'จำนวนครั้งติดเชื้อ แผลผ่าตัด01',
    'จำนวนแผลผ่าตัด01',
    'อัตราการเกิดSSI (01) (%)',
    'จำนวน Pt UVC',
    'จำนวนวันUVC',
    'จำนวนครั้งเกิด CLABSI',
    'อัตราการเกิดเกิด CLABSI (ต่อ 1,000 วัน)',
    'จำนวน Pt ที่ติดเชื้อ',
    'จำนวนวันนอนของผู้ป่วย',
    'ของการติดเชื้อ',
    'อัตราการติดเชื้อใน ร.พ (ต่อ 1,000 วันนอน)',
    'จำนวนผู้ป่วยเชื้อใน ร.พ',
    'จำนวนวันจำหน่าย',
  ];

  const rows = records.map((r) => [
    r.ward,
    r.utiPatients,
    r.catheterDays,
    r.utiCases,
    r.utiRate,
    r.vapPatients,
    r.ventilatorDays,
    r.vapCases,
    r.vapRate,
    r.ivPatients,
    r.ivDays,
    r.phlebitisCases,
    r.phlebitisRate,
    r.ssiCases,
    r.surgicalWounds,
    r.ssiRate,
    r.uvcPatients,
    r.uvcDays,
    r.uvcClabsiCases,
    r.uvcClabsiRate,
    r.infectedPatients,
    r.totalPatientDays,
    r.totalInfections,
    r.hospitalInfectionRate,
    r.hospitalInfectedPatients,
    r.dischargeDays,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  return '\uFEFF' + csvContent; // Add BOM for Excel / Thai support
};

// Parse imported CSV into surveillance records
export const parseGoogleSheetsCSV = (csvText: string): WardSurveillanceRecord[] => {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const parsed: WardSurveillanceRecord[] = [];

  // Parse lines starting from index 1 (or detect headers)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV splitter that respects quotes
    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((c) => c.replace(/^"|"$/g, '').trim());
    if (!cols[0] || cols[0].includes('รวม') || cols[0] === '') continue;

    const parseNum = (val: string | undefined): number => {
      if (!val) return 0;
      const clean = val.replace(/,/g, '').trim();
      const n = parseFloat(clean);
      return isNaN(n) ? 0 : n;
    };

    const ward = cols[0];
    const rec: WardSurveillanceRecord = {
      id: `imported-${ward}-${Date.now()}-${i}`,
      ward,
      wardName: `หอผู้ป่วย ${ward}`,
      wardType: 'other',
      month: '2026-10',
      utiPatients: parseNum(cols[1]),
      catheterDays: parseNum(cols[2]),
      utiCases: parseNum(cols[3]),
      utiRate: parseNum(cols[4]),
      vapPatients: parseNum(cols[5]),
      ventilatorDays: parseNum(cols[6]),
      vapCases: parseNum(cols[7]),
      vapRate: parseNum(cols[8]),
      ivPatients: parseNum(cols[9]),
      ivDays: parseNum(cols[10]),
      phlebitisCases: parseNum(cols[11]),
      phlebitisRate: parseNum(cols[12]),
      ssiCases: parseNum(cols[13]),
      surgicalWounds: parseNum(cols[14]),
      ssiRate: parseNum(cols[15]),
      uvcPatients: parseNum(cols[16]),
      uvcDays: parseNum(cols[17]),
      uvcClabsiCases: parseNum(cols[18]),
      uvcClabsiRate: parseNum(cols[19]),
      infectedPatients: parseNum(cols[20]),
      totalPatientDays: parseNum(cols[21]),
      totalInfections: parseNum(cols[22]),
      hospitalInfectionRate: parseNum(cols[23]),
      hospitalInfectedPatients: parseNum(cols[24]),
      dischargeDays: parseNum(cols[25]),
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Google Sheets CSV Sync',
    };

    parsed.push(calculateWardRates(rec));
  }

  return parsed;
};
