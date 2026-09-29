import React from 'react';
import {
  ContractFormData,
  formatDateKorean,
  formatTimeKorean
} from '../data/scenarios';

interface ContractPaperProps {
  formData: ContractFormData;
  signatures: {
    employer: string | null;
    worker: string | null;
  };
  onOpenSignature?: (role: 'employer' | 'worker') => void;
  paperRef?: React.RefObject<HTMLDivElement | null>;
  compact?: boolean;
}

export const ContractPaper: React.FC<ContractPaperProps> = ({
  formData,
  signatures,
  onOpenSignature,
  paperRef,
  compact = false
}) => {
  const empCompany = formData.employerCompany.trim() || '(사업체명)';
  const empName = formData.employerName.trim() || '(사업주 성명)';
  const empAddress = formData.employerAddress.trim() || '_______';
  const empPhone = formData.employerPhone.trim() || '_______';

  const wrkName = formData.workerName.trim() || '(근로자 성명)';
  const wrkAge = formData.workerAge.trim() || '_______';
  const wrkAddress = formData.workerAddress.trim() || '_______';
  const wrkPhone = formData.workerPhone.trim() || '_______';

  const startDateStr = formatDateKorean(formData.startDate);
  const endDateStr = formData.endDate
    ? `${formatDateKorean(formData.startDate)} ~ ${formatDateKorean(formData.endDate)}까지`
    : '기간의 정함이 없음';

  const wageNum = parseFloat(formData.wageAmount);
  const formattedWage = !isNaN(wageNum) && formData.wageAmount.trim() !== ''
    ? wageNum.toLocaleString()
    : '______';

  const breakTimeStr =
    formData.breakStart && formData.breakEnd
      ? `${formatTimeKorean(formData.breakStart)} ~ ${formatTimeKorean(formData.breakEnd)}`
      : '없음';

  return (
    <div
      ref={paperRef}
      className={`contract-paper bg-white border border-slate-300 text-slate-900 select-text ${
        compact
          ? 'p-5 sm:p-6 rounded-xl text-xs leading-relaxed'
          : 'p-6 sm:p-10 rounded-xl text-xs sm:text-sm leading-relaxed shadow-sm'
      }`}
    >
      {/* Document Title Header */}
      <div className="text-center pb-5 border-b-2 border-slate-800 mb-5">
        <h2
          className={`font-bold tracking-widest text-slate-900 underline underline-offset-8 decoration-slate-400 font-batang ${
            compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'
          }`}
        >
          연소근로자(18세 미만 인 자) 표준근로계약서
        </h2>
      </div>

      {/* Contract Preamble */}
      <p className="mb-4 leading-loose text-justify">
        <span className="font-bold underline px-1">{empCompany}</span> (이하 “사업주”라 함)과(와){' '}
        <span className="font-bold underline px-1">{wrkName}</span> (이하 “근로자”라 함)은 다음과 같이 근로계약을 체결한다.
      </p>

      {/* Contract Body Items */}
      <ol className="space-y-2.5">
        <li>
          <strong className="font-bold">1. 근로개시일 :</strong>{' '}
          <span className="font-semibold font-mono-num">{startDateStr}</span> 부터
          <div className="text-xs text-slate-600 pl-4 mt-0.5">
            ※ 근로계약기간을 정하는 경우 :{' '}
            <span className="font-semibold font-mono-num">{endDateStr}</span>
          </div>
        </li>

        <li>
          <strong className="font-bold">2. 근 무 장 소 :</strong>{' '}
          <span className="font-semibold">{formData.workplace || '_______'}</span>
        </li>

        <li>
          <strong className="font-bold">3. 업무의 내용 :</strong>{' '}
          <span className="font-semibold">{formData.jobDescription || '_______'}</span>
        </li>

        <li>
          <strong className="font-bold">4. 소정근로시간 :</strong>{' '}
          <span className="font-semibold font-mono-num">
            {formatTimeKorean(formData.workStart)}
          </span>{' '}
          부터{' '}
          <span className="font-semibold font-mono-num">
            {formatTimeKorean(formData.workEnd)}
          </span>{' '}
          까지 (휴게시간 :{' '}
          <span className="font-semibold font-mono-num">{breakTimeStr}</span>)
        </li>

        <li>
          <strong className="font-bold">5. 근무일/휴일 :</strong>{' '}
          <span className="font-semibold">{formData.workDaysPerWeek} 근무</span>, 주휴일{' '}
          <span className="font-semibold">{formData.weeklyRestDay}</span>
        </li>

        <li>
          <strong className="font-bold">6. 임 금 :</strong>
          <ul className="pl-4 space-y-1 mt-1">
            <li>
              · <span>{formData.wageType}</span> :{' '}
              <span className="font-bold text-slate-900 font-mono-num">
                {formattedWage}
              </span>{' '}
              원
            </li>
            <li>
              · 상여금 및 기타수당 :{' '}
              <span>{formData.bonusInfo || '상여금 없음'}</span>
            </li>
            <li>
              · 임금지급일 : <span>{formData.payDay || '_______'}</span>
            </li>
            <li>
              · 지급방법 : <span>{formData.payMethod}</span>
            </li>
          </ul>
        </li>

        <li>
          <strong className="font-bold">7. 연차유급휴가 :</strong>{' '}
          <span className="text-slate-700">
            연차유급휴가는 근로기준법에서 정하는 바에 따라 부여함.
          </span>
        </li>

        <li className="bg-slate-50 p-2.5 rounded border border-slate-200">
          <strong className="font-bold text-slate-900">
            8. 가족관계증명서 및 동의서 :
          </strong>
          <ul className="pl-4 space-y-0.5 text-xs mt-1 text-slate-800">
            <li>
              - 가족관계기록사항에 관한 증명서 제출 여부 :{' '}
              <span className="font-bold">{formData.docFamily}</span>
            </li>
            <li>
              - 친권자 또는 후견인의 동의서 구비 여부 :{' '}
              <span className="font-bold">{formData.docParent}</span>
            </li>
          </ul>
        </li>

        <li>
          <strong className="font-bold">9. 사회보험 적용여부 :</strong> (해당란에 체크)
          <div className="flex flex-wrap gap-4 pl-4 mt-1 text-xs font-mono-num">
            <span>[{formData.insEmp ? 'v' : ' '}] 고용보험</span>
            <span>[{formData.insAcc ? 'v' : ' '}] 산재보험</span>
            <span>[{formData.insPen ? 'v' : ' '}] 국민연금</span>
            <span>[{formData.insHea ? 'v' : ' '}] 건강보험</span>
          </div>
        </li>

        <li>
          <strong className="font-bold">10. 근로계약서 교부 :</strong>{' '}
          <span className="text-slate-700">
            사업주는 근로계약을 체결함과 동시에 본 계약서를 사본하여 근로자의 요구와 관계없이 근로자에게 교부함 (근로기준법 제17조, 제67조 이행)
          </span>
        </li>

        <li>
          <strong className="font-bold">
            11. 근로계약, 취업규칙 등의 성실한 이행의무 :
          </strong>{' '}
          <span className="text-slate-700">
            사업주와 근로자는 각자가 근로계약, 취업규칙, 단체협약을 지키고 성실하게 이행하여야 함.
          </span>
        </li>

        <li>
          <strong className="font-bold">12. 기 타 :</strong>{' '}
          <span className="text-slate-700">
            13세 이상 15세 미만인 자에 대해서는 고용노동부장관으로부터 취직인허증을 교부받아야 하며, 이 계약에 정함이 없는 사항은 근로기준법령에 의함.
          </span>
        </li>
      </ol>

      {/* Contract Date */}
      <div className="text-center my-6 font-bold text-sm sm:text-base font-mono-num">
        <span>{formatDateKorean(formData.contractDate)}</span>
      </div>

      {/* Signatures Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-400 text-xs sm:text-sm">
        {/* Employer Info & Signature */}
        <div className="space-y-1.5">
          <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex justify-between items-center">
            <span>(사업주)</span>
            <span className="text-[11px] font-normal text-slate-500">(서명 또는 인)</span>
          </div>
          <div>
            · 사업체명 : <span className="font-medium">{empCompany}</span>
          </div>
          <div>
            · 전 화 : <span className="font-medium font-mono-num">{empPhone}</span>
          </div>
          <div>
            · 주 소 : <span className="font-medium">{empAddress}</span>
          </div>
          <div className="flex items-center justify-between pt-1.5 gap-2">
            <span>
              · 대표자 성명 : <span className="font-bold">{empName}</span>
            </span>
            <button
              type="button"
              onClick={() => onOpenSignature && onOpenSignature('employer')}
              title="클릭하여 사업주 서명 입력"
              className={`w-28 h-12 border border-dashed rounded flex items-center justify-center bg-slate-50 relative overflow-hidden transition-colors ${
                onOpenSignature
                  ? 'hover:border-sky-600 hover:bg-sky-50/40 cursor-pointer'
                  : 'cursor-default'
              } ${signatures.employer ? 'border-slate-300 bg-white' : 'border-slate-300'}`}
            >
              {signatures.employer ? (
                <img
                  src={signatures.employer}
                  className="w-full h-full object-contain p-0.5"
                  alt="사업주 서명 이미지"
                />
              ) : (
                <span className="text-[11px] text-slate-400">
                  {onOpenSignature ? '서명하기 (클릭)' : '서명미완료'}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Worker Info & Signature */}
        <div className="space-y-1.5">
          <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex justify-between items-center">
            <span>(근로자)</span>
            <span className="text-[11px] font-normal text-slate-500">(서명)</span>
          </div>
          <div>
            · 주 소 : <span className="font-medium">{wrkAddress}</span>
          </div>
          <div>
            · 연 락 처 : <span className="font-medium font-mono-num">{wrkPhone}</span>
          </div>
          <div>
            · 생년월일 : <span className="font-medium font-mono-num">{wrkAge}</span>
          </div>
          <div className="flex items-center justify-between pt-1.5 gap-2">
            <span>
              · 성 명 : <span className="font-bold">{wrkName}</span>
            </span>
            <button
              type="button"
              onClick={() => onOpenSignature && onOpenSignature('worker')}
              title="클릭하여 근로자 서명 입력"
              className={`w-28 h-12 border border-dashed rounded flex items-center justify-center bg-slate-50 relative overflow-hidden transition-colors ${
                onOpenSignature
                  ? 'hover:border-sky-600 hover:bg-sky-50/40 cursor-pointer'
                  : 'cursor-default'
              } ${signatures.worker ? 'border-slate-300 bg-white' : 'border-slate-300'}`}
            >
              {signatures.worker ? (
                <img
                  src={signatures.worker}
                  className="w-full h-full object-contain p-0.5"
                  alt="근로자 서명 이미지"
                />
              ) : (
                <span className="text-[11px] text-slate-400">
                  {onOpenSignature ? '서명하기 (클릭)' : '서명미완료'}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
