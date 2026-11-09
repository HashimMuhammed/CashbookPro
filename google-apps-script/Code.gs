/**
 * CashBook Pro — Google Sheets 2-Way CRUD & Offline Batch Sync Backend
 * Bound to Google Sheet ID: 1UTXWtG8KxQ3JqQjGsCYabxgd_t3mCFH8Ws2YvW6bRvo
 *
 * Deployment Steps:
 * 1. Open https://docs.google.com/spreadsheets/d/1UTXWtG8KxQ3JqQjGsCYabxgd_t3mCFH8Ws2YvW6bRvo/edit
 * 2. Go to Extensions -> Apps Script and paste this file into Code.gs
 * 3. Click Deploy -> New deployment -> Web app
 * 4. Set 'Execute as' to 'Me' and 'Who has access' to 'Anyone'
 * 5. Copy the Web App URL and paste it into CashBook Pro -> Sheets DB & Offline Sync
 */

const SPREADSHEET_ID = '1UTXWtG8KxQ3JqQjGsCYabxgd_t3mCFH8Ws2YvW6bRvo';

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
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
    books: readTab('Projects_Books'),
    transactions: readTab('Transactions'),
    hr: readTab('HR_Payroll'),
    bills: readTab('Bills_Payables'),
    auditLogs: readTab('Sync_Audit_Log')
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
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
      const newRow = headers.map(h => op.record && op.record[h] !== undefined ? op.record[h] : '');
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
    count: ops.length
  })).setMimeType(ContentService.MimeType.JSON);
}
