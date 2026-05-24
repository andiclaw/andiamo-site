import { LegalPage } from '@/components/legal-page';
import { COOKIES } from '@/lib/legal-docs';

export const metadata = { title: 'Cookie Policy' };

export default function CookiesRoute() {
  return <LegalPage doc={COOKIES} />;
}
