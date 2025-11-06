import React from 'react';
import { WalletIcon, SettingsIcon } from './icons.tsx';

interface HeaderProps {
    walletAddress: string | null;
    onConnect: () => void;
    tokenName?: string;
    onToggleCreatorMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ walletAddress, onConnect, tokenName, onToggleCreatorMode }) => {
    const formatAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        <header className="w-full max-w-5xl aurora-border-lg z-10">
            <div className="flex justify-between items-center py-4 px-6 bg-slate-900/60 backdrop-blur-sm rounded-lg">
                <div className="text-2xl font-bold text-slate-100">
                    <span className="text-cyan-400">{tokenName || 'Token'}</span>Presale
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onToggleCreatorMode}
                        className="p-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                        title="Ativar Modo Criador"
                    >
                        <SettingsIcon />
                    </button>
                    <button
                        onClick={onConnect}
                        disabled={!!walletAddress}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform duration-300 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                    >
                        <WalletIcon />
                        {walletAddress ? `Conectado: ${formatAddress(walletAddress)}` : 'Conectar Carteira'}
                    </button>
                </div>
            </div>
        </header>
    );
};
