import React, { useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  FileCheck,
  PenTool,
  Printer,
  RotateCcw,
  Sparkles,
  UserCheck,
  Users,
  Wrench
} from 'lucide-react';
import {
  ContractFormData,
  DocStatus,
  MINIMUM_WAGE_2026,
  SCENARIOS,
  UserRole,
  runLegalAudit
} from './data/scenarios';
import { ContractPaper } from './components/ContractPaper';
import { SignatureModal } from './components/SignatureModal';
import { GuideModal } from './components/GuideModal';

const SCENARIO_LIST = Object.values(SCENARIOS);

function getTodayIso(): string {
  return new Date().toISOString().split('T')[0];
}

function buildFormFromScenario(
  scenarioKey: string,
  fillNamesAndWage = false
): ContractFormData {
  const sc = SCENARIOS[scenarioKey] || SCENARIOS.cafe;
  return {
    employerCompany: sc.employerCompany,
    employerName: fillNamesAndWage ? sc.employerName : '',
    employerAddress: sc.employerAddress,
    employerPhone: sc.employerPhone,
    workerName: fillNamesAndWage ? sc.workerName : '',
    workerAge: sc.workerAge,
    workerAddress: sc.workerAddress,
    workerPhone: sc.workerPhone,
    startDate: sc.startDate,
    endDate: sc.endDate,
    workplace: sc.workplace,
    jobDescription: sc.jobDescription,
    workStart: sc.workStart,
    workEnd: sc.workEnd,
    breakStart: sc.breakStart,
    breakEnd: sc.breakEnd,
    workDaysPerWeek: sc.workDaysPerWeek,
    weeklyRestDay: sc.weeklyRestDay,
    wageType: sc.wageType,
    wageAmount: fillNamesAndWage ? String(sc.wageAmount) : '',
    payDay: sc.payDay,
    payMethod: sc.payMethod,
    bonusInfo: sc.bonusInfo,
    docFamily: sc.docFamily,
    docParent: sc.docParent,
    insEmp: sc.insEmp,
    insAcc: sc.insAcc,
    insPen: sc.insPen,
    insHea: sc.insHea,
    contractDate: getTodayIso()
  };
}

