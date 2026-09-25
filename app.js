'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const make = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};
const setPressed = (selector, active) => $$(selector).forEach(button => button.setAttribute('aria-pressed', String(active(button))));
let toastTimeout;
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('is-visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => $('#toast').classList.remove('is-visible'), 4000);
}

// Only four non-personal exploration flags are stored. Writing is optional and never blocks the exhibition.
const stampNames = {journey:'循迹', atlas:'观地', fieldwork:'问地', reading:'辨读'};
let earned = new Set();
try {
  const saved = JSON.parse(localStorage.getItem('ditu-exploration-v2') || '[]');
  if (Array.isArray(saved)) earned = new Set(saved.filter(key => Object.hasOwn(stampNames, key)));
} catch { /* Private or file browsing may make storage unavailable. */ }
function paintStamps() {
  $$('[data-stamp]').forEach(node => {
    const present = earned.has(node.dataset.stamp);
    node.classList.toggle('is-collected', present);
    node.setAttribute('aria-label', `${stampNames[node.dataset.stamp]}：${present ? '已收集' : '未收集'}`);
  });
}
function collect(key) {
  if (earned.has(key)) return;
  earned.add(key);
  try { localStorage.setItem('ditu-exploration-v2', JSON.stringify([...earned])); } catch { /* Optional persistence. */ }
  paintStamps();
  drawCard();
  toast(`收下一枚「${stampNames[key]}」印记，留在卷末的观展笺里。`);
}

let motionPaused = false;
function applyMotion() {
  document.documentElement.classList.toggle('motion-paused', motionPaused);
  $('#motion-toggle').setAttribute('aria-pressed', String(motionPaused));
  $('.motion-label').textContent = motionPaused ? '播放动画' : '暂停动画';
  $('.motion-icon').textContent = motionPaused ? '▷' : 'Ⅱ';
}
$('#motion-toggle').addEventListener('click', () => { motionPaused = !motionPaused; applyMotion(); });
applyMotion();

const visitedYears = new Set(['1936']);
let yearIndex = 2;
function chooseYear(index, userAction = true) {
  yearIndex = Math.max(0, Math.min(EXHIBITION.years.length - 1, index));
  const year = EXHIBITION.years[yearIndex];
  const item = EXHIBITION.milestones[year];
  setPressed('[data-year]', button => button.dataset.year === year);
  $('#timeline-year').replaceChildren(document.createTextNode(year), make('small', '', item.suffix));
  $('#timeline-place').textContent = item.place;
  $('#timeline-title').textContent = item.title;
  $('#timeline-description').textContent = item.body;
  $('#timeline-reflection').textContent = item.reflection;
  $('#route-index').textContent = `${String(yearIndex + 1).padStart(2, '0')} / 07`;
  $('.route-caption span').textContent = item.routeNote || '行迹关系示意 · 非按比例绘制';
  $$('[data-place]').forEach(node => node.classList.toggle('is-active', node.dataset.place === item.location));
  $('#timeline-prev').disabled = yearIndex === 0;
  $('#timeline-next').disabled = yearIndex === EXHIBITION.years.length - 1;
  if (userAction) { visitedYears.add(year); if (visitedYears.size >= 3) collect('journey'); }
}
$$('[data-year]').forEach(button => {
  button.addEventListener('click', () => chooseYear(EXHIBITION.years.indexOf(button.dataset.year)));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = EXHIBITION.years.indexOf(button.dataset.year);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 6 : current + (event.key === 'ArrowRight' ? 1 : -1);
    chooseYear(next);
    $$('[data-year]')[yearIndex].focus();
  });
});
$('#timeline-prev').addEventListener('click', () => chooseYear(yearIndex - 1));
$('#timeline-next').addEventListener('click', () => chooseYear(yearIndex + 1));
chooseYear(2, false);

