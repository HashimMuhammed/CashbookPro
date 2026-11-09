# CashBook Pro — Mobile & Web Cash Flow Manager (Google Sheets Synced)

A complete responsive Mobile & Web CashBook application featuring multi-project books, Debits/Credits with running balances, HR Payroll (**Monthly**, **Weekly**, and **Daily** wage modes), Bills & Receivables, 5 WCAG-accessible themes, and an offline-first `localStorage` outbox queue backed by Google Sheets.

## Multi-User Architecture (Bring Your Own Google Sheet)
This web application is 100% serverless, private, and multi-user ready:
- **Private by Default**: When any visitor opens the site, their entries are securely saved in their own browser's `localStorage`. No data is mixed between users.
- **1-Click Cloud Database**: Any user can connect their personal Google Drive spreadsheet:
  1. Click **[📑 Make a Copy of Template Sheet](https://docs.google.com/spreadsheets/d/1UTXWtG8KxQ3JqQjGsCYabxgd_t3mCFH8Ws2YvW6bRvo/copy)** to clone the 5 database tabs into their own Google Drive.
  2. In their copied sheet, open **Extensions → Apps Script** and click **Deploy → New deployment → Web app** (`Execute as: Me`, `Access: Anyone`).
  3. In CashBook Pro, click **Connect Google Sheet** and paste their Web App URL.

## Master Template Google Sheet
- **Template Preview**: https://docs.google.com/spreadsheets/d/1UTXWtG8KxQ3JqQjGsCYabxgd_t3mCFH8Ws2YvW6bRvo/edit
- **Template 1-Click Copy**: https://docs.google.com/spreadsheets/d/1UTXWtG8KxQ3JqQjGsCYabxgd_t3mCFH8Ws2YvW6bRvo/copy

## Project Structure (IDE Ready)
```text
cashbook_pro_ide_project/
├── index.html                      # Modular app entry point (links css/styles.css & js/app.js)
├── css/
│   └── styles.css                  # Multi-theme CSS variables & responsive layout rules
├── js/
│   └── app.js                      # Application state, CRUD controllers, HR/Bills/Project logic & Offline Sync Queue
├── google-apps-script/
│   └── Code.gs                     # Google Apps Script backend for 2-way Google Sheets CRUD sync
├── cashbook_pro_standalone.html    # Single-file all-in-one portable build
├── package.json                    # Local dev server scripts (npm start / python3 http.server)
└── .vscode/
    ├── settings.json               # VS Code / Cursor workspace settings
    └── extensions.json             # Recommended IDE extensions
```

## Quick Start in VS Code / Cursor / WebStorm
1. Extract `cashbook_pro_ide_project.zip` and open the folder in your IDE.
2. Start a local server using any of these options:
   - **VS Code Live Server**: Right-click `index.html` and select **Open with Live Server**.
   - **Node.js**: Run `npm start` (opens at `http://localhost:3000`).
   - **Python 3**: Run `npm run dev` or `python3 -m http.server 3000`.
