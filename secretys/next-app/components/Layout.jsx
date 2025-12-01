export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white p-4">
        <div className="max-w-5xl mx-auto flex justify-between">
          <span className="font-bold text-xl">Secretys</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
