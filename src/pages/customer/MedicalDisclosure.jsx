import { useState } from 'react';
import { FiUpload, FiFileText, FiCheck, FiAlertCircle } from 'react-icons/fi';

export default function MedicalDisclosure() {
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});

  const questions = [
    { id: 'q1', text: 'Have you been diagnosed with any chronic illness in the last 5 years?' },
    { id: 'q2', text: 'Are you currently taking any prescription medication?' },
    { id: 'q3', text: 'Have you undergone any surgical procedures in the past 3 years?' },
    { id: 'q4', text: 'Do you have a family history of heart disease, cancer, or diabetes?' },
    { id: 'q5', text: 'Have you been hospitalized in the last 2 years?' },
  ];

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-center animate-fade-in">
          <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px', background: 'rgba(45,156,91,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiCheck size={36} color="#2d9c5b" />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 24 }}>Disclosure Submitted</h2>
          <p style={{ opacity: 0.5, fontSize: 14 }}>Your medical disclosure has been submitted successfully. Our underwriting team will review it shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Medical Disclosure</h1>
        <p>Please answer the health questions and upload any relevant medical documents</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="content-card mb-4">
            <div className="card-header-custom">
              <h5>Health Questionnaire</h5>
              <span style={{ fontSize: 12, opacity: 0.5 }}>{Object.keys(answers).length} / {questions.length} answered</span>
            </div>
            <div className="card-body-custom">
              {questions.map((q, i) => (
                <div key={q.id} className="mb-4 pb-3" style={{ borderBottom: i < questions.length - 1 ? '1px solid rgba(25,43,55,0.04)' : 'none' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{i + 1}. {q.text}</p>
                  <div className="d-flex gap-2">
                    {['Yes', 'No'].map(opt => (
                      <button
                        key={opt}
                        className={`module-card ${answers[q.id] === opt ? 'selected' : ''}`}
                        style={{ padding: '8px 24px', minWidth: 0 }}
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="content-card mb-4">
            <div className="card-header-custom">
              <h5>Upload Documents</h5>
            </div>
            <div className="card-body-custom">
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '2px dashed rgba(25,43,55,0.12)', borderRadius: 14, padding: '32px 20px',
                cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
              }}>
                <FiUpload size={28} style={{ opacity: 0.3, marginBottom: 12 }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Click to upload</span>
                <span style={{ fontSize: 11, opacity: 0.4, marginTop: 4 }}>PDF, JPG or PNG up to 10MB</span>
                <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>

              {files.length > 0 && (
                <div className="mt-3">
                  {files.map((f, i) => (
                    <div key={i} className="d-flex align-items-center gap-2 p-2 mb-1" style={{ background: 'rgba(25,43,55,0.02)', borderRadius: 8 }}>
                      <FiFileText size={14} style={{ opacity: 0.4 }} />
                      <span style={{ fontSize: 12, flex: 1 }}>{f.name}</span>
                      <span style={{ fontSize: 10, opacity: 0.4 }}>{(f.size / 1024).toFixed(0)} KB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="content-card">
            <div className="card-body-custom">
              <div className="d-flex gap-2 align-items-start mb-3" style={{ background: 'rgba(88,153,196,0.06)', padding: 12, borderRadius: 10 }}>
                <FiAlertCircle size={16} style={{ color: '#5899c4', flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 12, opacity: 0.7 }}>All information is encrypted and only accessible to authorized underwriters.</span>
              </div>
              <button
                className="btn-accent w-100"
                disabled={Object.keys(answers).length < questions.length}
                onClick={handleSubmit}
              >
                Submit Disclosure
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
