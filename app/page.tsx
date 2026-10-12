import { ResultForm } from '@/components/ResultForm';

export default function Home() {
  return (
    <main>
      <div className="topbar">
        <div className="container">
          <div className="kicker">SPECIAL LECTURE</div>
          <h1>48개 과제별 실제 사용 결과·업무 규칙 표준 양식</h1>
          <p className="subtitle">과제 리스트를 기준으로 현업 사용 결과와 업무 규칙을 수집하고, Supabase와 Google Sheets에 동시에 취합합니다.</p>
          <ResultForm />
        </div>
      </div>
    </main>
  );
}
