import { useRouter } from 'next/navigation';
import { statGroups } from '@/utils/statGroups';

interface StatSelectProps {
  currentStat: string;
}

export const StatSelect: React.FC<StatSelectProps> = ({ currentStat }) => {
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStat = event.target.value;
    router.push(`/ranking/stats?stat=${newStat}`);
  };

  // Encontra o grupo e a estatística atual
  const getCurrentGroupAndStat = () => {
    for (const group of statGroups) {
      const stat = group.stats.find(s => s.urlParam === currentStat);
      if (stat) {
        return {
          groupLabel: group.groupLabel,
          statTitle: stat.title
        };
      }
    }
    return {
      groupLabel: '',
      statTitle: ''
    };
  };

  const { groupLabel } = getCurrentGroupAndStat();

  return (
    <div className="mb-6">
      <h2 className="text-4xl font-extrabold italic leading-[25px] tracking-[-2px] text-center mb-4">
        {groupLabel}
      </h2>
      <div className="relative">
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
    </div>
  );
};