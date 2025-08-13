import { toast } from 'react-hot-toast';

export const copyToClipboard = async (text: string, successMessage = 'Copied to clipboard!'): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage, {
      duration: 1500,
      position: 'bottom-right',
    });
  } catch (error) {
    console.error('Failed to copy text: ', error);
    toast.error('Failed to copy text', {
      duration: 3000,
      position: 'bottom-right',
    });
  }
};