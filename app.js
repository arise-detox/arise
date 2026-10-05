(function () {
'use strict';
var C = window.ARISE_CONTENT;
if (!C || !window.ARISE_LEGAL) { var boot = document.getElementById('app'); if (boot) boot.innerHTML = '<p style="padding:24px;font:16px system-ui">Un fichier de l’appli n’a pas pu être chargé. Recharge la page.</p>'; return; }
var CARD_KIND = C.CARD_KIND, CARDS = C.CARDS;
var D = C.D;
var activities = D.activities, days = D.days, themes = D.themes;
var DURATIONS = [2, 5, 10, 15];
var FEELINGS = ['calme', 'curieux', 'énergique', 'mitigé', 'sans réponse'];
var POSITIVE = ['calme', 'curieux', 'énergique'];
var KEY = 'horschamp:v1';
var PAGE = 10;
var PALIER_FILTERS = ['all', 'todo', 'done'];
var AVATARS = ['🌸', '🌿', '🌙', '☀️', '🦋', '🐢', '🌊', '⭐'];
var APPEARANCES = ['auto', 'light', 'dark'];
var STYLES = ['calm', 'candy'];
var BGS = ['on', 'off'];   /* arrière-plan animé de symboles (cerveau, science) */   /* « calme » (par défaut) ou « bonbon » (le style d'origine) */
/* Photo de profil : petit JPEG carré (data URL). On ne l'affiche jamais sans avoir vérifié ce format strict. */
var PHOTO_RE = /^data:image\/jpeg;base64,[A-Za-z0-9+\/]+={0,2}$/;
function validPhoto(s) { return typeof s === 'string' && s.length <= 40000 && PHOTO_RE.test(s); }

var CARD_IDS = CARDS.map(function (c) { return c.id; });
var BACK_AFTER_DAYS = 3;
var app = document.getElementById('app');
var themeIds = themes.map(function (t) { return t.id; });
var CH = C.CH;
var chList = CH.challenges, habitList = CH.habits;
var MP = C.MP;
function catById(id) { return MP.categories.find(function (c) { return c.id === id; }); }
var HY = C.HY;
var TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
function toMin(t) { var p = t.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
function validWindows(list) {
  return Array.isArray(list) && list.length <= HY.maxWindows && list.every(function (w) { return w && TIME_RE.test(w.start) && TIME_RE.test(w.end) && toMin(w.end) > toMin(w.start); });
}
/* Fenêtre ouverte, prochaine fenêtre (aujourd'hui ou demain) ou aucune fenêtre. */
function windowStatus(now, wins) {
  if (!wins.length) return { kind: 'none' };
  var m = now.getHours() * 60 + now.getMinutes();
  var sorted = wins.slice().sort(function (a, b) { return toMin(a.start) - toMin(b.start); });
  for (var i = 0; i < sorted.length; i++) if (m >= toMin(sorted[i].start) && m < toMin(sorted[i].end)) return { kind: 'open', end: sorted[i].end, left: toMin(sorted[i].end) - m };
  for (var j = 0; j < sorted.length; j++) if (toMin(sorted[j].start) > m) return { kind: 'next', start: sorted[j].start, inMin: toMin(sorted[j].start) - m, tomorrow: false };
  return { kind: 'next', start: sorted[0].start, inMin: 24 * 60 - m + toMin(sorted[0].start), tomorrow: true };
}
function fmtMin(n) { if (n < 60) return n + ' min'; var h = Math.floor(n / 60), r = n % 60; return h + ' h' + (r ? ' ' + String(r).padStart(2, '0') : ''); }
function essLabels(ids) { return ids.map(function (id) { var e = HY.essentials.find(function (x) { return x.id === id; }); return e ? e.label : null; }).filter(Boolean); }
function chById(id) { return chList.find(function (c) { return c.id === id; }); }

/* ---------- Icônes (tracés Lucide) ---------- */
var P = {
  phone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  store: '<path d="M3 9l2-5h14l2 5"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M5 12v8h14v-8"/><path d="M10 20v-5h4v5"/>',
  landmark: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-15.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  foot: '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4M4 13h4"/>',
  flower: '<path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"/><circle cx="12" cy="8" r="2"/><path d="M12 10v12"/><path d="M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"/><path d="M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  settings: '<path d="M20 7h-9M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  pen: '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
  wind: '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  ok: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  shuffle: '<path d="m18 14 4 4-4 4M18 2l4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22M2 6h1.972a4 4 0 0 1 3.6 2.2M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/>'
};
function ic(name, size) {
  size = size || 20;
  return '<svg class="ic" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[name] + '</svg>';
}
var THEME_ICON = { outside: 'flower', creative: 'pen', movement: 'foot' };

function brainLogo(size) {
  size = size || 28;
  return '<svg class="brain-logo" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path class="lobe" d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>' +
    '<path class="lobe" d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>' +
    '<path class="fold" d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path class="fold" d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path class="fold" d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>' +
    '<path class="fold" d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path class="fold" d="M19.938 10.5a4 4 0 0 1 .585.396"/><path class="fold" d="M6 18a4 4 0 0 1-1.967-.516"/><path class="fold" d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>';
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
}

/* ---------- Vérification des contenus (content.js) : une erreur de saisie dans un texte ne doit pas casser l'appli sans explication ---------- */
function validateContent() {
  var errs = [];
  function need(ok, msg) { if (!ok) errs.push(msg); }
  function isStr(x) { return typeof x === 'string' && x.length > 0; }
  function inviteOk(inv) { return !inv || (themeIds.indexOf(inv.theme) >= 0 && Number.isInteger(inv.day) && inv.day >= 0 && inv.day < days.length); }
  need(Array.isArray(days) && days.length === 7, 'D.days doit contenir exactement 7 jours');
  need(Array.isArray(themes) && themes.length > 0, 'D.themes est vide');
  themes.forEach(function (t) {
    var list = activities[t.id];
    need(Array.isArray(list) && list.length === days.length, 'D.activities.' + t.id + ' doit contenir ' + days.length + ' activités');
    (list || []).forEach(function (a, i) { need(a && isStr(a.title) && isStr(a.body) && isStr(a.prompt) && isStr(a.tip), 'Activité « ' + t.id + ' » n°' + (i + 1) + ' : title, body, prompt et tip sont obligatoires'); });
  });
  need(Array.isArray(chList) && chList.length > 0, 'CH.challenges est vide');
  chList.forEach(function (c) {
    need(isStr(c.id) && isStr(c.title) && P[c.icon] && Array.isArray(c.paliers) && c.paliers.length > 0, 'Défi « ' + c.id + ' » : id, title, icon (connue) et paliers sont obligatoires');
    (c.paliers || []).forEach(function (p, i) {
      need(typeof p.at === 'number' && isStr(p.when) && isStr(p.title) && isStr(p['do']) && isStr(p.brain) && CH.evidence[p.evidence], 'Défi « ' + c.id + ' », palier ' + (i + 1) + ' : at, when, title, do, brain et evidence (etabli, observe ou hypothese) sont obligatoires');
      need(inviteOk(p.invite), 'Défi « ' + c.id + ' », palier ' + (i + 1) + ' : invite pointe vers une activité inexistante');
    });
    need(c.hybrid && Array.isArray(c.hybrid.rules), 'Défi « ' + c.id + ' » : hybrid.rules est obligatoire');
  });
  need(MP && Array.isArray(MP.categories) && MP.categories.length > 0 && Array.isArray(MP.steps) && MP.steps.length === 4, 'MP.categories ou MP.steps (4 étapes) invalide');
  (MP.categories || []).forEach(function (c) {
    need(isStr(c.id) && isStr(c.title) && P[c.icon] && Array.isArray(c.pin) && c.pin.length === 2 && isStr(c.search) && inviteOk(c.invite) && c.invite, 'Carte « ' + c.id + ' » : id, title, icon, pin [x, y], search et invite sont obligatoires');
  });
  need(HY && Array.isArray(HY.modes) && Array.isArray(HY.essentials) && Array.isArray(HY.defaultWindows) && HY.away && HY.mapStep && HY.mapNote, 'HY (mode hybride) est incomplet');
  var seen = {};
  (CARDS || []).forEach(function (c) {
    need(c && isStr(c.id) && CARD_KIND[c.k] && isStr(c.t) && !seen[c.id], 'Carte surprise « ' + (c && c.id) + ' » : id unique, k (idee, defi, mot ou fait) et t sont obligatoires');
    if (c) seen[c.id] = 1;
  });
  return errs;
}
var contentErrors = validateContent();
if (contentErrors.length) {
  if (window.console) console.error('ARISE : content.js contient des erreurs\n- ' + contentErrors.join('\n- '));
  app.innerHTML = '<div style="padding:24px;font:16px/1.5 system-ui"><p><strong>Un contenu de l’appli est mal renseigné (fichier content.js).</strong></p><p>' + esc(contentErrors[0]) + (contentErrors.length > 1 ? ' (et ' + (contentErrors.length - 1) + ' autre' + (contentErrors.length > 2 ? 's' : '') + ')' : '') + '</p></div>';
  return;
}

/* ---------- Données et enregistrement dans le navigateur ---------- */
var canStore = true;
try { localStorage.setItem(KEY + ':probe', '1'); localStorage.removeItem(KEY + ':probe'); } catch (e) { canStore = false; }

function fresh() { return { profile: { name: '', avatar: '', photo: '', welcomed: false, installTip: false, appearance: 'auto', style: 'calm', bg: 'on', theme: 'outside', duration: 5, palierFilter: 'all', mode: HY.defaultMode, essentials: HY.defaultEssentials.slice(), windows: HY.defaultWindows.map(function (w) { return { start: w.start, end: w.end }; }) }, history: [], challenge: { active: null, finished: [] }, rewards: { cards: [], today: null, returns: 0, lastSeen: '', backPending: 0 } }; }
function validDate(x) { return typeof x === 'string' && !isNaN(new Date(x)); }
function cleanRun(r) {
  if (!r || typeof r !== 'object') return null;
  var def = chById(r.id);
  if (!def || !validDate(r.startedAt)) return null;
  var hs = Array.isArray(r.habits) ? r.habits.filter(function (h) { return habitList.some(function (x) { return x.id === h; }); }) : [];
  var done = Array.isArray(r.done) ? r.done.filter(function (n, i, a) { return Number.isInteger(n) && n >= 0 && n < def.paliers.length && a.indexOf(n) === i; }) : [];
  return { id: r.id, startedAt: r.startedAt, habits: hs, done: done };
}
function cleanFinished(r) {
  if (!r || typeof r !== 'object') return null;
  var def = chById(r.id);
  if (!def || !validDate(r.startedAt) || !validDate(r.endedAt) || (r.status !== 'finished' && r.status !== 'stopped')) return null;
  var n = Number.isInteger(r.done) ? Math.max(0, Math.min(def.paliers.length, r.done)) : 0;
  return { id: r.id, startedAt: r.startedAt, endedAt: r.endedAt, status: r.status, done: n };
}
function sanitize(d) {
  var out = fresh();
  if (!d || typeof d !== 'object') return out;
  if (d.rewards && typeof d.rewards === 'object') {
    var R0 = d.rewards;
    if (Array.isArray(R0.cards)) out.rewards.cards = R0.cards.filter(function (c, i, a) { return c && CARD_IDS.indexOf(c.id) >= 0 && validDate(c.at) && a.findIndex(function (x) { return x && x.id === c.id; }) === i; }).map(function (c) { return { id: c.id, at: c.at }; });
    if (R0.today && /^\d{4}-\d{2}-\d{2}$/.test(R0.today.date) && CARD_IDS.indexOf(R0.today.id) >= 0) out.rewards.today = { date: R0.today.date, id: R0.today.id, open: R0.today.open === true };
    if (Number.isInteger(R0.returns) && R0.returns >= 0) out.rewards.returns = Math.min(R0.returns, 999);
    if (validDate(R0.lastSeen)) out.rewards.lastSeen = R0.lastSeen;
    if (Number.isInteger(R0.backPending) && R0.backPending > 0) out.rewards.backPending = Math.min(R0.backPending, 3650);
  }
  if (d.profile && themeIds.indexOf(d.profile.theme) >= 0) out.profile.theme = d.profile.theme;
  if (d.profile && DURATIONS.indexOf(d.profile.duration) >= 0) out.profile.duration = d.profile.duration;
  if (d.profile && PALIER_FILTERS.indexOf(d.profile.palierFilter) >= 0) out.profile.palierFilter = d.profile.palierFilter;
  if (d.profile && typeof d.profile.name === 'string') out.profile.name = d.profile.name.replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 20);
  if (d.profile && AVATARS.indexOf(d.profile.avatar) >= 0) out.profile.avatar = d.profile.avatar;
  if (d.profile && validPhoto(d.profile.photo)) out.profile.photo = d.profile.photo;
  if (d.profile && d.profile.welcomed === true) out.profile.welcomed = true;
  if (d.profile && d.profile.installTip === true) out.profile.installTip = true;
  if (d.profile && APPEARANCES.indexOf(d.profile.appearance) >= 0) out.profile.appearance = d.profile.appearance;
  if (d.profile && STYLES.indexOf(d.profile.style) >= 0) out.profile.style = d.profile.style;
  if (d.profile && BGS.indexOf(d.profile.bg) >= 0) out.profile.bg = d.profile.bg;
  if (d.profile && (d.profile.mode === 'strict' || d.profile.mode === 'hybrid')) out.profile.mode = d.profile.mode;
  if (d.profile && Array.isArray(d.profile.essentials)) out.profile.essentials = HY.essentials.map(function (x) { return x.id; }).filter(function (id) { return d.profile.essentials.indexOf(id) >= 0; });
  if (d.profile && validWindows(d.profile.windows)) out.profile.windows = d.profile.windows.map(function (w) { return { start: w.start, end: w.end }; });
  if (Array.isArray(d.history)) {
    out.history = d.history.filter(function (h) {
      return h && Number.isInteger(h.id) && Number.isInteger(h.day) && h.day >= 0 && h.day < days.length &&
        themeIds.indexOf(h.theme) >= 0 && DURATIONS.indexOf(h.duration) >= 0 &&
        FEELINGS.indexOf(h.feeling) >= 0 && typeof h.completedAt === 'string' && !isNaN(new Date(h.completedAt));
    }).map(function (h) { return { id: h.id, day: h.day, theme: h.theme, duration: h.duration, feeling: h.feeling, wrote: h.wrote ? 1 : 0, completedAt: h.completedAt }; }).slice(0, 500);
  }
  if (d.challenge && typeof d.challenge === 'object') {
    out.challenge.active = cleanRun(d.challenge.active);
    if (Array.isArray(d.challenge.finished)) out.challenge.finished = d.challenge.finished.map(cleanFinished).filter(Boolean).slice(0, 100);
  }
  return out;
}
function load() {
  var raw = null;
  try { raw = localStorage.getItem(KEY); return raw ? sanitize(JSON.parse(raw)) : fresh(); }
  catch (e) {
    /* Données illisibles : on repart de zéro mais on garde l'original à part (récupérable) au lieu de l'écraser au prochain enregistrement. */
    if (raw) { try { localStorage.setItem(KEY + ':corrupt', raw); } catch (e2) { /* plein : tant pis */ } }
    return fresh();
  }
}
function persist() {
  if (!canStore) return false;
  try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch (e) { canStore = false; return false; }
}

var data = load();
// Le dernier passage par étape fait foi (l'historique est classé du plus récent au plus ancien).
function momentFor(day) { return data.history.find(function (h) { return h.day === day; }); }
function doneCount() { return new Set(data.history.map(function (h) { return h.day; })).size; }
function firstUndone() { for (var i = 0; i < days.length; i++) if (!momentFor(i)) return i; return days.length - 1; }

var S = {
  tab: 'moment', phase: 'choose', day: firstUndone(),
  theme: data.profile.theme, duration: data.profile.duration,
  feeling: 'sans réponse', wrote: false, notice: '', shown: PAGE, resetAsk: false,
  ch: { view: null, open: {}, habits: {}, stopAsk: false }, hint: true, pdraft: null, flip: null, cardView: null, update: false, acct: { user: null, ready: false, busy: false, err: '', info: '', delAsk: false, consent: null }, acctTab: 'signup', draftAcct: {}, legalTab: 'cgu', report: null,
  grp: { list: null, loading: false, err: '', city: '', theme: '', view: null, detail: null, form: null, delAsk: false, busy: false }, modal: null, modalTab: 'create', share: 'app', opener: null, profErr: '', map: { sel: null }, draft: null, formError: ''
};
var TABS = ['moment', 'challenges', 'map', 'groups', 'journey', 'preferences'];

/* ---------- Suite du parcours ---------- */
function keyOf(t, d) { return t + ':' + d; }
function pickSuggestion() {
  var last = {};
  data.history.forEach(function (h, i) { var k = keyOf(h.theme, h.day); if (!(k in last)) last[k] = i; });
  var all = [];
  themes.forEach(function (t) { days.forEach(function (_, d) { var k = keyOf(t.id, d); all.push({ theme: t.id, day: d, age: k in last ? last[k] : 1e6 }); }); });
  all.sort(function (a, b) { return b.age - a.age; });
  var pool = all.slice(0, 6);
  return pool[Math.floor(Math.random() * pool.length)];
}
function favorites(limit) {
  var seen = {};
  data.history.forEach(function (h, i) {
    if (POSITIVE.indexOf(h.feeling) < 0) return;
    var k = keyOf(h.theme, h.day);
    if (seen[k]) seen[k].n++; else seen[k] = { theme: h.theme, day: h.day, n: 1, latest: i };
  });
  return Object.keys(seen).map(function (k) { return seen[k]; })
    .sort(function (a, b) { return b.n - a.n || a.latest - b.latest; }).slice(0, limit || 3);
}
function themeLabel(id) { var t = themes.find(function (x) { return x.id === id; }); return t ? t.label : id; }

/* ---------- Vues ---------- */
function header() {
  var items = [['moment', 'Mon moment', 'Moment'], ['challenges', 'Défis', 'Défis'], ['map', 'Carte', 'Carte'], ['groups', 'Groupes', 'Groupes'], ['journey', 'Mon parcours', 'Suivi'], ['preferences', 'Mes envies', 'Envies']];
  return '<header class="site-header"><button class="brand unstyled" data-action="nav" data-v="moment" data-fk="brand" aria-label="ARISE, mon moment"><span class="brand-icon">' + brainLogo(28) + '</span>ARISE</button>' +
    '<nav aria-label="Navigation principale"><span class="ribbon" data-keepstyle aria-hidden="true"><span class="sparkles"><i></i><i></i><i></i><i></i></span></span>' + items.map(function (it) {
      var on = S.tab === it[0];
      return '<button class="' + (on ? 'nav-active' : 'unstyled') + '" data-fk="nav-' + it[0] + '" data-action="nav" data-v="' + it[0] + '"' + (on ? ' aria-current="page"' : '') + '>' +
        '<span class="full">' + it[1] + '</span><span class="short">' + it[2] + '</span>' + (it[0] === 'challenges' && pendingCount() > 0 ? '<span class="nav-dot" aria-hidden="true"></span><span class="sr-only"> (un palier à valider)</span>' : '') + '</button>';
    }).join('') + '</nav><div class="header-actions"><span class="small-tag">À ton rythme</span>' +
    '<button type="button" class="icon-btn" data-action="openShare" data-fk="hdr-share" aria-label="Inviter mes amis">' + ic('share', 20) + '</button>' +
    '<button type="button" class="icon-btn avatar-btn" data-action="openProfile" data-fk="hdr-profile" aria-label="' + (S.acct.user ? 'Mon compte : ' + esc(data.profile.name) : data.profile.name ? 'Mon profil : ' + esc(data.profile.name) : 'Créer mon profil ou me connecter') + '">' + (data.profile.photo || data.profile.avatar ? avatarHtml(data.profile) : ic('user', 20)) + '</button></div></header>';
}

/* ---------- Profil, partage et fenêtres ---------- */
function baseUrl() { return /^https?:$/.test(location.protocol) ? location.origin + location.pathname : location.href.split('#')[0]; }
function shareOptions() {
  var o = [{ id: 'app', label: 'L’appli ARISE' }];
  if (doneCount() > 0) o.push({ id: 'bilan', label: 'Mon bilan' });
  chList.forEach(function (c) { o.push({ id: 'ch:' + c.id, label: 'Défi : ' + c.title }); });
  return o;
}
function shareContent() {
  var sel = S.share, url = baseUrl();
  if (sel.indexOf('ch:') === 0 && chById(sel.slice(3))) {
    var c = chById(sel.slice(3));
    return { title: 'ARISE : ' + c.title, text: 'Je relève le défi « ' + c.title + ' » sur ARISE (' + c.duration.toLowerCase() + ', à ton rythme). Viens le faire avec moi !', url: url + '#defi=' + c.id };
  }
  if (sel === 'bilan' && doneCount() > 0) {
    var n = data.history.length;
    return { title: 'ARISE', text: 'J’ai pris ' + n + ' moment' + (n > 1 ? 's' : '') + ' pour moi, sans écran, avec ARISE. Et toi, un petit pas de côté ?', url: url };
  }
  return { title: 'ARISE', text: 'Je teste ARISE : des moments hors écran, des défis détox et une carte de sorties gratuites. Un peu moins de scroll, un peu plus de toi. Viens essayer !', url: url };
}
function shareBody() {
  var c = shareContent(), full = c.text + ' ' + c.url, enc = encodeURIComponent;
  var warn = /^https?:$/.test(location.protocol) && location.hostname !== 'localhost' ? '' : '<p class="habit-note">Ce lien ne fonctionnera pour tes amis qu’une fois le site mis en ligne.</p>';
  return '<h2 id="modal-title" tabindex="-1">Inviter mes amis</h2><p class="habit-note" style="margin:0 0 14px">Choisis ce que tu veux partager. Aucune donnée personnelle n’est envoyée : seulement le texte ci-dessous.</p>' +
    '<div class="choice-row" role="group" aria-label="Que partager ?">' + shareOptions().map(function (o) {
      return '<button type="button" class="chip' + (S.share === o.id ? ' active' : '') + '" aria-pressed="' + (S.share === o.id) + '" data-fk="shr-' + o.id.replace(':', '-') + '" data-action="shareSel" data-v="' + o.id + '">' + esc(o.label) + '</button>';
    }).join('') + '</div>' +
    '<blockquote class="share-preview">' + esc(c.text) + '<small>' + esc(c.url) + '</small></blockquote>' +
    '<div class="share-actions">' +
    (navigator.share ? '<button type="button" class="primary-button" data-action="nativeShare" data-fk="shr-native">' + ic('share', 18) + 'Partager</button>' : '') +
    '<a class="share-btn" href="https://wa.me/?text=' + enc(full) + '" target="_blank" rel="noopener noreferrer">' + ic('chat', 18) + 'WhatsApp</a>' +
    '<a class="share-btn" href="sms:?&body=' + enc(full) + '">' + ic('chat', 18) + 'SMS</a>' +
    '<a class="share-btn" href="mailto:?subject=' + enc(c.title) + '&body=' + enc(full) + '">' + ic('mail', 18) + 'E-mail</a>' +
    '<button type="button" class="share-btn" data-action="copyLink" data-fk="shr-copy">' + ic('copy', 18) + 'Copier le lien</button></div>' + warn;
}
function avatarHtml(p, cls) {
  if (p && validPhoto(p.photo)) return '<img class="avatar-img ' + (cls || '') + '" src="' + p.photo + '" alt="">';
  return p && p.avatar ? '<span aria-hidden="true">' + esc(p.avatar) + '</span>' : '';
}
/* Recadre au carré, réduit à 160 px et recompresse en JPEG : allège la photo et supprime ses métadonnées (lieu, date). */
function photoFromFile(file) {
  return new Promise(function (ok, ko) {
    if (!file || !/^image\//.test(file.type)) { ko(new Error('type')); return; }
    if (file.size > 12e6) { ko(new Error('size')); return; }
    function draw(img, w, h) {
      var s = Math.min(w, h), c = document.createElement('canvas'), ctx;
      c.width = c.height = 160; ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 160, 160);
      ctx.drawImage(img, (w - s) / 2, (h - s) / 2, s, s, 0, 0, 160, 160);
      for (var q = 0.84; q >= 0.4; q -= 0.12) { var u = c.toDataURL('image/jpeg', q); if (u.length <= 30000) { ok(u); return; } }
      ko(new Error('size'));
    }
    function fallback() {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () { URL.revokeObjectURL(url); draw(im, im.naturalWidth, im.naturalHeight); };
      im.onerror = function () { URL.revokeObjectURL(url); ko(new Error('type')); };
      im.src = url;
    }
    if (window.createImageBitmap) createImageBitmap(file, { imageOrientation: 'from-image' }).then(function (b) { draw(b, b.width, b.height); }, fallback); else fallback();
  });
}
function setPhoto(u) {
  data.profile.photo = u || '';
  var ok = persist();
  if (sb && S.acct.user) sb.from('profiles').update({ photo: u || null }).eq('id', S.acct.user.id).then(function (r) { if (r.error) { S.notice = 'Ta photo est enregistrée ici, mais pas encore en ligne : réessaie plus tard.'; softRender(); } });
  S.acct.info = u ? 'Photo enregistrée.' : 'Photo retirée.';
  if (!ok) S.profErr = 'Ton navigateur ne peut pas conserver la photo.';
  render({ focus: '#modal-title' });
}
function photoField() {
  var p = data.profile, has = validPhoto(p.photo);
  return '<div class="photo-row"><span class="photo-preview">' + (has ? avatarHtml(p) : p.avatar ? '<span aria-hidden="true">' + esc(p.avatar) + '</span>' : ic('user', 34)) + '</span><div class="photo-actions">' +
    '<label class="share-btn">' + ic('camera', 16) + (has ? 'Changer la photo' : 'Ajouter une photo') + '<input type="file" accept="image/*" data-change="photoFile" class="sr-only"></label>' + (has ? '<button type="button" class="text-button" data-action="photoRemove" data-fk="photo-rm">Retirer</button>' : '') +
    '<p class="habit-note" style="margin:4px 0 0;flex-basis:100%">Facultatif. Recadrée et réduite sur ton appareil, sans les infos cachées de la photo (lieu, date).' + (S.acct.user ? ' Visible des autres membres connectés.' : '') + '</p></div></div>';
}
function avatarPicker(cur, draft) {
  return '<fieldset class="avatar-set"><legend>Mon avatar</legend><div class="avatar-row">' + AVATARS.map(function (a, i) {
    return '<label class="avatar-opt"><input type="radio" name="avatar" value="' + a + '"' + (draft ? ' data-draft="1"' : '') + ((cur ? cur === a : i === 0) ? ' checked' : '') + '><span>' + a + '</span></label>';
  }).join('') + '</div></fieldset>';
}
function localProfileBody() {
  var p = data.profile, err = S.profErr ? '<div class="message error" role="alert" style="margin:0 0 12px"><span>' + esc(S.profErr) + '</span></div>' : '';
  if (p.name) {
    var n = data.challenge.finished.filter(function (f) { return f.status === 'finished'; }).length;
    return '<h2 id="modal-title" tabindex="-1">' + avatarHtml(p, 'av-inline') + ' Bonjour ' + esc(p.name) + '</h2><p class="habit-note" style="margin:0 0 14px">' + doneCount() + ' / 7 invitations · ' + data.history.length + ' moment' + (data.history.length > 1 ? 's' : '') + ' · ' + n + ' médaille' + (n > 1 ? 's' : '') + '</p>' + err +
      '<form data-form="profile">' + photoField() + '<label class="field">Mon prénom ou pseudo<input type="text" name="name" maxlength="20" required autocomplete="given-name" value="' + esc(S.pdraft ? S.pdraft.name : p.name) + '"></label>' + avatarPicker((S.pdraft && S.pdraft.avatar) || p.avatar) +
      '<div class="share-actions"><button class="primary-button" type="submit">Enregistrer</button><button type="button" class="share-btn" data-action="openShare" data-fk="prof-share">' + ic('share', 18) + 'Inviter mes amis</button></div></form>' +
      '<p class="habit-note">Ton profil et ton suivi restent sur cet appareil. Pour les retrouver ailleurs, enregistre une sauvegarde.</p>' +
      '<div class="data-actions"><button type="button" class="text-button" data-action="exportData" data-fk="export-m">Enregistrer une sauvegarde</button><button type="button" class="text-button" data-action="removeProfile" data-fk="rm-prof">Retirer mon profil</button></div>';
  }
  var create = S.modalTab === 'create';
  return '<h2 id="modal-title" tabindex="-1">Bienvenue sur ARISE</h2><p class="habit-note" style="margin:0 0 14px">Un profil pour personnaliser l’appli et inviter tes amis. Sans mot de passe, sans e-mail.</p>' + err +
    '<div class="mode-switch" role="group" aria-label="Inscription ou connexion"><button type="button" class="' + (create ? 'on' : '') + '" aria-pressed="' + create + '" data-fk="mt-create" data-action="modalTab" data-v="create">Je m’inscris</button><button type="button" class="' + (create ? '' : 'on') + '" aria-pressed="' + !create + '" data-fk="mt-restore" data-action="modalTab" data-v="restore">Je me connecte</button></div>' +
    (create
      ? '<form data-form="profile" style="margin-top:16px">' + photoField() + '<label class="field">Mon prénom ou pseudo<input type="text" name="name" maxlength="20" required autocomplete="given-name" placeholder="Par exemple : Léa" value="' + esc(S.pdraft ? S.pdraft.name : '') + '"></label>' + avatarPicker(S.pdraft ? S.pdraft.avatar : '') +
        '<div class="share-actions"><button class="primary-button" type="submit">Créer mon profil</button></div></form><p class="habit-note">Ton profil est enregistré sur cet appareil, rien n’est envoyé sur Internet.</p>'
      : '<div style="margin-top:16px"><p>Retrouve ton profil et ton suivi avec ta sauvegarde, enregistrée depuis ton autre appareil (rubrique « Mes envies », « Tes données »).</p>' +
        '<label class="primary-button file-pick-btn">' + ic('download', 18) + 'Choisir ma sauvegarde<input type="file" accept="application/json,.json" data-change="importFile" class="sr-only"></label></div>') +
    '<div class="modal-sep"></div><button type="button" class="text-button" data-action="dismissWelcome" data-fk="later-prof">Plus tard, je veux juste découvrir</button>';
}
function modal() {
  if (!S.modal) return '';
  return '<div class="modal-back" data-action="closeModal"></div><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button type="button" class="icon-btn modal-x" data-action="closeModal" data-fk="modal-x" aria-label="Fermer">' + ic('x', 18) + '</button>' +
    (S.modal === 'share' ? shareBody() : S.modal === 'legal' ? legalBody() : S.modal === 'report' ? reportBody() : S.modal === 'card' ? cardBody() : profileBody()) + '</div>';
}
function openModal(kind) {
  var a = document.activeElement;
  if (!S.modal) S.opener = a && a.dataset ? a.dataset.fk || null : null;
  S.modal = kind; S.profErr = ''; S.acct.err = ''; S.acct.info = ''; S.pdraft = null;
  render({ focus: '#modal-title' });
}
function closeModal() {
  var o = S.opener; S.modal = null; S.profErr = ''; S.acct.delAsk = false; S.pdraft = null;
  render(o ? { focus: '[data-fk="' + o + '"]' } : {});
}
function copyText(t) {
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t);
  return new Promise(function (ok, ko) {
    var ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy') ? ok() : ko(); } catch (e) { ko(e); } ta.remove();
  });
}
function saveProfile(form) {
  var fd = new FormData(form), name = String(fd.get('name') || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 20), av = String(fd.get('avatar') || '');
  if (!name) { S.profErr = 'Choisis un prénom ou un pseudo.'; render({ focus: '#modal-title' }); return; }
  var first = !data.profile.name;
  data.profile.name = name; data.profile.avatar = AVATARS.indexOf(av) >= 0 ? av : AVATARS[0]; data.profile.welcomed = true;
  if (sb && S.acct.user) sb.from('profiles').update({ display_name: name, avatar: data.profile.avatar }).eq('id', S.acct.user.id).then(function (r) { if (r.error) { S.notice = 'Ton profil est mis à jour ici, mais pas encore en ligne : réessaie plus tard.'; softRender(); } });
  var ok = persist();
  S.modal = null; S.profErr = ''; S.pdraft = null;
  S.notice = (first ? 'Bienvenue ' + name + ' ! Ton profil est créé.' : 'Profil mis à jour.') + (ok ? '' : ' Ton navigateur ne peut pas le conserver.');
  render({ top: true });
  if (first) celebrate(null, 40);
}
function applyAppearance() {
  var a = data.profile.appearance, st = data.profile.style === 'candy' ? 'candy' : 'calm', r = document.documentElement, metas = document.querySelectorAll('meta[name="theme-color"]');
  if (a === 'light' || a === 'dark') r.setAttribute('data-theme', a); else r.removeAttribute('data-theme');
  if (st === 'candy') r.setAttribute('data-style', 'candy'); else r.removeAttribute('data-style');
  if (data.profile.bg === 'off') r.setAttribute('data-bg', 'off'); else r.removeAttribute('data-bg');
  /* La barre du navigateur suit le thème choisi (en « automatique », elle suit celui de l'appareil). */
  var lightBar = st === 'candy' ? '#fff7fb' : '#ffffff', darkBar = st === 'candy' ? '#19122b' : '#100f14';
  if (metas.length === 2) { metas[0].setAttribute('content', a === 'dark' ? darkBar : lightBar); metas[1].setAttribute('content', a === 'light' ? lightBar : darkBar); }
}
/* On demande au navigateur de ne pas effacer les données du site si l'espace manque : seulement après un premier vrai usage (et jamais sur Firefox, où cela ouvre une fenêtre). */
var persistAsked = false;
function askPersist() {
  if (persistAsked) return;
  persistAsked = true;
  try { if (navigator.storage && navigator.storage.persist && !/firefox/i.test(navigator.userAgent)) navigator.storage.persist(); } catch (e) { /* facultatif */ }
}
function isStandalone() { return window.navigator.standalone === true || (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches); }
function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
var CONFETTI = ['#ff9ccb', '#ffb48a', '#ffd966', '#8fe3c3', '#8fd2ff', '#c3b2ff'];
/* Petite pluie de confettis (ignorée si l'utilisateur réduit les animations). */
function celebrate(rect, n) {
  try { if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(14); } catch (e) { /* facultatif */ }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
  box.style.left = (rect ? rect.left + rect.width / 2 : window.innerWidth / 2) + 'px';
  box.style.top = (rect ? rect.top + rect.height / 2 : window.innerHeight * 0.35) + 'px';
  for (var i = 0; i < (n || 24); i++) {
    var p = document.createElement('i');
    p.style.cssText = '--dx:' + Math.round((Math.random() - 0.5) * 340) + 'px;--up:' + Math.round(60 + Math.random() * 120) + 'px;--down:' + Math.round(60 + Math.random() * 180) + 'px;--rot:' + Math.round((Math.random() - 0.5) * 900) + 'deg;background:' + CONFETTI[i % CONFETTI.length] + ';animation-delay:' + Math.round(Math.random() * 120) + 'ms';
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(function () { box.remove(); }, 1700);
}
/* Rappels : un fichier agenda (.ics) avec chaque palier restant, à ouvrir dans n'importe quelle appli agenda. */
function icsEscape(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); }
function icsFold(line) { var out = [], s = line; while (s.length > 60) { out.push(s.slice(0, 60)); s = ' ' + s.slice(60); } out.push(s); return out.join('\r\n'); }
function icsStamp(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
function downloadCalendar() {
  var run = data.challenge.active; if (!run) return;
  var def = chById(run.id), start = new Date(run.startedAt).getTime(), now = Date.now(), n = 0;
  var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ARISE//Defis//FR', 'CALSCALE:GREGORIAN'];
  def.paliers.forEach(function (p, i) {
    var at = new Date(start + p.at * 36e5);
    if (run.done.indexOf(i) >= 0 || at.getTime() < now - 6e4) return;
    n++;
    L.push('BEGIN:VEVENT', 'UID:arise-' + run.id + '-' + start + '-' + i + '@arise', 'DTSTAMP:' + icsStamp(new Date()), 'DTSTART:' + icsStamp(at), 'DTEND:' + icsStamp(new Date(at.getTime() + 15 * 6e4)),
      icsFold('SUMMARY:' + icsEscape('ARISE · ' + def.title + ' : ' + p.title)), icsFold('DESCRIPTION:' + icsEscape(p.do)), 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:ARISE', 'TRIGGER:PT0S', 'END:VALARM', 'END:VEVENT');
  });
  L.push('END:VCALENDAR');
  if (!n) { S.notice = 'Tous les paliers sont déjà passés : il n’y a plus de rappel à ajouter.'; render({ top: true }); return; }
  var blob = new Blob([L.join('\r\n')], { type: 'text/calendar;charset=utf-8' }), url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = 'arise-' + run.id + '.ics'; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  S.notice = 'Rappels créés : ouvre le fichier téléchargé pour les ajouter à ton agenda (' + n + ' palier' + (n > 1 ? 's' : '') + ').';
  render({ top: true });
}
var deferredInstall = null;
window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredInstall = e; if ((S.tab === 'preferences' || S.tab === 'moment') && !S.modal) softRender(); });
window.addEventListener('appinstalled', function () { deferredInstall = null; });
/* Conseil d'installation, une seule fois et seulement quand la personne a déjà utilisé l'appli.
   Sur iPhone, Safari peut effacer les données d'un site qu'on n'ouvre pas pendant une semaine ; une appli ajoutée à l'écran d'accueil y échappe. */
function installCard() {
  var P = data.profile, used = data.history.length || data.rewards.cards.length || data.challenge.active || data.challenge.finished.length;
  if (P.installTip || !used || isStandalone()) return '';
  if (deferredInstall) {
    return '<section class="tip-card" aria-labelledby="tip-title"><div><h2 id="tip-title">Garde ARISE sous la main</h2><p>Ajoute-la à ton écran d’accueil : elle s’ouvre en plein écran et fonctionne même sans connexion.</p></div>' +
      '<div class="welcome-actions"><button class="primary-button" data-action="install" data-fk="tip-install">Installer ARISE</button><button class="text-button" data-action="dismissTip" data-fk="tip-no">Plus tard</button></div></section>';
  }
  if (isIOS()) {
    return '<section class="tip-card" aria-labelledby="tip-title"><div><h2 id="tip-title">Garde ARISE sous la main</h2><p>Touche <strong>Partager</strong> puis <strong>« Sur l’écran d’accueil »</strong>. Installée, ARISE s’ouvre en plein écran, marche sans connexion, et Safari n’efface plus ton suivi si tu passes quelques jours sans l’ouvrir.</p></div>' +
      '<div class="welcome-actions"><button class="text-button" data-action="dismissTip" data-fk="tip-no">Compris</button></div></section>';
  }
  return '';
}
function welcomeCard() {
  if (data.profile.name || data.profile.welcomed) return '';
  return '<section class="welcome-card" aria-labelledby="welcome-title"><div><h2 id="welcome-title">Bienvenue sur ARISE ' + ic('heart', 20) + '</h2><p>Crée ton profil pour personnaliser l’appli et inviter tes amis, ou découvre-la tout de suite : c’est comme tu veux.</p></div>' +
    '<div class="welcome-actions"><button class="primary-button" data-action="openProfile" data-fk="welcome-go">Créer mon profil</button><button class="text-button" data-action="dismissWelcome" data-fk="welcome-no">Plus tard</button></div></section>';
}

/* ---------- Comptes (e-mail), consentements RGPD, textes légaux ---------- */
var CFG = window.ARISE_CONFIG || {}, PUB = CFG.publisher || {}, LEGAL = window.ARISE_LEGAL || {};
var BACKEND = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && /^https:\/\/[^\s/]+/.test(CFG.supabaseUrl));
if (BACKEND && !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(CFG.supabaseUrl) && window.console) console.warn('ARISE : adresse Supabase personnalisée — ajoute-la dans « connect-src » de la balise Content-Security-Policy de index.html, sinon le navigateur bloquera les requêtes.');
if (!BACKEND && (CFG.supabaseUrl || CFG.supabaseAnonKey) && window.console) console.warn('ARISE : supabaseUrl doit commencer par https:// et supabaseAnonKey doit être renseignée (config.js).');
var SIGNUP_OK = BACKEND && !!(PUB.name && PUB.email && PUB.address);
var LEGAL_V = CFG.legalVersion || '1';
var sb = null;
if (BACKEND && !SIGNUP_OK && window.console) console.warn('ARISE : complète publisher (nom, adresse, e-mail) dans config.js pour ouvrir les inscriptions.');

