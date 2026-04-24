import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getContractEvents } from '@/lib/contract';

export function useEvents() {
  const query = useQuery({ queryKey: ['events'], queryFn: getContractEvents, refetchInterval: 5000 });
  const events = useMemo(() => (query.data || []).slice().sort((a, b) => b.timestamp - a.timestamp).slice(0, 20), [query.data]);
  return { events, isLoading: query.isLoading, error: query.error, refetch: query.refetch };
}