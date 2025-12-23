import * as fs from 'fs';
import * as path from 'path';

/**
 * ChatGPT Widget Helper
 * 
 * This utility helps embed the React UI widget in MCP server responses
 * so that ChatGPT can render custom UI inline with the conversation.
 */

// Tool output types
export type ToolOutputType = 
  | 'contact_reveal'
  | 'account_reveal'
  | 'search_results'
  | 'data_insights'
  | 'error';

export interface ToolOutput {
  type: ToolOutputType;
  data: any;
}

/**
 * Get the bundled widget JavaScript
 * Run `npm run build:chatgpt` in src/ui first to generate the bundle
 */
export function getWidgetBundle(): string {
  const bundlePath = path.join(__dirname, '../ui/dist/chatgpt-widget.js');
  
  try {
    return fs.readFileSync(bundlePath, 'utf-8');
  } catch (error) {
    console.error('Widget bundle not found. Run: cd src/ui && npm run build:chatgpt');
    return '';
  }
}

/**
 * Create an HTML template for the ChatGPT widget iframe
 */
export function createWidgetHtml(toolOutput: ToolOutput): string {
  const widgetBundle = getWidgetBundle();
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SmarteAI Widget</title>
</head>
<body>
  <div id="root"></div>
  <script>
    // Inject tool output into window.openai
    window.openai = window.openai || {};
    window.openai.toolOutput = ${JSON.stringify(toolOutput)};
  </script>
  <script type="module">
    ${widgetBundle}
  </script>
</body>
</html>
  `.trim();
}

/**
 * Format MCP response with embedded widget for ChatGPT
 * 
 * Usage in your MCP tool handler:
 * ```
 * return formatWithWidget({
 *   type: 'contact_reveal',
 *   data: { contactInfo, companyInfo }
 * });
 * ```
 */
export function formatWithWidget(toolOutput: ToolOutput): {
  content: Array<{ type: string; text?: string; html?: string }>;
} {
  const html = createWidgetHtml(toolOutput);
  
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(toolOutput.data, null, 2),
      },
      {
        type: 'resource',
        html: html,
      },
    ],
  };
}

/**
 * Create a contact reveal widget response
 */
export function createContactRevealWidget(contactInfo: any, companyInfo?: any) {
  return formatWithWidget({
    type: 'contact_reveal',
    data: { contactInfo, companyInfo },
  });
}

/**
 * Create an account reveal widget response
 */
export function createAccountRevealWidget(accountInfo: any, contacts?: any[]) {
  return formatWithWidget({
    type: 'account_reveal',
    data: { accountInfo, contacts },
  });
}

/**
 * Create a search results widget response
 */
export function createSearchResultsWidget(results: {
  contacts?: any[];
  accounts?: any[];
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
}) {
  return formatWithWidget({
    type: 'search_results',
    data: results,
  });
}

/**
 * Create a data insights widget response
 */
export function createInsightsWidget(insights: {
  totalRecords: number;
  aggregationType: string;
  breakdown: Array<{ category: string; count: number; percentage?: number }>;
}) {
  return formatWithWidget({
    type: 'data_insights',
    data: insights,
  });
}

/**
 * Create an error widget response
 */
export function createErrorWidget(message: string, code?: string | number) {
  return formatWithWidget({
    type: 'error',
    data: { message, code },
  });
}
