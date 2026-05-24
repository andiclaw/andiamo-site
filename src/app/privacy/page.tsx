import { LegalPage } from '@/components/legal-page';
import { PRIVACY } from '@/lib/legal-docs';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyRoute() {
  return <LegalPage doc={PRIVACY} />;
}
