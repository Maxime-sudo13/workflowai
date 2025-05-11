// frontend/src/App.tsx
import ChatWindow from './components/ChatWindow/ChatWindow';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center text-slate-100 px-4 py-8"> {/* Fond légèrement plus sombre pour contraster */}
      <header className="p-6 text-center mb-8"> {/* Ajout de marge en bas */}
        <h1 className="text-4xl md:text-5xl font-bold text-sky-400">
          ConvoFlow n8n
        </h1>
        <p className="mt-3 text-lg md:text-xl text-slate-300">
          Votre assistant IA pour créer des workflows n8n.
        </p>
      </header>

      <main className="w-full flex justify-center"> {/* Centrer le ChatWindow s'il est plus petit que la largeur max */}
        <ChatWindow />
      </main>

      <footer className="mt-auto pt-10 text-center text-xs text-slate-500"> {/* Augmentation du pt et texte plus petit */}
        Sprint 1 - Chat UI
      </footer>
    </div>
  )
}

export default App