/**
 * CashBook Pro — Universal Google Sheets 2-Way CRUD & Offline Batch Sync Backend
 *
 * This script works automatically for ANY user who makes a copy of the CashBook Pro spreadsheet!
 * It automatically binds to the active spreadsheet so no manual ID editing is required.
 *
 * Setup (Takes ~30 seconds):
 * 1. Open your copy of the CashBook Pro spreadsheet.
 * 2. Go to Extensions -> Apps Script (this code is already included).
 * 3. Click Deploy -> New deployment -> Select type: Web app.
 * 4. Configure:
 *    - Description: CashBook Pro Sync Engine
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone
 * 5. Click Deploy, authorize permissions, and copy the Web App URL.
 * 6. Paste the URL into CashBook Pro -> "Connect Your Google Sheet".
 */

// Fallback Master Template ID (used only if run as a standalone script outside the container)
const TEMPLATE_SPREADSHEET_ID = '1UTXWtG8KxQ3JqQjGsCYabxgd_t3mCFH8Ws2YvW6bRvo';

/**
 * Returns the target spreadsheet:
 * 1. Active container spreadsheet (if container-bound to a sheet)
 * 2. Passed via query parameter `?sheetId=...`
 * 3. Fallback to template ID
 */
function getTargetSpreadsheet(e) {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (err) {}

  if (e && e.parameter && e.parameter.sheetId) {
    try {
      return SpreadsheetApp.openById(e.parameter.sheetId);
    } catch (err) {}
  }

  return SpreadsheetApp.openById(TEMPLATE_SPREADSHEET_ID);
}

function doGet(e) {
  try {
    const ss = getTargetSpreadsheet(e);
    const readTab = (name) => {
      const sh = ss.getSheetByName(name);
      if (!sh) return [];
      const rows = sh.getDataRange().getValues();
      if (rows.length <= 1) return [];
      const headers = rows.shift();
      return rows.map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]])));
    };

    return ContentService.createTextOutput(JSON.stringify({
      status: 'OK',
      spreadsheetId: ss.getId(),
      spreadsheetName: ss.getName(),
      books: readTab('Projects_Books'),
      transactions: readTab('Transactions'),
      hr: readTab('HR_Payroll'),
      bills: readTab('Bills_Payables'),
      auditLogs: readTab('Sync_Audit_Log')
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ERROR',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const ss = getTargetSpreadsheet(e);
    const payload = JSON.parse(e.postData.contents);
    const ops = Array.isArray(payload.operations) ? payload.operations : [payload];
    const logSheet = ss.getSheetByName('Sync_Audit_Log');

    ops.forEach(op => {
      const sh = ss.getSheetByName(op.sheetName);
      if (!sh) return;
      const data = sh.getDataRange().getValues();
      const headers = data[0];
      const idCol = 0; // Primary Key in Column A (Tx_ID, Book_ID, Emp_ID, Bill_ID)

      if (op.action === 'CREATE') {
        const newRow = headers.map(h => (op.record && op.record[h] !== undefined) ? op.record[h] : '');
        sh.appendRow(newRow);
      } else if (op.action === 'UPDATE') {
        for (let i = 1; i < data.length; i++) {
          if (String(data[i][idCol]) === String(op.recordId)) {
            const updatedRow = headers.map((h, c) => (op.record && op.record[h] !== undefined) ? op.record[h] : data[i][c]);
            sh.getRange(i + 1, 1, 1, headers.length).setValues([updatedRow]);
            break;
          }
        }
      } else if (op.action === 'DELETE') {
        for (let i = data.length - 1; i >= 1; i--) {
          if (String(data[i][idCol]) === String(op.recordId)) {
            sh.deleteRow(i + 1);
            break;
          }
        }
      }

      if (logSheet) {
        logSheet.appendRow([
          'SYNC-' + Date.now(),
          new Date().toISOString(),
          op.action,
          op.sheetName,
          op.recordId,
          op.sourceMode || 'WebApp',
          'SUCCESS',
          op.details || 'Synced via Apps Script Web App'
        ]);
      }
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: 'SYNCED',
      count: ops.length,
      spreadsheetId: ss.getId()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'ERROR',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
