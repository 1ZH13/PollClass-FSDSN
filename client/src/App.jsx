import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Professor from './pages/Professor.jsx';
import ProfessorPoll from './pages/ProfessorPoll.jsx';
import Student from './pages/Student.jsx';
import Auth from './pages/Auth.jsx';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';

function InnerApp() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.16)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link to="/" className="flex items-center gap-3 text-white/90">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-500/90 text-xl font-bold text-white shadow-lg shadow-sky-500/30">PC</div>
            <div>
              <p className="text-lg font-semibold">PollClass</p>
              <p className="text-sm text-slate-300">Encuestas en vivo para el aula</p>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Link className="glass-button-secondary text-sm font-medium" to="/">Inicio</Link>
            {user && (
              <Link className="glass-button text-sm" to={user.role === 'professor' ? '/professor' : '/student'}>
                Mi panel
              </Link>
            )}
            {user ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white/90">{user.email}</span>
                <button onClick={logout} className="glass-button bg-rose-600/95 hover:bg-rose-500/95">
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
