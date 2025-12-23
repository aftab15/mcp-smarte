/**
 * CRM Export Request Schema
 * Zod schemas for validating CRM export requests
 * 
 * @module crmExport/request
 * @description Provides type-safe validation schemas for CRM export operations
 * with comprehensive business rule enforcement
 */

import { z } from "zod";

/**
 * Constants for CRM types
 * Currently only SALESFORCE is supported
 */
const CRM_TYPES = {
  SALESFORCE: "SALESFORCE",
} as const;

/**
 * Constants for Salesforce asset types
 * Currently only LEAD and CONTACT are supported
 */
const SALESFORCE_ASSET_TYPES = {
  LEAD: "LEAD",
  CONTACT: "CONTACT",
} as const;

/**
 * GUID validation constraints
 */
const GUID_CONSTRAINTS = {
  MIN_LENGTH: 10,
  MAX_LENGTH: 100,
  PATTERN: /^[A-Za-z0-9_-]+$/,
} as const;

/**
 * CRM type enum schema
 * @description Validates the target CRM system (currently only SALESFORCE)
 */
export const CRMTypeEnum = z.enum([CRM_TYPES.SALESFORCE]);

/**
 * Asset type enum for Salesforce
 * @description Valid asset types when exporting to Salesforce (LEAD and CONTACT only)
 */
export const SalesforceAssetTypeEnum = z.enum([
  SALESFORCE_ASSET_TYPES.LEAD,
  SALESFORCE_ASSET_TYPES.CONTACT,
]);

/**
 * Asset type enum (same as Salesforce since it's the only supported CRM)
 */
export const AssetTypeEnum = SalesforceAssetTypeEnum;

/**
 * GUID validation schema with business rules
 * @description Validates GUID format and constraints
 */
const GUIDSchema = z
  .string()
  .min(
    GUID_CONSTRAINTS.MIN_LENGTH,
    `GUID must be at least ${GUID_CONSTRAINTS.MIN_LENGTH} characters`
  )
  .max(
    GUID_CONSTRAINTS.MAX_LENGTH,
    `GUID must not exceed ${GUID_CONSTRAINTS.MAX_LENGTH} characters`
  )
  .regex(
    GUID_CONSTRAINTS.PATTERN,
    "GUID must contain only alphanumeric characters, hyphens, and underscores"
  );

/**
 * Data object schema for CRM export request
 * @description Contains the contact GUID required for export operations
 */
export const CRMExportDataSchema = z.object({
  conGUID: GUIDSchema.describe(
    "Contact GUID to export. Required for LEAD and CONTACT asset types"
  ),
});

/**
 * Validates if asset type is compatible with CRM type
 * @param crmType - The target CRM system (SALESFORCE)
 * @param assetType - The asset type to validate
 * @returns True if compatible, false otherwise
 */
function isAssetTypeValidForCRM(
  crmType: z.infer<typeof CRMTypeEnum>,
  assetType: string
): boolean {
  return Object.values(SALESFORCE_ASSET_TYPES).includes(assetType as any);
}

/**
 * Main CRM export request schema with comprehensive validation
 * @description Validates the complete export request with business rules:
 * 1. Asset type must be LEAD or CONTACT
 * 2. Contact GUID (conGUID) is required
 * 3. GUID must meet format and length constraints
 */
export const CRMExportRequestSchema = z
  .object({
    data: CRMExportDataSchema,
    exportCRM: CRMTypeEnum.describe(
      "Target CRM system: SALESFORCE (only supported CRM)"
    ),
    assetType: AssetTypeEnum.describe(
      "Asset type to export: LEAD or CONTACT"
    ),
  })
  .refine(
    (data) => isAssetTypeValidForCRM(data.exportCRM, data.assetType),
    (data) => ({
      message: `Invalid assetType '${data.assetType}' for SALESFORCE. Valid types: LEAD, CONTACT`,
      path: ["assetType"],
    })
  );

/**
 * Type exports
 */
export type CRMType = z.infer<typeof CRMTypeEnum>;
export type SalesforceAssetType = z.infer<typeof SalesforceAssetTypeEnum>;
export type AssetType = z.infer<typeof AssetTypeEnum>;
export type CRMExportData = z.infer<typeof CRMExportDataSchema>;
export type CRMExportRequest = z.infer<typeof CRMExportRequestSchema>;
