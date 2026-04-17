import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import JoinPoll from '../components/JoinPoll.jsx';
import VoteForm from '../components/VoteForm.jsx';
import { polls } from '../services/api.js';
import { AuthContext } from '../context/AuthContext.jsx';

function Student() {
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState('join');
  const [poll, setPoll] = useState(null);
  const [message, setMessage] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleJoin(values) {
    setLoading(true);
    setMessage('');

    try {
      const pollFound = await polls.getByCode(values.code);
      setPoll(pollFound);
      setStep('vote');
      setResults(null);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshResults(pollId) {
    try {
      const body = await polls.results(pollId);
      setResults(body);
      setPoll(body.poll);
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => {
    if (step === 'results' && poll) {
      const interval = setInterval(() => refreshResults(poll._id), 5000);
      return () => clearInterval(interval);
    }
  }, [step, poll]);

  async function handleVote(optionIndex) {
    if (!poll) return;
    setLoading(true);
    setMessage('');

    try {
      await polls.vote(poll._id, { optionIndex });
      const body = await polls.results(poll._id);
      setResults(body);
      setStep('results');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  function resetJoin() {
    setStep('join');
    setPoll(null);
    setResults(null);
    setMessage('');
  }

  if (!user) {
    return <Navigate replace to="/auth" />;
  }

  if (user.role !== 'student') {
    return <Navigate replace to="/professor" />;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-slate-900">Vista Estudiante</h1>
          <p className="mt-3 text-slate-600">Únete con tu código, vota y consulta resultados desde tu celular.</p>
        </div>

        {message && <div className="rounded-[1.75rem] bg-rose-100 p-5 text-rose-700 shadow">{message}</div>}

        {step === 'join' && <JoinPoll onJoin={handleJoin} loading={loading} />}

        {step === 'vote' && poll && (
          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <div className="mb-6 rounded-[1.75rem] bg-slate-50 p-6">
              <p className="text-slate-600">Encuesta:</p>
              <h2 className="text-2xl font-semibold text-slate-900">{poll.title}</h2>
              <p className="text-slate-500">Código: <span className="font-semibold">{poll.code}</span></p>
              <p className="text-slate-500">Usuario: <span className="font-semibold">{user.fullName || user.email}</span></p>
            </div>
            <VoteForm options={poll.options} onVote={handleVote} loading={loading} />
          </div>
        )}

        {step === 'results' && results && (
          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Resultados oficiales</h2>
                <p className="mt-2 text-slate-600">Los resultados se actualizan cada 5 segundos.</p>
              </div>
              <button onClick={resetJoin} className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">
                Volver a código
              </button>
            </div>
            <div className="mt-6 space-y-4">
              {results.poll.options.map((option, index) => (
                <div key={index} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-slate-900">{option.text}</p>
                    <span className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">{option.votes}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.75rem] bg-slate-50 p-6 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Estudiantes que votaron</p>
              {results.votes.length === 0 ? (
                <p className="mt-3">Aún no hay registros.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {results.votes.map((vote) => (
                    <li key={vote._id} className="rounded-3xl border border-slate-200 bg-white p-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-slate-900">{vote.voterName || vote.voterEmail}</span>
                        <span className="text-xs text-slate-500">{vote.voterEmail}</span>
                        <span>{results.poll.options[vote.optionIndex]?.text || 'Opción inválida'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Student;
