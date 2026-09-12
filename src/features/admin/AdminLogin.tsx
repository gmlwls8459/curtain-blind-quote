import { useState, type FormEvent } from 'react';
import { setAdminAuthenticated, verifyPassword } from './auth';

interface Props {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const ok = await verifyPassword(password);
      if (ok) {
        setAdminAuthenticated(true);
        setPassword('');
        onSuccess();
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    } catch {
      setError('인증 중 오류가 발생했습니다.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="page admin-login">
      <div className="page-head">
        <h2>관리자 입장</h2>
      </div>
      <p className="hint admin-honesty">
        이 잠금은 브라우저용이며, 코드를 보면 우회할 수 있어요.
      </p>
      <section className="card admin-login-card">
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>비밀번호</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="비밀번호 입력"
              disabled={pending}
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="action-bar">
            <button type="submit" className="btn primary" disabled={pending}>
              {pending ? '확인 중…' : '입장'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
