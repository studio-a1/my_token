export enum SaleStatus {
    UPCOMING = 'Próxima',
    LIVE = 'Ao Vivo',
    ENDED = 'Finalizada',
}

export enum TransactionStatus {
    IDLE = 'idle',
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error',
}

export interface PresaleData {
    tokenName: string;
    tokenSymbol: string;
    status: SaleStatus;
    tokensSold: number;
    totalTokens: number;
    tokenPrice: number; // Price in ETH for 1 project token
    saleEndTime: Date;
    minPurchase: number; // in ETH
    maxPurchase: number; // in ETH
}

export interface UserData {
    address: string;
    isWhitelisted: boolean;
    contribution: number; // in ETH
    tokensOwed: number;
}