import { useMemo, useState } from 'react'
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Calculator, Check, ClipboardCopy, Instagram, RotateCcw, SlidersHorizontal, Target } from 'lucide-react'

type Metrics = { impressions: number; ctr: number; cvr: number; spend: number }
type ClickMode = 'ctr' | 'clicks'
type Tab = 'simulation' | 'target'

const DEFAULT: Metrics = { impressions: 100000, ctr: 2, cvr: 5, spend: 3000000 }
const won = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`
const number = (n: number) => Math.round(n).toLocaleString('ko-KR')
const percent = (n: number) => `${n.toFixed(2)}%`
const bounded = (n: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min))

function compute(m: Metrics, clicksOverride?: number) {
  const clicks = clicksOverride === undefined ? Math.round(m.impressions * m.ctr / 100) : clicksOverride
  const conversions = clicks * m.cvr / 100
  return {
    clicks,
    ctr: m.impressions > 0 ? clicks / m.impressions * 100 : 0,
    conversions,
    cpa: conversions > 0 ? m.spend / conversions : null,
    cpc: clicks > 0 ? m.spend / clicks : null,
  }
}

function NumberControl({ label, value, onChange, min, max, step, unit, hint }: {
  label: string; value: number; onChange: (value: number) => void
  min: number; max: number; step: number; unit: string; hint?: string
}) {
  const [draft, setDraft] = useState<string | null>(null)
  const commit = (raw: string) => {
    const parsed = Number(raw)
    onChange(bounded(parsed, min, Number.MAX_SAFE_INTEGER))
    setDraft(null)
  }
  return <div className="control">
    <div className="control-top">
      <div><label>{label}</label>{hint && <p className="control-hint">{hint}</p>}</div>
      <div className="number-input"><input aria-label={label} type="number" min={min} step={step} value={draft ?? String(value)} onChange={e => setDraft(e.target.value)} onBlur={e => commit(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }} /><span>{unit}</span></div>
    </div>
    <input aria-label={`${label} 슬라이더`} className="range" type="range" min={min} max={max} step={step} value={bounded(value, min, max)} onChange={e => { setDraft(null); onChange(Number(e.target.value)) }} />
    <div className="range-labels"><span>{number(min)}{unit}</span><span>{number(max)}{unit}</span></div>
  </div>
}

function MetricCard({ label, value, delta, betterWhen, highlight = false }: { label: string; value: string; delta?: number | null; betterWhen?: 'up' | 'down'; highlight?: boolean }) {
  const good = delta !== undefined && delta !== null && (betterWhen === 'down' ? delta <= 0 : delta >= 0)
  return <div className={`metric ${highlight ? 'metric-highlight' : ''}`}>
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}</div>
    {delta !== undefined && <div className={`delta ${delta === null ? 'muted' : good ? 'good' : 'bad'}`}>
      {delta === null ? '기준 대비 비교 불가' : <>{delta > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{delta > 0 ? '+' : ''}{delta.toFixed(1)}% <span>vs 기준</span></>}
    </div>}
  </div>
}

export default function App() {
  const [base, setBase] = useState<Metrics>({ ...DEFAULT })
  const [current, setCurrent] = useState<Metrics>({ ...DEFAULT })
  const [mode, setMode] = useState<ClickMode>('ctr')
  const [manualClicks, setManualClicks] = useState(2000)
  const [targetCPA, setTargetCPA] = useState(25000)
  const [tab, setTab] = useState<Tab>('simulation')
  const [copied, setCopied] = useState(false)

  const baseline = useMemo(() => compute(base), [base])
  const result = useMemo(() => compute(current, mode === 'clicks' ? bounded(manualClicks, 0, current.impressions) : undefined), [current, mode, manualClicks])
  const convDelta = baseline.conversions > 0 ? (result.conversions / baseline.conversions - 1) * 100 : null
  const cpaDelta = baseline.cpa !== null && result.cpa !== null ? (result.cpa / baseline.cpa - 1) * 100 : null
  const neededConversions = targetCPA > 0 ? Math.ceil(current.spend / targetCPA) : null
  const neededCVR = neededConversions !== null && result.clicks > 0 ? neededConversions / result.clicks * 100 : null
  const neededClicks = neededConversions !== null && current.cvr > 0 ? Math.ceil(neededConversions / (current.cvr / 100)) : null
  const neededCTR = neededClicks !== null && current.impressions > 0 ? neededClicks / current.impressions * 100 : null
  const targetPossible = neededConversions !== null && neededCVR !== null && neededCVR <= 100 && neededCTR !== null && neededCTR <= 100

  const change = (key: keyof Metrics, value: number) => setCurrent(prev => ({ ...prev, [key]: bounded(value, 0, key === 'ctr' || key === 'cvr' ? 100 : Number.MAX_SAFE_INTEGER) }))
  const reset = () => { setBase({ ...DEFAULT }); setCurrent({ ...DEFAULT }); setMode('ctr'); setManualClicks(2000); setTargetCPA(25000); setCopied(false) }
  const copy = async () => {
    const content = `DB 광고 성과 시뮬레이터\n노출량: ${number(current.impressions)}\n클릭수: ${number(result.clicks)}\nCTR: ${percent(result.ctr)}\nCVR: ${percent(current.cvr)}\n광고비: ${won(current.spend)}\n예상 DB 전환수: ${result.conversions.toFixed(2)}건\n예상 CPA: ${result.cpa === null ? '산출 불가' : won(result.cpa)}\n목표 CPA: ${won(targetCPA)}\n목표 달성 필요 DB: ${neededConversions ?? '산출 불가'}건`
    try { await navigator.clipboard.writeText(content); setCopied(true); window.setTimeout(() => setCopied(false), 1800) } catch { window.alert('복사에 실패했습니다. 브라우저의 클립보드 권한을 확인해 주세요.') }
  }

  return <div className="site">
    <header className="header"><div className="shell header-inner">
      <a className="brand" href="#top"><span className="brand-icon"><BarChart3 size={21} /></span><span>AD <strong>CALCULATOR</strong></span></a>
      <a className="social" href="https://www.instagram.com/perfor_meow/" target="_blank" rel="noopener noreferrer"><Instagram size={17} /><span>@perfor_meow</span></a>
    </div></header>

    <main id="top" className="shell">
      <div className="hero"><div className="eyebrow"><Activity size={14} /> MARKETING PERFORMANCE TOOL</div><h1>DB 광고 성과 <span>시뮬레이터</span></h1><p>노출량, 광고비, CTR, CVR을 조정해 예상 DB 전환수와 CPA를 계산하고 목표 달성 조건을 역산해 보세요.</p></div>
      <div className="summary-grid">
        <MetricCard label="예상 DB 전환수" value={`${number(result.conversions)}건`} delta={convDelta} betterWhen="up" highlight />
        <MetricCard label="예상 CPA" value={result.cpa === null ? '산출 불가' : won(result.cpa)} delta={cpaDelta} betterWhen="down" highlight />
        <MetricCard label="예상 클릭수" value={`${number(result.clicks)}회`} />
        <MetricCard label="예상 CPC" value={result.cpc === null ? '산출 불가' : won(result.cpc)} />
      </div>

      <div className="tabs" role="tablist" aria-label="계산 방식">
        <button role="tab" aria-selected={tab === 'simulation'} className={tab === 'simulation' ? 'active' : ''} onClick={() => setTab('simulation')}><SlidersHorizontal size={17} /> 성과 시뮬레이션</button>
        <button role="tab" aria-selected={tab === 'target'} className={tab === 'target' ? 'active' : ''} onClick={() => setTab('target')}><Target size={17} /> 목표 CPA 역산</button>
      </div>

      {tab === 'simulation' ? <div className="main-grid">
        <div className="stack">
          <section className="panel"><div className="panel-title"><div><span className="step">01</span><h2>기준 성과</h2></div><button className="subtle-btn" onClick={() => setBase({ ...current, ctr: result.ctr })}>현재 값을 기준으로 설정</button></div><p className="panel-desc">성과 증감률을 비교할 기준 데이터를 입력하세요.</p>
            <div className="base-grid">
              {([{ key: 'impressions', label: '노출량', unit: '회' }, { key: 'ctr', label: 'CTR', unit: '%' }, { key: 'cvr', label: 'CVR', unit: '%' }, { key: 'spend', label: '광고비', unit: '원' }] as const).map(item => <label className="base-field" key={item.key}><span>{item.label}</span><div className="base-input"><input type="number" min="0" max={item.key === 'ctr' || item.key === 'cvr' ? 100 : undefined} step={item.key === 'ctr' || item.key === 'cvr' ? 0.1 : 1} value={base[item.key]} onChange={e => setBase(p => ({ ...p, [item.key]: bounded(Number(e.target.value), 0, item.key === 'ctr' || item.key === 'cvr' ? 100 : Number.MAX_SAFE_INTEGER) }))} /><span>{item.unit}</span></div></label>)}
            </div>
          </section>
          <section className="panel"><div className="panel-title"><div><span className="step">02</span><h2>변경 성과 조정</h2></div></div><p className="panel-desc">슬라이더를 움직이거나 숫자를 직접 입력하세요.</p>
            <NumberControl label="노출량" value={current.impressions} onChange={v => change('impressions', v)} min={0} max={1000000} step={1000} unit="회" />
            <NumberControl label="광고비" value={current.spend} onChange={v => change('spend', v)} min={0} max={20000000} step={10000} unit="원" />
            <div className="mode-heading">클릭수 계산 방식</div><div className="toggle"><button className={mode === 'ctr' ? 'selected' : ''} onClick={() => setMode('ctr')}>CTR 기준</button><button className={mode === 'clicks' ? 'selected' : ''} onClick={() => setMode('clicks')}>클릭수 직접 조정</button></div>
            {mode === 'ctr' ? <NumberControl label="CTR" value={current.ctr} onChange={v => change('ctr', v)} min={0} max={15} step={0.1} unit="%" /> : <NumberControl label="클릭수" value={Math.min(manualClicks, current.impressions)} onChange={v => setManualClicks(bounded(Math.round(v), 0, current.impressions))} min={0} max={Math.max(1, current.impressions)} step={1} unit="회" hint={`계산된 CTR ${percent(result.ctr)}`} />}
            <NumberControl label="CVR" value={current.cvr} onChange={v => change('cvr', v)} min={0} max={30} step={0.1} unit="%" />
          </section>
        </div>
        <aside className="panel comparison"><div className="panel-title"><div><span className="step">03</span><h2>기준 대비 예상 성과</h2></div></div><p className="panel-desc">입력 조건을 기준으로 산출한 예상값입니다.</p>
          <div className="table-scroll"><table><thead><tr><th>지표</th><th>기준</th><th>변경</th></tr></thead><tbody>
            <tr><td>노출량</td><td>{number(base.impressions)}</td><td>{number(current.impressions)}</td></tr>
            <tr><td>클릭수</td><td>{number(baseline.clicks)}</td><td>{number(result.clicks)}</td></tr>
            <tr><td>CTR</td><td>{percent(baseline.ctr)}</td><td>{percent(result.ctr)}</td></tr>
            <tr><td>CVR</td><td>{percent(base.cvr)}</td><td>{percent(current.cvr)}</td></tr>
            <tr><td>광고비</td><td>{won(base.spend)}</td><td>{won(current.spend)}</td></tr>
            <tr className="emphasis"><td>DB 전환수</td><td>{number(baseline.conversions)}건</td><td>{number(result.conversions)}건</td></tr>
            <tr className="emphasis"><td>CPA</td><td>{baseline.cpa === null ? '—' : won(baseline.cpa)}</td><td>{result.cpa === null ? '—' : won(result.cpa)}</td></tr>
          </tbody></table></div>
          <div className="insight"><Calculator size={18} /><p>광고비를 고정한 상태에서 CTR이나 CVR이 높아지면 예상 DB 전환수가 증가하고 CPA가 낮아집니다.</p></div>
        </aside>
      </div> : <div className="target-grid"><section className="panel"><div className="panel-title"><div><span className="step">01</span><h2>목표 CPA 설정</h2></div></div><p className="panel-desc">현재 시뮬레이션의 광고비와 전환율을 기준으로 필요한 성과를 역산합니다.</p><NumberControl label="목표 CPA" value={targetCPA} onChange={v => setTargetCPA(v)} min={1000} max={100000} step={1000} unit="원" /><div className="target-note">현재 예상 CPA <strong>{result.cpa === null ? '산출 불가' : won(result.cpa)}</strong></div></section>
        <section className="panel"><div className="panel-title"><div><span className="step">02</span><h2>목표 달성 조건</h2></div></div><p className="panel-desc">다른 변수를 고정했을 때 각각 필요한 수치입니다.</p><div className="target-results"><div><span>필요 DB 전환수</span><strong>{neededConversions === null ? '—' : `${number(neededConversions)}건`}</strong></div><div><span>필요 CVR (클릭 고정)</span><strong>{neededCVR === null ? '—' : percent(neededCVR)}</strong></div><div><span>필요 클릭수 (CVR 고정)</span><strong>{neededClicks === null ? '—' : `${number(neededClicks)}회`}</strong></div><div><span>필요 CTR (노출 고정)</span><strong>{neededCTR === null ? '—' : percent(neededCTR)}</strong></div></div>{!targetPossible && <p className="warning">일부 목표 조건은 현재 노출량 또는 클릭수에서 달성할 수 없습니다. 필요 CTR/CVR이 100%를 초과하는지 확인하세요.</p>}</section>
      </div>}

      <div className="bottom-bar"><div className="bottom-note">* 전환수는 기대값이며 실제 광고 성과를 보장하지 않습니다. CPA는 반올림 전 기대 전환수로 계산합니다.</div><div className="bottom-actions"><button className="reset-btn" onClick={reset}><RotateCcw size={16} /> 전체 초기화</button><button className="copy-btn" onClick={copy}>{copied ? <Check size={16} /> : <ClipboardCopy size={16} />}{copied ? '복사 완료' : '결과 복사'}</button></div></div>
    </main><footer className="footer"><div className="shell">© {new Date().getFullYear()} AD CALCULATOR · DB 광고 성과 시뮬레이터</div></footer>
  </div>
}
