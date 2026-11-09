# CashBook Pro — Mobile & Web Cash Flow Manager (Google Sheets Synced)

A complete responsive Mobile & Web CashBook application featuring multi-project books, Debits/Credits with running balances, HR Payroll (**Monthly**, **Weekly**, and **Daily** wage modes), Bills & Receivables, 5 WCAG-accessible themes, and an offline-first `localStorage` outbox queue backed by Google Sheets.

## Connected Google Sheets Database
- **Live Google Sheet**: https://docs.google.com/spreadsheets/d/1UTXWtG8KxQ3JqQjGsCYabxgd_t3mCFH8Ws2YvW6bRvo/edit
- **Spreadsheet ID**: `1UTXWtG8KxQ3JqQjGsCYabxgd_t3mCFH8Ws2YvW6bRvo`

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
