/* Source and image credits for curated articles. All supplied labels use textContent. */
window.renderEditorialDetails = article => {
  document.getElementById('articleLanguageNote')?.remove();
  if(document.documentElement.lang==='en' && article.fullEditorial){
    const note=document.createElement('p');note.id='articleLanguageNote';note.className='article-language-note';
    note.textContent='The full article is currently available in Korean.';
    document.getElementById('articleFullContent')?.before(note);
  }
  const hero=document.getElementById('articleHeroImg');
  if(hero){
    hero.alt=article.imageAlt||article.title;
    hero.style.objectPosition=article.imagePosition||'50% 50%';
    hero.dataset.fit=article.imageFit||'cover';
    const wrap=hero.closest('.article-hero-wrap');
    wrap.dataset.subjectImage=String(article.imageFit==='contain');
    wrap.style.setProperty('--subject-background',article.imageBackground||'var(--bg-subtle)');
    hero.onerror=()=>{hero.onerror=null;hero.src='/images/article-placeholder.svg';hero.alt='대표 이미지를 불러오지 못했습니다';};
  }
  document.getElementById('articleImageCredit')?.remove();
  if(hero&&article.imageCredit){
    const credit=article.imageCredit;
    const figure=document.createElement('div');figure.id='articleImageCredit';figure.className='article-image-credit';
    const caption=document.createElement('p');caption.textContent=credit.caption;figure.append(caption);
    const source=document.createElement('a');source.href=credit.url;source.target='_blank';source.rel='noopener noreferrer';source.textContent=credit.author;figure.append(source,document.createTextNode(' · '));
    const license=document.createElement('a');license.href=credit.licenseUrl;license.target='_blank';license.rel='noopener noreferrer';license.textContent=credit.license;figure.append(license);
    hero.closest('.article-hero-wrap').after(figure);
  }
  const body=document.getElementById('articleFullContent');
  if(body&&article.sources?.length){
    const box=document.createElement('section');box.className='article-reference-list';
    const en=document.documentElement.lang==='en';
    const heading=document.createElement('h3');heading.textContent=en?'References':'참고 자료';box.append(heading);
    const note=document.createElement('p');note.textContent=en?'This explanation is based on the sources below.':'아래 자료를 바탕으로 정리한 맘고리즘 해설입니다.';box.append(note);
    const list=document.createElement('ul');
    for(const entry of article.sources){const item=document.createElement('li'),anchor=document.createElement('a');anchor.href=entry.url;anchor.textContent=entry.title;anchor.target='_blank';anchor.rel='noopener noreferrer';item.append(anchor);list.append(item);}
    box.append(list);body.append(box);
  }
};
