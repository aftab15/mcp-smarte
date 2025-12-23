import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ContactCard } from '../components/ContactCard';
import { AccountCard } from '../components/AccountCard';
import { SearchResultsCard } from '../components/SearchResultsCard';
import { InsightsCard } from '../components/InsightsCard';
import { ErrorCard } from '../components/ErrorCard';
import { LoadingCard } from '../components/LoadingCard';
import type { ToolOutput } from './types';
import type {
  ContactInfo,
  AccountInfo,
  SearchResult,
  InsightsData,
} from '../types';

const sampleContact: ContactInfo = {
  conGuid: 'contact-123',
  fullName: 'John Smith',
  email: 'john.smith@techcorp.com',
  phone: '+1 (555) 123-4567',
  directDial: '+1 (555) 987-6543',
  jobTitle: 'VP of Engineering',
  level: 'VP',
  department: 'Engineering',
  linkedInUrl: 'https://linkedin.com/in/johnsmith',
  workLocation: {
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
  },
};

const sampleCompanyInfo: AccountInfo = {
  compGuid: 'company-456',
  companyName: 'TechCorp Inc.',
  website: 'https://techcorp.com',
  industry: 'Technology',
  revenue: '$50M - $100M',
  employeeSize: '500-1000',
};

const sampleAccount: AccountInfo = {
  compGuid: 'company-789',
  companyName: 'Innovation Labs',
  website: 'https://innovationlabs.io',
  industry: 'Software Development',
  revenue: '$100M - $500M',
  revenueRange: '$100M - $500M',
  employeeSize: '1000-5000',
  employeeRange: '1000-5000',
  foundedYear: 2010,
  description: 'Leading provider of enterprise software solutions for digital transformation.',
  linkedInUrl: 'https://linkedin.com/company/innovationlabs',
  phone: '+1 (800) 555-0199',
  headquarters: {
    city: 'Austin',
    state: 'TX',
    country: 'United States',
  },
  technologies: ['React', 'Node.js', 'AWS', 'Kubernetes', 'PostgreSQL', 'Redis', 'GraphQL', 'TypeScript'],
};

const sampleContacts: ContactInfo[] = [
  { fullName: 'Sarah Johnson', jobTitle: 'CTO', email: 'sarah@innovationlabs.io' },
  { fullName: 'Mike Chen', jobTitle: 'Director of Sales', email: 'mike@innovationlabs.io' },
  { fullName: 'Emily Davis', jobTitle: 'Product Manager', email: 'emily@innovationlabs.io' },
];

