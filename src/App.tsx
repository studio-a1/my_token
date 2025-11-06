import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { PresaleCard } from './components/PresaleCard.tsx';
import { UserInfo } from './components/UserInfo.tsx';
import { Modal } from './components/Modal.tsx';
import { CreatorPanel } from './components/CreatorPanel.tsx';
import { TransactionStatus, PresaleData, UserData } from './types.ts';
import { fetchPresaleData, connectWallet, fetchUserData, buyTokens, updatePresaleData } from './services/mockApiService.ts';
import { SuccessIcon, PendingIcon, ErrorIcon } from './components/icons.tsx';

const App: React.FC = () => {
    const [presaleData, setPresaleData] = useState<PresaleData | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(TransactionStatus.IDLE);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [isCreatorModeOpen, setIsCreatorModeOpen] = useState<boolean>(false);

    const loadPresaleData = useCallback(async () => {
        try {
            const data = await fetchPresaleData();
            setPresaleData(data);
        } catch (error) {
            console.error("Failed to fetch presale data:", error);
        }
    }, []);

    const loadUserData = useCallback(async (address: string) => {
        try {
            const data = await fetchUserData(address);
            setUserData(data);
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }, []);

    useEffect(() => {
        loadPresaleData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleConnectWallet = async () => {
        try {
            const address = await connectWallet();
            setWalletAddress(address);
            await loadUserData(address);
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            setWalletAddress(null);
            setUserData(null);
        }
    };

    const handleBuyTokens = async (amount: number) => {
        if (!walletAddress || !presaleData) return;

        setTransactionStatus(TransactionStatus.PENDING);
        setModalMessage('Processando sua transação...');
        setIsModalOpen(true);

        try {
            await buyTokens(walletAddress, amount);
            setTransactionStatus(TransactionStatus.SUCCESS);
            setModalMessage('Compra realizada com sucesso! Seus dados serão atualizados em breve.');

            // Refresh data after successful purchase
            setTimeout(() => {
                loadPresaleData();
                loadUserData(walletAddress);
            }, 1000);

        } catch (error) {
            setTransactionStatus(TransactionStatus.ERROR);
            setModalMessage(error instanceof Error ? error.message : 'Ocorreu um erro na transação.');
        } finally {
            setTimeout(() => {
                setIsModalOpen(false);
                setTransactionStatus(TransactionStatus.IDLE);
            }, 3000);
        }
    };

    const handleCreatorDataChange = (newConfig: PresaleData) => {
        // Update local state for immediate UI feedback
        setPresaleData(newConfig);
        // Update the mock "backend" so changes persist across actions
        updatePresaleData(newConfig);
    };
    
    const renderModalContent = () => {
        switch (transactionStatus) {
            case TransactionStatus.PENDING:
                return (
                    <div className="flex flex-col items-center gap-4">
                        <PendingIcon />
                        <h3 className="text-xl font-bold text-white">Transação Pendente</h3>
                        <p className="text-slate-300">{modalMessage}</p>
                    </div>
                );
            case TransactionStatus.SUCCESS:
                return (
                    <div className="flex flex-col items-center gap-4">
                        <SuccessIcon />
                        <h3 className="text-xl font-bold text-emerald-400">Sucesso!</h3>
                        <p className="text-slate-300">{modalMessage}</p>
                    </div>
                );
            case TransactionStatus.ERROR:
                 return (
                    <div className="flex flex-col items-center gap-4">
                        <ErrorIcon />
                        <h3 className="text-xl font-bold text-red-500">Erro na Transação</h3>
                        <p className="text-slate-300">{modalMessage}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen text-white antialiased aurora-background overflow-x-hidden">
            <div className="relative container mx-auto px-4 py-8 flex flex-col items-center gap-12">
                <Header 
                    walletAddress={walletAddress} 
                    onConnect={handleConnectWallet}
                    tokenName={presaleData?.tokenName}
                    onToggleCreatorMode={() => setIsCreatorModeOpen(!isCreatorModeOpen)}
                />

                <main className="w-full max-w-2xl flex flex-col gap-8 transition-all duration-300 ease-in-out">
                    {presaleData ? (
                        <PresaleCard 
                            data={presaleData} 
                            onBuy={handleBuyTokens} 
                            isConnected={!!walletAddress} 
                            onConnectRequest={handleConnectWallet}
                        />
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-500"></div>
                        </div>
                    )}

                    {walletAddress && userData && presaleData && (
                        <UserInfo data={userData} tokenSymbol={presaleData.tokenSymbol} />
                    )}
                </main>
                 
                {isCreatorModeOpen && presaleData && (
                   <CreatorPanel 
                        config={presaleData}
                        onConfigChange={handleCreatorDataChange}
                        onClose={() => setIsCreatorModeOpen(false)}
                   />
                )}

                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                   {renderModalContent()}
                </Modal>
            </div>
        </div>
    );
};

export default App;
