import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';
import {
  ContactCard,
  AccountCard,
  SearchResultsCard,
  InsightsCard,
  ErrorCard,
  LoadingCard,
} from './components';
import type { ContactInfo, AccountInfo, SearchResult, InsightsData } from './types';

// Sample Data for Demo
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

const sampleSearchResults: SearchResult = {
  contacts: [
    { conGuid: '1', fullName: 'Alice Brown', jobTitle: 'CEO', email: 'alice@company1.com' },
    { conGuid: '2', fullName: 'Bob Wilson', jobTitle: 'CFO', email: 'bob@company2.com' },
    { conGuid: '3', fullName: 'Carol Martinez', jobTitle: 'CMO', email: 'carol@company3.com' },
  ],
  accounts: [
    { compGuid: 'a1', companyName: 'Alpha Corp', industry: 'Finance', employeeSize: '100-500' },
    { compGuid: 'a2', companyName: 'Beta Industries', industry: 'Manufacturing', employeeSize: '500-1000' },
  ],
  totalCount: 1250,
  pageSize: 10,
  currentPage: 1,
};

const sampleInsights: InsightsData = {
  totalRecords: 15420,
  aggregationType: 'Industry',
  breakdown: [
    { category: 'Technology', count: 4520, percentage: 29.3 },
    { category: 'Finance', count: 3210, percentage: 20.8 },
    { category: 'Healthcare', count: 2890, percentage: 18.7 },
    { category: 'Manufacturing', count: 1950, percentage: 12.6 },
    { category: 'Retail', count: 1420, percentage: 9.2 },
    { category: 'Education', count: 890, percentage: 5.8 },
    { category: 'Other', count: 540, percentage: 3.5 },
  ],
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SmarteAI MCP UI Components
          </h1>
          <p className="text-gray-600 text-lg">
            Beautiful React components for ChatGPT app integration
          </p>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Card */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Card</h2>
            <ContactCard
              contact={sampleContact}
              companyInfo={sampleCompanyInfo}
              onAction={(action, contact) => console.log('Action:', action, contact)}
            />
          </div>

          {/* Account Card */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Card</h2>
            <AccountCard
              account={sampleAccount}
              contacts={sampleContacts}
              onAction={(action, account) => console.log('Action:', action, account)}
            />
          </div>

          {/* Search Results Card */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Results Card</h2>
            <SearchResultsCard
              results={sampleSearchResults}
              onContactClick={(contact) => console.log('Contact clicked:', contact)}
              onAccountClick={(account) => console.log('Account clicked:', account)}
            />
          </div>

          {/* Insights Card */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Insights Card</h2>
            <InsightsCard
              insights={sampleInsights}
              title="Industry Distribution"
            />
          </div>

          {/* Error Card */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Error Card</h2>
            <ErrorCard
              message="Unable to fetch contact data. The server returned an authentication error."
              code={401}
              onRetry={() => console.log('Retry clicked')}
            />
          </div>

          {/* Loading Card */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Loading Card</h2>
            <LoadingCard message="Fetching contact information..." />
          </div>
        </div>
      </div>
    </div>
  );
};

// Mount the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
