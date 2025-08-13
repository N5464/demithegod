import { GenerateMessagePayload, GeneratedMessages, SendMessagePayload } from '../types';

const GENERATE_WEBHOOK_URL = 'https://hook.eu2.make.com/tmaz8ba29iwwlyrvakktj72suni586mf';
const STATUS_WEBHOOK_URL = 'https://hook.eu2.make.com/ms7w3q4wihfhjfjl5p6fm714vf9d5ppg';
const EMAIL_WEBHOOK_URL = 'https://hook.eu2.make.com/c55nf7i8uv9gs5cgeoaus5gjkz271rjf';

export const generateMessages = async (payload: GenerateMessagePayload): Promise<GeneratedMessages> => {
  try {
    const response = await fetch(GENERATE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_name: payload.business_name,
        niche: payload.niche,
        pain_point: payload.pain_point,
        channel: payload.channel
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }

    const text = await response.text();
    
    // Extract JSON from markdown-formatted response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from webhook');
    }
    
    const data = JSON.parse(jsonMatch[1]);
    
    if (!data.email_output || !data.whatsapp_output || !data.insta_output) {
      throw new Error('Missing required fields in webhook response');
    }
    
    return {
      email: data.email_output,
      whatsapp: data.whatsapp_output,
      instagram: data.insta_output
    };
  } catch (error) {
    console.error('Error calling generate webhook:', error);
    throw new Error('AI message generation failed – try again.');
  }
};

export const logOutreach = async (payload: SendMessagePayload): Promise<void> => {
  const response = await fetch(STATUS_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      status: 'Contacted'
    }),
  });

  if (!response.ok) {
    throw new Error(`Status webhook request failed with status ${response.status}`);
  }
};

interface EmailPayload {
  business_name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (payload: EmailPayload): Promise<void> => {
  if (!payload.message) {
    throw new Error('Email message is required');
  }

  const response = await fetch(EMAIL_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      business_name: payload.business_name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message
    }),
  });

  if (!response.ok) {
    throw new Error(`Email webhook request failed with status ${response.status}`);
  }
}