const layers = {nature:true, settlement:false, connection:false};
let selectedNode = 'river';
function selectNode(key) {
  selectedNode = key;
  setPressed('[data-node]', button => button.dataset.node === key);
  const item = EXHIBITION.observations[key];
  $('#insight-kicker').textContent = item ? item.kicker : '观地 / 选择图层';
  $('#insight-character').textContent = item ? item.character : '观';
  $('#insight-title').textContent = item ? item.title : '从一个图层，重新开始。';
  $('#insight-body').textContent = item ? item.body : '打开上方任意图层，再点选画中的标记。山水意象始终保留，标记与连线随你的选择展开。';
}
function renderLayers(userAction = false) {
  setPressed('[data-layer]', button => layers[button.dataset.layer]);
  $$('[data-layer]').forEach(button => $('.toggle-mark', button).textContent = layers[button.dataset.layer] ? '✓' : '＋');
  $$('[data-for-layer]').forEach(node => node.toggleAttribute('hidden', !layers[node.dataset.forLayer]));
  const count = Object.values(layers).filter(Boolean).length;
  $('#layer-count').textContent = `已展开 ${count} / 3 个图层`;
  $('.layer-meter span').style.width = `${count / 3 * 100}%`;
  $('#map-discovery').textContent = count === 3 ? '三个图层相遇了。点一处“往来”，继续追问它联系着谁。' : '让自然与人的生活，在同一张图上相遇。';
  if (!selectedNode || !layers[EXHIBITION.observations[selectedNode].layer]) {
    selectNode(Object.keys(EXHIBITION.observations).find(key => layers[EXHIBITION.observations[key].layer]) || null);
  }
  if (count === 3 && userAction) collect('atlas');
}
$$('[data-layer]').forEach(button => button.addEventListener('click', () => {
  layers[button.dataset.layer] = !layers[button.dataset.layer]; renderLayers(true);
}));
$$('[data-node]').forEach(button => button.addEventListener('click', () => selectNode(button.dataset.node)));
$('#map-reset').addEventListener('click', () => { Object.assign(layers, {nature:true, settlement:false, connection:false}); selectNode('river'); renderLayers(); });
renderLayers();

let selectedSite = 'riverside';
let weather = 'normal';
const factorLabels = {environment:'环境', access:'通学', community:'生活'};
function renderFieldwork(userAction = false) {
  const site = EXHIBITION.sites[selectedSite];
  const priority = $('#field-priority').value;
  setPressed('[data-site]', button => button.dataset.site === selectedSite);
  setPressed('[data-weather]', button => button.dataset.weather === weather);
  $('#field-board').classList.toggle('is-rain', weather === 'rain');
  $('#site-heading').replaceChildren(document.createTextNode(site.label), make('small', '', weather === 'rain' ? '雨季观察' : '平日观察'));
  $('#site-factors').replaceChildren(...Object.entries(site[weather]).map(([key, description]) => {
    const row = make('div', `factor-row${key === priority ? ' is-priority' : ''}`);
    row.append(make('span', 'factor-label', factorLabels[key]), make('p', 'factor-description', description));
    return row;
  }));
  $('#field-question-text').textContent = site.questions[priority];
  if (userAction) collect('fieldwork');
}
$$('[data-site]').forEach(button => button.addEventListener('click', () => { selectedSite = button.dataset.site; renderFieldwork(true); }));
$$('[data-weather]').forEach(button => button.addEventListener('click', () => { weather = button.dataset.weather; renderFieldwork(true); }));
$('#field-priority').addEventListener('change', () => renderFieldwork(true));
renderFieldwork();

function openDialog(dialog) { dialog.showModal(); document.body.classList.add('dialog-open'); }
$$('[data-open-dialog]').forEach(button => button.addEventListener('click', () => openDialog(document.getElementById(button.dataset.openDialog))));
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  $$('a[href^="#"]', dialog).forEach(link => link.addEventListener('click', () => dialog.close()));
});
EXHIBITION.books.forEach((book, index) => {
  const card = make('button', 'book-card'); card.type = 'button';
  card.setAttribute('aria-label', `翻阅《${book.title}》，${book.role}，${book.year}年`);
  const cover = make('span', 'book-cover'); cover.setAttribute('aria-hidden', 'true');
  cover.append(make('span', 'book-cover-title', book.title), make('span', 'book-cover-role', book.role), make('span', 'book-cover-seal', book.seal));
  const meta = make('span', 'book-meta');
  meta.append(make('small', '', `${String(index + 1).padStart(2, '0')} / ${book.year}`), make('span', 'book-meta-title', book.title), make('span', 'book-meta-role', book.role));
  card.append(cover, meta);
  card.addEventListener('click', () => {
    $('#book-dialog-kicker').textContent = `${book.type} / ${book.year}`;
    $('#book-dialog-title').textContent = book.title;
    $('#book-dialog-role').textContent = book.role;
    $('#book-dialog-description').textContent = book.description;
    $('#book-dialog-question').textContent = book.question;
    $('#book-dialog-source').href = `#${book.source}`;
    $('#book-dialog-source').textContent = `查看资料 ${book.source.slice(-2)}${book.extraSource ? `（另参资料 ${book.extraSource.slice(-2)}）` : ''} →`;
    openDialog($('#book-dialog'));
  });
  $('#bookshelf').append(card);
});

