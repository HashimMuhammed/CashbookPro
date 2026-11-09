(function () {
      'use strict';

      const TEMPLATE_SHEET_ID = '1UTXWtG8KxQ3JqQjGsCYabxgd_t3mCFH8Ws2YvW6bRvo';
      const TEMPLATE_COPY_URL = 'https://docs.google.com/spreadsheets/d/1UTXWtG8KxQ3JqQjGsCYabxgd_t3mCFH8Ws2YvW6bRvo/copy';
      const SPREADSHEET_ID_DEFAULT = TEMPLATE_SHEET_ID;

      const STORAGE_KEYS = {
        DB: 'cashbook_pro_db_v2',
        QUEUE: 'cashbook_pro_offline_queue_v1',
        THEME: 'cashbook_pro_theme_v1',
        CONFIG: 'cashbook_pro_sheet_config_v1'
      };

      // Helper to auto-extract Spreadsheet ID from bare ID or full Google Sheets URL
      function extractSheetId(input) {
        if (!input) return '';
        const trimmed = input.trim();
        const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match && match[1]) return match[1];
        return trimmed;
      }

      // Baseline seed data matching the live Google Sheet 1UTXWtG8KxQ3JqQjGsCYabxgd_t3mCFH8Ws2YvW6bRvo
      function getBaselineDatabase() {
        return {
          books: [
            { Book_ID: 'BOOK-01', Book_Name: 'Personal & Household', Category_Type: 'Personal', Currency: 'INR', Opening_Balance: 50000, Status: 'Active', Description: 'Daily personal & home cash flow, groceries, investments, utilities' },
            { Book_ID: 'BOOK-02', Book_Name: 'Apex Cloud ERP Project', Category_Type: 'Work Project', Currency: 'INR', Opening_Balance: 250000, Status: 'Active', Description: 'Client software build, cloud hosting, contractor & developer payouts' },
            { Book_ID: 'BOOK-03', Book_Name: 'Chennai Retail Studio Fitout', Category_Type: 'Work Project', Currency: 'INR', Opening_Balance: 180000, Status: 'Active', Description: 'Site interior work, vendor materials, daily labor & site bills' },
            { Book_ID: 'BOOK-04', Book_Name: 'HR & Monthly Payroll Book', Category_Type: 'HR & Admin', Currency: 'INR', Opening_Balance: 300000, Status: 'Active', Description: 'Centralized staff salaries, advances, PF/ESI, and team reimbursements' }
          ],
          transactions: [
            { Tx_ID: 'TX-1001', Date: '2026-11-01', Time: '09:30', Book_ID: 'BOOK-02', Book_Name: 'Apex Cloud ERP Project', Type: 'CREDIT', Category: 'Client Milestone', Party_Name: 'Apex Global Logistics Ltd', Party_Role: 'Client', Payment_Mode: 'Bank Transfer (NEFT/RTGS)', Amount: 185000, Tax_GST: 0, Net_Amount: 185000, Reference_Bill_No: 'INV-2026-101', Notes: 'Milestone 1 Advance Received for ERP Module', Sync_Status: 'SYNCED', Updated_At: '2026-11-01T09:30:00Z' },
            { Tx_ID: 'TX-1002', Date: '2026-11-01', Time: '11:15', Book_ID: 'BOOK-01', Book_Name: 'Personal & Household', Type: 'CREDIT', Category: 'Salary / Consulting', Party_Name: 'Self / Consulting Retainer', Party_Role: 'Income', Payment_Mode: 'Bank Transfer (NEFT/RTGS)', Amount: 125000, Tax_GST: 0, Net_Amount: 125000, Reference_Bill_No: 'RET-NOV-01', Notes: 'Monthly personal retainer & dividend credit', Sync_Status: 'SYNCED', Updated_At: '2026-11-01T11:15:00Z' },
            { Tx_ID: 'TX-1003', Date: '2026-11-02', Time: '14:20', Book_ID: 'BOOK-04', Book_Name: 'HR & Monthly Payroll Book', Type: 'DEBIT', Category: 'Staff Salary', Party_Name: 'Aravind Krishnan', Party_Role: 'Employee', Payment_Mode: 'Bank Transfer (NEFT/RTGS)', Amount: 62000, Tax_GST: 0, Net_Amount: 62000, Reference_Bill_No: 'PAY-NOV-01', Notes: 'Lead Full-Stack Engineer Oct-Nov Payout', Sync_Status: 'SYNCED', Updated_At: '2026-11-02T14:20:00Z' },
            { Tx_ID: 'TX-1004', Date: '2026-11-02', Time: '14:45', Book_ID: 'BOOK-04', Book_Name: 'HR & Monthly Payroll Book', Type: 'DEBIT', Category: 'Staff Salary', Party_Name: 'Priya Subramanian', Party_Role: 'Employee', Payment_Mode: 'UPI', Amount: 48000, Tax_GST: 0, Net_Amount: 48000, Reference_Bill_No: 'PAY-NOV-02', Notes: 'UI/UX & Product Designer Salary Payout', Sync_Status: 'SYNCED', Updated_At: '2026-11-02T14:45:00Z' },
            { Tx_ID: 'TX-1005', Date: '2026-11-03', Time: '10:10', Book_ID: 'BOOK-03', Book_Name: 'Chennai Retail Studio Fitout', Type: 'CREDIT', Category: 'Project Advance', Party_Name: 'Vanguard Lifestyle Retail', Party_Role: 'Client', Payment_Mode: 'Cheque', Amount: 150000, Tax_GST: 0, Net_Amount: 150000, Reference_Bill_No: 'CHQ-884120', Notes: 'Phase 2 Carpentry & Lighting Advance', Sync_Status: 'SYNCED', Updated_At: '2026-11-03T10:10:00Z' },
            { Tx_ID: 'TX-1006', Date: '2026-11-04', Time: '16:05', Book_ID: 'BOOK-03', Book_Name: 'Chennai Retail Studio Fitout', Type: 'DEBIT', Category: 'Raw Materials', Party_Name: 'Sri Murugan Timber & Plywoods', Party_Role: 'Vendor', Payment_Mode: 'UPI', Amount: 42500, Tax_GST: 0, Net_Amount: 42500, Reference_Bill_No: 'BILL-992', Notes: 'Marine grade plywood & laminate sheets', Sync_Status: 'SYNCED', Updated_At: '2026-11-04T16:05:00Z' },
            { Tx_ID: 'TX-1007', Date: '2026-11-05', Time: '18:30', Book_ID: 'BOOK-01', Book_Name: 'Personal & Household', Type: 'DEBIT', Category: 'Rent & Maintenance', Party_Name: 'Adyar Creek Apartments', Party_Role: 'Landlord', Payment_Mode: 'UPI', Amount: 28000, Tax_GST: 0, Net_Amount: 28000, Reference_Bill_No: 'RENT-NOV26', Notes: 'November house rent + society maintenance', Sync_Status: 'SYNCED', Updated_At: '2026-11-05T18:30:00Z' },
            { Tx_ID: 'TX-1008', Date: '2026-11-06', Time: '12:00', Book_ID: 'BOOK-02', Book_Name: 'Apex Cloud ERP Project', Type: 'DEBIT', Category: 'Cloud & SaaS Bills', Party_Name: 'AWS India Cloud Services', Party_Role: 'Vendor', Payment_Mode: 'Card', Amount: 19400, Tax_GST: 0, Net_Amount: 19400, Reference_Bill_No: 'BILL-102', Notes: 'Production Kubernetes cluster & RDS database', Sync_Status: 'SYNCED', Updated_At: '2026-11-06T12:00:00Z' },
            { Tx_ID: 'TX-1009', Date: '2026-11-07', Time: '09:45', Book_ID: 'BOOK-04', Book_Name: 'HR & Monthly Payroll Book', Type: 'DEBIT', Category: 'Salary Advance (Udhar)', Party_Name: 'Karthik Rajan', Party_Role: 'Employee', Payment_Mode: 'Cash', Amount: 8000, Tax_GST: 0, Net_Amount: 8000, Reference_Bill_No: 'ADV-NOV-04', Notes: 'Festival / medical cash advance (to deduct in Nov payroll)', Sync_Status: 'SYNCED', Updated_At: '2026-11-07T09:45:00Z' },
            { Tx_ID: 'TX-1010', Date: '2026-11-08', Time: '19:15', Book_ID: 'BOOK-01', Book_Name: 'Personal & Household', Type: 'DEBIT', Category: 'Groceries & Dining', Party_Name: 'Nilgiris Supermarket', Party_Role: 'Merchant', Payment_Mode: 'UPI', Amount: 6450, Tax_GST: 0, Net_Amount: 6450, Reference_Bill_No: 'POS-4421', Notes: 'Weekly household groceries and fresh produce', Sync_Status: 'SYNCED', Updated_At: '2026-11-08T19:15:00Z' },
            { Tx_ID: 'TX-1011', Date: '2026-11-09', Time: '10:30', Book_ID: 'BOOK-03', Book_Name: 'Chennai Retail Studio Fitout', Type: 'DEBIT', Category: 'Daily Wage / Labor', Party_Name: 'Suresh Electricals Crew', Party_Role: 'Contractor', Payment_Mode: 'Cash', Amount: 14500, Tax_GST: 0, Net_Amount: 14500, Reference_Bill_No: 'VOUCH-31', Notes: '3-day concealed wiring & LED track installation labor', Sync_Status: 'SYNCED', Updated_At: '2026-11-09T10:30:00Z' },
            { Tx_ID: 'TX-1012', Date: '2026-11-09', Time: '15:20', Book_ID: 'BOOK-02', Book_Name: 'Apex Cloud ERP Project', Type: 'CREDIT', Category: 'CR / Add-on Feature', Party_Name: 'Apex Global Logistics Ltd', Party_Role: 'Client', Payment_Mode: 'UPI', Amount: 35000, Tax_GST: 0, Net_Amount: 35000, Reference_Bill_No: 'INV-2026-108', Notes: 'Barcode scanner mobile module fast-track payment', Sync_Status: 'SYNCED', Updated_At: '2026-11-09T15:20:00Z' }
          ],
          hr: [
            { Emp_ID: 'EMP-01', Employee_Name: 'Aravind Krishnan', Role_Designation: 'Lead Full-Stack Engineer', Assigned_Book_ID: 'BOOK-02', Phone: '+91 98401 11223', Salary_Mode: 'Monthly', Pay_Rate: 65000, Base_Monthly_Salary: 65000, Days_Worked: 26, Attendance_Status: 'Present (26/26 Days)', Salary_Advance_Taken: 3000, Bonus_Allowance: 0, Net_Payable: 62000, Payroll_Status: 'PAID', Last_Paid_Date: '2026-11-02', Payment_Mode: 'Bank Transfer (NEFT/RTGS)' },
            { Emp_ID: 'EMP-02', Employee_Name: 'Priya Subramanian', Role_Designation: 'Product & UI/UX Designer', Assigned_Book_ID: 'BOOK-02', Phone: '+91 98402 33445', Salary_Mode: 'Monthly', Pay_Rate: 48000, Base_Monthly_Salary: 48000, Days_Worked: 26, Attendance_Status: 'Present (26/26 Days)', Salary_Advance_Taken: 0, Bonus_Allowance: 0, Net_Payable: 48000, Payroll_Status: 'PAID', Last_Paid_Date: '2026-11-02', Payment_Mode: 'UPI' },
            { Emp_ID: 'EMP-03', Employee_Name: 'Karthik Rajan', Role_Designation: 'Site Supervisor & Civil Lead', Assigned_Book_ID: 'BOOK-03', Phone: '+91 98403 55667', Salary_Mode: 'Weekly', Pay_Rate: 10500, Base_Monthly_Salary: 42000, Days_Worked: 4, Attendance_Status: '4 Weeks Logged', Salary_Advance_Taken: 8000, Bonus_Allowance: 2000, Net_Payable: 36000, Payroll_Status: 'PENDING', Last_Paid_Date: '2026-10-03', Payment_Mode: 'Bank Transfer (NEFT/RTGS)' },
            { Emp_ID: 'EMP-04', Employee_Name: 'Meenakshi Sundaram', Role_Designation: 'HR & Accounts Executive', Assigned_Book_ID: 'BOOK-04', Phone: '+91 98404 77889', Salary_Mode: 'Monthly', Pay_Rate: 38000, Base_Monthly_Salary: 38000, Days_Worked: 26, Attendance_Status: 'Present (26/26 Days)', Salary_Advance_Taken: 0, Bonus_Allowance: 1500, Net_Payable: 39500, Payroll_Status: 'PENDING', Last_Paid_Date: '2026-10-02', Payment_Mode: 'UPI' },
            { Emp_ID: 'EMP-05', Employee_Name: 'Dinesh Kumar', Role_Designation: 'Junior QA & Support Analyst', Assigned_Book_ID: 'BOOK-02', Phone: '+91 98405 99001', Salary_Mode: 'Weekly', Pay_Rate: 8000, Base_Monthly_Salary: 32000, Days_Worked: 4, Attendance_Status: '4 Weeks Logged', Salary_Advance_Taken: 2500, Bonus_Allowance: 0, Net_Payable: 29500, Payroll_Status: 'PENDING', Last_Paid_Date: '2026-10-02', Payment_Mode: 'UPI' },
            { Emp_ID: 'EMP-06', Employee_Name: 'Ramesh Velu', Role_Designation: 'Master Carpenter & Fitout Tech', Assigned_Book_ID: 'BOOK-03', Phone: '+91 98406 22334', Salary_Mode: 'Daily', Pay_Rate: 1400, Base_Monthly_Salary: 35000, Days_Worked: 25, Attendance_Status: '25 Daily Shifts', Salary_Advance_Taken: 5000, Bonus_Allowance: 1000, Net_Payable: 31000, Payroll_Status: 'PENDING', Last_Paid_Date: '2026-10-05', Payment_Mode: 'Cash' }
          ],
          bills: [
            { Bill_ID: 'BILL-101', Title_Description: 'TNEB Commercial Studio & Office Electricity', Vendor_Or_Party: 'TANGEDCO / TNEB', Book_ID: 'BOOK-03', Direction: 'PAYABLE (Bill Out)', Category: 'Utilities & Power', Due_Date: '2026-11-12', Frequency: 'Monthly', Amount: 11850, Status: 'DUE_SOON', Payment_Mode: 'UPI', Linked_Tx_ID: '', Notes: 'Bi-monthly commercial meter reading for studio & office' },
            { Bill_ID: 'BILL-102', Title_Description: 'AWS Cloud Production Cluster (Oct-Nov)', Vendor_Or_Party: 'AWS India Cloud Services', Book_ID: 'BOOK-02', Direction: 'PAYABLE (Bill Out)', Category: 'Cloud & SaaS Bills', Due_Date: '2026-11-06', Frequency: 'Monthly', Amount: 19400, Status: 'PAID', Payment_Mode: 'Card', Linked_Tx_ID: 'TX-1008', Notes: 'Auto-linked to TX-1008' },
            { Bill_ID: 'BILL-103', Title_Description: 'Airtel Leased Line & Fiber Broadband', Vendor_Or_Party: 'Bharti Airtel Business', Book_ID: 'BOOK-01', Direction: 'PAYABLE (Bill Out)', Category: 'Internet & Telecom', Due_Date: '2026-11-07', Frequency: 'Monthly', Amount: 3499, Status: 'OVERDUE', Payment_Mode: 'UPI', Linked_Tx_ID: '', Notes: '300 Mbps static IP office + home fiber plan' },
            { Bill_ID: 'BILL-104', Title_Description: 'Saint-Gobain Toughened Glass Partition Invoice', Vendor_Or_Party: 'Chennai Glass & Glazing Co', Book_ID: 'BOOK-03', Direction: 'PAYABLE (Bill Out)', Category: 'Raw Materials', Due_Date: '2026-11-15', Frequency: 'One-Time', Amount: 54000, Status: 'PENDING', Payment_Mode: 'Bank Transfer (NEFT/RTGS)', Linked_Tx_ID: '', Notes: '50% balance due upon delivery at site' },
            { Bill_ID: 'BILL-105', Title_Description: 'Apex ERP Phase 2 UAT Sign-off Invoice', Vendor_Or_Party: 'Apex Global Logistics Ltd', Book_ID: 'BOOK-02', Direction: 'RECEIVABLE (Invoice In)', Category: 'Client Milestone', Due_Date: '2026-11-20', Frequency: 'One-Time', Amount: 140000, Status: 'PENDING', Payment_Mode: 'Bank Transfer (NEFT/RTGS)', Linked_Tx_ID: '', Notes: 'Receivable from client upon UAT completion' },
            { Bill_ID: 'BILL-106', Title_Description: 'Employee PF & ESI Monthly Statutory Challan', Vendor_Or_Party: 'EPFO / ESIC Portal', Book_ID: 'BOOK-04', Direction: 'PAYABLE (Bill Out)', Category: 'Statutory & Tax', Due_Date: '2026-11-15', Frequency: 'Monthly', Amount: 22400, Status: 'DUE_SOON', Payment_Mode: 'Bank Transfer (NEFT/RTGS)', Linked_Tx_ID: '', Notes: 'Mandatory monthly employer + employee contribution' },
            { Bill_ID: 'BILL-107', Title_Description: 'Home & Personal Health Insurance Premium', Vendor_Or_Party: 'Star Health Insurance', Book_ID: 'BOOK-01', Direction: 'PAYABLE (Bill Out)', Category: 'Insurance', Due_Date: '2026-11-25', Frequency: 'Yearly', Amount: 18500, Status: 'PENDING', Payment_Mode: 'Card', Linked_Tx_ID: '', Notes: 'Annual family floater renewal' }
          ],
          auditLogs: [
            { Log_ID: 'SYNC-004', Timestamp_IST: '2026-11-09 17:55:00', Operation: 'BATCH_WRITE', Target_Sheet: 'Bills_Payables', Record_ID: 'BILL-101..BILL-107', Source_Mode: 'Online_Direct', Status: 'SUCCESS', Details: 'Synced 7 vendor payables, utilities, and client receivables' },
            { Log_ID: 'SYNC-003', Timestamp_IST: '2026-11-09 17:52:30', Operation: 'BATCH_WRITE', Target_Sheet: 'HR_Payroll', Record_ID: 'EMP-01..EMP-06', Source_Mode: 'Online_Direct', Status: 'SUCCESS', Details: 'Synced 6 employee payroll & attendance records' },
            { Log_ID: 'SYNC-002', Timestamp_IST: '2026-11-09 17:50:12', Operation: 'BATCH_WRITE', Target_Sheet: 'Transactions', Record_ID: 'TX-1001..TX-1012', Source_Mode: 'Online_Direct', Status: 'SUCCESS', Details: 'Synced 12 baseline debit and credit ledger transactions across 4 books' },
            { Log_ID: 'SYNC-001', Timestamp_IST: '2026-11-09 17:45:00', Operation: 'INIT_SCHEMA', Target_Sheet: 'ALL_TABS', Record_ID: 'SCHEMA-V1', Source_Mode: 'Online_Direct', Status: 'SUCCESS', Details: 'Initialized 6-tab Google Sheets relational database for CashBook Pro' }
          ]
        };
      }

      // Safe LocalStorage Helpers
      function safeGetStorage(key, fallback) {
        try {
          const raw = localStorage.getItem(key);
          return raw ? JSON.parse(raw) : fallback;
        } catch (err) {
          return fallback;
        }
      }

      function safeSetStorage(key, value) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
          // Ignore quota/sandbox exceptions
        }
      }

      // Application State
      let db = safeGetStorage(STORAGE_KEYS.DB, null);
      if (!db || !Array.isArray(db.transactions) || !Array.isArray(db.books)) {
        db = getBaselineDatabase();
        safeSetStorage(STORAGE_KEYS.DB, db);
      }

      let offlineQueue = safeGetStorage(STORAGE_KEYS.QUEUE, []);
      let sheetConfig = safeGetStorage(STORAGE_KEYS.CONFIG, {
        sheetId: '',
        appsScriptUrl: '',
        isConfigured: false
      });

      // Migration: If config exists without appsScriptUrl and uses default ID, mark as unconfigured local mode
      if (sheetConfig.sheetId === TEMPLATE_SHEET_ID && !sheetConfig.appsScriptUrl) {
        sheetConfig.isConfigured = false;
        sheetConfig.sheetId = '';
      }

      let state = {
        activeView: 'dashboard',
        activeBookId: 'ALL',
        isOnline: navigator.onLine !== false,
        simulatedOffline: false,
        mobileSimulator: false,
        theme: safeGetStorage(STORAGE_KEYS.THEME, 'light')
      };

      // Chart instances
      let booksChartInstance = null;
      let categoryChartInstance = null;

      // Utility Formatters
      function formatINR(num) {
        const val = Number(num) || 0;
        const sign = val < 0 ? '-' : '';
        const abs = Math.abs(val);
        return sign + '₹' + abs.toLocaleString('en-IN', { maximumFractionDigits: 2 });
      }

      function nowISTString() {
        const d = new Date();
        return d.toISOString().replace('T', ' ').substring(0, 19);
      }

      function showToast(message, type) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        const badgeClass = type === 'warn' ? 'badge-warn' : (type === 'debit' ? 'badge-debit' : 'badge-credit');
        toast.className = 'surface-card p-3 rounded-xl shadow-lg border-l-4 flex items-center justify-between gap-2 text-xs font-semibold pointer-events-auto transition-all ' + badgeClass;
        toast.innerHTML = '<span>' + message + '</span>';
        container.appendChild(toast);
        setTimeout(function () {
          toast.style.opacity = '0';
          setTimeout(function () {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
          }, 250);
        }, 3200);
      }

      // ========================================================================
      // OFFLINE-FIRST LOCALSTORAGE & GOOGLE SHEETS CRUD SYNC ENGINE
      // ========================================================================
      function isEffectivelyOnline() {
        return state.isOnline && !state.simulatedOffline;
      }

      function persistAll() {
        safeSetStorage(STORAGE_KEYS.DB, db);
        safeSetStorage(STORAGE_KEYS.QUEUE, offlineQueue);
        updateStorageSizeIndicator();
      }

      function updateStorageSizeIndicator() {
        const el = document.getElementById('localStorageSizeLabel');
        if (!el) return;
        try {
          const bytes = JSON.stringify(db).length + JSON.stringify(offlineQueue).length;
          el.textContent = (bytes / 1024).toFixed(1) + ' KB Cached';
        } catch (e) {
          el.textContent = 'Active';
        }
      }

      async function dispatchCrudMutation(action, sheetName, recordId, recordData, detailsText) {
        const timestamp = nowISTString();
        const opPayload = {
          queueId: 'Q-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          timestamp: timestamp,
          action: action, // 'CREATE' | 'UPDATE' | 'DELETE'
          sheetName: sheetName, // 'Transactions' | 'Projects_Books' | 'HR_Payroll' | 'Bills_Payables'
          recordId: recordId,
          record: recordData,
          details: detailsText
        };

        if (!isEffectivelyOnline()) {
          // Queue in localStorage Outbox for automatic sync when internet returns
          offlineQueue.push(opPayload);
          db.auditLogs.unshift({
            Log_ID: 'QUEUED-' + String(db.auditLogs.length + 1).padStart(3, '0'),
            Timestamp_IST: timestamp,
            Operation: action + ' (QUEUED)',
            Target_Sheet: sheetName,
            Record_ID: recordId,
            Source_Mode: 'Offline_LocalStorage',
            Status: 'PENDING_SYNC',
            Details: detailsText + ' [Queued in localStorage outbox]'
          });
          persistAll();
          updateNetworkUI();
          renderAll();
          showToast('⚡ Saved offline in LocalStorage! Queued ' + action + ' (' + recordId + ') for Google Sheets sync.', 'warn');
          return;
        }

        // Online: Sync to Google Sheets Web App endpoint if configured + update audit log
        let remoteSynced = false;
        if (sheetConfig.appsScriptUrl && sheetConfig.appsScriptUrl.startsWith('https://')) {
          try {
            await fetch(sheetConfig.appsScriptUrl, {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify(opPayload)
            });
            remoteSynced = true;
          } catch (err) {
            // Network drop during fetch -> push to offline queue
            offlineQueue.push(opPayload);
            persistAll();
            updateNetworkUI();
            showToast('⚠️ Network unreachable during Sheet sync. Queued in LocalStorage.', 'warn');
            return;
          }
        }

        db.auditLogs.unshift({
          Log_ID: 'SYNC-' + String(db.auditLogs.length + 1).padStart(3, '0'),
          Timestamp_IST: timestamp,
          Operation: action,
          Target_Sheet: sheetName,
          Record_ID: recordId,
          Source_Mode: remoteSynced ? 'Live_Webhook' : 'Online_Sheet_Replica',
          Status: 'SUCCESS',
          Details: detailsText
        });
        persistAll();
        updateNetworkUI();
        renderAll();
        showToast(remoteSynced
          ? '✅ Synced ' + action + ' (' + recordId + ') to your Google Sheet [' + sheetName + ']'
          : '✅ Saved ' + action + ' (' + recordId + ') to local database [' + sheetName + ']', 'credit');
      }

      async function flushOfflineQueue() {
        if (!isEffectivelyOnline()) {
          showToast('Cannot flush queue while Offline. Switch to Online first.', 'warn');
          return;
        }
        if (offlineQueue.length === 0) {
          showToast('All records are already synced with Google Sheets!', 'credit');
          return;
        }

        const count = offlineQueue.length;
        const opsToSync = offlineQueue.slice();

        if (sheetConfig.appsScriptUrl && sheetConfig.appsScriptUrl.startsWith('https://')) {
          try {
            await fetch(sheetConfig.appsScriptUrl, {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'text/plain;charset=utf-8' },
              body: JSON.stringify({ operations: opsToSync })
            });
          } catch (e) {
            showToast('Webhook error while flushing queue. Will retry.', 'warn');
            return;
          }
        }

        // Mark all transactions that were PENDING_OFFLINE as SYNCED
        db.transactions.forEach(function (tx) {
          if (tx.Sync_Status !== 'SYNCED') {
            tx.Sync_Status = 'SYNCED';
          }
        });

        // Update queued logs
        db.auditLogs.forEach(function (log) {
          if (log.Status === 'PENDING_SYNC') {
            log.Status = 'SUCCESS';
            log.Operation = log.Operation.replace(' (QUEUED)', ' (AUTO-SYNCED)');
          }
        });

        db.auditLogs.unshift({
          Log_ID: 'BATCH-' + Date.now().toString().slice(-4),
          Timestamp_IST: nowISTString(),
          Operation: 'BATCH_FLUSH',
          Target_Sheet: 'ALL_TABS',
          Record_ID: count + ' Queued Ops',
          Source_Mode: 'Auto_Reconnect_Sync',
          Status: 'SUCCESS',
          Details: 'Flushed ' + count + ' offline LocalStorage mutations to Google Sheets DB'
        });

        offlineQueue = [];
        persistAll();
        updateNetworkUI();
        renderAll();
        showToast('🔄 Internet connected! Auto-synced ' + count + ' queued operations to Google Sheets.', 'credit');
      }

      // Listen for real browser online/offline transitions
      window.addEventListener('online', function () {
        state.isOnline = true;
        updateNetworkUI();
        if (!state.simulatedOffline && offlineQueue.length > 0) {
          flushOfflineQueue();
        }
      });

      window.addEventListener('offline', function () {
        state.isOnline = false;
        updateNetworkUI();
        showToast('⚡ Internet disconnected. Switched to Offline LocalStorage mode.', 'warn');
      });

      function updateHeaderSheetButton() {
        const headerBtn = document.getElementById('headerSheetBtn');
        const headerText = document.getElementById('headerSheetText');
        const headerIcon = document.getElementById('headerSheetIcon');
        const displayLink = document.getElementById('currentSheetDisplayLink');
        const badge = document.getElementById('sheetConnectionBadge');
        const banner = document.getElementById('firstTimeUserBanner');

        const isUserConnected = Boolean(sheetConfig && sheetConfig.isConfigured && (sheetConfig.appsScriptUrl || sheetConfig.sheetId));

        if (isUserConnected) {
          if (headerText) headerText.textContent = 'My Google Sheet';
          if (headerIcon) headerIcon.textContent = '📊';
          if (headerBtn) {
            headerBtn.title = 'Open your connected Google Sheet in Google Drive';
          }
          if (badge) {
            badge.className = 'px-2 py-0.5 rounded text-xs font-bold badge-credit';
            badge.textContent = 'Personal Sheet Connected';
          }
          if (displayLink) {
            if (sheetConfig.sheetId) {
              displayLink.href = 'https://docs.google.com/spreadsheets/d/' + sheetConfig.sheetId + '/edit';
              displayLink.textContent = 'https://docs.google.com/spreadsheets/d/' + sheetConfig.sheetId + '/edit';
            } else {
              displayLink.href = sheetConfig.appsScriptUrl;
              displayLink.textContent = 'Connected via Custom Web App (' + sheetConfig.appsScriptUrl.slice(0, 35) + '...)';
            }
          }
          if (banner) banner.classList.add('hidden');
        } else {
          if (headerText) headerText.textContent = 'Connect Google Sheet';
          if (headerIcon) headerIcon.textContent = '⚡';
          if (headerBtn) {
            headerBtn.title = 'Click to connect your own Google Sheet or run in private local mode';
          }
          if (badge) {
            badge.className = 'px-2 py-0.5 rounded text-xs font-bold badge-warn';
            badge.textContent = 'Local / Offline Mode';
          }
          if (displayLink) {
            displayLink.href = TEMPLATE_COPY_URL;
            displayLink.textContent = 'Local Storage Only (Click to Copy Template & Connect Your Sheet)';
          }
          const dismissed = sessionStorage.getItem('cashbook_pro_banner_dismissed');
          if (banner && !dismissed) {
            banner.classList.remove('hidden');
          }
        }
      }

      function updateNetworkUI() {
        const online = isEffectivelyOnline();
        const pill = document.getElementById('syncStatusPill');
        const text = document.getElementById('syncStatusText');
        const banner = document.getElementById('offlineBanner');
        const netIcon = document.getElementById('networkIcon');
        const netLabel = document.getElementById('networkBtnLabel');
        const queueBadge = document.getElementById('pendingQueueCountBadge');
        const navQueue = document.getElementById('navBadgeQueue');
        const sidebarDot = document.getElementById('sidebarSyncDot');
        const isUserConnected = Boolean(sheetConfig && sheetConfig.isConfigured && sheetConfig.appsScriptUrl);

        if (online) {
          pill.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold badge-credit';
          text.textContent = offlineQueue.length > 0
            ? ('Online • ' + offlineQueue.length + ' Pending')
            : (isUserConnected ? 'Online • Sheets Synced' : 'Online • Local Mode');
          netIcon.textContent = '🌐';
          netLabel.textContent = 'Simulate Offline';
          sidebarDot.className = 'text-[10px] px-1.5 py-0.5 rounded badge-credit';
          sidebarDot.textContent = isUserConnected ? 'LIVE' : 'LOCAL';
          if (offlineQueue.length === 0) {
            banner.classList.add('hidden');
          } else {
            banner.classList.remove('hidden');
            document.getElementById('offlineBannerMsg').textContent = offlineQueue.length + ' offline changes are ready to sync to Google Sheets.';
          }
        } else {
          pill.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold badge-warn';
          text.textContent = 'Offline • LocalStorage Mode (' + offlineQueue.length + ' Queued)';
          netIcon.textContent = '⚡';
          netLabel.textContent = 'Reconnect Online';
          sidebarDot.className = 'text-[10px] px-1.5 py-0.5 rounded badge-warn';
          sidebarDot.textContent = 'OFFLINE';
          banner.classList.remove('hidden');
          document.getElementById('offlineBannerMsg').textContent = 'Internet is disconnected (' + offlineQueue.length + ' queued ops). All new entries are stored in LocalStorage and will auto-sync when online.';
        }

        if (offlineQueue.length > 0) {
          queueBadge.classList.remove('hidden');
          queueBadge.textContent = String(offlineQueue.length);
        } else {
          queueBadge.classList.add('hidden');
        }
        if (navQueue) {
          navQueue.textContent = offlineQueue.length + ' Queued';
        }

        updateHeaderSheetButton();
      }

      // ========================================================================
      // DATA AGGREGATION & METRICS HELPERS
      // ========================================================================
      function getBookById(bookId) {
        return db.books.find(function (b) { return b.Book_ID === bookId; }) || null;
      }

      function computeBookStats(bookId) {
        const booksToSum = bookId === 'ALL' ? db.books : db.books.filter(function (b) { return b.Book_ID === bookId; });
        const opening = booksToSum.reduce(function (acc, b) { return acc + (Number(b.Opening_Balance) || 0); }, 0);
        const txs = db.transactions.filter(function (t) {
          return bookId === 'ALL' || t.Book_ID === bookId;
        });
        let totalCredit = 0;
        let totalDebit = 0;
        let creditCount = 0;
        let debitCount = 0;
        txs.forEach(function (t) {
          const amt = Number(t.Net_Amount) || Number(t.Amount) || 0;
          if (t.Type === 'CREDIT') {
            totalCredit += amt;
            creditCount++;
          } else {
            totalDebit += amt;
            debitCount++;
          }
        });
        return {
          opening: opening,
          totalCredit: totalCredit,
          totalDebit: totalDebit,
          creditCount: creditCount,
          debitCount: debitCount,
          netBalance: opening + totalCredit - totalDebit
        };
      }

      // ========================================================================
      // RENDERING PIPELINE
      // ========================================================================
      function renderBookSelectOptions() {
        const globalSelect = document.getElementById('globalBookSelect');
        const txBookSelect = document.getElementById('txBookField');
        const hrBookSelect = document.getElementById('hrBookField');
        const billBookSelect = document.getElementById('billBookField');

        const currentGlobal = state.activeBookId;
        globalSelect.innerHTML = '<option value="ALL">All Books (Consolidated)</option>';
        txBookSelect.innerHTML = '';
        hrBookSelect.innerHTML = '';
        billBookSelect.innerHTML = '';

        db.books.forEach(function (b) {
          const optGlobal = document.createElement('option');
          optGlobal.value = b.Book_ID;
          optGlobal.textContent = b.Book_Name + ' (' + b.Category_Type + ')';
          globalSelect.appendChild(optGlobal);

          [txBookSelect, hrBookSelect, billBookSelect].forEach(function (sel) {
            const opt = document.createElement('option');
            opt.value = b.Book_ID;
            opt.textContent = b.Book_Name;
            sel.appendChild(opt);
          });
        });

        globalSelect.value = currentGlobal;
        if (currentGlobal !== 'ALL') {
          txBookSelect.value = currentGlobal;
          hrBookSelect.value = currentGlobal;
          billBookSelect.value = currentGlobal;
        }
      }

      function renderCategoryFilterOptions() {
        const catSelect = document.getElementById('ledgerCategoryFilter');
        const currentVal = catSelect.value || 'ALL';
        const cats = Array.from(new Set(db.transactions.map(function (t) { return t.Category; }))).sort();
        catSelect.innerHTML = '<option value="ALL">All Categories</option>';
        cats.forEach(function (c) {
          const opt = document.createElement('option');
          opt.value = c;
          opt.textContent = c;
          catSelect.appendChild(opt);
        });
        if (cats.includes(currentVal)) catSelect.value = currentVal;
      }

      function renderKPIStrip() {
        const stats = computeBookStats(state.activeBookId);
        const activeBook = getBookById(state.activeBookId);
        const bookLabel = activeBook ? activeBook.Book_Name : 'All Books';

        document.getElementById('kpiBookTag').textContent = bookLabel;
        document.getElementById('kpiNetBalance').textContent = formatINR(stats.netBalance);
        document.getElementById('kpiOpeningSub').textContent = 'Opening Balance: ' + formatINR(stats.opening);
        document.getElementById('kpiTotalCredit').textContent = '+' + formatINR(stats.totalCredit);
        document.getElementById('kpiCreditCount').textContent = stats.creditCount + ' Cash In entries';
        document.getElementById('kpiTotalDebit').textContent = '-' + formatINR(stats.totalDebit);
        document.getElementById('kpiDebitCount').textContent = stats.debitCount + ' Cash Out entries';

        // Sidebar Active Scope
        document.getElementById('sidebarActiveBookName').textContent = bookLabel;
        document.getElementById('sidebarActiveBookBalance').textContent = formatINR(stats.netBalance);

        // Pending HR + Unpaid Payable Bills
        const pendingPayroll = db.hr
          .filter(function (e) { return e.Payroll_Status !== 'PAID' && (state.activeBookId === 'ALL' || e.Assigned_Book_ID === state.activeBookId); })
          .reduce(function (s, e) { return s + (Number(e.Net_Payable) || 0); }, 0);
        const unpaidPayables = db.bills
          .filter(function (b) { return b.Status !== 'PAID' && b.Direction.indexOf('PAYABLE') !== -1 && (state.activeBookId === 'ALL' || b.Book_ID === state.activeBookId); })
          .reduce(function (s, b) { return s + (Number(b.Amount) || 0); }, 0);

        document.getElementById('kpiTotalPendingDues').textContent = formatINR(pendingPayroll + unpaidPayables);
        document.getElementById('kpiDuesSub').textContent = 'HR: ' + formatINR(pendingPayroll) + ' • Bills: ' + formatINR(unpaidPayables);

        // Update Sidebar Badges
        document.getElementById('navBadgeLedger').textContent = String(db.transactions.length);
        document.getElementById('navBadgeBooks').textContent = String(db.books.length);
        const hrDueCount = db.hr.filter(function (e) { return e.Payroll_Status !== 'PAID'; }).length;
        document.getElementById('navBadgeHR').textContent = hrDueCount + ' Due';
        const overdueCount = db.bills.filter(function (b) { return b.Status === 'OVERDUE'; }).length;
        document.getElementById('navBadgeBills').textContent = overdueCount > 0 ? (overdueCount + ' Overdue') : 'OK';
      }

      function renderDashboard() {
        // 1. Per-Book Overview Table
        const tbody = document.getElementById('dashboardBooksTableBody');
        tbody.innerHTML = '';
        db.books.forEach(function (b) {
          const st = computeBookStats(b.Book_ID);
          const tr = document.createElement('tr');
          tr.className = 'hover:opacity-90 transition';
          tr.innerHTML =
            '<td class="py-2.5 px-3 font-bold text-pri">' + b.Book_Name + '<div class="text-[11px] font-normal text-mut truncate max-w-xs">' + b.Description + '</div></td>' +
            '<td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[11px] font-semibold badge-info">' + b.Category_Type + '</span></td>' +
            '<td class="py-2.5 px-3 text-right font-mono-num text-sec">' + formatINR(st.opening) + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono-num font-semibold" style="color:var(--credit-fg)">+' + formatINR(st.totalCredit) + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono-num font-semibold" style="color:var(--debit-fg)">-' + formatINR(st.totalDebit) + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono-num font-extrabold text-pri">' + formatINR(st.netBalance) + '</td>' +
            '<td class="py-2.5 px-3 text-center"><button type="button" data-select-book="' + b.Book_ID + '" class="themed-input px-2.5 py-1 rounded text-xs font-semibold hover:opacity-80">Open Book</button></td>';
          tbody.appendChild(tr);
        });

        // 2. Urgent Alerts (Overdue/Due Soon Bills + Pending HR Payroll)
        const alertsEl = document.getElementById('dashboardAlertsList');
        alertsEl.innerHTML = '';

        db.bills.filter(function (b) { return b.Status !== 'PAID'; }).forEach(function (b) {
          const isOverdue = b.Status === 'OVERDUE';
          const isReceivable = b.Direction.indexOf('RECEIVABLE') !== -1;
          const badgeCls = isReceivable ? 'badge-info' : (isOverdue ? 'badge-debit' : 'badge-warn');
          const card = document.createElement('div');
          card.className = 'p-2.5 rounded-lg surface-elevated flex items-center justify-between gap-2 text-xs';
          card.innerHTML =
            '<div>' +
              '<div class="flex items-center gap-1.5">' +
                '<span class="px-1.5 py-0.2 rounded text-[10px] font-bold ' + badgeCls + '">' + b.Status + '</span>' +
                '<span class="font-bold text-pri">' + b.Title_Description + '</span>' +
              '</div>' +
              '<div class="text-[11px] text-mut mt-0.5">' + b.Vendor_Or_Party + ' • Due: ' + b.Due_Date + '</div>' +
            '</div>' +
            '<div class="text-right shrink-0">' +
              '<div class="font-mono-num font-bold text-pri">' + formatINR(b.Amount) + '</div>' +
              '<button type="button" data-settle-bill="' + b.Bill_ID + '" class="mt-1 px-2 py-0.5 rounded text-[11px] font-bold btn-accent">' + (isReceivable ? 'Record In' : 'Pay Now') + '</button>' +
            '</div>';
          alertsEl.appendChild(card);
        });

        db.hr.filter(function (e) { return e.Payroll_Status !== 'PAID'; }).forEach(function (e) {
          const card = document.createElement('div');
          card.className = 'p-2.5 rounded-lg surface-elevated flex items-center justify-between gap-2 text-xs';
          card.innerHTML =
            '<div>' +
              '<div class="flex items-center gap-1.5">' +
                '<span class="px-1.5 py-0.2 rounded text-[10px] font-bold badge-warn">HR PAYROLL</span>' +
                '<span class="font-bold text-pri">' + e.Employee_Name + '</span>' +
              '</div>' +
              '<div class="text-[11px] text-mut mt-0.5">' + e.Role_Designation + ' • Adv: ' + formatINR(e.Salary_Advance_Taken) + '</div>' +
            '</div>' +
            '<div class="text-right shrink-0">' +
              '<div class="font-mono-num font-bold text-pri">' + formatINR(e.Net_Payable) + '</div>' +
              '<button type="button" data-disburse-hr="' + e.Emp_ID + '" class="mt-1 px-2 py-0.5 rounded text-[11px] font-bold btn-accent">Disburse</button>' +
            '</div>';
          alertsEl.appendChild(card);
        });

        renderCharts();
      }

      function renderCharts() {
        if (typeof Chart === 'undefined') return;
        const styles = getComputedStyle(document.documentElement);
        const textColor = styles.getPropertyValue('--text-secondary').trim() || '#334155';
        const gridColor = styles.getPropertyValue('--chart-grid').trim() || '#e2e8f0';
        const creditColor = styles.getPropertyValue('--credit-fg').trim() || '#047857';
        const debitColor = styles.getPropertyValue('--debit-fg').trim() || '#be123c';

        // Chart 1: Per-Book Cash In vs Cash Out
        const ctx1 = document.getElementById('booksCashflowChart');
        if (ctx1) {
          const labels = db.books.map(function (b) { return b.Book_Name.split(' ')[0] + ' (' + b.Book_ID.split('-')[1] + ')'; });
          const inData = db.books.map(function (b) { return computeBookStats(b.Book_ID).totalCredit; });
          const outData = db.books.map(function (b) { return computeBookStats(b.Book_ID).totalDebit; });
          const netData = db.books.map(function (b) { return computeBookStats(b.Book_ID).netBalance; });

          if (booksChartInstance) booksChartInstance.destroy();
          booksChartInstance = new Chart(ctx1, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [
                { label: 'Cash In (+)', data: inData, backgroundColor: creditColor, borderRadius: 6 },
                { label: 'Cash Out (-)', data: outData, backgroundColor: debitColor, borderRadius: 6 },
                { label: 'Net Balance', data: netData, backgroundColor: '#3b82f6', borderRadius: 6 }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { labels: { color: textColor, font: { family: 'Inter', size: 11 } } }
              },
              scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
                y: { ticks: { color: textColor }, grid: { color: gridColor } }
              }
            }
          });
        }

        // Chart 2: Expense Breakdown by Category
        const ctx2 = document.getElementById('categoryExpenseChart');
        if (ctx2) {
          const catTotals = {};
          db.transactions
            .filter(function (t) { return t.Type === 'DEBIT' && (state.activeBookId === 'ALL' || t.Book_ID === state.activeBookId); })
            .forEach(function (t) {
              const c = t.Category || 'Other';
              catTotals[c] = (catTotals[c] || 0) + (Number(t.Net_Amount) || 0);
            });
          const catLabels = Object.keys(catTotals);
          const catValues = catLabels.map(function (k) { return catTotals[k]; });
          const palette = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

          if (categoryChartInstance) categoryChartInstance.destroy();
          categoryChartInstance = new Chart(ctx2, {
            type: 'doughnut',
            data: {
              labels: catLabels.length ? catLabels : ['No Debits'],
              datasets: [{
                data: catValues.length ? catValues : [1],
                backgroundColor: palette,
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'right', labels: { color: textColor, font: { family: 'Inter', size: 11 }, boxWidth: 12 } }
              }
            }
          });
        }
      }

      function renderLedger() {
        const search = (document.getElementById('ledgerSearchInput').value || '').toLowerCase().trim();
        const typeFilter = document.getElementById('ledgerTypeFilter').value;
        const modeFilter = document.getElementById('ledgerModeFilter').value;
        const catFilter = document.getElementById('ledgerCategoryFilter').value;
        const dateFilter = document.getElementById('ledgerDateFilter').value;

        // Calculate chronological running balance for the selected book scope
        const stats = computeBookStats(state.activeBookId);
        const scopedTxsChrono = db.transactions
          .filter(function (t) { return state.activeBookId === 'ALL' || t.Book_ID === state.activeBookId; })
          .slice()
          .sort(function (a, b) {
            const da = a.Date + ' ' + (a.Time || '00:00') + ' ' + a.Tx_ID;
            const dbStr = b.Date + ' ' + (b.Time || '00:00') + ' ' + b.Tx_ID;
            return da.localeCompare(dbStr);
          });

        let running = stats.opening;
        const runningMap = {};
        scopedTxsChrono.forEach(function (t) {
          const amt = Number(t.Net_Amount) || Number(t.Amount) || 0;
          running += (t.Type === 'CREDIT' ? amt : -amt);
          runningMap[t.Tx_ID] = running;
        });

        // Apply UI filters & sort newest first for display
        const filtered = scopedTxsChrono.filter(function (t) {
          if (typeFilter !== 'ALL' && t.Type !== typeFilter) return false;
          if (modeFilter !== 'ALL' && t.Payment_Mode !== modeFilter) return false;
          if (catFilter !== 'ALL' && t.Category !== catFilter) return false;
          if (dateFilter === 'TODAY' && t.Date !== '2026-11-09') return false;
          if (dateFilter === 'LAST7' && t.Date < '2026-11-02') return false;
          if (dateFilter === 'THIS_MONTH' && !t.Date.startsWith('2026-11')) return false;
          if (search) {
            const hay = (t.Tx_ID + ' ' + t.Party_Name + ' ' + t.Notes + ' ' + t.Category + ' ' + t.Reference_Bill_No + ' ' + t.Book_Name).toLowerCase();
            if (hay.indexOf(search) === -1) return false;
          }
          return true;
        }).reverse();

        const tbody = document.getElementById('ledgerTableBody');
        tbody.innerHTML = '';

        if (filtered.length === 0) {
          tbody.innerHTML = '<tr><td colspan="9" class="py-8 text-center text-mut">No transactions match the current filters. Click <strong>+ Cash In</strong> or <strong>- Cash Out</strong> to add an entry.</td></tr>';
          return;
        }

        filtered.forEach(function (t) {
          const isCredit = t.Type === 'CREDIT';
          const amt = Number(t.Net_Amount) || Number(t.Amount) || 0;
          const runBal = runningMap[t.Tx_ID] !== undefined ? runningMap[t.Tx_ID] : 0;
          const isSynced = t.Sync_Status === 'SYNCED';

          const tr = document.createElement('tr');
          tr.className = 'hover:opacity-90 transition';
          tr.innerHTML =
            '<td class="py-2.5 px-3 whitespace-nowrap">' +
              '<div class="font-bold text-pri">' + t.Date + ' <span class="text-mut font-normal">' + (t.Time || '') + '</span></div>' +
              '<div class="text-[11px] font-mono-num text-mut">' + t.Tx_ID + (t.Reference_Bill_No ? (' • ' + t.Reference_Bill_No) : '') + '</div>' +
            '</td>' +
            '<td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[11px] font-semibold surface-elevated">' + t.Book_Name + '</span></td>' +
            '<td class="py-2.5 px-3">' +
              '<div class="font-bold text-pri">' + t.Party_Name + ' <span class="text-[10px] font-normal px-1.5 py-0.2 rounded surface-elevated">' + (t.Party_Role || '') + '</span></div>' +
              '<div class="text-[11px] text-mut max-w-xs truncate">' + (t.Notes || '—') + '</div>' +
            '</td>' +
            '<td class="py-2.5 px-3">' +
              '<div class="font-semibold text-sec">' + t.Category + '</div>' +
              '<div class="text-[11px] text-mut">' + t.Payment_Mode + '</div>' +
            '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono-num font-bold" style="color:var(--credit-fg)">' + (isCredit ? ('+' + formatINR(amt)) : '—') + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono-num font-bold" style="color:var(--debit-fg)">' + (!isCredit ? ('-' + formatINR(amt)) : '—') + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono-num font-extrabold text-pri">' + formatINR(runBal) + '</td>' +
            '<td class="py-2.5 px-3 text-center">' +
              '<span class="px-2 py-0.5 rounded text-[10px] font-bold ' + (isSynced ? 'badge-credit' : 'badge-warn') + '">' + (isSynced ? 'SYNCED' : 'QUEUED') + '</span>' +
            '</td>' +
            '<td class="py-2.5 px-3 text-center whitespace-nowrap">' +
              '<button type="button" data-edit-tx="' + t.Tx_ID + '" class="themed-input px-2 py-1 rounded text-[11px] font-semibold mr-1" title="Edit Entry">✏️</button>' +
              '<button type="button" data-del-tx="' + t.Tx_ID + '" class="themed-input px-2 py-1 rounded text-[11px] font-semibold" title="Delete Entry">🗑️</button>' +
            '</td>';
          tbody.appendChild(tr);
        });
      }

      function renderBooksView() {
        const container = document.getElementById('booksGridContainer');
        if (!container) return;
        const searchVal = (document.getElementById('projectSearchInput')?.value || '').toLowerCase().trim();
        const typeFilter = document.getElementById('projectTypeFilter')?.value || 'ALL';
        const statusFilter = document.getElementById('projectStatusFilter')?.value || 'ALL';

        container.innerHTML = '';
        const filteredBooks = db.books.filter(function (b) {
          const stName = b.Status || 'Active';
          if (typeFilter !== 'ALL' && b.Category_Type !== typeFilter) return false;
          if (statusFilter !== 'ALL' && stName !== statusFilter) return false;
          if (searchVal) {
            const hay = (b.Book_ID + ' ' + b.Book_Name + ' ' + b.Description + ' ' + b.Category_Type).toLowerCase();
            if (hay.indexOf(searchVal) === -1) return false;
          }
          return true;
        });

        if (filteredBooks.length === 0) {
          container.innerHTML = '<div class="col-span-2 surface-card p-6 rounded-xl text-center text-xs text-mut">No projects match your current filter. Click <strong>+ Create New Cashbook / Project</strong> to add one.</div>';
          return;
        }

        filteredBooks.forEach(function (b) {
          const st = computeBookStats(b.Book_ID);
          const statusLabel = b.Status || 'Active';
          const statusCls = statusLabel === 'Active' ? 'badge-credit' : (statusLabel === 'On Hold' ? 'badge-warn' : 'surface-elevated');
          const budgetLimit = Number(b.Budget_Limit) || 200000;
          const pctUsed = budgetLimit > 0 ? Math.min(100, Math.round((st.totalDebit / budgetLimit) * 100)) : 0;
          const isOverBudget = budgetLimit > 0 && st.totalDebit > budgetLimit;
          const isSelected = state.activeBookId === b.Book_ID;

          const card = document.createElement('div');
          card.className = 'surface-card p-4 rounded-xl flex flex-col justify-between space-y-3 ' + (isSelected ? 'ring-2 ring-[var(--accent-primary)]' : '');
          card.innerHTML =
            '<div>' +
              '<div class="flex items-start justify-between gap-2">' +
                '<div>' +
                  '<div class="flex flex-wrap items-center gap-1.5">' +
                    '<span class="px-2 py-0.5 rounded text-[10px] font-bold badge-info">' + b.Category_Type + ' • ' + b.Book_ID + '</span>' +
                    '<span class="px-2 py-0.5 rounded text-[10px] font-bold ' + statusCls + '">' + statusLabel + '</span>' +
                    (isSelected ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold btn-accent">Active Filter</span>' : '') +
                  '</div>' +
                  '<h3 class="text-base font-extrabold text-pri mt-1.5">' + b.Book_Name + '</h3>' +
                  '<p class="text-xs text-mut mt-0.5">' + b.Description + '</p>' +
                '</div>' +
                '<div class="flex items-center gap-1 shrink-0">' +
                  '<button type="button" data-toggle-book-status="' + b.Book_ID + '" class="themed-input px-2 py-1 rounded text-[11px] font-semibold" title="Cycle Status (Active / On Hold / Completed / Archived)">🔄 Status</button>' +
                  '<button type="button" data-edit-book="' + b.Book_ID + '" class="themed-input px-2 py-1 rounded text-xs" title="Edit Project Settings">✏️</button>' +
                  '<button type="button" data-del-book="' + b.Book_ID + '" class="themed-input px-2 py-1 rounded text-xs" title="Delete Project">🗑️</button>' +
                '</div>' +
              '</div>' +
              '<div class="grid grid-cols-3 gap-2 mt-3 p-3 rounded-lg surface-elevated text-xs">' +
                '<div><div class="text-[10px] text-mut">Opening</div><div class="font-mono-num font-bold text-sec mt-0.5">' + formatINR(st.opening) + '</div></div>' +
                '<div><div class="text-[10px] text-mut">Cash In (' + st.creditCount + ')</div><div class="font-mono-num font-bold mt-0.5" style="color:var(--credit-fg)">+' + formatINR(st.totalCredit) + '</div></div>' +
                '<div><div class="text-[10px] text-mut">Cash Out (' + st.debitCount + ')</div><div class="font-mono-num font-bold mt-0.5" style="color:var(--debit-fg)">-' + formatINR(st.totalDebit) + '</div></div>' +
              '</div>' +
              '<div class="mt-3 space-y-1">' +
                '<div class="flex items-center justify-between text-[11px]">' +
                  '<span class="text-mut">Outflow vs Budget Cap (' + formatINR(budgetLimit) + ')</span>' +
                  '<span class="font-mono-num font-bold ' + (isOverBudget ? 'text-rose-600' : 'text-sec') + '">' + pctUsed + '%' + (isOverBudget ? ' (Over Cap)' : '') + '</span>' +
                '</div>' +
                '<div class="w-full h-2 rounded-full surface-elevated overflow-hidden">' +
                  '<div class="h-full rounded-full transition-all" style="width:' + pctUsed + '%; background-color:' + (isOverBudget ? 'var(--debit-fg)' : 'var(--accent-primary)') + '"></div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2">' +
              '<div><span class="text-xs text-mut">Net Balance: </span><span class="text-base font-extrabold font-mono-num text-pri">' + formatINR(st.netBalance) + '</span></div>' +
              '<div class="flex items-center gap-1.5">' +
                '<button type="button" data-book-cashin="' + b.Book_ID + '" class="px-2.5 py-1.5 rounded-lg text-[11px] font-bold badge-credit" title="Record Cash In for this Project">+ In</button>' +
                '<button type="button" data-book-cashout="' + b.Book_ID + '" class="px-2.5 py-1.5 rounded-lg text-[11px] font-bold badge-debit" title="Record Cash Out for this Project">- Out</button>' +
                '<button type="button" data-select-book="' + b.Book_ID + '" class="btn-accent px-3 py-1.5 rounded-lg text-xs font-bold">Open Ledger →</button>' +
              '</div>' +
            '</div>';
          container.appendChild(card);
        });
      }

      function computeEmployeeGross(emp) {
        const mode = emp.Salary_Mode || 'Monthly';
        const rate = Number(emp.Pay_Rate) || Number(emp.Base_Monthly_Salary) || 0;
        const units = Number(emp.Days_Worked) || (mode === 'Weekly' ? 4 : 26);
        if (mode === 'Daily') {
          return Math.round(rate * units);
        }
        if (mode === 'Weekly') {
          return Math.round(rate * units);
        }
        // Monthly mode: if Pay_Rate is set, use Base_Monthly_Salary or Pay_Rate
        return Number(emp.Base_Monthly_Salary) || rate;
      }

      function renderHRView() {
        const tbody = document.getElementById('hrTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const modeFilter = document.getElementById('hrModeFilterSelect')?.value || 'ALL';

        let totalNet = 0;
        let totalPaid = 0;
        let totalPending = 0;
        let totalAdvances = 0;

        const scopedHR = db.hr.filter(function (e) {
          const salMode = e.Salary_Mode || 'Monthly';
          if (state.activeBookId !== 'ALL' && e.Assigned_Book_ID !== state.activeBookId) return false;
          if (modeFilter !== 'ALL' && salMode !== modeFilter) return false;
          return true;
        });

        scopedHR.forEach(function (e) {
          const salMode = e.Salary_Mode || 'Monthly';
          const rate = Number(e.Pay_Rate) || Number(e.Base_Monthly_Salary) || 0;
          const gross = computeEmployeeGross(e);
          e.Base_Monthly_Salary = gross;
          const adv = Number(e.Salary_Advance_Taken) || 0;
          const bon = Number(e.Bonus_Allowance) || 0;
          const net = gross - adv + bon;
          e.Net_Payable = net;

          totalNet += net;
          totalAdvances += adv;
          if (e.Payroll_Status === 'PAID') {
            totalPaid += net;
          } else {
            totalPending += net;
          }

          const bookObj = getBookById(e.Assigned_Book_ID);
          const bookName = bookObj ? bookObj.Book_Name : e.Assigned_Book_ID;
          const isPaid = e.Payroll_Status === 'PAID';

          const modeBadgeCls = salMode === 'Daily' ? 'badge-warn' : (salMode === 'Weekly' ? 'badge-info' : 'surface-elevated');
          const unitSuffix = salMode === 'Weekly' ? 'Wks' : 'Days';
          const rateSuffix = salMode === 'Daily' ? '/day' : (salMode === 'Weekly' ? '/wk' : '/mo');

          const tr = document.createElement('tr');
          tr.className = 'hover:opacity-90 transition';
          tr.innerHTML =
            '<td class="py-2.5 px-3">' +
              '<div class="font-bold text-pri">' + e.Employee_Name + ' <span class="text-[10px] font-mono-num text-mut">(' + e.Emp_ID + ')</span></div>' +
              '<div class="text-[11px] text-mut">' + e.Role_Designation + ' • ' + (e.Phone || '') + '</div>' +
            '</td>' +
            '<td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded text-[11px] surface-elevated font-semibold">' + bookName + '</span></td>' +
            '<td class="py-2.5 px-3">' +
              '<span class="px-2 py-0.5 rounded text-[10px] font-bold ' + modeBadgeCls + '">' + salMode.toUpperCase() + '</span>' +
              '<div class="text-[11px] font-mono-num font-semibold text-sec mt-0.5">' + formatINR(rate) + rateSuffix + '</div>' +
            '</td>' +
            '<td class="py-2.5 px-3">' +
              '<div class="font-semibold text-sec flex items-center gap-1">' +
                '<span>' + e.Days_Worked + ' ' + unitSuffix + '</span>' +
                '<button type="button" data-inc-unit="' + e.Emp_ID + '" class="themed-input px-1.5 py-0.2 rounded text-[10px] font-bold" title="Log +1 ' + (salMode === 'Weekly' ? 'Week' : 'Day') + '">+1</button>' +
              '</div>' +
              '<div class="text-[11px] text-mut">' + e.Attendance_Status + '</div>' +
            '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono-num font-semibold text-sec">' + formatINR(gross) + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono-num" style="color:var(--debit-fg)">-' + formatINR(adv) + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono-num" style="color:var(--credit-fg)">+' + formatINR(bon) + '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono-num font-extrabold text-pri">' + formatINR(net) + '</td>' +
            '<td class="py-2.5 px-3 text-center">' +
              '<span class="px-2 py-0.5 rounded text-[10px] font-bold ' + (isPaid ? 'badge-credit' : 'badge-warn') + '">' + e.Payroll_Status + '</span>' +
              '<div class="text-[10px] text-mut mt-0.5">Last: ' + (e.Last_Paid_Date || '—') + '</div>' +
            '</td>' +
            '<td class="py-2.5 px-3 text-center whitespace-nowrap space-x-1">' +
              (!isPaid ? ('<button type="button" data-disburse-hr="' + e.Emp_ID + '" class="btn-accent px-2.5 py-1 rounded text-[11px] font-bold" title="Disburse Net Salary & Auto-Post Cash Out">Pay Salary</button>') : '') +
              '<button type="button" data-advance-hr="' + e.Emp_ID + '" class="themed-input px-2 py-1 rounded text-[11px] font-semibold" title="Give +₹2,000 Cash Advance & Record Debit">+Adv</button>' +
              '<button type="button" data-edit-hr="' + e.Emp_ID + '" class="themed-input px-2 py-1 rounded text-[11px]" title="Edit Employee & Salary Mode">✏️</button>' +
              '<button type="button" data-del-hr="' + e.Emp_ID + '" class="themed-input px-2 py-1 rounded text-[11px]" title="Delete Employee">🗑️</button>' +
            '</td>';
          tbody.appendChild(tr);
        });

        document.getElementById('hrTotalNetPayable').textContent = formatINR(totalNet);
        document.getElementById('hrTotalPaid').textContent = formatINR(totalPaid);
        document.getElementById('hrTotalPending').textContent = formatINR(totalPending);
        document.getElementById('hrTotalAdvances').textContent = formatINR(totalAdvances);
      }

      function renderBillsView() {
        const statusFilter = document.getElementById('billsStatusFilter').value;
        const tbody = document.getElementById('billsTableBody');
        tbody.innerHTML = '';

        let overdueTotal = 0;
        let pendingOutTotal = 0;
        let receivableTotal = 0;
        let paidTotal = 0;

        const scopedBills = db.bills.filter(function (b) {
          return state.activeBookId === 'ALL' || b.Book_ID === state.activeBookId;
        });

        scopedBills.forEach(function (b) {
          const amt = Number(b.Amount) || 0;
          const isReceivable = b.Direction.indexOf('RECEIVABLE') !== -1;
          if (b.Status === 'PAID') {
            paidTotal += amt;
          } else if (isReceivable) {
            receivableTotal += amt;
          } else if (b.Status === 'OVERDUE') {
            overdueTotal += amt;
          } else {
            pendingOutTotal += amt;
          }
        });

        const displayBills = scopedBills.filter(function (b) {
          return statusFilter === 'ALL' || b.Status === statusFilter;
        });

        displayBills.forEach(function (b) {
          const isReceivable = b.Direction.indexOf('RECEIVABLE') !== -1;
          const isPaid = b.Status === 'PAID';
          const badgeClass = isPaid ? 'badge-credit' : (b.Status === 'OVERDUE' ? 'badge-debit' : 'badge-warn');
          const bookObj = getBookById(b.Book_ID);

          const tr = document.createElement('tr');
          tr.className = 'hover:opacity-90 transition';
          tr.innerHTML =
            '<td class="py-2.5 px-3">' +
              '<div class="font-bold text-pri">' + b.Title_Description + '</div>' +
              '<div class="text-[11px] font-mono-num text-mut">' + b.Bill_ID + (b.Linked_Tx_ID ? (' • Linked: ' + b.Linked_Tx_ID) : '') + '</div>' +
            '</td>' +
            '<td class="py-2.5 px-3">' +
              '<div class="font-semibold text-sec">' + b.Vendor_Or_Party + '</div>' +
              '<div class="text-[11px] text-mut">' + (b.Notes || '') + '</div>' +
            '</td>' +
            '<td class="py-2.5 px-3">' +
              '<div class="text-xs font-semibold text-pri">' + (bookObj ? bookObj.Book_Name : b.Book_ID) + '</div>' +
              '<span class="px-1.5 py-0.2 rounded text-[10px] font-bold ' + (isReceivable ? 'badge-info' : 'surface-elevated') + '">' + b.Direction + '</span>' +
            '</td>' +
            '<td class="py-2.5 px-3">' +
              '<div class="font-mono-num font-semibold text-pri">' + b.Due_Date + '</div>' +
              '<div class="text-[11px] text-mut">' + b.Frequency + ' • ' + b.Category + '</div>' +
            '</td>' +
            '<td class="py-2.5 px-3 text-right font-mono-num font-extrabold text-pri">' + formatINR(b.Amount) + '</td>' +
            '<td class="py-2.5 px-3 text-center">' +
              '<span class="px-2 py-0.5 rounded text-[10px] font-bold ' + badgeClass + '">' + b.Status + '</span>' +
            '</td>' +
            '<td class="py-2.5 px-3 text-center whitespace-nowrap space-x-1">' +
              (!isPaid ? ('<button type="button" data-settle-bill="' + b.Bill_ID + '" class="btn-accent px-2.5 py-1 rounded text-[11px] font-bold">' + (isReceivable ? 'Collect In' : 'Pay Bill') + '</button>') : '') +
              '<button type="button" data-edit-bill="' + b.Bill_ID + '" class="themed-input px-2 py-1 rounded text-[11px]" title="Edit Bill">✏️</button>' +
              '<button type="button" data-del-bill="' + b.Bill_ID + '" class="themed-input px-2 py-1 rounded text-[11px]" title="Delete Bill">🗑️</button>' +
            '</td>';
          tbody.appendChild(tr);
        });

        document.getElementById('billsOverdueTotal').textContent = formatINR(overdueTotal);
        document.getElementById('billsPendingOutTotal').textContent = formatINR(pendingOutTotal);
        document.getElementById('billsReceivableTotal').textContent = formatINR(receivableTotal);
        document.getElementById('billsPaidTotal').textContent = formatINR(paidTotal);
      }

      function renderSheetsSyncView() {
        document.getElementById('sheetIdInput').value = sheetConfig.sheetId || '';
        document.getElementById('appsScriptUrlInput').value = sheetConfig.appsScriptUrl || '';

        const outboxList = document.getElementById('offlineQueueList');
        const outboxCount = document.getElementById('outboxCountText');
        const outboxBadge = document.getElementById('outboxStatusBadge');
        outboxCount.textContent = String(offlineQueue.length);

        if (offlineQueue.length === 0) {
          outboxBadge.className = 'text-[11px] px-2 py-0.5 rounded font-bold badge-credit';
          outboxBadge.textContent = 'All Synced';
          outboxList.innerHTML = '<div class="p-3 rounded-lg surface-card text-mut text-center">Zero pending offline operations. Every transaction, HR record, and bill is in sync with Google Sheets.</div>';
        } else {
          outboxBadge.className = 'text-[11px] px-2 py-0.5 rounded font-bold badge-warn';
          outboxBadge.textContent = offlineQueue.length + ' Queued';
          outboxList.innerHTML = '';
          offlineQueue.forEach(function (op) {
            const item = document.createElement('div');
            item.className = 'p-2.5 rounded-lg surface-card flex items-center justify-between gap-2';
            item.innerHTML =
              '<div>' +
                '<div class="font-bold text-pri"><span class="px-1.5 py-0.2 rounded text-[10px] badge-warn mr-1">' + op.action + '</span>' + op.sheetName + ' → ' + op.recordId + '</div>' +
                '<div class="text-[11px] text-mut mt-0.5">' + op.details + '</div>' +
              '</div>' +
              '<span class="text-[10px] font-mono-num text-mut shrink-0">' + op.timestamp.split(' ')[1] + '</span>';
            outboxList.appendChild(item);
          });
        }

        const auditTbody = document.getElementById('syncAuditTableBody');
        auditTbody.innerHTML = '';
        db.auditLogs.slice(0, 25).forEach(function (log) {
          const isPending = log.Status === 'PENDING_SYNC';
          const tr = document.createElement('tr');
          tr.innerHTML =
            '<td class="py-2 px-3 font-mono-num"><div class="font-bold text-pri">' + log.Log_ID + '</div><div class="text-[10px] text-mut">' + log.Timestamp_IST + '</div></td>' +
            '<td class="py-2 px-3 font-bold text-sec">' + log.Operation + '</td>' +
            '<td class="py-2 px-3 font-mono-num text-xs">' + log.Target_Sheet + '</td>' +
            '<td class="py-2 px-3 font-mono-num font-semibold text-pri">' + log.Record_ID + '</td>' +
            '<td class="py-2 px-3 text-mut">' + log.Source_Mode + '</td>' +
            '<td class="py-2 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ' + (isPending ? 'badge-warn' : 'badge-credit') + '">' + log.Status + '</span></td>' +
            '<td class="py-2 px-3 text-sec">' + log.Details + '</td>';
          auditTbody.appendChild(tr);
        });
      }

      function renderAll() {
        renderBookSelectOptions();
        renderCategoryFilterOptions();
        renderKPIStrip();
        renderDashboard();
        renderLedger();
        renderBooksView();
        renderHRView();
        renderBillsView();
        renderSheetsSyncView();
      }

      // ========================================================================
      // NAVIGATION & VIEW SWITCHING
      // ========================================================================
      function switchView(viewName) {
        state.activeView = viewName;
        document.querySelectorAll('.view-section').forEach(function (sec) {
          sec.classList.add('hidden');
        });
        const target = document.getElementById('view-' + viewName);
        if (target) target.classList.remove('hidden');

        // Update nav active styling
        document.querySelectorAll('.nav-tab-btn').forEach(function (btn) {
          const navTarget = btn.getAttribute('data-nav');
          const isMobile = btn.closest('.mobile-bottom-bar') !== null;
          if (navTarget === viewName) {
            if (isMobile) {
              btn.classList.add('mobile-nav-active');
              btn.classList.remove('text-sec');
            } else {
              btn.classList.add('nav-item-active');
              btn.classList.remove('text-sec');
            }
          } else {
            btn.classList.remove('nav-item-active', 'mobile-nav-active');
            btn.classList.add('text-sec');
          }
        });

        if (viewName === 'dashboard') {
          renderCharts();
        }
      }

      // ========================================================================
      // MODAL HANDLERS & CRUD WORKFLOWS
      // ========================================================================
      function openTxModal(defaultType, editTxId) {
        const modal = document.getElementById('txModal');
        const form = document.getElementById('txForm');
        form.reset();
        renderBookSelectOptions();

        if (editTxId) {
          const tx = db.transactions.find(function (t) { return t.Tx_ID === editTxId; });
          if (!tx) return;
          document.getElementById('txModalTitle').textContent = 'Edit Transaction (' + tx.Tx_ID + ')';
          document.getElementById('txIdField').value = tx.Tx_ID;
          setTxModalType(tx.Type);
          document.getElementById('txBookField').value = tx.Book_ID;
          document.getElementById('txDateField').value = tx.Date;
          document.getElementById('txTimeField').value = tx.Time || '12:00';
          document.getElementById('txAmountField').value = tx.Amount;
          document.getElementById('txTaxField').value = tx.Tax_GST || 0;
          document.getElementById('txPartyNameField').value = tx.Party_Name;
          document.getElementById('txPartyRoleField').value = tx.Party_Role || 'Client';
          document.getElementById('txCategoryField').value = tx.Category;
          document.getElementById('txModeField').value = tx.Payment_Mode;
          document.getElementById('txRefField').value = tx.Reference_Bill_No || '';
          document.getElementById('txNotesField').value = tx.Notes || '';
        } else {
          document.getElementById('txIdField').value = '';
          setTxModalType(defaultType || 'CREDIT');
          if (state.activeBookId !== 'ALL') {
            document.getElementById('txBookField').value = state.activeBookId;
          }
          document.getElementById('txDateField').value = '2026-11-09';
          document.getElementById('txTimeField').value = '18:00';
          document.getElementById('txTaxField').value = 0;
        }
        updateTxNetPreview();
        modal.classList.remove('hidden');
      }

      function setTxModalType(type) {
        document.getElementById('txTypeField').value = type;
        const creditBtn = document.getElementById('txTypeCreditBtn');
        const debitBtn = document.getElementById('txTypeDebitBtn');
        const title = document.getElementById('txModalTitle');
        const isEdit = Boolean(document.getElementById('txIdField').value);

        if (type === 'CREDIT') {
          creditBtn.className = 'py-2 rounded-xl font-bold badge-credit text-center shadow-xs';
          debitBtn.className = 'py-2 rounded-xl font-bold surface-elevated text-sec text-center';
          if (!isEdit) title.textContent = 'Record Cash In (Credit / Income)';
        } else {
          debitBtn.className = 'py-2 rounded-xl font-bold badge-debit text-center shadow-xs';
          creditBtn.className = 'py-2 rounded-xl font-bold surface-elevated text-sec text-center';
          if (!isEdit) title.textContent = 'Record Cash Out (Debit / Expense)';
        }
      }

      function updateTxNetPreview() {
        const amt = Number(document.getElementById('txAmountField').value) || 0;
        const tax = Number(document.getElementById('txTaxField').value) || 0;
        document.getElementById('txNetAmountPreview').value = formatINR(amt + tax);
      }

      // Settle Bill -> Auto-creates Ledger Transaction & Marks Bill PAID
      function settleBillById(billId) {
        const bill = db.bills.find(function (b) { return b.Bill_ID === billId; });
        if (!bill || bill.Status === 'PAID') return;

        const isReceivable = bill.Direction.indexOf('RECEIVABLE') !== -1;
        const newTxId = 'TX-' + (1001 + db.transactions.length + Math.floor(Math.random() * 90));
        const bookObj = getBookById(bill.Book_ID);
        const syncState = isEffectivelyOnline() ? 'SYNCED' : 'PENDING_OFFLINE';

        const newTx = {
          Tx_ID: newTxId,
          Date: '2026-11-09',
          Time: '18:05',
          Book_ID: bill.Book_ID,
          Book_Name: bookObj ? bookObj.Book_Name : bill.Book_ID,
          Type: isReceivable ? 'CREDIT' : 'DEBIT',
          Category: bill.Category,
          Party_Name: bill.Vendor_Or_Party,
          Party_Role: isReceivable ? 'Client' : 'Vendor',
          Payment_Mode: bill.Payment_Mode || 'UPI',
          Amount: Number(bill.Amount),
          Tax_GST: 0,
          Net_Amount: Number(bill.Amount),
          Reference_Bill_No: bill.Bill_ID,
          Notes: (isReceivable ? 'Invoice collected: ' : 'Bill paid: ') + bill.Title_Description,
          Sync_Status: syncState,
          Updated_At: new Date().toISOString()
        };

        bill.Status = 'PAID';
        bill.Linked_Tx_ID = newTxId;
        db.transactions.push(newTx);

        dispatchCrudMutation('UPDATE', 'Bills_Payables', bill.Bill_ID, bill, 'Settled bill ' + bill.Bill_ID + ' & auto-created ledger entry ' + newTxId);
        dispatchCrudMutation('CREATE', 'Transactions', newTxId, newTx, 'Auto-posted ' + newTx.Type + ' of ' + formatINR(newTx.Net_Amount) + ' for ' + bill.Title_Description);
      }

      // Disburse HR Salary -> Marks Employee PAID & Auto-creates Cash Out Ledger Entry
      function disburseHrSalary(empId) {
        const emp = db.hr.find(function (e) { return e.Emp_ID === empId; });
        if (!emp || emp.Payroll_Status === 'PAID') return;

        const netPay = (Number(emp.Base_Monthly_Salary) || 0) - (Number(emp.Salary_Advance_Taken) || 0) + (Number(emp.Bonus_Allowance) || 0);
        const newTxId = 'TX-' + (1001 + db.transactions.length + Math.floor(Math.random() * 90));
        const bookObj = getBookById(emp.Assigned_Book_ID);
        const syncState = isEffectivelyOnline() ? 'SYNCED' : 'PENDING_OFFLINE';

        const newTx = {
          Tx_ID: newTxId,
          Date: '2026-11-09',
          Time: '18:10',
          Book_ID: emp.Assigned_Book_ID,
          Book_Name: bookObj ? bookObj.Book_Name : emp.Assigned_Book_ID,
          Type: 'DEBIT',
          Category: 'Staff Salary',
          Party_Name: emp.Employee_Name,
          Party_Role: 'Employee',
          Payment_Mode: emp.Payment_Mode || 'Bank Transfer (NEFT/RTGS)',
          Amount: netPay,
          Tax_GST: 0,
          Net_Amount: netPay,
          Reference_Bill_No: 'PAY-' + emp.Emp_ID,
          Notes: 'Monthly Salary Payout (' + emp.Role_Designation + ') after deducting advance of ' + formatINR(emp.Salary_Advance_Taken),
          Sync_Status: syncState,
          Updated_At: new Date().toISOString()
        };

        emp.Payroll_Status = 'PAID';
        emp.Last_Paid_Date = '2026-11-09';
        db.transactions.push(newTx);

        dispatchCrudMutation('UPDATE', 'HR_Payroll', emp.Emp_ID, emp, 'Disbursed monthly payroll to ' + emp.Employee_Name);
        dispatchCrudMutation('CREATE', 'Transactions', newTxId, newTx, 'Salary Cash Out of ' + formatINR(netPay) + ' for ' + emp.Employee_Name);
      }

      // Record Quick ₹2,000 Salary Advance for Employee
      function recordQuickHrAdvance(empId) {
        const emp = db.hr.find(function (e) { return e.Emp_ID === empId; });
        if (!emp) return;
        const advAmount = 2000;
        emp.Salary_Advance_Taken = (Number(emp.Salary_Advance_Taken) || 0) + advAmount;
        emp.Net_Payable = (Number(emp.Base_Monthly_Salary) || 0) - emp.Salary_Advance_Taken + (Number(emp.Bonus_Allowance) || 0);

        const newTxId = 'TX-' + (1001 + db.transactions.length + Math.floor(Math.random() * 90));
        const bookObj = getBookById(emp.Assigned_Book_ID);
        const syncState = isEffectivelyOnline() ? 'SYNCED' : 'PENDING_OFFLINE';

        const newTx = {
          Tx_ID: newTxId,
          Date: '2026-11-09',
          Time: '18:15',
          Book_ID: emp.Assigned_Book_ID,
          Book_Name: bookObj ? bookObj.Book_Name : emp.Assigned_Book_ID,
          Type: 'DEBIT',
          Category: 'Salary Advance (Udhar)',
          Party_Name: emp.Employee_Name,
          Party_Role: 'Employee',
          Payment_Mode: 'Cash',
          Amount: advAmount,
          Tax_GST: 0,
          Net_Amount: advAmount,
          Reference_Bill_No: 'ADV-' + emp.Emp_ID,
          Notes: 'Staff salary advance recorded from HR module',
          Sync_Status: syncState,
          Updated_At: new Date().toISOString()
        };

        db.transactions.push(newTx);
        dispatchCrudMutation('UPDATE', 'HR_Payroll', emp.Emp_ID, emp, 'Added ₹2,000 salary advance for ' + emp.Employee_Name);
        dispatchCrudMutation('CREATE', 'Transactions', newTxId, newTx, 'Salary Advance Cash Out of ₹2,000 to ' + emp.Employee_Name);
      }

      // ========================================================================
      // EVENT LISTENERS INITIALIZATION
      // ========================================================================
      function initEventListeners() {
        // Apply saved theme on boot
        document.documentElement.setAttribute('data-theme', state.theme);
        document.getElementById('themeSelector').value = state.theme;

        // Theme Switcher
        document.getElementById('themeSelector').addEventListener('change', function (e) {
          state.theme = e.target.value;
          document.documentElement.setAttribute('data-theme', state.theme);
          safeSetStorage(STORAGE_KEYS.THEME, state.theme);
          renderCharts();
          showToast('🎨 Switched theme to ' + e.target.options[e.target.selectedIndex].text, 'credit');
        });

        // Global Book Selector
        document.getElementById('globalBookSelect').addEventListener('change', function (e) {
          state.activeBookId = e.target.value;
          renderAll();
        });

        // Simulate Offline / Online Button
        document.getElementById('toggleNetworkBtn').addEventListener('click', function () {
          state.simulatedOffline = !state.simulatedOffline;
          updateNetworkUI();
          if (!state.simulatedOffline && offlineQueue.length > 0) {
            flushOfflineQueue();
          } else if (state.simulatedOffline) {
            showToast('⚡ Offline Mode enabled! New CRUD actions will queue in LocalStorage.', 'warn');
          } else {
            showToast('🌐 Connected Online to Google Sheets DB!', 'credit');
          }
        });

        document.getElementById('reconnectAndSyncBtn').addEventListener('click', function () {
          state.simulatedOffline = false;
          state.isOnline = true;
          updateNetworkUI();
          flushOfflineQueue();
        });

        // Mobile Phone Viewport Simulator Toggle
        document.getElementById('toggleViewportBtn').addEventListener('click', function () {
          state.mobileSimulator = !state.mobileSimulator;
          const wrapper = document.getElementById('appShellWrapper');
          const label = document.getElementById('viewportBtnLabel');
          if (state.mobileSimulator) {
            wrapper.classList.add('mobile-simulator-wrapper');
            label.textContent = 'Full Web View';
            showToast('📱 Previewing Mobile App Layout (412px frame)', 'credit');
          } else {
            wrapper.classList.remove('mobile-simulator-wrapper');
            label.textContent = 'Mobile View';
            showToast('🖥️ Switched to Full Responsive Website Layout', 'credit');
          }
          setTimeout(renderCharts, 150);
        });

        // Navigation Tabs (Sidebar + Bottom Mobile Bar)
        document.querySelectorAll('.nav-tab-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            const view = btn.getAttribute('data-nav');
            if (view) switchView(view);
          });
        });

        // Quick Goto links
        document.querySelectorAll('[data-goto]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            switchView(btn.getAttribute('data-goto'));
          });
        });

        // Open Transaction Modal Buttons
        ['sidebarCashInBtn', 'topCashInBtn', 'ledgerAddCreditBtn'].forEach(function (id) {
          const el = document.getElementById(id);
          if (el) el.addEventListener('click', function () { openTxModal('CREDIT'); });
        });
        ['sidebarCashOutBtn', 'topCashOutBtn', 'ledgerAddDebitBtn'].forEach(function (id) {
          const el = document.getElementById(id);
          if (el) el.addEventListener('click', function () { openTxModal('DEBIT'); });
        });

        document.getElementById('txTypeCreditBtn').addEventListener('click', function () { setTxModalType('CREDIT'); });
        document.getElementById('txTypeDebitBtn').addEventListener('click', function () { setTxModalType('DEBIT'); });
        document.getElementById('txAmountField').addEventListener('input', updateTxNetPreview);
        document.getElementById('txTaxField').addEventListener('input', updateTxNetPreview);

        document.getElementById('closeTxModalBtn').addEventListener('click', function () {
          document.getElementById('txModal').classList.add('hidden');
        });
        document.getElementById('cancelTxModalBtn').addEventListener('click', function () {
          document.getElementById('txModal').classList.add('hidden');
        });

        // Submit Transaction Form (CREATE / UPDATE)
        document.getElementById('txForm').addEventListener('submit', function (e) {
          e.preventDefault();
          const existingId = document.getElementById('txIdField').value;
          const bookId = document.getElementById('txBookField').value;
          const bookObj = getBookById(bookId);
          const amt = Number(document.getElementById('txAmountField').value) || 0;
          const tax = Number(document.getElementById('txTaxField').value) || 0;
          const net = amt + tax;
          const syncState = isEffectivelyOnline() ? 'SYNCED' : 'PENDING_OFFLINE';

          const txRecord = {
            Tx_ID: existingId || ('TX-' + (1001 + db.transactions.length + Math.floor(Math.random() * 89))),
            Date: document.getElementById('txDateField').value,
            Time: document.getElementById('txTimeField').value,
            Book_ID: bookId,
            Book_Name: bookObj ? bookObj.Book_Name : bookId,
            Type: document.getElementById('txTypeField').value,
            Category: document.getElementById('txCategoryField').value.trim(),
            Party_Name: document.getElementById('txPartyNameField').value.trim(),
            Party_Role: document.getElementById('txPartyRoleField').value,
            Payment_Mode: document.getElementById('txModeField').value,
            Amount: amt,
            Tax_GST: tax,
            Net_Amount: net,
            Reference_Bill_No: document.getElementById('txRefField').value.trim(),
            Notes: document.getElementById('txNotesField').value.trim(),
            Sync_Status: syncState,
            Updated_At: new Date().toISOString()
          };

          if (existingId) {
            const idx = db.transactions.findIndex(function (t) { return t.Tx_ID === existingId; });
            if (idx !== -1) db.transactions[idx] = txRecord;
            document.getElementById('txModal').classList.add('hidden');
            dispatchCrudMutation('UPDATE', 'Transactions', txRecord.Tx_ID, txRecord, 'Updated ' + txRecord.Type + ' entry for ' + txRecord.Party_Name + ' (' + formatINR(net) + ')');
          } else {
            db.transactions.push(txRecord);
            document.getElementById('txModal').classList.add('hidden');
            dispatchCrudMutation('CREATE', 'Transactions', txRecord.Tx_ID, txRecord, 'Added ' + txRecord.Type + ' entry for ' + txRecord.Party_Name + ' (' + formatINR(net) + ')');
          }
        });

        // Ledger Filter Controls
        ['ledgerSearchInput', 'ledgerTypeFilter', 'ledgerModeFilter', 'ledgerCategoryFilter', 'ledgerDateFilter'].forEach(function (id) {
          const el = document.getElementById(id);
          if (el) el.addEventListener('input', renderLedger);
          if (el) el.addEventListener('change', renderLedger);
        });
        document.getElementById('ledgerResetFiltersBtn').addEventListener('click', function () {
          document.getElementById('ledgerSearchInput').value = '';
          document.getElementById('ledgerTypeFilter').value = 'ALL';
          document.getElementById('ledgerModeFilter').value = 'ALL';
          document.getElementById('ledgerCategoryFilter').value = 'ALL';
          document.getElementById('ledgerDateFilter').value = 'ALL';
          renderLedger();
        });

        // Book Modal & Project Controls
        function openBookModal(editBookId) {
          const modal = document.getElementById('bookModal');
          document.getElementById('bookForm').reset();
          if (editBookId) {
            const b = getBookById(editBookId);
            if (!b) return;
            document.getElementById('bookModalTitle').textContent = 'Edit Project / Cashbook (' + b.Book_ID + ')';
            document.getElementById('bookIdField').value = b.Book_ID;
            document.getElementById('bookNameField').value = b.Book_Name;
            document.getElementById('bookTypeField').value = b.Category_Type;
            document.getElementById('bookStatusField').value = b.Status || 'Active';
            document.getElementById('bookOpeningField').value = b.Opening_Balance;
            document.getElementById('bookBudgetField').value = b.Budget_Limit || 200000;
            document.getElementById('bookDescField').value = b.Description;
          } else {
            document.getElementById('bookModalTitle').textContent = 'Create New Cashbook / Work Project';
            document.getElementById('bookIdField').value = '';
            document.getElementById('bookStatusField').value = 'Active';
            document.getElementById('bookBudgetField').value = 200000;
          }
          modal.classList.remove('hidden');
        }
        document.getElementById('dashNewBookBtn').addEventListener('click', function () { openBookModal(); });
        document.getElementById('booksAddBookBtn').addEventListener('click', function () { openBookModal(); });
        document.getElementById('closeBookModalBtn').addEventListener('click', function () { document.getElementById('bookModal').classList.add('hidden'); });
        document.getElementById('cancelBookModalBtn').addEventListener('click', function () { document.getElementById('bookModal').classList.add('hidden'); });

        document.getElementById('booksShowAllLedgerBtn').addEventListener('click', function () {
          state.activeBookId = 'ALL';
          document.getElementById('globalBookSelect').value = 'ALL';
          renderAll();
          switchView('ledger');
          showToast('🌐 Showing Consolidated Ledger across all projects', 'credit');
        });

        ['projectSearchInput', 'projectTypeFilter', 'projectStatusFilter'].forEach(function (id) {
          const el = document.getElementById(id);
          if (el) {
            el.addEventListener('input', renderBooksView);
            el.addEventListener('change', renderBooksView);
          }
        });

        document.getElementById('bookForm').addEventListener('submit', function (e) {
          e.preventDefault();
          const existingId = document.getElementById('bookIdField').value;
          const nextNum = db.books.length + 1 + Math.floor(Math.random() * 9);
          const bookRecord = {
            Book_ID: existingId || ('BOOK-0' + nextNum),
            Book_Name: document.getElementById('bookNameField').value.trim(),
            Category_Type: document.getElementById('bookTypeField').value,
            Currency: 'INR',
            Opening_Balance: Number(document.getElementById('bookOpeningField').value) || 0,
            Budget_Limit: Number(document.getElementById('bookBudgetField').value) || 200000,
            Status: document.getElementById('bookStatusField').value || 'Active',
            Description: document.getElementById('bookDescField').value.trim() || 'Project cashbook ledger'
          };
          document.getElementById('bookModal').classList.add('hidden');
          if (existingId) {
            const idx = db.books.findIndex(function (b) { return b.Book_ID === existingId; });
            if (idx !== -1) db.books[idx] = bookRecord;
            // Also update Book_Name on linked transactions
            db.transactions.forEach(function (t) {
              if (t.Book_ID === existingId) t.Book_Name = bookRecord.Book_Name;
            });
            dispatchCrudMutation('UPDATE', 'Projects_Books', bookRecord.Book_ID, bookRecord, 'Updated project ' + bookRecord.Book_Name + ' (' + bookRecord.Status + ')');
          } else {
            db.books.push(bookRecord);
            dispatchCrudMutation('CREATE', 'Projects_Books', bookRecord.Book_ID, bookRecord, 'Created new cashbook ' + bookRecord.Book_Name);
          }
        });

        // Safe Delete Project Modal Controls
        function openDeleteBookModal(bookId) {
          if (db.books.length <= 1) {
            showToast('At least 1 active Cashbook is required.', 'warn');
            return;
          }
          const b = getBookById(bookId);
          if (!b) return;
          const linkedTxCount = db.transactions.filter(function (t) { return t.Book_ID === bookId; }).length;
          const linkedBillCount = db.bills.filter(function (x) { return x.Book_ID === bookId; }).length;
          document.getElementById('deleteBookTargetId').value = bookId;
          document.getElementById('deleteBookTargetName').textContent = b.Book_Name + ' (' + b.Book_ID + ')';
          document.getElementById('deleteBookTargetStats').textContent = linkedTxCount + ' transactions, ' + linkedBillCount + ' bills';
          document.getElementById('deleteBookModal').classList.remove('hidden');
        }
        document.getElementById('closeDeleteBookModalBtn').addEventListener('click', function () {
          document.getElementById('deleteBookModal').classList.add('hidden');
        });
        document.getElementById('cancelDeleteBookModalBtn').addEventListener('click', function () {
          document.getElementById('deleteBookModal').classList.add('hidden');
        });
        document.getElementById('confirmDeleteBookBtn').addEventListener('click', function () {
          const delBookId = document.getElementById('deleteBookTargetId').value;
          const modeEl = document.querySelector('input[name="deleteCascadeMode"]:checked');
          const mode = modeEl ? modeEl.value : 'reassign';
          const idx = db.books.findIndex(function (b) { return b.Book_ID === delBookId; });
          if (idx === -1) return;
          const removed = db.books.splice(idx, 1)[0];
          const fallbackBook = db.books[0];

          if (mode === 'purge') {
            db.transactions = db.transactions.filter(function (t) { return t.Book_ID !== delBookId; });
            db.bills = db.bills.filter(function (x) { return x.Book_ID !== delBookId; });
          } else if (fallbackBook) {
            db.transactions.forEach(function (t) {
              if (t.Book_ID === delBookId) {
                t.Book_ID = fallbackBook.Book_ID;
                t.Book_Name = fallbackBook.Book_Name;
              }
            });
            db.bills.forEach(function (x) {
              if (x.Book_ID === delBookId) x.Book_ID = fallbackBook.Book_ID;
            });
            db.hr.forEach(function (emp) {
              if (emp.Assigned_Book_ID === delBookId) emp.Assigned_Book_ID = fallbackBook.Book_ID;
            });
          }

          if (state.activeBookId === delBookId) state.activeBookId = 'ALL';
          document.getElementById('deleteBookModal').classList.add('hidden');
          dispatchCrudMutation('DELETE', 'Projects_Books', delBookId, removed, 'Deleted project ' + removed.Book_Name + ' (mode: ' + mode + ')');
        });

        // HR Modal & Salary Mode (Monthly / Weekly / Daily) Controls
        function setHrSalaryModeUI(mode, preserveValues) {
          document.getElementById('hrSalaryModeField').value = mode;
          document.querySelectorAll('.hr-salmode-btn').forEach(function (b) {
            if (b.getAttribute('data-set-salmode') === mode) {
              b.className = 'hr-salmode-btn py-2 px-2 rounded-lg font-bold btn-accent text-center';
            } else {
              b.className = 'hr-salmode-btn py-2 px-2 rounded-lg font-bold surface-card text-sec text-center';
            }
          });

          const rateLabel = document.getElementById('hrRateLabel');
          const unitsLabel = document.getElementById('hrUnitsLabel');
          const hint = document.getElementById('hrModeFormulaHint');
          const rateInput = document.getElementById('hrPayRateField');
          const unitsInput = document.getElementById('hrDaysField');
          const attInput = document.getElementById('hrAttendanceField');

          if (mode === 'Daily') {
            rateLabel.textContent = 'Daily Wage Rate (₹/Day) *';
            unitsLabel.textContent = 'Days Worked *';
            hint.textContent = 'Gross = Daily Rate × Days Worked';
            if (!preserveValues) {
              rateInput.value = 1200;
              unitsInput.value = 25;
              attInput.value = '25 Daily Shifts';
            }
          } else if (mode === 'Weekly') {
            rateLabel.textContent = 'Weekly Pay Rate (₹/Week) *';
            unitsLabel.textContent = 'Weeks Worked *';
            hint.textContent = 'Gross = Weekly Rate × Weeks Worked';
            if (!preserveValues) {
              rateInput.value = 8500;
              unitsInput.value = 4;
              attInput.value = '4 Weeks Logged';
            }
          } else {
            rateLabel.textContent = 'Monthly Salary Rate (₹/Mo) *';
            unitsLabel.textContent = 'Days Worked (of 26)';
            hint.textContent = 'Fixed Monthly Salary (or pro-rata)';
            if (!preserveValues) {
              rateInput.value = 38000;
              unitsInput.value = 26;
              attInput.value = 'Present (26/26 Days)';
            }
          }
          recalcHrModalPreview();
        }

        function recalcHrModalPreview() {
          const mode = document.getElementById('hrSalaryModeField').value || 'Monthly';
          const rate = Number(document.getElementById('hrPayRateField').value) || 0;
          const units = Number(document.getElementById('hrDaysField').value) || 0;
          let gross = rate;
          if (mode === 'Daily' || mode === 'Weekly') {
            gross = Math.round(rate * units);
          } else {
            // Monthly mode: full rate for 26 days, or pro-rata if user adjusts days != 26
            gross = units === 26 || units <= 0 ? rate : Math.round((rate / 26) * units);
          }
          document.getElementById('hrBaseSalaryField').value = gross;
          const adv = Number(document.getElementById('hrAdvanceField').value) || 0;
          const bon = Number(document.getElementById('hrBonusField').value) || 0;
          document.getElementById('hrNetPayablePreview').value = formatINR(gross - adv + bon);
        }

        document.querySelectorAll('.hr-salmode-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            setHrSalaryModeUI(btn.getAttribute('data-set-salmode'), false);
          });
        });

        ['hrPayRateField', 'hrDaysField', 'hrAdvanceField', 'hrBonusField'].forEach(function (id) {
          const el = document.getElementById(id);
          if (el) el.addEventListener('input', recalcHrModalPreview);
        });

        document.getElementById('hrBaseSalaryField').addEventListener('input', function () {
          const gross = Number(document.getElementById('hrBaseSalaryField').value) || 0;
          const adv = Number(document.getElementById('hrAdvanceField').value) || 0;
          const bon = Number(document.getElementById('hrBonusField').value) || 0;
          document.getElementById('hrNetPayablePreview').value = formatINR(gross - adv + bon);
        });

        document.getElementById('hrModeFilterSelect').addEventListener('change', renderHRView);

        function openHrModal(editEmpId) {
          const modal = document.getElementById('hrModal');
          document.getElementById('hrForm').reset();
          renderBookSelectOptions();
          if (editEmpId) {
            const emp = db.hr.find(function (x) { return x.Emp_ID === editEmpId; });
            if (!emp) return;
            const salMode = emp.Salary_Mode || 'Monthly';
            document.getElementById('hrModalTitle').textContent = 'Edit Employee (' + emp.Emp_ID + ' • ' + salMode + ')';
            document.getElementById('hrIdField').value = emp.Emp_ID;
            document.getElementById('hrNameField').value = emp.Employee_Name;
            document.getElementById('hrRoleField').value = emp.Role_Designation;
            document.getElementById('hrBookField').value = emp.Assigned_Book_ID;
            document.getElementById('hrPhoneField').value = emp.Phone || '';
            document.getElementById('hrPayRateField').value = emp.Pay_Rate || emp.Base_Monthly_Salary || 35000;
            document.getElementById('hrDaysField').value = emp.Days_Worked || (salMode === 'Weekly' ? 4 : 26);
            document.getElementById('hrBaseSalaryField').value = emp.Base_Monthly_Salary;
            document.getElementById('hrAdvanceField').value = emp.Salary_Advance_Taken || 0;
            document.getElementById('hrBonusField').value = emp.Bonus_Allowance || 0;
            document.getElementById('hrAttendanceField').value = emp.Attendance_Status || 'Present';
            document.getElementById('hrModeField').value = emp.Payment_Mode || 'UPI';
            setHrSalaryModeUI(salMode, true);
          } else {
            document.getElementById('hrModalTitle').textContent = 'Add Employee / Contractor (Monthly, Weekly or Daily)';
            document.getElementById('hrIdField').value = '';
            setHrSalaryModeUI('Monthly', false);
          }
          modal.classList.remove('hidden');
        }
        document.getElementById('hrAddEmployeeBtn').addEventListener('click', function () { openHrModal(); });
        document.getElementById('quickAddStaffBtn').addEventListener('click', function () { openHrModal(); });
        document.getElementById('closeHrModalBtn').addEventListener('click', function () { document.getElementById('hrModal').classList.add('hidden'); });
        document.getElementById('cancelHrModalBtn').addEventListener('click', function () { document.getElementById('hrModal').classList.add('hidden'); });

        document.getElementById('hrForm').addEventListener('submit', function (e) {
          e.preventDefault();
          const existingId = document.getElementById('hrIdField').value;
          const salMode = document.getElementById('hrSalaryModeField').value || 'Monthly';
          const rate = Number(document.getElementById('hrPayRateField').value) || 0;
          const units = Number(document.getElementById('hrDaysField').value) || (salMode === 'Weekly' ? 4 : 26);
          const base = Number(document.getElementById('hrBaseSalaryField').value) || 0;
          const adv = Number(document.getElementById('hrAdvanceField').value) || 0;
          const bon = Number(document.getElementById('hrBonusField').value) || 0;
          const empRecord = {
            Emp_ID: existingId || ('EMP-0' + (db.hr.length + 1)),
            Employee_Name: document.getElementById('hrNameField').value.trim(),
            Role_Designation: document.getElementById('hrRoleField').value.trim(),
            Assigned_Book_ID: document.getElementById('hrBookField').value,
            Phone: document.getElementById('hrPhoneField').value.trim(),
            Salary_Mode: salMode,
            Pay_Rate: rate,
            Base_Monthly_Salary: base,
            Days_Worked: units,
            Attendance_Status: document.getElementById('hrAttendanceField').value.trim(),
            Salary_Advance_Taken: adv,
            Bonus_Allowance: bon,
            Net_Payable: base - adv + bon,
            Payroll_Status: 'PENDING',
            Last_Paid_Date: '—',
            Payment_Mode: document.getElementById('hrModeField').value
          };
          document.getElementById('hrModal').classList.add('hidden');
          if (existingId) {
            const idx = db.hr.findIndex(function (x) { return x.Emp_ID === existingId; });
            if (idx !== -1) {
              empRecord.Payroll_Status = db.hr[idx].Payroll_Status;
              empRecord.Last_Paid_Date = db.hr[idx].Last_Paid_Date;
              db.hr[idx] = empRecord;
            }
            dispatchCrudMutation('UPDATE', 'HR_Payroll', empRecord.Emp_ID, empRecord, 'Updated ' + salMode + ' payroll for ' + empRecord.Employee_Name);
          } else {
            db.hr.push(empRecord);
            dispatchCrudMutation('CREATE', 'HR_Payroll', empRecord.Emp_ID, empRecord, 'Added ' + salMode + ' employee ' + empRecord.Employee_Name + ' (' + formatINR(empRecord.Net_Payable) + ')');
          }
        });

        // Bill Modal Controls
        function openBillModal(editBillId) {
          const modal = document.getElementById('billModal');
          document.getElementById('billForm').reset();
          renderBookSelectOptions();
          if (editBillId) {
            const bill = db.bills.find(function (x) { return x.Bill_ID === editBillId; });
            if (!bill) return;
            document.getElementById('billModalTitle').textContent = 'Edit Bill / Invoice (' + bill.Bill_ID + ')';
            document.getElementById('billIdField').value = bill.Bill_ID;
            document.getElementById('billTitleField').value = bill.Title_Description;
            document.getElementById('billPartyField').value = bill.Vendor_Or_Party;
            document.getElementById('billBookField').value = bill.Book_ID;
            document.getElementById('billDirectionField').value = bill.Direction;
            document.getElementById('billCategoryField').value = bill.Category;
            document.getElementById('billAmountField').value = bill.Amount;
            document.getElementById('billDueDateField').value = bill.Due_Date;
            document.getElementById('billFreqField').value = bill.Frequency;
            document.getElementById('billStatusField').value = bill.Status;
            document.getElementById('billNotesField').value = bill.Notes || '';
          } else {
            document.getElementById('billModalTitle').textContent = 'Add New Bill or Receivable Invoice';
            document.getElementById('billIdField').value = '';
          }
          modal.classList.remove('hidden');
        }
        document.getElementById('billsAddBillBtn').addEventListener('click', function () { openBillModal(); });
        document.getElementById('quickAddBillBtn').addEventListener('click', function () { openBillModal(); });
        document.getElementById('closeBillModalBtn').addEventListener('click', function () { document.getElementById('billModal').classList.add('hidden'); });
        document.getElementById('cancelBillModalBtn').addEventListener('click', function () { document.getElementById('billModal').classList.add('hidden'); });
        document.getElementById('billsStatusFilter').addEventListener('change', renderBillsView);

        document.getElementById('billForm').addEventListener('submit', function (e) {
          e.preventDefault();
          const existingId = document.getElementById('billIdField').value;
          const billRecord = {
            Bill_ID: existingId || ('BILL-' + (101 + db.bills.length + Math.floor(Math.random() * 50))),
            Title_Description: document.getElementById('billTitleField').value.trim(),
            Vendor_Or_Party: document.getElementById('billPartyField').value.trim(),
            Book_ID: document.getElementById('billBookField').value,
            Direction: document.getElementById('billDirectionField').value,
            Category: document.getElementById('billCategoryField').value.trim(),
            Due_Date: document.getElementById('billDueDateField').value,
            Frequency: document.getElementById('billFreqField').value,
            Amount: Number(document.getElementById('billAmountField').value) || 0,
            Status: document.getElementById('billStatusField').value,
            Payment_Mode: 'UPI',
            Linked_Tx_ID: '',
            Notes: document.getElementById('billNotesField').value.trim()
          };
          document.getElementById('billModal').classList.add('hidden');
          if (existingId) {
            const idx = db.bills.findIndex(function (x) { return x.Bill_ID === existingId; });
            if (idx !== -1) db.bills[idx] = billRecord;
            dispatchCrudMutation('UPDATE', 'Bills_Payables', billRecord.Bill_ID, billRecord, 'Updated bill ' + billRecord.Title_Description);
          } else {
            db.bills.push(billRecord);
            dispatchCrudMutation('CREATE', 'Bills_Payables', billRecord.Bill_ID, billRecord, 'Added bill ' + billRecord.Title_Description + ' (' + formatINR(billRecord.Amount) + ')');
          }
        });

        // Event Delegation for Dynamic Table & Card Buttons (Edit, Delete, Settle, Disburse, Select Book)
        document.body.addEventListener('click', function (e) {
          const btn = e.target.closest('button');
          if (!btn) return;

          const selectBookId = btn.getAttribute('data-select-book');
          if (selectBookId) {
            state.activeBookId = selectBookId;
            document.getElementById('globalBookSelect').value = selectBookId;
            renderAll();
            switchView('ledger');
            showToast('📂 Filtered ledger to ' + (getBookById(selectBookId)?.Book_Name || selectBookId), 'credit');
            return;
          }

          const editTxId = btn.getAttribute('data-edit-tx');
          if (editTxId) {
            openTxModal(null, editTxId);
            return;
          }

          const delTxId = btn.getAttribute('data-del-tx');
          if (delTxId) {
            const idx = db.transactions.findIndex(function (t) { return t.Tx_ID === delTxId; });
            if (idx !== -1) {
              const removed = db.transactions.splice(idx, 1)[0];
              dispatchCrudMutation('DELETE', 'Transactions', delTxId, removed, 'Deleted transaction ' + delTxId + ' (' + removed.Party_Name + ')');
            }
            return;
          }

          const editBookId = btn.getAttribute('data-edit-book');
          if (editBookId) {
            openBookModal(editBookId);
            return;
          }

          const toggleStatusBookId = btn.getAttribute('data-toggle-book-status');
          if (toggleStatusBookId) {
            const b = getBookById(toggleStatusBookId);
            if (b) {
              const order = ['Active', 'On Hold', 'Completed', 'Archived'];
              const nextStatus = order[(order.indexOf(b.Status || 'Active') + 1) % order.length];
              b.Status = nextStatus;
              dispatchCrudMutation('UPDATE', 'Projects_Books', b.Book_ID, b, 'Changed project ' + b.Book_Name + ' status to ' + nextStatus);
            }
            return;
          }

          const bookCashInId = btn.getAttribute('data-book-cashin');
          if (bookCashInId) {
            state.activeBookId = bookCashInId;
            openTxModal('CREDIT');
            document.getElementById('txBookField').value = bookCashInId;
            return;
          }

          const bookCashOutId = btn.getAttribute('data-book-cashout');
          if (bookCashOutId) {
            state.activeBookId = bookCashOutId;
            openTxModal('DEBIT');
            document.getElementById('txBookField').value = bookCashOutId;
            return;
          }

          const delBookId = btn.getAttribute('data-del-book');
          if (delBookId) {
            openDeleteBookModal(delBookId);
            return;
          }

          const incUnitEmpId = btn.getAttribute('data-inc-unit');
          if (incUnitEmpId) {
            const emp = db.hr.find(function (x) { return x.Emp_ID === incUnitEmpId; });
            if (emp) {
              const salMode = emp.Salary_Mode || 'Monthly';
              emp.Days_Worked = (Number(emp.Days_Worked) || 0) + 1;
              emp.Base_Monthly_Salary = computeEmployeeGross(emp);
              emp.Net_Payable = emp.Base_Monthly_Salary - (Number(emp.Salary_Advance_Taken) || 0) + (Number(emp.Bonus_Allowance) || 0);
              emp.Attendance_Status = emp.Days_Worked + (salMode === 'Weekly' ? ' Weeks Logged' : (salMode === 'Daily' ? ' Daily Shifts' : '/26 Days'));
              dispatchCrudMutation('UPDATE', 'HR_Payroll', emp.Emp_ID, emp, 'Logged +1 ' + (salMode === 'Weekly' ? 'week' : 'day') + ' for ' + emp.Employee_Name + ' (Net: ' + formatINR(emp.Net_Payable) + ')');
            }
            return;
          }

          const disburseId = btn.getAttribute('data-disburse-hr');
          if (disburseId) {
            disburseHrSalary(disburseId);
            return;
          }

          const advanceId = btn.getAttribute('data-advance-hr');
          if (advanceId) {
            recordQuickHrAdvance(advanceId);
            return;
          }

          const editHrId = btn.getAttribute('data-edit-hr');
          if (editHrId) {
            openHrModal(editHrId);
            return;
          }

          const delHrId = btn.getAttribute('data-del-hr');
          if (delHrId) {
            const idx = db.hr.findIndex(function (x) { return x.Emp_ID === delHrId; });
            if (idx !== -1) {
              const removed = db.hr.splice(idx, 1)[0];
              dispatchCrudMutation('DELETE', 'HR_Payroll', delHrId, removed, 'Removed employee ' + removed.Employee_Name);
            }
            return;
          }

          const settleBill = btn.getAttribute('data-settle-bill');
          if (settleBill) {
            settleBillById(settleBill);
            return;
          }

          const editBillId = btn.getAttribute('data-edit-bill');
          if (editBillId) {
            openBillModal(editBillId);
            return;
          }

          const delBillId = btn.getAttribute('data-del-bill');
          if (delBillId) {
            const idx = db.bills.findIndex(function (x) { return x.Bill_ID === delBillId; });
            if (idx !== -1) {
              const removed = db.bills.splice(idx, 1)[0];
              dispatchCrudMutation('DELETE', 'Bills_Payables', delBillId, removed, 'Deleted bill ' + removed.Title_Description);
            }
            return;
          }
        });

        // Google Sheets Sync Center Buttons
        document.getElementById('forceSyncNowBtn').addEventListener('click', flushOfflineQueue);

        // Auto-extract Sheet ID on change/paste in sheetIdInput
        document.getElementById('sheetIdInput').addEventListener('input', function (e) {
          const extracted = extractSheetId(e.target.value);
          if (extracted && extracted !== e.target.value) {
            e.target.value = extracted;
          }
        });

        document.getElementById('saveSheetConfigBtn').addEventListener('click', function () {
          const rawId = document.getElementById('sheetIdInput').value.trim();
          const cleanId = extractSheetId(rawId);
          const rawUrl = document.getElementById('appsScriptUrlInput').value.trim();

          sheetConfig.sheetId = cleanId;
          sheetConfig.appsScriptUrl = rawUrl;
          sheetConfig.isConfigured = Boolean(cleanId || rawUrl);
          safeSetStorage(STORAGE_KEYS.CONFIG, sheetConfig);

          updateNetworkUI();
          renderSheetsSyncView();
          showToast(sheetConfig.isConfigured
            ? '✅ Saved your personal Google Sheet configuration!'
            : '💾 Saved configuration (Local storage mode active).', 'credit');
        });

        const disconnectBtn = document.getElementById('disconnectSheetBtn');
        if (disconnectBtn) {
          disconnectBtn.addEventListener('click', function () {
            sheetConfig = { sheetId: '', appsScriptUrl: '', isConfigured: false };
            safeSetStorage(STORAGE_KEYS.CONFIG, sheetConfig);
            document.getElementById('sheetIdInput').value = '';
            document.getElementById('appsScriptUrlInput').value = '';
            updateNetworkUI();
            renderSheetsSyncView();
            showToast('🔌 Disconnected Google Sheet. Operating in private local mode.', 'warn');
          });
        }

        // Connect Sheet Modal Handlers
        const connectModal = document.getElementById('connectSheetModal');
        function openConnectSheetModal() {
          if (!connectModal) return;
          const urlInput = document.getElementById('modalAppsScriptUrl');
          const sheetInput = document.getElementById('modalSheetUrlOrId');
          if (urlInput) urlInput.value = sheetConfig.appsScriptUrl || '';
          if (sheetInput) sheetInput.value = sheetConfig.sheetId ? ('https://docs.google.com/spreadsheets/d/' + sheetConfig.sheetId + '/edit') : '';
          connectModal.classList.remove('hidden');
        }

        function closeConnectSheetModal() {
          if (connectModal) connectModal.classList.add('hidden');
        }

        const headerSheetBtn = document.getElementById('headerSheetBtn');
        if (headerSheetBtn) {
          headerSheetBtn.addEventListener('click', function () {
            if (sheetConfig && sheetConfig.isConfigured && sheetConfig.sheetId) {
              window.open('https://docs.google.com/spreadsheets/d/' + sheetConfig.sheetId + '/edit', '_blank');
            } else {
              openConnectSheetModal();
            }
          });
        }

        const openConnectBtn = document.getElementById('openConnectModalBtn');
        if (openConnectBtn) openConnectBtn.addEventListener('click', openConnectSheetModal);

        const openConnectFromSheetsBtn = document.getElementById('openConnectModalFromSheetsBtn');
        if (openConnectFromSheetsBtn) openConnectFromSheetsBtn.addEventListener('click', openConnectSheetModal);

        const closeConnectBtn = document.getElementById('closeConnectSheetModalBtn');
        if (closeConnectBtn) closeConnectBtn.addEventListener('click', closeConnectSheetModal);

        const cancelConnectBtn = document.getElementById('cancelConnectSheetModalBtn');
        if (cancelConnectBtn) cancelConnectBtn.addEventListener('click', closeConnectSheetModal);

        const dismissBannerBtn = document.getElementById('dismissFirstTimeBannerBtn');
        if (dismissBannerBtn) {
          dismissBannerBtn.addEventListener('click', function () {
            const banner = document.getElementById('firstTimeUserBanner');
            if (banner) banner.classList.add('hidden');
            try { sessionStorage.setItem('cashbook_pro_banner_dismissed', 'true'); } catch (e) {}
          });
        }

        const offlineModeBtn = document.getElementById('useOfflineModeBtn');
        if (offlineModeBtn) {
          offlineModeBtn.addEventListener('click', function () {
            closeConnectSheetModal();
            showToast('💾 Operating in local browser storage mode. Data is saved on this device.', 'credit');
          });
        }

        const connectForm = document.getElementById('connectSheetForm');
        if (connectForm) {
          connectForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const rawUrl = document.getElementById('modalAppsScriptUrl').value.trim();
            const rawSheet = document.getElementById('modalSheetUrlOrId').value.trim();
            const cleanId = extractSheetId(rawSheet);

            sheetConfig.appsScriptUrl = rawUrl;
            sheetConfig.sheetId = cleanId;
            sheetConfig.isConfigured = Boolean(rawUrl || cleanId);
            safeSetStorage(STORAGE_KEYS.CONFIG, sheetConfig);

            closeConnectSheetModal();
            updateNetworkUI();
            renderSheetsSyncView();
            showToast('🎉 Connected your Google Sheet successfully! Cloud sync is now active.', 'credit');
          });
        }

        document.getElementById('pullFromSheetsBtn').addEventListener('click', async function () {
          if (!isEffectivelyOnline()) {
            showToast('⚡ Cannot pull from Google Sheets while Offline. Serving cached LocalStorage data.', 'warn');
            return;
          }
          let sheetPulled = false;
          if (sheetConfig.appsScriptUrl && sheetConfig.appsScriptUrl.startsWith('https://')) {
            try {
              const res = await fetch(sheetConfig.appsScriptUrl);
              const data = await res.json();
              if (data && data.status === 'OK') {
                if (Array.isArray(data.books) && data.books.length) db.books = data.books;
                if (Array.isArray(data.transactions) && data.transactions.length) db.transactions = data.transactions;
                if (Array.isArray(data.hr) && data.hr.length) db.hr = data.hr;
                if (Array.isArray(data.bills) && data.bills.length) db.bills = data.bills;
                sheetPulled = true;
              }
            } catch (e) {
              // Fallback
            }
          }
          const targetName = sheetConfig.sheetId ? (sheetConfig.sheetId.slice(0, 10) + '...') : 'Local Database';
          db.auditLogs.unshift({
            Log_ID: 'READ-' + Date.now().toString().slice(-4),
            Timestamp_IST: nowISTString(),
            Operation: 'READ_REFRESH',
            Target_Sheet: 'ALL_TABS',
            Record_ID: 'FULL_PULL',
            Source_Mode: sheetPulled ? 'Live_Webhook' : 'Local_Replica',
            Status: sheetPulled ? 'SUCCESS' : 'LOCAL_ONLY',
            Details: sheetPulled
              ? 'Pulled latest tables from connected Google Sheet (' + targetName + ')'
              : (sheetConfig.appsScriptUrl ? 'Fetched endpoint but used local replica cache' : 'No Web App configured; refreshed local state')
          });
          persistAll();
          renderAll();
          showToast(sheetPulled
            ? '📊 Refreshed data from your personal Google Sheet!'
            : '📊 Local database refreshed from LocalStorage cache.', 'credit');
        });

        document.getElementById('resetDemoDataBtn').addEventListener('click', function () {
          db = getBaselineDatabase();
          offlineQueue = [];
          persistAll();
          updateNetworkUI();
          renderAll();
          showToast('♻️ Restored baseline Google Sheet database state.', 'credit');
        });

        document.getElementById('copyAppsScriptBtn').addEventListener('click', function () {
          const code = document.getElementById('appsScriptCodeBlock').textContent;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).catch(function () {});
          } else {
            const ta = document.createElement('textarea');
            ta.value = code;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(ta);
          }
          showToast('📋 Copied Google Apps Script (Code.gs) to clipboard!', 'credit');
        });

        // CSV Export
        document.getElementById('quickExportCsvBtn').addEventListener('click', function () {
          const headers = ['Tx_ID','Date','Time','Book_ID','Book_Name','Type','Category','Party_Name','Party_Role','Payment_Mode','Amount','Tax_GST','Net_Amount','Reference_Bill_No','Notes','Sync_Status'];
          const rows = db.transactions.map(function (t) {
            return headers.map(function (h) {
              const v = t[h] !== undefined ? String(t[h]).replace(/"/g, '""') : '';
              return '"' + v + '"';
            }).join(',');
          });
          const csv = [headers.join(',')].concat(rows).join('\n');
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'CashBook_Pro_Transactions_2026.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast('⬇️ Downloaded Transactions CSV!', 'credit');
        });

        // Full JSON Backup Export
        document.getElementById('exportJsonBackupBtn').addEventListener('click', function () {
          const payload = JSON.stringify({ database: db, pendingQueue: offlineQueue, exportedAt: new Date().toISOString() }, null, 2);
          const blob = new Blob([payload], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'CashBook_Pro_Full_Backup.json';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showToast('⬇️ Downloaded Full JSON Database Backup!', 'credit');
        });
      }

      // Boot Application
      window.addEventListener('DOMContentLoaded', function () {
        initEventListeners();
        updateNetworkUI();
        updateStorageSizeIndicator();
        renderAll();
      });
    })();
