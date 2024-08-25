import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

function formatTitle(pathname: string): string {
  if (pathname === '/') {
    return 'Home';
  }
  return pathname
    .split('/')
    .filter(Boolean)
    .map((segment) =>
      segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    )
    .join(' - ');
}

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.MODE === 'production') {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname + location.search,
        title: formatTitle(location.pathname),
      });
    }
  }, [location]);
};

export function TrackGoogleAnalyticsEvent(
  category: string,
  eventName: string,
  label: string,
  data: Record<string, number | string | boolean>
) {
  const eventParams = {
    category,
    label,
    ...data,
  };
  if (import.meta.env.MODE === 'production') {
    ReactGA.event(eventName, eventParams);
  }
}
