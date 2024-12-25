import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface ModalProps {
  pokemon: any;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ pokemon, onClose }) => {
  const statsLabels = ['HP', 'Attack', 'Defense', 'Speed'];
  const statNames = ['hp', 'attack', 'defense', 'speed'];

  const statsValues = statNames.map((statName) => {
    const stat = pokemon.stats.find((s: any) => s.stat.name.toLowerCase() === statName);
    return stat?.base_stat || 0;
  });
  const maxStatValue = Math.max(...statsValues);
  const radarData = {
    labels: statsLabels,
    datasets: [
      {
        label: `${pokemon.name}'s Stats`,
        data: statsValues,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: maxStatValue + 10, // Dynamically adjust max range
        ticks: {
          stepSize: 20,
          font: {
            size: 12, // Set the desired font size here
          },
        },
        pointLabels: {
          font: {
            size: 16, // Set the desired font size for the labels here
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">{pokemon.name}</h2>
        {/* <img src={pokemon.sprites.front_default} alt={pokemon.name} className="mb-4" /> */}
        <div className="radar" >
          <Radar data={radarData} options={radarOptions} />
        </div>
        <p className="mt-4">Abilities:</p>
        <ul>
          {pokemon.abilities.map((ability: any, idx: number) => (
            <li key={idx}>{ability.ability.name}</li>
          ))}
        </ul>
        <button className="btn-close mt-4" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
