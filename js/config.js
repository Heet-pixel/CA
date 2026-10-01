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

// ONLINE VERSION: the email is the only record of a submission (no data.txt, no admin page).
// false = visitors never see a file dialog and nothing is stored in their browser.
export const SAVE_TO_FILE = false;
