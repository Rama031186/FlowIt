import { FiActivity, FiAlertCircle, FiCheck, FiShield } from 'react-icons/fi';

const riskFactors = [
  { factor: 'Age', score: 15, impact: 'Low', detail: 'Age 35 — within standard range' },
  { factor: 'BMI', score: 22, impact: 'Medium', detail: 'BMI of 27.5 — slightly above optimal' },
  { factor: 'Smoking Status', score: 0, impact: 'Low', detail: 'Non-smoker — no additional risk' },
  { factor: 'Family History', score: 18, impact: 'Medium', detail: 'Father had heart disease at age 62' },
  { factor: 'Occupation', score: 5, impact: 'Low', detail: 'Office-based work — low occupational risk' },
  { factor: 'Medical History', score: 12, impact: 'Medium', detail: 'Minor surgery in 2024 — fully recovered' },
];

export default function RiskExplanation() {
  const totalScore = riskFactors.reduce((sum, f) => sum + f.score, 0);
  const riskLevel = totalScore <= 35 ? 'Low' : totalScore <= 70 ? 'Medium' : 'High';
  const riskColor = totalScore <= 35 ? '#2d9c5b' : totalScore <= 70 ? '#ff5640' : '#d4403b';

  return (
    <>
      <div className="mb-4">
        <h1>Risk Explanation</h1>
        <p>Understanding how your risk assessment was calculated</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 h-100 text-center">
            <div style={{
              width: 100, height: 100, borderRadius: '50%', margin: '0 auto 16px',
              background: `conic-gradient(${riskColor} 0% ${totalScore}%, rgba(25,43,55,0.06) ${totalScore}% 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
            }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: riskColor }}>{totalScore}</span>
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Overall Risk Score</div>
            <span className={`status-badge ${riskLevel.toLowerCase()} mt-2`}>{riskLevel} Risk</span>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card h-100">
            <div className="card-header">
              <h5><FiAlertCircle size={16} /> What This Means</h5>
            </div>
            <div className="card-body">
              <p style={{ fontSize: 14, lineHeight: 1.7 }}>
                Your risk score of <strong>{totalScore}</strong> is classified as <strong style={{ color: riskColor }}>{riskLevel} Risk</strong>.
                This score is calculated based on multiple factors including your age, health history, lifestyle, and family medical background.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.7 }}>
                A {riskLevel.toLowerCase()} risk score means your application will be reviewed by our underwriting team
                {totalScore <= 35 ? ' and is likely to be approved quickly.' : totalScore <= 70 ? ' and may require additional documentation.' : ' and may face additional scrutiny or conditions.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Risk Factor Breakdown</h5>
        </div>
        <div className="card-body">
          {riskFactors.map((f, i) => (
            <div key={i} className="d-flex align-items-center gap-3 p-3 mb-2" style={{ background: 'rgba(25,43,55,0.02)', borderRadius: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: f.impact === 'Low' ? 'rgba(45,156,91,0.1)' : f.impact === 'Medium' ? 'rgba(255,86,64,0.1)' : 'rgba(212,64,59,0.1)',
                color: f.impact === 'Low' ? '#2d9c5b' : f.impact === 'Medium' ? '#ff5640' : '#d4403b',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FiActivity size={18} />
              </div>
              <div className="flex-fill">
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{f.factor}</span>
                  <span className={`status-badge ${f.impact.toLowerCase()}`} style={{ fontSize: 11 }}>{f.impact} Impact</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2 }}>{f.detail}</div>
                <div style={{ height: 4, background: 'rgba(25,43,55,0.06)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{
                    width: `${f.score}%`, height: '100%', borderRadius: 2,
                    background: f.impact === 'Low' ? '#2d9c5b' : f.impact === 'Medium' ? '#ff5640' : '#d4403b',
                    transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
