export const MINIMUM_WAGE_2026 = 10320;

export type UserRole = 'employer' | 'worker';

export type DocStatus = '예' | '아니오' | '미선택';

export interface ContractFormData {
  employerCompany: string;
  employerName: string;
  employerAddress: string;
  employerPhone: string;
  workerName: string;
  workerAge: string;
  workerAddress: string;
  workerPhone: string;
  startDate: string;
  endDate: string;
  workplace: string;
  jobDescription: string;
  workStart: string;
  workEnd: string;
  breakStart: string;
  breakEnd: string;
  workDaysPerWeek: string;
  weeklyRestDay: string;
  wageType: '시급' | '일급' | '월급';
  wageAmount: string;
  payDay: string;
  payMethod: string;
  bonusInfo: string;
  docFamily: DocStatus;
  docParent: DocStatus;
  insEmp: boolean;
  insAcc: boolean;
  insPen: boolean;
  insHea: boolean;
  contractDate: string;
}

export interface ScenarioItem {
  key: string;
  code: string;
  title: string;
  shortDesc: string;
  employerCompany: string;
  employerName: string;
  employerAddress: string;
  employerPhone: string;
  workerName: string;
  workerAge: string;
  workerAddress: string;
  workerPhone: string;
  startDate: string;
  endDate: string;
  workplace: string;
  jobDescription: string;
  workStart: string;
  workEnd: string;
  breakStart: string;
  breakEnd: string;
  workDaysPerWeek: string;
  weeklyRestDay: string;
  wageType: '시급' | '일급' | '월급';
  wageAmount: number;
  payDay: string;
  payMethod: string;
  bonusInfo: string;
  docFamily: DocStatus;
  docParent: DocStatus;
  insEmp: boolean;
  insAcc: boolean;
  insPen: boolean;
  insHea: boolean;
  summary: string;
  docNote: string;
}

