import { useQuery } from '@tanstack/react-query';
import { getCampaign } from '@/lib/contract';

export function useCampaign() {
  const query = useQuery({ queryKey: ['campaign'], queryFn: getCampaign, refetchInterval: 5000 });
  return { campaign: query.data, isLoading: query.isLoading, error: query.error, refetch: query.refetch };
}