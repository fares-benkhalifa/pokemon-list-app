import React, { useState, useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import Pagination from '../components/Pagination';
import { typeBackgrounds, PokemonType } from '../const/typeBackgrounds';
import Modal from '../components/Modal';
import SearchAndFilter from '../components/SearchAndFilter';

const HomePage: React.FC = () => {
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);

  const { data, details, loading, error } = useFetch(
    `https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0`
  );

  const allPokemons = data?.results || [];

  const filteredPokemons = useMemo(() => {
    return allPokemons.filter((pokemon) => {
      const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
      const detailsData = details[pokemon.url];
      const matchesType =
        selectedType === '' || (detailsData && detailsData.types.some((t: any) => t.type.name === selectedType));
      return matchesSearch && matchesType;
    });
  }, [allPokemons, searchTerm, selectedType, details]);

  const paginatedPokemons = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredPokemons.slice(start, end);
  }, [filteredPokemons, currentPage]);

  const displayedPokemons = useMemo(() => {
    return paginatedPokemons.map((pokemon) => details[pokemon.url]).filter(Boolean);
  }, [paginatedPokemons, details]);

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
      <h1 id="titre" className="text-2xl font-bold mb-4">
        Pokémon List
      </h1>

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
        totalPages={Math.ceil(filteredPokemons.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      {showModal && selectedPokemon && <Modal pokemon={selectedPokemon} onClose={closeModal} />}
    </div>
  );
};

export default HomePage;
