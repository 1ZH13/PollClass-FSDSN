import { useState } from 'react';

function PollForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function updateOption(index, value) {
    setOptions((current) => current.map((item, idx) => (idx === index ? value : item)));
  }

  function addOption() {
    setOptions((current) => [...current, '']);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const validOptions = options.map((option) => option.trim()).filter(Boolean);

    if (!trimmedTitle || validOptions.length < 2) {
      setError('Ingresa un título y al menos dos opciones.');
      return;
    }

    setSaving(true);
    try {
      await onCreate({ title: trimmedTitle, options: validOptions });
      setTitle('');
      setOptions(['', '']);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label className="block text-sm font-medium text-slate-700">Título de la encuesta</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 focus:border-sky-500 focus:outline-none"
          placeholder="¿Qué tema prefieres?"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Opciones</span>
          <button type="button" onClick={addOption} className="rounded-full bg-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-300">
            Agregar opción
          </button>
        </div>

        {options.map((option, index) => (
          <input
            key={index}
            value={option}
            onChange={(event) => updateOption(index, event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 p-3 focus:border-sky-500 focus:outline-none"
            placeholder={`Opción ${index + 1}`}
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-2xl bg-sky-600 px-6 py-3 text-white shadow hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {saving ? 'Creando...' : 'Crear encuesta'}
      </button>
    </form>
  );
}

export default PollForm;
