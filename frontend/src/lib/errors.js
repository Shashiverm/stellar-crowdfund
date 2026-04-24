export const ErrorType = {
  WALLET_NOT_FOUND: 'WALLET_NOT_FOUND',
  USER_REJECTED: 'USER_REJECTED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  UNKNOWN: 'UNKNOWN',
};

export function classifyError(error) {
  const message = String(error?.message || error || '');
  const code = String(error?.code || '');
  if (/wallet|extension|provider/i.test(message) || code === 'wallet_not_found') return ErrorType.WALLET_NOT_FOUND;
  if (/reject|denied|cancel/i.test(message) || code === 'user_rejected') return ErrorType.USER_REJECTED;
  if (/balance|funds|underfund/i.test(message) || code === 'insufficient_balance') return ErrorType.INSUFFICIENT_BALANCE;
  return ErrorType.UNKNOWN;
}