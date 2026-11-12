'use client';

import type { GenUIBlock } from '@doctor-appointment-app/shared';

/**
 * Validates and sanitizes GenUI blocks from the agent response
 * Ensures only known block types are rendered
 */
const VALID_BLOCK_TYPES: GenUIBlock['type'][] = [
  'doctor_results',
  'doctor_profile',
  'appointment_slots',
  'appointment_review',
  'appointment_success',
  'appointment_list',
  'appointment_details',
  'cancel_appointment',
  'healthcare_faq',
  'human_support',
  'medical_safety_notice',
];

export function validateGenUIBlocks(blocks: unknown): GenUIBlock[] {
  if (!Array.isArray(blocks)) {
    return [];
  }

  return blocks
    .filter((block): block is GenUIBlock => {
      if (!block || typeof block !== 'object') return false;
      const b = block as Record<string, unknown>;
      return typeof b.type === 'string' && VALID_BLOCK_TYPES.includes(b.type as GenUIBlock['type']);
    })
    .map((block) => {
      // Additional validation per block type could go here
      return block;
    });
}
