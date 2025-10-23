// Global Entity Configuration
// Change this single file to rename the entire entity (e.g., machine → user)

export const ENTITY_CONFIG = {
  // API endpoint name (singular, lowercase)
  apiName: 'machine',
  
  // Display name (singular, capitalized)
  displayName: 'Machine',
  
  // Display name (plural, capitalized)
  displayNamePlural: 'Machines',
  
  // Route path (plural, lowercase)
  routePath: 'machines',
} as const;

// Helper functions for common use cases
export const getApiUrl = (endpoint: 'create' | 'get' | 'update' | 'schema') => {
  return `/${ENTITY_CONFIG.apiName}/${endpoint}`;
};

export const getApiSchemaUrl = (method: 'create' | 'update') => {
  return `/${ENTITY_CONFIG.apiName}/schema/${method}`;
};

export const getRoutePath = (action?: 'create' | 'edit') => {
  if (!action) return `/${ENTITY_CONFIG.routePath}`;
  return `/${ENTITY_CONFIG.routePath}/${action}`;
};

