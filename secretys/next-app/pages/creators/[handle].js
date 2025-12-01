import { useRouter } from 'next/router';
import useSWR from 'swr';
import Layout from '../../components/Layout';

const fetcher = (url) => fetch(url).then(r => r.json());

export default function CreatorPage() {
  const router = useRouter();
  const { handle } = router.query;

  const { data, error } = useSWR(
    handle ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/creators/${handle}` : null,
    fetcher
  );

  if (error) return <Layout><p>Erro ao carregar criador.</p></Layout>;
  if (!data) return <Layout><p>Carregando...</p></Layout>;

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
      <p className="text-gray-600 mb-4">{data.handle}</p>
      <p className="mb-2">Assinatura: R$ {data.price.toFixed(2)}/mês</p>
      <button className="bg-black text-white px-4 py-2 rounded">
        Assinar (fluxo Stripe será chamado aqui)
      </button>
    </Layout>
  );
}
