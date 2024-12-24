import React, { useState, useEffect, useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import Pagination from '../components/Pagination';
import { typeBackgrounds, PokemonType } from '../const/typeBackgrounds';
import Modal from '../components/Modal';
import SearchAndFilter from '../components/SearchAndFilter';

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const { data, loading, error } = useFetch(
    `https://pokeapi.co/api/v2/pokemon?limit=1302&offset=${(currentPage - 1) * itemsPerPage}`
  );

  const [filteredPokemons, setFilteredPokemons] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortOption, setSortOption] = useState('');

  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (data && data.results) {
      const fetchDetails = async () => {
        const details = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const res = await fetch(pokemon.url);
            return res.json();
          })
        );
        setFilteredPokemons(details);
      };
      fetchDetails();
    }
  }, [data]);

  const filteredAndSortedPokemons = useMemo(() => {
    if (!filteredPokemons) return [];

    return filteredPokemons
      .filter((pokemon) => {
        const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType =
          selectedType === '' || pokemon.types.some((t: any) => t.type.name === selectedType);
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortOption === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortOption) {
          const statA = a.stats.find((s: any) => s.stat.name === sortOption)?.base_stat || 0;
          const statB = b.stats.find((s: any) => s.stat.name === sortOption)?.base_stat || 0;
          return statB - statA;
        }
        return 0;
      });
  }, [filteredPokemons, searchTerm, selectedType, sortOption]);

  const displayedPokemons = filteredAndSortedPokemons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openModal = (pokemon: any) => {
    setSelectedPokemon(pokemon);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPokemon(null);
    setShowModal(false);
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 id="titre" className="text-2xl font-bold mb-4">Pokémon List</h1>

      {/* Search and Filter */}
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        sortOption={sortOption}
        setSortOption={setSortOption}
        resetPage={resetPage}
      />

      {/* Pokémon Cards */}
      <div className="pokemon-grid">
        {displayedPokemons.map((pokemon) => {
          const primaryType = pokemon.types[0]?.type.name as PokemonType | undefined;

          return (
            <div
              key={pokemon.id}
              className="pokemon-card"
              style={{
                backgroundImage:
                  primaryType && typeBackgrounds[primaryType]
                    ? typeBackgrounds[primaryType]
                    : 'url("/images/default.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <h2>{pokemon.name}</h2>
              <ul>
                <li>
                  Types: {pokemon.types.map((t: { type: { name: string } }) => t.type.name).join(', ')}
                </li>
              </ul>
              <button className="btn" onClick={() => openModal(pokemon)}>
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredAndSortedPokemons.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      {showModal && selectedPokemon && (
        <Modal pokemon={selectedPokemon} onClose={closeModal} />
      )}
    </div>
  );
};

export default HomePage;
