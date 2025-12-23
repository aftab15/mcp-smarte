import React from 'react';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  MapPin,
  Linkedin,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { cn, getInitials, truncateText } from '../lib/utils';
import type { ContactCardProps } from '../types';

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  companyInfo,
  onAction,
  className,
}) => {
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    onAction?.('copy', contact);
  };

  const fullName = contact.fullName || `${contact.firstName || ''} ${contact.lastName || ''}`.trim();

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fade-in hover:shadow-lg transition-all duration-200',
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-semibold text-lg">
            {getInitials(fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-lg truncate">
              {fullName || 'Unknown Contact'}
            </h3>
            {contact.jobTitle && (
              <p className="text-blue-100 text-sm truncate">{contact.jobTitle}</p>
            )}
          </div>
          {contact.linkedInUrl && (
            <a
              href={contact.linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Linkedin className="w-5 h-5 text-white" />
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Contact Details */}
        {contact.email && (
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <span className="flex-1 text-gray-700 text-sm truncate">{contact.email}</span>
            <button
              onClick={() => handleCopy(contact.email!, 'email')}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-gray-100 transition-all"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}

        {(contact.phone || contact.directDial || contact.mobile) && (
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <span className="flex-1 text-gray-700 text-sm">
              {contact.directDial || contact.phone || contact.mobile}
            </span>
            <button
              onClick={() => handleCopy(contact.directDial || contact.phone || contact.mobile!, 'phone')}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-gray-100 transition-all"
            >
              <Copy className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}

        {contact.department && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-gray-700 text-sm">{contact.department}</span>
          </div>
        )}

        {contact.workLocation && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-gray-700 text-sm">
              {[contact.workLocation.city, contact.workLocation.state, contact.workLocation.country]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}

        {/* Company Info */}
        {companyInfo && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-medium text-sm truncate">
                  {companyInfo.companyName}
                </p>
                {companyInfo.industry && (
                  <p className="text-gray-500 text-xs">{companyInfo.industry}</p>
                )}
              </div>
              {companyInfo.website && (
                <a
                  href={companyInfo.website.startsWith('http') ? companyInfo.website : `https://${companyInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {contact.level && (
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {contact.level}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
