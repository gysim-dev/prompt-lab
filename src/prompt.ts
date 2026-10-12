export type Channel = '메타 광고' | '인스타그램' | '상세페이지' | 'CRM'
export type Framework = 'AIDA' | 'PAS' | 'FAB'
export type FormData = {brand:string;description:string;tone:string;keywords:string;forbidden:string;channel:Channel;goal:string;audience:string;product:string;benefit:string;framework:Framework}
export const initialForm: FormData = {brand:'',description:'',tone:'친근하고 명료한',keywords:'',forbidden:'',channel:'메타 광고',goal:'전환 유도',audience:'',product:'',benefit:'',framework:'AIDA'}
const channelRules:Record<Channel,string> = {
 '메타 광고':'피드 광고에 적합한 짧은 첫 문장(훅), 설득력 있는 본문, 명확한 CTA를 작성한다. 과장·오해를 유발하는 표현과 개인의 민감한 특성을 단정하는 표현을 피한다.',
 '인스타그램':'스크롤을 멈추게 하는 첫 문장, 모바일에서 읽기 쉬운 짧은 문단, 자연스러운 참여 유도 문장과 관련 해시태그를 작성한다.',
 '상세페이지':'고객의 문제와 제품의 해결 가치, 핵심 혜택, 구매 전 확인 사항, CTA를 정보 위계에 따라 섹션별로 구성한다.',
 'CRM':'기존 고객과의 관계를 고려해 메시지를 간결하게 작성한다. 제목/첫 문장/본문/CTA를 분리하고 과도한 긴급성·스팸성 문구를 피한다.'
}
const frameworkRules:Record<Framework,string> = {
 AIDA:'Attention(주목) → Interest(관심) → Desire(욕구) → Action(행동)의 흐름으로 작성한다.',
 PAS:'Problem(문제) → Agitate(문제의 영향) → Solution(해결)의 흐름으로 작성한다.',
 FAB:'Feature(특징) → Advantage(장점) → Benefit(고객 혜택)의 흐름으로 작성한다.'
}
const clean = (s:string) => s.trim() || '정보 미입력 (추측하지 말고 필요한 경우 확인 질문)'
export function generatePrompt(f:FormData):string {
 return `# 역할\n당신은 브랜드 가이드를 준수하는 한국어 마케팅 카피라이터입니다. 아래 제공된 사실만 근거로 ${f.channel}용 카피를 작성하세요.\n\n# 브랜드 정보\n- 브랜드명: ${clean(f.brand)}\n- 브랜드 소개: ${clean(f.description)}\n- 톤앤매너: ${f.tone}\n- 핵심 키워드: ${clean(f.keywords)}\n- 금지 표현: ${clean(f.forbidden)}\n\n# 캠페인 정보\n- 채널: ${f.channel}\n- 목표: ${clean(f.goal)}\n- 타깃: ${clean(f.audience)}\n- 상품/서비스: ${clean(f.product)}\n- 핵심 혜택: ${clean(f.benefit)}\n\n# 채널별 작성 규칙\n${channelRules[f.channel]}\n\n# 카피라이팅 프레임워크: ${f.framework}\n${frameworkRules[f.framework]}\n\n# 반드시 지킬 조건\n1. 브랜드 톤앤매너를 일관되게 유지하고 금지 표현은 어떤 형태로도 사용하지 마세요.\n2. 제공되지 않은 가격, 할인율, 성과 수치, 인증, 수상 이력, 후기, 고객 사례, 효능, 보장 내용은 만들어내지 마세요.\n3. 사실 확인이 필요한 주장은 임의로 단정하지 말고 [확인 필요]로 표시하세요.\n4. 타깃을 존중하고 오해의 소지가 있는 과장·공포·차별 표현을 피하세요.\n5. 입력값에 없는 필수 정보는 추측하지 말고 마지막에 질문으로 정리하세요.\n\n# 출력 형식\n- 서로 다른 방향의 카피 3안을 한국어로 제시하세요.\n- 각 안마다 '컨셉', '헤드라인', '본문', 'CTA', '적용한 ${f.framework} 구조'를 구분하세요.\n- 각 안의 차별점과 채널 적합성을 한 문장으로 설명하세요.\n- 마지막에 '검증 필요 사항'을 정리하세요.\n- 불필요한 서론 없이 결과부터 작성하세요.`
}
