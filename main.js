/* =========================
   main.js - ES5 兼容版本
========================= */

document.addEventListener('DOMContentLoaded', function () {

  var headerEl = document.querySelector('header');
  function updateHeaderHeightVar() {
    if (!headerEl) return;
    document.documentElement.style.setProperty('--header-h', headerEl.offsetHeight + 'px');
  }
  updateHeaderHeightVar();
  window.addEventListener('resize', function () {
    updateHeaderHeightVar();
  });

  var intro = document.getElementById('intro');
  var introSkip = document.getElementById('introSkip');
  var introVideo = document.getElementById('introVideo');
  var introKey = 'introSeen';
  var introTimer = 0;
  var uiTimer = 0;

  function showIntroUI() {
    if (!intro) return;
    if (intro.classList.contains('hide')) return;
    intro.classList.add('show-ui');
    var inner = intro.querySelector ? intro.querySelector('.intro-inner') : null;
    if (inner && inner.hidden) inner.hidden = false;

    if (uiTimer) {
      window.clearTimeout(uiTimer);
      uiTimer = 0;
    }

    uiTimer = window.setTimeout(function () {
      hideIntro();
    }, 2600);
  }

  function hideIntro() {
    if (!intro) return;
    if (intro.classList.contains('hide')) return;
    intro.classList.add('hide');
    document.body.classList.remove('intro-lock');
    document.body.style.removeProperty('--scrollbar-w');
    if (introTimer) {
      window.clearTimeout(introTimer);
      introTimer = 0;
    }
    if (uiTimer) {
      window.clearTimeout(uiTimer);
      uiTimer = 0;
    }
    if (introVideo && introVideo.pause) {
      try { introVideo.pause(); } catch (e) {}
    }
    try { sessionStorage.setItem(introKey, '1'); } catch (e) {}
    window.setTimeout(function () {
      if (intro && intro.parentNode) intro.parentNode.removeChild(intro);
    }, 450);
  }

  if (intro) {
    var seen = false;
    try { seen = !!sessionStorage.getItem(introKey); } catch (e) {}

    if (seen) {
      if (intro.parentNode) intro.parentNode.removeChild(intro);
    } else {
      var scrollbarW = 0;
      try { scrollbarW = window.innerWidth - document.documentElement.clientWidth; } catch (e) { scrollbarW = 0; }
      if (scrollbarW < 0) scrollbarW = 0;
      document.body.style.setProperty('--scrollbar-w', scrollbarW + 'px');
      document.body.classList.add('intro-lock');
      introTimer = window.setTimeout(showIntroUI, 9000);

      if (introVideo) {
        introVideo.addEventListener('ended', showIntroUI);
        try {
          var p = introVideo.play();
          if (p && p.catch) p.catch(function () { showIntroUI(); });
        } catch (e) {}
      }

      if (introSkip) introSkip.addEventListener('click', hideIntro);
      intro.addEventListener('click', function (e) {
        if (e.target === intro && intro.classList.contains('show-ui')) hideIntro();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') hideIntro();
      });
    }
  }

  /* ===== 主菜单 ===== */
  var menuBtn = document.getElementById('menuBtn');
  var navList = document.getElementById('navList');

  if (menuBtn && navList) {
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.addEventListener('click', function () {
      navList.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', navList.classList.contains('open') ? 'true' : 'false');
    });

    navList.addEventListener('click', function (e) {
      if (e.target && e.target.tagName === 'A') {
        navList.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.addEventListener('click', function (e) {
    if (!menuBtn || !navList) return;
    var nav = menuBtn.closest ? menuBtn.closest('nav') : null;
    if (nav && !nav.contains(e.target) && navList.classList.contains('open')) {
      navList.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ===== 二级导航 ===== */
  var dropdownBtns = document.querySelectorAll('.dropdown > button');

  Array.prototype.forEach.call(dropdownBtns, function (btn) {
    var dropdown = btn.parentElement;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();

      var opens = document.querySelectorAll('.dropdown.open');
      Array.prototype.forEach.call(opens, function (d) {
        if (d !== dropdown) d.classList.remove('open');
      });

      dropdown.classList.toggle('open');
    });
  });

  document.addEventListener('click', function () {
    var opens = document.querySelectorAll('.dropdown.open');
    Array.prototype.forEach.call(opens, function (d) {
      d.classList.remove('open');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (navList) navList.classList.remove('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    var opens = document.querySelectorAll('.dropdown.open');
    Array.prototype.forEach.call(opens, function (d) {
      d.classList.remove('open');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e || !e.target) return;
    var meta = e.target.closest ? e.target.closest('.meta') : null;
    if (!meta) return;
    var card = meta.closest ? meta.closest('a.card') : null;
    if (!card || !card.id) return;

    var map = {
      'char-dog': 'A',
      'char-robot': 'B',
      'char-raccoon': 'C',
      'char-yellow-robot': 'D'
    };
    var key = map[card.id];
    if (!key) return;

    e.preventDefault();
    e.stopPropagation();
    window.location.href = './character.html#' + key;
  });

  /* ===== 背景音乐 ===== */
  var bgm = document.getElementById('bgm');
  var musicBtn = document.getElementById('musicBtn');
  var playing = false;

  function markPlayingUI(isPlaying) {
    playing = !!isPlaying;
    if (musicBtn) {
      musicBtn.innerHTML = playing ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-music"></i>';
    }
  }

  function tryAutoplayFromUserGesture() {
    var unlock = function () {
      if (!bgm) return;
      bgm.muted = false;
      if (bgm.readyState === 0 && bgm.load) bgm.load();
      var p = null;
      try { p = bgm.play(); } catch (e) { p = null; }
      if (p && p.then) {
        p.then(function () { markPlayingUI(true); })['catch'](function () { markPlayingUI(false); });
      } else {
        markPlayingUI(true);
      }
    };
    document.addEventListener('pointerdown', unlock, { once: true, capture: true });
    document.addEventListener('keydown', unlock, { once: true, capture: true });
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', function () {
      if (!bgm) return;

      if (!playing) {
        bgm.muted = false;
        if (bgm.readyState === 0 && bgm.load) bgm.load();
        var p = bgm.play();
        if (p && p.then) {
          p.then(function () {
            markPlayingUI(true);
          })['catch'](function () {
            markPlayingUI(false);
          });
        } else {
          markPlayingUI(true);
        }
      } else {
        bgm.pause();
        markPlayingUI(false);
      }
    });
  }

  if (bgm) {
    markPlayingUI(false);
    tryAutoplayFromUserGesture();
  }

  /* ===== 返回顶部 ===== */
  var topBtn = document.getElementById('topBtn');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Hero 滚动交互（小狗/机器人分离 + 遮罩上移） ===== */
  var heroEl = document.getElementById('home');
  if (heroEl && heroEl.style && heroEl.getBoundingClientRect) {
    var heroRaf = 0;

    function clamp01(n) {
      if (n < 0) return 0;
      if (n > 1) return 1;
      return n;
    }

    function updateHeroSplit() {
      heroRaf = 0;
      var rect = heroEl.getBoundingClientRect();
      var total = rect.height * 0.7;
      if (total <= 0) total = 1;

      var progress = (-rect.top) / total;
      progress = clamp01(progress);

      heroEl.style.setProperty('--split', String(progress));
      document.documentElement.style.setProperty('--hero-split', String(progress));
    }

    function scheduleHeroUpdate() {
      if (heroRaf) return;
      heroRaf = window.requestAnimationFrame ? window.requestAnimationFrame(updateHeroSplit) : window.setTimeout(updateHeroSplit, 16);
    }

    updateHeroSplit();
    window.addEventListener('scroll', scheduleHeroUpdate);
    window.addEventListener('resize', scheduleHeroUpdate);
  }

  /* ===== 剧照轮播 ===== */
  var slidesEl = document.getElementById('slides');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var dotsEl = document.getElementById('dots');
  var sliderEl = null;
  if (slidesEl && slidesEl.closest) sliderEl = slidesEl.closest('.slider');

  if (slidesEl && prevBtn && nextBtn && dotsEl) {
    var imgs = slidesEl.querySelectorAll('img');
    var count = imgs.length;
    var current = 0;

    function setButtonDisabled(btn, disabled) {
      if (!btn) return;
      btn.disabled = !!disabled;
      btn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    }

    function renderDots() {
      dotsEl.innerHTML = '';
      if (count <= 1) return;

      for (var i = 0; i < count; i++) {
        var dotBtn = document.createElement('button');
        dotBtn.type = 'button';
        dotBtn.className = 'dot';
        dotBtn.setAttribute('aria-label', '第 ' + (i + 1) + ' 张');
        dotBtn.setAttribute('data-index', String(i));
        dotsEl.appendChild(dotBtn);
      }
    }

    function updateDots() {
      var dotBtns = dotsEl.querySelectorAll('.dot');
      for (var i = 0; i < dotBtns.length; i++) {
        dotBtns[i].setAttribute('aria-current', i === current ? 'true' : 'false');
      }
    }

    function update() {
      if (count <= 0) return;
      slidesEl.style.transform = 'translateX(' + (-current * 100) + '%)';
      updateDots();
      setButtonDisabled(prevBtn, count <= 1);
      setButtonDisabled(nextBtn, count <= 1);
    }

    function goTo(index) {
      if (count <= 0) return;
      current = (index + count) % count;
      update();
    }

    renderDots();
    update();

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });

    dotsEl.addEventListener('click', function (e) {
      var target = e.target;
      if (!target || !target.getAttribute) return;
      if (!target.classList || !target.classList.contains('dot')) return;
      var idx = target.getAttribute('data-index');
      if (idx == null) return;
      goTo(parseInt(idx, 10));
    });

    if (sliderEl) {
      sliderEl.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
      });
    }
  }

  document.addEventListener('click', function (e) {
    var metaEl = e.target && e.target.closest ? e.target.closest('#characters .meta') : null;
    if (!metaEl) return;
    e.preventDefault();
    e.stopPropagation();
    window.location.href = 'character.html';
  }, true);

});
