import React, { useState, useEffect } from 'react';
import { PresaleData, SaleStatus } from '../types.ts';
import { formatDistanceToNowStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PresaleCardProps {
    data: PresaleData;
    onBuy: (amount: number) => void;
    isConnected: boolean;
    onConnectRequest: () => void;
}

export const PresaleCard: React.FC<PresaleCardProps> = ({ data, onBuy, isConnected, onConnectRequest }) => {
    const [amount, setAmount] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<string>('');
    
    // --- FIX: Ensure calculations are robust against non-numeric or zero values from the Creator Panel ---
    const numericSold = Number(data.tokensSold) || 0;
    const numericTotal = Number(data.totalTokens) || 0;
    const numericTokenPrice = Number(data.tokenPrice) || 0;
    const numericMinPurchase = Number(data.minPurchase) || 0;
    const numericMaxPurchase = Number(data.maxPurchase) || 0;

    const progress = numericTotal > 0 ? (numericSold / numericTotal) * 100 : 0;

    const numericAmount = parseFloat(amount);
    const tokensToReceive = (numericTokenPrice > 0 && !isNaN(numericAmount) && numericAmount > 0)
        ? (numericAmount / numericTokenPrice)
        : 0;
        
    const isBuyButtonDisabled = 
        !amount || 
        data.status !== SaleStatus.LIVE || 
        isNaN(numericAmount) || 
        numericAmount < numericMinPurchase || 
        numericAmount > numericMaxPurchase;
    // --- END FIX ---

    useEffect(() => {
        if (data.status === SaleStatus.LIVE && data.saleEndTime > new Date()) {
            const interval = setInterval(() => {
                const distance = formatDistanceToNowStrict(data.saleEndTime, { locale: ptBR, addSuffix: true });
                setTimeLeft(`Termina ${distance}`);
            }, 1000);
            return () => clearInterval(interval);
        } else if (data.status === SaleStatus.ENDED || data.saleEndTime <= new Date()) {
            setTimeLeft('Venda finalizada');
        } else {
            setTimeLeft('Venda em breve');
        }
    }, [data.saleEndTime, data.status]);


    const handleBuy = () => {
        if (!isNaN(numericAmount) && numericAmount > 0) {
            onBuy(numericAmount);
        }
    };

    const getStatusBadgeColor = () => {
        switch (data.status) {
            case SaleStatus.LIVE: return 'bg-green-500/20 text-green-400 border-green-500/30';
            case SaleStatus.ENDED: return 'bg-red-500/20 text-red-400 border-red-500/30';
            case SaleStatus.UPCOMING: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    return (
        <div className="aurora-border p-8 backdrop-blur-lg shadow-2xl shadow-indigo-900/20 transition-transform duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-slate-100">Participe da Pré-venda</h2>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusBadgeColor()}`}>
                    {data.status}
                </span>
            </div>

            <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Progresso</span>
                    <span>{progress.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3">
                    <div 
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-3 rounded-full transition-all duration-500 ease-out" 
                        style={{ 
                            width: `${progress}%`,
                            boxShadow: '0 0 10px #4f46e5, 0 0 5px #06b6d4'
                        }}
                    ></div>
                </div>
                <div className="flex justify-between text-sm text-slate-300 mt-2">
                    <span>{numericSold.toLocaleString()} / {numericTotal.toLocaleString()} {data.tokenSymbol}</span>
                    <span className="text-yellow-400">{timeLeft}</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-400">Preço do Token</p>
                        <p className="text-lg font-semibold text-slate-100">{numericTokenPrice} ETH</p>
                    </div>
                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-400">Compra Mínima</p>
                        <p className="text-lg font-semibold text-slate-100">{numericMinPurchase} ETH</p>
                    </div>
                </div>

                <div className="relative">
                    <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-1">Valor em ETH</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.1"
                        min={numericMinPurchase}
                        max={numericMaxPurchase}
                        disabled={!isConnected || data.status !== SaleStatus.LIVE}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:bg-slate-800 disabled:cursor-not-allowed"
                    />
                </div>
                <div className="text-center bg-slate-900/70 p-3 rounded-lg border border-slate-700">
                    <p className="text-slate-400">Você receberá (aprox.)</p>
                    <p className="text-2xl font-bold text-cyan-400">{tokensToReceive.toLocaleString(undefined, { maximumFractionDigits: 2 })} {data.tokenSymbol}</p>
                </div>
                
                {isConnected ? (
                    <button
                        onClick={handleBuy}
                        disabled={isBuyButtonDisabled}
                        className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:scale-105 transition-transform duration-300 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 disabled:scale-100 shadow-lg shadow-indigo-500/20"
                    >
                        Comprar Tokens
                    </button>
                ) : (
                    <button
                        onClick={onConnectRequest}
                        className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg shadow-indigo-500/20"
                    >
                        Conectar Carteira para Comprar
                    </button>
                )}

            </div>
        </div>
    );
};
