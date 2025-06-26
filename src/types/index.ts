export interface Lead {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  niche: string;
  tags: string[];
  status: 'New' | 'Contacted' | 'Responded' | 'Converted' | 'Not Interested';
  city?: string;
}

export interface GeneratedMessages {
  email: string;
  whatsapp: string;
  instagram: string;
}

export type Channel = 'Email' | 'WhatsApp' | 'Instagram DM';

export interface GenerateMessagePayload {
  business_name: string;
  niche: string;
  pain_point: string;
  channel: Channel;
}

export interface SendMessagePayload {
  business_name: string;
  channel: Channel;
  message: string;
  timestamp: string;
}