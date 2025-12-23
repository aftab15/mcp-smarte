import React from 'react';
import {
  Search,
  Users,
  Building2,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { cn, getInitials } from '../lib/utils';
import type { SearchResultsCardProps, ContactInfo, AccountInfo } from '../types';

export const SearchResultsCard: React.FC<SearchResultsCardProps> = ({
  results,
  onContactClick,
  onAccountClick,
  className,
}) => {
  const [activeTab, setActiveTab] = React.useState<'contacts' | 'accounts'>(
    results.contacts && results.contacts.length > 0 ? 'contacts' : 'accounts'
  );

  const hasContacts = results.contacts && results.contacts.length > 0;
  const hasAccounts = results.accounts && results.accounts.length > 0;

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fade-in',
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg">Search Results</h3>
            <p className="text-cyan-100 text-sm">
              {results.totalCount?.toLocaleString() || 0} total results found
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {(hasContacts || hasAccounts) && (
        <div className="flex border-b border-gray-100">
          {hasContacts && (
            <button
              onClick={() => setActiveTab('contacts')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === 'contacts'
                  ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <Users className="w-4 h-4" />
              Contacts ({results.contacts?.length || 0})
            </button>
          )}
          {hasAccounts && (
            <button
              onClick={() => setActiveTab('accounts')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === 'accounts'
                  ? 'text-cyan-600 border-b-2 border-cyan-600 bg-cyan-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <Building2 className="w-4 h-4" />
              Accounts ({results.accounts?.length || 0})
            </button>
          )}
        </div>
      )}

      {/* Results List */}
      <div className="max-h-96 overflow-y-auto">
        {activeTab === 'contacts' && hasContacts && (
          <div className="divide-y divide-gray-50">
            {results.contacts!.map((contact, index) => (
              <ContactResultItem
                key={contact.conGuid || index}
                contact={contact}
                onClick={() => onContactClick?.(contact)}
              />
            ))}
          </div>
        )}

        {activeTab === 'accounts' && hasAccounts && (
          <div className="divide-y divide-gray-50">
            {results.accounts!.map((account, index) => (
              <AccountResultItem
                key={account.compGuid || index}
                account={account}
                onClick={() => onAccountClick?.(account)}
              />
            ))}
          </div>
        )}

        {!hasContacts && !hasAccounts && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No results found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      {results.totalCount && results.pageSize && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Showing {Math.min(results.pageSize, results.totalCount)} of{' '}
            {results.totalCount.toLocaleString()} results
            {results.currentPage && ` • Page ${results.currentPage}`}
          </p>
        </div>
      )}
    </div>
  );
};

// Contact Result Item Component
const ContactResultItem: React.FC<{
  contact: ContactInfo;
  onClick?: () => void;
}> = ({ contact, onClick }) => {
  const fullName = contact.fullName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim();

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
        {getInitials(fullName)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{fullName || 'Unknown'}</p>
        <p className="text-sm text-gray-500 truncate">{contact.jobTitle || 'No title'}</p>
      </div>
      {contact.email && (
        <span className="hidden sm:inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 truncate max-w-[150px]">
          {contact.email}
        </span>
      )}
      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
    </div>
  );
};

// Account Result Item Component
const AccountResultItem: React.FC<{
  account: AccountInfo;
  onClick?: () => void;
}> = ({ account, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
        <Building2 className="w-5 h-5 text-purple-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">
          {account.companyName || 'Unknown Company'}
        </p>
        <p className="text-sm text-gray-500 truncate">{account.industry || 'No industry'}</p>
      </div>
      {account.employeeSize && (
        <span className="hidden sm:inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
          {account.employeeSize} employees
        </span>
      )}
      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
    </div>
  );
};

export default SearchResultsCard;
