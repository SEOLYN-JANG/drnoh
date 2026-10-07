(function(){
  var t=document.querySelector('.nav-toggle'),g=document.getElementById('gnb');
  if(t){t.addEventListener('click',function(){var o=document.body.classList.toggle('nav-open');t.setAttribute('aria-expanded',o);});}
  var cur=document.body.getAttribute('data-nav');
  if(cur){var a=document.querySelector('.gnb a[data-nav="'+cur+'"]');if(a){a.classList.add('is-active');a.setAttribute('aria-current','page');}}
  var h=document.querySelector('.site-header');
  window.addEventListener('scroll',function(){h.classList.toggle('is-stuck',window.scrollY>10);},{passive:true});

  var hs=document.getElementById('heroSlider');
  if(hs){
    var sl=[].slice.call(hs.querySelectorAll('.slide')),
        dots=[].slice.call(hs.querySelectorAll('.hero-dot')),
        idx=0,timer=null;
    function go(i){
      idx=(i+sl.length)%sl.length;
      sl.forEach(function(s,k){s.classList.toggle('is-active',k===idx);s.setAttribute('aria-hidden',k!==idx);});
      dots.forEach(function(d,k){d.classList.toggle('is-active',k===idx);if(k===idx){d.setAttribute('aria-selected','true');}else{d.removeAttribute('aria-selected');}});
    }
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    function start(){stop();timer=setInterval(function(){go(idx+1);},6000);}
    var p=hs.querySelector('.hero-arrow.prev'),n=hs.querySelector('.hero-arrow.next');
    if(p)p.addEventListener('click',function(){go(idx-1);start();});
    if(n)n.addEventListener('click',function(){go(idx+1);start();});
    dots.forEach(function(d,k){d.addEventListener('click',function(){go(k);start();});});
    hs.addEventListener('mouseenter',stop);
    hs.addEventListener('mouseleave',start);
    document.addEventListener('visibilitychange',function(){document.hidden?stop():start();});
    var ts=null;
    hs.addEventListener('touchstart',function(e){ts=e.changedTouches[0].clientX;},{passive:true});
    hs.addEventListener('touchend',function(e){
      if(ts===null)return;var dx=e.changedTouches[0].clientX-ts;ts=null;
      if(Math.abs(dx)>50){go(dx<0?idx+1:idx-1);start();}
    },{passive:true});
    if(sl.length>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)start();
  }

  var rot=document.querySelector('.hh-rotate');
  if(rot){
    var ri=[].slice.call(rot.querySelectorAll('img'));
    if(ri.length>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      var rk=0;
      setInterval(function(){rk=(rk+1)%ri.length;ri.forEach(function(im,j){im.classList.toggle('is-on',j===rk);});},4200);
    }
  }

  /* 공지 배너: data/notices.json에서 노출 기간 내 banner 공지를 헤더 위에 표시 */
  (function(){
    if(/notices\.html$/.test(location.pathname))return;
    var ms=document.querySelector('script[src*="js/main.js"]');
    var base=ms?ms.getAttribute('src').split('js/main.js')[0]:'';
    fetch(base+'data/notices.json?b='+Math.floor(Date.now()/300000))
      .then(function(r){if(!r.ok)throw 0;return r.json();})
      .then(function(d){
        var now=new Date();
        var ymd=now.getFullYear()+'-'+('0'+(now.getMonth()+1)).slice(-2)+'-'+('0'+now.getDate()).slice(-2);
        var act=(d.items||[]).filter(function(n){return n.banner&&(!n.start||n.start<=ymd)&&(!n.end||ymd<=n.end);});
        if(!act.length)return;
        act.sort(function(a,b){return String(b.created||'').localeCompare(String(a.created||''));});
        var n=act[0];
        try{if(sessionStorage.getItem('nbx-'+n.id))return;}catch(e){}
        var band=document.createElement('div');band.className='notice-band';
        var w=document.createElement('div');w.className='wrap';
        var tag=document.createElement('span');tag.className='nb-tag'+(n.type==='휴진'?' is-rest':'');tag.textContent=n.type||'안내';
        var a=document.createElement('a');a.className='nb-link';a.href=base+'notices.html';a.textContent=n.title||'';
        var x=document.createElement('button');x.className='nb-x';x.type='button';x.setAttribute('aria-label','공지 닫기');x.textContent='×';
        x.addEventListener('click',function(){try{sessionStorage.setItem('nbx-'+n.id,'1');}catch(e){}band.parentNode.removeChild(band);});
        w.appendChild(tag);w.appendChild(a);w.appendChild(x);band.appendChild(w);
        var hd=document.querySelector('.site-header');
        if(hd)hd.parentNode.insertBefore(band,hd);
      }).catch(function(){});
  })();
})();
