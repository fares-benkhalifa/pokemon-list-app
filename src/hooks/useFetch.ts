import { useState, useEffect } from 'react';
import axios from 'axios';

type PokemonApiResponse = {
  count: number;
  results: { name: string; url: string }[];
};

export const useFetch = (url: string) => {
  const [data, setData] = useState<PokemonApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => setData(response.data))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
};