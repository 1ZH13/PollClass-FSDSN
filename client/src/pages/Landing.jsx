import { Link } from 'react-router-dom';

function Landing() {
  return (
    <main className="relative overflow-hidden min-h-screen px-6 py-10 sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.14),_transparent_18%),radial-gradient(circle_at_55%_80%,_rgba(148,163,184,0.12),_transparent_24%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10">
        <section className="glass-card overflow-hidden rounded-[2.5rem] border border-white/10 p-8 shadow-[0_35px_120px_rgba(15,23,42,0.24)] backdrop-blur-xl sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full border border-sky-200/20 bg-sky-300/10 px-4 py-2 text-sm font-semibold text-sky-200 backdrop-blur-sm">
                Sistema de encuestas para clase en vivo
              </div>
              <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
                PollClass, el aula cristalina.
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                Diseña encuestas instantáneas, comparte códigos de acceso y visualiza resultados con un diseño fresco y transparente.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/auth" className="glass-button text-sm">
                  Comenzar ahora
                </Link>
                <Link to="/auth" className="glass-button-secondary text-sm hover:bg-white/15">
                  Ya tengo cuenta
                </Link>
              </div>
            </div>

            <div className="glass-panel rounded-[2rem] p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
              <div className="grid gap-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-sky-200">Flujo de clase</p>
                <h2 className="text-3xl font-bold text-white">Aula clara y moderna</h2>
                <p className="text-slate-300">
                  Conecta estudiantes con un código, vota desde cualquier dispositivo y revisa resultados en un panel limpio y silencioso.
                </p>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Tiempo estimado</p>
                  <p className="mt-3 text-3xl font-semibold text-white">2 horas</p>
                </div>
                <div className="rounded-[1.75rem] bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Stack</p>
                  <p className="mt-3 text-3xl font-semibold text-white">React · Bun · MongoDB · Tailwind</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Landing;
