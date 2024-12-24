import React from 'react';

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  resetPage: () => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  sortOption,
  setSortOption,
  resetPage,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    resetPage();
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    resetPage();
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
    resetPage();
  };

  return (
    <div className="search-filter-sort mb-6 flex flex-col sm:flex-row items-center gap-4 justify-center">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search Pokémon..."
        className="input-field"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {/* Type Filter */}
      <select className="select-field" value={selectedType} onChange={handleTypeChange}>
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

      {/* Sort Options */}
      <select className="select-field" value={sortOption} onChange={handleSortChange}>
        <option value="">Sort By</option>
        <option value="name">Name</option>
        <option value="attack">Attack</option>
        <option value="hp">HP</option>
        <option value="defense">Defense</option>
        <option value="speed">Speed</option>
      </select>
    </div>
  );
};

export default SearchAndFilter;
