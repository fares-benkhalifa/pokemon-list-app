import React from 'react';

type PokemonCardProps = {
  name: string;
  image: string;
  stats: { [key: string]: number };
  abilities: string[];
};

const PokemonCard: React.FC<PokemonCardProps> = ({ name, image, stats, abilities }) => (
    <div className="border border-gray-300 shadow rounded-md overflow-hidden bg-white">
    <img src={image} alt={name} className="w-full h-32 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-700">{name}</h3>
      <div className="mt-2">
        <h4 className="text-sm font-medium text-gray-600">Stats:</h4>
        <ul className="text-sm text-gray-600">
          {Object.entries(stats).map(([key, value]) => (
            <li key={key} className="capitalize">{`${key}: ${value}`}</li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <h4 className="text-sm font-medium text-gray-600">Abilities:</h4>
        <ul className="text-sm text-gray-600">
          {abilities.map((ability, idx) => (
            <li key={idx} className="capitalize">{ability}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  
);

export default PokemonCard;
