
export type Language = 'ar' | 'en' | 'fr' | 'de' | 'it' | 'es' | 'pt' | 'ru';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SawaInfo {
  diamondsPerDollarHost: number;
  diamondsPerDollarAgent: number;
  maxHostProfit: string;
  agentBaseProfit: string;
  agentTopProfit: string;
  topAgencyBonus: string;
}

export interface SawaContentState {
  mainContent: string;
  stats: SawaInfo;
  appIcon: string | null;
  appLink: string | null;
  whatsappNumber: string | null;
}

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}
