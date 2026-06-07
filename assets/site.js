/* PlainFigures shared site script — dark mode, cookie consent, print, share, related tools.
   No dependencies. Safe to include on every page. */
(function(){
  var LS = window.localStorage;

  /* ---------- Dark mode ---------- */
  function applyTheme(t){ document.documentElement.setAttribute('data-theme', t); }
  var saved = null;
  try{ saved = LS.getItem('pf-theme'); }catch(e){}
  if(saved){ applyTheme(saved); }
  else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){ applyTheme('dark'); }

  function toggleTheme(){
    var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try{ LS.setItem('pf-theme', next); }catch(e){}
    var b = document.getElementById('pf-theme-btn'); if(b) b.textContent = next === 'dark' ? '☀︎' : '☾';
  }

  /* ---------- Cookie consent (required for EEA/UK/CA AdSense) ---------- */
  function initCookie(){
    var choice = null;
    try{ choice = LS.getItem('pf-consent'); }catch(e){}
    if(choice) return; // already decided
    var bar = document.createElement('div');
    bar.className = 'pf-cookie';
    bar.innerHTML = '<div class="cwrap"><p>We use cookies for analytics and to show ads via Google AdSense. '
      + 'See our <a href="/privacy.html">Privacy Policy</a>.</p>'
      + '<button class="acc">Accept</button><button class="dec">Decline</button></div>';
    document.body.appendChild(bar);
    bar.style.display = 'block';
    function set(v){ try{ LS.setItem('pf-consent', v); }catch(e){} bar.style.display='none'; }
    bar.querySelector('.acc').onclick = function(){ set('accepted'); };
    bar.querySelector('.dec').onclick = function(){ set('declined'); };
  }

  /* ---------- Print / Share result ---------- */
  window.pfPrint = function(){ window.print(); };
  window.pfShare = function(){
    var url = location.href;
    function done(){
      var n = document.querySelector('.pf-copied');
      if(n){ n.style.display='block'; setTimeout(function(){ n.style.display='none'; }, 2500); }
    }
    if(navigator.share){ navigator.share({title:document.title, url:url}).catch(function(){}); return; }
    if(navigator.clipboard){ navigator.clipboard.writeText(url).then(done, done); return; }
    prompt('Copy this link:', url);
  };

  /* ---------- URL state (share exact calculation) ---------- */
  window.pfSaveState = function(ids){
    var p = new URLSearchParams();
    ids.forEach(function(id){ var el=document.getElementById(id); if(el) p.set(id, el.value); });
    history.replaceState(null, '', location.pathname + '?' + p.toString());
  };
  window.pfLoadState = function(ids){
    var p = new URLSearchParams(location.search);
    ids.forEach(function(id){ if(p.has(id)){ var el=document.getElementById(id); if(el) el.value=p.get(id); } });
  };

  /* ---------- Related tools block ---------- */
  var TOOLS = [
    {u:'/calculators/mortgage-calculator.html', t:'Mortgage Calculator', d:'Monthly payment & amortization'},
    {u:'/calculators/auto-loan-calculator.html', t:'Auto Loan Calculator', d:'Car payment & total cost'},
    {u:'/calculators/paycheck-calculator.html', t:'Paycheck Calculator', d:'Take-home pay after taxes'},
    {u:'/calculators/credit-card-payoff-calculator.html', t:'Credit Card Payoff', d:'Months to debt-free'},
    {u:'/calculators/retirement-savings-calculator.html', t:'Retirement Savings', d:'Project your nest egg'},
    {u:'/guides/index.html', t:'Money Guides', d:'Plain-English explainers'},
    {u:'/glossary.html', t:'Finance Glossary', d:'APR, PMI, escrow & more'}
  ];
  window.pfRelated = function(currentPath, n){
    n = n || 4;
    var pick = TOOLS.filter(function(x){ return x.u !== currentPath; }).slice(0, n);
    var host = document.getElementById('pf-related');
    if(!host) return;
    var html = '<h2>Related tools &amp; guides</h2><div class="rgrid">';
    pick.forEach(function(x){ html += '<a href="'+x.u+'"><b>'+x.t+'</b><span>'+x.d+'</span></a>'; });
    html += '</div>';
    host.className = 'pf-related';
    host.innerHTML = html;
  };

  /* ---------- Inject theme toggle into header nav ---------- */
  function initThemeBtn(){
    var nav = document.querySelector('header nav');
    if(nav && !document.getElementById('pf-theme-btn')){
      var b = document.createElement('button');
      b.id = 'pf-theme-btn'; b.className = 'pf-theme'; b.type='button';
      b.setAttribute('aria-label','Toggle dark mode');
      b.textContent = document.documentElement.getAttribute('data-theme')==='dark' ? '☀︎' : '☾';
      b.onclick = toggleTheme;
      nav.appendChild(b);
    }
  }

  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){ initThemeBtn(); initCookie(); });
})();
