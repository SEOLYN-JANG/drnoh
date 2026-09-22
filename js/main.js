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
})();
