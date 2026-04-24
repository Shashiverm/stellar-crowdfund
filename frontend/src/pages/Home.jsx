import { useCampaign } from '@/hooks/useCampaign';
import { useEvents } from '@/hooks/useEvents';
import CampaignHero from '@/components/campaign/CampaignHero';
import StatsGrid from '@/components/campaign/StatsGrid';
import DonorFeed from '@/components/campaign/DonorFeed';

export default function Home() {
  const { campaign } = useCampaign();
  const { events } = useEvents();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
      <div className="space-y-6">
        <CampaignHero campaign={campaign} />
        <StatsGrid campaign={campaign} />
      </div>
      <DonorFeed events={events} />
    </div>
  );
}