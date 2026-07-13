import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppTabs from '@/components/app-tabs';
import { AnimatedSplashOverlay } from '@/components/animated-icon';

const queryClient = new QueryClient()

export default function TabLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </QueryClientProvider>
  );
}
