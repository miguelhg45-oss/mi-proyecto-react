import { useState, useEffect, useRef } from "react";

const ADMIN_PASSWORD = "admin123";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

  :root {
    --navy: #0a1f44;
    --navy-mid: #122b5e;
    --navy-light: #1a3a7a;
    --gold: #c9a227;
    --gold-light: #e8c04a;
    --gold-pale: #fdf6e3;
    --white: #ffffff;
    --cream: #fafbff;
    --muted: #5a6a8a;
    --border: #d0daf0;
    --ink: #0d1b35;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'IBM Plex Mono', monospace; background: var(--cream); color: var(--ink); min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  .nav {
    background: var(--navy);
    padding: 0 2.5rem;
    display: flex; align-items: center; justify-content: space-between;
    height: 70px; position: sticky; top: 0; z-index: 100;
    border-bottom: 2px solid var(--gold);
  }
  .nav-brand { display: flex; flex-direction: column; gap: 1px; }
  .nav-brand-main { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 700; color: var(--white); }
  .nav-brand-sub { font-size: 0.58rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); }
  .nav-links { display: flex; gap: 0.5rem; }
  .nav-btn { background: none; border: none; color: #8fa3cc; font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; padding: 0.4rem 0.9rem; border-radius: 3px; transition: all 0.2s; }
  .nav-btn:hover { color: var(--white); background: rgba(255,255,255,0.07); }
  .nav-btn.active { color: var(--gold); }

  .hero { background: var(--navy); position: relative; overflow: hidden; min-height: 520px; display: flex; align-items: stretch; }
  .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 80% 50%, rgba(201,162,39,0.13) 0%, transparent 55%), linear-gradient(135deg, #0a1f44 0%, #0c2258 100%); }
  .hero-grid { position: absolute; inset: 0; opacity: 0.035; background-image: repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px); }
  .hero-content { position: relative; z-index: 1; display: grid; grid-template-columns: 1fr 420px; gap: 3rem; width: 100%; max-width: 1100px; margin: 0 auto; padding: 4.5rem 2.5rem; align-items: center; }

  .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(201,162,39,0.12); border: 1px solid rgba(201,162,39,0.35); color: var(--gold-light); font-size: 0.62rem; letter-spacing: 0.14em; text-transform: uppercase; padding: 0.35rem 0.9rem; border-radius: 2px; margin-bottom: 1.5rem; }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(1.9rem, 3.5vw, 2.9rem); font-weight: 700; color: var(--white); line-height: 1.15; margin-bottom: 0.4rem; }
  .hero-title em { font-style: italic; color: var(--gold-light); }
  .hero-dr { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-style: italic; color: #8fa3cc; margin-bottom: 1rem; }
  .hero-divider { width: 55px; height: 2px; background: linear-gradient(90deg, var(--gold), transparent); margin-bottom: 1.3rem; }
  .hero-desc { color: #7a90b8; font-size: 0.76rem; line-height: 1.9; max-width: 380px; margin-bottom: 2rem; }
  .hero-phone { display: inline-flex; align-items: center; gap: 0.6rem; color: var(--gold-light); font-size: 0.85rem; letter-spacing: 0.04em; border: 1px solid rgba(201,162,39,0.3); padding: 0.55rem 1.1rem; border-radius: 3px; }

  .search-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(201,162,39,0.22); border-radius: 8px; padding: 2rem; backdrop-filter: blur(8px); }
  .search-panel-title { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--white); margin-bottom: 0.3rem; }
  .search-panel-sub { font-size: 0.67rem; color: #6a80aa; margin-bottom: 1.5rem; line-height: 1.7; }
  .search-label { display: block; font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
  .search-row { display: flex; gap: 0.5rem; margin-bottom: 0.8rem; }
  .search-input { flex: 1; background: rgba(255,255,255,0.06); border: 1px solid rgba(201,162,39,0.2); border-radius: 4px; padding: 0.75rem 1rem; color: var(--white); font-family: 'IBM Plex Mono', monospace; font-size: 0.88rem; letter-spacing: 0.05em; outline: none; transition: border-color 0.2s; }
  .search-input::placeholder { color: rgba(143,163,204,0.38); }
  .search-input:focus { border-color: var(--gold); }
  .search-submit { background: var(--gold); border: none; color: var(--navy); font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 1.2rem; border-radius: 4px; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
  .search-submit:hover { background: var(--gold-light); }
  .search-note { font-size: 0.63rem; color: #4a5a78; line-height: 1.6; }

  .result-card { margin-top: 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,162,39,0.3); border-radius: 6px; padding: 1.2rem; animation: fadeIn 0.3s ease; }
  .result-card.error { border-color: rgba(220,80,80,0.4); }
  .result-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.7rem; }
  .result-name { font-family: 'Playfair Display', serif; font-size: 1rem; color: var(--white); font-weight: 600; }
  .result-meta { font-size: 0.67rem; color: #8fa3cc; margin-bottom: 1rem; line-height: 1.7; }
  .result-meta span { color: var(--gold-light); }
  .result-download { display: inline-flex; align-items: center; gap: 0.4rem; background: var(--gold); color: var(--navy); border: none; font-family: 'IBM Plex Mono', monospace; font-size: 0.67rem; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; text-decoration: none; transition: background 0.2s; }
  .result-download:hover { background: var(--gold-light); }
  .error-msg { color: #e87878; font-size: 0.76rem; line-height: 1.6; }

  .services-section { padding: 5rem 2.5rem; max-width: 1100px; margin: 0 auto; width: 100%; }
  .section-eyebrow { font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
  .section-title { font-family: 'Playfair Display', serif; font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 600; color: var(--navy); line-height: 1.2; margin-bottom: 0.5rem; }
  .section-title em { font-style: italic; color: var(--navy-light); }
  .section-divider { width: 50px; height: 2px; background: var(--gold); margin-bottom: 2.5rem; }
  .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 24px rgba(10,31,68,0.07); }
  .service-card { background: var(--white); padding: 1.8rem 1.5rem; transition: all 0.25s; position: relative; overflow: hidden; }
  .service-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--gold); transform: scaleX(0); transition: transform 0.25s; transform-origin: left; }
  .service-card:hover { background: #f8fbff; }
  .service-card:hover::after { transform: scaleX(1); }
  .service-icon { font-size: 1.6rem; margin-bottom: 0.8rem; }
  .service-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: var(--navy); margin-bottom: 0.4rem; }
  .service-desc { font-size: 0.69rem; color: var(--muted); line-height: 1.7; }

  .audience-strip { background: var(--gold-pale); border-top: 1px solid #e8d89a; border-bottom: 1px solid #e8d89a; padding: 2.5rem; }
  .audience-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  .audience-card { background: var(--white); border: 1px solid #e0d09a; border-radius: 6px; padding: 1.5rem; display: flex; gap: 1rem; align-items: flex-start; }
  .audience-icon { font-size: 1.8rem; flex-shrink: 0; }
  .audience-title { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 600; color: var(--navy); margin-bottom: 0.3rem; }
  .audience-desc { font-size: 0.69rem; color: var(--muted); line-height: 1.7; }

  .contact-section { background: var(--navy); padding: 4rem 2.5rem; position: relative; overflow: hidden; }
  .contact-section::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 85% 50%, rgba(201,162,39,0.08) 0%, transparent 55%); }
  .contact-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; display: grid; grid-template-columns: 1fr auto; gap: 3rem; align-items: center; }
  .contact-eyebrow { font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
  .contact-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; color: var(--white); margin-bottom: 0.3rem; }
  .contact-subtitle { font-family: 'Playfair Display', serif; font-size: 0.9rem; font-style: italic; color: #5a7090; margin-bottom: 2rem; }
  .contact-items { display: flex; flex-direction: column; gap: 0.9rem; }
  .contact-item { display: flex; align-items: center; gap: 0.8rem; }
  .contact-item-icon { width: 36px; height: 36px; background: rgba(201,162,39,0.1); border: 1px solid rgba(201,162,39,0.22); border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
  .contact-item-label { font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); }
  .contact-item-value { font-size: 0.82rem; color: var(--white); }
  .contact-phone-box { background: rgba(201,162,39,0.08); border: 1px solid rgba(201,162,39,0.2); border-radius: 8px; padding: 2rem; text-align: center; min-width: 190px; }
  .contact-phone-label { font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.5rem; }
  .contact-phone-number { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--white); margin-bottom: 0.3rem; }
  .contact-phone-sub { font-size: 0.63rem; color: #4a6080; }

  .footer { background: #060f1c; padding: 1.2rem 2.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
  .footer-brand { font-family: 'Playfair Display', serif; font-size: 0.85rem; color: #2a3a50; }
  .footer-brand span { color: var(--gold); }
  .footer-copy { font-size: 0.6rem; color: #1e2e3e; letter-spacing: 0.06em; }

  .admin-page { min-height: 100vh; padding: 2.5rem; background: var(--cream); }
  .admin-header { max-width: 760px; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: space-between; }
  .admin-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: var(--navy); margin-bottom: 0.2rem; }
  .admin-sub { font-size: 0.66rem; color: var(--muted); letter-spacing: 0.04em; }
  .admin-logout { background: none; border: 1px solid var(--border); color: var(--muted); font-family: 'IBM Plex Mono', monospace; font-size: 0.66rem; letter-spacing: 0.06em; padding: 0.45rem 0.9rem; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
  .admin-logout:hover { border-color: var(--navy); color: var(--navy); }

  .upload-card { background: var(--white); border: 1px solid var(--border); border-radius: 8px; padding: 1.8rem; max-width: 760px; margin: 0 auto 1.5rem; box-shadow: 0 2px 12px rgba(10,31,68,0.05); }
  .upload-card-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--navy); margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.5rem; }
  .upload-card-title::before { content: ''; display: inline-block; width: 4px; height: 18px; background: var(--gold); border-radius: 2px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-label { font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .form-input { border: 1px solid var(--border); border-radius: 4px; padding: 0.65rem 0.9rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.82rem; color: var(--ink); background: var(--cream); outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: var(--navy-light); }
  .gen-btn { border: 1px dashed var(--gold); border-radius: 4px; padding: 0.65rem 0.9rem; font-family: 'IBM Plex Mono', monospace; font-size: 0.76rem; color: #8a6a00; background: #fffbee; cursor: pointer; transition: all 0.2s; }
  .gen-btn:hover { background: var(--gold-pale); }
  .file-drop { border: 2px dashed var(--border); border-radius: 6px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.2s; margin-bottom: 1rem; background: #fafcff; }
  .file-drop:hover { border-color: var(--navy-light); background: #f0f4ff; }
  .file-drop p { font-size: 0.74rem; color: var(--muted); line-height: 1.6; }
  .file-drop strong { color: var(--navy); }
  .submit-btn { background: var(--navy); color: white; border: none; font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.75rem 1.8rem; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
  .submit-btn:hover { background: var(--navy-light); }
  .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .records-card { background: var(--white); border: 1px solid var(--border); border-radius: 8px; max-width: 760px; margin: 0 auto; overflow: hidden; box-shadow: 0 2px 12px rgba(10,31,68,0.05); }
  .records-header { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .records-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: var(--navy); display: flex; align-items: center; gap: 0.5rem; }
  .records-title::before { content: ''; display: inline-block; width: 4px; height: 18px; background: var(--gold); border-radius: 2px; }
  .records-count { font-size: 0.63rem; color: var(--muted); background: var(--cream); border: 1px solid var(--border); padding: 0.2rem 0.6rem; border-radius: 10px; }
  table { width: 100%; border-collapse: collapse; }
  th { font-size: 0.59rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); padding: 0.75rem 1rem; text-align: left; background: var(--cream); border-bottom: 1px solid var(--border); }
  td { font-size: 0.76rem; padding: 0.75rem 1rem; border-bottom: 1px solid #f0f4ff; color: var(--ink); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fafcff; }
  .code-badge { background: #e8f0ff; color: var(--navy-light); padding: 0.2rem 0.5rem; border-radius: 3px; font-weight: 500; font-size: 0.72rem; }
  .delete-btn { background: none; border: 1px solid #ffd5d5; color: #cc5555; font-family: 'IBM Plex Mono', monospace; font-size: 0.6rem; padding: 0.25rem 0.55rem; border-radius: 3px; cursor: pointer; transition: all 0.2s; }
  .delete-btn:hover { background: #fff0f0; }
  .empty-state { padding: 2.5rem; text-align: center; color: var(--muted); font-size: 0.78rem; }

  .toast { position: fixed; bottom: 2rem; right: 2rem; background: var(--navy); color: var(--gold-light); font-size: 0.75rem; padding: 0.9rem 1.3rem; border-radius: 6px; border: 1px solid rgba(201,162,39,0.3); animation: slideUp 0.3s ease; z-index: 999; max-width: 300px; }

  .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--navy); position: relative; overflow: hidden; }
  .login-page::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 70%, rgba(201,162,39,0.09) 0%, transparent 50%); }
  .login-card { position: relative; z-index: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(201,162,39,0.2); border-radius: 10px; padding: 2.5rem; width: 340px; text-align: center; }
  .login-logo { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: var(--white); margin-bottom: 0.2rem; }
  .login-logo span { color: var(--gold); }
  .login-sub { font-size: 0.66rem; color: #5a7090; margin-bottom: 1.8rem; line-height: 1.6; }
  .login-label { display: block; font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gold); text-align: left; margin-bottom: 0.4rem; }
  .login-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(201,162,39,0.2); border-radius: 4px; padding: 0.75rem 1rem; color: var(--white); font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem; outline: none; margin-bottom: 1.2rem; transition: border-color 0.2s; }
  .login-input:focus { border-color: var(--gold); }
  .login-btn { width: 100%; background: var(--gold); border: none; color: var(--navy); font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; padding: 0.85rem; border-radius: 4px; cursor: pointer; transition: background 0.2s; }
  .login-btn:hover { background: var(--gold-light); }
  .login-error { color: #e87878; font-size: 0.72rem; margin-top: 0.8rem; }

  @media (max-width: 720px) {
    .hero-content { grid-template-columns: 1fr; padding: 3rem 1.5rem; }
    .audience-inner { grid-template-columns: 1fr; }
    .contact-inner { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .nav { padding: 0 1.5rem; }
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
`;

function saveRecord(r) {
  const all = getAllRecords();
  localStorage.setItem("drasanchez_lab", JSON.stringify([r, ...all.filter(x => x.code !== r.code)]));
}
function getAllRecords() {
  try { return JSON.parse(localStorage.getItem("drasanchez_lab") || "[]"); } catch { return []; }
}
function getRecord(code) { return getAllRecords().find(r => r.code === code.toUpperCase()) || null; }
function deleteRecord(code) { localStorage.setItem("drasanchez_lab", JSON.stringify(getAllRecords().filter(r => r.code !== code))); }

function PatientSearch() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);
  const handleSearch = () => {
    if (!code.trim()) return;
    const r = getRecord(code.trim());
    if (r) { setResult(r); setStatus("found"); } else { setResult(null); setStatus("notfound"); }
  };
  return (
    <div className="hero">
      <div className="hero-bg" /><div className="hero-grid" />
      <div className="hero-content">
        <div>
          <div className="hero-badge">Anatomía Patológica · Citología · R.D.</div>
          <h1 className="hero-title">Laboratorio de<br /><em>Patología y Citología</em></h1>
          <p className="hero-dr">Dra. Sánchez</p>
          <div className="hero-divider" />
          <p className="hero-desc">Servicio especializado de Anatomía Patológica y Citología para médicos y pacientes. Diagnóstico de precisión, resultados confiables y acceso en línea.</p>
          <div className="hero-phone">📞 809-522-1091</div>
        </div>
        <div className="search-panel">
          <h2 className="search-panel-title">Consultar resultado</h2>
          <p className="search-panel-sub">Ingresa el código que recibiste al registrar tu muestra para acceder y descargar tu informe.</p>
          <label className="search-label">Código de resultado</label>
          <div className="search-row">
            <input className="search-input" placeholder="Ej: DS-00123" value={code}
              onChange={e => { setCode(e.target.value); setStatus(null); }}
              onKeyDown={e => e.key === "Enter" && handleSearch()} />
            <button className="search-submit" onClick={handleSearch}>Buscar</button>
          </div>
          <p className="search-note">El código fue entregado por el laboratorio al registrar tu muestra.</p>
          {status === "found" && result && (
            <div className="result-card">
              <div className="result-header"><span style={{fontSize:"1.1rem"}}>🧬</span><span className="result-name">{result.patientName}</span></div>
              <div className="result-meta">Código: <span>{result.code}</span> · Estudio: <span>{result.studyType}</span><br />Fecha: <span>{new Date(result.uploadedAt).toLocaleDateString("es-ES",{day:"2-digit",month:"long",year:"numeric"})}</span></div>
              <a className="result-download" href={result.fileData} download={`resultado-${result.code}.pdf`}>⬇ Descargar PDF</a>
            </div>
          )}
          {status === "notfound" && (
            <div className="result-card error"><p className="error-msg">No se encontró el código <strong>{code.toUpperCase()}</strong>. Verifica el código o llama al <strong>809-522-1091</strong>.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}

function Services() {
  const items = [
    { icon: "🔬", name: "Biopsias", desc: "Análisis histopatológico de tejidos. Diagnóstico preciso de lesiones benignas y malignas." },
    { icon: "🧫", name: "Citología Cervical", desc: "Papanicolaou y citología exfoliativa para detección temprana de lesiones." },
    { icon: "🩺", name: "Punción Aspirativa", desc: "BAAF de tiroides, ganglio, mama y otras lesiones superficiales palpables." },
    { icon: "🧬", name: "Inmunohistoquímica", desc: "Marcadores tumorales para clasificación y diagnóstico oncológico diferencial." },
    { icon: "📋", name: "Anatomía Patológica", desc: "Estudio macroscópico y microscópico de piezas quirúrgicas completas." },
    { icon: "💊", name: "Segunda Opinión", desc: "Revisión diagnóstica de casos con láminas o bloques de parafina enviados." },
  ];
  return (
    <section className="services-section">
      <p className="section-eyebrow">Servicios especializados</p>
      <h2 className="section-title">Anatomía Patológica<br /><em>y Citología de precisión</em></h2>
      <div className="section-divider" />
      <div className="services-grid">
        {items.map(s => (
          <div className="service-card" key={s.name}>
            <div className="service-icon">{s.icon}</div>
            <div className="service-name">{s.name}</div>
            <div className="service-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Audience() {
  return (
    <div className="audience-strip">
      <div className="audience-inner">
        <div className="audience-card">
          <div className="audience-icon">👨‍⚕️</div>
          <div>
            <div className="audience-title">Para médicos</div>
            <div className="audience-desc">Solicite estudios histopatológicos y citológicos. Reciba informes detallados para apoyar su diagnóstico clínico con la mayor precisión.</div>
          </div>
        </div>
        <div className="audience-card">
          <div className="audience-icon">🧑‍💼</div>
          <div>
            <div className="audience-title">Para pacientes</div>
            <div className="audience-desc">Consulte sus resultados con su código personal. Descargue su informe en PDF de forma segura desde cualquier dispositivo, en cualquier momento.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <section className="contact-section">
      <div className="contact-inner">
        <div>
          <p className="contact-eyebrow">Contacto</p>
          <h2 className="contact-title">Dra. Sánchez</h2>
          <p className="contact-subtitle">Laboratorio de Patología y Citología</p>
          <div className="contact-items">
            <div className="contact-item"><div className="contact-item-icon">📞</div><div><div className="contact-item-label">Teléfono</div><div className="contact-item-value">809-522-1091</div></div></div>
            <div className="contact-item"><div className="contact-item-icon">🔬</div><div><div className="contact-item-label">Especialidad</div><div className="contact-item-value">Anatomía Patológica · Citología</div></div></div>
            <div className="contact-item"><div className="contact-item-icon">🌍</div><div><div className="contact-item-label">País</div><div className="contact-item-value">República Dominicana</div></div></div>
          </div>
        </div>
        <div className="contact-phone-box">
          <div className="contact-phone-label">Llamar ahora</div>
          <div className="contact-phone-number">809-522-1091</div>
          <div className="contact-phone-sub">Lun–Vie · Horario de oficina</div>
        </div>
      </div>
    </section>
  );
}

function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState(""); const [error, setError] = useState("");
  const handle = () => { if (pw === ADMIN_PASSWORD) onLogin(); else setError("Contraseña incorrecta."); };
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">Lab<span>Path</span> · <span style={{fontSize:"0.85rem",color:"#8fa3cc"}}>Dra. Sánchez</span></div>
        <p className="login-sub">Panel de administración<br />Laboratorio de Patología y Citología</p>
        <label className="login-label">Contraseña</label>
        <input className="login-input" type="password" placeholder="••••••••" value={pw}
          onChange={e => { setPw(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handle()} />
        <button className="login-btn" onClick={handle}>Ingresar al panel</button>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}

function AdminPanel({ onLogout }) {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ patientName: "", code: "", studyType: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const fileRef = useRef();
  const load = () => setRecords(getAllRecords());
  useEffect(() => { load(); }, []);
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(""), 3500); };
  const handleFile = e => { const f = e.target.files[0]; if (f?.type === "application/pdf") setFile(f); else showToast("Solo se aceptan archivos PDF."); };
  const generateCode = () => { const n = Math.floor(Math.random() * 90000) + 10000; setForm(f => ({ ...f, code: `DS-${n}` })); };
  const handleUpload = () => {
    if (!form.patientName || !form.code || !form.studyType || !file) { showToast("Completa todos los campos y selecciona un PDF."); return; }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = e => {
      saveRecord({ patientName: form.patientName, code: form.code.toUpperCase(), studyType: form.studyType, fileData: e.target.result, uploadedAt: Date.now() });
      setForm({ patientName: "", code: "", studyType: "" }); setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      load(); setLoading(false);
      showToast(`✓ Resultado subido — Código: ${form.code.toUpperCase()}`);
    };
    reader.readAsDataURL(file);
  };
  const handleDelete = code => { deleteRecord(code); load(); showToast("Resultado eliminado."); };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div><h1 className="admin-title">Panel de Administración</h1><p className="admin-sub">Laboratorio Dra. Sánchez · Patología y Citología</p></div>
        <button className="admin-logout" onClick={onLogout}>← Salir</button>
      </div>
      <div className="upload-card">
        <h3 className="upload-card-title">Subir nuevo resultado</h3>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Nombre del paciente</label><input className="form-input" value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))} placeholder="Apellido, Nombre" /></div>
          <div className="form-group"><label className="form-label">Tipo de estudio</label><input className="form-input" value={form.studyType} onChange={e => setForm(f => ({ ...f, studyType: e.target.value }))} placeholder="Biopsia, Citología, BAAF..." /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Código de resultado</label><input className="form-input" value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="DS-00000" /></div>
          <div className="form-group"><label className="form-label">Generar automático</label><button className="gen-btn" onClick={generateCode}>⚡ Generar código DS-XXXXX</button></div>
        </div>
        <div className="file-drop" onClick={() => fileRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === "application/pdf") setFile(f); }}>
          <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFile} />
          <p>{file ? <><strong>📄 {file.name}</strong><br />Listo para subir</> : <><strong>Clic para seleccionar</strong> o arrastra el PDF aquí<br />Solo archivos .pdf</>}</p>
        </div>
        <button className="submit-btn" onClick={handleUpload} disabled={loading}>{loading ? "Procesando..." : "↑ Subir resultado"}</button>
      </div>
      <div className="records-card">
        <div className="records-header"><span className="records-title">Resultados registrados</span><span className="records-count">{records.length} total</span></div>
        {records.length === 0 ? <div className="empty-state">Aún no hay resultados subidos.</div> : (
          <table>
            <thead><tr><th>Código</th><th>Paciente</th><th>Estudio</th><th>Fecha</th><th></th></tr></thead>
            <tbody>
              {records.map(r => (
                <tr key={r.code}>
                  <td><span className="code-badge">{r.code}</span></td>
                  <td>{r.patientName}</td><td>{r.studyType}</td>
                  <td>{new Date(r.uploadedAt).toLocaleDateString("es-ES")}</td>
                  <td><button className="delete-btn" onClick={() => handleDelete(r.code)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [adminAuth, setAdminAuth] = useState(false);
  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {page !== "admin" && (
          <nav className="nav">
            <div className="nav-brand">
              <div className="nav-brand-main">Laboratorio Dra. Sánchez</div>
              <div className="nav-brand-sub">Patología · Citología · República Dominicana</div>
            </div>
            <div className="nav-links">
              <button className={`nav-btn ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>Inicio</button>
              <button className="nav-btn" onClick={() => setPage("admin")}>Admin</button>
            </div>
          </nav>
        )}
        {page === "home" && <><PatientSearch /><Services /><Audience /><Contact />
          <footer className="footer">
            <div className="footer-brand">Lab<span>Path</span> · Dra. Sánchez</div>
            <div className="footer-copy">© 2025 · Laboratorio de Patología y Citología · República Dominicana</div>
          </footer></>}
        {page === "admin" && !adminAuth && <AdminLogin onLogin={() => setAdminAuth(true)} />}
        {page === "admin" && adminAuth && <AdminPanel onLogout={() => { setAdminAuth(false); setPage("home"); }} />}
      </div>
    </>
  );
}
