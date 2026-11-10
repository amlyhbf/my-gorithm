/* A living ink gradient: the four interest weights softly mix inside the headline.
   No app state, stored preferences, or feed logic is changed by this enhancement. */
(() => {
  const init = () => {
    const title = document.querySelector('.onboarding-title');
    const sliders = document.getElementById('onboardingSlidersList');
    const overlay = document.getElementById('onboardingOverlay');
    if (!title || !sliders || !overlay) return;
    const modal = overlay.querySelector('.onboarding-modal');
    const buttonPalette = [[79,70,229], [2,132,199], [190,24,93], [5,150,105]].map(c=>c.map(v=>v*.76));
    let point={x:.5,y:.55}, pointTarget={...point}, dragging=false, dragRect=null, activePointer=null;
    const cats = ['study', 'tech', 'culture', 'hobby'];
    const palettes = {
      light: [[79,70,229], [2,132,199], [190,24,93], [5,150,105]],
      dark: [[165,180,252], [125,211,252], [249,168,212], [110,231,183]]
    };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let current = [0.25,0.25,0.25,0.25], target = [...current];
    let frame = 0, lastTime = 0, energy = 0, sweep = 0;
    let dark = document.body.classList.contains('dark-mode');
    const isOpen = () => !overlay.classList.contains('hidden');
    const paint = () => {
      const palette = palettes[dark ? 'dark' : 'light'];
      const neutral = dark ? [148,163,184] : [100,116,139];
      let center = 0;
      const centers = current.map(w => { const c = center+w/2; center += w; return c; });
      const stops = [], buttonStops=[];
      for (let n=0; n<=16; n++) {
        const x = n/16;
        let sum=0, rgb=[0,0,0], buttonRgb=[0,0,0];
        current.forEach((w,i) => {
          const influence=w*Math.exp(-Math.pow((x-centers[i])/0.23,2));
          sum+=influence;rgb=rgb.map((v,c)=>v+palette[i][c]*influence);
          buttonRgb=buttonRgb.map((v,c)=>v+buttonPalette[i][c]*influence);
        });
        rgb=rgb.map((v,c)=>sum>0.00001?v/sum:neutral[c]);
        buttonRgb=buttonRgb.map((v,c)=>sum>0.00001?v/sum:[51,65,85][c]);
        // A restrained satin glint only while tuning, then a completely still finish.
        const shine = reduce.matches ? 0 : 0.045*energy*Math.exp(-Math.pow((x-sweep)/0.18,2));
        rgb=rgb.map(v=>Math.round(v+(255-v)*shine));
        buttonRgb=buttonRgb.map(v=>Math.round(v+(255-v)*shine));
        stops.push(`rgb(${rgb.join(',')}) ${n*6.25}%`);
        buttonStops.push(`rgb(${buttonRgb.join(',')}) ${n*6.25}%`);
      }
      title.style.setProperty('--interest-ink',`linear-gradient(105deg, ${stops.join(',')})`);
      modal.style.setProperty('--interest-button-ink',`linear-gradient(105deg, ${buttonStops.join(',')})`);
      const total=current.reduce((a,b)=>a+b,0);
      const ambient=[0,1,2].map(c=>Math.round(total>0.001?current.reduce((sum,w,i)=>sum+w*palette[i][c],0)/total:neutral[c]));
      const secondary=palette[(current.indexOf(Math.max(...current))+2)%4];
      modal.style.setProperty('--ambient-rgb',ambient.join(','));
      modal.style.setProperty('--ambient-secondary-rgb',secondary.join(','));
      modal.style.setProperty('--ambient-alpha',((dark ? 0.045 : 0.035)+energy*(dark ? 0.065 : 0.07)).toFixed(4));
      modal.style.setProperty('--ambient-secondary-alpha',(.02+energy*.025).toFixed(4));
      modal.style.setProperty('--ambient-x',(point.x*100).toFixed(2)+'%');
      modal.style.setProperty('--ambient-y',(point.y*100).toFixed(2)+'%');
      title.dataset.interestMix = current.map(n=>n.toFixed(3)).join(',');
      title.classList.add('has-interest-ink');
    };
    const step = time => {
      frame=0;
      if (!isOpen()) { lastTime=0; return; }
      const dt = lastTime ? Math.min(64,time-lastTime) : 16;
      lastTime=time;
      const blend=reduce.matches?1:1-Math.exp(-dt/130);
      current=current.map((v,i)=>v+(target[i]-v)*blend);
      energy=reduce.matches?0:energy*Math.exp(-dt/260);
      sweep=Math.min(1.2,sweep+dt/600);
      const move=reduce.matches?1:1-Math.exp(-dt/180);
      point.x+=(pointTarget.x-point.x)*move;point.y+=(pointTarget.y-point.y)*move;
      const done=current.every((v,i)=>Math.abs(v-target[i])<0.0003)&&energy<0.005&&Math.abs(point.x-pointTarget.x)<.0005&&Math.abs(point.y-pointTarget.y)<.0005;
      if(done){current=[...target];point={...pointTarget};energy=0;lastTime=0;}
      paint();
      if(!done)frame=requestAnimationFrame(step);
    };
    const read = (animate=false) => {
      const fields=cats.map(cat=>sliders.querySelector(`input[data-cat="${cat}"]`));
      if(fields.some(f=>!f))return;
      const values=fields.map(f=>Math.max(0,Number(f.value)||0));
      const sum=values.reduce((a,b)=>a+b,0);
      const next=values.map(v=>sum?v/sum:0);
      const changed=next.some((v,i)=>Math.abs(v-target[i])>0.00001);
      target=next;
      if(!isOpen())return;
      if(reduce.matches || !animate){current=[...target];point={...pointTarget};energy=0;paint();return;}
      if(changed){energy=1;if(sweep>=1.2)sweep=-0.15;}
      if(!frame)frame=requestAnimationFrame(step);
    };
    const follow = event => {
      if(reduce.matches || !dragRect)return;
      pointTarget={x:Math.max(0,Math.min(1,(event.clientX-dragRect.left)/dragRect.width)),y:Math.max(0,Math.min(1,(event.clientY-dragRect.top)/dragRect.height))};
      energy=1;
      if(!frame)frame=requestAnimationFrame(step);
    };
    sliders.addEventListener('pointerdown',event=>{
      if(!event.target.matches('.onboarding-range-input'))return;
      dragging=true;activePointer=event.pointerId;dragRect=modal.getBoundingClientRect();follow(event);
    },{passive:true});
    sliders.addEventListener('pointermove',event=>{if(dragging&&event.pointerId===activePointer)follow(event);},{passive:true});
    const release=event=>{if(event.pointerId===activePointer){dragging=false;activePointer=null;dragRect=null;}};
    window.addEventListener('pointerup',release,{passive:true});
    window.addEventListener('pointercancel',release,{passive:true});
    sliders.addEventListener('input',event=>{
      if(!dragging){
        const index=cats.indexOf(event.target.dataset.cat);
        pointTarget={x:.18+Math.max(0,index)*.21,y:.7};
      }
      read(true);
    });
    // Presets replace the input nodes. Observe only child additions/removals,
    // not our own gradient styles, so there is no animation observer loop.
    new MutationObserver(()=>read(true)).observe(sliders,{childList:true,subtree:true});
    new MutationObserver(()=>{if(isOpen())read(false);else {dragging=false;activePointer=null;dragRect=null;if(frame){cancelAnimationFrame(frame);frame=0;lastTime=0;}}}).observe(overlay,{attributes:true,attributeFilter:['class']});
    new MutationObserver(()=>{dark=document.body.classList.contains('dark-mode');if(isOpen())paint();}).observe(document.body,{attributes:true,attributeFilter:['class']});
    reduce.addEventListener('change',()=>read(false));
    read(false);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
