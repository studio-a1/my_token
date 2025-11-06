import React from 'react';
import { UserData } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface UserInfoProps {
    data: UserData;
    tokenSymbol: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({ data, tokenSymbol }) => {
    return (
        <div className="aurora-border p-8 backdrop-blur-lg shadow-2xl shadow-indigo-900/20 transition-transform duration-300 hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-slate-100 mb-6">Suas Informações</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <span className="font-medium text-slate-300">Status na Whitelist</span>
                    <span className={`flex items-center gap-2 font-semibold ${data.isWhitelisted ? 'text-green-400' : 'text-red-400'}`}>
                        {data.isWhitelisted ? <CheckCircleIcon /> : <XCircleIcon />}
                        {data.isWhitelisted ? 'Aprovado' : 'Não Aprovado'}
                    </span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <span className="font-medium text-slate-300">Sua Contribuição Total</span>
                    <span className="font-semibold text-cyan-400">{data.contribution} ETH</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <span className="font-medium text-slate-300">Tokens a Receber</span>
                    <span className="font-semibold text-cyan-400">{data.tokensOwed.toLocaleString()} {tokenSymbol}</span>
                </div>
            </div>
        </div>
    );
};