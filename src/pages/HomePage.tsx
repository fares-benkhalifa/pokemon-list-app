// src/pages/HomePage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useFetch } from '../hooks/useFetch';
import PokemonCard from '../components/PokemonCard';
import Pagination from '../components/Pagination';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { data, loading, error } = useFetch(
    'https://pokeapi.co/api/v2/pokemon?limit=100&offset=0'
  );

  const [filteredPokemons, setFilteredPokemons] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortOption, setSortOption] = useState('');

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
          return statB - statA; // Descending order
        }
        return 0;
      });
  }, [filteredPokemons, searchTerm, selectedType, sortOption]);

  const displayedPokemons = filteredAndSortedPokemons.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pokémon List</h1>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="input-field"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="select-field"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="grass">Grass</option>
          <option value="electric">Electric</option>
          <option value="ice">Ice</option>
          <option value="rock">Rock</option>
          <option value="ground">Ground</option>
          <option value="psychic">Psychic</option>
          <option value="dark">Dark</option>
          <option value="fairy">Fairy</option>
        </select>
        <select
          className="select-field"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="attack">Attack</option>
          <option value="hp">HP</option>
          <option value="defense">Defense</option>
          <option value="speed">Speed</option>
        </select>
      </div>

      {/* Pokémon Cards */}
      <div className="pokemon-grid">
        {displayedPokemons.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-card">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <h3>{pokemon.name}</h3>
            <ul>
              <li>HP: {pokemon.stats.find((s) => s.stat.name === 'hp')?.base_stat || 0}</li>
              <li>Attack: {pokemon.stats.find((s) => s.stat.name === 'attack')?.base_stat || 0}</li>
              <li>Defense: {pokemon.stats.find((s) => s.stat.name === 'defense')?.base_stat || 0}</li>
            </ul>
            <ul>
              <li>Abilities:</li>
              {pokemon.abilities.map((ability, idx) => (
                <li key={idx}>{ability.ability.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredAndSortedPokemons.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default HomePage;