export function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [unlockedStep, setUnlockedStep] = useState<number>(1);
  const [userRole, setUserRole] = useState<UserRole>('employer');
  const [scenarioKey, setScenarioKey] = useState<string>('cafe');

  const [formData, setFormData] = useState<ContractFormData>(() =>
    buildFormFromScenario('cafe', false)
  );

  const [signatures, setSignatures] = useState<{
    employer: string | null;
    worker: string | null;
  }>({
    employer: null,
    worker: null
  });

  const [activeSigRole, setActiveSigRole] = useState<
    'employer' | 'worker' | null
  >(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const contractPaperRef = useRef<HTMLDivElement | null>(null);

  const currentScenario = SCENARIOS[scenarioKey] || SCENARIOS.cafe;

  const auditResult = useMemo(() => runLegalAudit(formData), [formData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    if (step > unlockedStep) {
      setUnlockedStep(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tryNavigateToStep = (targetStep: number) => {
    if (targetStep <= unlockedStep) {
      goToStep(targetStep);
    } else {
      showToast(
        `이전 단계를 먼저 완료해 주세요. (${targetStep - 1}단계를 완료해야 이동할 수 있습니다.)`
      );
    }
  };

  const handleSelectScenario = (key: string) => {
    setScenarioKey(key);
    setFormData(buildFormFromScenario(key, false));
  };

  const handleFillScenarioDefaults = () => {
    const sc = SCENARIOS[scenarioKey];
    if (!sc) return;
    setFormData((prev) => ({
      ...prev,
      employerName: prev.employerName.trim() || sc.employerName,
      workerName: prev.workerName.trim() || sc.workerName,
      wageAmount: prev.wageAmount.trim() || String(sc.wageAmount)
    }));
    showToast(
      `선택한 사례(${sc.title})의 예시 성명과 제시 시급(${sc.wageAmount.toLocaleString()}원)이 입력되었습니다.`
    );
  };

  const handleResetApp = () => {
    setUnlockedStep(1);
    setCurrentStep(1);
    setScenarioKey('cafe');
    setFormData(buildFormFromScenario('cafe', false));
    setSignatures({ employer: null, worker: null });
    showToast('처음 단계로 초기화되었습니다.');
  };

  const updateField = <K extends keyof ContractFormData>(
    field: K,
    value: ContractFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDocStatus = (
    target: 'docFamily' | 'docParent',
    choice: '예' | '아니오'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [target]: prev[target] === choice ? '미선택' : choice
    }));
  };

  const handleCompleteStep2 = () => {
    if (!formData.employerCompany.trim() || !formData.workerName.trim()) {
      showToast(
        '사업체명과 근로자(청소년) 성명을 입력해주세요. (우측 상단 예시 자동 채우기 버튼 활용 가능)'
      );
      return;
    }
    if (!formData.wageAmount.trim()) {
      showToast(
        `약정 임금(시급)을 입력해주세요. (사례 제시 시급: ${currentScenario.wageAmount.toLocaleString()}원)`
      );
      return;
    }
    goToStep(3);
  };

  const applyQuickFix = (auditId: string) => {
    setFormData((prev) => {
      const next = { ...prev };
      if (auditId === 'wage') {
        next.wageType = '시급';
        next.wageAmount = String(MINIMUM_WAGE_2026);
      } else if (auditId === 'hours') {
        next.workStart = '10:00';
        next.workEnd = '17:00';
        next.breakStart = '13:00';
        next.breakEnd = '14:00';
      } else if (auditId === 'night') {
        next.workStart = '14:00';
        next.workEnd = '19:00';
        next.breakStart = '16:30';
        next.breakEnd = '17:00';
      } else if (auditId === 'break') {
        next.breakStart = '14:00';
        next.breakEnd = '14:30';
      } else if (auditId === 'docs') {
        next.docFamily = '예';
        next.docParent = '예';
      } else if (auditId === 'insurance') {
        next.insAcc = true;
        next.insEmp = true;
      }
      return next;
    });
    showToast('선택한 항목이 근로기준법 적법 기준으로 교정되었습니다.');
  };

  const applyAllLegalFixes = () => {
    setFormData((prev) => {
      const next = { ...prev };
      const currentWage = parseFloat(next.wageAmount) || 0;
      if (currentWage < MINIMUM_WAGE_2026) {
        next.wageType = '시급';
        next.wageAmount = String(MINIMUM_WAGE_2026);
      }
      const currentAudit = runLegalAudit(next);
      if (currentAudit.metrics.hasNightWork) {
        next.workStart = '14:00';
        next.workEnd = '19:00';
        next.breakStart = '16:30';
        next.breakEnd = '17:00';
      }
      const afterNightAudit = runLegalAudit(next);
      if (
        afterNightAudit.metrics.netWorkHours > 7 ||
        afterNightAudit.metrics.weeklyWorkHours > 35
      ) {
        next.workStart = '10:00';
        next.workEnd = '17:00';
        next.breakStart = '13:00';
        next.breakEnd = '14:00';
      }
      const afterHoursAudit = runLegalAudit(next);
      if (
        afterHoursAudit.metrics.breakMinutes <
        afterHoursAudit.metrics.requiredBreakMinutes
      ) {
        next.breakStart = '14:00';
        next.breakEnd = '14:30';
      }
      next.docFamily = '예';
      next.docParent = '예';
      next.insAcc = true;
      next.insEmp = true;
      return next;
    });
    showToast('모든 위반 항목이 근로기준법 적법 조건으로 일괄 교정되었습니다.');
  };

  const handleSaveSignature = (
    role: 'employer' | 'worker',
    dataUrl: string
  ) => {
    setSignatures((prev) => ({
      ...prev,
      [role]: dataUrl
    }));
    showToast(
      role === 'employer'
        ? '사업주 전자서명이 계약서에 반영되었습니다.'
        : '청소년 근로자 전자서명이 계약서에 반영되었습니다.'
    );
  };

  const handleDownloadContractImage = async () => {
    if (!contractPaperRef.current || isDownloading) return;
    setIsDownloading(true);
    showToast('계약서 이미지 파일(PNG)을 생성하고 있습니다...');

    try {
      const canvas = await html2canvas(contractPaperRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const empCompany = formData.employerCompany.trim() || '사업장';
      const wrkName = formData.workerName.trim() || '근로자';
      const fileName = `연소근로자_표준근로계약서_${empCompany}_${wrkName}.png`;

      const link = document.createElement('a');
      link.href = imgData;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('표준근로계약서가 이미지 파일(PNG)로 다운로드되었습니다.');
    } catch (error) {
      console.error('PNG 생성 오류:', error);
      showToast('이미지 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Bar Contract: Strict 1-row, 3-zone header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 no-print">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              goToStep(1);
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            연소근로자 표준근로계약서 실습실
          </a>

          {/* Zone 2: 4 stage navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium">
            {[
              { step: 1, label: '01. 역할 및 사례' },
              { step: 2, label: '02. 계약서 작성' },
              { step: 3, label: '03. 법률 자동 점검' },
              { step: 4, label: '04. 서명 및 발급' }
            ].map((item) => {
              const isCurrent = currentStep === item.step;
              const isUnlocked = item.step <= unlockedStep;
              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => tryNavigateToStep(item.step)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    isCurrent
                      ? 'border-sky-400 text-white font-semibold'
                      : isUnlocked
                        ? 'border-transparent text-slate-300 hover:text-white hover:border-slate-500'
                        : 'border-transparent text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 2 primary actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="px-3.5 py-2 text-xs font-medium text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>근로보호법 가이드</span>
            </button>
            <button
              type="button"
              onClick={handleResetApp}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">처음부터 다시하기</span>
            </button>
          </div>
        </div>
      </header>

      {/* Progressive Stage Stepper Bar */}
      <div className="bg-white border-b border-slate-200 no-print">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">
              통합사회 ② 청소년 근로권 협동 실습
            </span>
            <span aria-hidden="true">·</span>
            <span>
              현재 역할:{' '}
              <strong className="text-slate-900">
                {userRole === 'employer' ? '사업주(고용주)' : '청소년 근로자'}
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              선택 사례:{' '}
              <strong className="text-sky-700">
                {currentScenario.code} ({currentScenario.title})
              </strong>
            </span>
          </div>

          {/* Mobile & Tablet Step Selector */}
          <div className="flex items-center gap-1.5">
            {[
              { step: 1, label: '1단계: 역할·사례' },
              { step: 2, label: '2단계: 계약서 입력' },
              { step: 3, label: '3단계: 법률 점검' },
              { step: 4, label: '4단계: 서명·완료' }
            ].map((st) => {
              const active = currentStep === st.step;
              const unlocked = st.step <= unlockedStep;
              return (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => tryNavigateToStep(st.step)}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-slate-900 text-white'
                      : unlocked
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-grow max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* ==================== STEP 1 VIEW ==================== */}
        {currentStep === 1 && (
          <div className="space-y-8 no-print">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-8">
              {/* Header */}
              <div className="border-b border-slate-200 pb-5 flex flex-wrap items-end justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-sky-700 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>2인 1조 모둠 활동 · Stage 01</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    1단계: 모둠 역할 분담 및 학습 사례 선택
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                    모둠원 중 1명은 <strong>사업주</strong>, 1명은{' '}
                    <strong>청소년 근로자</strong> 역할을 맡아 아래 10가지 실제 아르바이트 사례 카드 중 1개를 선택하세요.
                  </p>
                </div>
                <div className="text-xs text-slate-500 font-mono-num">
                  2026년 기준 최저시급: {MINIMUM_WAGE_2026.toLocaleString()}원
                </div>
              </div>

              {/* Role Selection Toggle */}
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-bold text-slate-800">
                  01. 내 역할 선택 (학습자 입장 설정)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserRole('employer')}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 ${
                      userRole === 'employer'
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        userRole === 'employer'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        사업주 역할 (고용주 입장)
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        연소근로자 보호 법규를 준수하여 근로조건을 명시하고 계약서를 교부하는 주체
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUserRole('worker')}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 ${
                      userRole === 'worker'
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        userRole === 'worker'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        청소년 근로자 역할 (18세 미만 연소근로자 입장)
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        최저임금, 근로시간, 휴게시간 및 안전 권리를 꼼꼼히 확인하고 서명하는 주체
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 10 Scenario Cards Grid */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800">
                    02. 시뮬레이션 사례 카드 선택 (10개 사례 중 1개 클릭)
                  </label>
                  <span className="text-xs text-slate-500">
                    각 사례에는 적법 조건 또는 법 위반 쟁점이 포함되어 있습니다.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  {SCENARIO_LIST.map((sc) => {
                    const isSelected = sc.key === scenarioKey;
                    return (
                      <button
                        key={sc.key}
                        type="button"
                        onClick={() => handleSelectScenario(sc.key)}
                        className={`p-4 text-left rounded-xl border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-sky-700 bg-sky-50/40'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          {/* Clean unboxed metadata discipline */}
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-mono-num">
                            <span
                              className={
                                isSelected
                                  ? 'font-bold text-sky-800'
                                  : 'font-semibold text-slate-600'
                              }
                            >
                              {sc.code}
                            </span>
                            <span>{sc.workDaysPerWeek}</span>
                          </div>
                          <h3 className="font-bold text-sm text-slate-900 mb-1">
                            {sc.title}
                          </h3>
                          <p className="text-xs text-slate-600 leading-snug mb-3">
                            {sc.shortDesc}
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-slate-200/80 text-[11px] text-slate-700 space-y-1 font-mono-num">
                          <div>· 제시 시급: {sc.wageAmount.toLocaleString()}원</div>
                          <div>
                            · 시간: {sc.workStart}~{sc.workEnd}
                          </div>
                          <div className="text-slate-500 font-sans truncate">
                            · {sc.docNote}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Scenario Summary Bar */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>
                      선택한 사례: {currentScenario.code} · {currentScenario.title}
                    </span>
                    <span className="text-slate-400" aria-hidden="true">
                      |
                    </span>
                    <span className="text-sky-700 font-mono-num">
                      사업장: {currentScenario.employerCompany}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentScenario.summary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-lg font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>2단계(근로계약서 작성)로 이동</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 2 VIEW (TWO-ZONE SANDBOX) ==================== */}
        {currentStep === 2 && (
          <div className="space-y-6 no-print">
            {/* Top Context Banner */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-sky-700">
                  2단계 : 표준근로계약서 세부 항목 작성 · {currentScenario.code} ({currentScenario.title})
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  연소근로자 표준근로계약서 항목 입력 및 실시간 미리보기
                </h1>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleFillScenarioDefaults}
                  className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                  <span>
                    사례 예시 성명·시급({currentScenario.wageAmount.toLocaleString()}원) 자동 채우기
                  </span>
                </button>
              </div>
            </div>

            {/* Two-Zone Split Sandbox Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Zone: Interactive Form Controls (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 space-y-6 text-xs">
                {/* 1. Parties Info */}
                <section className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h2 className="font-bold text-slate-900 text-sm">
                      01. 계약 당사자 인적사항
                    </h2>
                    <span className="text-slate-500">
                      모둠원의 실제 이름 또는 사례 예시 이름을 입력하세요
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        사업체명 (상호)
                      </label>
                      <input
                        type="text"
                        value={formData.employerCompany}
                        onChange={(e) =>
                          updateField('employerCompany', e.target.value)
                        }
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        사업주(대표자) 성명 <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.employerName}
                        onChange={(e) =>
                          updateField('employerName', e.target.value)
                        }
                        placeholder={`예: ${currentScenario.employerName}`}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        사업장 주소
                      </label>
                      <input
                        type="text"
                        value={formData.employerAddress}
                        onChange={(e) =>
                          updateField('employerAddress', e.target.value)
                        }
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        사업장 연락처
                      </label>
                      <input
                        type="text"
                        value={formData.employerPhone}
                        onChange={(e) =>
                          updateField('employerPhone', e.target.value)
                        }
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white font-mono-num"
                      />
                    </div>

                    <div className="sm:col-span-2 border-t border-slate-100 my-1" />

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        근로자(청소년) 성명 <span className="text-rose-600">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.workerName}
                        onChange={(e) =>
                          updateField('workerName', e.target.value)
                        }
                        placeholder={`예: ${currentScenario.workerName}`}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        근로자 생년월일 (만 나이)
                      </label>
                      <input
                        type="text"
                        value={formData.workerAge}
                        onChange={(e) => updateField('workerAge', e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white font-mono-num"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        근로자 주소
                      </label>
                      <input
                        type="text"
                        value={formData.workerAddress}
                        onChange={(e) =>
                          updateField('workerAddress', e.target.value)
                        }
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        근로자 연락처
                      </label>
                      <input
                        type="text"
                        value={formData.workerPhone}
                        onChange={(e) =>
                          updateField('workerPhone', e.target.value)
                        }
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white font-mono-num"
                      />
                    </div>
                  </div>
                </section>

                {/* 2. Dates, Workplace & Job */}
                <section className="space-y-3 pt-2">
                  <div className="border-b border-slate-200 pb-2">
                    <h2 className="font-bold text-slate-900 text-sm">
                      02. 근로계약 기간 · 근무장소 · 업무 내용
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        근로 시작일 (근로개시일)
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => updateField('startDate', e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white font-mono-num"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        계약 종료일 (정함이 없으면 빈칸)
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => updateField('endDate', e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white font-mono-num"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        근무 장소
                      </label>
                      <input
                        type="text"
                        value={formData.workplace}
                        onChange={(e) => updateField('workplace', e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        업무의 내용
                      </label>
                      <input
                        type="text"
                        value={formData.jobDescription}
                        onChange={(e) =>
                          updateField('jobDescription', e.target.value)
                        }
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </section>

                {/* 3. Work Hours & Rest */}
                <section className="space-y-3 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-200 pb-2">
                    <h2 className="font-bold text-slate-900 text-sm">
                      03. 소정근로시간 및 휴게시간
                    </h2>
                    <span className="text-[11px] text-amber-800">
                      법정 기준: 1일 7시간·주 35시간 이내 / 22:00~06:00 야간근로 금지
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        근무 시작시간
                      </label>
                      <input
                        type="time"
                        value={formData.workStart}
                        onChange={(e) => updateField('workStart', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white font-mono-num"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        근무 종료시간
                      </label>
                      <input
                        type="time"
                        value={formData.workEnd}
                        onChange={(e) => updateField('workEnd', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white font-mono-num"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        휴게 시작시간
                      </label>
                      <input
                        type="time"
                        value={formData.breakStart}
                        onChange={(e) =>
                          updateField('breakStart', e.target.value)
                        }
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white font-mono-num"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        휴게 종료시간
                      </label>
                      <input
                        type="time"
                        value={formData.breakEnd}
                        onChange={(e) => updateField('breakEnd', e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white font-mono-num"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        근무일 (주당 근무일수)
                      </label>
                      <select
                        value={formData.workDaysPerWeek}
                        onChange={(e) =>
                          updateField('workDaysPerWeek', e.target.value)
                        }
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                      >
                        <option value="주 1일">주 1일 근무</option>
                        <option value="주 2일">주 2일 근무 (주말)</option>
                        <option value="주 3일">주 3일 근무</option>
                        <option value="주 4일">주 4일 근무</option>
                        <option value="주 5일">주 5일 근무 (평일)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        주휴일 (유급휴일)
                      </label>
                      <select
                        value={formData.weeklyRestDay}
                        onChange={(e) =>
                          updateField('weeklyRestDay', e.target.value)
                        }
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                      >
                        <option value="매주 일요일">매주 일요일</option>
                        <option value="매주 월요일">매주 월요일</option>
                        <option value="매주 화요일">매주 화요일</option>
                        <option value="매주 수요일">매주 수요일</option>
                        <option value="매주 목요일">매주 목요일</option>
                        <option value="매주 토요일">매주 토요일</option>
                        <option value="근무 스케줄에 따름">스케줄 지정일</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* 4. Wages */}
                <section className="space-y-3 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-200 pb-2">
                    <h2 className="font-bold text-slate-900 text-sm">
                      04. 임금 및 지급 방법
                    </h2>
                    <span className="text-slate-500 font-mono-num">
                      사례 제시 시급: {currentScenario.wageAmount.toLocaleString()}원 / 2026 최저시급: {MINIMUM_WAGE_2026.toLocaleString()}원
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        급여 형태 및 약정 금액 <span className="text-rose-600">*</span>
                      </label>
                      <div className="flex gap-1.5">
                        <select
                          value={formData.wageType}
                          onChange={(e) =>
                            updateField(
                              'wageType',
                              e.target.value as '시급' | '일급' | '월급'
                            )
                          }
                          className="w-24 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                        >
                          <option value="시급">시급</option>
                          <option value="일급">일급</option>
                          <option value="월급">월급</option>
                        </select>
                        <input
                          type="number"
                          value={formData.wageAmount}
                          onChange={(e) =>
                            updateField('wageAmount', e.target.value)
                          }
                          placeholder={`예: ${currentScenario.wageAmount}`}
                          className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white font-bold text-slate-900 font-mono-num"
                        />
                        <span className="self-center font-bold text-slate-600 pr-1">
                          원
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        임금 지급일
                      </label>
                      <input
                        type="text"
                        value={formData.payDay}
                        onChange={(e) => updateField('payDay', e.target.value)}
                        placeholder="매월 10일"
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        지급 방법
                      </label>
                      <select
                        value={formData.payMethod}
                        onChange={(e) => updateField('payMethod', e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                      >
                        <option value="근로자 명의 예금통장에 입금">
                          근로자 명의 예금통장에 입금
                        </option>
                        <option value="근로자에게 직접 지급">
                          근로자에게 직접 지급 (현금)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">
                        상여금 및 기타수당 내역
                      </label>
                      <input
                        type="text"
                        value={formData.bonusInfo}
                        onChange={(e) => updateField('bonusInfo', e.target.value)}
                        placeholder="상여금 없음 / 법정 수당 별도"
                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600 focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </section>

                {/* 5. Mandatory Youth Certificates */}
                <section className="space-y-3 pt-2">
                  <div className="border-b border-slate-200 pb-2">
                    <h2 className="font-bold text-slate-900 text-sm">
                      05. 가족관계증명서 및 친권자 동의서 (근로기준법 제66조)
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                      <div className="font-medium text-slate-800 mb-2">
                        가족관계기록사항에 관한 증명서 제출 여부
                      </div>
                      <div className="flex items-center gap-5">
                        {(['예', '아니오'] as const).map((opt) => (
                          <label
                            key={opt}
                            className="inline-flex items-center gap-1.5 cursor-pointer text-slate-800"
                          >
                            <input
                              type="checkbox"
                              checked={formData.docFamily === opt}
                              onChange={() => toggleDocStatus('docFamily', opt)}
                              className="w-4 h-4 rounded text-slate-900 focus:ring-sky-600"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                      <div className="font-medium text-slate-800 mb-2">
                        친권자 또는 후견인의 동의서 구비 여부
                      </div>
                      <div className="flex items-center gap-5">
                        {(['예', '아니오'] as const).map((opt) => (
                          <label
                            key={opt}
                            className="inline-flex items-center gap-1.5 cursor-pointer text-slate-800"
                          >
                            <input
                              type="checkbox"
                              checked={formData.docParent === opt}
                              onChange={() => toggleDocStatus('docParent', opt)}
                              className="w-4 h-4 rounded text-slate-900 focus:ring-sky-600"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 6. Social Insurance & Contract Date */}
                <section className="space-y-3 pt-2">
                  <div className="border-b border-slate-200 pb-2">
                    <h2 className="font-bold text-slate-900 text-sm">
                      06. 사회보험 적용 여부 및 계약 작성일
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-4">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.insEmp}
                          onChange={(e) =>
                            updateField('insEmp', e.target.checked)
                          }
                          className="w-4 h-4 rounded text-slate-900"
                        />
                        <span>고용보험</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer font-semibold text-slate-900">
                        <input
                          type="checkbox"
                          checked={formData.insAcc}
                          onChange={(e) =>
                            updateField('insAcc', e.target.checked)
                          }
                          className="w-4 h-4 rounded text-slate-900"
                        />
                        <span>산재보험 (필수)</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.insPen}
                          onChange={(e) =>
                            updateField('insPen', e.target.checked)
                          }
                          className="w-4 h-4 rounded text-slate-900"
                        />
                        <span>국민연금</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.insHea}
                          onChange={(e) =>
                            updateField('insHea', e.target.checked)
                          }
                          className="w-4 h-4 rounded text-slate-900"
                        />
                        <span>건강보험</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="font-semibold text-slate-700 whitespace-nowrap">
                        계약 작성일:
                      </label>
                      <input
                        type="date"
                        value={formData.contractDate}
                        onChange={(e) =>
                          updateField('contractDate', e.target.value)
                        }
                        className="p-2 border border-slate-300 rounded-lg font-mono-num bg-white"
                      />
                    </div>
                  </div>
                </section>

                {/* Step 2 Navigation Footer */}
                <div className="pt-5 border-t border-slate-200 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>1단계(사례 선택)로 이전</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCompleteStep2}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <span>작성 완료 및 3단계(법률 자동 점검)로 이동</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Zone: Live Metrics & Synchronized Contract Preview (5 cols) */}
              <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
                {/* Real-Time Work & Wage Calculation Deck */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                      실시간 근로시간·주휴수당 시뮬레이션
                    </h3>
                    <span className="text-xs text-slate-500 font-mono-num">
                      {formData.workDaysPerWeek} 기준
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                      <div className="text-slate-500">1일 실근로시간</div>
                      <div className="text-base font-bold text-slate-900 font-mono-num mt-0.5">
                        {auditResult.metrics.netWorkHours}시간
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono-num">
                        휴게 {auditResult.metrics.breakMinutes}분 제외
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                      <div className="text-slate-500">1주 소정근로시간</div>
                      <div className="text-base font-bold text-slate-900 font-mono-num mt-0.5">
                        주 {auditResult.metrics.weeklyWorkHours}시간
                      </div>
                      <div className="text-[11px] text-slate-500">
                        법정 한도: 주 35시간 이내
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                      <div className="text-slate-500">예상 주간 기본급</div>
                      <div className="text-base font-bold text-slate-900 font-mono-num mt-0.5">
                        {auditResult.metrics.estimatedWeeklyBasePay.toLocaleString()}원
                      </div>
                      <div className="text-[11px] text-slate-500">
                        주휴수당 별도
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                      <div className="text-slate-500">주휴수당 (주 15h↑)</div>
                      <div className="text-base font-bold text-sky-800 font-mono-num mt-0.5">
                        {auditResult.metrics.isWeeklyHolidayAllowanceEligible
                          ? `+${auditResult.metrics.estimatedWeeklyHolidayPay.toLocaleString()}원`
                          : '해당 없음'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {auditResult.metrics.isWeeklyHolidayAllowanceEligible
                          ? '주 15시간 이상 대상'
                          : '주 15시간 미만'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Compact Contract Paper Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                    <span className="font-semibold text-slate-800">
                      실시간 표준근로계약서 미리보기
                    </span>
                    <span>입력 즉시 서식에 반영됩니다</span>
                  </div>
                  <div className="max-h-[540px] overflow-y-auto rounded-xl border border-slate-300 shadow-xs">
                    <ContractPaper
                      formData={formData}
                      signatures={signatures}
                      compact={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 3 VIEW (LEGAL AUDIT) ==================== */}
        {currentStep === 3 && (
          <div className="space-y-6 no-print">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 space-y-6">
              <div className="border-b border-slate-200 pb-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-sky-700">
                    3단계 : 청소년 근로기준법 적합성 진단 · {currentScenario.code} ({currentScenario.title})
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    입력된 근로계약 내용 자동 법률 점검 리포트
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    작성한 근로계약서가 대한민국 근로기준법(제54조·제64조·제66조·제69조·제70조) 및 최저임금법에 부합하는지 검토한 결과입니다.
                  </p>
                </div>

                {auditResult.violationsCount > 0 && (
                  <button
                    type="button"
                    onClick={applyAllLegalFixes}
                    className="px-4 py-2.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>위반 항목 모두 적법 기준으로 일괄 교정하기</span>
                  </button>
                )}
              </div>

              {/* Overall Status Banner (Explicit Icon + Semantic Label, Never Hue Alone) */}
              <div
                className={`p-5 rounded-xl border space-y-2 ${
                  auditResult.violationsCount > 0
                    ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                    : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {auditResult.violationsCount > 0 ? (
                      <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    )}
                    <h2 className="font-bold text-base">
                      {auditResult.violationsCount > 0
                        ? `▲ 법률 시정 필요: 시정이 필요한 근로기준법 위반 항목이 ${auditResult.violationsCount}건 발견되었습니다.`
                        : '● 적법성 검토 통과: 6대 청소년 근로기준법 핵심 준수 항목이 모두 적법합니다.'}
                    </h2>
                  </div>
                  <div className="text-xs font-mono-num font-semibold">
                    준수 {auditResult.passesCount}건 / 위반 {auditResult.violationsCount}건
                  </div>
                </div>
                <p className="text-xs text-slate-700 pl-7">
                  {auditResult.violationsCount > 0
                    ? '아래 위반 항목의 [적법 기준으로 교정] 버튼을 클릭하거나 2단계로 돌아가 근로조건을 수정해보세요.'
                    : '18세 미만 연소근로자 보호 규정을 충실히 준수한 안전한 근로계약서입니다. 이제 4단계로 이동하여 서명을 완료하세요.'}
                </p>
              </div>

              {/* Detailed 6-Point Legal Checklist */}
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
                {auditResult.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span
                          className={`font-bold flex items-center gap-1 ${
                            item.passed ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {item.passed ? '● 적법 기준 충족' : '▲ 법률 위반 (시정 필요)'}
                        </span>
                        <span className="text-slate-300" aria-hidden="true">
                          ·
                        </span>
                        <span className="font-semibold text-slate-800">
                          {item.category}
                        </span>
                        <span className="text-slate-300" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-slate-500">{item.lawReference}</span>
                      </div>

                      <div className="font-bold text-sm text-slate-900">
                        {item.title}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {item.fixLabel && (
                      <button
                        type="button"
                        onClick={() => applyQuickFix(item.id)}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start sm:self-center"
                      >
                        <Wrench className="w-3.5 h-3.5 text-rose-700" />
                        <span>{item.fixLabel}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Educational Textbook Point Callout */}
              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">
                  통합사회 교과서 연계 학습 포인트: 연소근로자 특별보호
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-relaxed">
                  <li>
                    <strong>최저임금 동일 적용:</strong> 연소근로자도 성인과 동일한 최저임금(2026년 10,320원)을 적용받으며, 계약기간 1년 미만인 경우 수습 감액이 불가능합니다.
                  </li>
                  <li>
                    <strong>근로시간 특례:</strong> 15세 이상 18세 미만 연소자는 1일 7시간, 1주 35시간을 초과하여 일할 수 없습니다 (당사자 합의 시 1일 1시간, 주 5시간 한도 연장 가능).
                  </li>
                  <li>
                    <strong>야간·휴일근로 금지:</strong> 오후 10시~오전 6시 야간근로 및 휴일근로는 원칙적으로 금지됩니다.
                  </li>
                </ul>
              </div>

              {/* Step 3 Navigation Controls */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>2단계로 돌아가서 직접 항목 수정하기</span>
                </button>

                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-lg font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>법률 검토 확인 완료 & 4단계(전자서명 및 발급)로 이동</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 4 VIEW (FINAL CONTRACT & SIGNATURES) ==================== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Top Action Toolbar for Step 4 */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 no-print">
              <div>
                <div className="text-xs font-semibold text-emerald-700">
                  4단계 : 최종 계약서 전자서명 및 교부 완료
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  연소근로자 표준근로계약서 완성본
                </h1>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveSigRole('employer')}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>
                    {signatures.employer ? '사업주 서명 재작성' : '사업주 서명 입력'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSigRole('worker')}
                  className="px-3.5 py-2 bg-sky-700 hover:bg-sky-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>
                    {signatures.worker ? '근로자 서명 재작성' : '근로자 서명 입력'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadContractImage}
                  disabled={isDownloading}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {isDownloading
                      ? '이미지 생성 중...'
                      : '계약서 이미지 파일(PNG) 저장'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>인쇄 / PDF</span>
                </button>
              </div>
            </div>

            {/* Official Contract Paper */}
            <div className="max-w-4xl mx-auto">
              <ContractPaper
                formData={formData}
                signatures={signatures}
                onOpenSignature={(role) => setActiveSigRole(role)}
                paperRef={contractPaperRef}
              />
            </div>

            {/* Bottom Navigation */}
            <div className="max-w-4xl mx-auto pt-2 no-print flex flex-wrap justify-between items-center gap-3">
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>3단계 법률 점검 리포트로 이동</span>
              </button>

              <div className="text-xs text-slate-600">
                계약서 하단의 서명란을 클릭하거나 상단 버튼으로 사업주·근로자 서명을 완료한 뒤 PNG 이미지 또는 인쇄/PDF로 저장하세요.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      <SignatureModal
        isOpen={activeSigRole !== null}
        role={activeSigRole}
        signerName={
          activeSigRole === 'employer'
            ? formData.employerName
            : formData.workerName
        }
        onClose={() => setActiveSigRole(null)}
        onSave={handleSaveSignature}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 no-print max-w-md">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 text-slate-500 text-xs py-4 text-center no-print mt-auto">
        <div className="max-w-[1360px] mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>통합사회 ② 청소년 근로권 협동 학습 및 표준근로계약서 시뮬레이터</span>
          <span>고용노동부 연소근로자(18세 미만) 표준근로계약서 양식 기반</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