export const SCENARIOS: Record<string, ScenarioItem> = {
  cafe: {
    key: 'cafe',
    code: '사례 A',
    title: '대학가 카페 알바',
    shortDesc: '주말 음료 제조 및 고객 응대 업무',
    employerCompany: '햇살카페 강남점',
    employerName: '김사업',
    employerAddress: '서울특별시 서초구 서초대로 123',
    employerPhone: '02-1234-5678',
    workerName: '이민수',
    workerAge: '2009.04.10 (만 17세)',
    workerAddress: '서울특별시 강남구 테헤란로 456',
    workerPhone: '010-9876-5432',
    startDate: '2026-03-02',
    endDate: '2026-08-31',
    workplace: '햇살카페 매장 내',
    jobDescription: '음료 제조, 결제 보조 및 매장 관리',
    workStart: '13:00',
    workEnd: '18:00',
    breakStart: '15:00',
    breakEnd: '15:30',
    workDaysPerWeek: '주 2일',
    weeklyRestDay: '매주 일요일',
    wageType: '시급',
    wageAmount: 10100,
    payDay: '매월 10일 (휴일인 경우 전일 지급)',
    payMethod: '근로자 명의 예금통장에 입금',
    bonusInfo: '상여금 없음 / 법정 휴일수당 별도',
    docFamily: '예',
    docParent: '예',
    insEmp: true,
    insAcc: true,
    insPen: false,
    insHea: false,
    docNote: '증명서 및 동의서 제출',
    summary: '주말 음료 제조 및 고객 응대 아르바이트 조건입니다. 작성 완료 후 3단계에서 최저임금 및 근로시간 적법 여부를 확인하세요.'
  },
  convenience: {
    key: 'convenience',
    code: '사례 B',
    title: '24시 편의점 스태프',
    shortDesc: '야간 매장 관리 및 계산대 상품 결제',
    employerCompany: '24시 편의점 시청점',
    employerName: '박점주',
    employerAddress: '서울특별시 중구 세종대로 99',
    employerPhone: '02-777-8888',
    workerName: '이지은',
    workerAge: '2009.11.05 (만 16세)',
    workerAddress: '서울특별시 중구 을지로 12',
    workerPhone: '010-3333-4444',
    startDate: '2026-04-01',
    endDate: '',
    workplace: '편의점 매장 및 물류창고',
    jobDescription: '재고 정리, 계산대 업무, 매장 관리',
    workStart: '20:00',
    workEnd: '01:00',
    breakStart: '22:00',
    breakEnd: '22:30',
    workDaysPerWeek: '주 5일',
    weeklyRestDay: '매주 일요일',
    wageType: '시급',
    wageAmount: 9800,
    payDay: '매월 25일',
    payMethod: '근로자 명의 예금통장에 입금',
    bonusInfo: '없음',
    docFamily: '아니오',
    docParent: '아니오',
    insEmp: false,
    insAcc: true,
    insPen: false,
    insHea: false,
    docNote: '증명서·동의서 미제출',
    summary: '야간 시간대(20:00~01:00) 근무가 포함된 편의점 스태프 계약 조건입니다. 작성 완료 후 3단계에서 법률적 쟁점을 진단해보세요.'
  },
  fastfood: {
    key: 'fastfood',
    code: '사례 C',
    title: '패스트푸드점 주방',
    shortDesc: '주방 버거 조리 및 포장 작업',
    employerCompany: '버거킹 명동점',
    employerName: '최매니저',
    employerAddress: '서울특별시 중구 명동길 45',
    employerPhone: '02-555-1234',
    workerName: '김도현',
    workerAge: '2008.08.20 (만 17세)',
    workerAddress: '서울특별시 서대문구 신촌로 78',
    workerPhone: '010-1111-2222',
    startDate: '2026-03-15',
    endDate: '2026-12-31',
    workplace: '버거킹 주방 및 카운터',
    jobDescription: '버거 조리, 포장 및 카운터 주문 수령',
    workStart: '10:00',
    workEnd: '15:00',
    breakStart: '12:00',
    breakEnd: '12:30',
    workDaysPerWeek: '주 4일',
    weeklyRestDay: '매주 월요일',
    wageType: '시급',
    wageAmount: 10500,
    payDay: '매월 5일',
    payMethod: '근로자 명의 예금통장에 입금',
    bonusInfo: '주휴수당 별도 산정 지급',
    docFamily: '예',
    docParent: '예',
    insEmp: true,
    insAcc: true,
    insPen: true,
    insHea: true,
    docNote: '증명서 및 동의서 제출',
    summary: '주 4일(10:00~15:00, 휴게 30분) 근무 형태의 패스트푸드점 계약 조건입니다. 주 15시간 이상 근무 시 주휴수당 대상 여부를 함께 확인해보세요.'
  },
  bakery: {
    key: 'bakery',
    code: '사례 D',
    title: '동네 베이커리 보조',
    shortDesc: '빵 진열 및 매장 포장 보조 (만 14세)',
    employerCompany: '쁘띠베이커리 성수점',
    employerName: '정제빵',
    employerAddress: '서울특별시 성동구 아차산로 55',
    employerPhone: '02-444-9999',
    workerName: '박준서',
    workerAge: '2012.02.15 (만 14세)',
    workerAddress: '서울특별시 성동구 뚝섬로 100',
    workerPhone: '010-5555-6666',
    startDate: '2026-04-10',
    endDate: '2026-10-10',
    workplace: '베이커리 매장 내부',
    jobDescription: '갓 나온 빵 진열, 포장 보조 및 시식 안내',
    workStart: '14:00',
    workEnd: '19:00',
    breakStart: '16:00',
    breakEnd: '16:30',
    workDaysPerWeek: '주 3일',
    weeklyRestDay: '매주 일요일',
    wageType: '시급',
    wageAmount: 10100,
    payDay: '매월 15일',
    payMethod: '근로자 명의 예금통장에 입금',
    bonusInfo: '없음',
    docFamily: '예',
    docParent: '아니오',
    insEmp: true,
    insAcc: true,
    insPen: false,
    insHea: false,
    docNote: '친권자 동의서 미구비 (만 14세)',
    summary: '만 14세 중학생 연소근로자 사례입니다. 만 15세 미만 취직인허증 요건과 친권자 동의서, 최저임금 기준을 3단계에서 점검해보세요.'
  },
  movie: {
    key: 'movie',
    code: '사례 E',
    title: '영화관 미소지기',
    shortDesc: '상영관 안내 및 매점 음료·팝콘 판매',
    employerCompany: 'CGV 용산아이파크몰',
    employerName: '강관장',
    employerAddress: '서울특별시 용산구 한강대로 23길 55',
    employerPhone: '02-790-1111',
    workerName: '한지민',
    workerAge: '2009.01.20 (만 17세)',
    workerAddress: '서울특별시 용산구 이태원로 88',
    workerPhone: '010-7777-8888',
    startDate: '2026-05-01',
    endDate: '2026-11-30',
    workplace: '영화관 상영관 및 매점',
    jobDescription: '티켓 확인, 상영관 입장 안내 및 팝콘 판매',
    workStart: '09:00',
    workEnd: '18:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    workDaysPerWeek: '주 5일',
    weeklyRestDay: '매주 월요일',
    wageType: '시급',
    wageAmount: 10300,
    payDay: '매월 10일',
    payMethod: '근로자 명의 예금통장에 입금',
    bonusInfo: '식대 별도 지급',
    docFamily: '예',
    docParent: '예',
    insEmp: true,
    insAcc: true,
    insPen: true,
    insHea: true,
    docNote: '증명서 및 동의서 제출',
    summary: '09:00~18:00(휴게 1시간 포함, 실근로 8시간) 주 5일 근무 조건입니다. 연소근로자의 1일(7시간) 및 1주(35시간) 법정 근로시간 한도를 점검해보세요.'
  },
  delivery: {
    key: 'delivery',
    code: '사례 F',
    title: '디저트점 배달 포장',
    shortDesc: '주문 확인, 배달 포장 및 근거리 전달',
    employerCompany: '달콤디저트 홍대점',
    employerName: '윤사장',
    employerAddress: '서울특별시 마포구 어울마당로 33',
    employerPhone: '02-333-2222',
    workerName: '송우진',
    workerAge: '2009.07.07 (만 17세)',
    workerAddress: '서울특별시 마포구 와우산로 12',
    workerPhone: '010-8888-9999',
    startDate: '2026-03-20',
    endDate: '2026-09-20',
    workplace: '디저트 매장 및 매장 인근 배달',
    jobDescription: '포장 주문 수령, 포장재 포장 및 단거리 전달',
    workStart: '17:00',
    workEnd: '21:00',
    breakStart: '19:00',
    breakEnd: '19:30',
    workDaysPerWeek: '주 3일',
    weeklyRestDay: '매주 일요일',
    wageType: '시급',
    wageAmount: 11000,
    payDay: '매월 5일',
    payMethod: '근로자 명의 예금통장에 입금',
    bonusInfo: '없음',
    docFamily: '예',
    docParent: '예',
    insEmp: true,
    insAcc: false,
    insPen: false,
    insHea: false,
    docNote: '산재보험 미가입 설정',
    summary: '시급과 근로시간은 양호하나 산재보험 미가입으로 설정된 사례입니다. 4대 사회보험 중 산재보험의 법적 의무성을 확인해보세요.'
  },
  clothing: {
    key: 'clothing',
    code: '사례 G',
    title: '의류 매장 스태프',
    shortDesc: '의류 정리, 피팅룸 안내 및 고객 응대',
    employerCompany: 'SPA 패션 신촌점',
    employerName: '임팀장',
    employerAddress: '서울특별시 서대문구 연세로 15',
    employerPhone: '02-312-4455',
    workerName: '장서윤',
    workerAge: '2009.03.30 (만 17세)',
    workerAddress: '서울특별시 마포구 신촌로 150',
    workerPhone: '010-4444-5555',
    startDate: '2026-04-05',
    endDate: '',
    workplace: '의류 매장 1층, 2층',
    jobDescription: '의류 피팅룸 안내, 상품 정리 및 결제 보조',
    workStart: '12:00',
    workEnd: '17:00',
    breakStart: '',
    breakEnd: '',
    workDaysPerWeek: '주 3일',
    weeklyRestDay: '매주 일요일',
    wageType: '시급',
    wageAmount: 10200,
    payDay: '매월 20일',
    payMethod: '근로자 명의 예금통장에 입금',
    bonusInfo: '없음',
    docFamily: '예',
    docParent: '예',
    insEmp: true,
    insAcc: true,
    insPen: false,
    insHea: false,
    docNote: '휴게시간 미부여 (5시간 연속근무)',
    summary: '휴게시간 없이 12:00~17:00(5시간 연속 근무) 및 시급 10,200원이 설정된 계약 조건입니다. 근로기준법 제54조 휴게시간 기준을 점검해보세요.'
  },
  restaurant: {
    key: 'restaurant',
    code: '사례 H',
    title: '한식당 홀서빙',
    shortDesc: '점심 피크 타임 서빙 및 테이블 정리',
    employerCompany: '맛있는 한상 여의도점',
    employerName: '권대표',
    employerAddress: '서울특별시 영등포구 여의나루로 42',
    employerPhone: '02-780-3344',
    workerName: '조현우',
    workerAge: '2009.09.12 (만 17세)',
    workerAddress: '서울특별시 영등포구 국회대로 28',
    workerPhone: '010-2222-3333',
    startDate: '2026-03-10',
    endDate: '2026-09-10',
    workplace: '식당 홀 전체',
    jobDescription: '점심 피크타임 음식 서빙, 수저 세팅 및 테이블 정리',
    workStart: '11:00',
    workEnd: '16:00',
    breakStart: '14:00',
    breakEnd: '14:30',
    workDaysPerWeek: '주 3일',
    weeklyRestDay: '매주 일요일',
    wageType: '시급',
    wageAmount: 10320,
    payDay: '매월 10일',
    payMethod: '근로자 명의 예금통장에 입금',
    bonusInfo: '중식 제공',
    docFamily: '예',
    docParent: '예',
    insEmp: true,
    insAcc: true,
    insPen: false,
    insHea: false,
    docNote: '증명서 및 동의서 제출',
    summary: '2026년 법정 최저시급(10,320원)과 30분 휴게시간, 필수 동의서가 구비된 한식당 아르바이트 조건입니다.'
  },
  readingroom: {
    key: 'readingroom',
    code: '사례 I',
    title: '스터디카페 좌석관리',
    shortDesc: '좌석 소독, 정독실 정돈 및 음료 보충',
    employerCompany: '고요한 스터디카페 안암점',
    employerName: '오원장',
    employerAddress: '서울특별시 성북구 고려대로 88',
    employerPhone: '02-921-7788',
    workerName: '신유진',
    workerAge: '2009.12.01 (만 16세)',
    workerAddress: '서울특별시 성북구 개운사길 15',
    workerPhone: '010-9999-0000',
    startDate: '2026-04-15',
    endDate: '',
    workplace: '스터디카페 정독실 및 음료 바',
    jobDescription: '좌석 소독, 정독실 온도 체크, 음료 보충 및 청소',
    workStart: '18:00',
    workEnd: '21:00',
    breakStart: '',
    breakEnd: '',
    workDaysPerWeek: '주 2일',
    weeklyRestDay: '매주 일요일',
    wageType: '시급',
    wageAmount: 9500,
    payDay: '매월 30일',
    payMethod: '근로자 명의 예금통장에 입금',
    bonusInfo: '없음',
    docFamily: '아니오',
    docParent: '아니오',
    insEmp: false,
    insAcc: true,
    insPen: false,
    insHea: false,
    docNote: '증명서·동의서 미제출',
    summary: '하루 3시간 단시간 근무이나 시급 9,500원 및 연소자 증명 서류 미구비 조건이 포함된 스터디카페 사례입니다.'
  },
  themepark: {
    key: 'themepark',
    code: '사례 J',
    title: '테마파크 안내 요원',
    shortDesc: '놀이기구 대기줄 정돈 및 대기시간 안내',
    employerCompany: '롯데월드 어드벤처',
    employerName: '배팀장',
    employerAddress: '서울특별시 송파구 올림픽로 240',
    employerPhone: '02-411-2000',
    workerName: '성민재',
    workerAge: '2008.10.10 (만 17세)',
    workerAddress: '서울특별시 송파구 가락로 50',
    workerPhone: '010-6666-7777',
    startDate: '2026-05-10',
    endDate: '2026-08-31',
    workplace: '야외 어트랙션 가이드 존',
    jobDescription: '어트랙션 신장 제한 안내 및 대기줄 라인 정돈',
    workStart: '10:00',
    workEnd: '17:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    workDaysPerWeek: '주 2일',
    weeklyRestDay: '매주 월요일',
    wageType: '시급',
    wageAmount: 10800,
    payDay: '매월 10일',
    payMethod: '근로자 명의 예금통장에 입금',
    bonusInfo: '주말 근무 식권 지급',
    docFamily: '예',
    docParent: '예',
    insEmp: true,
    insAcc: true,
    insPen: false,
    insHea: false,
    docNote: '증명서 및 동의서 제출',
    summary: '주말 하루 6시간(체류 7시간 중 휴게 1시간), 시급 10,800원으로 구성된 테마파크 안내 요원 근무 조건입니다.'
  }
};

