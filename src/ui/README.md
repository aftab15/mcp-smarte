# SmarteAI MCP UI Components

Beautiful React UI card components for displaying MCP server responses **inside ChatGPT**.

## 🎯 ChatGPT Integration

This library uses OpenAI's Apps SDK to render custom UI components directly inside ChatGPT conversations via iframe.

### How It Works

1. Your MCP server returns tool results with embedded HTML/JS widget
2. ChatGPT renders the widget in an iframe inline with the conversation
3. Users see beautiful UI cards instead of raw JSON

### Quick Start for ChatGPT

```bash
# 1. Build the ChatGPT widget bundle
cd src/ui
npm install
npm run build:chatgpt

# 2. Use the helper in your MCP server tools
```

```typescript
// In your MCP tool handler
import { createContactRevealWidget } from "../utils/chatgptWidget";

// Return widget response
return createContactRevealWidget(contactInfo, companyInfo);
```

## Features

- **ContactCard** - Display contact information with copy functionality
- **AccountCard** - Display company/account details with expandable contacts
- **SearchResultsCard** - Display search results with tabs for contacts/accounts
- **InsightsCard** - Display data insights with visual bar charts
- **ErrorCard** - Display error messages with retry functionality
- **LoadingCard** - Display loading state with skeleton preview

## Installation

```bash
cd src/ui
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Usage in ChatGPT App

### Import Components

```tsx
import {
  ContactCard,
  AccountCard,
  SearchResultsCard,
  InsightsCard,
  ErrorCard,
  LoadingCard,
} from "./components";
```

### ContactCard

```tsx
<ContactCard
  contact={{
    fullName: "John Smith",
    email: "john@company.com",
    phone: "+1 555-123-4567",
    jobTitle: "VP of Engineering",
    department: "Engineering",
    linkedInUrl: "https://linkedin.com/in/johnsmith",
    workLocation: {
      city: "San Francisco",
      state: "CA",
      country: "United States",
    },
  }}
  companyInfo={{
    companyName: "TechCorp Inc.",
    website: "https://techcorp.com",
    industry: "Technology",
  }}
  onAction={(action, contact) => console.log(action, contact)}
/>
```

### AccountCard

```tsx
<AccountCard
  account={{
    companyName: "Innovation Labs",
    website: "https://innovationlabs.io",
    industry: "Software Development",
    revenue: "$100M - $500M",
    employeeSize: "1000-5000",
    foundedYear: 2010,
    description: "Leading provider of enterprise software solutions.",
    headquarters: {
      city: "Austin",
      state: "TX",
      country: "United States",
    },
    technologies: ["React", "Node.js", "AWS"],
  }}
  contacts={[
    { fullName: "Sarah Johnson", jobTitle: "CTO" },
    { fullName: "Mike Chen", jobTitle: "Director of Sales" },
  ]}
  onAction={(action, account) => console.log(action, account)}
/>
```

### SearchResultsCard

```tsx
<SearchResultsCard
  results={{
    contacts: [
      { fullName: "Alice Brown", jobTitle: "CEO", email: "alice@company.com" },
    ],
    accounts: [{ companyName: "Alpha Corp", industry: "Finance" }],
    totalCount: 1250,
    pageSize: 10,
    currentPage: 1,
  }}
  onContactClick={(contact) => console.log("Contact:", contact)}
  onAccountClick={(account) => console.log("Account:", account)}
/>
```

### InsightsCard

```tsx
<InsightsCard
  insights={{
    totalRecords: 15420,
    aggregationType: "Industry",
    breakdown: [
      { category: "Technology", count: 4520, percentage: 29.3 },
      { category: "Finance", count: 3210, percentage: 20.8 },
    ],
  }}
  title="Industry Distribution"
/>
```

### ErrorCard

```tsx
<ErrorCard
  message="Unable to fetch data"
  code={401}
  onRetry={() => refetch()}
/>
```

### LoadingCard

```tsx
<LoadingCard message="Fetching contact information..." />
```

## Styling

Components use Tailwind CSS for styling. Import the global styles in your app:

```tsx
import "./styles/globals.css";
```

## Types

All TypeScript types are exported from the package:

```tsx
import type {
  ContactInfo,
  AccountInfo,
  SearchResult,
  InsightsData,
  ContactCardProps,
  AccountCardProps,
  // ... etc
} from "./types";
```

## License

MIT
