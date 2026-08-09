import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { donateToCampaign } from '@/lib/contract';
import { classifyError } from '@/lib/errors';

const initialState = { status: 'idle', hash: '', errorType: '', message: '' };

export function useDonate(wallet) {
  const [state, setState] = useState(initialState);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (state.status !== 'success') return undefined;
    const timeout = window.setTimeout(() => setState(initialState), 10000);
    return () => window.clearTimeout(timeout);
  }, [state.status]);

  const submit = async (amount) => {
    try {
      setState({ status: 'pending', hash: '', errorType: '', message: '' });
      const result = await donateToCampaign({ publicKey: wallet.publicKey, amount, signTransaction: wallet.signTransaction });
      setState({ status: 'confirming', hash: result?.hash || '', errorType: '', message: '' });
      await queryClient.invalidateQueries({ queryKey: ['campaign'] });
      await queryClient.invalidateQueries({ queryKey: ['events'] });
      setState({ status: 'success', hash: result?.hash || `tx-${Date.now()}`, errorType: '', message: '' });
      toast.success('Donation transmitted to the mission ledger.');
      return result;
    } catch (cause) {
      const errorType = classifyError(cause);
      const message = cause instanceof Error ? cause.message : String(cause);
      setState({ status: 'error', hash: '', errorType, message });
      toast.error(message || 'Donation failed.');
      return null;
    }
  };

  return { state, submit, setState };
}