export function parseTimeMinutes(timeStr: string): number | null {
  if (!timeStr || !timeStr.includes(':')) return null;
  const [h, m] = timeStr.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

export interface WorkMetrics {
  totalStayMinutes: number;
  breakMinutes: number;
  netWorkMinutes: number;
  netWorkHours: number;
  daysPerWeek: number;
  weeklyWorkHours: number;
  hasNightWork: boolean;
  requiredBreakMinutes: number;
  isWeeklyHolidayAllowanceEligible: boolean;
  estimatedWeeklyBasePay: number;
  estimatedWeeklyHolidayPay: number;
}

export function calculateWorkMetrics(form: ContractFormData): WorkMetrics {
  const startMin = parseTimeMinutes(form.workStart);
  const endMin = parseTimeMinutes(form.workEnd);
  const bStartMin = parseTimeMinutes(form.breakStart);
  const bEndMin = parseTimeMinutes(form.breakEnd);

  let totalStayMinutes = 0;
  if (startMin !== null && endMin !== null) {
    totalStayMinutes = endMin - startMin;
    if (totalStayMinutes <= 0) totalStayMinutes += 24 * 60;
  }

  let breakMinutes = 0;
  if (bStartMin !== null && bEndMin !== null) {
    breakMinutes = bEndMin - bStartMin;
    if (breakMinutes < 0) breakMinutes += 24 * 60;
  }

  const netWorkMinutes = Math.max(0, totalStayMinutes - breakMinutes);
  const netWorkHours = Number((netWorkMinutes / 60).toFixed(1));

  const daysMatch = form.workDaysPerWeek.match(/\d+/);
  const daysPerWeek = daysMatch ? parseInt(daysMatch[0], 10) : 2;
  const weeklyWorkHours = Number((netWorkHours * daysPerWeek).toFixed(1));

  // Night work check: any work interval between 22:00 (1320) and 06:00 (360)
  let hasNightWork = false;
  if (startMin !== null && endMin !== null && totalStayMinutes > 0) {
    for (let offset = 0; offset < totalStayMinutes; offset += 15) {
      const currentMin = (startMin + offset) % (24 * 60);
      if (currentMin >= 22 * 60 || currentMin < 6 * 60) {
        hasNightWork = true;
        break;
      }
    }
  }

  // Required break based on net working hours:
  // 4 hours (240m) -> 30m break; 8 hours (480m) -> 60m break
  let requiredBreakMinutes = 0;
  if (netWorkMinutes >= 480 || totalStayMinutes >= 510) {
    requiredBreakMinutes = 60;
  } else if (netWorkMinutes >= 240 || totalStayMinutes >= 240) {
    requiredBreakMinutes = 30;
  }

  const isWeeklyHolidayAllowanceEligible = weeklyWorkHours >= 15;
  const hourlyWage = parseFloat(form.wageAmount) || 0;
  const estimatedWeeklyBasePay = Math.round(weeklyWorkHours * hourlyWage);
  const estimatedWeeklyHolidayPay = isWeeklyHolidayAllowanceEligible
    ? Math.round((Math.min(weeklyWorkHours, 35) / 35) * 7 * hourlyWage)
    : 0;

  return {
    totalStayMinutes,
    breakMinutes,
    netWorkMinutes,
    netWorkHours,
    daysPerWeek,
    weeklyWorkHours,
    hasNightWork,
    requiredBreakMinutes,
    isWeeklyHolidayAllowanceEligible,
    estimatedWeeklyBasePay,
    estimatedWeeklyHolidayPay
  };
}

export interface AuditItem {
  id: string;
  category: string;
  lawReference: string;
  passed: boolean;
  title: string;
  description: string;
  fixLabel?: string;
}

export function runLegalAudit(form: ContractFormData): {
  items: AuditItem[];
  violationsCount: number;
  passesCount: number;
  metrics: WorkMetrics;
} {
  const metrics = calculateWorkMetrics(form);
  const items: AuditItem[] = [];

  // 1. Minimum Wage Check
  const wageNum = parseFloat(form.wageAmount) || 0;
  if (form.wageType === '시급') {
    const passedWage = wageNum >= MINIMUM_WAGE_2026;
    items.push({
      id: 'wage',
      category: '최저임금 보장',
      lawReference: '최저임금법 제6조',
      passed: passedWage,
      title: passedWage
        ? `최저임금 기준 준수 (시급 ${wageNum.toLocaleString()}원)`
        : `최저임금 미달 위반 (현재 ${wageNum.toLocaleString()}원 / 기준 ${MINIMUM_WAGE_2026.toLocaleString()}원)`,
      description: passedWage
        ? `2026년 법정 최저시급(${MINIMUM_WAGE_2026.toLocaleString()}원) 이상으로 적법하게 책정되었습니다.`
        : `연소근로자도 성인과 동일한 최저임금(${MINIMUM_WAGE_2026.toLocaleString()}원)을 적용받으며, 계약기간 1년 미만 시 수습 감액도 금지됩니다.`,
      fixLabel: passedWage ? undefined : `시급을 법정 최저임금(${MINIMUM_WAGE_2026.toLocaleString()}원)으로 교정`
    });
  } else {
    const passedWage = wageNum >= MINIMUM_WAGE_2026;
    items.push({
      id: 'wage',
      category: '최저임금 보장',
      lawReference: '최저임금법 제6조',
      passed: passedWage,
      title: passedWage
        ? `${form.wageType} ${wageNum.toLocaleString()}원 기재 완료`
        : `임금 금액 미입력 또는 최저임금 기준 미달`,
      description: `시간당 환산 금액이 2026년 최저시급(${MINIMUM_WAGE_2026.toLocaleString()}원) 이상이어야 합니다.`,
      fixLabel: passedWage ? undefined : `시급 ${MINIMUM_WAGE_2026.toLocaleString()}원 기준으로 교정`
    });
  }

  // 2. Daily & Weekly Working Hours Check (1일 7시간, 1주 35시간)
  const passedHours =
    metrics.netWorkHours > 0 &&
    metrics.netWorkHours <= 7 &&
    metrics.weeklyWorkHours <= 35;

  items.push({
    id: 'hours',
    category: '연소자 법정근로시간',
    lawReference: '근로기준법 제69조',
    passed: passedHours,
    title: passedHours
      ? `법정 근로시간 준수 (1일 ${metrics.netWorkHours}시간 · 주 ${metrics.weeklyWorkHours}시간)`
      : `연소자 법정 근로시간 초과 (현재 1일 ${metrics.netWorkHours}시간 · 주 ${metrics.weeklyWorkHours}시간)`,
    description: passedHours
      ? `15세 이상 18세 미만 연소근로자의 법정 한도(1일 7시간, 1주 35시간 이내)를 준수했습니다.`
      : `연소근로자는 휴게시간을 제외한 실근로시간이 1일 7시간, 1주 35시간을 초과할 수 없습니다 (합의 시 1일 1시간, 주 5시간 한도 연장 가능).`,
    fixLabel: passedHours ? undefined : '1일 실근로 6시간(10:00~17:00, 휴게 1시간)으로 교정'
  });

  // 3. Night Work Check (22:00 ~ 06:00)
  const passedNight = !metrics.hasNightWork;
  items.push({
    id: 'night',
    category: '야간근로 제한',
    lawReference: '근로기준법 제70조',
    passed: passedNight,
    title: passedNight
      ? `야간근로 금지 시간대(22:00~06:00) 준수 (${form.workStart}~${form.workEnd})`
      : `야간근로 금지 위반 (${form.workStart}~${form.workEnd} 야간 시간대 포함)`,
    description: passedNight
      ? `오후 10시부터 오전 6시까지의 야간근로 시간대를 포함하지 않아 적법합니다.`
      : `18세 미만 연소근로자는 원칙적으로 오후 10시(22:00)부터 오전 6시(06:00)까지의 야간근로가 금지됩니다.`,
    fixLabel: passedNight ? undefined : '주간 근무 시간대(14:00~19:00, 휴게 30분)로 교정'
  });

  // 4. Break Time Check (4시간 이상 30분, 8시간 이상 1시간)
  const passedBreak = metrics.breakMinutes >= metrics.requiredBreakMinutes;
  items.push({
    id: 'break',
    category: '휴게시간 부여 의무',
    lawReference: '근로기준법 제54조',
    passed: passedBreak,
    title: passedBreak
      ? `법정 휴게시간 준수 (${metrics.breakMinutes}분 부여 / 기준 ${metrics.requiredBreakMinutes}분 이상)`
      : `법정 휴게시간 미달 (현재 ${metrics.breakMinutes}분 / 최소 ${metrics.requiredBreakMinutes}분 필요)`,
    description: passedBreak
      ? `근로시간 도중에 법정 기준 이상의 휴게시간이 보장되어 있습니다.`
      : `사용자는 근로시간이 4시간인 경우 30분 이상, 8시간인 경우 1시간 이상의 휴게시간을 근로시간 도중에 주어야 합니다.`,
    fixLabel: passedBreak ? undefined : '근로시간 도중 30분 휴게시간(14:00~14:30) 부여로 교정'
  });

  // 5. Mandatory Youth Certificates (가족관계증명서 & 친권자 동의서 & 만 15세 미만 확인)
  const isUnder15 = form.workerAge.includes('14세') || form.workerAge.includes('13세');
  const passedDocs = form.docFamily === '예' && form.docParent === '예';
  items.push({
    id: 'docs',
    category: '연소자 증명서 및 동의서',
    lawReference: isUnder15 ? '근로기준법 제64조·제66조' : '근로기준법 제66조',
    passed: passedDocs,
    title: passedDocs
      ? `가족관계증명서 및 친권자 동의서 구비 완료${isUnder15 ? ' (만 15세 미만 취직인허증 확인 요망)' : ''}`
      : `필수 구비 서류 미비 (가족관계증명서: ${form.docFamily}, 친권자 동의서: ${form.docParent})`,
    description: passedDocs
      ? isUnder15
        ? `가족관계증명서와 친권자 동의서가 구비되었으며, 만 13~14세는 고용노동부장관의 취직인허증을 함께 비치해야 합니다.`
        : `18세 미만 연소근로자 고용 시 필수 비치 서류인 가족관계기록사항 증명서와 친권자(후견인) 동의서가 모두 구비되었습니다.`
      : `사업주는 18세 미만인 자에 대하여 연령을 증명하는 가족관계기록사항 증명서와 친권자 또는 후견인의 동의서를 사업장에 갖추어 두어야 합니다.`,
    fixLabel: passedDocs ? undefined : '가족관계증명서 및 친권자 동의서 구비(예)로 교정'
  });

  // 6. Industrial Accident Compensation Insurance (산재보험)
  const passedInsurance = form.insAcc;
  items.push({
    id: 'insurance',
    category: '산재보험 의무 가입',
    lawReference: '산업재해보상보험법',
    passed: passedInsurance,
    title: passedInsurance
      ? '산재보험 의무 가입 적용 완료'
      : '산재보험 미가입 위반 (1인 이상 사업장 필수 가입)',
    description: passedInsurance
      ? '아르바이트 청소년도 업무상 재해 시 치료비와 휴업급여를 보장받을 수 있도록 산재보험이 적용되었습니다.'
      : '산재보험은 근로자를 1명이라도 고용하는 모든 사업장에 당연 적용되며, 보험료는 전액 사업주가 부담합니다.',
    fixLabel: passedInsurance ? undefined : '산재보험 및 고용보험 적용으로 교정'
  });

  const violationsCount = items.filter((i) => !i.passed).length;
  const passesCount = items.filter((i) => i.passed).length;

  return {
    items,
    violationsCount,
    passesCount,
    metrics
  };
}

export function formatDateKorean(dateStr: string): string {
  if (!dateStr) return '____년 __월 __일';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일`;
}

export function formatTimeKorean(timeStr: string): string {
  if (!timeStr) return '__시 __분';
  const [h, m] = timeStr.split(':');
  return `${h}시 ${m}분`;
}
