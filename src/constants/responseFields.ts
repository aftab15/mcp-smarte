/**
 * Response field definitions for enrich APIs
 * These constants serve as documentation for API responses
 */

export const ENRICH_LEAD_RESPONSE_FIELDS = {
  // Metadata
  recordStatus: "Record Status",
  accuracy: "Data Grade",
  smarteTransactionId: "SMARTe ID",
  recordId: "Record ID",
  
  // Company Information
  compGUID: "Company GUID",
  compName: "Company Name",
  compNameAka: "Company Other Names",
  compPhoneNo: "Company Phone No",
  compAddr: "Company Address",
  compCity: "Company City",
  compState: "Company State",
  compCountry: "Company Country",
  compZipcode: "Company Zipcode",
  compGlobalRegions: "Company Global Region",
  compWebsite: "Website",
  compRevRange: "Revenue Range",
  compEmpCount: "Global Employee Count",
  compEmpRange: "Global Employee Range",
  compIndustry: "Industry",
  compSicCodes: "SIC Codes",
  compSicDescription: "SIC Description",
  compNaicsCodes: "NAICS Codes",
  compNaicsDescription: "NAICS Description",
  compIsSubsidiary: "Is Subsidiary",
  compLegalStatus: "Company Type",
  compFoundingYear: "Founding Year",
  compPubProfileUrl: "Company LinkedIn URL",
  
  // Contact Information
  conGUID: "Person GUID",
  conFullName: "Full Name",
  conFirstName: "First Name",
  conLastName: "Last Name",
  conEmail: "Email Address",
  conJobTitleEn: "Job Title",
  conLevels: "Level",
  conFunctions: "Department",
  conSubFunctions: "Sub-department",
  conJobUpdatedOn: "Promoted On",
  conJobStartedOn: "Job Started On",
  conWorkLocCountry: "Work Location Country",
  conWorkLocPhoneNo: "Work Location Phone",
  conLoc: "Location",
  conPubProfileUrl: "Person LinkedIn URL",
  directDial1: "Mobile Number",
  directDial2: "Direct Dial 2",
} as const;

export const ENRICH_ACCOUNT_RESPONSE_FIELDS = {
  // Metadata
  recordStatus: "Record Status",
  smarteTransactionId: "SMARTe Transaction ID",
  recordId: "Record ID",
  
  // Company Identifiers
  compGUID: "Company GUID",
  compName: "Company Name",
  compNameAka: "Company Also Known As",
  
  // Contact Information
  compPhoneNo: "Company Phone No.",
  compAddr: "Company Address",
  compCity: "Company City",
  compState: "Company State",
  compCountry: "Company Country",
  compZipcode: "Company Zipcode",
  compGlobalRegions: "Company Global Region",
  compWebsite: "Website",
  
  // Company Hierarchy
  compParentName: "Company Parent Name",
  compParentGuid: "Company Parent GUID",
  compWorldwideParentName: "Company Worldwide Parent Name",
  compGlobalHqParentGuid: "Company Global Parent GUID",
  
  // Firmographics
  compRevRange: "Revenue Range",
  compEmpCount: "Global Employee Count",
  compEmpRange: "Global Employee Range",
  compIndustry: "Industry",
  
  // Classification Codes
  compSicCodes: "SIC Codes",
  compSicDescription: "SIC Description",
  compNaicsCodes: "NAICS Codes",
  compNaicsDescription: "NAICS Description",
  
  // Company Details
  compIsSubsidiary: "Is Subsidiary",
  compLegalStatus: "Company Type",
  compFoundingYear: "Founding Year",
  compPubProfileUrl: "Company LinkedIn URL",
} as const;
