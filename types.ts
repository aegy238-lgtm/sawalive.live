
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
  appIcon: string | null; // Base64 string for the app icon
  appLink: string | null; // URL for the application
  whatsappNumber: string | null; // WhatsApp contact number
}
