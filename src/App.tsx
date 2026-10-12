
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import {
  ArrowRight,
  Check,
  Clipboard,
  ExternalLink,
  FlaskConical,
  Info,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from 'lucide-react'

import {
  generatePrompt,
  initialForm,
  type FormData,
  type Channel,
  type Framework,
} from './prompt'

// ============================================================
// 1. 선택 옵션
// ============================================================

const tones = [
  '친근하고 명료한',
  '전문적이고 신뢰감 있는',
  '감성적이고 따뜻한',
  '위트 있고 경쾌한',
  '고급스럽고 절제된',
]

const channels: Channel[] = [
  '메타 광고',
  '인스타그램',
  '상세페이지',
  'CRM',
]

const frameworks: {
  key: Framework
  label: string
  desc: string
}[] = [
  {
    key: 'AIDA',
    label: 'AIDA',
    desc: '주목 → 관심 → 욕구 → 행동',
  },
  {
    key: 'PAS',
    label: 'PAS',
    desc: '문제 → 공감 → 해결',
  },
  {
    key: 'FAB',
    label: 'FAB',
    desc: '특징 → 장점 → 혜택',
  },
]

// ============================================================
// 2. 메인 컴포넌트
// ============================================================

export default function App() {
  // 입력 데이터 및 UI 상태
  const [form, setForm] = useState<FormData>(initialForm)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  // 입력값이 변경될 때 프롬프트 재계산
  const prompt = useMemo(() => generatePrompt(form), [form])

  // ----------------------------------------------------------
  // 입력값 업데이트
  // ----------------------------------------------------------

  const update = <K extends keyof FormData>(
    key: K,
    value: FormData[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))

    setGenerated(false)
    setCopied(false)
    setError('')
  }

  // ----------------------------------------------------------
  // 입력값 초기화
  // ----------------------------------------------------------

  const reset = () => {
    setForm({ ...initialForm })
    setGenerated(false)
    setCopied(false)
    setError('')
  }

  // ----------------------------------------------------------
  // 프롬프트 생성
  // ----------------------------------------------------------

  const generate = () => {
    if (!form.brand.trim() || !form.product.trim()) {
      setError('브랜드명과 상품/서비스 정보를 입력해 주세요.')
      return
    }

    setError('')
    setGenerated(true)

    setTimeout(() => {
      document.getElementById('result')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 0)
  }

  // ----------------------------------------------------------
  // 클립보드 복사
  // ----------------------------------------------------------

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
    } catch {
      setError(
        '자동 복사가 제한되었습니다. 미리보기 텍스트를 직접 선택해 복사해 주세요.',
      )
    }
  }

  // ----------------------------------------------------------
  // 입력 컴포넌트 헬퍼
  // ----------------------------------------------------------

  const input = (key: keyof FormData, placeholder: string) => (
    <input
      className="field"
      value={form[key]}
      onChange={(e) => update(key, e.target.value as never)}
      placeholder={placeholder}
    />
  )

  const area = (
    key: keyof FormData,
    placeholder: string,
    rows = 3,
  ) => (
    <textarea
      rows={rows}
      className="field resize-y"
      value={form[key]}
      onChange={(e) => update(key, e.target.value as never)}
      placeholder={placeholder}
    />
  )

  // ==========================================================
  // 3. 화면 렌더링
  // ==========================================================

  return (
    <div className="min-h-screen">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 h-18 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-600 p-2 text-white">
              <FlaskConical size={21} />
            </div>

            <span className="text-lg font-extrabold tracking-tight">
              PROMPT <span className="text-teal-600">LAB</span>
            </span>

            <span className="hidden sm:inline text-xs text-slate-400 border-l pl-3 ml-1">
              브랜드 카피 프롬프트 스튜디오
            </span>
          </div>

          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck size={15} className="text-teal-600" />
            로컬에서만 처리
          </span>

        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24">

        {/* ====================================================
            HERO SECTION
        ==================================================== */}

        <section className="py-12 sm:py-16">

          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 text-teal-700 px-3 py-1.5 text-xs font-semibold mb-5">
            <Sparkles size={13} />
            무료 마케팅 프롬프트 생성기
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            브랜드의 언어를,
            <br />
            <span className="text-teal-600">
              더 정확한 프롬프트로.
            </span>
          </h1>

          <p className="mt-5 text-slate-500 leading-7 max-w-2xl">
            브랜드 가이드와 캠페인 목표를 입력하면,
            채널에 맞는 AI 카피라이팅 프롬프트를 즉시 완성합니다.
            별도 가입 없이 무료로 이용하세요.
          </p>

          <div className="flex flex-wrap gap-4 mt-6 text-xs text-slate-500">
            <span>✓ 회원가입 불필요</span>
            <span>✓ 외부 API 호출 없음</span>
            <span>✓ 입력 데이터 저장 안 함</span>
          </div>

        </section>

        {/* ====================================================
            01. 브랜드 가이드
            02. 캠페인 설정
        ==================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 01. 브랜드 가이드 */}

          <section className="panel">
            <SectionHead
              num="01"
              title="브랜드 가이드"
              sub="브랜드의 정체성과 말투를 정의해 주세요."
            />

            <div className="space-y-5">

              <Field label="브랜드명" required>
                {input('brand', '예: 브랜드명')}
              </Field>

              <Field label="브랜드 소개">
                {area(
                  'description',
                  '브랜드가 제공하는 가치, 주요 고객, 차별점을 입력하세요.',
                )}
              </Field>

              <Field label="브랜드 톤앤매너">
                <select
                  className="field"
                  value={form.tone}
                  onChange={(e) => update('tone', e.target.value)}
                >
                  {tones.map((tone) => (
                    <option key={tone}>{tone}</option>
                  ))}
                </select>
              </Field>

              <Field label="브랜드 핵심 키워드" hint="쉼표로 구분">
                {input(
                  'keywords',
                  '예: 간편함, 신뢰, 일상, 지속가능성',
                )}
              </Field>

              <Field label="금지 표현" hint="쉼표로 구분">
                {area(
                  'forbidden',
                  '예: 무조건, 업계 1위, 100% 보장',
                  2,
                )}
              </Field>

            </div>
          </section>

          {/* 02. 캠페인 설정 */}

          <section className="panel">
            <SectionHead
              num="02"
              title="캠페인 설정"
              sub="채널과 목표에 맞는 카피 방향을 설정해 주세요."
            />

            <div className="space-y-5">

              <Field label="마케팅 채널">
                <div className="grid grid-cols-2 gap-2">
                  {channels.map((channel) => (
                    <button
                      type="button"
                      key={channel}
                      onClick={() => update('channel', channel)}
                      className={
                        'choice ' +
                        (form.channel === channel ? 'selected' : '')
                      }
                    >
                      {channel}

                      {form.channel === channel && (
                        <Check size={15} />
                      )}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="캠페인 목표">
                {input(
                  'goal',
                  '예: 구매 전환, 브랜드 인지도, 재방문',
                )}
              </Field>

              <Field label="타깃 고객">
                {area(
                  'audience',
                  '예: 25~34세 직장인, 바쁜 일상 속 간편한 솔루션을 찾는 고객',
                  2,
                )}
              </Field>

              <Field label="상품/서비스 정보" required>
                {area(
                  'product',
                  '상품명, 특징, 가격 등 확인된 정보를 입력하세요.',
                  2,
                )}
              </Field>

              <Field label="핵심 혜택">
                {area(
                  'benefit',
                  '고객이 실제로 얻는 이점과 차별점을 입력하세요.',
                  2,
                )}
              </Field>

            </div>
          </section>

        </div>

        {/* ====================================================
            03. 카피라이팅 프레임워크
        ==================================================== */}

        <section className="panel mt-6">

          <SectionHead
            num="03"
            title="카피라이팅 프레임워크"
            sub="원하는 설득 구조를 선택하세요."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            {frameworks.map((framework) => (
              <button
                type="button"
                key={framework.key}
                onClick={() =>
                  update('framework', framework.key)
                }
                className={
                  'framework ' +
                  (
                    form.framework === framework.key
                      ? 'selected'
                      : ''
                  )
                }
              >
                <div className="flex justify-between items-center">
                  <strong>{framework.label}</strong>

                  {form.framework === framework.key && (
                    <Check size={17} />
                  )}
                </div>

                <span className="text-xs text-slate-500 mt-2 block">
                  {framework.desc}
                </span>
              </button>
            ))}

          </div>

          {/* 실행 버튼 */}

          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8 pt-6 border-t border-slate-100">

            <button
              type="button"
              className="secondary"
              onClick={reset}
            >
              <RotateCcw size={16} />
              입력값 초기화
            </button>

            <button
              type="button"
              className="primary"
              onClick={generate}
            >
              <WandSparkles size={17} />
              프롬프트 생성하기
              <ArrowRight size={16} />
            </button>

          </div>

          {error && (
            <p
              role="alert"
              className="mt-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

        </section>

        {/* ====================================================
            04. 프롬프트 결과
        ==================================================== */}

        <section
          id="result"
          className="panel mt-6 scroll-mt-6"
        >

          {/* 결과 헤더 */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">

            <div>
              <div className="flex items-center gap-2">
                <span className="step">04</span>
                <h2 className="text-xl font-bold">
                  프롬프트 결과
                </h2>
              </div>

              <p className="text-sm text-slate-500 mt-2">
                완성된 프롬프트를 복사해 ChatGPT에 붙여넣으세요.
              </p>
            </div>

            <button
              type="button"
              disabled={!generated}
              onClick={copy}
              className="secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {copied ? (
                <Check size={16} />
              ) : (
                <Clipboard size={16} />
              )}

              {copied ? '복사 완료' : '프롬프트 복사'}
            </button>

          </div>

          {/* 생성된 프롬프트 또는 빈 상태 */}

          {generated ? (

            <div className="result" aria-live="polite">
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-7">
                {prompt}
              </pre>
            </div>

          ) : (

            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 min-h-48 flex flex-col items-center justify-center text-center p-8">

              <div className="rounded-xl bg-white p-3 text-slate-400 mb-3">
                <FlaskConical size={25} />
              </div>

              <p className="font-semibold text-slate-600">
                아직 생성된 프롬프트가 없습니다
              </p>

              <p className="text-sm text-slate-400 mt-1">
                위 입력을 완료하고 생성 버튼을 눌러주세요.
              </p>

            </div>

          )}

          {/* 생성 후 하단 액션 */}

          {generated && (
            <div className="flex flex-wrap items-center justify-between gap-3 mt-5">

              <span className="text-xs text-slate-400">
                총 {prompt.length.toLocaleString('ko-KR')}자
                {' · '}브라우저에서만 생성
              </span>

              <a
                className="primary"
                href="https://chatgpt.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ChatGPT 열기
                <ExternalLink size={16} />
              </a>

            </div>
          )}

        </section>

        {/* ====================================================
            개인정보 안내
        ==================================================== */}

        <div className="mt-6 flex items-start gap-2 text-xs text-slate-500 leading-6">

          <Info
            size={16}
            className="shrink-0 mt-1 text-teal-600"
          />

          <p>
            입력값은 브라우저 메모리에서만 사용하며 저장하거나
            전송하지 않습니다. ChatGPT 열기는 별도 사이트로
            이동하며, 프롬프트는 자동 전송되지 않습니다.
            직접 붙여넣기 전에 민감한 정보를 확인하세요.
          </p>

        </div>

      </main>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} PROMPT LAB
        {' · '}Built for better marketing prompts.
      </footer>

    </div>
  )
}

// ============================================================
// 4. 공통 컴포넌트
// ============================================================

interface SectionHeadProps {
  num: string
  title: string
  sub: string
}

function SectionHead({
  num,
  title,
  sub,
}: SectionHeadProps) {
  return (
    <div className="mb-7">

      <div className="flex items-center gap-2">
        <span className="step">{num}</span>

        <h2 className="text-xl font-bold">
          {title}
        </h2>
      </div>

      <p className="mt-2 text-sm text-slate-500">
        {sub}
      </p>

    </div>
  )
}

interface FieldProps {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
}

function Field({
  label,
  hint,
  required,
  children,
}: FieldProps) {
  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}

        {required && (
          <span className="text-teal-600"> *</span>
        )}

        {hint && (
          <span className="text-xs font-normal text-slate-400 ml-2">
            {hint}
          </span>
        )}
      </label>

      {children}

    </div>
  )
}
