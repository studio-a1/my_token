import React from 'react';
import { PresaleData, SaleStatus } from '../types';
import { CloseIcon } from './icons';

interface CreatorPanelProps {
    config: PresaleData;
    onConfigChange: (newConfig: PresaleData) => void;
    onClose: () => void;
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input 
            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition"
            {...props} 
        />
    </div>
);

export const CreatorPanel: React.FC<CreatorPanelProps> = ({ config, onConfigChange, onClose }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Use getAttribute para verificar o tipo, pois a propriedade `type` pode ser diferente.
        const type = e.target.getAttribute('type'); 
        let processedValue: any = value;

        if (type === 'number') {
            processedValue = value === '' ? '' : parseFloat(value);
        }
        if (type === 'datetime-local') {
            processedValue = new Date(value);
        }
        onConfigChange({ ...config, [name]: processedValue });
    };

    // Helper to format date for datetime-local input
    const formatDateForInput = (date: Date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return ''; // Retorna string vazia se a data for inválida
        }
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (`0${d.getMonth() + 1}`).slice(-2);
        const day = (`0${d.getDate()}`).slice(-2);
        const hours = (`0${d.getHours()}`).slice(-2);
        const minutes = (`0${d.getMinutes()}`).slice(-2);
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900/80 backdrop-blur-lg z-40 creator-panel">
            <div className="aurora-border-lg h-full">
                <div className="p-6 h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-cyan-400">Modo Criador</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-white">
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="bg-indigo-900/30 border border-indigo-500/50 text-indigo-200 text-sm rounded-lg p-3 mb-6">
                        <p><strong>Esta é uma ferramenta de simulação.</strong> Altere os valores abaixo para visualizar como seria seu lançamento. Nenhuma transação real é feita.</p>
                    </div>
                    
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Nome do Token" type="text" name="tokenName" value={config.tokenName} onChange={handleChange} />
                            <InputField label="Símbolo do Token" type="text" name="tokenSymbol" value={config.tokenSymbol} onChange={handleChange} />
                        </div>
                        <InputField label="Preço do Token (ETH)" type="number" name="tokenPrice" value={config.tokenPrice} onChange={handleChange} step="0.001" />
                        <InputField label="Tokens Vendidos" type="number" name="tokensSold" value={config.tokensSold} onChange={handleChange} />
                        <InputField label="Total de Tokens" type="number" name="totalTokens" value={config.totalTokens} onChange={handleChange} />
                        
                        <div>
                           <label className="block text-sm font-medium text-slate-300 mb-1">Status da Venda</label>
                           <select name="status" value={config.status} onChange={handleChange} className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition">
                               {Object.values(SaleStatus).map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                        </div>
                        
                        <InputField label="Fim da Venda" type="datetime-local" name="saleEndTime" value={formatDateForInput(config.saleEndTime)} onChange={handleChange} />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Compra Mínima (ETH)" type="number" name="minPurchase" value={config.minPurchase} onChange={handleChange} step="0.1" />
                            <InputField label="Compra Máxima (ETH)" type="number" name="maxPurchase" value={config.maxPurchase} onChange={handleChange} step="0.1" />
                        </div>
                    </form>
                </div>
            </div>
        </aside>
    );
};
