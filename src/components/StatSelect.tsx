// components/StatSelect.tsx
import { useRouter } from 'next/navigation';

const statGroups = [
  {
    title: 'Passando',
    stats: [
      { title: 'Jardas', urlParam: 'passe-jardas' },
      { title: 'Passes Completos (%)', urlParam: 'passe-passes' },
      { title: 'Jardas(AVG)', urlParam: 'passe-jardasavg' },
      { title: 'Touchdowns', urlParam: 'passe-touchdowns' },
      { title: 'Passes Completos', urlParam: 'passe-passes-comp' },
      { title: 'Passes Tentados', urlParam: 'passe-passes-tent' },
      { title: 'Interceptações', urlParam: 'passe-interceptacoes' },
      { title: 'Sacks', urlParam: 'passe-sacks' },
      { title: 'Fumbles', urlParam: 'passe-fumbles-' }
    ]
  },
  {
    title: 'Correndo',
    stats: [
      { title: 'Jardas', urlParam: 'corrida-jardas' },
      { title: 'Corridas', urlParam: 'corrida-corridas' },
      { title: 'Jardas(AVG)', urlParam: 'corrida-jardasavg' },
      { title: 'Touchdowns', urlParam: 'corrida-touchdowns' },
      { title: 'Fumbles', urlParam: 'corrida-fumbles' }
    ]
  },
  {
    title: 'Recebendo',
    stats: [
      { title: 'Jardas', urlParam: 'recepcao-jardas' },
      { title: 'Recepções', urlParam: 'recepcao-recepcoes' },
      { title: 'Touchdowns', urlParam: 'recepcao-touchdowns' },
      { title: 'Jardas(AVG)', urlParam: 'recepcao-jardasavg' },
      { title: 'Alvos', urlParam: 'recepcao-alvos' },
      { title: 'Fumbles', urlParam: 'recepcao-fumbles' }
    ]
  },
  {
    title: 'Retornando',
    stats: [
      { title: 'Jardas', urlParam: 'retorno-jardas' },
      { title: 'Retornos', urlParam: 'retorno-retornos' },
      { title: 'Touchdowns', urlParam: 'retorno-touchdowns' },
      { title: 'Jardas(AVG)', urlParam: 'retorno-jardasavg' },
      { title: 'Fumbles', urlParam: 'retorno-fumbles' }
    ]
  },
  {
    title: 'Defendendo',
    stats: [
      { title: 'Sacks', urlParam: 'defesa-sacks' },
      { title: 'Interceptações', urlParam: 'defesa-interceptacoes' },
      { title: 'Fumbles Forçados', urlParam: 'defesa-fumbles-forc' },
      { title: 'Touchdowns', urlParam: 'defesa-touchdowns' },
      { title: 'Tackles (Loss)', urlParam: 'defesa-tacklesloss' },
      { title: 'Tackles Totais', urlParam: 'defesa-tackles-totais' },
      { title: 'Passes Desviados', urlParam: 'defesa-passes-desv' },
      { title: 'Safeties', urlParam: 'defesa-safeties' }
    ]
  },
  {
    title: 'Chutando',
    stats: [
      { title: 'FG(%)', urlParam: 'chute-fg' },
      { title: 'Extra Points(%)', urlParam: 'chute-xp' },
      { title: 'XP Bons', urlParam: 'chute-xp-bom' },
      { title: 'XP Tentados', urlParam: 'chute-xp-tentados' },
      { title: 'FG Bons', urlParam: 'chute-fg-bom' },
      { title: 'FG Tentados', urlParam: 'chute-fg-tentados' },
      { title: 'FG Mais Longo', urlParam: 'chute-mais-longo' },
      { title: 'FG (0-10)', urlParam: 'chute-fg0-10' },
      { title: 'FG (11-20)', urlParam: 'chute-fg11-20' },
      { title: 'FG (21-30)', urlParam: 'chute-fg21-30' },
      { title: 'FG (31-40)', urlParam: 'chute-fg31-40' },
      { title: 'FG (41-50)', urlParam: 'chute-fg41-50' }
    ]
  },
  {
    title: 'Punt',
    stats: [
      { title: 'Jardas (AVG)', urlParam: 'punt-jardasavg' },
      { title: 'Punts', urlParam: 'punt-punts' },
      { title: 'Jardas', urlParam: 'punt-jardas' }
    ]
  }
];

export const StatSelect: React.FC<{ currentStat: string }> = ({ currentStat }) => {
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStat = event.target.value;
    router.push(`/ranking/stats?stat=${newStat}`);
  };

  return (
    <div className="relative mb-4">
      <select
        value={currentStat}
        onChange={handleChange}
        className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        {statGroups.map(group => (
          <optgroup key={group.title} label={group.title}>
            {group.stats.map(stat => (
              <option key={stat.urlParam} value={stat.urlParam}>
                {stat.title}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};