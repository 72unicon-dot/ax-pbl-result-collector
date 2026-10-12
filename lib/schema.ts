import { z } from 'zod';

const blankToNull = (v: unknown) => {
  if (typeof v === 'string' && v.trim() === '') return null;
  return v;
};

export const submissionSchema = z.object({
  task_code: z.string().regex(/^C[0-9]{2}$/, '올바른 과제코드를 선택하세요.'),
  task_name: z.string().min(1),
  department: z.string().min(1, '부서를 입력하세요.'),
  writer_name: z.string().min(1, '작성자를 입력하세요.'),
  written_date: z.string().min(1, '작성일을 입력하세요.'),
  process_owner: z.string().min(1, 'Process Owner를 입력하세요.'),

  business_purpose: z.string().min(1),
  current_usage: z.string().min(1),
  target_users: z.string().min(1),
  related_systems: z.string().optional().default(''),
  major_input_data: z.string().min(1),
  major_outputs: z.string().min(1),

  usage_frequency: z.string().optional().default(''),
  time_before: z.coerce.number().min(0).nullable().optional(),
  time_after: z.coerce.number().min(0).nullable().optional(),
  error_reduction: z.string().optional().default(''),
  satisfaction: z.coerce.number().min(1).max(5).nullable().optional(),
  field_feedback: z.string().optional().default(''),
  quantitative_effect: z.string().optional().default(''),
  qualitative_effect: z.string().optional().default(''),

  required_values_rule: z.string().optional().default(''),
  calculation_rule: z.string().optional().default(''),
  decision_rule: z.string().optional().default(''),
  approval_rule: z.string().optional().default(''),
  permission_rule: z.string().optional().default(''),
  error_handling_rule: z.string().optional().default(''),
  output_format_rule: z.string().optional().default(''),

  source_data: z.string().optional().default(''),
  input_location_fields: z.string().optional().default(''),
  linked_target: z.string().optional().default(''),
  security_permission: z.string().optional().default(''),
  attachment_required: z.string().optional().default(''),
  api_sync_required: z.string().optional().default(''),

  reusable_other_departments: z.boolean().default(false),
  common_module_possible: z.boolean().default(false),
  standard_form_reusable: z.boolean().default(false),
  operational_conversion_possible: z.boolean().default(false),
  integration_candidate: z.boolean().default(false),

  problems: z.string().optional().default(''),
  additional_requests: z.string().optional().default(''),
  verification_items: z.string().optional().default(''),
  next_step: z.string().optional().default(''),

  business_effect_level: z.enum(['높음','보통','낮음']),
  reusability_level: z.enum(['높음','보통','낮음']),
  integration_priority: z.enum(['상','중','하']),
  final_decision: z.enum(['통합 MVP 후보','보류','추가 검토']),
}).transform((v) => ({
  ...v,
  time_before: blankToNull(v.time_before),
  time_after: blankToNull(v.time_after),
  satisfaction: blankToNull(v.satisfaction),
}));

export type SubmissionInput = z.input<typeof submissionSchema>;
export type Submission = z.output<typeof submissionSchema>;
