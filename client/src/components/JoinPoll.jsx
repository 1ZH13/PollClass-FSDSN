import { useState } from 'react';

function JoinPoll({ onJoin, loading }) {
  const [code, setCode] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onJoin({ code: code.trim().toUpperCase() });
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow">
      <h2 className="text-2xl font-semibold text-slate-900">Unirse a una encuesta</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Código de encuesta</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
            placeholder="Ej: ABC123"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-emerald-600 px-6 py-3 text-white shadow hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? 'Buscando...' : 'Unirme'}
        </button>
      </form>
    </div>
  );
}

export default JoinPoll;
