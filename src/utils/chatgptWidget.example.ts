/**
 * EXAMPLE: How to use ChatGPT Widget in your MCP tools
 * 
 * This file shows how to modify your existing MCP tool handlers
 * to return UI widgets that render inside ChatGPT.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getForwardedHeaders } from "../context/requestContext";

// Example: Modified contact_reveal tool with widget support
// Copy this pattern to your actual tool files

/*
// In contactReveal.ts, change the return statement from:

return {
  content: [
    { type: "text", text: JSON.stringify(responseData, null, 2) },
  ],
};

// To this (with widget):

return {
  content: [
    { 
      type: "text", 
      text: JSON.stringify(responseData, null, 2) 
    },
    {
      type: "resource",
      resource: {
        uri: "widget://smarte/contact-card",
        mimeType: "text/html",
        text: createContactWidgetHtml(responseData)
      }
    }
  ],
};
*/

/**
 * Create HTML widget for contact reveal
 */
export function createContactWidgetHtml(data: any): string {
  // The widget reads data from window.openai.toolOutput
  const toolOutput = {
    type: 'contact_reveal',
    data: data
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; max-width: 400px; }
    .header { background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 16px; color: white; }
    .header h3 { font-size: 18px; margin-bottom: 4px; }
    .header p { font-size: 14px; opacity: 0.9; }
    .body { padding: 16px; }
    .row { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
    .icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
    .icon-email { background: #dbeafe; color: #2563eb; }
    .icon-phone { background: #dcfce7; color: #16a34a; }
    .icon-company { background: #f3f4f6; color: #4b5563; }
    .label { font-size: 12px; color: #6b7280; }
    .value { font-size: 14px; color: #111827; }
    .copy-btn { margin-left: auto; padding: 4px 8px; border: none; background: #f3f4f6; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .copy-btn:hover { background: #e5e7eb; }
    .badge { display: inline-block; padding: 4px 10px; background: #dbeafe; color: #1e40af; border-radius: 12px; font-size: 12px; font-weight: 500; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h3 id="name">Loading...</h3>
      <p id="title"></p>
    </div>
    <div class="body">
      <div class="row" id="email-row" style="display:none;">
        <div class="icon icon-email">✉</div>
        <div>
          <div class="label">Email</div>
          <div class="value" id="email"></div>
        </div>
        <button class="copy-btn" onclick="copyText('email')">Copy</button>
      </div>
      <div class="row" id="phone-row" style="display:none;">
        <div class="icon icon-phone">📞</div>
        <div>
          <div class="label">Phone</div>
          <div class="value" id="phone"></div>
        </div>
        <button class="copy-btn" onclick="copyText('phone')">Copy</button>
      </div>
      <div class="row" id="company-row" style="display:none;">
        <div class="icon icon-company">🏢</div>
        <div>
          <div class="label">Company</div>
          <div class="value" id="company"></div>
        </div>
      </div>
      <div id="level-badge"></div>
    </div>
  </div>
  <script>
    const data = ${JSON.stringify(toolOutput)};
    const contact = data.data?.contactInfo || data.data?.[0]?.contactInfo || data.data;
    const company = data.data?.companyInfo || data.data?.[0]?.companyInfo;
    
    if (contact) {
      document.getElementById('name').textContent = contact.fullName || contact.firstName + ' ' + contact.lastName || 'Unknown';
      document.getElementById('title').textContent = contact.jobTitle || '';
      
      if (contact.email) {
        document.getElementById('email').textContent = contact.email;
        document.getElementById('email-row').style.display = 'flex';
      }
      if (contact.phone || contact.directDial || contact.mobile) {
        document.getElementById('phone').textContent = contact.directDial || contact.phone || contact.mobile;
        document.getElementById('phone-row').style.display = 'flex';
      }
      if (contact.level) {
        document.getElementById('level-badge').innerHTML = '<span class="badge">' + contact.level + '</span>';
      }
    }
    if (company?.companyName) {
      document.getElementById('company').textContent = company.companyName;
      document.getElementById('company-row').style.display = 'flex';
    }
    
    function copyText(id) {
      const text = document.getElementById(id).textContent;
      navigator.clipboard.writeText(text);
    }
  </script>
</body>
</html>
  `.trim();
}

/**
 * Create HTML widget for account/company reveal
 */
export function createAccountWidgetHtml(data: any): string {
  const toolOutput = {
    type: 'account_reveal',
    data: data
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; max-width: 400px; }
    .header { background: linear-gradient(135deg, #7c3aed, #9333ea); padding: 16px; color: white; }
    .header h3 { font-size: 18px; margin-bottom: 4px; }
    .header p { font-size: 14px; opacity: 0.9; }
    .stats { display: grid; grid-template-columns: repeat(3, 1fr); border-bottom: 1px solid #f3f4f6; }
    .stat { padding: 12px; text-align: center; border-right: 1px solid #f3f4f6; }
    .stat:last-child { border-right: none; }
    .stat-label { font-size: 11px; color: #6b7280; margin-bottom: 4px; }
    .stat-value { font-size: 14px; font-weight: 600; color: #111827; }
    .body { padding: 16px; }
    .row { display: flex; align-items: center; gap: 12px; padding: 8px 0; }
    .icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; background: #f3f4f6; }
    .value { font-size: 14px; color: #374151; }
    .tech-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
    .tech-tag { padding: 4px 8px; background: #f3f4f6; border-radius: 4px; font-size: 12px; color: #4b5563; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h3 id="company-name">Loading...</h3>
      <p id="industry"></p>
    </div>
    <div class="stats">
      <div class="stat">
        <div class="stat-label">Employees</div>
        <div class="stat-value" id="employees">-</div>
      </div>
      <div class="stat">
        <div class="stat-label">Revenue</div>
        <div class="stat-value" id="revenue">-</div>
      </div>
      <div class="stat">
        <div class="stat-label">Founded</div>
        <div class="stat-value" id="founded">-</div>
      </div>
    </div>
    <div class="body">
      <div class="row" id="location-row" style="display:none;">
        <div class="icon">📍</div>
        <div class="value" id="location"></div>
      </div>
      <div class="row" id="website-row" style="display:none;">
        <div class="icon">🌐</div>
        <a class="value" id="website" href="#" target="_blank" style="color:#2563eb;text-decoration:none;"></a>
      </div>
      <div class="tech-tags" id="tech-tags"></div>
    </div>
  </div>
  <script>
    const data = ${JSON.stringify(toolOutput)};
    const account = data.data?.accountInfo || data.data;
    
    if (account) {
      document.getElementById('company-name').textContent = account.companyName || 'Unknown';
      document.getElementById('industry').textContent = account.industry || '';
      document.getElementById('employees').textContent = account.employeeSize || account.employeeRange || '-';
      document.getElementById('revenue').textContent = account.revenue || account.revenueRange || '-';
      document.getElementById('founded').textContent = account.foundedYear || '-';
      
      if (account.headquarters) {
        const loc = [account.headquarters.city, account.headquarters.state, account.headquarters.country].filter(Boolean).join(', ');
        if (loc) {
          document.getElementById('location').textContent = loc;
          document.getElementById('location-row').style.display = 'flex';
        }
      }
      if (account.website) {
        const ws = document.getElementById('website');
        ws.textContent = account.website;
        ws.href = account.website.startsWith('http') ? account.website : 'https://' + account.website;
        document.getElementById('website-row').style.display = 'flex';
      }
      if (account.technologies?.length) {
        document.getElementById('tech-tags').innerHTML = account.technologies.slice(0,6).map(t => '<span class="tech-tag">' + t + '</span>').join('');
      }
    }
  </script>
</body>
</html>
  `.trim();
}

/**
 * Create HTML widget for search results
 */
export function createSearchResultsWidgetHtml(data: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .card { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; max-width: 450px; }
    .header { background: linear-gradient(135deg, #0891b2, #0d9488); padding: 16px; color: white; }
    .header h3 { font-size: 18px; margin-bottom: 4px; }
    .header p { font-size: 14px; opacity: 0.9; }
    .list { max-height: 300px; overflow-y: auto; }
    .item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f3f4f6; cursor: pointer; }
    .item:hover { background: #f9fafb; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #dbeafe; color: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; }
    .info { flex: 1; min-width: 0; }
    .name { font-size: 14px; font-weight: 500; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .subtitle { font-size: 12px; color: #6b7280; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .arrow { color: #9ca3af; }
    .footer { padding: 12px 16px; background: #f9fafb; text-align: center; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h3>Search Results</h3>
      <p id="count">0 results found</p>
    </div>
    <div class="list" id="list"></div>
    <div class="footer" id="footer"></div>
  </div>
  <script>
    const data = ${JSON.stringify(data)};
    const contacts = data.contacts || [];
    const accounts = data.accounts || [];
    const total = data.totalCount || contacts.length + accounts.length;
    
    document.getElementById('count').textContent = total.toLocaleString() + ' results found';
    
    const list = document.getElementById('list');
    
    contacts.forEach(c => {
      const name = c.fullName || (c.firstName + ' ' + c.lastName) || 'Unknown';
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
      list.innerHTML += '<div class="item"><div class="avatar">' + initials + '</div><div class="info"><div class="name">' + name + '</div><div class="subtitle">' + (c.jobTitle || c.email || '') + '</div></div><div class="arrow">→</div></div>';
    });
    
    accounts.forEach(a => {
      list.innerHTML += '<div class="item"><div class="avatar" style="background:#f3e8ff;color:#7c3aed;border-radius:8px;">🏢</div><div class="info"><div class="name">' + (a.companyName || 'Unknown') + '</div><div class="subtitle">' + (a.industry || '') + '</div></div><div class="arrow">→</div></div>';
    });
    
    if (data.pageSize && data.totalCount) {
      document.getElementById('footer').textContent = 'Showing ' + Math.min(data.pageSize, total) + ' of ' + total.toLocaleString() + ' results';
    }
  </script>
</body>
</html>
  `.trim();
}
