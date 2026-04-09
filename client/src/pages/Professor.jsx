import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PollForm from '../components/PollForm.jsx';
import PollCard from '../components/PollCard.jsx';
import { polls } from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';

function Professor() {
  const { user } = useContext(AuthContext);
  const [pollsList, setPollsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadPolls() {
    setLoading(true);
    setError('');

    try {
      const data = await polls.list();
      setPollsList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role === 'professor') {
      loadPolls();
    }
  }, [user]);

  async function handleCreate(payload) {
    await polls.create(payload);
    await loadPolls();
  }

  async function handleClose(id) {
    await polls.close(id);
    await loadPolls();
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar esta encuesta?')) {
      return;
    }
    await polls.remove(id);
    await loadPolls();
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-xl">
          <h1 className="text-2xl font-bold text-slate-900">Necesitas iniciar sesión</h1>
          <p className="mt-3 text-slate-600">Inicia sesión o regístrate como profesor para administrar encuestas.</p>
          <Link to="/auth" className="mt-6 inline-flex rounded-3xl bg-sky-600 px-6 py-3 text-white hover:bg-sky-700">
            Ir a autenticación
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'professor') {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-10 shadow-xl">
          <h1 className="text-2xl font-bold text-slate-900">Acceso no autorizado</h1>
          <p className="mt-3 text-slate-600">Debes iniciar sesión como profesor para crear y gestionar encuestas.</p>
          <Link to="/auth" className="mt-6 inline-flex rounded-3xl bg-sky-600 px-6 py-3 text-white hover:bg-sky-700">
            Cambiar a profesor
          </Link>
        </div>
      </div>
    );
  }

  const activePolls = pollsList.filter((poll) => poll.status === 'active');
  const closedPolls = pollsList.filter((poll) => poll.status === 'closed');

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 p-8 text-white shadow-xl">
          <h1 className="text-3xl font-bold">Panel de Profesor</h1>
          <p className="mt-3 max-w-2xl text-slate-200">Crea encuestas, comparte el código con tus estudiantes y monitorea resultados en vivo.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-3xl bg-white/10 p-5 text-sm text-slate-100 shadow-inner">
              Encuestas activas: <span className="font-semibold">{activePolls.length}</span>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 text-sm text-slate-100 shadow-inner">
              Encuestas cerradas: <span className="font-semibold">{closedPolls.length}</span>
            </div>
          </div>
        </header>

        <section className="rounded-[2rem] bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-slate-900">Crear nueva encuesta</h2>
          <p className="mt-2 text-slate-600">Agrega un título y al menos dos opciones para iniciar la votación.</p>
          <PollForm onCreate={handleCreate} />
        </section>

        <section className="rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Encuestas activas</h2>
              <p className="mt-1 text-sm text-slate-500">Revisa los códigos y navega a los resultados.</p>
            </div>
            <button type="button" onClick={loadPolls} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200">
              Actualizar lista
            </button>
          </div>

          {error && <p className="mt-4 text-red-600">{error}</p>}

          <div className="mt-6 grid gap-4">
            {loading ? (
              <p className="text-slate-600">Cargando encuestas...</p>
            ) : activePolls.length === 0 ? (
              <p className="text-slate-600">No hay encuestas activas. Crea una nueva arriba.</p>
            ) : (
              activePolls.map((poll) => (
                <PollCard key={poll._id} poll={poll} onClose={() => handleClose(poll._id)} onDelete={() => handleDelete(poll._id)} />
              ))
            )}
          </div>
        </section>

        {closedPolls.length > 0 && (
          <section className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-slate-900">Encuestas cerradas</h2>
            <p className="mt-2 text-sm text-slate-500">Las encuestas cerradas ya no aceptan votos.</p>
            <div className="mt-6 grid gap-4">
              {closedPolls.map((poll) => (
                <PollCard key={poll._id} poll={poll} onClose={() => handleClose(poll._id)} onDelete={() => handleDelete(poll._id)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Professor;
