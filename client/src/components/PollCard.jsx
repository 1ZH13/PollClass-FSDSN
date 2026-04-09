import { Link } from 'react-router-dom';

function PollCard({ poll, onClose, onDelete }) {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  async function copyCode() {
    await navigator.clipboard.writeText(poll.code);
    alert('Código copiado al portapapeles');
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">{poll.status === 'active' ? 'Activa' : 'Cerrada'}</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">{totalVotes} votos</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900">{poll.title}</h3>
          <p className="text-sm text-slate-600">
            Código: <span className="font-semibold tracking-[0.2em] text-slate-900">{poll.code}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={copyCode} className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">
            Copiar código
          </button>
          <Link
            to={`/professor/poll/${poll._id}`}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-950"
          >
            Ver resultados
          </Link>
          <button
            type="button"
            onClick={onClose}
            disabled={poll.status !== 'active'}
            className="rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300 hover:bg-amber-600"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PollCard;
