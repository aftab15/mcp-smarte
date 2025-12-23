// Contact Types
export interface ContactInfo {
  conGuid?: string;
  compGuid?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  directDial?: string;
  jobTitle?: string;
  level?: string;
  department?: string;
  linkedInUrl?: string;
  workLocation?: LocationInfo;
}

// Company/Account Types
export interface AccountInfo {
  compGuid?: string;
  companyName?: string;
  website?: string;
  industry?: string;
  revenue?: string;
  revenueRange?: string;
  employeeSize?: string;
  employeeRange?: string;
  headquarters?: LocationInfo;
  foundedYear?: number;
  description?: string;
  linkedInUrl?: string;
  phone?: string;
  technologies?: string[];
}

// Location Types
export interface LocationInfo {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  region?: string;
}

// Search Result Types
export interface SearchResult {
  contacts?: ContactInfo[];
  accounts?: AccountInfo[];
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
}

// Data Insights Types
export interface DataInsight {
  category: string;
  count: number;
  percentage?: number;
}

export interface InsightsData {
  totalRecords: number;
  breakdown: DataInsight[];
  aggregationType: string;
}

// Reveal Response Types
export interface ContactRevealData {
  conGuid: string;
  compGuid: string;
  contactInfo?: ContactInfo;
  companyInfo?: AccountInfo;
}

export interface AccountRevealData {
  compGuid: string;
  accountInfo?: AccountInfo;
  contacts?: ContactInfo[];
}

// Card Props Types
export interface ContactCardProps {
  contact: ContactInfo;
  companyInfo?: AccountInfo;
  onAction?: (action: string, contact: ContactInfo) => void;
  className?: string;
}

export interface AccountCardProps {
  account: AccountInfo;
  contacts?: ContactInfo[];
  onAction?: (action: string, account: AccountInfo) => void;
  className?: string;
}

export interface SearchResultsCardProps {
  results: SearchResult;
  onContactClick?: (contact: ContactInfo) => void;
  onAccountClick?: (account: AccountInfo) => void;
  className?: string;
}

export interface InsightsCardProps {
  insights: InsightsData;
  title?: string;
  className?: string;
}

export interface ErrorCardProps {
  message: string;
  code?: string | number;
  onRetry?: () => void;
  className?: string;
}

export interface LoadingCardProps {
  message?: string;
  className?: string;
}
