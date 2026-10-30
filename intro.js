// V4.4 playback is isolated from recommendation, onboarding and Firebase state.
export const INTRO_SEEN_KEY = 'mamgorithm_intro_seen_v1';
export function readIntroFlag(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function createIntro({ isDark, onFirstVisitFinished }) {
  let active = false;
  return {
    hasSeen: () => Boolean(readIntroFlag(INTRO_SEEN_KEY)),
    open({ replay = false } = {}) {
      if (active) return;
      active = true;
      const theme = isDark() ? 'dark' : 'light';
      const base = `${import.meta.env.BASE_URL}intro/`;
      const previousFocus = document.activeElement;
      const previousOverflow = document.body.style.overflow;
      const scroll = { x: window.scrollX, y: window.scrollY };
      const dialog = document.createElement('dialog');
      dialog.tabIndex = -1;
      dialog.className = `intro-dialog intro-${theme}`;
      dialog.setAttribute('aria-label', '내맘대로 알고리즘 인트로');
      dialog.setAttribute('aria-describedby', 'introDescription');
      dialog.innerHTML = `
        <p id="introDescription" class="intro-sr-only">나의 관심이 나의 기준. 소개 영상의 관심도는 예시이며 실제 설정에 적용되지 않습니다. Tab 키로 건너뛰기 버튼을 선택할 수 있습니다.</p>
        <div class="intro-stage">
          <div class="intro-brand-fallback"><h1>내맘대로 알고리즘</h1><p>나의 관심이 나의 기준</p></div>
          <img class="intro-poster" alt="내맘대로 알고리즘. 나의 관심이 나의 기준. 관심도 조절 예시." />
          <video class="intro-video" muted playsinline preload="none" disablepictureinpicture disableremoteplayback aria-hidden="true" tabindex="-1"></video>
          <button type="button" class="intro-start" hidden>${replay ? '돌아가기 →' : '내 알고리즘 만들기 →'}</button>
        </div>
        <button type="button" class="intro-skip" aria-label="인트로 건너뛰기">건너뛰기 ›</button>
        <span class="intro-sr-only intro-status" role="status" aria-live="polite"></span>`;
      const video = dialog.querySelector('video');
      const poster = dialog.querySelector('img');
      const skip = dialog.querySelector('.intro-skip');
      const start = dialog.querySelector('.intro-start');
      const status = dialog.querySelector('.intro-status');
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      let finished = false;
      let closed = false;
      let hideTimer;
      let watchdog;
      let hovered = false;
      let keyboardFocus = false;
      let lastTime = 0;
      let lastProgress = performance.now();
      const events = new AbortController();
      const listen = (target, name, callback) => target.addEventListener(name, callback, { signal: events.signal });
      function scheduleHide() {
        clearTimeout(hideTimer);
        if (finished || hovered || keyboardFocus) return;
        hideTimer = setTimeout(() => skip.classList.remove('is-visible'), 1800);
      }
      function revealSkip() {
        if (finished) return;
        skip.classList.add('is-visible');
        scheduleHide();
      }
      function showBrand() {
        if (closed || finished) return;
        finished = true;
        clearTimeout(hideTimer);
        clearInterval(watchdog);
        // The approved poster is already decoded underneath; never reset the video.
        video.pause();
        dialog.classList.add('is-finished');
        start.hidden = false;
        skip.hidden = true;
        status.textContent = replay ? '소개가 끝났습니다. 돌아가기 버튼을 눌러 주세요.' : '내 알고리즘 만들기 버튼을 눌러 시작하세요.';
        start.focus({ preventScroll: true });
      }
      function close() {
        if (closed) return;
        closed = true;
        active = false;
        clearTimeout(hideTimer);
        clearInterval(watchdog);
        events.abort();
        video.pause();
        dialog.close();
        dialog.remove();
        video.removeAttribute('src');
        video.load();
        document.body.style.overflow = previousOverflow;
        window.scrollTo(scroll.x, scroll.y);
        if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
        if (!replay) onFirstVisitFinished();
      }
      poster.src = `${base}poster-${theme}.png`;
      listen(poster, 'error', () => { poster.hidden = true; });
      listen(skip, 'click', (event) => { event.stopPropagation(); close(); });
      listen(start, 'click', (event) => { event.stopPropagation(); close(); });
      listen(dialog, 'cancel', (event) => { event.preventDefault(); close(); });
      listen(dialog, 'pointerdown', revealSkip);
      listen(dialog, 'pointermove', (event) => { if (event.pointerType === 'mouse') revealSkip(); });
      listen(skip, 'pointerenter', () => { hovered = true; clearTimeout(hideTimer); });
      listen(skip, 'pointerleave', () => { hovered = false; scheduleHide(); });
      listen(skip, 'focus', () => {
        keyboardFocus = skip.matches(':focus-visible');
        if (keyboardFocus) revealSkip();
      });
      listen(skip, 'blur', () => { keyboardFocus = false; scheduleHide(); });
      listen(dialog, 'keydown', (event) => {
        if (event.key === 'Tab' && !finished) {
          keyboardFocus = true;
          revealSkip();
        }
      });
      listen(video, 'ended', showBrand);
      listen(video, 'error', showBrand);
      listen(video, 'playing', () => { if (!finished) dialog.classList.add('is-playing'); });
      listen(motion, 'change', () => { if (motion.matches) showBrand(); });
      document.body.append(dialog);
      dialog.showModal(); // Native modal isolates the background and contains keyboard focus.
      document.body.style.overflow = 'hidden';
      // Keep the initial skip visually hidden; autofocus belongs to the dialog, not the button.
      dialog.focus({ preventScroll: true });
      keyboardFocus = false;
      skip.classList.remove('is-visible');
      // Record exposure now so an interrupted visit does not force another 16 seconds.
      try { localStorage.setItem(INTRO_SEEN_KEY, 'true'); } catch { /* Storage may be disabled. */ }
      if (motion.matches) {
        showBrand(); // No MP4 source is assigned or downloaded for reduced motion.
      } else {
        video.muted = true;
        video.src = `${base}intro-v4-4-${theme}.mp4`;
        video.preload = 'auto';
        watchdog = setInterval(() => {
          if (document.hidden || video.currentTime > lastTime) {
            lastProgress = performance.now();
            lastTime = video.currentTime;
          } else if (performance.now() - lastProgress > 12000) showBrand();
        }, 1000);
        video.play()?.catch(showBrand);
      }
    }
  };
}
