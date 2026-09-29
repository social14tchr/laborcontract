import React from 'react';
import { BookOpen, Scale, X } from 'lucide-react';
import { MINIMUM_WAGE_2026 } from '../data/scenarios';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <h3 className="font-bold text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>통합사회 ② 청소년 근로보호 핵심 법률 가이드</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="가이드 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <Scale className="w-4 h-4 text-sky-700" />
              <span>청소년 근로자 권리 보호 5대 핵심 원칙</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>
                <strong>원칙 1 (취업 최저연령 기준 · 근로기준법 제64조):</strong>{' '}
                원칙적으로 만 15세 이상부터 근로가 가능합니다. (단, 만 13세 이상 15세 미만인 자는 고용노동부장관이 발급한 취직인허증이 있어야 근로 가능)
              </li>
              <li>
                <strong>원칙 2 (필수 비치 서류 · 근로기준법 제66조):</strong>{' '}
                사업주는 18세 미만 연소근로자의 연령을 증명하는 <strong>가족관계기록사항에 관한 증명서</strong>와 <strong>친권자(또는 후견인) 동의서</strong>를 사업장에 반드시 갖추어 두어야 합니다.
              </li>
              <li>
                <strong>원칙 3 (법정 근로시간 제한 · 근로기준법 제69조):</strong>{' '}
                15세 이상 18세 미만인 자의 근로시간은 <strong>1일에 7시간, 1주에 35시간</strong>을 초과하지 못합니다. (당사자 합의 시 1일 1시간, 1주 5시간 한도 내에서만 연장 가능)
              </li>
              <li>
                <strong>원칙 4 (최저임금 보장 · 최저임금법 제6조):</strong>{' '}
                연소근로자도 성인과 동일한 법정 최저임금(2026년 기준 시간급{' '}
                <span className="font-mono-num font-bold text-slate-900">
                  {MINIMUM_WAGE_2026.toLocaleString()}원
                </span>
                )을 적용받습니다. 근로계약 기간이 1년 미만인 경우에는 수습을 이유로 최저임금을 감액할 수 없습니다.
              </li>
              <li>
                <strong>원칙 5 (야간 및 휴일근로 금지 · 근로기준법 제70조):</strong>{' '}
                오후 10시(22:00)부터 오전 6시(06:00)까지의 야간근로 및 휴일근로는 원칙적으로 금지됩니다.
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              휴게시간·주휴수당·산재보험 필수 상식
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">휴게시간 (제54조)</div>
                <p className="text-slate-600">
                  4시간 근로 시 30분 이상, 8시간 근로 시 1시간 이상의 휴게시간을 근로시간 도중에 부여해야 합니다.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">주휴수당 (제55조)</div>
                <p className="text-slate-600">
                  1주 소정근로시간이 15시간 이상이고 약속한 근무일을 개근하면 주 1회 유급주휴일(주휴수당)이 발생합니다.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">산재보험 당연적용</div>
                <p className="text-slate-600">
                  아르바이트 청소년도 일하다 다치면 산재보험으로 치료와 보상을 받을 수 있습니다 (1인 이상 사업장 필수).
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span>권리 침해 상담 및 신고: 고용노동부 고객상담센터 (국번없이 1350)</span>
            <span>청소년근로권익센터: 1644-3119</span>
          </div>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 text-right">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
