// Type definitions - Generic types for dynamic entities

// Generic JSON Schema types for dynamic form generation
export interface JSONSchema {
  $defs?: Record<string, any>;
  properties: Record<string, SchemaProperty>;
  required?: string[];
  title?: string;
  type?: string;
}

export interface SchemaProperty {
  type?: string;
  title?: string;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  format?: string;
  default?: any;
  enum?: string[];
  $ref?: string;
  allOf?: any[];
}

export type FormType = 'create' | 'update';

