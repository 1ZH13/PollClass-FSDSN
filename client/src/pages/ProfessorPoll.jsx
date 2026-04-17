import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { polls } from '../services/api.js';

function ProfessorPoll() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pollData, setPollData] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastSync, setLastSync] = useState(null);

  async function loadResults() {
    if (!id) return;
    try {
      const body = await polls.results(id);
      setPollData(body.poll);
      setVotes(body.votes || []);
      setError('');
      setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResults();
    const interval = setInterval(loadResults, 3000);
    return () => clearInterval(interval);
  }, [id]);

  async function handleClose() {
    if (!id) return;
    await polls.close(id);
    await loadResults();
  }

  async function copyCode() {
    if (!pollData) return;
    await navigator.clipboard.writeText(pollData.code);
    alert('Código copiado al portapapeles');
  }

  if (loading) {
    return <div className="min-h-screen p-6">Cargando resultados...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <p className="text-red-600">{error}</p>
        <button className="mt-4 rounded-2xl bg-slate-800 px-5 py-3 text-white" onClick={() => navigate('/professor')}>
          Volver
        </button>
      </div>
    );
  }

  if (!pollData) {
    return <div className="min-h-screen p-6">Encuesta no encontrada.</div>;
  }

  const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{pollData.status === 'active' ? 'Activa' : 'Cerrada'}</span>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">{totalVotes} votos</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900">{pollData.title}</h1>
              <p className="text-slate-600">Código: <strong className="tracking-[0.18em] text-slate-900">{pollData.code}</strong></p>
              <p className="text-slate-500">Última sincronización: {lastSync}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={copyCode} className="rounded-2xl bg-slate-100 px-5 py-3 text-slate-800 hover:bg-slate-200">
                Copiar código
              </button>
              <button onClick={handleClose} className="rounded-2xl bg-amber-500 px-5 py-3 text-white hover:bg-amber-600">
                Cerrar encuesta
              </button>
              <button onClick={() => navigate('/professor')} className="rounded-2xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-950">
                Volver al panel
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-slate-900">Resultados en tiempo real</h2>
            <p className="mt-2 text-sm text-slate-500">El gráfico se actualiza cada 3 segundos.</p>
            <div className="mt-8 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pollData.options.map((option) => ({ name: option.text, votes: option.votes }))} layout="vertical" margin={{ top: 20, right: 24, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={180} />
                  <Tooltip />
                  <Bar dataKey="votes" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-slate-900">Tabla de votos</h2>
            <p className="mt-2 text-sm text-slate-500">Lista de estudiantes y opción seleccionada.</p>
            <div className="mt-6 space-y-4">
              {votes.length === 0 ? (
                <p className="text-slate-600">Aún no hay votos registrados.</p>
              ) : (
                <div className="space-y-3">
                  {votes.map((vote) => (
                    <div key={vote._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{vote.voterName || vote.voterEmail}</p>
                          <p className="text-xs text-slate-500">{vote.voterEmail}</p>
                        </div>
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-sm text-sky-700">{pollData.options[vote.optionIndex]?.text || 'Opción inválida'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfessorPoll;
