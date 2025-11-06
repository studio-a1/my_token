import { SaleStatus, PresaleData, UserData } from '../types';

// --- Mock Database ---
// Simula um banco de dados simples em memória para o estado da pré-venda e os dados do usuário.
// Em um aplicativo real, isso seria substituído por chamadas para um contrato inteligente ou um backend.
let mockPresaleData: PresaleData = {
    tokenName: 'Aurora',
    tokenSymbol: 'AUR',
    status: SaleStatus.LIVE,
    tokensSold: 65_000_000,
    totalTokens: 100_000_000,
    tokenPrice: 0.005, // ETH
    saleEndTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 dias a partir de agora
    minPurchase: 0.1,
    maxPurchase: 5
};

// Armazena os dados dos usuários que se conectam, usando o endereço da carteira como chave.
const mockUserDatabase: { [address: string]: UserData } = {};
// ---------------------

// Simula a latência da rede para tornar a experiência mais realista.
const SIMULATED_DELAY = 800; // ms

/**
 * Simula a busca dos dados principais da pré-venda.
 * Também verifica se o tempo de venda expirou para atualizar o status.
 */
export const fetchPresaleData = (): Promise<PresaleData> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Lógica para simular o fim da venda com base no tempo atual.
            if (mockPresaleData.saleEndTime.getTime() < Date.now()) {
                mockPresaleData.status = SaleStatus.ENDED;
            }
            // Retorna uma cópia dos dados para evitar mutações diretas do estado.
            resolve({ ...mockPresaleData });
        }, SIMULATED_DELAY);
    });
};

/**
 * Permite que o 'Modo Criador' atualize o estado da simulação no "backend".
 * Isso possibilita a visualização em tempo real das alterações de configuração.
 */
export const updatePresaleData = (newConfig: PresaleData): Promise<PresaleData> => {
    return new Promise(resolve => {
        mockPresaleData = { ...mockPresaleData, ...newConfig };
        resolve({ ...mockPresaleData });
    });
};

/**
 * Simula o processo de conexão com a carteira de um usuário, gerando um endereço aleatório.
 */
export const connectWallet = (): Promise<string> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const mockAddress = `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
            resolve(mockAddress);
        }, SIMULATED_DELAY / 2);
    });
};

/**
 * Simula a busca de dados de um usuário específico.
 * Se o usuário não existir no nosso "banco de dados", um novo perfil é criado na hora.
 */
export const fetchUserData = (address: string): Promise<UserData> => {
    return new Promise(resolve => {
        setTimeout(() => {
            // Cria um novo usuário com dados aleatórios se for a primeira vez que se conecta.
            if (!mockUserDatabase[address]) {
                mockUserDatabase[address] = {
                    address: address,
                    isWhitelisted: Math.random() > 0.2, // 80% de chance de estar na whitelist
                    contribution: 0,
                    tokensOwed: 0,
                };
            }
            // Retorna uma cópia dos dados do usuário.
            resolve({ ...mockUserDatabase[address] });
        }, SIMULATED_DELAY);
    });
};

/**
 * Simula a lógica de compra de tokens, incluindo várias validações.
 */
export const buyTokens = (address: string, amount: number): Promise<{ success: boolean }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = mockUserDatabase[address];

            // --- Validações ---
            if (!user) {
                return reject(new Error("Usuário não encontrado. Conecte a carteira primeiro."));
            }
            if (!user.isWhitelisted) {
                return reject(new Error("Seu endereço não está na whitelist para esta pré-venda."));
            }
            if (mockPresaleData.status !== SaleStatus.LIVE) {
                return reject(new Error("A pré-venda não está ativa."));
            }
            if (amount < mockPresaleData.minPurchase) {
                return reject(new Error(`A compra mínima é de ${mockPresaleData.minPurchase} ETH.`));
            }
            if ((user.contribution + amount) > mockPresaleData.maxPurchase) {
                 return reject(new Error(`Sua contribuição total não pode exceder ${mockPresaleData.maxPurchase} ETH.`));
            }
            
            const tokensBought = amount / mockPresaleData.tokenPrice;
            if ((mockPresaleData.tokensSold + tokensBought) > mockPresaleData.totalTokens) {
                 return reject(new Error("Não há tokens suficientes para completar esta compra."));
            }

            // --- Atualização de Estado (se todas as validações passarem) ---
            // Atualiza os dados do usuário.
            user.contribution += amount;
            user.tokensOwed += tokensBought;
            
            // Atualiza os dados da pré-venda de forma imutável para garantir consistência.
            mockPresaleData = {
                ...mockPresaleData,
                tokensSold: mockPresaleData.tokensSold + tokensBought
            };

            resolve({ success: true });

        }, SIMULATED_DELAY * 2);
    });
};
