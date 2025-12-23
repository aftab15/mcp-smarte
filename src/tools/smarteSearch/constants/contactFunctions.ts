/**
 * Contact Functions and Sub-Functions
 * Complete mapping of all available functions and their sub-functions
 */

export interface SubFunction {
  id: number;
  name: string;
}

export interface ContactFunction {
  id: number;
  name: string;
  subFunction: SubFunction[];
}

export const CONTACT_FUNCTIONS: ContactFunction[] = [
  {
    id: 1,
    name: "Top Management",
    subFunction: [
      { id: 1, name: "Founder & CEO" },
      { id: 2, name: "GM / MD" },
      { id: 3, name: "Board Member" },
    ],
  },
  {
    id: 2,
    name: "Administration",
    subFunction: [
      { id: 4, name: "Secretary" },
      { id: 5, name: "Merger/Acquisition" },
      { id: 6, name: "Administration - Generic" },
    ],
  },
  {
    id: 3,
    name: "Legal /Regulatory & Compliance",
    subFunction: [
      { id: 7, name: "Regulatory & Compliance" },
      { id: 8, name: "Legal" },
    ],
  },
  {
    id: 4,
    name: "Accounting and related",
    subFunction: [
      { id: 9, name: "Accounting" },
      { id: 10, name: "Audit" },
      { id: 11, name: "Corporate Tax" },
    ],
  },
  {
    id: 5,
    name: "Sales",
    subFunction: [
      { id: 12, name: "Inside Sales/Sales Development" },
      { id: 13, name: "Account Executive/Management" },
      { id: 14, name: "Sales - Generic" },
      { id: 15, name: "Client/Customer Relationship/Engagement" },
      { id: 16, name: "Regional/Territory" },
      { id: 17, name: "International/Global" },
      { id: 18, name: "Business Development/Partnership" },
    ],
  },
  {
    id: 6,
    name: "Marketing",
    subFunction: [
      { id: 19, name: "Digital Marketing" },
      { id: 20, name: "Online Marketing" },
      { id: 21, name: "Marketing - Generic" },
      { id: 22, name: "Campaign" },
      { id: 23, name: "Events /Tradeshow" },
      { id: 24, name: "Strategic Marketing" },
      { id: 25, name: "Product/Industry/Solutions Marketing" },
      { id: 26, name: "Marketing Operations" },
      { id: 27, name: "Advertising" },
    ],
  },
  {
    id: 7,
    name: "Information Technology",
    subFunction: [
      { id: 28, name: "IT Security" },
      { id: 29, name: "Network Management" },
      { id: 30, name: "Infrastructure" },
      { id: 31, name: "Information Systems" },
      { id: 32, name: "Telecommunications" },
      { id: 33, name: "Help Desk/IT Support" },
      { id: 34, name: "IT Admin" },
      { id: 35, name: "IT Systems /Desktop" },
      { id: 36, name: "Information Technology - Generic" },
      { id: 37, name: "IT Applications" },
    ],
  },
  {
    id: 8,
    name: "Engineering and Development",
    subFunction: [
      { id: 38, name: "Software Architecture / Technologist" },
      { id: 39, name: "DBA" },
      { id: 40, name: "Engineering/Product Development" },
      { id: 41, name: "UX / UI Design" },
      { id: 42, name: "Technical" },
      { id: 43, name: "Architecture, Design & Planning" },
      { id: 44, name: "Research & Development" },
      { id: 45, name: "Product Management" },
      { id: 46, name: "E-Commerce & Mobile" },
    ],
  },
  {
    id: 9,
    name: "Miscellaneous",
    subFunction: [
      { id: 47, name: "Design" },
      { id: 48, name: "Business Intelligence" },
      { id: 49, name: "International / Regional" },
      { id: 50, name: "Risk/Fraud" },
      { id: 51, name: "Associate" },
      { id: 52, name: "Planning" },
      { id: 53, name: "Quality Control/ Assurance" },
      { id: 54, name: "Strategy" },
    ],
  },
  {
    id: 10,
    name: "Operations and related",
    subFunction: [
      { id: 55, name: "Operations - Generic" },
      { id: 56, name: "Loss Prevention/Protection" },
      { id: 57, name: "Customer Service/Support" },
      { id: 58, name: "Merchandise Management" },
      { id: 59, name: "Health/Safety" },
      { id: 60, name: "Production" },
      { id: 61, name: "Maintenance" },
      { id: 62, name: "Business Continuity" },
      { id: 63, name: "Project / Program Management" },
    ],
  },
  {
    id: 11,
    name: "Supply Chain Management",
    subFunction: [
      { id: 64, name: "Purchasing/Procurement" },
      { id: 65, name: "Category/Commodity" },
      { id: 66, name: "Supply chain - Generic" },
      { id: 67, name: "Inventory" },
      { id: 68, name: "Logistics" },
      { id: 69, name: "Warehouse" },
      { id: 70, name: "Import/Export" },
    ],
  },
  {
    id: 12,
    name: "Facility Operations",
    subFunction: [
      { id: 71, name: "Facilities/Branch" },
      { id: 72, name: "Real Estate/Property" },
      { id: 73, name: "Plant" },
      { id: 74, name: "Culinary" },
      { id: 75, name: "Store" },
    ],
  },
  {
    id: 13,
    name: "Finance/Banking/Insurance",
    subFunction: [
      { id: 76, name: "Trade and Portfolio" },
      { id: 77, name: "Financial Planning & Investment" },
      { id: 78, name: "Finance" },
      { id: 79, name: "Controller" },
      { id: 80, name: "Cash Management" },
      { id: 81, name: "Risk & Fraud" },
      { id: 82, name: "Banking" },
      { id: 83, name: "Insurance" },
    ],
  },
  {
    id: 14,
    name: "Human Resources and related",
    subFunction: [
      { id: 84, name: "Human Resources" },
      { id: 85, name: "Training & Development" },
    ],
  },
  {
    id: 15,
    name: "Communications/Public Relations",
    subFunction: [
      { id: 86, name: "Communications" },
      { id: 87, name: "Media & PR" },
    ],
  },
  {
    id: 16,
    name: "Medical & Wellness",
    subFunction: [
      { id: 88, name: "Wellness" },
      { id: 89, name: "Specialist" },
      { id: 90, name: "Pharmacist" },
      { id: 91, name: "Patient Care" },
      { id: 92, name: "Laboratory" },
      { id: 93, name: "Medical - Generic" },
      { id: 94, name: "Doctor" },
    ],
  },
  {
    id: 17,
    name: "Education / Teaching",
    subFunction: [{ id: 95, name: "Education / Teaching" }],
  },
];

/**
 * Get all function names
 */
export const FUNCTION_NAMES = CONTACT_FUNCTIONS.map((f) => f.name) as [string, ...string[]];

/**
 * Get subfunctions for a specific function
 */
export function getSubFunctions(functionName: string): SubFunction[] {
  const func = CONTACT_FUNCTIONS.find((f) => f.name === functionName);
  return func ? func.subFunction : [];
}

/**
 * Get subfunction names for a specific function
 */
export function getSubFunctionNames(functionName: string): string[] {
  return getSubFunctions(functionName).map((sf) => sf.name);
}

/**
 * Find function by ID
 */
export function getFunctionById(id: number): ContactFunction | undefined {
  return CONTACT_FUNCTIONS.find((f) => f.id === id);
}

/**
 * Find subfunction by ID across all functions
 */
export function getSubFunctionById(id: number): SubFunction | undefined {
  for (const func of CONTACT_FUNCTIONS) {
    const subFunc = func.subFunction.find((sf) => sf.id === id);
    if (subFunc) return subFunc;
  }
  return undefined;
}