const evidenceAnswers = new Map();
const evidenceLabels = {fact:'史实', expression:'创作表达', concept:'概念示意'};
EXHIBITION.evidence.forEach((item, index) => {
  const card = make('article', 'evidence-card reveal');
  card.append(make('span', 'evidence-number', `0${index + 1}`));
  const statement = make('h3', 'evidence-statement', item.statement); statement.id = `evidence-question-${index}`; card.append(statement);
  const options = make('div', 'evidence-options'); options.setAttribute('role','group'); options.setAttribute('aria-labelledby', statement.id);
  const feedback = make('p', 'evidence-feedback', '选择一种性质，看看你的判断。'); feedback.setAttribute('aria-live','polite');
  Object.entries(evidenceLabels).forEach(([key, label]) => {
    const button = make('button', '', label); button.type = 'button'; button.setAttribute('aria-pressed','false');
    button.addEventListener('click', () => {
      $$('button', options).forEach(option => option.setAttribute('aria-pressed', String(option === button)));
      const correct = key === item.answer;
      evidenceAnswers.set(index, correct);
      card.classList.toggle('is-correct', correct); card.classList.toggle('is-incorrect', !correct);
      feedback.textContent = correct ? `是的，这是${evidenceLabels[item.answer]}。${item.explanation}` : `再想一想：${key === 'fact' ? '它是否能由历史材料直接核对？' : '这段内容是在陈述生平、表达愿望，还是帮助理解关系？'}可以重新选择。`;
      if (correct && item.source) { const link = make('a', '', ' 查看依据 →'); link.href = `#${item.source}`; feedback.append(link); }
      const count = [...evidenceAnswers.values()].filter(Boolean).length;
      $('#evidence-count').textContent = `${count} / 3`;
      $('#evidence-summary p').textContent = count === 3 ? '三种内容，都找到了合适的位置。分清依据，故事才更值得信任。' : '每次选择，都可以重新思考。找到依据，比猜中答案更重要。';
      if (count === 3) collect('reading');
    });
    options.append(button);
  });
  card.append(options, feedback); $('#evidence-grid').append(card);
});

EXHIBITION.sources.forEach((source, index) => {
  const entry = make('a', 'archive-entry reveal');
  entry.id = source.id; entry.href = source.url; entry.target = '_blank'; entry.rel = 'noopener noreferrer';
  const copy = make('div'); copy.append(make('p', 'archive-type', source.type), make('h3', '', source.title), make('p', '', source.description));
  const arrow = make('span', 'archive-arrow', '↗'); arrow.setAttribute('aria-hidden','true');
  entry.append(make('span', 'archive-index', String(index + 1).padStart(2, '0')), copy, arrow);
  $('#archive-list').append(entry);
});

