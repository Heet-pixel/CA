// Where new contact messages / job applications are emailed.
// Sent through FormSubmit.co (free, no account, no server). Set MAIL_ENABLED to false to turn emails off.
export const MAIL_ENABLED = true;
export const MAIL_TO = 'heetshah@gmail.com';
export const FIRM_NAME = 'AVKAS & Co.';

// Name suggested for the file that stores every submission (you choose the folder once).
export const FILE_NAME = 'data.txt';
// true: the very first form submission opens a "save data.txt" dialog if no file was chosen yet.
// Set to false if you only want to choose the file from the admin page.
export const ASK_FOR_FILE_ON_FIRST_SUBMIT = false;

// true  = save every submission to data.txt on this PC AND email it (local version).
// false = online version: the email is the only record, so a failed email is reported to the visitor.
export const SAVE_TO_FILE = false;