/* Rendu qui laisse tranquille une personne en train de taper. */
function softRender() {
  var a = document.activeElement;
  if (a && app.contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.nodeName) && ['checkbox', 'radio', 'file', 'submit'].indexOf(a.type) < 0) return;
  render();
}
function cleanText(s, max) { return String(s || '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max); }
function authErr(e) {
  var m = e && e.message ? String(e.message) : '';
  if (/invalid login/i.test(m)) return 'Adresse e-mail ou mot de passe incorrect.';
  if (/not confirmed/i.test(m)) return 'Confirme d’abord ton adresse : un e-mail avec un lien t’a été envoyé.';
  if (/rate limit|too many|security purposes/i.test(m)) return 'Trop de tentatives. Patiente quelques minutes, puis réessaie.';
  if (/password/i.test(m) && /(weak|short|least|characters)/i.test(m)) return 'Ce mot de passe est trop faible : 8 caractères minimum, de préférence avec des chiffres.';
  if (/already registered|already exists/i.test(m)) return 'Un compte existe déjà avec cette adresse : connecte-toi.';
  if (/database error/i.test(m)) return 'Inscription refusée : vérifie que tu as bien accepté les conditions et confirmé ta majorité.';
  if (/fetch|network|failed/i.test(m)) return 'Impossible de joindre le service. Vérifie ta connexion.';
  return 'Une erreur est survenue. Réessaie dans un instant.';
}
function gErr(e) {
  var m = e && e.message ? String(e.message) : '';
  if (!m || /row-level security|violates|permission|jwt|policy|schema cache/i.test(m)) return 'Action impossible pour le moment. Réessaie, ou vérifie que tu es bien connecté·e.';
  return m;
}
function initBackend() {
  try { sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }); }
  catch (e) { S.acct.ready = true; S.acct.offline = true; softRender(); return; }
  sb.auth.onAuthStateChange(function (event, session) {
    S.acct.user = session ? session.user : null; S.acct.ready = true;
    if (event === 'PASSWORD_RECOVERY') { S.acctTab = 'recover'; S.modal = 'profile'; }
    if (S.acct.user) setTimeout(afterSignIn, 0);
    else { S.acct.synced = false; S.acct.consent = null; S.grp.list = null; S.grp.view = null; S.grp.detail = null; }
    softRender();
  });
  sb.auth.getSession().then(function (r) {
    S.acct.user = r.data && r.data.session ? r.data.session.user : null; S.acct.ready = true;
    if (S.acct.user) afterSignIn();
    softRender();
  }, function () { S.acct.ready = true; S.acct.offline = true; softRender(); });
}
function loadBackend() {
  if (!BACKEND) return;
  if (window.supabase && window.supabase.createClient) { initBackend(); return; }
  /* Version figée + empreinte d'intégrité (SRI) : si le fichier du CDN était modifié, le navigateur le refuserait.
     Pour mettre à jour la bibliothèque : voir SUPABASE.txt (étape « mettre à jour la bibliothèque »). */
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/dist/umd/supabase.js'; s.async = true;
  s.integrity = 'sha384-Rj26LVGvoeRVR6+mwQmFfcR3QOBEwT+ZmuCWpuiqeTzJpCs0ER4ITAWGb4Hiy3Ok'; s.crossOrigin = 'anonymous';
  s.onload = initBackend;
  s.onerror = function () { S.acct.ready = true; S.acct.offline = true; softRender(); };
  document.head.appendChild(s);
}
function afterSignIn() {
  if (S.acct.synced || !sb || !S.acct.user) return;
  S.acct.synced = true;
  var uid = S.acct.user.id;
  sb.from('profiles').select('display_name,avatar,photo').eq('id', uid).maybeSingle().then(function (r) {
    if (r.data) {
      data.profile.photo = validPhoto(r.data.photo) ? r.data.photo : '';
      data.profile.name = cleanText(r.data.display_name, 20);
      if (AVATARS.indexOf(r.data.avatar) >= 0) data.profile.avatar = r.data.avatar; else if (!data.profile.avatar) data.profile.avatar = AVATARS[0];
      data.profile.welcomed = true; persist(); softRender();
    }
  });
  sb.from('consents').select('cgu_version,accepted_at,marketing_opt_in').eq('user_id', uid).maybeSingle().then(function (r) { S.acct.consent = r.data || null; softRender(); });
}
function downloadJson(name, obj) {
  var blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

/* Textes légaux : remplis avec les valeurs de config.js. */
function fillLegal(s) { return String(s).replace(/\{\{(\w+)\}\}/g, function (m, k) { var v = PUB[k]; return v ? v : (k === 'dpo' ? '' : '[à compléter]'); }); }
function legalSections(kind) {
  var d = LEGAL[kind];
  if (!d) return '<p>Ce texte n’est pas disponible.</p>';
  return d.sections.map(function (s) { return '<h3>' + esc(s.h) + '</h3>' + s.p.map(function (p) { return '<p>' + esc(fillLegal(p)) + '</p>'; }).join(''); }).join('');
}
function legalBody() {
  var kinds = [['cgu', 'Conditions'], ['privacy', 'Confidentialité'], ['mentions', 'Mentions']], k = LEGAL[S.legalTab] ? S.legalTab : 'cgu';
  return '<h2 id="modal-title" tabindex="-1">' + esc(LEGAL[k] ? LEGAL[k].title : 'Textes légaux') + '</h2><div class="mode-switch" role="group" aria-label="Textes légaux">' + kinds.map(function (x) {
    return '<button type="button" class="' + (k === x[0] ? 'on' : '') + '" aria-pressed="' + (k === x[0]) + '" data-fk="lt-' + x[0] + '" data-action="legalTab" data-v="' + x[0] + '">' + x[1] + '</button>';
  }).join('') + '</div><div class="legal-text">' + legalSections(k) + '</div><p class="habit-note">Version du ' + esc(LEGAL_V) + '</p>';
}

/* Formulaires du compte */
function fld(label, name, type, attrs, val) { return '<label class="field">' + label + '<input type="' + type + '" name="' + name + '" ' + attrs + ' value="' + esc(val || '') + '"></label>'; }
function consentBox(name, html, req, panel) {
  return '<label class="check-label consent-row"><input type="checkbox" name="' + name + '" data-draft="1"' + (req ? ' required' : '') + (S.draftAcct[name] ? ' checked' : '') + '><span>' + html + (req ? '' : ' <em>(facultatif)</em>') + '</span></label>' + (panel || '');
}
function legalPanel(kind, label) { return '<details class="legal-inline"><summary>' + esc(label) + '</summary><div class="legal-text">' + legalSections(kind) + '</div></details>'; }
function authAlerts() {
  var A = S.acct;
  return (A.err ? '<div class="message error" role="alert" style="margin:0 0 12px"><span>' + esc(A.err) + '</span></div>' : '') + (A.info ? '<div class="message success" role="status" style="margin:0 0 12px">' + ic('ok', 20) + '<span>' + esc(A.info) + '</span></div>' : '');
}
function authBody() {
  var A = S.acct, D = S.draftAcct, tab = S.acctTab, dis = A.busy ? ' disabled' : '', title = '<h2 id="modal-title" tabindex="-1">';
  var localLink = '<div class="modal-sep"></div><button type="button" class="text-button" data-action="acctTab" data-v="local" data-fk="at-local">Seulement un profil sur cet appareil, sans compte</button>';
  if (A.offline) return title + 'Service indisponible</h2><p>Impossible de joindre le service des comptes pour le moment. Réessaie plus tard : le reste d’ARISE fonctionne normalement.</p>' + localLink;
  if (!SIGNUP_OK) return title + 'Comptes et groupes : bientôt</h2><p>L’inscription par e-mail et les groupes de sorties ouvriront très bientôt. En attendant, tu peux utiliser ARISE avec un profil sur ton appareil.</p>' + localLink;
  if (tab === 'sent') return title + 'Vérifie ta boîte mail</h2><p>Si l’adresse <strong>' + esc(A.sentTo || '') + '</strong> est valide, un e-mail de confirmation vient d’être envoyé. Clique sur le lien qu’il contient pour activer ton compte, puis reviens te connecter.</p><p class="habit-note">Rien reçu ? Regarde dans tes courriers indésirables.</p><button type="button" class="primary-button" data-action="acctTab" data-v="signin" data-fk="at-signin">Me connecter</button>';
  if (tab === 'recover') return title + 'Nouveau mot de passe</h2>' + authAlerts() + '<form data-form="recover">' + fld('Nouveau mot de passe', 'password', 'password', 'required minlength="8" autocomplete="new-password"' + dis, '') + '<p class="habit-note" style="margin-top:-6px">8 caractères minimum.</p><div class="share-actions"><button class="primary-button" type="submit"' + dis + '>Enregistrer</button></div></form>';
  if (tab === 'forgot') return title + 'Mot de passe oublié</h2><p class="habit-note" style="margin:0 0 14px">Indique ton adresse : si elle a un compte, tu recevras un lien pour choisir un nouveau mot de passe.</p>' + authAlerts() +
    '<form data-form="forgot">' + fld('Adresse e-mail', 'email', 'email', 'required autocomplete="email"' + dis, D.email) + '<div class="share-actions"><button class="primary-button" type="submit"' + dis + '>Envoyer le lien</button><button type="button" class="text-button" data-action="acctTab" data-v="signin" data-fk="at-back">Retour</button></div></form>';
  var signup = tab !== 'signin';
  var tabs = '<div class="mode-switch" role="group" aria-label="Inscription ou connexion"><button type="button" class="' + (signup ? 'on' : '') + '" aria-pressed="' + signup + '" data-fk="at-signup" data-action="acctTab" data-v="signup">Je m’inscris</button><button type="button" class="' + (signup ? '' : 'on') + '" aria-pressed="' + !signup + '" data-fk="at-signin" data-action="acctTab" data-v="signin">Je me connecte</button></div>';
  if (!signup) {
    return title + 'Content de te revoir</h2>' + authAlerts() + tabs + '<form data-form="signin" style="margin-top:16px">' + fld('Adresse e-mail', 'email', 'email', 'required autocomplete="email" data-draft="1"' + dis, D.email) +
      fld('Mot de passe', 'password', 'password', 'required autocomplete="current-password"' + dis, '') + '<div class="share-actions"><button class="primary-button" type="submit"' + dis + '>Me connecter</button><button type="button" class="text-button" data-action="acctTab" data-v="forgot" data-fk="at-forgot">Mot de passe oublié ?</button></div></form>' + localLink;
  }
  return title + 'Crée ton compte</h2><p class="habit-note" style="margin:0 0 14px">Un compte sert à rejoindre ou créer des groupes de sorties, et à retrouver ton profil partout.</p>' + authAlerts() + tabs +
    '<form data-form="signup" style="margin-top:16px">' + fld('Mon prénom ou pseudo', 'name', 'text', 'required minlength="2" maxlength="20" autocomplete="nickname" data-draft="1"' + dis, D.name || data.profile.name) + avatarPicker(D.avatar || data.profile.avatar, true) +
    fld('Adresse e-mail', 'email', 'email', 'required autocomplete="email" data-draft="1"' + dis, D.email) + fld('Mot de passe', 'password', 'password', 'required minlength="8" autocomplete="new-password"' + dis, '') +
    '<p class="habit-note" style="margin:-6px 0 14px">8 caractères minimum. Ton e-mail n’est jamais visible des autres membres.</p>' +
    '<fieldset class="consents"><legend>Mes accords</legend>' +
    consentBox('adult', 'J’ai 18 ans ou plus.', true) +
    consentBox('cgu', 'J’ai lu et j’accepte les conditions générales d’utilisation.', true, legalPanel('cgu', 'Lire les conditions générales')) +
    consentBox('privacy', 'J’ai lu la politique de confidentialité et je sais comment mes données sont utilisées.', true, legalPanel('privacy', 'Lire la politique de confidentialité')) +
    consentBox('marketing', 'Je souhaite recevoir des nouvelles d’ARISE par e-mail.', false) + '</fieldset>' +
    '<div class="share-actions"><button class="primary-button" type="submit"' + dis + '>' + (A.busy ? 'Un instant…' : 'Créer mon compte') + '</button></div></form>' + localLink;
}
function accountBody() {
  var A = S.acct, u = A.user, p = data.profile, c = A.consent;
  var n = data.challenge.finished.filter(function (f) { return f.status === 'finished'; }).length;
  var del = A.delAsk
    ? '<div class="message error" role="alert"><span>Supprimer ton compte efface ton profil, tes groupes créés et tes inscriptions. C’est définitif. Ton suivi sur cet appareil est conservé.</span><button type="button" data-fk="del-yes" data-action="deleteYes">Oui, supprimer</button><button type="button" data-fk="del-no" data-action="deleteNo">Annuler</button></div>'
    : '<button type="button" class="text-button" data-action="deleteAsk" data-fk="del-ask">Supprimer mon compte</button>';
  return '<h2 id="modal-title" tabindex="-1">' + avatarHtml(p, 'av-inline') + ' Bonjour ' + esc(p.name || 'toi') + '</h2><p class="habit-note" style="margin:0 0 14px">' + esc(u.email || '') + ' · ' + doneCount() + ' / 7 invitations · ' + n + ' médaille' + (n > 1 ? 's' : '') + '</p>' + authAlerts() +
    '<form data-form="profile">' + photoField() + '<label class="field">Mon prénom ou pseudo<input type="text" name="name" maxlength="20" required value="' + esc(S.pdraft ? S.pdraft.name : p.name) + '"></label>' + avatarPicker((S.pdraft && S.pdraft.avatar) || p.avatar) +
    '<div class="share-actions"><button class="primary-button" type="submit">Enregistrer</button><button type="button" class="share-btn" data-action="nav" data-v="groups" data-fk="acct-groups">' + ic('users', 18) + 'Mes groupes</button></div></form>' +
    '<div class="modal-sep"></div><h3 class="modal-h3">Mes données et mes accords</h3>' +
    (c ? '<p class="habit-note" style="margin:0 0 10px">Conditions et confidentialité acceptées le ' + esc(new Date(c.accepted_at).toLocaleDateString('fr-FR')) + ' (version ' + esc(c.cgu_version) + ').</p>' +
      '<label class="check-label consent-row"><input type="checkbox" data-change="marketing"' + (c.marketing_opt_in ? ' checked' : '') + '><span>Recevoir des nouvelles d’ARISE par e-mail</span></label>' : '') +
    '<div class="data-actions"><button type="button" class="text-button" data-action="exportAccount" data-fk="acct-export">Télécharger mes données</button><button type="button" class="text-button" data-action="signOut" data-fk="acct-out">Me déconnecter</button></div>' + del +
    '<div class="data-actions"><button type="button" class="text-button" data-action="openLegal" data-v="cgu" data-fk="acct-cgu">Conditions</button><button type="button" class="text-button" data-action="openLegal" data-v="privacy" data-fk="acct-priv">Confidentialité</button></div>';
}
function profileBody() {
  if (BACKEND) {
    if (S.acct.user) return accountBody();
    if (S.acctTab !== 'local') return authBody();
  }
  return localProfileBody();
}
function reportBody() {
  var r = S.report || {};
  return '<h2 id="modal-title" tabindex="-1">Signaler</h2><p class="habit-note" style="margin:0 0 14px">' + esc(r.label || '') + '. Ton signalement est confidentiel et examiné par l’équipe.</p>' +
    (S.profErr ? '<div class="message error" role="alert" style="margin:0 0 12px"><span>' + esc(S.profErr) + '</span></div>' : '') +
    '<form data-form="report"><label class="field">Motif<select name="reason"><option value="harcelement">Harcèlement ou comportement déplacé</option><option value="securite">Je ne me sens pas en sécurité</option><option value="contenu">Contenu inapproprié</option><option value="spam">Publicité ou arnaque</option><option value="autre">Autre</option></select></label>' +
    '<label class="field">Précisions (facultatif)<textarea name="details" maxlength="500" rows="3"></textarea></label><div class="share-actions"><button class="primary-button" type="submit">Envoyer le signalement</button></div></form>' +
    '<p class="habit-note">En cas de danger immédiat, appelle le 17 (police) ou le 112.</p>';
}

function doSignup(form) {
  var fd = new FormData(form), A = S.acct, name = cleanText(fd.get('name'), 20), email = String(fd.get('email') || '').trim(), pw = String(fd.get('password') || ''), av = String(fd.get('avatar') || '');
  var fail = function (m) { A.err = m; render({ focus: '#modal-title' }); };
  if (!sb) return fail('Le service n’est pas joignable pour le moment.');
  if (name.length < 2) return fail('Choisis un prénom ou un pseudo (2 lettres minimum).');
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail('Cette adresse e-mail ne semble pas valide.');
  if (pw.length < 8) return fail('Le mot de passe doit faire au moins 8 caractères.');
  if (!fd.get('adult') || !fd.get('cgu') || !fd.get('privacy')) return fail('Pour créer ton compte, coche les trois accords obligatoires.');
  av = AVATARS.indexOf(av) >= 0 ? av : AVATARS[0];
  A.busy = true; A.err = ''; render({ focus: '#modal-title' });
  sb.auth.signUp({ email: email, password: pw, options: { emailRedirectTo: baseUrl(), data: { display_name: name, avatar: av, adult: true, cgu_version: LEGAL_V, privacy_version: LEGAL_V, marketing: !!fd.get('marketing') } } }).then(function (r) {
    A.busy = false;
    if (r.error) { A.err = authErr(r.error); render({ focus: '#modal-title' }); return; }
    data.profile.name = name; data.profile.avatar = av; data.profile.welcomed = true; persist();
    S.draftAcct = {};
    if (r.data && r.data.session) { S.modal = null; S.notice = 'Bienvenue ' + name + ' ! Ton compte est créé.'; render({ top: true }); celebrate(null, 40); }
    else { S.acctTab = 'sent'; A.sentTo = email; render({ focus: '#modal-title' }); }
  }, function (e) { A.busy = false; A.err = authErr(e); render({ focus: '#modal-title' }); });
}
function doSignin(form) {
  var fd = new FormData(form), A = S.acct, email = String(fd.get('email') || '').trim(), pw = String(fd.get('password') || '');
  if (!sb) { A.err = 'Le service n’est pas joignable pour le moment.'; render({ focus: '#modal-title' }); return; }
  A.busy = true; A.err = ''; render({ focus: '#modal-title' });
  sb.auth.signInWithPassword({ email: email, password: pw }).then(function (r) {
    A.busy = false;
    if (r.error) { A.err = authErr(r.error); render({ focus: '#modal-title' }); return; }
    S.draftAcct = {}; S.modal = null; S.notice = 'Content de te revoir !'; render({ top: true });
  }, function (e) { A.busy = false; A.err = authErr(e); render({ focus: '#modal-title' }); });
}
function doForgot(form) {
  var email = String(new FormData(form).get('email') || '').trim(), A = S.acct;
  if (!sb) return;
  A.busy = true; A.err = ''; render({ focus: '#modal-title' });
  sb.auth.resetPasswordForEmail(email, { redirectTo: baseUrl() }).then(function (r) {
    A.busy = false;
    if (r.error && /rate limit|too many|security purposes/i.test(String(r.error.message))) A.err = authErr(r.error);
    else A.info = 'Si cette adresse a un compte, un e-mail avec un lien vient d’être envoyé.';
    render({ focus: '#modal-title' });
  }, function (e) { A.busy = false; A.err = authErr(e); render({ focus: '#modal-title' }); });
}
function doRecover(form) {
  var pw = String(new FormData(form).get('password') || ''), A = S.acct;
  if (!sb) return;
  if (pw.length < 8) { A.err = 'Le mot de passe doit faire au moins 8 caractères.'; render({ focus: '#modal-title' }); return; }
  A.busy = true; A.err = ''; render({ focus: '#modal-title' });
  sb.auth.updateUser({ password: pw }).then(function (r) {
    A.busy = false;
    if (r.error) { A.err = authErr(r.error); render({ focus: '#modal-title' }); return; }
    S.acctTab = 'signup'; S.modal = null; S.notice = 'Mot de passe mis à jour.'; render({ top: true });
  }, function (e) { A.busy = false; A.err = authErr(e); render({ focus: '#modal-title' }); });
}
function doSignOut() {
  if (!sb) return;
  sb.auth.signOut().then(function () { S.modal = null; S.notice = 'Tu es déconnecté·e. Ton suivi reste sur cet appareil.'; render({ top: true }); });
}
function exportAccount() {
  if (!sb || !S.acct.user) return;
  var uid = S.acct.user.id;
  Promise.all([sb.from('profiles').select('*').eq('id', uid), sb.from('consents').select('*').eq('user_id', uid), sb.from('group_members').select('*').eq('user_id', uid),
    sb.from('meetup_attendees').select('*').eq('user_id', uid), sb.from('groups').select('*').eq('created_by', uid), sb.from('meetups').select('*').eq('created_by', uid)]).then(function (r) {
    downloadJson('arise-mes-donnees-' + new Date().toISOString().slice(0, 10) + '.json', {
      exportedAt: new Date().toISOString(), email: S.acct.user.email, profile: r[0].data, consents: r[1].data, groupMemberships: r[2].data,
      meetupRegistrations: r[3].data, groupsCreated: r[4].data, meetupsCreated: r[5].data,
      note: 'Les signalements que tu as envoyés ne sont pas inclus pour protéger la confidentialité des personnes concernées : écris-nous pour les obtenir.'
    });
    S.acct.info = 'Tes données ont été téléchargées.'; render({ focus: '#modal-title' });
  }, function () { S.acct.err = 'Export impossible pour le moment.'; render({ focus: '#modal-title' }); });
}
function deleteAccount() {
  if (!sb) return;
  sb.rpc('delete_my_account').then(function (r) {
    if (r.error) { S.acct.err = gErr(r.error); S.acct.delAsk = false; render({ focus: '#modal-title' }); return; }
    var done = function () { S.acct.user = null; S.acct.synced = false; S.acct.delAsk = false; data.profile.name = ''; data.profile.avatar = ''; data.profile.photo = ''; persist(); S.modal = null; S.notice = 'Ton compte et tes données en ligne ont été supprimés.'; render({ top: true }); };
    sb.auth.signOut().then(done, done);
  });
}

/* ---------- Groupes de sorties ---------- */
var GROUP_TONE = { outside: 'mint', creative: 'pink', movement: 'lemon' };
function fmtWhen(iso) { return new Date(iso).toLocaleString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }); }
function pf(row) { var p = row && row.profiles; return (Array.isArray(p) ? p[0] : p) || {}; }
function who(row) { var p = pf(row); return (p.avatar ? p.avatar + ' ' : '') + (p.display_name || 'Membre'); }
function whoHtml(row) { var p = pf(row); return avatarHtml(p, 'av-inline') + esc(p.display_name || 'Membre'); }
function opt(v, l, sel) { return '<option value="' + esc(v) + '"' + (sel ? ' selected' : '') + '>' + esc(l) + '</option>'; }
function groupIntro() {
  return '<div class="greeting"><p class="eyebrow">Sorties en groupe</p><h1>Se retrouver,<br><span>sans écran.</span></h1><p>Rejoins un groupe près de chez toi ou crée le tien : balades, ateliers, pauses… de vraies rencontres, dans des lieux publics, téléphone rangé.</p></div>';
}
function groupCharter() {
  return '<section class="safety-card" aria-labelledby="gsafe-title"><h2 id="gsafe-title">Charte des sorties</h2><ul>' +
    '<li>Rendez-vous dans un lieu public et fréquenté, de préférence de jour.</li><li>Préviens un proche : où, quand, avec qui.</li>' +
    '<li>Ne donne ni ton adresse ni ton numéro avant de te sentir en confiance.</li><li>Tu peux partir à tout moment, sans te justifier.</li>' +
    '<li>Respect et bienveillance : ni harcèlement, ni vente, ni démarchage.</li><li>Un souci ? Utilise « Signaler » : les signalements sont examinés par l’équipe.</li></ul></section>';
}
function ensureGroups() {
  if (S.tab !== 'groups' || !sb || !S.acct.user || S.grp.list !== null || S.grp.loading) return;
  loadGroups();
}
function loadGroups() {
  if (!sb || !S.acct.user) return;
  S.grp.loading = true; S.grp.err = '';
  sb.rpc('list_groups', { p_city: S.grp.city || null, p_theme: S.grp.theme || null }).then(function (r) {
    S.grp.loading = false;
    if (r.error) { S.grp.err = gErr(r.error); S.grp.list = []; } else S.grp.list = r.data || [];
    softRender();
  }, function () { S.grp.loading = false; S.grp.list = []; S.grp.err = 'Impossible de charger les groupes. Vérifie ta connexion.'; softRender(); });
}
function loadDetail(id) {
  var now = new Date().toISOString();
  Promise.all([
    sb.from('groups').select('*').eq('id', id).maybeSingle(),
    sb.from('group_members').select('user_id,role,profiles(display_name,avatar,photo)').eq('group_id', id),
    sb.from('meetups').select('*').eq('group_id', id).gte('starts_at', now).order('starts_at', { ascending: true }),
    sb.from('meetup_attendees').select('meetup_id,user_id,profiles(display_name,avatar)').eq('group_id', id)
  ]).then(function (r) {
    if (S.grp.view !== id) return;
    S.grp.detail = (r[0].error || !r[0].data) ? { missing: true } : { g: r[0].data, members: r[1].data || [], meetups: r[2].data || [], attendees: r[3].data || [] };
    S.grp.busy = false; softRender();
  }, function () { if (S.grp.view === id) { S.grp.detail = { missing: true }; S.grp.busy = false; softRender(); } });
}
function refreshGroup() { if (S.grp.view) loadDetail(S.grp.view); S.grp.list = null; }
function openGroup(id) { S.grp.view = id; S.grp.detail = null; S.grp.form = null; S.grp.delAsk = false; S.grp.err = ''; render({ top: true }); loadDetail(id); }
function groupCard(g) {
  var tone = GROUP_TONE[g.theme] || 'lilac', full = Number(g.member_count) >= g.max_members;
  return '<article class="challenge-card group-card tone-' + tone + '"><div class="ch-top"><span class="ch-icon">' + ic(THEME_ICON[g.theme] || 'flower', 26) + '</span><span class="ch-chips"><span class="mini-chip">' + ic('pin', 13) + ' ' + esc(g.city) + '</span>' + (g.is_member ? '<span class="mini-chip live">Mon groupe</span>' : full ? '<span class="mini-chip">Complet</span>' : '') + '</span></div>' +
    '<h3>' + esc(g.name) + '</h3><p>' + esc(g.description || themeLabel(g.theme)) + '</p>' +
    '<p class="group-meta">' + ic('users', 15) + ' ' + Number(g.member_count) + ' / ' + g.max_members + ' membres' + (g.next_meetup ? ' · Prochaine sortie : ' + esc(new Date(g.next_meetup).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })) : '') + '</p>' +
    '<button class="primary-button" data-action="grpOpen" data-v="' + esc(g.id) + '" data-fk="g-' + esc(g.id) + '">Voir le groupe</button></article>';
}
function groupForm() {
  return '<section class="form-card" aria-labelledby="gf-title"><h2 id="gf-title">Créer un groupe</h2>' + (S.grp.err ? '<div class="message error" role="alert" style="margin:0 0 12px"><span>' + esc(S.grp.err) + '</span></div>' : '') +
    '<form data-form="grpcreate">' + fld('Nom du groupe', 'name', 'text', 'required minlength="3" maxlength="40" placeholder="Par exemple : Balades sans écran"', '') + fld('Ville', 'city', 'text', 'required minlength="2" maxlength="40"', S.grp.city) +
    '<label class="field">Thème<select name="theme">' + themes.map(function (t) { return opt(t.id, t.label, t.id === data.profile.theme); }).join('') + '</select></label>' +
    '<label class="field">Description (facultatif)<textarea name="description" maxlength="300" rows="3" placeholder="À qui s’adresse le groupe ? Quel rythme ?"></textarea></label>' +
    '<label class="field">Nombre de places<select name="max">' + [5, 8, 10, 15, 20, 30].map(function (n) { return opt(n, n + ' membres', n === 10); }).join('') + '</select></label>' +
    '<label class="check-label consent-row"><input type="checkbox" name="charter" required><span>Je m’engage à proposer des sorties dans des lieux publics, ouvertes à tous, et à respecter la charte.</span></label>' +
    '<div class="share-actions"><button class="primary-button" type="submit"' + (S.grp.busy ? ' disabled' : '') + '>Créer le groupe</button><button type="button" class="text-button" data-action="grpFormClose" data-fk="gf-close">Annuler</button></div></form></section>';
}
function viewGroupList() {
  var G = S.grp, list = G.list || [], mine = list.filter(function (g) { return g.is_member; }), others = list.filter(function (g) { return !g.is_member; });
  var h = '<form class="group-filter" data-form="grpfilter"><label class="field">Ville<input type="search" name="city" maxlength="40" value="' + esc(G.city) + '" placeholder="Ma ville"></label>' +
    '<label class="field">Thème<select name="theme">' + opt('', 'Tous les thèmes', !G.theme) + themes.map(function (t) { return opt(t.id, t.label, G.theme === t.id); }).join('') + '</select></label>' +
    '<button class="share-btn" type="submit">' + ic('pin', 16) + 'Chercher</button><button type="button" class="primary-button" data-action="grpCreateOpen" data-fk="g-create">' + ic('users', 18) + 'Créer un groupe</button></form>';
  if (G.form === 'group') h += groupForm();
  if (G.err && G.form !== 'group') h += '<div class="message error" role="alert"><span>' + esc(G.err) + '</span></div>';
  if (G.loading && !G.list) return h + '<p class="empty-note">Chargement des groupes…</p>';
  if (mine.length) h += '<h2 class="block-title">Mes groupes</h2><div class="challenge-grid">' + mine.map(groupCard).join('') + '</div>';
  h += '<h2 class="block-title">' + (mine.length ? 'Autres groupes' : 'Groupes' + (G.city ? ' à ' + esc(G.city) : '')) + '</h2>';
  h += others.length ? '<div class="challenge-grid">' + others.map(groupCard).join('') + '</div>' : '<p class="empty-note">' + (list.length ? 'Pas d’autre groupe pour ces critères.' : 'Aucun groupe pour l’instant' + (G.city ? ' à ' + esc(G.city) : '') + ' : sois la première personne à en créer un !') + '</p>';
  return h;
}
function meetupCard(m, D, uid, isOrg) {
  var att = D.attendees.filter(function (a) { return a.meetup_id === m.id; }), me = att.some(function (a) { return a.user_id === uid; }), full = att.length >= m.max_participants;
  return '<article class="meetup-card"><div class="meetup-date">' + esc(new Date(m.starts_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })) + '</div><div class="meetup-main"><h3>' + esc(m.title) + '</h3>' +
    '<p class="group-meta">' + ic('clock', 15) + ' ' + esc(fmtWhen(m.starts_at)) + '</p><p class="group-meta">' + ic('pin', 15) + ' ' + esc(m.place) + '</p>' + (m.description ? '<p>' + esc(m.description) + '</p>' : '') +
    '<p class="habit-note" style="margin:6px 0">' + att.length + ' / ' + m.max_participants + ' participant' + (att.length > 1 ? 's' : '') + (att.length ? ' : ' + att.map(who).map(esc).join(', ') : '') + '</p>' +
    '<div class="step-actions"><button class="' + (me ? 'share-btn' : 'primary-button') + '" data-action="rsvp" data-v="' + esc(m.id) + '" data-fk="rsvp-' + esc(m.id) + '"' + (!me && full ? ' disabled' : '') + '>' + (me ? 'Je ne viens plus' : full ? 'Complet' : ic('check', 16) + 'Je viens') + '</button>' +
    (isOrg ? '<button class="text-button" data-action="meetupDel" data-v="' + esc(m.id) + '" data-fk="mdel-' + esc(m.id) + '">Annuler cette sortie</button>' : '<button class="text-button" data-action="openReport" data-t="meetup" data-v="' + esc(m.id) + '" data-label="Sortie : ' + esc(m.title) + '" data-fk="rep-' + esc(m.id) + '">Signaler</button>') + '</div></div></article>';
}
function meetupForm() {
  var min = new Date(Date.now() + 36e5 - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
  return '<section class="form-card" aria-labelledby="mf-title"><h2 id="mf-title">Proposer une sortie</h2>' + (S.grp.err ? '<div class="message error" role="alert" style="margin:0 0 12px"><span>' + esc(S.grp.err) + '</span></div>' : '') +
    '<form data-form="meetupcreate">' + fld('Titre', 'title', 'text', 'required minlength="3" maxlength="60" placeholder="Par exemple : Balade au bord de l’eau"', '') + fld('Date et heure', 'when', 'datetime-local', 'required min="' + min + '"', '') +
    fld('Lieu de rendez-vous (public)', 'place', 'text', 'required minlength="3" maxlength="80" placeholder="Parvis de la gare, entrée du parc…"', '') +
    '<label class="field">Description (facultatif)<textarea name="description" maxlength="300" rows="3" placeholder="Durée, niveau, ce qu’il faut prévoir…"></textarea></label>' +
    '<label class="field">Places<select name="max">' + [4, 6, 8, 10, 15, 20, 30].map(function (n) { return opt(n, n + ' personnes', n === 10); }).join('') + '</select></label>' +
    '<p class="habit-note" style="margin:0 0 12px">Choisis un lieu public et fréquenté. Ne publie pas d’adresse personnelle.</p>' +
    '<div class="share-actions"><button class="primary-button" type="submit"' + (S.grp.busy ? ' disabled' : '') + '>Publier la sortie</button><button type="button" class="text-button" data-action="grpFormClose" data-fk="mf-close">Annuler</button></div></form></section>';
}
function viewGroupDetail() {
  var G = S.grp, D = G.detail, uid = S.acct.user.id, item = (G.list || []).filter(function (x) { return x.id === G.view; })[0];
  var h = '<button class="back-button" data-action="grpBack" data-fk="g-back"><span>' + ic('left', 18) + '</span>Tous les groupes</button>';
  if (!D) return h + '<p class="empty-note">Chargement du groupe…</p>';
  if (D.missing) return h + '<p class="empty-note">Ce groupe est introuvable ou n’est plus disponible.</p>';
  var g = D.g, mem = D.members.some(function (m) { return m.user_id === uid; }), org = D.members.some(function (m) { return m.user_id === uid && m.role === 'organizer'; }) || g.created_by === uid;
  var count = mem ? D.members.length : item ? Number(item.member_count) : 0, full = count >= g.max_members;
  h += '<section class="challenge-hero tone-' + (GROUP_TONE[g.theme] || 'lilac') + '"><div class="ch-top"><span class="ch-icon">' + ic(THEME_ICON[g.theme] || 'flower', 30) + '</span><span class="ch-chips"><span class="mini-chip">' + ic('pin', 13) + ' ' + esc(g.city) + '</span><span class="mini-chip">' + esc(themeLabel(g.theme)) + '</span><span class="mini-chip">' + count + ' / ' + g.max_members + ' membres</span></span></div>' +
    '<h1 id="g-title" tabindex="-1">' + esc(g.name) + '</h1>' + (g.description ? '<p>' + esc(g.description) + '</p>' : '') + '</section>';
  if (G.err) h += '<div class="message error" role="alert"><span>' + esc(G.err) + '</span></div>';
  if (!mem) {
    h += '<div class="start-box"><button class="primary-button" data-action="grpJoin" data-fk="g-join"' + (full || G.busy ? ' disabled' : '') + '>' + (full ? 'Groupe complet' : ic('users', 18) + 'Rejoindre ce groupe') + '</button><p class="habit-note" style="margin:0">En rejoignant ce groupe, tu acceptes la charte ci-dessous. Les sorties et la liste des membres sont visibles une fois dans le groupe.</p></div>' + groupCharter();
  } else {
    h += '<div class="section-heading" style="margin-top:26px"><h2>Prochaines sorties</h2>' + (org && G.form !== 'meetup' ? '<button class="primary-button" data-action="meetupFormOpen" data-fk="m-new">' + ic('calendar', 18) + 'Proposer une sortie</button>' : '') + '</div>';
    if (G.form === 'meetup') h += meetupForm();
    h += D.meetups.length ? '<div class="meetup-list">' + D.meetups.map(function (m) { return meetupCard(m, D, uid, org); }).join('') + '</div>' : '<p class="empty-note">Aucune sortie prévue' + (org ? ' : propose la première !' : ' pour l’instant. Les organisateurs en proposeront bientôt.') + '</p>';
    h += '<h2 class="block-title">Membres</h2><div class="pill-row">' + D.members.map(function (m) { return '<span class="pill">' + whoHtml(m) + (m.role === 'organizer' ? ' · organisateur·rice' : '') + '</span>'; }).join('') + '</div>' + groupCharter();
  }
  h += '<div class="data-actions" style="margin-top:22px"><button class="text-button" data-action="openReport" data-t="group" data-v="' + esc(g.id) + '" data-label="Groupe : ' + esc(g.name) + '" data-fk="rep-g">Signaler ce groupe</button>';
  if (mem && !org) h += '<button class="text-button" data-action="grpLeave" data-fk="g-leave">Quitter le groupe</button>';
  if (org) h += G.delAsk ? '<span>Supprimer ce groupe et ses sorties ?</span><button class="text-button" data-action="grpDelYes" data-fk="g-del-yes">Oui, supprimer</button><button class="text-button" data-action="grpDelNo" data-fk="g-del-no">Annuler</button>' : '<button class="text-button" data-action="grpDelAsk" data-fk="g-del-ask">Supprimer le groupe</button>';
  return h + '</div>';
}
function viewGroups() {
  var h = '<div class="groups-page">' + groupIntro();
  if (!BACKEND) {
    return h + '<section class="form-card"><h2>Bientôt disponible</h2><p>Les groupes de sorties ouvriront dès que les comptes seront prêts. Tu pourras alors rejoindre des personnes près de chez toi, ou créer ton propre groupe.</p><button class="primary-button" data-action="openShare" data-fk="g-share">' + ic('share', 18) + 'Prévenir mes amis</button></section>' + groupCharter() + '</div>';
  }
  if (S.acct.offline) return h + '<div class="message error" role="alert"><span>Impossible de joindre le service pour le moment. Réessaie plus tard.</span></div></div>';
  if (!S.acct.ready) return h + '<p class="empty-note">Chargement…</p></div>';
  if (!S.acct.user) {
    return h + '<section class="form-card"><h2>' + (SIGNUP_OK ? 'Un compte pour te retrouver en vrai' : 'Les inscriptions ouvrent bientôt') + '</h2><p>' + (SIGNUP_OK ? 'Crée un compte gratuit avec ton e-mail pour rejoindre ou créer un groupe. Tu choisis un pseudo : ton e-mail n’est jamais montré aux autres.' : 'Reviens très bientôt pour rejoindre ou créer un groupe.') + '</p>' +
      (SIGNUP_OK ? '<div class="share-actions"><button class="primary-button" data-action="openProfile" data-fk="g-signup">Créer mon compte</button><button class="share-btn" data-action="openSignin" data-fk="g-signin">Me connecter</button></div>' : '') + '</section>' + groupCharter() + '</div>';
  }
  return h + (S.grp.view ? viewGroupDetail() : viewGroupList() + groupCharter()) + '</div>';
}
function submitGroupCreate(form) {
  var fd = new FormData(form), G = S.grp, name = cleanText(fd.get('name'), 40), city = cleanText(fd.get('city'), 40), theme = String(fd.get('theme')), desc = cleanText(fd.get('description'), 300), max = Number(fd.get('max'));
  var fail = function (m) { G.err = m; render(); };
  if (name.length < 3 || city.length < 2) return fail('Donne un nom (3 lettres minimum) et une ville.');
  if (themeIds.indexOf(theme) < 0 || !(max >= 3 && max <= 30)) return fail('Vérifie le thème et le nombre de places.');
  if (!fd.get('charter')) return fail('Coche l’engagement de respecter la charte pour créer le groupe.');
  G.busy = true; G.err = ''; render();
  sb.from('groups').insert({ name: name, city: city, theme: theme, description: desc, max_members: max, created_by: S.acct.user.id }).select().single().then(function (r) {
    G.busy = false;
    if (r.error || !r.data) { G.err = gErr(r.error); render(); return; }
    G.form = null; G.city = city; G.list = null; S.notice = 'Groupe créé ! Propose maintenant une première sortie.'; openGroup(r.data.id);
  }, function () { G.busy = false; G.err = 'Impossible de créer le groupe. Vérifie ta connexion.'; render(); });
}
function submitMeetup(form) {
  var fd = new FormData(form), G = S.grp, title = cleanText(fd.get('title'), 60), place = cleanText(fd.get('place'), 80), desc = cleanText(fd.get('description'), 300), max = Number(fd.get('max')), when = new Date(String(fd.get('when')));
  var fail = function (m) { G.err = m; render(); };
  if (title.length < 3 || place.length < 3) return fail('Donne un titre et un lieu de rendez-vous.');
  if (isNaN(when) || when.getTime() < Date.now() + 30 * 6e4) return fail('Choisis une date dans le futur.');
  G.busy = true; G.err = ''; render();
  sb.from('meetups').insert({ group_id: G.view, title: title, starts_at: when.toISOString(), place: place, description: desc, max_participants: max, created_by: S.acct.user.id }).select().single().then(function (r) {
    if (r.error || !r.data) { G.busy = false; G.err = gErr(r.error); render(); return; }
    return sb.from('meetup_attendees').insert({ meetup_id: r.data.id, group_id: G.view, user_id: S.acct.user.id }).then(function () {
      G.form = null; S.notice = 'Sortie publiée. Les membres du groupe peuvent s’y inscrire.'; refreshGroup(); render({ top: true });
    });
  }, function () { G.busy = false; G.err = 'Impossible de publier la sortie.'; render(); });
}
function groupAction(promise, okMsg) {
  S.grp.busy = true; S.grp.err = ''; render();
  promise.then(function (r) {
    S.grp.busy = false;
    if (r && r.error) { S.grp.err = gErr(r.error); render(); return; }
    if (okMsg) S.notice = okMsg;
    refreshGroup(); render();
  }, function () { S.grp.busy = false; S.grp.err = 'Action impossible : vérifie ta connexion.'; render(); });
}
function submitReport(form) {
  var fd = new FormData(form), r = S.report, reason = String(fd.get('reason')), details = cleanText(fd.get('details'), 500);
  if (!sb || !S.acct.user || !r) return;
  sb.from('reports').insert({ reporter_id: S.acct.user.id, target_type: r.type, target_id: r.id, reason: reason, details: details }).then(function (res) {
    if (res.error) { S.profErr = gErr(res.error); render({ focus: '#modal-title' }); return; }
    S.modal = null; S.report = null; S.notice = 'Merci, ton signalement a bien été envoyé. Il sera examiné par l’équipe.'; render({ top: true });
  }, function () { S.profErr = 'Envoi impossible : vérifie ta connexion.'; render({ focus: '#modal-title' }); });
}

/* ---------- Récompenses : carte surprise du jour, carnet de collection, « Bon retour » ----------
   Principes : un petit plaisir tout de suite, un peu de surprise, jamais de série à maintenir, jamais de sanction. */
function dateKey(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function cardById(id) { return CARDS.filter(function (c) { return c.id === id; })[0] || null; }
function hasCard(id) { return data.rewards.cards.some(function (c) { return c.id === id; }); }
function addCard(id) { if (hasCard(id)) return false; data.rewards.cards.unshift({ id: id, at: new Date().toISOString() }); return true; }
function randomNewCard() {
  var pool = CARDS.filter(function (c) { return !hasCard(c.id); });
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}
/* La carte du jour est la même toute la journée ; on propose d'abord des cartes que la personne n'a pas encore. */
function todayCard() {
  var R = data.rewards, k = dateKey(), c = R.today && R.today.date === k ? cardById(R.today.id) : null;
  if (c) return c;
  var pool = CARDS.filter(function (x) { return !hasCard(x.id); }), h = 0, i;
  if (!pool.length) pool = CARDS;
  for (i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
  c = pool[h % pool.length];
  R.today = { date: k, id: c.id, open: false };
  persist();
  return c;
}
function todayOpen() { var R = data.rewards; return !!(R.today && R.today.date === dateKey() && R.today.open); }
function openToday() {
  var c = todayCard();
  data.rewards.today.open = true;
  var isNew = addCard(c.id), ok = persist(); askPersist();
  S.flip = c.id; setTimeout(function () { S.flip = null; }, 900);
  S.notice = isNew ? 'Une carte de plus dans ton carnet !' + (ok ? '' : ' Ton navigateur ne peut pas la conserver.') : '';
  render();
  celebrate(null, isNew ? 20 : 8);
}
function cardFace(c, extra) {
  var K = CARD_KIND[c.k];
  return '<article class="reward-card tone-' + K.tone + (extra ? ' ' + extra : '') + '"><span class="reward-kind">' + ic(K.icon, 16) + esc(K.label) + '</span><p class="reward-text">' + esc(c.t) + '</p>' + (c.s ? '<span class="source">' + esc(c.s) + '</span>' : '') + '</article>';
}
function surpriseCard() {
  var c = todayCard();
  if (!todayOpen()) {
    return '<section class="surprise-card sealed" aria-labelledby="sp-title"><span class="sp-icon">' + ic('star', 30) + '</span><div class="sp-text"><h2 id="sp-title">Ta surprise du jour</h2><p>Une petite carte t’attend : une idée, un mot doux ou un fait surprenant. Quand tu veux.</p></div>' +
      '<button class="primary-button" data-action="openToday" data-fk="sp-open">Retourner la carte</button></section>';
  }
  var n = data.rewards.cards.length;
  return '<section class="surprise-card open" aria-labelledby="sp-title"><h2 id="sp-title" class="sr-only">Ta surprise du jour</h2>' + cardFace(c, S.flip === c.id ? 'flip' : '') +
    '<p class="habit-note sp-foot">' + ic('check', 14) + ' Dans ton carnet (' + n + ' / ' + CARDS.length + ' cartes). La prochaine arrive demain, sans pression. <button type="button" class="text-button" data-action="nav" data-v="journey" data-fk="sp-album">Voir mon carnet</button></p></section>';
}
function backCard() {
  var R = data.rewards;
  if (!R.backPending) return '';
  return '<section class="back-card" aria-labelledby="back-title"><div><h2 id="back-title">Content de te revoir' + (data.profile.name ? ', ' + esc(data.profile.name) : '') + ' ' + ic('heart', 20) + '</h2><p>Tu étais parti·e depuis ' + R.backPending + ' jours : rien à rattraper. Ce qui compte, c’est que tu sois là. Une carte bonus t’attend.</p></div>' +
    '<div class="welcome-actions"><button class="primary-button" data-action="claimBack" data-fk="back-claim">Prendre ma carte bonus</button><button class="text-button" data-action="dismissBack" data-fk="back-no">Pas maintenant</button></div></section>';
}
function claimBack() {
  var R = data.rewards, c = randomNewCard();
  R.returns++; R.backPending = 0;
  if (c) addCard(c.id);
  persist();
  S.notice = c ? 'Carte bonus ajoutée à ton carnet. Bon retour !' : 'Bon retour ! Tu as déjà toutes les cartes, mais ton retour compte dans ton carnet.';
  if (c) { S.cardView = c.id; openModal('card'); celebrate(null, 24); } else { render({ top: true }); celebrate(null, 16); }
}
function cardBody() {
  var c = cardById(S.cardView);
  if (!c) return '<h2 id="modal-title" tabindex="-1">Carte</h2><p>Cette carte n’est plus disponible.</p>';
  return '<h2 id="modal-title" tabindex="-1">Ta carte</h2>' + cardFace(c, 'flip') + '<div class="share-actions"><button class="primary-button" data-action="closeModal" data-fk="card-ok">Merci</button></div>';
}
/* Retour après une pause : on le fête, on ne le reproche pas. */
function checkReturn() {
  var R = data.rewards, now = Date.now(), last = R.lastSeen ? new Date(R.lastSeen).getTime() : 0, changed = false;
  if (last && !R.backPending) {
    var d = Math.floor((now - last) / 864e5);
    if (d >= BACK_AFTER_DAYS && (data.history.length || data.challenge.finished.length || data.challenge.active || data.profile.welcomed)) { R.backPending = Math.min(d, 3650); changed = true; }
  }
  R.lastSeen = new Date(now).toISOString();
  persist();
  return changed;
}

/* Carnet de collection : timbres des moments, médailles des défis, cartes surprises. Tout vient de ce qui a vraiment été fait. */
function stampEarned(theme, day) { return data.history.some(function (h) { return h.theme === theme && h.day === day; }); }
function shortText(s, n) { return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; }
function albumSection() {
  var got = 0, rows = themes.map(function (t) {
    var n = days.filter(function (_, d) { return stampEarned(t.id, d); }).length;
    got += n;
    return '<div class="stamp-row"><div class="stamp-head"><span class="tool-label">' + ic(THEME_ICON[t.id], 16) + esc(t.label) + '</span><span class="muted">' + n + ' / ' + days.length + '</span></div><div class="stamp-grid">' + days.map(function (dn, d) {
      var e = stampEarned(t.id, d);
      return '<button class="stamp tone-' + GROUP_TONE[t.id] + (e ? '' : ' locked') + '" data-action="pick" data-theme="' + t.id + '" data-day="' + d + '" aria-label="' + esc(dn) + ', ' + esc(t.label) + (e ? ' : timbre obtenu, refaire' : ' : pas encore, essayer') + '">' +
        '<span class="stamp-art">' + ic(THEME_ICON[t.id], 26) + (e ? '<span class="stamp-ok">' + ic('check', 12) + '</span>' : '') + '</span><span class="stamp-name">' + esc(dn) + '</span></button>';
    }).join('') + '</div></div>';
  }).join('');
  var fin = data.challenge.finished.filter(function (f) { return f.status === 'finished'; }), medalsGot = 0;
  var medals = chList.map(function (c) {
    var e = fin.some(function (f) { return f.id === c.id; });
    if (e) medalsGot++;
    return '<button class="stamp tone-' + c.tone + (e ? '' : ' locked') + '" data-action="openChallenge" data-v="' + c.id + '" aria-label="' + esc(c.title) + (e ? ' : médaille obtenue' : ' : à venir, voir le défi') + '"><span class="stamp-art">' + ic(c.icon, 26) + (e ? '<span class="stamp-ok">' + ic('check', 12) + '</span>' : '') + '</span><span class="stamp-name">' + esc(c.title) + '</span></button>';
  }).join('');
  var cards = data.rewards.cards.map(function (r) { return cardById(r.id); }).filter(Boolean);
  var chips = cards.length ? '<div class="card-chips">' + cards.map(function (c) { var K = CARD_KIND[c.k]; return '<button class="card-chip tone-' + K.tone + '" data-action="viewCard" data-v="' + c.id + '">' + ic(K.icon, 14) + '<span>' + esc(shortText(c.t, 38)) + '</span></button>'; }).join('') + '</div>' : '<p class="empty-note" style="padding:4px 0">Ta première carte arrive avec ta surprise du jour, sur la page « Moment ».</p>';
  var R = data.rewards;
  return '<section class="album" aria-labelledby="album-title"><div class="section-heading"><h2 id="album-title">Mon carnet</h2><span>' + (got + medalsGot + cards.length) + ' souvenir' + (got + medalsGot + cards.length > 1 ? 's' : '') + ' collecté' + (got + medalsGot + cards.length > 1 ? 's' : '') + '</span></div>' +
    '<p class="habit-note" style="margin:0 0 14px">Ni série, ni classement : seulement ce que tu as vraiment fait. Un timbre se gagne en vivant un moment, et il reste à toi.</p>' + rows +
    '<div class="stamp-row"><div class="stamp-head"><span class="tool-label">' + ic('flag', 16) + 'Défis détox</span><span class="muted">' + medalsGot + ' / ' + chList.length + '</span></div><div class="stamp-grid medals-grid">' + medals + '</div></div>' +
    '<div class="stamp-row"><div class="stamp-head"><span class="tool-label">' + ic('star', 16) + 'Cartes surprises</span><span class="muted">' + cards.length + ' / ' + CARDS.length + '</span></div>' + chips + '</div>' +
    (R.returns > 0 ? '<p class="habit-note">' + ic('heart', 14) + ' Tu es revenu·e ' + R.returns + ' fois après une pause : chaque retour compte.</p>' : '') + '</section>';
}

function banners() {
  var h = '';
  if (!canStore) h += '<div class="signin-note"><p>Ton navigateur n’autorise pas l’enregistrement sur cet appareil : tes moments seront conservés seulement tant que cette page reste ouverte.</p></div>';
  if (S.update) h += '<div class="signin-note" role="status"><p>Une nouvelle version d’ARISE est prête.</p><button type="button" class="text-button" data-action="reload" data-fk="reload">Mettre à jour</button></div>';
  if (BACKEND && S.tab === 'groups' && navigator.onLine === false) h += '<div class="signin-note" role="status"><p>Tu es hors connexion : ARISE fonctionne toujours, mais les comptes et les groupes reviendront avec le réseau.</p></div>';
  if (S.notice) h += '<div class="message success" role="status">' + ic('ok', 20) + '<span>' + esc(S.notice) + '</span><button type="button" class="notice-x" data-action="dismissNotice" aria-label="Fermer ce message">' + ic('x', 16) + '</button></div>';
  return h;
}
/* Les messages de confirmation disparaissent seuls au bout de dix secondes (et se ferment d'un toucher). */
var noticeSeen = '', noticeTimer = null;
function watchNotice() {
  if (S.notice === noticeSeen) return;
  noticeSeen = S.notice; clearTimeout(noticeTimer);
  if (S.notice) noticeTimer = setTimeout(function () { if (S.notice === noticeSeen) { S.notice = ''; noticeSeen = ''; softRender(); } }, 10000);
}
window.addEventListener('online', function () { softRender(); });
window.addEventListener('offline', function () { softRender(); });

function nextSteps() {
  var favs = favorites(3);
  return '<section class="next-steps" aria-labelledby="next-steps-title"><div><p class="eyebrow">APRÈS LES SEPT</p>' +
    '<h2 id="next-steps-title">Le parcours continue, sans fin et sans pression.</h2>' +
    '<p>Les 21 invitations (sept étapes, trois envies) restent là. Reviens quand tu veux, ou laisse-toi surprendre.</p></div>' +
    '<div class="next-actions"><button class="primary-button" data-action="surprise" data-fk="surprise">' + ic('shuffle', 18) + 'Surprends-moi</button>' +
    '<span class="quiet-label">On te propose plutôt ce que tu as le moins fait.</span>' +
    (favs.length ? '<div class="favs"><span class="tool-label">À refaire, si l’envie te prend</span><div class="choice-row">' +
      favs.map(function (f) { return '<button class="chip" data-action="pick" data-theme="' + f.theme + '" data-day="' + f.day + '">' + esc(activities[f.theme][f.day].title) + '</button>'; }).join('') + '</div></div>' : '') +
    '</div></section>';
}

function historyList() {
  var hist = data.history;
  if (!hist.length) return '';
  var now = new Date(), nowKey = now.getFullYear() + '-' + now.getMonth();
  var thisMonth = hist.filter(function (h) { var d = new Date(h.completedAt); return d.getFullYear() + '-' + d.getMonth() === nowKey; }).length;
  var split = themes.map(function (t) { return '<span class="split-pill"><strong>' + hist.filter(function (h) { return h.theme === t.id; }).length + '</strong>' + esc(t.label) + '</span>'; }).join('');
  var groups = [];
  hist.slice(0, S.shown).forEach(function (h) {
    var label = new Date(h.completedAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    var last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(h); else groups.push({ label: label, items: [h] });
  });
  var body = groups.map(function (g) {
    return '<div><h3 class="month-label">' + esc(g.label) + '</h3><ul class="history-list">' + g.items.map(function (h) {
      var a = activities[h.theme][h.day];
      var d = new Date(h.completedAt);
      var dateText = d.toLocaleDateString('fr-FR', d.getFullYear() === now.getFullYear() ? { weekday: 'long', day: 'numeric', month: 'long' } : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      var details = [days[h.day], themeLabel(h.theme), 'environ ' + h.duration + ' min', h.feeling !== 'sans réponse' ? h.feeling : '', h.wrote ? 'écrit ou dessiné sur papier' : ''].filter(Boolean).join(' · ');
      return '<li class="history-row"><span class="history-date">' + esc(dateText) + '</span><span class="history-main"><strong>' + esc(a.title) + '</strong><small>' + esc(details) + '</small></span>' +
        '<button class="text-button" data-action="pick" data-theme="' + h.theme + '" data-day="' + h.day + '" aria-label="Refaire : ' + esc(a.title) + '">Refaire</button></li>';
    }).join('') + '</ul></div>';
  }).join('');
  return '<section class="history" aria-labelledby="history-title"><div class="section-heading"><h2 id="history-title">Ton historique</h2><span>' +
    hist.length + ' moment' + (hist.length > 1 ? 's' : '') + ' · ' + thisMonth + ' ce mois-ci</span></div>' +
    '<div class="theme-split" aria-label="Répartition par envie">' + split + '</div>' + body +
    (S.shown < hist.length ? '<button class="text-button" data-action="more" data-fk="more">Voir les moments plus anciens</button>' : '') + '</section>';
}


/* ---------- Défis détox ---------- */
function elapsedH(run) { return (Date.now() - new Date(run.startedAt).getTime()) / 36e5; }
function pendingCount() {
  var r = data.challenge.active;
  if (!r) return 0;
  var def = chById(r.id), e = elapsedH(r);
  return def.paliers.filter(function (p, i) { return p.at <= e && r.done.indexOf(i) < 0; }).length;
}
function fmtDur(h) {
  if (h < 1) return 'moins d’une heure';
  if (h < 48) { var m = Math.round(h * 60), hh = Math.floor(m / 60), mm = m % 60; return hh + ' h' + (mm ? ' ' + String(mm).padStart(2, '0') : ''); }
  var d = Math.floor(h / 24), rest = Math.round(h - d * 24);
  return d + ' jours' + (rest ? ' et ' + rest + ' h' : '');
}
function frDate(iso) { return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + ' à ' + new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
function palierState(run, p, i) {
  if (!run) return 'preview';
  if (run.done.indexOf(i) >= 0) return 'done';
  return p.at <= elapsedH(run) ? 'reached' : 'upcoming';
}
function habitLabels(ids) { return ids.map(function (id) { var h = habitList.find(function (x) { return x.id === id; }); return h ? h.label : id; }); }
function selectedHabits(def) { return S.ch.habits[def.id] || def.defaultHabits.slice(); }

function viewChallenges() {
  var run = data.challenge.active, h = '';
  h += '<div class="challenges-page"><div class="greeting"><p class="eyebrow">Défis détox</p><h1>Un grand pas de côté,<br><span>à ta façon.</span></h1><p>Choisis un défi, mets de côté ce qui t’épuise, et découvre ce que ton cerveau peut ressentir à chaque étape.</p></div>' + modeBar();
  if (run) {
    var def = chById(run.id), pend = pendingCount();
    h += '<section class="run-banner tone-' + def.tone + '" aria-labelledby="run-banner-title"><h2 id="run-banner-title">Ton défi en cours : ' + esc(def.title) + '</h2>' +
      '<p>' + run.done.length + ' palier' + (run.done.length > 1 ? 's' : '') + ' validé' + (run.done.length > 1 ? 's' : '') + ' sur ' + def.paliers.length + (pend ? ' · <strong>' + pend + ' à valider</strong>' : '') + '</p>' +
      '<div><button class="primary-button" data-action="openChallenge" data-v="' + def.id + '" data-fk="resume">Reprendre mon défi</button></div></section>';
  }
  h += '<div class="challenge-grid">' + chList.map(function (c) {
    var live = run && run.id === c.id;
    return '<article class="challenge-card tone-' + c.tone + '"><div class="ch-top"><span class="ch-icon">' + ic(c.icon, 28) + '</span><span class="ch-chips"><span class="mini-chip">' + esc(c.duration) + '</span><span class="mini-chip">' + esc(c.level) + '</span>' + (live ? '<span class="mini-chip live">En cours</span>' : '') + '</span></div>' +
      '<h3>' + esc(c.title) + '</h3><p>' + esc(c.tagline) + '</p><p>' + (live ? '<div class="progress-track" style="margin:2px 0;width:100%"><span style="width:' + (run.done.length / c.paliers.length * 100) + '%"></span></div><p><strong>' + run.done.length + ' / ' + c.paliers.length + ' paliers validés</strong></p>' : '<p>' + c.paliers.length + ' paliers, avec ce que ton cerveau peut ressentir à chaque étape.</p>') +
      '<button class="primary-button" data-action="openChallenge" data-v="' + c.id + '" data-fk="open-' + c.id + '" aria-label="' + (live ? 'Reprendre' : 'Voir') + ' le défi : ' + esc(c.title) + '">' + (live ? 'Reprendre ce défi' : 'Voir le défi') + '</button></article>';
  }).join('') + '</div>';
  var medals = data.challenge.finished.filter(function (f) { return f.status === 'finished'; });
  var tried = data.challenge.finished.filter(function (f) { return f.status === 'stopped'; });
  if (medals.length) {
    h += '<section class="medals-wrap" aria-labelledby="medals-title"><h2 id="medals-title">Tes médailles</h2><div class="medals">' + medals.map(function (f) {
      var c = chById(f.id);
      return '<div class="medal tone-' + c.tone + '"><span class="disc">' + ic(c.icon, 34) + '</span>' + esc(c.title) + '<small>' + new Date(f.endedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + '</small></div>';
    }).join('') + '</div></section>';
  }
  if (tried.length) {
    h += '<p class="habit-note">Déjà essayés, sans pression : ' + tried.slice(0, 5).map(function (f) { return esc(chById(f.id).title) + ' (' + f.done + '/' + chById(f.id).paliers.length + ' paliers)'; }).join(', ') + '. Tu peux les reprendre quand tu veux.</p>';
  }
  h += '<section class="science-card" aria-labelledby="science-title"><h2 id="science-title">' + esc(CH.science.title) + '</h2><ul>' + CH.science.points.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></section>' + whyCard() + '</div>';
  return h;
}

function viewChallenge(id) {
  var def = chById(id);
  var run = data.challenge.active && data.challenge.active.id === id ? data.challenge.active : null;
  var other = data.challenge.active && !run ? chById(data.challenge.active.id) : null;
  var h = '<div class="challenge-page"><button class="back-button" data-action="closeChallenge" data-fk="back-ch"><span>' + ic('left', 18) + '</span>Tous les défis</button>';
  h += '<section class="challenge-hero tone-' + def.tone + '"><div class="ch-top"><span class="ch-icon">' + ic(def.icon, 32) + '</span><span class="ch-chips"><span class="mini-chip">' + esc(def.duration) + '</span><span class="mini-chip">' + esc(def.level) + '</span>' + (run ? '<span class="mini-chip live">En cours</span>' : '') + '</span></div><h1 id="ch-title" tabindex="-1">' + esc(def.title) + '</h1><p>' + esc(def.intro) + '</p></section>';

  if (run) {
    var e = elapsedH(run), next = def.paliers.find(function (p) { return p.at > e; }), pend = pendingCount();
    h += '<section class="run-status" aria-labelledby="run-title"><strong id="run-title">C’est parti depuis ' + fmtDur(e) + '</strong>' +
      '<p>Départ : ' + esc(frDate(run.startedAt)) + '.</p>' +
      '<p>' + (next ? 'Prochain palier : <strong>' + esc(next.title) + '</strong>, dans ' + fmtDur(next.at - e) + '.' : 'Tous les paliers sont atteints.') + (pend ? ' <strong>' + pend + ' palier' + (pend > 1 ? 's' : '') + ' à valider ci-dessous.</strong>' : '') + '</p>' +
      '<div class="progress-track" role="progressbar" aria-label="Paliers validés" aria-valuemin="0" aria-valuemax="' + def.paliers.length + '" aria-valuenow="' + run.done.length + '" style="margin:6px 0"><span style="width:' + (run.done.length / def.paliers.length * 100) + '%"></span></div>' +
      (run.habits.length ? '<p class="habit-note" style="margin:0">Tu mets de côté : ' + esc(habitLabels(run.habits).join(', ')) + '. Tu gardes ce qui est utile.</p>' : '') +
      '<div class="run-actions"><button type="button" class="text-button" data-action="calendar" data-fk="cal">Ajouter les rappels à mon agenda</button><button type="button" class="text-button" data-action="openShare" data-v="ch:' + def.id + '" data-fk="ch-share">Inviter un·e ami·e</button>' + (S.ch.stopAsk
        ? '<span>Arrêter ce défi ? Aucun souci, tu pourras le reprendre.</span><button class="text-button" data-action="stopYes" data-fk="stop-yes">Oui, arrêter</button><button class="text-button" data-action="stopNo" data-fk="stop-no">Continuer</button>'
        : '<button class="text-button" data-action="stopAsk" data-fk="stop-ask">Arrêter sans culpabilité</button>') + '</div></section>';
  } else {
    h += '<h2 class="block-title">Avant de partir</h2><ul class="prep-list">' + def.prep.map(function (t) { return '<li>' + ic('check', 18) + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul>';
    var sel = selectedHabits(def);
    h += '<h2 class="block-title">Ce que je mets de côté</h2><div class="choice-row" role="group" aria-label="Habitudes à mettre de côté">' + habitList.map(function (x) {
      var on = sel.indexOf(x.id) >= 0;
      return '<button type="button" class="chip' + (on ? ' active' : '') + '" aria-pressed="' + on + '" data-fk="hab-' + x.id + '" data-action="toggleHabit" data-v="' + x.id + '">' + esc(x.label) + '</button>';
    }).join('') + '</div><p class="habit-note">Tu gardes ce qui est utile : appels, messages importants, banque, cartes, travail.</p>';
    h += '<div class="start-box"><button type="button" class="text-button" style="padding:0" data-action="openShare" data-v="ch:' + def.id + '" data-fk="ch-share">' + ic('share', 16) + ' Relever ce défi avec un·e ami·e</button>' + (other
      ? '<p>Tu as déjà un défi en cours (' + esc(other.title) + '). Termine-le ou arrête-le pour en commencer un autre.</p><button class="primary-button" data-action="openChallenge" data-v="' + other.id + '">Aller à mon défi en cours</button>'
      : '<button class="primary-button" data-action="startChallenge" data-v="' + def.id + '" data-fk="start-ch">' + ic('flag', 18) + 'Je commence maintenant</button><p class="habit-note" style="margin:0">Le compte à rebours démarre dès que tu appuies.</p>') + '</div>';
  }

  h += (isHybrid() ? hyRules(def) : strictHint()) + '<h2 class="block-title">Les paliers</h2>';
  var filter = data.profile.palierFilter, nDone = run ? run.done.length : 0;
  if (run) {
    h += '<div class="palier-tools"><div class="mode-switch" role="group" aria-label="Paliers affichés">' + [['all', 'Tous'], ['todo', 'À faire'], ['done', 'Faits']].map(function (f) {
      var n = f[0] === 'all' ? def.paliers.length : f[0] === 'done' ? nDone : def.paliers.length - nDone;
      return '<button type="button" class="' + (filter === f[0] ? 'on' : '') + '" aria-pressed="' + (filter === f[0]) + '" data-fk="flt-' + f[0] + '" data-action="palierFilter" data-v="' + f[0] + '">' + f[1] + ' (' + n + ')</button>';
    }).join('') + '</div><button type="button" class="text-button" data-action="openAll" data-fk="open-all">Tout déplier</button><button type="button" class="text-button" data-action="closeAll" data-fk="close-all">Tout replier</button></div>' +
      '<p class="habit-note" style="margin:0 0 14px">Coche le rond d’un palier quand tu l’as tenu : tu peux le faire à tout moment, et le décocher si tu t’es trompé·e.</p>';
  } else {
    h += '<p class="habit-note" style="margin:0 0 14px">Touche un palier pour voir ce que tu peux faire et ce que ton cerveau peut ressentir.</p>';
  }
  var shown = 0;
  h += '<ol class="path">' + def.paliers.map(function (p, i) {
    var st = palierState(run, p, i), key = def.id + ':' + i, open = !!S.ch.open[key];
    if (run && ((filter === 'todo' && st === 'done') || (filter === 'done' && st !== 'done'))) return '';
    shown++;
    var stateText = st === 'done' ? 'Validé' : st === 'reached' ? 'À valider' : st === 'upcoming' ? 'Dans ' + fmtDur(p.at - elapsedH(run)) : 'Aperçu';
    var stCls = st === 'done' ? ' done' : st === 'reached' ? ' reached' : '';
    var body = '';
    if (open) {
      var inv = p.invite ? activities[p.invite.theme][p.invite.day] : null;
      body = '<div class="step-body" id="pal-' + key.replace(':', '-') + '"><div class="box do"><h3>Ce que tu peux faire</h3><p>' + esc(p.do) + '</p></div>' + (isHybrid() && p.hy ? '<div class="box hy"><h3>En version hybride</h3><p>' + esc(p.hy) + '</p></div>' : '') +
        '<div class="box brain"><h3>' + ic('brain', 18) + 'Ce que ton cerveau peut ressentir</h3><p>' + esc(p.brain) + '</p><span class="evidence ' + p.evidence + '">' + esc(CH.evidence[p.evidence]) + '</span>' + (p.source ? '<span class="source">' + esc(p.source) + '</span>' : '') + '</div>' +
        '<div class="step-actions">' + (run ? (st === 'done'
          ? '<button class="text-button" data-action="validate" data-v="' + i + '" data-fk="val-' + i + '">Remettre à faire</button>'
          : '<button class="primary-button" data-action="validate" data-v="' + i + '" data-fk="val-' + i + '">' + ic('check', 18) + 'J’ai tenu ce palier</button>') : '') +
        (inv ? '<button class="text-button" data-action="pick" data-theme="' + p.invite.theme + '" data-day="' + p.invite.day + '">Essayer : ' + esc(inv.title) + '</button>' : '') + '</div></div>';
    }
    var node = run
      ? '<button type="button" class="node node-btn' + stCls + '" aria-pressed="' + (st === 'done') + '" aria-label="' + (st === 'done' ? 'Palier validé : ' : 'Valider le palier : ') + esc(p.title) + '" data-fk="chk-' + i + '" data-action="validate" data-v="' + i + '">' + (st === 'done' ? ic('check', 22) : (i + 1)) + '</button>'
      : '<span class="node' + stCls + '" aria-hidden="true">' + (i + 1) + '</span>';
    return '<li class="path-step">' + node + '<div class="step-card' + (st === 'done' ? ' is-done' : st === 'reached' ? ' is-reached' : '') + '">' +
      '<button class="step-head" aria-expanded="' + open + '" data-fk="pal-' + def.id + '-' + i + '" data-action="togglePalier" data-v="' + key + '"><span><span class="when">' + esc(p.when) + '</span><span class="ttl">' + esc(p.title) + '</span></span><span class="step-state' + stCls + '">' + esc(stateText) + '</span></button>' + body + '</div></li>';
  }).join('') + '</ol>' + (run && !shown ? '<p class="empty-note">' + (filter === 'done' ? 'Aucun palier validé pour l’instant.' : 'Bravo, tous les paliers sont validés !') + ' <button type="button" class="text-button" data-action="palierFilter" data-v="all">Tout afficher</button></p>' : '') + '</div>';
  return h;
}

/* ---------- Mode hybride ---------- */
function isHybrid() { return data.profile.mode === 'hybrid'; }
function draftOf() {
  return S.draft || (S.draft = { mode: data.profile.mode, essentials: data.profile.essentials.slice(), windows: data.profile.windows.map(function (w) { return { start: w.start, end: w.end }; }) });
}
function setMode(m) {
  data.profile.mode = m; S.draft = null;
  var ok = persist();
  S.notice = (m === 'hybrid' ? 'Mode hybride activé : tu gardes l’utile et tu ouvres ton téléphone à des heures choisies.' : 'Mode sans téléphone activé : ton téléphone reste de côté pendant tes moments et tes défis.') + (ok ? '' : ' Ton navigateur ne peut pas le conserver.');
  render();
}
function modeBar() {
  return '<div class="mode-bar"><span class="tool-label">Mon mode</span><div class="mode-switch" role="group" aria-label="Mon mode">' + HY.modes.map(function (m) {
    var on = data.profile.mode === m.id;
    return '<button type="button" class="' + (on ? 'on' : '') + '" aria-pressed="' + on + '" data-fk="mode-' + m.id + '" data-action="setMode" data-v="' + m.id + '">' + esc(m.label) + '</button>';
  }).join('') + '</div></div>';
}
function hybridCard() {
  if (!isHybrid()) return '';
  var st = windowStatus(new Date(), data.profile.windows), ess = essLabels(data.profile.essentials), head, text, cls = '';
  if (st.kind === 'open') { head = 'Fenêtre ouverte'; text = 'Jusqu’à ' + st.end + ', encore ' + fmtMin(st.left) + '. Messages, réseaux : c’est le moment. Ensuite, ton téléphone repart en retrait.'; cls = ' open'; }
  else if (st.kind === 'next') { head = 'Prochaine fenêtre : ' + (st.tomorrow ? 'demain à ' : 'à ') + st.start; text = 'Dans ' + fmtMin(st.inMin) + '. D’ici là, ton téléphone reste en retrait : essentiels seulement.'; }
  else { head = 'Pas de fenêtre fixée'; text = 'Tu choisis quand regarder ton téléphone. Fixer deux ou trois fenêtres par jour aide à le consulter moins souvent.'; }
  return '<section class="hybrid-card tone-mint' + cls + '" aria-labelledby="hy-title"><div class="ch-top"><span class="ch-icon">' + ic('phone', 26) + '</span><span class="ch-chips"><span class="mini-chip live">Mode hybride</span></span></div>' +
    '<h2 id="hy-title">' + esc(head) + '</h2><p>' + esc(text) + '</p>' +
    (ess.length ? '<div class="pill-row" role="group" aria-label="Ce que je garde">' + ess.map(function (e) { return '<span class="pill">' + esc(e) + '</span>'; }).join('') + '</div>' : '') +
    '<div><button class="text-button" data-action="nav" data-v="preferences" data-fk="hy-edit">Régler mon rythme</button></div></section>';
}
function whyCard() {
  return '<section class="science-card" aria-labelledby="why-title"><h2 id="why-title">' + esc(HY.why.title) + '</h2><ul>' + HY.why.points.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></section>';
}
function hyRules(def) {
  return '<section class="hy-rules" aria-labelledby="hy-rules-title"><h2 id="hy-rules-title">Version hybride</h2><p>' + esc(def.hybrid.intro) + '</p><ul>' + def.hybrid.rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></section>';
}
function strictHint() {
  return '<p class="habit-note" style="margin-top:20px">Trop difficile en version stricte ? <button type="button" class="text-button" style="padding:0" data-action="setMode" data-v="hybrid">Passer en mode hybride</button></p>';
}
function settingsFieldsets() {
  var d = draftOf(), h = '';
  h += '<fieldset><legend>Mon mode</legend><div class="theme-options">' + HY.modes.map(function (m) {
    return '<label class="theme-option' + (d.mode === m.id ? ' selected' : '') + '"><input type="radio" name="mode" value="' + m.id + '" data-fk="pmode-' + m.id + '" data-change="draftMode"' + (d.mode === m.id ? ' checked' : '') + '><span><strong>' + esc(m.label) + '</strong><small>' + esc(m.desc) + '</small></span></label>';
  }).join('') + '</div></fieldset>';
  if (d.mode === 'hybrid') {
    h += '<fieldset><legend>Ce que je garde (mes essentiels)</legend><div class="choice-row" role="group" aria-label="Mes essentiels">' + HY.essentials.map(function (e) {
      var on = d.essentials.indexOf(e.id) >= 0;
      return '<button type="button" class="chip' + (on ? ' active' : '') + '" aria-pressed="' + on + '" data-fk="ess-' + e.id + '" data-action="toggleEss" data-v="' + e.id + '">' + esc(e.label) + '</button>';
    }).join('') + '</div></fieldset>';
    h += '<fieldset><legend>Mes fenêtres téléphone</legend><p class="habit-note" style="margin:0 0 12px">Deux ou trois fenêtres par jour fonctionnent mieux que des coups d’œil toute la journée. En dehors, ton téléphone reste en retrait.</p><div class="win-list">' + d.windows.map(function (w, i) {
      return '<div class="win-row"><label>De <input type="time" value="' + w.start + '" data-change="winStart" data-i="' + i + '" aria-label="Début de la fenêtre ' + (i + 1) + '"></label><label>à <input type="time" value="' + w.end + '" data-change="winEnd" data-i="' + i + '" aria-label="Fin de la fenêtre ' + (i + 1) + '"></label><button type="button" class="text-button" data-action="delWin" data-v="' + i + '" aria-label="Retirer la fenêtre ' + (i + 1) + '">Retirer</button></div>';
    }).join('') + '</div>' + (S.formError ? '<div class="message error" role="alert" style="margin:0 0 12px"><span>' + esc(S.formError) + '</span></div>' : '') + (d.windows.length < HY.maxWindows ? '<button type="button" class="text-button" data-action="addWin" data-fk="add-win">Ajouter une fenêtre</button>' : '') + '</fieldset>';
    h += whyCard();
  }
  return h;
}
function mapStepList() { var st = MP.steps.slice(); st[3] = HY.mapStep[data.profile.mode]; return st; }

/* ---------- Carte des sorties gratuites ---------- */
function mapLinks(c) {
  var q = encodeURIComponent(c.search);
  return { google: 'https://www.google.com/maps/search/?api=1&query=' + q, osm: 'https://www.openstreetmap.org/search?query=' + q };
}
function viewMap() {
  var sel = S.map.sel ? catById(S.map.sel) : null;
  var h = '<div class="map-page"><div class="greeting"><p class="eyebrow">Carte des sorties gratuites</p><h1>Dehors, sans téléphone,<br><span>et gratuit.</span></h1><p>Choisis une idée, repère un lieu près de toi, note-le sur papier, puis pars sans ton téléphone.</p></div>';
  h += '<ol class="map-steps">' + mapStepList().map(function (st, i) { return '<li><b>' + (i + 1) + '. ' + esc(st.t) + '</b><span>' + esc(st.d) + '</span></li>'; }).join('') + '</ol>';
  h += '<div class="map-tools"><button class="primary-button" data-action="mapRandom" data-fk="map-random">' + ic('shuffle', 18) + 'Choisis pour moi</button><p>' + (sel ? '' : 'Ou touche une bulle sur la carte.') + '</p></div>';
  h += '<div class="mapboard" role="group" aria-label="Carte illustrée des sorties gratuites : touche une bulle pour découvrir une idée">' + '<svg class="art" viewBox="0 0 640 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect class="base" width="640" height="400"/>' +
    '<rect class="blk-a" x="18" y="18" width="150" height="92" rx="22"/><rect class="blk-b" x="188" y="18" width="130" height="92" rx="22"/><rect class="blk-c" x="338" y="18" width="112" height="132" rx="22"/><rect class="blk-d" x="470" y="18" width="152" height="100" rx="22"/>' +
    '<rect class="blk-e" x="18" y="130" width="112" height="82" rx="22"/><rect class="blk-b" x="150" y="130" width="168" height="92" rx="22"/><rect class="blk-a" x="470" y="138" width="152" height="112" rx="22"/><rect class="blk-d" x="338" y="170" width="112" height="80" rx="22"/>' +
    '<path class="parkblob" d="M30 252 Q50 216 106 224 T192 264 Q176 324 106 324 T30 252Z"/>' +
    '<path class="river" d="M-20 322 C110 286 190 356 300 326 S500 272 660 304" stroke-width="34"/>' +
    '<path class="road" d="M0 120H640M0 230H640M178 0V240M328 0V250M460 0V260" stroke-width="12"/><path class="road" d="M200 240 L340 400M470 260 L560 400" stroke-width="9"/></svg>' +
    MP.categories.map(function (c) {
      return '<button class="pin tone-' + c.tone + (sel && sel.id === c.id ? ' sel' : '') + '" style="left:' + c.pin[0] + '%;top:' + c.pin[1] + '%" aria-pressed="' + (!!sel && sel.id === c.id) + '" aria-label="' + esc(c.title) + '" data-fk="pin-' + c.id + '" data-action="mapPin" data-v="' + c.id + '"><span class="bubble">' + ic(c.icon, 24) + '</span><span class="label">' + esc(c.short) + '</span></button>';
    }).join('') + '</div>';
  if (sel) {
    var L = mapLinks(sel), inv = activities[sel.invite.theme][sel.invite.day];
    h += '<section class="map-detail tone-' + sel.tone + '" id="map-detail" aria-labelledby="map-detail-title"><div class="ch-top"><span class="ch-icon">' + ic(sel.icon, 28) + '</span><span class="ch-chips"><span class="mini-chip live">Gratuit</span><span class="mini-chip">Sans téléphone</span></span></div>' +
      '<h2 id="map-detail-title" tabindex="-1">' + esc(sel.title) + '</h2>' +
      '<div class="box plain"><h3>Pourquoi c’est gratuit</h3><p>' + esc(sel.free) + '</p></div>' +
      '<div class="box plain"><h3>À faire sans téléphone</h3><p>' + esc(sel.doit) + '</p></div>' +
      '<div class="box plain"><h3>Bon à savoir</h3><p>' + esc(sel.tip) + '</p></div>' +
      '<div class="step-actions"><a class="primary-button" href="' + L.google + '" target="_blank" rel="noopener noreferrer">' + ic('external', 18) + 'Chercher près de moi</a>' +
      '<a class="text-button" href="' + L.osm + '" target="_blank" rel="noopener noreferrer">Voir sur OpenStreetMap</a>' +
      '<button class="text-button" data-action="pick" data-theme="' + sel.invite.theme + '" data-day="' + sel.invite.day + '">Essayer : ' + esc(inv.title) + '</button></div>' +
      '<p class="habit-note">' + esc(HY.mapNote[data.profile.mode]) + '</p></section>';
  }
  h += '<section class="safety-card" aria-labelledby="safety-title"><h2 id="safety-title">Avant de partir</h2><ul>' + MP.safety.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></section></div>';
  return h;
}

function viewChoose() {
  var a = activities[S.theme][S.day], cur = momentFor(S.day), count = doneCount();
  var greeting = '<div class="greeting"><p class="eyebrow">' + (data.profile.name ? 'Bonjour <span class="keep-case">' + esc(data.profile.name) + '</span> ' + avatarHtml(data.profile, 'av-inline') : 'SEPT INVITATIONS POUR SOI') + '</p><h1>Un peu moins de scroll.<br><span>Un peu plus de toi.</span></h1><p>Un moment pour observer, bouger ou créer. Le reste peut attendre.</p></div>';
  var tools = '<div class="moment-tools"><span class="tool-label">' + ic('settings', 17) + 'Aujourd’hui, j’ai envie de…</span><div class="choice-row" role="group" aria-label="Envie du moment">' +
    themes.map(function (t) { return '<button class="chip' + (S.theme === t.id ? ' active' : '') + '" aria-pressed="' + (S.theme === t.id) + '" data-fk="theme-' + t.id + '" data-action="theme" data-v="' + t.id + '">' + esc(t.label) + '</button>'; }).join('') +
    '</div><div class="duration-row" role="group" aria-label="Durée indicative">' + ic('clock', 16) +
    DURATIONS.map(function (d) { return '<button class="duration' + (S.duration === d ? ' active' : '') + '" aria-pressed="' + (S.duration === d) + '" data-fk="dur-' + d + '" data-action="duration" data-v="' + d + '">' + d + ' min</button>'; }).join('') + '</div></div>';
  var card = '<section class="activity-card theme-' + S.theme + '"><div class="card-meta"><span>ÉTAPE 0' + (S.day + 1) + ' · ' + esc(days[S.day].toLocaleUpperCase('fr')) + '</span><span>' + S.duration + ' min environ</span></div>' +
    '<div class="large-symbol">' + ic(THEME_ICON[S.theme], 58) + '</div><h2>' + esc(a.title) + '</h2><p>' + esc(a.body) + '</p>' +
    '<button class="primary-button" data-action="start" data-fk="start">Je choisis ce moment</button>' +
    '<span class="card-foot">' + (cur ? 'Déjà réalisé. Tu peux le refaire à ton rythme.' : 'Pas de chrono. Pas de performance.') + '</span></section>';
  var side = '<aside class="side-stack"><section class="paper-card">' + ic('book', 24) + '<p class="eyebrow">APRÈS, SUR PAPIER</p><h2>Quelques mots.<br>Les tiens.</h2><p>' + esc(a.prompt) + '</p><span class="quiet-label">Aucune IA. Aucun texte à partager.</span></section>' +
    '<section class="blue-card">' + ic('wind', 23) + '<h3>Une petite pause suffit.</h3><p>' + esc(a.tip) + '</p>' +
    (S.theme === 'movement' ? '<a href="https://www.nhs.uk/live-well/exercise/sitting-exercises/" target="_blank" rel="noreferrer" class="source-link">Mobilité douce : conseils du NHS</a>' : '') + '</section></aside>';
  var journey = '<section class="journey"><div class="section-heading"><h2>Sept invitations, zéro pression.</h2><span>' + count + ' / 7 moments réalisés</span></div><div class="days">' +
    days.map(function (x, i) {
      var done = !!momentFor(i);
      return '<button class="day' + (S.day === i ? ' selected' : '') + '" aria-label="Étape ' + (i + 1) + ' : ' + esc(x) + (done ? ', réalisée' : '') + '" aria-pressed="' + (S.day === i) + '" data-fk="day-' + i + '" data-action="selectDay" data-v="' + i + '"><span>0' + (i + 1) + (done ? ic('check', 15) : '') + '</span><strong>' + esc(x) + '</strong></button>';
    }).join('') + '</div></section>';
  /* L'action principale (choisir un moment) vient tout de suite ; le réglage du mode, la fenêtre téléphone et les conseils passent après. */
  return welcomeCard() + backCard() + greeting + surpriseCard() + tools + '<div class="workspace">' + card + side + '</div>' + modeBar() + hybridCard() + installCard() + (count === 7 ? nextSteps() : '') + journey;
}

function viewAway() {
  var a = activities[S.theme][S.day];
  return '<section class="away-screen"><button class="back-button" data-action="back"><span>' + ic('left', 18) + '</span>Changer d’activité</button>' +
    '<div class="away-icon">' + ic(THEME_ICON[S.theme], 48) + '</div><p class="eyebrow">LE MOMENT EST À TOI</p><h1 id="away-title" tabindex="-1">' + HY.away[data.profile.mode].title[0] + '<br><span>' + HY.away[data.profile.mode].title[1] + '</span></h1>' +
    '<p class="away-task">' + esc(a.body) + '</p>' +
    (isHybrid() ? '<p class="away-hybrid">' + esc(HY.away.hybrid.note) + '</p>' + (data.profile.essentials.length ? '<div class="pill-row" role="group" aria-label="Autorisé pendant ce moment">' + essLabels(data.profile.essentials).map(function (e) { return '<span class="pill">' + esc(e) + '</span>'; }).join('') + '</div>' : '') : '') + '<div class="carry-note">' + ic('pen', 23) + '<div><strong>Au retour, sur ton carnet</strong><p>' + esc(a.prompt) + '</p></div></div>' +
    '<p class="muted">Environ ' + S.duration + ' minutes, ou ce qui te convient. Tu peux fermer cette page : rien ne tourne en arrière-plan.</p>' +
    '<button class="primary-button" data-action="took">J’ai pris ce moment</button><button class="text-button" data-action="later">Une autre fois</button></section>';
}

function viewReflect() {
  return '<section class="reflection"><p class="eyebrow">UN RETOUR, SI TU EN AS ENVIE</p><h1 id="reflect-title" tabindex="-1">Comment c’était,<br><span>pour toi ?</span></h1><p>Pas besoin d’un résultat positif. Un moment vécu suffit.</p>' +
    '<form data-form="save"><fieldset><legend>Mon ressenti <span>(facultatif)</span></legend><div class="choice-row">' +
    FEELINGS.map(function (f) { return '<button type="button" class="chip' + (S.feeling === f ? ' active' : '') + '" aria-pressed="' + (S.feeling === f) + '" data-fk="feel-' + f + '" data-action="feeling" data-v="' + f + '">' + (f === 'sans réponse' ? 'Je préfère ne pas répondre' : f) + '</button>'; }).join('') +
    '</div></fieldset><label class="check-label"><input type="checkbox" data-change="wrote"' + (S.wrote ? ' checked' : '') + '>J’ai écrit ou dessiné quelques mots sur papier.</label>' +
    '<label class="time-select">Temps consacré, à mon estimation<select data-change="durationSelect">' +
    DURATIONS.map(function (d) { return '<option value="' + d + '"' + (S.duration === d ? ' selected' : '') + '>Environ ' + d + ' minutes</option>'; }).join('') + '</select></label>' +
    '<p class="muted">Ton carnet reste à toi. Aucun texte ni photo n’est demandé.</p>' +
    '<button class="primary-button" type="submit">Enregistrer mon moment</button><button class="text-button" type="button" data-action="discard">Revenir sans enregistrer</button></form></section>';
}

function viewJourney() {
  var count = doneCount(), hist = data.history;
  var minutes = hist.reduce(function (n, h) { return n + h.duration; }, 0);
  var papers = hist.filter(function (h) { return h.wrote; }).length;
  var rows = days.map(function (d, i) {
    var m = momentFor(i);
    return '<button class="journey-row" data-action="selectDay" data-v="' + i + '"><span class="step-number' + (m ? ' complete' : '') + '">' + (m ? ic('check', 20) : String(i + 1).padStart(2, '0')) + '</span>' +
      '<span><strong>' + esc(d) + '</strong><small>' + (m ? esc(activities[m.theme][i].title) + ' · environ ' + m.duration + ' min' : 'Une invitation à découvrir') + '</small></span><span class="row-status">' + (m ? 'Revoir' : 'Découvrir') + '</span></button>';
  }).join('');
  return '<section class="progress-page"><div class="greeting"><p class="eyebrow">TES MOMENTS, À TON RYTHME</p><h1>Ce que tu as<br><span>pris pour toi.</span></h1><p>Aucun classement. Aucun compteur de jours consécutifs.</p></div>' +
    '<div class="summary-grid"><div class="summary-card peach">' + ic('flower', 24) + '<strong>' + count + '<span> / 7</span></strong><p>invitations découvertes</p></div>' +
    '<div class="summary-card lavender">' + ic('clock', 24) + '<strong>' + minutes + '<span> min</span></strong><p>consacrées aux activités, déclarées</p></div>' +
    '<div class="summary-card yellow">' + ic('book', 24) + '<strong>' + papers + '</strong><p>moments prolongés sur papier</p></div></div>' +
    '<div class="progress-track" role="progressbar" aria-label="Invitations découvertes" aria-valuemin="0" aria-valuemax="7" aria-valuenow="' + count + '"><span style="width:' + (count / 7 * 100) + '%"></span></div>' +
    (count === 0 ? '<p class="empty-note">Ton premier moment t’attend. Choisis une activité qui te fait envie, même pour deux minutes.</p>' : '') +
    (count === 7 ? '<p class="empty-note">Tu as exploré les sept invitations. Tu peux maintenant reprendre celles qui te font envie.</p>' + nextSteps() : '') +
    albumSection() + '<div class="journey-list">' + rows + '</div>' + historyList() +
    '<p class="privacy-note">' + ic('heart', 16) + 'Ton suivi est personnel : il reste sur cet appareil, dans ce navigateur, et n’est envoyé nulle part. Les durées sont tes estimations, pas une mesure du temps sans écran.</p></section>';
}

function viewPrefs() {
  var reset = S.resetAsk
    ? '<div class="message error" role="alert"><span>Effacer tout ton suivi de cet appareil ? Cette action est définitive.</span><button data-fk="reset-yes" data-action="resetYes">Oui, tout effacer</button><button data-fk="reset-no" data-action="resetNo">Annuler</button></div>'
    : '<button class="text-button" data-fk="reset-ask" data-action="resetAsk">Effacer mon suivi de cet appareil</button>';
  return '<section class="preferences-page"><div class="greeting"><p class="eyebrow">UN PARCOURS QUI TE RESSEMBLE</p><h1>Ce qui te<br><span>fait envie.</span></h1><p>Ces préférences servent de point de départ. Tu peux changer chaque activité.</p></div>' +
    '<form data-form="prefs">' + settingsFieldsets() +
    '<fieldset><legend>Apparence</legend><div class="mode-switch" role="group" aria-label="Apparence">' + [['auto', 'Automatique'], ['light', 'Clair'], ['dark', 'Sombre']].map(function (x) {
      return '<button type="button" class="' + (data.profile.appearance === x[0] ? 'on' : '') + '" aria-pressed="' + (data.profile.appearance === x[0]) + '" data-fk="app-' + x[0] + '" data-action="setAppearance" data-v="' + x[0] + '">' + x[1] + '</button>';
    }).join('') + '</div></fieldset><fieldset><legend>Style</legend><div class="mode-switch" role="group" aria-label="Style">' + [['calm', 'Calme'], ['candy', 'Bonbon']].map(function (x) {
      var cur = data.profile.style === 'candy' ? 'candy' : 'calm';
      return '<button type="button" class="' + (cur === x[0] ? 'on' : '') + '" aria-pressed="' + (cur === x[0]) + '" data-fk="style-' + x[0] + '" data-action="setStyle" data-v="' + x[0] + '">' + x[1] + '</button>';
    }).join('') + '</div><p class="muted" style="margin:10px 0 0">« Calme » : fond neutre, titres espacés, mouvement doux. « Bonbon » : le style coloré d’origine.</p></fieldset><fieldset><legend>Arrière-plan</legend><div class="mode-switch" role="group" aria-label="Arrière-plan">' + [['on', 'Animé'], ['off', 'Aucun']].map(function (x) {
      var cur = data.profile.bg === 'off' ? 'off' : 'on';
      return '<button type="button" class="' + (cur === x[0] ? 'on' : '') + '" aria-pressed="' + (cur === x[0]) + '" data-fk="bg-' + x[0] + '" data-action="setBg" data-v="' + x[0] + '">' + x[1] + '</button>';
    }).join('') + '</div><p class="muted" style="margin:10px 0 0">De discrets symboles de science et de cerveau montent lentement derrière l’appli. Ils s’arrêtent si ton appareil réduit les animations.</p></fieldset><fieldset><legend>J’aimerais surtout…</legend><div class="theme-options">' +
    themes.map(function (t) { return '<label class="theme-option' + (S.theme === t.id ? ' selected' : '') + '"><input type="radio" name="theme" value="' + t.id + '" data-fk="pref-' + t.id + '" data-change="prefTheme"' + (S.theme === t.id ? ' checked' : '') + '><span><strong>' + esc(t.label) + '</strong><small>' + esc(t.description) + '</small></span></label>'; }).join('') +
    '</div></fieldset><fieldset><legend>Un moment qui tient dans ma journée</legend><div class="choice-row">' +
    DURATIONS.map(function (d) { return '<button type="button" class="chip' + (S.duration === d ? ' active' : '') + '" aria-pressed="' + (S.duration === d) + '" data-fk="dur-' + d + '" data-action="duration" data-v="' + d + '">' + d + ' minutes</button>'; }).join('') +
    '</div></fieldset><button class="primary-button" type="submit">Garder ces préférences</button></form>' +
    '<div class="preference-note"><h2>Moins de sollicitations.</h2><p>Cette version n’envoie aucune notification. Reviens quand tu le souhaites ; tu n’as rien à rattraper.</p>' +
    '<p>Pour bouger, reste dans une amplitude confortable et arrête si cela provoque une douleur. Une douleur persistante mérite un avis professionnel.</p>' +
    '<a class="source-link" href="https://www.inrs.fr/risques/travail-ecran/prevention-risques" target="_blank" rel="noreferrer">Conseils de l’INRS sur les pauses et le poste de travail</a></div>' +
    '<div class="preference-note"><h2>Garder ARISE sous la main.</h2><p>' + (deferredInstall ? 'Ajoute ARISE à ton écran d’accueil : l’appli s’ouvre en plein écran et fonctionne même sans connexion.</p><button type="button" class="text-button" data-action="install" data-fk="install">Installer ARISE</button>' : 'Sur iPhone, touche Partager puis « Sur l’écran d’accueil ». Sur Android ou ordinateur, utilise le menu du navigateur (« Installer l’application »). Une fois installée, ARISE fonctionne même sans connexion.</p>') + '</div>' +
    '<div class="preference-note"><h2>Mon profil et mes amis.</h2><p>' + (data.profile.name ? 'Connecté·e en tant que ' + esc(data.profile.name) + ' ' + data.profile.avatar + '.' : 'Pas encore de profil.') + '</p><div class="data-actions"><button type="button" class="text-button" data-action="openProfile" data-fk="prefs-profile">' + (data.profile.name ? 'Modifier mon profil' : 'M’inscrire ou me connecter') + '</button><button type="button" class="text-button" data-action="openShare" data-fk="prefs-share">Inviter mes amis</button></div></div>' +
    '<div class="preference-note"><h2>Tes données.</h2><p>Tout est enregistré dans ce navigateur, sur cet appareil (moments, défis, médailles). Rien n’est envoyé sur Internet. Vider les données du site dans ton navigateur efface aussi ton suivi.</p>' +
    '<p>Pour ne rien perdre ou changer d’appareil, enregistre une sauvegarde puis rouvre-la ici.</p><div class="data-actions"><button type="button" class="text-button" data-action="exportData" data-fk="export">Enregistrer une sauvegarde</button>' +
    '<label class="text-button file-pick">Restaurer une sauvegarde<input type="file" accept="application/json,.json" data-change="importFile" class="sr-only"></label></div>' + reset + '</div></section>';
}

function swipeAllowed() { return !S.modal && !(S.tab === 'moment' && S.phase !== 'choose'); }
function swipeDots() {
  if (!swipeAllowed()) return '';
  var i = TABS.indexOf(S.tab);
  return '<div class="swipe-dots" aria-hidden="true">' + TABS.map(function (_, k) { return '<span class="dot' + (k === i ? ' on' : '') + '"></span>'; }).join('') + '</div>' +
    (S.hint ? '<p class="swipe-hint" aria-hidden="true">Glisse vers la gauche ou la droite pour changer de rubrique</p>' : '');
}
function view() {
  var main = banners();
  if (S.tab === 'moment') main += S.phase === 'away' ? viewAway() : S.phase === 'reflect' ? viewReflect() : viewChoose();
  else if (S.tab === 'challenges') main += S.ch.view ? viewChallenge(S.ch.view) : viewChallenges();
  else if (S.tab === 'map') main += viewMap();
  else if (S.tab === 'groups') main += viewGroups();
  else if (S.tab === 'journey') main += viewJourney();
  else main += viewPrefs();
  return '<button type="button" class="skip-link" data-action="skipMain" data-fk="skip">Aller au contenu</button>' + header() + '<main id="main" tabindex="-1">' + main + '</main>' + swipeDots() + '<footer>Un outil pour poser ton téléphone, puis se faire oublier.<span>ARISE · version web · suivi enregistré sur cet appareil</span><span class="legal-links"><button type="button" class="text-button" data-action="openLegal" data-v="mentions" data-fk="ft-m">Mentions légales</button><button type="button" class="text-button" data-action="openLegal" data-v="cgu" data-fk="ft-c">Conditions d’utilisation</button><button type="button" class="text-button" data-action="openLegal" data-v="privacy" data-fk="ft-p">Confidentialité</button></span></footer>' + modal();
}

/* ---------- Rendu et interactions ---------- */
/* Mise à jour du DOM « intelligente » : on compare le nouveau HTML à la page et on ne touche qu'à ce qui a changé.
   Contrairement à un remplacement complet, cela garde le focus, le défilement des fenêtres, les panneaux dépliés, la saisie
   en cours, les photos déjà décodées et les animations (ruban, étoiles) qui ne redémarrent plus à chaque action. */
var tpl = document.createElement('template');
/* Deux nœuds sont « le même » s'ils ont la même balise et la même clé (data-fk ou id) ; sans clé, la même première classe CSS. */
function sameKind(a, b) {
  if (a.nodeType !== b.nodeType || a.nodeName !== b.nodeName) return false;
  if (a.nodeType !== 1) return true;
  var ka = a.getAttribute('data-fk') || a.getAttribute('id'), kb = b.getAttribute('data-fk') || b.getAttribute('id');
  if (ka || kb) return ka === kb;
  return (a.getAttribute('class') || '').split(' ')[0] === (b.getAttribute('class') || '').split(' ')[0];
}
function syncAttrs(o, n) {
  var i, name, keepStyle = o.hasAttribute('data-keepstyle');
  for (i = o.attributes.length - 1; i >= 0; i--) {
    name = o.attributes[i].name;
    if (name === 'open' || (keepStyle && name === 'style')) continue;      /* « open » (details) et le style du ruban appartiennent à l'utilisateur / au script */
    if (!n.hasAttribute(name)) { o.removeAttribute(name); if (name === 'checked') o.checked = false; else if (name === 'selected') o.selected = false; }
  }
  for (i = 0; i < n.attributes.length; i++) {
    name = n.attributes[i].name;
    if (name === 'open' || (keepStyle && name === 'style')) continue;
    var v = n.attributes[i].value;
    if (o.getAttribute(name) !== v) {
      o.setAttribute(name, v);
      if (name === 'value' && o.type !== 'file' && 'value' in o) o.value = v;
      else if (name === 'checked') o.checked = true;
      else if (name === 'selected') o.selected = true;
    }
  }
}
function patchNode(o, n) {
  if (o.nodeType !== 1) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; return; }
  syncAttrs(o, n);
  patchChildren(o, n);
}
function patchChildren(op, np) {
  var oc = op.firstChild, nc = np.firstChild, nx, found, s, k, rm;
  while (nc) {
    nx = nc.nextSibling;
    if (!oc) { op.appendChild(nc); }
    else if (sameKind(oc, nc)) { patchNode(oc, nc); oc = oc.nextSibling; }
    else {
      /* pas le même : on cherche un peu plus loin parmi les anciens nœuds (un message qui disparaît, un bloc ajouté…) */
      found = null;
      if (nc.nodeType === 1) for (s = oc.nextSibling, k = 0; s && k < 6; s = s.nextSibling, k++) { if (s.nodeType === 1 && sameKind(s, nc)) { found = s; break; } }
      if (found) { while (oc !== found) { rm = oc; oc = oc.nextSibling; op.removeChild(rm); } patchNode(oc, nc); oc = oc.nextSibling; }
      else op.insertBefore(nc, oc);
    }
    nc = nx;
  }
  while (oc) { rm = oc; oc = oc.nextSibling; op.removeChild(rm); }
}
function render(opts) {
  opts = opts || {};
  var active = document.activeElement, fk = active && active.dataset ? active.dataset.fk : null, y = window.scrollY, html;
  try { html = view(); }
  catch (err) {   /* un affichage qui échoue ne doit jamais laisser une page blanche : on le signale et on propose de revenir à l'accueil */
    if (window.console) console.error('ARISE : erreur d’affichage', err);
    html = '<main id="main" tabindex="-1"><div class="signin-note" role="alert"><p>Oups, cet affichage a rencontré un problème. Tes données sont intactes.</p><button type="button" class="text-button" data-action="resetView" data-fk="reset-view">Revenir à l’accueil</button></div></main>';
  }
  tpl.innerHTML = html;
  patchChildren(app, tpl.content);
  document.documentElement.classList.toggle('modal-open', !!S.modal);
  document.title = pageTitle();
  if (opts.top) window.scrollTo({ top: 0, behavior: 'instant' }); else window.scrollTo({ top: y, behavior: 'instant' });
  if (opts.slide) {
    var m = app.querySelector('main'), cls = 'slide-in-' + opts.slide;
    if (m) { m.style.transition = ''; m.style.transform = ''; m.style.opacity = ''; m.classList.add(cls); m.addEventListener('animationend', function () { m.classList.remove(cls); }, { once: true }); }
  }
  var target = opts.focus ? app.querySelector(opts.focus) : null;
  if (!target && fk && (!active || !active.isConnected)) target = app.querySelector('[data-fk="' + fk + '"]');   /* le focus ne bouge que si l'élément a disparu */
  if (target) target.focus({ preventScroll: true });
  placeRibbon();
  syncHistory();
  watchNotice();
  ensureGroups();
}
var PAGE_TITLES = { moment: 'Mon moment', challenges: 'Défis détox', map: 'Carte des sorties', groups: 'Groupes de sorties', journey: 'Mon suivi', preferences: 'Mes envies' };
function pageTitle() { return (PAGE_TITLES[S.tab] || 'ARISE') + ' · ARISE'; }

/* ---------- Bouton « retour » du téléphone : il referme la fenêtre ou la page ouverte au lieu de quitter le site ---------- */
function navSnap() { return { t: S.tab, c: S.tab === 'challenges' ? S.ch.view : null, g: S.tab === 'groups' ? S.grp.view : null, m: S.modal, p: S.tab === 'moment' && S.phase === 'away' ? 'away' : '' }; }
function sameSnap(a, b) { return !!a && !!b && a.t === b.t && a.c === b.c && a.g === b.g && a.m === b.m && a.p === b.p; }
var histReady = false, histBacking = false;
function syncHistory() {
  if (!window.history || !history.pushState || histBacking) return;
  var s = navSnap(), cur = history.state && history.state.arise ? history.state.s : null;
  try {
    if (!histReady) { histReady = true; history.replaceState({ arise: 1, s: s }, ''); return; }
    if (sameSnap(cur, s)) return;
    if (cur && cur.m && !s.m && sameSnap({ t: cur.t, c: cur.c, g: cur.g, m: null, p: cur.p }, s)) {   /* fermer une fenêtre = reculer d'un cran */
      histBacking = true; setTimeout(function () { histBacking = false; }, 400); history.back(); return;
    }
    var rootOnly = !s.c && !s.g && !s.m && !s.p;
    if (cur && cur.t !== s.t && rootOnly) history.replaceState({ arise: 1, s: s }, '');   /* changer de rubrique ne remplit pas l'historique */
    else history.pushState({ arise: 1, s: s }, '');
  } catch (e) { /* facultatif */ }
}
window.addEventListener('popstate', function (e) {
  histBacking = false;
  var st = e.state && e.state.arise ? e.state.s : null;
  if (!st || TABS.indexOf(st.t) < 0 || sameSnap(navSnap(), st)) return;
  S.tab = st.t; S.ch.view = st.c; S.ch.stopAsk = false; S.grp.view = st.g; S.modal = st.m; S.phase = st.p === 'away' ? 'away' : 'choose';
  if (!st.g) { S.grp.detail = null; S.grp.form = null; } else if (!S.grp.detail && sb && S.acct.user) loadDetail(st.g);
  S.notice = ''; S.resetAsk = false; S.draft = null; S.formError = '';
  render({ top: true });
});
/* Le ruban gel glisse jusqu'à la rubrique choisie (depuis l'ancienne position, si elle a changé). */
var ribbonPrev = null;
function placeRibbon(instant) {
  var nav = app.querySelector('.site-header nav'), r = nav && nav.querySelector('.ribbon'), b = nav && nav.querySelector('.nav-active');
  if (!r || !b) return;
  /* Le ruban déborde un peu de chaque côté du titre (ses bords s'estompent) et descend jusqu'à la ligne continue du menu. */
  var ext = 20, to = { tab: S.tab, x: b.offsetLeft, y: b.offsetTop, w: b.offsetWidth, h: nav.clientHeight - b.offsetTop };
  var from = !instant && ribbonPrev && ribbonPrev.tab !== S.tab ? ribbonPrev : null;
  var put = function (p) { r.style.width = (p.w + 2 * ext) + 'px'; r.style.height = p.h + 'px'; r.style.transform = 'translate(' + (p.x - ext) + 'px,' + p.y + 'px)'; };
  r.style.transition = 'none';
  put(from || to);
  void r.offsetWidth;
  r.style.transition = '';
  if (from) put(to);
  ribbonPrev = to;
}
window.addEventListener('resize', function () { placeRibbon(true); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { placeRibbon(true); });


function startChallenge(id) {
  if (data.challenge.active) { S.notice = 'Tu as déjà un défi en cours : termine-le ou arrête-le avant d’en commencer un autre.'; render({ top: true }); return; }
  var def = chById(id);
  data.challenge.active = { id: id, startedAt: new Date().toISOString(), habits: selectedHabits(def), done: [] };
  var ok = persist(); askPersist();
  S.ch.open[id + ':0'] = true; S.ch.stopAsk = false;
  S.notice = ok ? 'C’est parti ! Ton défi est enregistré sur cet appareil. Tu peux fermer cette page et revenir plus tard.' : 'C’est parti ! Ton navigateur ne peut pas conserver le défi : garde cette page ouverte.';
  render({ top: true, focus: '#ch-title' });
}
/* Valide ou dévalide un palier : possible à tout moment, y compris avant l'heure prévue. */
function validatePalier(i) {
  var run = data.challenge.active;
  if (!run) return;
  var def = chById(run.id);
  if (i < 0 || i >= def.paliers.length) return;
  var at = run.done.indexOf(i);
  if (at >= 0) {
    run.done.splice(at, 1);
    var undone = persist();
    S.notice = undone ? 'Palier remis à faire.' : 'Palier remis à faire pour cette visite, mais ton navigateur ne peut pas le conserver.';
    render();
    return;
  }
  run.done.push(i);
  if (run.done.length === def.paliers.length) {
    data.challenge.finished.unshift({ id: run.id, startedAt: run.startedAt, endedAt: new Date().toISOString(), status: 'finished', done: def.paliers.length });
    data.challenge.active = null; S.ch.view = null; S.ch.stopAsk = false;
    S.notice = 'Défi terminé, bravo ! Ta médaille t’attend en bas de cette page.';
    persist(); render({ top: true }); celebrate(null, 70); return;
  }
  var ok = persist();
  S.notice = ok ? 'Palier validé. Bien joué !' : 'Palier validé pour cette visite, mais ton navigateur ne peut pas le conserver.';
  render();
  celebrate(S.lastRect, 22);
}
function stopChallenge() {
  var run = data.challenge.active;
  if (!run) return;
  data.challenge.finished.unshift({ id: run.id, startedAt: run.startedAt, endedAt: new Date().toISOString(), status: 'stopped', done: run.done.length });
  if (data.challenge.finished.length > 100) data.challenge.finished.length = 100;
  data.challenge.active = null; S.ch.view = null; S.ch.stopAsk = false;
  persist();
  S.notice = 'Défi arrêté, sans souci. Tu pourras le reprendre quand tu veux.';
  render({ top: true });
}

function selectDay(i) {
  var m = momentFor(i);
  S.day = i;
  if (m) { S.theme = m.theme; S.duration = m.duration; S.feeling = m.feeling; S.wrote = !!m.wrote; }
  else { S.theme = data.profile.theme; S.duration = data.profile.duration; S.feeling = 'sans réponse'; S.wrote = false; }
  S.tab = 'moment'; S.phase = 'choose'; S.notice = '';
  render({ top: true });
}
function pick(theme, day) {
  S.theme = theme; S.day = day; S.feeling = 'sans réponse'; S.wrote = false;
  S.tab = 'moment'; S.phase = 'choose'; S.notice = '';
  render({ top: true });
}
function complete() {
  var id = data.history.reduce(function (m, h) { return Math.max(m, h.id); }, 0) + 1, newStamp = !stampEarned(S.theme, S.day), extra = '';
  data.history.unshift({ id: id, day: S.day, theme: S.theme, duration: S.duration, feeling: S.feeling, wrote: S.wrote ? 1 : 0, completedAt: new Date().toISOString() });
  if (data.history.length > 500) data.history.length = 500;
  if (newStamp) {
    extra = ' Un nouveau timbre rejoint ton carnet !';
    if (days.every(function (_, d) { return stampEarned(S.theme, d); })) {
      var bonus = randomNewCard();
      if (bonus) { addCard(bonus.id); extra += ' Rangée « ' + themeLabel(S.theme) + ' » complète : une carte bonus t’attend aussi.'; }
      else extra += ' Rangée « ' + themeLabel(S.theme) + ' » complète, bravo !';
    }
  }
  var ok = persist(); askPersist();
  S.phase = 'choose'; S.tab = 'journey'; S.shown = PAGE;
  S.notice = (ok ? 'Ton moment est enregistré sur cet appareil. Tu peux fermer cette page et revenir quand tu le souhaites.'
    : 'Ton moment est noté pour cette visite, mais ton navigateur ne permet pas de le conserver.') + extra;
  render({ top: true });
  celebrate(null, newStamp ? 34 : 12);
}
function savePrefs() {
  var d = draftOf();
  if (d.mode === 'hybrid' && !validWindows(d.windows)) { S.formError = 'Vérifie tes fenêtres : l’heure de fin doit être après l’heure de début, pour chacune.'; render(); return; }
  var p = data.profile;
  p.theme = S.theme; p.duration = S.duration; p.mode = d.mode; p.essentials = d.essentials.slice(); p.windows = d.windows.map(function (w) { return { start: w.start, end: w.end }; });
  S.draft = null; S.formError = '';
  var ok = persist();
  S.notice = ok ? 'Tes envies sont sauvegardées.' : 'Tes envies sont prises en compte pour cette visite, mais ton navigateur ne permet pas de les conserver.';
  render({ top: true });
}
/* Sauvegarde : un fichier JSON que l'on peut garder ou rouvrir sur un autre appareil. */
function exportData() {
  var blob = new Blob([JSON.stringify({ app: 'arise', version: 1, exportedAt: new Date().toISOString(), data: data }, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = 'arise-sauvegarde-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  S.modal = null;
  S.notice = 'Sauvegarde créée : le fichier est dans tes téléchargements.';
  render({ top: true });
}
function importData(file) {
  if (!file) return;
  if (file.size > 2e6) { S.notice = 'Ce fichier est trop volumineux pour être une sauvegarde ARISE.'; render({ top: true }); return; }
  var r = new FileReader();
  r.onload = function () {
    S.modal = null;
    try {
      var j = JSON.parse(String(r.result));
      if (!j || j.app !== 'arise' || !j.data) throw new Error('format');
      data = sanitize(j.data);
      var ok = persist();
      S.theme = data.profile.theme; S.duration = data.profile.duration; S.day = firstUndone(); S.ch = { view: null, open: {}, habits: {}, stopAsk: false }; S.draft = null;
      S.modal = null; applyAppearance();
      S.notice = (data.profile.name ? 'Content de te revoir, ' + data.profile.name + ' ! ' : '') + 'Sauvegarde restaurée.' + (ok ? '' : ' Ton navigateur ne peut pas la conserver.');
    } catch (err) { S.notice = 'Ce fichier n’est pas une sauvegarde ARISE valide : rien n’a été modifié.'; }
    render({ top: true });
  };
  r.onerror = function () { S.notice = 'Impossible de lire ce fichier.'; render({ top: true }); };
  r.readAsText(file);
}
function resetAll() {
  data = fresh();
  try { localStorage.removeItem(KEY); } catch (e) { /* rien à effacer */ }
  S.resetAsk = false; S.ch = { view: null, open: {}, habits: {}, stopAsk: false }; S.day = 0; S.theme = 'outside'; S.duration = 5; S.feeling = 'sans réponse'; S.wrote = false; S.shown = PAGE;
  applyAppearance();
  S.notice = 'Ton suivi a été effacé de cet appareil.';
  render({ top: true });
}

app.addEventListener('click', function (e) {
  var t = e.target.closest('[data-action]');
  if (!t || !app.contains(t)) return;
  var a = t.dataset.action, v = t.dataset.v;
  if (a === 'validate') S.lastRect = t.getBoundingClientRect();
  switch (a) {
    case 'nav': S.tab = v; S.notice = ''; S.phase = 'choose'; S.resetAsk = false; S.ch.view = null; S.ch.stopAsk = false; S.draft = null; S.formError = ''; S.grp.view = null; S.grp.detail = null; S.grp.form = null; S.modal = null; render({ top: true }); break;
    case 'theme': S.theme = v; render(); break;
    case 'duration': S.duration = Number(v); render(); break;
    case 'selectDay': selectDay(Number(v)); break;
    case 'start': S.feeling = 'sans réponse'; S.wrote = false; S.phase = 'away'; S.notice = ''; render({ top: true, focus: '#away-title' }); break;
    case 'back': case 'later': case 'discard': S.phase = 'choose'; render({ top: true }); break;
    case 'took': S.phase = 'reflect'; render({ top: true, focus: '#reflect-title' }); break;
    case 'feeling': S.feeling = v; render(); break;
    case 'surprise': var s = pickSuggestion(); pick(s.theme, s.day); break;
    case 'pick': pick(t.dataset.theme, Number(t.dataset.day)); break;
    case 'more': S.shown += PAGE; render(); break;
    case 'resetAsk': S.resetAsk = true; render({ focus: '[data-fk="reset-no"]' }); break;
    case 'resetNo': S.resetAsk = false; render({ focus: '[data-fk="reset-ask"]' }); break;
    case 'resetYes': resetAll(); break;
    case 'openChallenge': S.tab = 'challenges'; S.ch.view = v; S.ch.stopAsk = false; S.notice = ''; render({ top: true, focus: '#ch-title' }); break;
    case 'closeChallenge': S.ch.view = null; S.ch.stopAsk = false; render({ top: true }); break;
    case 'toggleHabit': var def0 = chById(S.ch.view), cur = selectedHabits(def0), k = cur.indexOf(v); if (k >= 0) cur.splice(k, 1); else cur.push(v); S.ch.habits[def0.id] = cur; render(); break;
    case 'startChallenge': startChallenge(v); break;
    case 'togglePalier': S.ch.open[v] = !S.ch.open[v]; render(); break;
    case 'validate': validatePalier(Number(v)); break;
    case 'palierFilter': data.profile.palierFilter = v; persist(); render({ focus: '[data-fk="flt-' + v + '"]' }); break;
    case 'openAll': case 'closeAll': var dA = chById(S.ch.view); dA.paliers.forEach(function (_, i) { S.ch.open[dA.id + ':' + i] = a === 'openAll'; }); render(); break;
    case 'exportData': exportData(); break;
    case 'openProfile': S.modalTab = 'create'; S.acctTab = 'signup'; openModal('profile'); break;
    case 'openSignin': S.modalTab = 'create'; S.acctTab = 'signin'; openModal('profile'); break;
    case 'acctTab': S.acctTab = v; S.modalTab = 'create'; S.acct.err = ''; S.acct.info = ''; render({ focus: '[data-fk="' + t.dataset.fk + '"]' }); break;
    case 'openLegal': S.legalTab = v; openModal('legal'); break;
    case 'legalTab': S.legalTab = v; render({ focus: '[data-fk="lt-' + v + '"]' }); break;
    case 'signOut': doSignOut(); break;
    case 'exportAccount': exportAccount(); break;
    case 'deleteAsk': S.acct.delAsk = true; render({ focus: '[data-fk="del-no"]' }); break;
    case 'deleteNo': S.acct.delAsk = false; render({ focus: '[data-fk="del-ask"]' }); break;
    case 'deleteYes': deleteAccount(); break;
    case 'grpCreateOpen': S.grp.form = 'group'; S.grp.err = ''; render({ focus: '#gf-title' }); break;
    case 'meetupFormOpen': S.grp.form = 'meetup'; S.grp.err = ''; render({ focus: '#mf-title' }); break;
    case 'grpFormClose': S.grp.form = null; S.grp.err = ''; render(); break;
    case 'grpOpen': openGroup(v); break;
    case 'grpBack': S.grp.view = null; S.grp.detail = null; S.grp.form = null; S.grp.err = ''; S.grp.delAsk = false; render({ top: true }); break;
    case 'grpJoin': groupAction(sb.from('group_members').insert({ group_id: S.grp.view, user_id: S.acct.user.id, role: 'member' }), 'Bienvenue dans le groupe !'); break;
    case 'grpLeave': groupAction(sb.from('group_members').delete().eq('group_id', S.grp.view).eq('user_id', S.acct.user.id), 'Tu as quitté le groupe.'); break;
    case 'grpDelAsk': S.grp.delAsk = true; render({ focus: '[data-fk="g-del-no"]' }); break;
    case 'grpDelNo': S.grp.delAsk = false; render({ focus: '[data-fk="g-del-ask"]' }); break;
    case 'grpDelYes': S.grp.delAsk = false; var gid = S.grp.view; S.grp.view = null; S.grp.detail = null; groupAction(sb.from('groups').delete().eq('id', gid), 'Groupe supprimé.'); break;
    case 'rsvp':
      var D0 = S.grp.detail, mine0 = D0 && D0.attendees.some(function (x) { return x.meetup_id === v && x.user_id === S.acct.user.id; });
      groupAction(mine0 ? sb.from('meetup_attendees').delete().eq('meetup_id', v).eq('user_id', S.acct.user.id) : sb.from('meetup_attendees').insert({ meetup_id: v, group_id: S.grp.view, user_id: S.acct.user.id }), mine0 ? 'Inscription annulée.' : 'C’est noté, à bientôt !');
      break;
    case 'meetupDel': groupAction(sb.from('meetups').delete().eq('id', v), 'Sortie annulée.'); break;
    case 'openReport': S.report = { type: t.dataset.t, id: v, label: t.dataset.label || '' }; openModal('report'); break;
    case 'openShare': if (v) S.share = v; else if (S.tab === 'challenges' && S.ch.view && data.challenge.active && data.challenge.active.id === S.ch.view) S.share = 'ch:' + S.ch.view; if (shareOptions().every(function (o) { return o.id !== S.share; })) S.share = 'app'; openModal('share'); break;
    case 'closeModal': closeModal(); break;
    case 'modalTab': S.modalTab = v; S.profErr = ''; render({ focus: '[data-fk="mt-' + v + '"]' }); break;
    case 'shareSel': S.share = v; render({ focus: '[data-fk="' + t.dataset.fk + '"]' }); break;
    case 'nativeShare':
      var sc = shareContent();
      if (navigator.share) navigator.share({ title: sc.title, text: sc.text, url: sc.url }).catch(function () { /* partage annulé */ });
      break;
    case 'copyLink':
      copyText(shareContent().url).then(function () { S.notice = 'Lien copié : colle-le dans un message.'; S.modal = null; render({ top: true }); }, function () { S.notice = 'Copie impossible : sélectionne le lien et copie-le à la main.'; S.modal = null; render({ top: true }); });
      break;
    case 'dismissWelcome': data.profile.welcomed = true; persist(); S.modal = null; render({ top: true }); break;
    case 'photoRemove': setPhoto(''); break;
    case 'openToday': openToday(); break;
    case 'claimBack': claimBack(); break;
    case 'dismissBack': data.rewards.backPending = 0; persist(); render({ top: true }); break;
    case 'viewCard': S.cardView = v; openModal('card'); break;
    case 'removeProfile': data.profile.name = ''; data.profile.avatar = ''; data.profile.photo = ''; persist(); S.modal = null; S.notice = 'Profil retiré de cet appareil. Ton suivi est conservé.'; render({ top: true }); break;
    case 'setAppearance': data.profile.appearance = v; persist(); applyAppearance(); render({ focus: '[data-fk="app-' + v + '"]' }); break;
    case 'setBg': if (BGS.indexOf(v) >= 0) { data.profile.bg = v; persist(); applyAppearance(); render({ focus: '[data-fk="bg-' + v + '"]' }); } break;
    case 'setStyle': if (STYLES.indexOf(v) >= 0) { data.profile.style = v; persist(); applyAppearance(); render({ focus: '[data-fk="style-' + v + '"]' }); } break;
    case 'install': if (deferredInstall) { deferredInstall.prompt(); deferredInstall = null; render(); } break;
    case 'dismissTip': data.profile.installTip = true; persist(); render(); break;
    case 'reload': location.reload(); break;
    case 'resetView': S.tab = 'moment'; S.phase = 'choose'; S.modal = null; S.ch.view = null; S.grp.view = null; S.grp.detail = null; S.grp.form = null; S.notice = ''; render({ top: true }); break;
    case 'dismissNotice': S.notice = ''; render(); break;
    case 'skipMain': var mm = app.querySelector('main'); if (mm) { mm.focus({ preventScroll: false }); mm.scrollIntoView(); } break;
    case 'calendar': downloadCalendar(); break;
    case 'stopAsk': S.ch.stopAsk = true; render({ focus: '[data-fk="stop-no"]' }); break;
    case 'stopNo': S.ch.stopAsk = false; render({ focus: '[data-fk="stop-ask"]' }); break;
    case 'stopYes': stopChallenge(); break;
    case 'setMode': setMode(v); break;
    case 'toggleEss': var de = draftOf(), ke = de.essentials.indexOf(v); if (ke >= 0) de.essentials.splice(ke, 1); else de.essentials.push(v); render(); break;
    case 'addWin': var dw = draftOf(); if (dw.windows.length < HY.maxWindows) dw.windows.push({ start: '15:30', end: '15:45' }); S.formError = ''; render({ focus: '[data-fk="add-win"]' }); break;
    case 'delWin': draftOf().windows.splice(Number(v), 1); S.formError = ''; render(); break;
    case 'mapPin': S.map.sel = v; render({ focus: '#map-detail-title' }); var d = document.getElementById('map-detail'); if (d) d.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); break;
    case 'mapRandom': var cs = MP.categories.filter(function (c) { return c.id !== S.map.sel; }); S.map.sel = cs[Math.floor(Math.random() * cs.length)].id; render({ focus: '#map-detail-title' }); var d2 = document.getElementById('map-detail'); if (d2) d2.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); break;
  }
});
app.addEventListener('submit', function (e) {
  var f = e.target.dataset.form;
  if (!f) return;
  e.preventDefault();
  if (f === 'save') complete(); else if (f === 'prefs') savePrefs(); else if (f === 'profile') saveProfile(e.target);
  else if (f === 'signup') doSignup(e.target); else if (f === 'signin') doSignin(e.target); else if (f === 'forgot') doForgot(e.target); else if (f === 'recover') doRecover(e.target);
  else if (f === 'grpfilter') { var fd = new FormData(e.target); S.grp.city = cleanText(fd.get('city'), 40); S.grp.theme = themeIds.indexOf(String(fd.get('theme'))) >= 0 ? String(fd.get('theme')) : ''; S.grp.list = null; render(); }
  else if (f === 'grpcreate') submitGroupCreate(e.target); else if (f === 'meetupcreate') submitMeetup(e.target); else if (f === 'report') submitReport(e.target);
});
/* Brouillon du formulaire d'inscription : on garde ce qui est saisi (jamais le mot de passe) quand on change d'onglet. */
app.addEventListener('input', function (e) {
  var t = e.target;
  if (!t.dataset || !t.dataset.draft || !t.name) return;
  S.draftAcct[t.name] = t.type === 'checkbox' ? t.checked : t.value;
});
/* Fenêtres : Échap ferme, Tab reste dans la fenêtre. */
document.addEventListener('keydown', function (e) {
  if (!S.modal) return;
  if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
  if (e.key !== 'Tab') return;
  var m = app.querySelector('.modal'); if (!m) return;
  var f = Array.prototype.filter.call(m.querySelectorAll('a[href],button:not(:disabled),input:not(.sr-only),[tabindex="-1"]#modal-title'), function (el) { return el.offsetParent !== null; });
  if (!f.length) return;
  var first = f[0], last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || !m.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (document.activeElement === last || !m.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
});
app.addEventListener('change', function (e) {
  var c = e.target.dataset.change;
  if (c === 'wrote') S.wrote = e.target.checked;
  else if (c === 'durationSelect') S.duration = Number(e.target.value);
  else if (c === 'importFile') importData(e.target.files && e.target.files[0]);
  else if (c === 'photoFile') {
    var pf0 = e.target.files && e.target.files[0], frm = e.target.closest('form');
    if (frm) { var ni = frm.querySelector('[name=name]'), ai = frm.querySelector('[name=avatar]:checked'); S.pdraft = { name: ni ? ni.value : '', avatar: ai ? ai.value : '' }; }
    e.target.value = '';
    if (!pf0) return;
    photoFromFile(pf0).then(setPhoto, function (err) {
      S.profErr = S.acct.err = err && err.message === 'size' ? 'Cette photo est trop lourde ou trop détaillée : essaie-en une autre.' : 'Ce fichier n’est pas une image lisible.';
      render({ focus: '#modal-title' });
    });
  }
  else if (c === 'marketing' && sb) {
    var want = e.target.checked;
    sb.rpc('set_marketing', { p_opt_in: want }).then(function (r) {
      if (r.error) { S.acct.err = gErr(r.error); } else { if (S.acct.consent) S.acct.consent.marketing_opt_in = want; S.acct.info = want ? 'Tu recevras des nouvelles d’ARISE par e-mail.' : 'C’est noté : tu ne recevras plus d’e-mail d’information.'; }
      render({ focus: '#modal-title' });
    });
  }
  else if (c === 'prefTheme') { S.theme = e.target.value; render(); }
  else if (c === 'draftMode') { draftOf().mode = e.target.value; render(); }
  else if (c === 'winStart') { draftOf().windows[Number(e.target.dataset.i)].start = e.target.value; S.formError = ''; }
  else if (c === 'winEnd') { draftOf().windows[Number(e.target.dataset.i)].end = e.target.value; S.formError = ''; }
});

/* ---------- Glisser pour changer de rubrique (téléphone) ---------- */
function canGo(dir) {
  if (!swipeAllowed()) return false;
  if (S.tab === 'challenges' && S.ch.view) return true;   // dans un défi : « précédent » revient à la liste
  if (S.tab === 'groups' && S.grp.view && dir === 'prev') return true;
  var i = TABS.indexOf(S.tab) + (dir === 'next' ? 1 : -1);
  return i >= 0 && i < TABS.length;
}
function goSwipe(dir) {
  if (dir === 'prev' && S.tab === 'challenges' && S.ch.view) { S.ch.view = null; S.ch.stopAsk = false; }
  else if (dir === 'prev' && S.tab === 'groups' && S.grp.view) { S.grp.view = null; S.grp.detail = null; S.grp.form = null; }
  else {
    S.tab = TABS[TABS.indexOf(S.tab) + (dir === 'next' ? 1 : -1)];
    S.notice = ''; S.phase = 'choose'; S.resetAsk = false; S.ch.view = null; S.ch.stopAsk = false; S.draft = null; S.formError = '';
  }
  S.hint = false;
  render({ top: true, slide: dir });
}
var SW = { x: 0, y: 0, t: 0, active: false, dragging: false, dx: 0 };
function noSwipeZone(el) {
  while (el && el !== app && el.nodeType === 1) {
    var n = el.nodeName;
    if (n === 'SELECT' || n === 'TEXTAREA') return true;
    if (n === 'INPUT' && ['radio', 'checkbox', 'button', 'submit'].indexOf(el.type) < 0) return true;   // champs de saisie et curseurs : on ne vole pas le geste
    if (el.scrollWidth > el.clientWidth + 2) { var ox = getComputedStyle(el).overflowX; if (ox === 'auto' || ox === 'scroll') return true; }
    el = el.parentNode;
  }
  return false;
}
function snapBack() {
  var m = app.querySelector('main');
  SW.active = false; SW.dragging = false;
  if (!m) return;
  m.style.transition = 'transform .2s ease, opacity .2s ease'; m.style.transform = ''; m.style.opacity = '';
  setTimeout(function () { m.style.transition = ''; }, 230);
}
function finishSwipe() {
  if (!SW.active || !SW.dragging) { SW.active = false; return; }
  var dx = SW.dx, dir = dx < 0 ? 'next' : 'prev', dt = Math.max(1, Date.now() - SW.t), fast = Math.abs(dx) / dt > 0.45;
  var commit = canGo(dir) && (Math.abs(dx) >= 80 || (Math.abs(dx) >= 40 && fast));
  SW.active = false; SW.dragging = false;
  if (!commit) { snapBack(); return; }
  var m = app.querySelector('main');
  if (!m || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { goSwipe(dir); return; }
  m.style.transition = 'transform .15s ease-in, opacity .15s ease-in';
  m.style.transform = 'translateX(' + (dir === 'next' ? -1 : 1) * Math.round(window.innerWidth * 0.35) + 'px)'; m.style.opacity = '0';
  setTimeout(function () { goSwipe(dir); }, 150);
}
app.addEventListener('touchstart', function (e) {
  SW.active = false;
  if (e.touches.length !== 1 || !swipeAllowed() || noSwipeZone(e.target)) return;
  var t = e.touches[0];
  SW.x = t.clientX; SW.y = t.clientY; SW.t = Date.now(); SW.active = true; SW.dragging = false; SW.dx = 0;
}, { passive: true });
app.addEventListener('touchmove', function (e) {
  if (!SW.active) return;
  var t = e.touches[0], dx = t.clientX - SW.x, dy = t.clientY - SW.y;
  if (!SW.dragging) {
    if (Math.abs(dy) > 10 && Math.abs(dy) >= Math.abs(dx) * 0.8) { SW.active = false; return; }   // défilement vertical : on laisse faire
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.2) SW.dragging = true; else return;
  }
  var m = app.querySelector('main');
  if (!m) return;
  SW.dx = dx;
  m.style.transition = 'none';
  m.style.transform = 'translateX(' + Math.round(dx * (canGo(dx < 0 ? 'next' : 'prev') ? 0.6 : 0.18)) + 'px)';   // résistance au bout du parcours
  m.style.opacity = String(1 - Math.min(Math.abs(dx), 260) / 260 * 0.5);
}, { passive: true });
app.addEventListener('touchend', finishSwipe, { passive: true });
app.addEventListener('touchcancel', function () { if (SW.dragging) snapBack(); SW.active = false; }, { passive: true });

/* Un seul « tic » toutes les 30 s : fenêtre téléphone du mode hybride, compte à rebours des défis, changement de jour (carte surprise).
   Grâce à la mise à jour intelligente du DOM, seul le texte qui a changé est modifié, et rien ne bouge si on est en train de saisir. */
setInterval(function () {
  if (document.visibilityState !== 'visible' || S.modal || SW.active) return;
  var a = document.activeElement;
  if (a && app.contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.nodeName)) return;
  render();
}, 30000);
/* Deux onglets ouverts : ce qui est enregistré dans l'un apparaît dans l'autre (sinon le dernier à écrire effacerait l'autre). */
window.addEventListener('storage', function (e) {
  if (e.key !== null && e.key !== KEY) return;
  data = load(); S.theme = data.profile.theme; S.duration = data.profile.duration;
  applyAppearance(); softRender();
});

/* Lien partagé par un·e ami·e : #defi=<id> ouvre directement le défi. */
(function () {
  var m = /^#defi=([a-z]+)$/.exec(location.hash), c = m && chById(m[1]);
  if (c) { S.tab = 'challenges'; S.ch.view = c.id; S.notice = 'Un·e ami·e t’invite à relever le défi « ' + c.title + ' ». Regarde de quoi il s’agit, sans engagement.'; }
  /* Raccourcis de l'icône (menu au toucher long sur Android) : ?tab=challenges, ?tab=map, etc. */
  var tq = /[?&]tab=([a-z]+)/.exec(location.search);
  if (!c && tq && TABS.indexOf(tq[1]) >= 0) S.tab = tq[1];
  /* On n'efface le lien que s'il s'agit d'un lien d'ami : le retour de l'e-mail de confirmation en a besoin pour te connecter. */
  if (c) { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* facultatif */ } }
})();
/* ---------- Arrière-plan animé : symboles d'éveil, de cerveau et de science (décor, hors de l'appli) ---------- */
(function () {
  var S = {
    brain: '<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>',
    atom: '<circle cx="12" cy="12" r="1.3"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    dna: '<path d="M8 2c0 5 8 5 8 10s-8 5-8 10"/><path d="M16 2c0 5-8 5-8 10s8 5 8 10"/><path d="M9.2 5h5.6M8.4 9h7.2M8.4 15h7.2M9.2 19h5.6"/>',
    bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/>',
    neuron: '<circle cx="12" cy="12" r="2.6"/><path d="M12 9.4V4M12 4 9.8 2M12 4l2.2-2M9.9 13.5 5 16.2M14.1 13.5 19 16.2M5 16.2 2 17M5 16.2l1 3M19 16.2l3 .8M19 16.2l-1 3M12 14.6V21"/><circle cx="12" cy="21.5" r=".9"/>',
    flask: '<path d="M9 2h6M10 2v6L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 8V2M7.5 15h9"/>',
    wave: '<path d="M1 12c2-7 4-7 6 0s4 7 6 0 4-7 6 0 3 4 4 3"/>',
    orbit: '<circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="10.5" stroke-dasharray="2 3"/>',
    spark: '<path d="M12 2l2.2 7.3L22 12l-7.8 2.7L12 22l-2.2-7.3L2 12l7.8-2.7z"/>',
    molecule: '<circle cx="6" cy="7" r="2.6"/><circle cx="18" cy="7" r="2.6"/><circle cx="12" cy="18" r="3"/><path d="M8.6 7h6.8M7.4 9.4l3.4 6.4M16.6 9.4l-3.4 6.4"/>'
  };
  var order = ['brain', 'atom', 'neuron', 'dna', 'spark', 'bulb', 'orbit', 'molecule', 'wave', 'flask', 'brain', 'atom', 'neuron', 'spark'];
  var tones = [['var(--ink)', .07], ['var(--lilac)', .34], ['var(--mint)', .36], ['var(--pink)', .32], ['var(--sky)', .36], ['var(--ink)', .06], ['var(--peach)', .32]];
  var html = '';
  order.forEach(function (name, i) {
    var left = (i * 37 + 9) % 90, size = 30 + (i * 13) % 30, rise = 80 + (i * 17) % 55, spin = 45 + (i * 11) % 75;
    var tone = tones[i % tones.length];
    html += '<span class="sci" style="left:' + left + '%;width:' + size + 'px;--rise:' + rise + 's;--delay:-' + Math.round(i * rise / order.length) + 's;--spin:' + spin + 's;--dir:' + (i % 2 ? 'reverse' : 'normal') + ';--tone:' + tone[0] + ';--op:' + tone[1] + '">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true">' + S[name] + '</svg></span>';
  });
  var layer = document.createElement('div');
  layer.id = 'sci-bg'; layer.className = 'sci-layer'; layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = html;
  document.body.insertBefore(layer, document.body.firstChild);
})();

applyAppearance();
checkReturn();
document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') { checkReturn(); if (!S.modal) softRender(); } });
loadBackend();

/* Fonctionnement hors connexion + nouvelle version : le service worker met le site en cache ; quand une version plus récente
   prend le relais pendant qu'on utilise l'appli, on propose de la recharger. On vérifie aussi à chaque retour sur l'appli
   (une appli installée peut rester des jours en arrière-plan sans jamais se recharger). */
if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
  var hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (hadController) { S.update = true; softRender(); }
    hadController = true;
  });
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') reg.update().catch(function () { /* hors connexion */ }); });
    }).catch(function () { /* facultatif */ });
  });
}
render();
})();
