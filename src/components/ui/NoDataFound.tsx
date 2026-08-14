import React from 'react';
import { AlertCircle, Calendar, User, Users } from 'lucide-react';

interface NoDataFoundProps {
  type?: 'player' | 'team' | 'campeonato' | 'jogo';
  temporada?: string;
  entityName?: string;
  onGoBack?: () => void;
  message?: string
  description?: string
}

export const NoDataFound: React.FC<NoDataFoundProps> = ({ type, temporada, entityName, onGoBack }) => {
  const isPlayer = type === 'player';
  
  return (
    <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {isPlayer ? (
              <User className="w-8 h-8 text-black" />
            ) : (
              <Users className="w-8 h-8 text-black" />
            )}
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-black">
              {isPlayer ? 'Jogador' : 'Time'} Não Encontrado
            </h2>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-black">
            {entityName && (
              <span className="font-semibold block mb-2">"{entityName}"</span>
            )}
            {isPlayer ? 'Este jogador' : 'Este time'} não está cadastrado na temporada{' '}
            <span className="font-semibold text-blue-600">{temporada}</span>.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-black">
            <Calendar className="w-4 h-4" />
            <span>Temporada {temporada}</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-black">
            Possíveis motivos:
          </p>
          <ul className="text-xs text-black space-y-1">
            <li>• {isPlayer ? 'Jogador' : 'Time'} não participou desta temporada</li>
            <li>• Dados ainda não foram importados</li>
          </ul>
        </div>

        {onGoBack && (
          <button
            onClick={onGoBack}
            className="mt-6 w-full bg-[#272731] text-white py-2 px-4 rounded-lg hover:opacity-80 transition-colors"
          >
            Voltar
          </button>
        )}
      </div>
    </div>
  );
};