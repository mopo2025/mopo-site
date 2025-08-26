/* ===== 以下腳本完全沿用主頁，不作更動 ===== */

// 顯示年份 & 頂端列高度補償
document.getElementById('year').textContent = new Date().getFullYear();
(function(){
  const topbar = document.getElementById('topbar');
  function applySpacer(){
    if(!topbar) return;
    document.body.style.paddingTop = topbar.offsetHeight + 'px';
  }
  applySpacer();
  window.addEventListener('resize', applySpacer);
})();

// Topbar Scrolled / Hide on scroll down
const topbar = document.getElementById('topbar');
function setTopbar(){ topbar.classList.toggle('scrolled', window.scrollY > 10) }
setTopbar(); 
window.addEventListener('scroll', setTopbar, {passive:true});

(function(){
  const topbar = document.getElementById('topbar');
  let lastScrollY = window.scrollY, ticking = false;
  function update() {
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 100) topbar.classList.add('hide');
    else topbar.classList.remove('hide');
    lastScrollY = currentY; ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { 
      window.requestAnimationFrame(update); 
      ticking = true; 
    }
  }, { passive: true });
})();

// ✅ 語言切換（穩定版＋mopoindex→mopo 特例）
(function () {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
  } else {
    initLang();
  }

  function initLang() {
    // e.g. /news/ja_contactmopo.html → dir="/news/", file="ja_contactmopo.html"
    const path = (location.pathname || '');
    const dir  = path.replace(/[^/]*$/, '');              // 目前資料夾（含結尾 /）
    const file = (path.split('/').pop() || 'index.html'); // 檔名

    // 去掉語言前綴（ja_ / en_）
    const base = file.replace(/^(ja_|en_)/i, '');

    // 語言值標準化
    const norm = (v)=>{
      const s = String(v||'').trim().toLowerCase();
      if (s==='ja' || s==='jp' || s==='ja-jp') return 'ja';
      if (s==='en' || s==='en-us' || s==='en-gb') return 'en';
      if (s==='zh' || s==='zh-tw' || s==='tw' || s==='zh_hant' || s==='zh-hant') return 'zh-Hant';
      return 'zh-Hant';
    };

    // 語言前綴
    const prefixOf = { 'zh-Hant': '', ja: 'ja_', en: 'en_' };

    // 🔧 檔名特例：日/英 mopoindex → 繁中用 mopo.html
    function baseFor(lang){
      if (base === 'mopoindex.html' && lang === 'zh-Hant') return 'mopo.html';
      return base;
    }

    // 產生目標 URL（保留原資料夾；file:/// 與 http/https 皆可）
    function targetUrl(langRaw){
      const lang   = norm(langRaw);
      const prefix = prefixOf[lang] ?? '';
      const next   = prefix + baseFor(lang);     // 只換前綴／必要時換成 mopo.html
      return new URL(dir + next, location.href).href;
    }

    function go(langRaw){
      const url = targetUrl(langRaw);
      if (url !== location.href) location.href = url;
    }

    // 桌機 <select>
    const sel = document.getElementById('langSelect');
    if (sel){
      const on = ()=> go(sel.value);
      sel.addEventListener('change', on);
      sel.addEventListener('input',  on);
    }

    // 手機語言面板（data-lang）
    const panel = document.getElementById('mobLangPanel');
    if (panel){
      panel.addEventListener('click', (e)=>{
        const a = e.target.closest('[data-lang]');
        if(!a) return;
        e.preventDefault();
        go(a.getAttribute('data-lang'));
      });
    }
  }
})();

// 手機語言 & 導覽面板
(function(){
  const overlay   = document.getElementById('mobOverlay');
  const langBtn   = document.getElementById('mobLangBtn');
  const langPanel = document.getElementById('mobLangPanel');
  const navBtn    = document.getElementById('mobNavBtn');
  const navPanel  = document.getElementById('mobNavPanel');

  const IOS16 = (() => {
    const ua = navigator.userAgent || "";
    const isIOS = /iP(ad|hone|od)/.test(ua);
    const m = ua.match(/OS (\d+)_/);
    const major = m ? parseInt(m[1], 10) : 0;
    return isIOS && major === 16;
  })();

  function closePanels(){
    langPanel?.classList.remove('show');
    navPanel?.classList.remove('show');
    overlay?.classList.remove('show');
    overlay?.classList.remove('noblur');
    if(overlay) overlay.hidden = true;
  }
  function openPanel(panel){
    if(panel !== langPanel) langPanel?.classList.remove('show');
    if(panel !== navPanel)  navPanel?.classList.remove('show');
    if(overlay){
      overlay.hidden = false;
      overlay.classList.add('show');
      if(IOS16) overlay.classList.add('noblur');
    }
    panel?.classList.add('show');
  }
  function togglePanel(panel){
    if(panel?.classList.contains('show')) closePanels();
    else openPanel(panel);
  }

  langBtn?.addEventListener('click', (e)=>{ e.stopPropagation(); togglePanel(langPanel); });
  navBtn?.addEventListener('click',  (e)=>{ e.stopPropagation(); togglePanel(navPanel);  });

  overlay?.addEventListener('click', closePanels);
  document.addEventListener('click', (e)=>{
    if(e.target.closest('.mobdrop')) return;
    closePanels();
  });
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closePanels(); });

  navPanel?.addEventListener('click', (e)=>{
    const a = e.target.closest('a[href]');
    if(!a) return;
    e.preventDefault();
    const href = a.getAttribute('href') || '#';
    closePanels();
    setTimeout(()=>{
      if(href.startsWith('#')){
        const el = document.querySelector(href);
        if(el){ el.scrollIntoView({behavior:'smooth', block:'start'}); }
        else { window.location.href = href; }
      }else{
        window.location.href = href;
      }
    }, 0);
  });
})();

// 回到頂部
document.getElementById('backTop').addEventListener('click', ()=> 
  window.scrollTo({top:0, behavior:'smooth'}));