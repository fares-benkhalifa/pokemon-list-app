import { useState, useEffect } from 'react';

type PokemonApiResponse = {
  count: number;
  results: { name: string; url: string }[];
};

export const useFetch = (url: string) => {
  const [data, setData] = useState<PokemonApiResponse | null>(null);
  const [details, setDetails] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchListAndDetails = async () => {
      try {
        const listResponse = await fetch(url);
        const listData = await listResponse.json();
        setData(listData);

 
        const fetchDetails = async (pokemonList: { name: string; url: string }[]) => {
          for (const pokemon of pokemonList) {
            if (!details[pokemon.url]) {
              const response = await fetch(pokemon.url);
              const pokemonData = await response.json();
              setDetails((prev) => ({ ...prev, [pokemon.url]: pokemonData }));
            }
          }
        };

        fetchDetails(listData.results);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchListAndDetails();
  }, [url]);

  return { data, details, loading, error };
};
