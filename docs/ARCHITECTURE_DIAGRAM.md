# Advanced Search Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         MCP Server                               │
│                    (advancedSearch.ts)                           │
│                                                                   │
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │ advanced_search│  │advanced_search   │  │  data_insights  │ │
│  │     tool       │  │   _count tool    │  │      tool       │ │
│  └───────┬────────┘  └────────┬─────────┘  └────────┬────────┘ │
│          │                    │                      │          │
│          └────────────────────┼──────────────────────┘          │
│                               │                                  │
└───────────────────────────────┼──────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AdvancedSearchService                          │
│                  (Service Layer - Static Class)                  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Payload Building Methods                        ││
│  │  • buildAdvancedSearchPayload()                              ││
│  │  • buildDataInsightsPayload()                                ││
│  │    ├─ categorizeSearchFields()                               ││
│  │    └─ removeEmptyValues()                                    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              API Execution Methods                           ││
│  │  • executeAdvancedSearch()                                   ││
│  │  • executeAdvancedSearchCount()                              ││
│  │  • executeDataInsights()                                     ││
│  └─────────────────────────────────────────────────────────────┘│
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     HTTP Service Layer                           │
│                      (http.ts)                                   │
│                  makePOSTRequest()                               │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     External API                                 │
│  • /search/v4/advanced-search                                    │
│  • /search/v4/advanced-search-count                              │
│  • /search/v4/data-insights                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Data Insights Request

```
User Request
     │
     ▼
┌─────────────────────────────────────────────┐
│  MCP Tool: data_insights                    │
│  Receives: params with all filters          │
│  • search_type                              │
│  • aggregation_levels                       │
│  • size                                     │
│  • ...all search fields                     │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  AdvancedSearchService                      │
│  .buildDataInsightsPayload()                │
│                                             │
│  Step 1: categorizeSearchFields()           │
│  ┌───────────────────────────────────────┐ │
│  │ Raw Fields → Categorized Fields       │ │
│  │                                       │ │
│  │ Contact Fields → person_info         │ │
│  │ • search_text, level, department...  │ │
│  │                                       │ │
│  │ Company Fields → company_info         │ │
│  │ • comp_guid, industry, revenue...     │ │
│  │                                       │ │
│  │ Funding Fields → funding              │ │
│  │ • lastFundingDate, totalFunding...    │ │
│  │                                       │ │
│  │ Workflow Fields → work_flow           │ │
│  │ • persona, leadList, accountList...   │ │
│  │                                       │ │
│  │ Misc Fields → miscellaneous           │ │
│  │ • dataGrade, exclusions...            │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  Step 2: removeEmptyValues()                │
│  • Filters out undefined/null              │
│  • Removes empty arrays                     │
│  • Removes empty objects                    │
│                                             │
│  Step 3: Validate with Zod Schema           │
│  • DataInsightRequestSchema.parse()         │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Final Payload Structure                    │
│  {                                          │
│    data: {                                  │
│      aggregation_levels: {...},            │
│      search_text: "...",                    │
│      company_info: {...},                   │
│      person_info: {...},                    │
│      funding: {...},                        │
│      work_flow: {...},                      │
│      miscellaneous: {...},                  │
│      salesforce: null                       │
│    },                                       │
│    type: "ADVANCED_SEARCH_LEAD",           │
│    pagination: {                            │
│      page_size: 25,                         │
│      page_no: 1                             │
│    }                                        │
│  }                                          │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  AdvancedSearchService                      │
│  .executeDataInsights()                     │
│  • Logs request body                        │
│  • Calls makePOSTRequest()                  │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  API Response                               │
│  Returns to MCP Tool                        │
└─────────────────────────────────────────────┘
```

## Key Design Principles Applied

### 1. **Single Responsibility Principle (SRP)**
- `AdvancedSearchService`: Handles payload construction and API calls
- `advancedSearch.ts`: Only handles tool registration and input/output

### 2. **DRY (Don't Repeat Yourself)**
- Common logic centralized in service class
- Field categorization logic reused across methods

### 3. **Separation of Concerns**
- Tool layer handles MCP server integration
- Service layer handles business logic
- HTTP layer handles network communication

### 4. **Type Safety**
- TypeScript interfaces for all parameters
- Zod schemas for runtime validation
- Type inference for better IDE support

### 5. **Error Handling**
- Try-catch blocks in all tool handlers
- Descriptive error messages
- Proper error propagation

### 6. **Maintainability**
- Clear method names
- Comprehensive documentation
- Logical code organization
- Easy to extend and modify
