# Dynamic Data Table Manager — Report
Student: Harsh  (B.Tech MNC, IIT Goa)  
Email: harsh.22033@iitgoa.ac.in

## 1. Introduction
This report describes the design and implementation of a Dynamic Data Table Manager using Next.js, Redux Toolkit, Material UI, and TypeScript. The objective is to showcase robust client-side table interactions that closely resemble real-world dashboard workflows.

## 2. Implementation
Architecture: Utilizes the App Router (/app), a centralized Redux slice, and persisted preferences (including visibility and theme).
UI: Features an MUI table with sortable headers, a search input, pagination controls, and dialogs for column management and delete confirmation.
State: Manages columns, rows, filters, sorting, page, page size, theme, and an edit buffer.
CSV: Uses PapaParse for parsing and FileSaver for exporting (export limited to visible columns only).
Validation: Ensures age is coerced to a number and provides basic feedback for invalid CSV files.

## 3. Features Checklist
- Table View with default columns (Name, Email, Age, Role)
- Sorting (ASC/DESC), Global Search, Client-side Pagination
- Manage Columns (add + show/hide) with persistence
- CSV Import (validated) & Export (visible columns only)
- Inline Editing (Save All / Cancel All)
- Delete with confirmation
- Theme toggle (Light/Dark)

## 4. Conclusion
The application meets the stated requirements and is structured for clarity and grading. Minor TODOs are kept as future work markers (e.g., CSV charset handling).

## References
- Next.js 14 Documentation
- Redux Toolkit Documentation
- Material UI v5 Documentation
- PapaParse Documentation
- FileSaver.js
