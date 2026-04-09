function VoteForm({ options, onVote, loading }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-600">Selecciona una opción para enviar tu voto.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onVote(index)}
            disabled={loading}
            className="rounded-3xl border border-slate-200 bg-slate-100 px-5 py-4 text-left text-slate-900 transition hover:border-slate-400 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="font-semibold">{option.text}</span>
          </button>
        ))}
      </div>
      {loading && <p className="text-sm text-slate-500">Enviando voto...</p>}
    </div>
  );
}

export default VoteForm;
