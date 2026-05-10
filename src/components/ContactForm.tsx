import { useState, useEffect, useRef } from 'react';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [focused, setFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ email?: boolean; subject?: boolean; message?: boolean }>({});
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      email: !formData.email,
      subject: !formData.subject,
      message: !formData.message,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error();
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ email: '', subject: '', message: '' });
        setErrors({});
      }, 2000);
    } catch {
      setStatus('error');
    }
  };

  if (!mounted) return null;

  return (
    <>
      <style>{`
        .cf-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
        }
        .cf-panel {
          position: absolute;
          bottom: 56px;
          left: 48px;
          width: 340px;
          pointer-events: all;
          transform-origin: bottom left;
          transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          transform: scale(0.88) translateY(16px);
        }
        .cf-panel.cf-visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .cf-glass {
          background: rgba(1, 6, 38, 0.82);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(180, 151, 207, 0.18);
          border-radius: 18px;
          padding: 28px 28px 24px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 32px 64px rgba(0,0,0,0.5),
            0 0 80px rgba(180, 151, 207, 0.06);
        }
        .cf-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }
        .cf-title {
          font-family: 'Azonix', 'Arial Black', sans-serif;
          font-size: 1.1rem;
          letter-spacing: 0.15em;
          color: #fff;
          font-weight: 400;
        }
        .cf-close {
          width: 28px;
          height: 28px;
          border: none;
          background: rgba(255,255,255,0.06);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
          color: rgba(255,255,255,0.5);
          padding: 0;
        }
        .cf-close:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }
        .cf-fields {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .cf-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .cf-label {
          font-family: 'Fira Code', monospace;
          font-size: 0.68rem;
          color: rgba(248, 248, 255, 0.4);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.2s;
        }
        .cf-field.cf-focused .cf-label {
          color: #B497CF;
        }
        .cf-field.cf-err .cf-label {
          color: rgba(255, 80, 80, 0.9);
        }
        .cf-input, .cf-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 14px;
          font-family: 'Fira Code', monospace;
          font-size: 0.82rem;
          color: #f8f8ff;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          resize: none;
        }
        .cf-input::placeholder, .cf-textarea::placeholder {
          color: rgba(255,255,255,0.2);
        }
        .cf-input:focus, .cf-textarea:focus {
          border-color: rgba(180, 151, 207, 0.5);
          background: rgba(180, 151, 207, 0.06);
          box-shadow: 0 0 0 3px rgba(180, 151, 207, 0.08);
        }
        .cf-field.cf-err .cf-input,
        .cf-field.cf-err .cf-textarea {
          border-color: rgba(255, 80, 80, 0.6);
          background: rgba(255, 80, 80, 0.05);
          box-shadow: 0 0 0 3px rgba(255, 80, 80, 0.07);
        }
        .cf-textarea {
          height: 90px;
        }
        .cf-submit {
          width: 100%;
          padding: 11px;
          border: none;
          border-radius: 10px;
          background: #B497CF;
          color: #010626;
          font-family: 'Fira Code', monospace;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-top: 4px;
          box-shadow: 0 4px 20px rgba(180, 151, 207, 0.25);
        }
        .cf-submit:hover:not(:disabled) {
          background: #ffe3fe;
          box-shadow: 0 4px 28px rgba(180, 151, 207, 0.45);
          transform: translateY(-1px);
        }
        .cf-submit:active:not(:disabled) {
          transform: translateY(0);
        }
        .cf-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .cf-send-err {
          font-family: 'Fira Code', monospace;
          font-size: 0.72rem;
          color: #ff6b8a;
          text-align: center;
          margin-top: 2px;
        }
        .cf-success-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 24px 0 8px;
          font-family: 'Fira Code', monospace;
          font-size: 0.85rem;
          color: rgba(248, 248, 255, 0.7);
          letter-spacing: 0.04em;
        }
        .cf-check {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(180, 151, 207, 0.15);
          border: 1px solid rgba(180, 151, 207, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cf-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(1,6,38,0.3);
          border-top-color: #010626;
          border-radius: 50%;
          display: inline-block;
          animation: cf-spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes cf-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="cf-overlay">
        <div ref={formRef} className={`cf-panel${visible ? ' cf-visible' : ''}`}>
          <div className="cf-glass">
            <div className="cf-header">
              <span className="cf-title">CONTACT ME</span>
              <button className="cf-close" onClick={onClose} aria-label="Close">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {status === 'success' ? (
              <div className="cf-success-wrap">
                <div className="cf-check">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4.5 4.5L16 6" stroke="#B497CF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                message sent successfully.
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="cf-fields">
                <div className={`cf-field${focused === 'email' ? ' cf-focused' : ''}${errors.email ? ' cf-err' : ''}`}>
                  <label className="cf-label" htmlFor="cf-email">Email</label>
                  <input
                    id="cf-email"
                    className="cf-input"
                    type="email"
                    name="email"
                    placeholder="hello@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <div className={`cf-field${focused === 'subject' ? ' cf-focused' : ''}${errors.subject ? ' cf-err' : ''}`}>
                  <label className="cf-label" htmlFor="cf-subject">Subject</label>
                  <input
                    id="cf-subject"
                    className="cf-input"
                    type="text"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocused('subject')}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <div className={`cf-field${focused === 'message' ? ' cf-focused' : ''}${errors.message ? ' cf-err' : ''}`}>
                  <label className="cf-label" htmlFor="cf-message">Message</label>
                  <textarea
                    id="cf-message"
                    className="cf-textarea"
                    name="message"
                    placeholder="Write your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <button
                  type="submit"
                  className="cf-submit"
                  disabled={status === 'loading'}
                >
                  {status === 'loading'
                    ? <><span className="cf-spinner" />sending...</>
                    : 'send message \u2192'}
                </button>

                {status === 'error' && (
                  <p className="cf-send-err">something went wrong. please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}