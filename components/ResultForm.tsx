'use client';

import { FormEvent, useMemo, useState } from 'react';
import { tasks } from '@/lib/tasks';

const today = new Date().toISOString().slice(0, 10);

type Result = { ok: boolean; id?: string; message?: string; errors?: unknown };

export function ResultForm() {
  const [taskCode, setTaskCode] = useState(tasks[0]?.code ?? '');
  const selectedTask = useMemo(() => tasks.find(t => t.code === taskCode) ?? tasks[0], [taskCode]);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setResult(null);
    const form = new FormData(e.currentTarget);
    const checkbox = (name: string) => form.get(name) === 'on';

    const payload = {
      task_code: taskCode,
      task_name: selectedTask?.name || '',
      department: form.get('department'),
      writer_name: form.get('writer_name'),
      written_date: form.get('written_date'),
      process_owner: form.get('process_owner'),

      business_purpose: form.get('business_purpose'),
      current_usage: form.get('current_usage'),
      target_users: form.get('target_users'),
      related_systems: form.get('related_systems'),
      major_input_data: form.get('major_input_data'),
      major_outputs: form.get('major_outputs'),

      usage_frequency: form.get('usage_frequency'),
      time_before: form.get('time_before'),
      time_after: form.get('time_after'),
      error_reduction: form.get('error_reduction'),
      satisfaction: form.get('satisfaction'),
      field_feedback: form.get('field_feedback'),
      quantitative_effect: form.get('quantitative_effect'),
      qualitative_effect: form.get('qualitative_effect'),

      required_values_rule: form.get('required_values_rule'),
      calculation_rule: form.get('calculation_rule'),
      decision_rule: form.get('decision_rule'),
      approval_rule: form.get('approval_rule'),
      permission_rule: form.get('permission_rule'),
      error_handling_rule: form.get('error_handling_rule'),
      output_format_rule: form.get('output_format_rule'),

      source_data: form.get('source_data'),
      input_location_fields: form.get('input_location_fields'),
      linked_target: form.get('linked_target'),
      security_permission: form.get('security_permission'),
      attachment_required: form.get('attachment_required'),
      api_sync_required: form.get('api_sync_required'),

      reusable_other_departments: checkbox('reusable_other_departments'),
      common_module_possible: checkbox('common_module_possible'),
      standard_form_reusable: checkbox('standard_form_reusable'),
      operational_conversion_possible: checkbox('operational_conversion_possible'),
      integration_candidate: checkbox('integration_candidate'),

      problems: form.get('problems'),
      additional_requests: form.get('additional_requests'),
      verification_items: form.get('verification_items'),
      next_step: form.get('next_step'),

      business_effect_level: form.get('business_effect_level'),
      reusability_level: form.get('reusability_level'),
      integration_priority: form.get('integration_priority'),
      final_decision: form.get('final_decision'),
    };

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setPending(false);
    setResult(data);
    if (data.ok) e.currentTarget.reset();
  }

  return (
    <form onSubmit={submit}>
      {result && (
        <div className={`status ${result.ok ? '' : 'error'}`}>
          {result.ok ? <>저장 완료. 접수번호: <b>{result.id}</b></> : <>저장 실패: {result.message}</>}
        </div>
      )}

      <div className="grid meta-grid">
        <div className="card meta-card"><span className="meta-icon">📄</span><div><label>과제명</label><select value={taskCode} onChange={e => setTaskCode(e.target.value)}>{tasks.map(t => <option key={t.code} value={t.code}>{t.code} · {t.name}</option>)}</select></div></div>
        <div className="card meta-card"><span className="meta-icon">#</span><div><label>과제코드</label><input value={selectedTask?.code || ''} readOnly /></div></div>
        <div className="card meta-card"><span className="meta-icon">🏢</span><div><label>부서</label><input name="department" defaultValue={selectedTask?.departments || ''} required /></div></div>
        <div className="card meta-card"><span className="meta-icon">👤</span><div><label>작성자</label><input name="writer_name" placeholder="이름을 입력하세요." required /></div></div>
        <div className="card meta-card"><span className="meta-icon">📅</span><div><label>작성일</label><input name="written_date" type="date" defaultValue={today} required /></div></div>
        <div className="card meta-card"><span className="meta-icon">👥</span><div><label>Process Owner</label><input name="process_owner" placeholder="업무오너 이름" required /></div></div>
      </div>

      <div className="grid two-col">
        <section className="card section">
          <div className="section-title"><span className="badge">1</span> 과제 개요</div>
          <div className="section-body">
            <table className="table"><tbody>
              <tr><td className="label">업무 목적</td><td><textarea name="business_purpose" placeholder="이 과제를 수행하는 목적을 입력하세요." required /></td></tr>
              <tr><td className="label">현재 사용 방식</td><td><textarea name="current_usage" placeholder="현재 업무 처리 방식을 입력하세요." required /></td></tr>
              <tr><td className="label">적용 대상/사용자</td><td><textarea name="target_users" placeholder="사용 대상이나 직무를 입력하세요." required /></td></tr>
              <tr><td className="label">관련 시스템</td><td><input name="related_systems" placeholder="ERP, Sheets, 메일 등" /></td></tr>
              <tr><td className="label">주요 입력 데이터</td><td><textarea name="major_input_data" required /></td></tr>
              <tr><td className="label">주요 산출물</td><td><textarea name="major_outputs" required /></td></tr>
            </tbody></table>
          </div>
        </section>

        <section className="card section">
          <div className="section-title"><span className="badge teal">2</span> 실제 사용 결과</div>
          <div className="section-body">
            <table className="table"><tbody>
              <tr><td className="label">사용 빈도</td><td><input name="usage_frequency" placeholder="예: 하루 5건, 월 100건" /></td></tr>
              <tr><td className="label">처리시간(전)</td><td><input type="number" name="time_before" placeholder="분 단위" /></td></tr>
              <tr><td className="label">처리시간(후)</td><td><input type="number" name="time_after" placeholder="분 단위" /></td></tr>
              <tr><td className="label">오류·누락 감소</td><td><input name="error_reduction" placeholder="예: 월 10건 → 1건" /></td></tr>
              <tr><td className="label">사용 만족도</td><td><select name="satisfaction" defaultValue=""><option value="">선택</option><option value="5">5점</option><option value="4">4점</option><option value="3">3점</option><option value="2">2점</option><option value="1">1점</option></select></td></tr>
              <tr><td className="label">현업 의견</td><td><textarea name="field_feedback" /></td></tr>
              <tr><td className="label">정량 효과</td><td><textarea name="quantitative_effect" /></td></tr>
              <tr><td className="label">정성 효과</td><td><textarea name="qualitative_effect" /></td></tr>
            </tbody></table>
          </div>
        </section>
      </div>

      <section className="card section" style={{marginTop:12}}>
        <div className="section-title"><span className="badge">3</span> 업무 규칙 수집</div>
        <div className="section-body">
          <table className="table"><thead><tr><th style={{width:160}}>구분</th><th>업무 규칙</th><th>예외/주의사항</th></tr></thead><tbody>
            <tr><td className="label">필수값</td><td><textarea name="required_values_rule" placeholder="고객ID, 날짜, 금액 등 필수 입력값" /></td><td rowSpan={7}><textarea name="verification_items" placeholder="검증이 필요한 항목과 예외를 입력하세요." style={{minHeight:330}} /></td></tr>
            <tr><td className="label">계산식</td><td><textarea name="calculation_rule" placeholder="총금액 = 수량 × 단가 등" /></td></tr>
            <tr><td className="label">판정기준</td><td><textarea name="decision_rule" placeholder="금액 1,000만원 이상은 팀장 승인" /></td></tr>
            <tr><td className="label">승인규칙</td><td><textarea name="approval_rule" placeholder="담당자 → 부서장 → 대표이사" /></td></tr>
            <tr><td className="label">권한</td><td><textarea name="permission_rule" placeholder="조회/수정/다운로드 가능자" /></td></tr>
            <tr><td className="label">에러 처리</td><td><textarea name="error_handling_rule" placeholder="필수값 누락 시 경고 메시지 표시" /></td></tr>
            <tr><td className="label">출력 형식</td><td><textarea name="output_format_rule" placeholder="엑셀 다운로드, PDF 저장 등" /></td></tr>
          </tbody></table>
        </div>
      </section>

      <div className="grid three-col" style={{marginTop:12}}>
        <section className="card section">
          <div className="section-title"><span className="badge">4</span> 데이터·연계 정보</div>
          <div className="section-body">
            <table className="table"><tbody>
              <tr><td className="label">원천 데이터</td><td><input name="source_data" placeholder="ERP, 매출, 고객 DB" /></td></tr>
              <tr><td className="label">입력 위치/필드</td><td><input name="input_location_fields" /></td></tr>
              <tr><td className="label">연계 대상</td><td><input name="linked_target" /></td></tr>
              <tr><td className="label">보안/권한</td><td><input name="security_permission" /></td></tr>
              <tr><td className="label">첨부 파일 여부</td><td><input name="attachment_required" /></td></tr>
              <tr><td className="label">API/수기입력 여부</td><td><input name="api_sync_required" /></td></tr>
            </tbody></table>
          </div>
        </section>

        <section className="card section">
          <div className="section-title"><span className="badge green">5</span> 재사용·확장 가능성</div>
          <div className="section-body">
            <p className="check"><input type="checkbox" name="reusable_other_departments" /> 다른 부서 적용 가능</p>
            <p className="check"><input type="checkbox" name="common_module_possible" /> 공통 모듈화 가능</p>
            <p className="check"><input type="checkbox" name="standard_form_reusable" /> 표준 양식 재사용 가능</p>
            <p className="check"><input type="checkbox" name="operational_conversion_possible" /> 운영 전환 가능</p>
            <p className="check"><input type="checkbox" name="integration_candidate" /> 우선 통합 후보</p>
          </div>
        </section>

        <section className="card section">
          <div className="section-title"><span className="badge">6</span> 확인 및 요청사항</div>
          <div className="section-body">
            <table className="table"><tbody>
              <tr><td className="label">문제점</td><td><textarea name="problems" /></td></tr>
              <tr><td className="label">추가 개발 요청</td><td><textarea name="additional_requests" /></td></tr>
              <tr><td className="label">다음 단계</td><td><textarea name="next_step" /></td></tr>
            </tbody></table>
          </div>
        </section>
      </div>

      <section className="card section" style={{marginTop:12}}>
        <div className="section-body inline">
          <b>최종 판정</b>
          <span>업무 효과</span><select name="business_effect_level" defaultValue="보통"><option>높음</option><option>보통</option><option>낮음</option></select>
          <span>재사용성</span><select name="reusability_level" defaultValue="보통"><option>높음</option><option>보통</option><option>낮음</option></select>
          <span>통합 우선순위</span><select name="integration_priority" defaultValue="중"><option>상</option><option>중</option><option>하</option></select>
          <span>결정</span><select name="final_decision" defaultValue="추가 검토"><option>통합 MVP 후보</option><option>보류</option><option>추가 검토</option></select>
        </div>
      </section>

      <div className="actions">
        <span className="notice">로그인 없이 누구나 작성 가능하지만, 운영 전에는 스팸 방지·회사망 제한·민감정보 입력금지 안내를 권장합니다.</span>
        <button disabled={pending}>{pending ? '저장 중...' : 'Supabase 저장 + Google Sheet 취합'}</button>
      </div>
    </form>
  );
}
