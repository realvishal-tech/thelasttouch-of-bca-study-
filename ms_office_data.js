/**
 * BCA STORE - MS Office Knowledge Base
 * Training dataset for the AI Assistant.
 */

const MS_OFFICE_KNOWLEDGE = {
  // MS Office Basics
  "what is ms office": "A powerful productivity suite by Microsoft used for documents, spreadsheets, presentations, and database management.",
  "major office applications": "Includes MS Word (text), MS Excel (spreadsheets), MS PowerPoint (presentations), MS Access (databases), and MS Outlook (emails).",
  "office ribbon": "The tabbed toolbar at the top of Office applications that organizes commands into logical groups.",
  "quick access toolbar": "A customizable toolbar for frequently used commands like Save, Undo, and Redo.",
  "template": "A pre-designed document format that provides a starting point for new files.",
  "clipboard": "A temporary storage area for data that has been cut or copied.",

  // MS Word
  "ms word purpose": "Used for creating and formatting text documents like letters, resumes, and reports.",
  "word document extension": "Standard extension is .docx (since Word 2007) or .doc (legacy).",
  "text alignment": "Options include Left, Right, Center, and Justify (equal margins on both sides).",
  "mail merge": "A powerful Word feature that allows creating multiple personalized documents (like envelopes or letters) from a single template and a data source.",
  "header and footer": "Header appears at the top of every page; footer appears at the bottom.",
  "watermark": "A faint background image or text used for branding or security (e.g., 'Confidential').",
  "thesaurus in word": "A tool that provides synonyms and antonyms for selected words.",
  "word wrap": "Automatic movement of the cursor to the beginning of the next line when the current line is full.",

  // MS Excel
  "ms excel purpose": "Used for calculations, data analysis, and organizing information in spreadsheets.",
  "workbook vs worksheet": "A workbook is the entire Excel file; a worksheet is a single page/sheet within that file.",
  "cell and cell address": "A cell is the intersection of a row and a column. Its address is identified by column letter and row number (e.g., B5).",
  "excel formulas": "Equations that perform calculations, always starting with an equals sign (=).",
  "common excel functions": "SUM (total), AVERAGE (mean), MAX (largest), MIN (smallest), and COUNT (number of items).",
  "autofill": "A feature that automatically fills a series of data (like dates or numbers) based on a pattern.",
  "pivot table": "A powerful tool used to summarize, analyze, and explore large amounts of data quickly.",
  "vlookup and hlookup": "Functions used to search for data vertically or horizontally in a table based on a specific value.",

  // MS PowerPoint
  "powerpoint purpose": "Used for creating visual presentations and slide shows.",
  "slide and slide master": "A slide is a single page; the Slide Master is a template that controls the global design of all slides.",
  "transition vs animation": "Transitions are effects that occur when moving between slides. Animations are effects applied to individual objects on a slide.",
  "slideshow shortcut": "Press F5 to start the presentation from the beginning; Shift + F5 to start from the current slide.",
  "placeholder": "A pre-formatted box on a slide that holds text, images, or videos.",

  // MS Access
  "ms access purpose": "A relational database management system (RDBMS) used to store and manage large amounts of structured data.",
  "access database objects": "Includes Tables (data), Queries (questions), Forms (interface), and Reports (output).",
  "primary key": "A unique identifier for each record in a database table (no two records can have the same primary key).",
  "relationship in access": "The connection established between tables using common fields (like Primary Key and Foreign Key).",

  // MS Outlook
  "ms outlook purpose": "A personal information manager used primarily for email, but also includes a calendar, tasks, and contacts.",
  "cc vs bcc": "CC (Carbon Copy) sends a copy to others visible to everyone. BCC (Blind Carbon Copy) sends a copy hidden from other recipients.",

  // Shortcuts & Efficiency
  "common shortcuts": "Ctrl+C (Copy), Ctrl+V (Paste), Ctrl+X (Cut), Ctrl+Z (Undo), Ctrl+S (Save), Ctrl+P (Print), Ctrl+A (Select All).",
  "office 365": "A subscription-based cloud version of MS Office that allows real-time collaboration and cloud storage via OneDrive."
};

// Merge into the global knowledge base
if (typeof BCA_BOT_KNOWLEDGE !== 'undefined') {
  Object.assign(BCA_BOT_KNOWLEDGE, MS_OFFICE_KNOWLEDGE);
}
