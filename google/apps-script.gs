/** AX-PBL Google Sheets receiver. Set Script Properties:
 * SPREADSHEET_ID = the target Google spreadsheet ID
 * WEBHOOK_SECRET = long random secret shared only with Vercel
 * Deploy as a Web App: Execute as me; access Anyone (secret required).
 */
const SHEET_NAME = 'AX_PBL_결과취합';
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
    const props = PropertiesService.getScriptProperties();
    const expected = props.getProperty('WEBHOOK_SECRET');
    const spreadsheetId = props.getProperty('SPREADSHEET_ID');
    if (!expected || !spreadsheetId) return json({ok:false, message:'not configured'});
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (typeof payload.secret !== 'string' || payload.secret !== expected) {
      return json({ok:false, message:'unauthorized'});
    }
    if (typeof payload.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(payload.id)) {
      return json({ok:false, message:'invalid id'});
    }
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const ss = SpreadsheetApp.openById(spreadsheetId);
      const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
      if (sh.getLastRow() < 1) {
        sh.appendRow(HEADERS);
        sh.setFrozenRows(1);
      }
      // Prevent duplicates when Vercel retries a request.
      const existing = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1)
        .createTextFinder(payload.id).matchEntireCell(true).findNext() : null;
      if (existing) return json({ok:true, duplicate:true});
      const safe = v => {
        if (v === null || v === undefined) return '';
        if (typeof v === 'boolean' || typeof v === 'number') return v;
        let s = String(v).slice(0, 30000);
        if (/^[=+@\-\t\r]/.test(s)) s = "'" + s; // prevent formula injection
        return s;
      };
      sh.appendRow(HEADERS.map(h => safe(payload[h])));
      return json({ok:true});
    } finally { lock.releaseLock(); }
  } catch (err) {
    console.error(err);
    return json({ok:false, message:'write failed'});
  }
}
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