// Inline critical styles for ChatGPT iframe
const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: transparent; }
  .widget-container { padding: 8px; }
  
  /* Tailwind-like utility classes */
  .bg-white { background-color: #fff; }
  .rounded-xl { border-radius: 0.75rem; }
  .shadow-md { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); }
  .border { border-width: 1px; }
  .border-gray-100 { border-color: #f3f4f6; }
  .overflow-hidden { overflow: hidden; }
  .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  
  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .gap-2 { gap: 0.5rem; }
  .gap-3 { gap: 0.75rem; }
  .gap-4 { gap: 1rem; }
  .p-3 { padding: 0.75rem; }
  .p-4 { padding: 1rem; }
  .px-4 { padding-left: 1rem; padding-right: 1rem; }
  .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
  .mb-1 { margin-bottom: 0.25rem; }
  .mt-3 { margin-top: 0.75rem; }
  .mt-4 { margin-top: 1rem; }
  .pt-3 { padding-top: 0.75rem; }
  
  .text-white { color: #fff; }
  .text-gray-500 { color: #6b7280; }
  .text-gray-600 { color: #4b5563; }
  .text-gray-700 { color: #374151; }
  .text-gray-900 { color: #111827; }
  .text-blue-600 { color: #2563eb; }
  .text-blue-100 { color: #dbeafe; }
  .text-sm { font-size: 0.875rem; }
  .text-xs { font-size: 0.75rem; }
  .text-lg { font-size: 1.125rem; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  
  .w-8 { width: 2rem; }
  .w-10 { width: 2.5rem; }
  .w-12 { width: 3rem; }
  .h-8 { height: 2rem; }
  .h-10 { height: 2.5rem; }
  .h-12 { height: 3rem; }
  .min-w-0 { min-width: 0; }
  .flex-1 { flex: 1 1 0%; }
  
  .rounded-full { border-radius: 9999px; }
  .rounded-lg { border-radius: 0.5rem; }
  
  .bg-gradient-blue { background: linear-gradient(to right, #2563eb, #4f46e5); }
  .bg-gradient-purple { background: linear-gradient(to right, #7c3aed, #9333ea); }
  .bg-gradient-cyan { background: linear-gradient(to right, #0891b2, #0d9488); }
  .bg-gradient-emerald { background: linear-gradient(to right, #059669, #0d9488); }
  .bg-gradient-red { background: linear-gradient(to right, #dc2626, #e11d48); }
  
  .bg-blue-50 { background-color: #eff6ff; }
  .bg-blue-100 { background-color: #dbeafe; }
  .bg-green-50 { background-color: #f0fdf4; }
  .bg-purple-50 { background-color: #faf5ff; }
  .bg-orange-50 { background-color: #fff7ed; }
  .bg-gray-50 { background-color: #f9fafb; }
  .bg-gray-100 { background-color: #f3f4f6; }
  .bg-white-20 { background-color: rgba(255,255,255,0.2); }
  
  .text-blue-600 { color: #2563eb; }
  .text-green-600 { color: #16a34a; }
  .text-purple-600 { color: #9333ea; }
  .text-orange-600 { color: #ea580c; }
  
  .border-t { border-top-width: 1px; }
  .border-gray-100 { border-color: #f3f4f6; }
  
  .grid { display: grid; }
  .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .divide-x > * + * { border-left-width: 1px; border-color: #f3f4f6; }
  .divide-y > * + * { border-top-width: 1px; border-color: #f3f4f6; }
  
  .text-center { text-align: center; }
  .space-y-3 > * + * { margin-top: 0.75rem; }
  
  .cursor-pointer { cursor: pointer; }
  .transition-colors { transition: color 0.15s, background-color 0.15s; }
  .hover\\:bg-gray-50:hover { background-color: #f9fafb; }
  .hover\\:bg-gray-100:hover { background-color: #f3f4f6; }
  
  .inline-flex { display: inline-flex; }
  .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
  .px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
  .py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
  .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
  
  .bg-blue-100 { background-color: #dbeafe; }
  .text-blue-800 { color: #1e40af; }
`;

// Main Widget Component
const SmarteWidget: React.FC = () => {
  const [toolOutput, setToolOutput] = useState<ToolOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get data from ChatGPT's window.openai API
    if (window.openai?.toolOutput) {
      setToolOutput(window.openai.toolOutput as ToolOutput);
      setLoading(false);
    } else {
      // Check for persisted state
      const persisted = window.openai?.getPersistedState?.();
      if (persisted) {
        setToolOutput(persisted);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  const handleAction = (action: string, data: any) => {
    // Trigger server action or send follow-up message
    if (window.openai?.triggerServerAction) {
      window.openai.triggerServerAction(action, data);
    } else if (window.openai?.sendFollowUp) {
      window.openai.sendFollowUp(`User clicked ${action} on ${JSON.stringify(data)}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingCard message="Loading data..." />;
    }

    if (!toolOutput) {
      return <ErrorCard message="No data available" />;
    }

    switch (toolOutput.type) {
      case 'contact_reveal':
        return (
          <ContactCard
            // contact={toolOutput.data.contactInfo as ContactInfo}
            // companyInfo={toolOutput.data.companyInfo as AccountInfo}
            contact={sampleContact}
            companyInfo={sampleCompanyInfo}
            onAction={handleAction}
          />
        );

      case 'account_reveal':
        return (
          <AccountCard
            account={toolOutput.data.accountInfo as AccountInfo}
            contacts={toolOutput.data.contacts as ContactInfo[]}
            onAction={handleAction}
          />
        );

      case 'search_results':
        return (
          <SearchResultsCard
            results={toolOutput.data as SearchResult}
            onContactClick={(contact) => handleAction('viewContact', contact)}
            onAccountClick={(account) => handleAction('viewAccount', account)}
          />
        );

      case 'data_insights':
        return (
          <InsightsCard
            insights={toolOutput.data as InsightsData}
            title="Data Insights"
          />
        );

      case 'error':
        return (
          <ErrorCard
            message={toolOutput.data.message}
            code={toolOutput.data.code}
            onRetry={() => window.openai?.triggerServerAction?.('retry')}
          />
        );

      default:
        return <ErrorCard message="Unknown data type" />;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="widget-container">
        {renderContent()}
      </div>
    </>
  );
};

// Mount the widget
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<SmarteWidget />);
} else {
  // Create root element if it doesn't exist
  const rootEl = document.createElement('div');
  rootEl.id = 'root';
  document.body.appendChild(rootEl);
  ReactDOM.createRoot(rootEl).render(<SmarteWidget />);
}

export default SmarteWidget;
