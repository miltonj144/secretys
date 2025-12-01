import useSWR from 'swr';
import Layout from '../components/Layout';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then(r => r.json());

export default function Home() {
  const { data, error } = useSWR(
    process.env.NEXT_PUBLIC_BACKEND_URL + '/api/creators',
    fetcher
  );

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Criadores Secretys</h1>
      {error && <p>Erro ao carregar criadores.</p>}
      {!data && !error && <p>Carregando...</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data && data.map((c) => (
          <Link key={c.id} href={`/creators/${encodeURIComponent(c.handle)}`}>
            <div className="border rounded-lg p-4 bg-white cursor-pointer">
              <h2 className="font-semibold">{c.name}</h2>
              <p className="text-sm text-gray-500">{c.handle}</p>
              <p className="mt-2 text-sm">R$ {c.price.toFixed(2)}/mês</p>
              <p className="text-xs text-gray-400">{c.subscribers} assinantes</p>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
