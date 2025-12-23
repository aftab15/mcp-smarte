import React from 'react';
import {
  Building2,
  Globe,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  Linkedin,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn, formatRevenue, getInitials } from '../lib/utils';
import type { AccountCardProps } from '../types';

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  contacts,
  onAction,
  className,
}) => {
  const [showContacts, setShowContacts] = React.useState(false);

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fade-in hover:shadow-lg transition-all duration-200',
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-xl truncate">
              {account.companyName || 'Unknown Company'}
            </h3>
            {account.industry && (
              <p className="text-purple-100 text-sm">{account.industry}</p>
            )}
          </div>
          <div className="flex gap-2">
            {account.linkedInUrl && (
              <a
                href={account.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            )}
            {account.website && (
              <a
                href={account.website.startsWith('http') ? account.website : `https://${account.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Globe className="w-5 h-5 text-white" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Employees</span>
          </div>
          <p className="font-semibold text-gray-900">
            {account.employeeSize || account.employeeRange || 'N/A'}
          </p>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Revenue</span>
          </div>
          <p className="font-semibold text-gray-900">
            {formatRevenue(account.revenue || account.revenueRange)}
          </p>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Founded</span>
          </div>
          <p className="font-semibold text-gray-900">
            {account.foundedYear || 'N/A'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Description */}
        {account.description && (
          <p className="text-gray-600 text-sm line-clamp-2">{account.description}</p>
        )}

        {/* Location */}
        {account.headquarters && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-gray-700 text-sm">
              {[
                account.headquarters.city,
                account.headquarters.state,
                account.headquarters.country,
              ]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}

        {/* Phone */}
        {account.phone && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-gray-700 text-sm">{account.phone}</span>
          </div>
        )}

        {/* Technologies */}
        {account.technologies && account.technologies.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Technologies</p>
            <div className="flex flex-wrap gap-1.5">
              {account.technologies.slice(0, 6).map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tech}
                </span>
              ))}
              {account.technologies.length > 6 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                  +{account.technologies.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contacts Section */}
        {contacts && contacts.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowContacts(!showContacts)}
              className="flex items-center justify-between w-full text-left"
            >
              <span className="text-sm font-medium text-gray-700">
                {contacts.length} Contact{contacts.length > 1 ? 's' : ''} Available
              </span>
              {showContacts ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {showContacts && (
              <div className="mt-3 space-y-2">
                {contacts.slice(0, 5).map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => onAction?.('viewContact', account)}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-medium">
                      {getInitials(contact.fullName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contact.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{contact.jobTitle}</p>
                    </div>
                  </div>
                ))}
                {contacts.length > 5 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    +{contacts.length - 5} more contacts
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountCard;
