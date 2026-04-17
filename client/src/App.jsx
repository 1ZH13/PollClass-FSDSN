import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Professor from './pages/Professor.jsx';
import ProfessorPoll from './pages/ProfessorPoll.jsx';
import Student from './pages/Student.jsx';
import Auth from './pages/Auth.jsx';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';

function InnerApp() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/auth');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.16)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link to="/" className="flex items-center gap-3 text-white/90">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/90 text-xl font-bold text-white shadow-lg shadow-sky-500/30">PC</div>
            <div>
              <p className="text-lg font-semibold">PollClass-FSDSN</p>
              <p className="text-sm text-slate-300">Encuestas en vivo para el aula</p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://github.com/1ZH13"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-secondary inline-flex items-center gap-2 text-sm font-medium"
              aria-label="GitHub profile"
              title="Ver perfil de GitHub"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M12 0.5C5.37 0.5 0 5.87 0 12.5C0 17.8 3.44 22.29 8.21 23.88C8.81 23.99 9.03 23.62 9.03 23.3C9.03 23.01 9.02 22.23 9.01 21.19C5.67 21.92 4.97 19.58 4.97 19.58C4.42 18.18 3.63 17.8 3.63 17.8C2.55 17.06 3.72 17.07 3.72 17.07C4.92 17.15 5.56 18.31 5.56 18.31C6.62 20.12 8.34 19.6 9.04 19.3C9.15 18.53 9.46 18 9.81 17.7C7.15 17.4 4.34 16.37 4.34 11.76C4.34 10.45 4.8 9.37 5.58 8.53C5.46 8.24 5.06 7.01 5.69 5.35C5.69 5.35 6.7 5.03 8.99 6.58C9.96 6.31 11 6.17 12.04 6.16C13.08 6.17 14.12 6.31 15.09 6.58C17.38 5.03 18.39 5.35 18.39 5.35C19.02 7.01 18.62 8.24 18.5 8.53C19.28 9.37 19.74 10.45 19.74 11.76C19.74 16.38 16.92 17.39 14.26 17.69C14.7 18.07 15.09 18.8 15.09 19.92C15.09 21.52 15.08 22.82 15.08 23.3C15.08 23.62 15.3 24 15.91 23.88C20.67 22.29 24.1 17.8 24.1 12.5C24.1 5.87 18.73 0.5 12.1 0.5H12Z" />
              </svg>
              GitHub
            </a>
            <Link className="glass-button-secondary text-sm font-medium" to="/">Inicio</Link>
            {user && (
              <Link className="glass-button text-sm" to={user.role === 'professor' ? '/professor' : '/student'}>
                Mi panel
              </Link>
            )}
            {user ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">{user.fullName || user.email}</span>
                <button onClick={handleLogout} className="glass-button bg-rose-600/95 hover:bg-rose-500/95">
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link className="glass-button text-sm" to="/auth">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/professor" element={<Professor />} />
        <Route path="/professor/poll/:id" element={<ProfessorPoll />} />
        <Route path="/student" element={<Student />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <InnerApp />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