let cardTheme = 'knowledge';
const cardCanvas = $('#souvenir-canvas');
const cardContext = cardCanvas.getContext('2d');
function wrapCanvasText(context, text, x, y, maxWidth, lineHeight) {
  let line = '';
  for (const character of Array.from(text)) {
    if (character === '\n' || (line && context.measureText(line + character).width > maxWidth)) {
      context.fillText(line, x, y); y += lineHeight; line = character === '\n' ? '' : character;
    } else line += character;
  }
  if (line) { context.fillText(line, x, y); y += lineHeight; }
  return y;
}
function drawCard() {
  if (!cardContext) return;
  $('#card-download-link').hidden = true;
  $('#card-status').textContent = 'PNG 图片 · 1080 × 1440';
  const ctx = cardContext;
  const theme = EXHIBITION.themes[cardTheme];
  const ink = '#263e36';
  const serif = '"Songti SC", "STSong", "SimSun", serif';
  ctx.clearRect(0, 0, 1080, 1440);
  ctx.fillStyle = '#f1eadb'; ctx.fillRect(0, 0, 1080, 1440);
  // Deterministic fine paper specks and drawn landscapes need no network or image permissions.
  for (let i = 0; i < 4200; i++) {
    const x = (i * 137.37) % 1080, y = (i * 71.81) % 1440;
    ctx.fillStyle = i % 3 ? 'rgba(96,76,44,.045)' : 'rgba(255,255,255,.2)';
    ctx.fillRect(x, y, 1.5, 1.5);
  }
  ctx.strokeStyle = 'rgba(53,75,61,.25)'; ctx.lineWidth = 1;
  ctx.strokeRect(42, 42, 996, 1356);
  ctx.beginPath(); ctx.moveTo(82,132);ctx.lineTo(998,132);ctx.stroke();
  ctx.fillStyle = ink; ctx.font = `24px ${serif}`; ctx.textAlign = 'left';
  ctx.fillText('地 图 上 的 人', 82, 102);
  ctx.textAlign = 'right'; ctx.font = `20px ${serif}`; ctx.fillText('李旭旦 · 互动数字展',998,102);
  ctx.textAlign = 'left'; ctx.fillStyle = theme.color; ctx.font = `250px ${serif}`; ctx.fillText(theme.character,90,395);
  ctx.fillStyle = '#9c3e2e'; ctx.fillRect(364,226,49,87);
  ctx.fillStyle = '#f1eadb'; ctx.font = `27px ${serif}`; ctx.fillText('观',375,260);ctx.fillText('地',375,296);
  ctx.fillStyle = ink; ctx.font = `38px ${serif}`; ctx.fillText(theme.title + ' · 观展笺',87,493);
  ctx.font = `29px ${serif}`; wrapCanvasText(ctx,theme.line,88,549,840,46);
  const mountainPaths = [
    {color:'#849485',alpha:.19,base:790,amp:106,phase:1},
    {color:'#557466',alpha:.22,base:866,amp:102,phase:2.7},
    {color:theme.color,alpha:.29,base:933,amp:86,phase:4.5}
  ];
  mountainPaths.forEach(mountain => {
    ctx.save();ctx.globalAlpha = mountain.alpha;ctx.fillStyle = mountain.color;ctx.beginPath();ctx.moveTo(43,1030);
    for (let x=43; x<=1037; x+=4) {
      const ridge = Math.sin(x / 131 + mountain.phase) * mountain.amp + Math.sin(x / 48 + mountain.phase) * 18;
      ctx.lineTo(x, mountain.base + ridge);
    }
    ctx.lineTo(1037,1030);ctx.closePath();ctx.fill();ctx.restore();
  });
  const fade = ctx.createLinearGradient(0,917,0,1062);fade.addColorStop(0,'rgba(241,234,219,0)');fade.addColorStop(1,'#f1eadb');ctx.fillStyle=fade;ctx.fillRect(43,917,994,155);
  ctx.strokeStyle='rgba(71,102,87,.17)';ctx.lineWidth=1;
  for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse(550,939+i*13,230+i*26,8+i*2,0,0,Math.PI*2);ctx.stroke();}
  ctx.fillStyle=ink;ctx.font=`21px ${serif}`;ctx.fillText('我 的 一 句 发 现',88,1081);
  const note=$('#visitor-note').value.replace(/\s+/gu, ' ').trim() || theme.note;
  ctx.font=`32px ${serif}`;wrapCanvasText(ctx,note,88,1143,895,48);
  const stampKeys=Object.keys(stampNames);
  stampKeys.forEach((key,index)=>{
    const x=88+index*86;
    ctx.strokeStyle=earned.has(key)?'#9c3e2e':'#b6b3a3';ctx.fillStyle=ctx.strokeStyle;ctx.lineWidth=2;ctx.strokeRect(x,1266,68,38);ctx.font=`21px ${serif}`;ctx.fillText(stampNames[key],x+12,1293);
  });
  ctx.fillStyle='#627168';ctx.font=`18px ${serif}`;ctx.textAlign='right';ctx.fillText('一卷山河，一生求索。',992,1293);
  ctx.textAlign='left';ctx.font='17px sans-serif';ctx.fillText('2cz2c7jrk7-coder.github.io/x6dicnh9nep8/',88,1360);
  cardCanvas.setAttribute('aria-label',`${theme.title}观展笺：${theme.line} 我的发现：${note}。已收集${earned.size}枚印记。`);
}
$$('[data-theme]').forEach(button => button.addEventListener('click', () => {
  cardTheme = button.dataset.theme; setPressed('[data-theme]', item => item === button); drawCard();
}));
$('#visitor-note').addEventListener('input', () => { $('#note-count').textContent = `${$('#visitor-note').value.length} / 36`; drawCard(); });
$('#download-card').addEventListener('click', () => {
  if (!cardContext) { $('#card-status').textContent = '此浏览器不支持图片绘制，请换用较新的浏览器。'; return; }
  try {
    drawCard();
    const link = $('#card-download-link');
    link.href = cardCanvas.toDataURL('image/png');
    link.download = `地图上的人-${EXHIBITION.themes[cardTheme].title}观展笺.png`;
    link.hidden = false;
    link.click();
    $('#card-status').textContent = 'PNG 已生成；若未开始下载，可点下方链接保存。';
  } catch { $('#card-status').textContent = '浏览器未能导出图片。可先截图保存，或换用较新的浏览器。'; }
});
paintStamps();drawCard();
if (document.fonts?.ready) document.fonts.ready.then(drawCard);

// Add scroll decoration only after every core interaction has initialized.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  }, {threshold:.015, rootMargin:'0px 0px -12px 0px'});
  $$('.reveal').forEach(node => revealObserver.observe(node));
  const navObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      $$('.site-header nav a').forEach(link => { if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
    }
  }, {rootMargin:'-15% 0px -60% 0px'});
  $$('main section[id]').forEach(node => navObserver.observe(node));
  document.documentElement.classList.add('js-enabled');
}
let scrollQueued = false;
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  $('.reading-progress span').style.width = `${max > 0 ? Math.max(0,Math.min(100,scrollY / max * 100)) : 0}%`;
  scrollQueued = false;
}
addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued=true; requestAnimationFrame(updateProgress); } }, {passive:true});
addEventListener('resize',updateProgress);updateProgress();
