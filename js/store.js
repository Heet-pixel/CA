// Saves form submissions into a plain .txt file on THIS computer (no server, no database).
// Works through the browser's File System Access API (Chrome / Edge). One submission = one line of text (JSON).
// The admin page picks the file once; the website and the admin then share it.
// If the file is not connected yet, submissions wait safely inside the browser and are
// written into the .txt file the next time the admin connects it.

import { notify, explain } from './mail.js';
import { ASK_FOR_FILE_ON_FIRST_SUBMIT, FILE_NAME, SAVE_TO_FILE } from './config.js';

const DB_NAME = 'avkas-store';
const LOCK_NAME = 'avkas-submissions-file';
const TXT_TYPES = [{ description: 'Text file', accept: { 'text/plain': ['.txt'] } }];

// ---------- tiny IndexedDB helpers (remembers the chosen file + holds waiting submissions) ----------
function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('kv');
      req.result.createObjectStore('pending', { autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run(storeName, mode, fn) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction(storeName, mode);
    const out = fn(t.objectStore(storeName));
    t.oncomplete = () => { db.close(); resolve(out && 'result' in out ? out.result : out); };
    t.onerror = () => { db.close(); reject(t.error); };
    t.onabort = () => { db.close(); reject(t.error); };
  });
}

const getHandle = () => run('kv', 'readonly', (s) => s.get('handle'));
const setHandle = (h) => run('kv', 'readwrite', (s) => s.put(h, 'handle'));
const clearHandle = () => run('kv', 'readwrite', (s) => s.delete('handle'));
const pendingAdd = (rec) => run('pending', 'readwrite', (s) => s.add(rec));

async function pendingList() {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const t = db.transaction('pending', 'readonly');
    const s = t.objectStore('pending');
    const keys = s.getAllKeys();
    const vals = s.getAll();
    t.oncomplete = () => { db.close(); resolve(keys.result.map((key, i) => ({ key, rec: vals.result[i] }))); };
    t.onerror = () => { db.close(); reject(t.error); };
  });
}

const pendingRemove = (keys) => run('pending', 'readwrite', (s) => { keys.forEach((k) => s.delete(k)); });

// ---------- file access ----------
export const supported = () => 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;

async function hasPermission(handle, ask) {
  const opts = { mode: 'readwrite' };
  try {
    if ((await handle.queryPermission(opts)) === 'granted') return true;
    if (!ask) return false;
    return (await handle.requestPermission(opts)) === 'granted';
  } catch { return false; }
}

const withLock = (fn) => (navigator.locks ? navigator.locks.request(LOCK_NAME, fn) : fn());

async function appendToFile(handle, records) {
  const text = records.map((r) => JSON.stringify(r)).join('\n') + '\n';
  await withLock(async () => {
    const file = await handle.getFile();
    const w = await handle.createWritable({ keepExistingData: true });
    try {
      let size = file.size;
      if (size > 0 && (await file.slice(size - 1, size).text()) !== '\n') { await w.seek(size); await w.write('\n'); size += 1; }
      await w.seek(size);
      await w.write(text);
      await w.close();
    } catch (err) {
      try { await w.abort(); } catch { /* ignore */ }
      throw err;
    }
  });
}

export function parse(text) {
  return String(text).split(/\r?\n/).filter((l) => l.trim()).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}

// Writes anything waiting in the browser into the file. Returns how many were moved.
async function flushPending(handle) {
  const waiting = await pendingList();
  if (!waiting.length) return 0;
  await appendToFile(handle, waiting.map((w) => w.rec));
  await pendingRemove(waiting.map((w) => w.key));
  return waiting.length;
}

// ---------- used by the public website ----------
let ready = null;
/** Call at the very start of a form submit (while the click still counts as a user action) so the browser can ask for file access. */
export function prepare() {
  ready = (async () => {
    let h = await getHandle().catch(() => null);
    if (!h && ASK_FOR_FILE_ON_FIRST_SUBMIT && supported()) {
      // first submission and no file chosen yet: let the person pick/create data.txt right now
      try { h = await window.showSaveFilePicker({ suggestedName: FILE_NAME, types: TXT_TYPES }); await setHandle(h); } catch { h = null; }
    }
    return h && (await hasPermission(h, true)) ? h : null;
  })();
  return ready;
}

/** Saves one submission to the .txt file (or keeps it in the browser until the file is connected) and emails it. */
export async function save(record) {
  const full = { _id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...record };
  if (!SAVE_TO_FILE) {
    // online version: the email is the only copy, so a failed email must be reported to the visitor
    const r = await notify(full);
    if (!r.ok) throw new Error(explain(r));
    return { where: 'email', emailed: true };
  }
  const mailed = notify(full); // runs in parallel with saving; never throws
  const out = await saveLocally(full);
  out.emailed = (await mailed).ok;
  return out;
}

async function saveLocally(full) {
  try {
    const handle = await (ready || prepare());
    ready = null;
    if (handle) {
      const waiting = await pendingList();
      await appendToFile(handle, [...waiting.map((w) => w.rec), full]);
      if (waiting.length) await pendingRemove(waiting.map((w) => w.key));
      return { where: 'file' };
    }
  } catch (err) { console.warn('[store] could not write to the file, keeping it in the browser:', err); }
  await pendingAdd(full);
  return { where: 'browser' };
}

export const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result).split(',')[1] || '');
  r.onerror = () => reject(new Error('Could not read the resume file.'));
  r.readAsDataURL(file);
});

// ---------- used by the admin page ----------
export async function status() {
  const h = await getHandle().catch(() => null);
  return {
    supported: supported(),
    name: h ? h.name : null,
    granted: h ? await hasPermission(h, false) : false,
    pending: (await pendingList().catch(() => [])).length,
  };
}

async function remember(handle) {
  if (!(await hasPermission(handle, true))) throw new Error('Permission to edit the file was not given.');
  await setHandle(handle);
  await flushPending(handle);
}

export async function createFile() {
  const handle = await window.showSaveFilePicker({ suggestedName: FILE_NAME, types: TXT_TYPES });
  await remember(handle);
}

export async function useExistingFile() {
  const [handle] = await window.showOpenFilePicker({ types: TXT_TYPES, multiple: false });
  await remember(handle);
}

export async function grantAccess() {
  const h = await getHandle();
  if (!h || !(await hasPermission(h, true))) return false;
  await flushPending(h);
  return true;
}

export async function disconnect() { await clearHandle(); }

/** Everything the admin should show. Reads the .txt file when connected, otherwise what is waiting in the browser. */
export async function loadAll() {
  const h = await getHandle().catch(() => null);
  if (h && (await hasPermission(h, false))) {
    await flushPending(h);
    return { records: parse(await (await h.getFile()).text()), source: 'file' };
  }
  return { records: (await pendingList()).map((p) => p.rec), source: 'browser' };
}

export function downloadResume(rec) {
  const bin = atob(rec.resumeData || '');
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([bytes], { type: rec.resumeType || 'application/octet-stream' }));
  const a = document.createElement('a');
  a.href = url; a.download = rec.resumeName || 'resume';
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
