/**
 * Google Sheets Apps Script Webhook
 * 1) Google Sheet 생성
 * 2) 확장 프로그램 → Apps Script
 * 3) 이 파일 붙여넣기
 * 4) SHEET_NAME, WEBHOOK_SECRET 수정
 * 5) 배포 → 웹 앱 → 액세스 권한: 모든 사용자
 */
const SHEET_NAME = 'AX_PBL_결과취합';
const WEBHOOK_SECRET = 'change-me';

const HEADERS = [
  'id','created_at','task_code','task_name','department','writer_name','written_date','process_owner',
  'business_purpose','current_usage','target_users','related_systems','major_input_data','major_outputs',
  'usage_frequency','time_before','time_after','error_reduction','satisfaction','field_feedback',
  'quantitative_effect','qualitative_effect',
  'required_values_rule','calculation_rule','decision_rule','approval_rule','permission_rule','error_handling_rule','output_format_rule',
  'source_data','input_location_fields','linked_target','security_permission','attachment_required','api_sync_required',
  'reusable_other_departments','common_module_possible','standard_form_reusable','operational_conversion_possible','integration_candidate',
  'problems','additional_requests','verification_items','next_step',
  'business_effect_level','reusability_level','integration_priority','final_decision'
];

function doPost(e) {
  try {
    const secret = e?.parameter?.secret || e?.headers?.['x-webhook-secret'] || '';
    // Apps Script는 커스텀 헤더 접근이 제한될 수 있으므로 URL ?secret= 방식도 허용합니다.
    if (WEBHOOK_SECRET && secret && secret !== WEBHOOK_SECRET) {
      return json({ ok:false, message:'invalid secret' });
    }

    const payload = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#dbeafe');
      sheet.setFrozenRows(1);
    }

    const row = HEADERS.map(h => payload[h] ?? '');
    sheet.appendRow(row);
    return json({ ok:true });
  } catch (err) {
    return json({ ok:false, message:String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
