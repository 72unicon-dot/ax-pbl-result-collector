import { tasks } from '@/lib/tasks';

export default function TasksPage() {
  return (
    <main className="container" style={{padding:'32px 0'}}>
      <h1>과제 마스터</h1>
      <p className="subtitle">신일 P&S 48개 AX-PBL 과제 리스트에서 가져온 선택용 마스터 데이터입니다.</p>
      <table className="table">
        <thead><tr><th>순위</th><th>코드</th><th>과제명</th><th>유형</th><th>점수</th><th>등급</th><th>권장단계</th><th>주요 부서</th></tr></thead>
        <tbody>{tasks.map(t => <tr key={t.code}><td>{t.rank}</td><td>{t.code}</td><td>{t.name}</td><td>{t.type}</td><td>{t.score}</td><td>{t.grade}</td><td>{t.recommended_stage}</td><td>{t.departments}</td></tr>)}</tbody>
      </table>
    </main>
  );
}
