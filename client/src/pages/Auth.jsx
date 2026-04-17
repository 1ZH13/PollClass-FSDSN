import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { auth } from '../services/auth.js';

function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'login';
  const initialRole = searchParams.get('role') || 'student';
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(initialRole);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'professor' ? '/professor' : '/student');
    }
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Ingresa email y contraseña.');
      return;
    }

    if (mode === 'register' && (!firstName.trim() || !lastName.trim())) {
      setError('Ingresa nombre y apellido para registrarte.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password,
        ...(mode === 'register'
          ? {
              role,
              firstName: firstName.trim(),
              lastName: lastName.trim(),
            }
          : {}),
      };
      const result = mode === 'register' ? await auth.register(payload) : await auth.login(payload);
      setUser(result.user);
      navigate(result.user.role === 'professor' ? '/professor' : '/student');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 sm:px-10">
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute -left-16 top-0 h-44 w-44 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -right-10 top-20 h-36 w-36 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="relative glass-card overflow-hidden rounded-[2rem] border border-white/10 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.25)] sm:p-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{mode === 'register' ? 'Registro nuevo' : 'Bienvenido de nuevo'}</p>
              <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">
                {mode === 'register' ? 'Crea tu cuenta' : 'Inicia sesión'}
              </h1>
              <p className="mt-3 max-w-xl text-slate-300">
                {mode === 'register'
                  ? 'Elige tu rol una sola vez y accede al panel correcto automáticamente.'
                  : 'Ingresa con tu correo y te llevamos directamente a tu panel.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="glass-button-secondary text-sm"
            >
              {mode === 'login' ? 'Crear cuenta' : 'Ya tengo cuenta'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">Correo</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-300/20"
                placeholder="tucorreo@dominio.com"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200">Contraseña</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-300/20"
                placeholder="Contraseña segura"
                type="password"
              />
            </div>

            {mode === 'register' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">Nombre</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-300/20"
                    placeholder="Tu nombre"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">Apellido</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-300/20"
                    placeholder="Tu apellido"
                    type="text"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm font-medium text-slate-200">Rol</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className={`flex cursor-pointer items-center justify-center gap-3 rounded-3xl border px-4 py-3 text-center text-sm transition ${role === 'student' ? 'border-sky-400/70 bg-sky-400/15 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'}`}>
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={role === 'student'}
                      onChange={() => setRole('student')}
                      className="hidden"
                    />
                    Estudiante
                  </label>
                  <label className={`flex cursor-pointer items-center justify-center gap-3 rounded-3xl border px-4 py-3 text-center text-sm transition ${role === 'professor' ? 'border-sky-400/70 bg-sky-400/15 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'}`}>
                    <input
                      type="radio"
                      name="role"
                      value="professor"
                      checked={role === 'professor'}
                      onChange={() => setRole('professor')}
                      className="hidden"
                    />
                    Profesor
                  </label>
                </div>
              </div>
            )}

            {error && <div className="rounded-3xl bg-rose-500/10 p-4 text-rose-100 shadow-inner">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`glass-button w-full text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Procesando...' : mode === 'register' ? 'Registrarme' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {mode === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <Link className="font-semibold text-sky-200 hover:text-white" to="#" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión aquí'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
