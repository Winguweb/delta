import crypto from 'crypto';

export const generateApiKey = () => {
  return crypto.randomBytes(16).toString('hex');
};
