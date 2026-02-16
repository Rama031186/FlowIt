import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../data/mockData';
import { FiCheck, FiUpload, FiArrowRight, FiArrowLeft, FiFileText } from 'react-icons/fi';

export default function ApplyPolicy() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const steps = ['Select Product', 'Personal Details', 'Medical Info', 'Review & Submit'];

  if (submitted) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-center animate-fade-in">
          <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 20px', background: 'rgba(45,156,91,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiCheck size={36} color="#2d9c5b" />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 24 }}>Application Submitted!</h2>
          <p style={{ opacity: 0.5, fontSize: 14, maxWidth: 400, margin: '8px auto 24px' }}>Your application has been submitted successfully. Our underwriting team will review it and get back to you soon.</p>
          <button className="btn btn-primary" onClick={() => navigate('/policies')}>View My Policies</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <h1>Apply for Policy</h1>
        <p>Complete the steps below to submit your insurance application</p>
      </div>

      {/* Stepper */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            {steps.map((s, i) => (
              <div key={i} className="d-flex align-items-center flex-fill">
                <div className="d-flex align-items-center gap-2">
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: i <= step ? '#192b37' : 'rgba(25,43,55,0.08)',
                    color: i <= step ? 'white' : '#192b37',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, transition: 'all 0.3s'
                  }}>
                    {i < step ? <FiCheck size={14} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: i === step ? 700 : 500, opacity: i === step ? 1 : 0.5 }} className="d-none d-md-inline">{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-fill mx-3" style={{ height: 2, background: i < step ? '#192b37' : 'rgba(25,43,55,0.08)', transition: 'all 0.3s' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step 0: Select Product */}
      {step === 0 && (
        <div className="row g-3">
          {PRODUCTS.filter(p => p.status === 'Active').map(p => (
            <div className="col-md-4" key={p.id}>
              <div
                className={`module-card ${selectedProduct === p.id ? 'selected' : ''}`}
                onClick={() => setSelectedProduct(p.id)}
                style={{ padding: 20 }}
              >
                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, opacity: 0.5, marginBottom: 6 }}>{p.category}</div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 12 }}>{p.description.substring(0, 80)}...</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>${p.basePrice}<span style={{ fontSize: 12, fontWeight: 500, opacity: 0.5 }}>/mo</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Personal Details */}
      {step === 1 && (
        <div className="card">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Full Name</label>
                <input className="form-control" placeholder="Enter full name" defaultValue="Sarah Johnson" />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Date of Birth</label>
                <input type="date" className="form-control" defaultValue="1990-05-15" />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Email</label>
                <input type="email" className="form-control" placeholder="Enter email" defaultValue="sarah@email.com" />
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Phone</label>
                <input className="form-control" placeholder="Enter phone" defaultValue="+1 555-0123" />
              </div>
              <div className="col-md-12">
                <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Address</label>
                <input className="form-control" placeholder="Enter address" defaultValue="123 Main Street, New York, NY 10001" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Medical Info */}
      {step === 2 && (
        <div className="card">
          <div className="card-body">
            <div className="mb-4">
              <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Do you have any pre-existing medical conditions?</label>
              <div className="d-flex gap-2">
                <button className="module-card" style={{ padding: '8px 24px', minWidth: 0 }}>Yes</button>
                <button className="module-card selected" style={{ padding: '8px 24px', minWidth: 0 }}>No</button>
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>Upload Medical Records (optional)</label>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                border: '2px dashed rgba(25,43,55,0.12)', borderRadius: 14, padding: '24px',
                cursor: 'pointer', textAlign: 'center'
              }}>
                <FiUpload size={24} style={{ opacity: 0.3, marginBottom: 8 }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Click to upload</span>
                <input type="file" style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center gap-3 mb-4 p-3" style={{ background: 'rgba(88,153,196,0.06)', borderRadius: 12 }}>
              <FiFileText size={24} style={{ color: '#5899c4' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Ready to Submit</div>
                <div style={{ fontSize: 13, opacity: 0.6 }}>Review your details before submitting your application</div>
              </div>
            </div>
            <div className="row g-3">
              {[
                { label: 'Product', value: PRODUCTS.find(p => p.id === selectedProduct)?.name || 'LifeGuard Plus' },
                { label: 'Applicant', value: 'Sarah Johnson' },
                { label: 'Email', value: 'sarah@email.com' },
                { label: 'Pre-existing Conditions', value: 'None' },
              ].map(item => (
                <div className="col-md-6" key={item.label}>
                  <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={() => step > 0 ? setStep(step - 1) : navigate('/products')} style={{ fontSize: 13 }}>
          <FiArrowLeft size={14} /> {step === 0 ? 'Back to Products' : 'Previous'}
        </button>
        <button className="btn btn-warning d-flex align-items-center gap-2" onClick={() => step < 3 ? setStep(step + 1) : setSubmitted(true)} style={{ fontSize: 13 }}
          disabled={step === 0 && !selectedProduct}
        >
          {step === 3 ? 'Submit Application' : 'Continue'} <FiArrowRight size={14} />
        </button>
      </div>
    </>
  );
}
