// Type definitions

export interface Machine {
  id: number;
  name: string;
  location: string;
  email: string;
  number: number;
  float_number: number;
  enum: 'active' | 'not_active';
  created_at: string;
  edited_at: string;
}

export interface MachineCreate {
  name: string;
  location: string;
  email: string;
  number: number;
  float_number: number;
  enum: 'active' | 'not_active';
  password: string;
}

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

