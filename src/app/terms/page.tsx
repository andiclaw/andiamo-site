import { LegalPage } from '@/components/legal-page';
import { TERMS } from '@/lib/legal-docs';

export const metadata = { title: 'Terms of Use' };

export default function TermsRoute() {
  return <LegalPage doc={TERMS} />;
}
