<script>
  import Header from './Header.svelte';
  import Stats from './Stats.svelte';
  import ResumeSection from './ResumeSection.svelte';
  import ChristmasLights from './ChristmasLights.svelte';
  import data from './data.json';

  const profile = {
    name: data.name,
    title: data.title,
    location: data.location,
    linkedin: data.linkedin || '',
    cvLink: data.cvLink || '',
    photoSrc: './images/tommy-portrait.jpg',
    photoAlt: data.name,
    statement: data.statement
  };

  const stats = data.stats;
  const emHighlights = data.emHighlights || [];
  const sarHighlights = data.sarHighlights || [];
  const educationHighlights = data.educationHighlights;
  const publicServiceHighlights = data.publicServiceHighlights;
  const coreSkills = data.coreSkills || [];
  const coreSkillCategories = data.coreSkillCategories || [];
  const affiliations = data.affiliations;
  const strava = data.strava || '';
  const publications = data.publications || [];
  const awards = data.awards || [];
  const workExperience = data.workExperience || [];
  const educationDegreesList = data.educationDegreesList || [];
  const executiveEducation = data.executiveEducation || [];
  const teachingInstitutions = data.teachingInstitutions || [];
  const teachingPhotos = data.teachingPhotos || [];
  const runningStartPhotos = data.runningStartPhotos || [];
  const runningPhotos = data.runningPhotos || [];
  const cseppExplainer = data.cseppExplainer || null;
  const highSchool = data.highSchool || null;
  const additionalWorkHistory = data.additionalWorkHistory || [];

  let cseppOpen = false;
  function toggleCsepp() { cseppOpen = !cseppOpen; }

  let institutionsOpen = false;
  function toggleInstitutions() { institutionsOpen = !institutionsOpen; }

  let wcsarOpen = false;
  function toggleWcsar() { wcsarOpen = !wcsarOpen; }

  let additionalWorkOpen = false;
  function toggleAdditionalWork() { additionalWorkOpen = !additionalWorkOpen; }

  // Use local calendar dates (not UTC) so the count rolls over at local midnight
  const streakStart = new Date(2018, 9, 15); // Oct 15, 2018 in local time (months are 0-indexed)
  const _now = new Date();
  const todayLocal = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate());
  const dayStreak = Math.floor((todayLocal - streakStart) / (1000 * 60 * 60 * 24));

  const photos = [
    { src: './images/05-sar-portrait-orange-field.jpg', alt: 'Tommy Adams in orange SAR Arc\'teryx jacket', caption: 'Wolfe County SAR' },
    { src: './images/13-sar-highline-valley.jpg', alt: 'Tommy Adams smiling in helmet at highline over valley', caption: 'Highline Rigging — Red River Gorge' },
  ];

  let lightboxSrc = '';
  let lightboxAlt = '';
  let lightboxItems = [];
  let lightboxIndex = -1;

  $: teachingGallery = teachingPhotos.map((photo) => ({
    src: './images/' + encodeURIComponent(photo.file),
    alt: photo.alt || 'Teaching'
  }));

  $: runningGallery = runningPhotos.map((photo) => ({
    src: './images/' + encodeURIComponent(photo.file),
    alt: photo.alt
  }));

  $: runningStartGallery = runningStartPhotos.map((photo) => ({
    src: './images/' + encodeURIComponent(photo.file),
    alt: photo.alt || 'A Running Start'
  }));

  $: sarGallery = (() => {
    const items = [];
    if (data.sarTeamPhoto) items.push({ src: './images/' + data.sarTeamPhoto, alt: data.sarTeamPhotoAlt || 'WCSAR Water Rescue' });
    items.push({ src: './images/SAR-IMAGE-1B.jpg', alt: 'Wolfe County SAR' });
    if (data.wolfeCountySarPhoto) items.push({ src: './images/' + data.wolfeCountySarPhoto, alt: data.wolfeCountySarPhotoAlt || 'Wolfe County SAR' });
    items.push({ src: './images/14-sar-team-rock-climb.jpg', alt: 'WCSAR team members on sandstone cliff during rescue training' });
    items.push({ src: './images/SAR-IMAGE-1A.jpg', alt: 'Wolfe County SAR' });
    items.push({ src: './images/15-sar-cliff-rope-rescue.jpg', alt: 'Wolfe County SAR technical rope rescue on vertical sandstone cliff' });
    return items;
  })();

  function openLightbox(src, alt) {
    lightboxItems = [];
    lightboxIndex = -1;
    lightboxSrc = src;
    lightboxAlt = alt;
  }

  function openGallery(items, index) {
    if (!items?.length || index < 0 || index >= items.length) return;
    lightboxItems = items;
    lightboxIndex = index;
    lightboxSrc = items[index].src;
    lightboxAlt = items[index].alt;
  }

  function navigateLightbox(direction) {
    if (lightboxItems.length < 2 || lightboxIndex < 0) return;
    const nextIndex = (lightboxIndex + direction + lightboxItems.length) % lightboxItems.length;
    lightboxIndex = nextIndex;
    lightboxSrc = lightboxItems[nextIndex].src;
    lightboxAlt = lightboxItems[nextIndex].alt;
  }

  function closeLightbox() {
    lightboxSrc = '';
    lightboxAlt = '';
    lightboxItems = [];
    lightboxIndex = -1;
  }

  function handleLightboxKey(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  }

  let touchStartX = null;

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 40) return;
    navigateLightbox(delta < 0 ? 1 : -1);
  }

  function paragraphs(text) {
    return text.split('\n\n');
  }

  // ── EASTER EGG ─────────────────────────────────────────
  let easterEggMode = false;
  let showActivationOverlay = false;
  let bgAudio = null;

  // Toggle body class reactively
  $: if (typeof document !== 'undefined') {
    document.body.classList.toggle('upside-down', easterEggMode);
  }

  function activateEasterEgg() {
    if (easterEggMode) return;
    // Audio must be created & played synchronously inside the gesture handler for iOS Safari
    try {
      bgAudio = new Audio('./audio/stranger-things.mp3');
      bgAudio.loop = true;
      bgAudio.volume = 0;
      bgAudio.play().catch(() => {});
      // Fade in over 2s
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol = Math.min(vol + 0.04, 0.85);
        if (bgAudio) bgAudio.volume = vol;
        if (vol >= 0.85) clearInterval(fadeIn);
      }, 80);
    } catch (e) {}
    showActivationOverlay = true;
    setTimeout(() => { easterEggMode = true; }, 600);
    setTimeout(() => { showActivationOverlay = false; }, 3200);
  }

  function deactivateEasterEgg() {
    easterEggMode = false;
    if (bgAudio) {
      // Fade out then stop
      const audio = bgAudio;
      const fadeOut = setInterval(() => {
        audio.volume = Math.max(audio.volume - 0.06, 0);
        if (audio.volume <= 0) { clearInterval(fadeOut); audio.pause(); audio.currentTime = 0; }
      }, 50);
      bgAudio = null;
    }
  }
</script>

{#if showActivationOverlay}
  <div class="ud-intro" aria-live="polite">
    <div class="ud-particles" aria-hidden="true">
      {#each Array(18) as _, i}
        <div class="ud-particle" style="left:{(i/18*100).toFixed(1)}%; animation-delay:{(i*0.17).toFixed(2)}s; animation-duration:{(3+i%4).toFixed(1)}s"></div>
      {/each}
    </div>
    <p class="ud-welcome">WELCOME TO THE</p>
    <p class="ud-title">UPSIDE DOWN</p>
    <p class="ud-sub">.... resume</p>
  </div>
{/if}

{#if easterEggMode}
  <div class="scanlines" aria-hidden="true"></div>
  <button class="return-btn" on:click={deactivateEasterEgg} aria-label="Return to normal view">
    ← Right-Side Up
  </button>
  <div class="lights-fixed" aria-hidden="true">
    <ChristmasLights />
  </div>
{/if}

<div class="container" class:ud-flipped={easterEggMode}>
  <Header
    name={profile.name}
    title={profile.title}
    location={profile.location}
    linkedin={profile.linkedin}
    cvLink={profile.cvLink}
    photoSrc={profile.photoSrc}
    photoAlt={profile.photoAlt}
    onPhotoClick={() => openLightbox(profile.photoSrc, profile.photoAlt)}
  />

  <div class="profile">
    {#each paragraphs(profile.statement) as para}
      <p>{para}</p>
    {/each}
  </div>

  <Stats {stats} />

  <nav class="roadmap" aria-label="Page sections">
    <a class="roadmap-item" href="#emergency-management">
      <span class="roadmap-icon">🚨</span>
      <span class="roadmap-label">Emergency Management</span>
    </a>
    <a class="roadmap-item" href="#teaching-communication">
      <span class="roadmap-icon">🎓</span>
      <span class="roadmap-label">Teaching</span>
    </a>
    <a class="roadmap-item" href="#school-education">
      <span class="roadmap-icon">🎓</span>
      <span class="roadmap-label">Education</span>
    </a>
    <a class="roadmap-item" href="#nonprofit-service">
      <span class="roadmap-icon">🤝</span>
      <span class="roadmap-label">Public Service</span>
    </a>
    <a class="roadmap-item" href="#work-experience">
      <span class="roadmap-icon">💼</span>
      <span class="roadmap-label">Work Experience</span>
    </a>
    <a class="roadmap-item" href="#publications">
      <span class="roadmap-icon">📚</span>
      <span class="roadmap-label">Publications</span>
    </a>
    <a class="roadmap-item" href="#awards">
      <span class="roadmap-icon">🏆</span>
      <span class="roadmap-label">Awards</span>
    </a>
    <a class="roadmap-item" href="#personal-excellence">
      <span class="roadmap-icon">🏃</span>
      <span class="roadmap-label">Personal Excellence</span>
    </a>
    <a class="roadmap-item" href="#community-service">
      <span class="roadmap-icon">🌱</span>
      <span class="roadmap-label">Community Service</span>
    </a>
    <a class="roadmap-item" href="#competencies">
      <span class="roadmap-icon">⚡</span>
      <span class="roadmap-label">Competencies</span>
    </a>
    <a class="roadmap-item" href="#affiliations">
      <span class="roadmap-icon">🏢</span>
      <span class="roadmap-label">Affiliations</span>
    </a>
  </nav>

  {#if lightboxSrc}
    <div class="lightbox" on:click={closeLightbox} on:keydown={handleLightboxKey} on:touchstart|passive={handleTouchStart} on:touchend={handleTouchEnd} role="dialog" aria-modal="true" tabindex="-1">
      {#if lightboxItems.length > 1}
        <button class="lightbox-nav lightbox-prev" on:click|stopPropagation={() => navigateLightbox(-1)} aria-label="Previous photo">‹</button>
        <button class="lightbox-nav lightbox-next" on:click|stopPropagation={() => navigateLightbox(1)} aria-label="Next photo">›</button>
      {/if}
      <button class="lightbox-close" on:click={closeLightbox} aria-label="Close">✕</button>
      <img src={lightboxSrc} alt={lightboxAlt} on:click|stopPropagation />
      {#if lightboxItems.length > 1 && lightboxIndex >= 0}
        <div class="lightbox-counter">{lightboxIndex + 1} / {lightboxItems.length}</div>
      {/if}
    </div>
  {/if}

  <div class="content">

    <ResumeSection sectionId="emergency-management" icon="🚨" title="Emergency Management / Search & Rescue">
      <div class="photo-mosaic">
        {#each photos as photo, i}
          <div class="photo-cell" on:click={() => openGallery(photos, i)} role="button" tabindex="0" on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && openGallery(photos, i)}>
            <img src={photo.src} alt={photo.alt} loading="lazy" style={photo.objectPosition ? `object-position: ${photo.objectPosition}` : ''} />
            <div class="photo-caption">{photo.caption}</div>
          </div>
        {/each}
      </div>

      <p>{paragraphs(data.emergencyContent)[0]}</p>

      {#if emHighlights.length > 0}
        <ul class="em-bullets">
          {#each emHighlights as item}
            <li>{item}</li>
          {/each}
        </ul>
      {/if}

      {#if cseppExplainer}
        <div class="csepp-dropdown">
          <button class="csepp-toggle" on:click={toggleCsepp} aria-expanded={cseppOpen}>
            <span class="csepp-toggle-label">{cseppExplainer.title}</span>
            <span class="csepp-chevron" class:open={cseppOpen}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>
          {#if cseppOpen}
            <div class="csepp-content">
              <p>{cseppExplainer.overview}</p>
              <h4>Program Overview</h4>
              <p>{cseppExplainer.programOverview}</p>
              <h4>Key Accomplishments</h4>
              <ul>
                {#each cseppExplainer.accomplishments as item}
                  <li>{item}</li>
                {/each}
              </ul>
              <p class="csepp-personal">{cseppExplainer.personalNote}</p>

              {#if cseppExplainer.kentuckyImpactIntro}
                <h4>What This Meant for Kentucky Communities</h4>
                <p>{cseppExplainer.kentuckyImpactIntro}</p>
                {#if cseppExplainer.kentuckyBenefits}
                  <ul>
                    {#each cseppExplainer.kentuckyBenefits as benefit}
                      <li>{benefit}</li>
                    {/each}
                  </ul>
                {/if}
              {/if}

              {#if cseppExplainer.affectedCountiesIntro}
                <h4>Affected Counties</h4>
                <p>{cseppExplainer.affectedCountiesIntro}</p>
                {#if cseppExplainer.affectedCounties}
                  <div class="csepp-county-table">
                    <div class="csepp-county-header">
                      <span>County</span><span>Zone</span>
                    </div>
                    {#each cseppExplainer.affectedCounties as row}
                      <div class="csepp-county-row">
                        <span>{row.county}</span><span>{row.zone}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
              {/if}

              {#if cseppExplainer.transitionNote}
                <h4>Transition & Future</h4>
                <p>{cseppExplainer.transitionNote}</p>
              {/if}

              {#if cseppExplainer.partnershipNote}
                <p class="csepp-partnership">{cseppExplainer.partnershipNote}</p>
              {/if}

              {#if cseppExplainer.newsReference}
                <div class="csepp-news-ref">
                  <span>{cseppExplainer.newsReference.intro} </span>
                  <a href={cseppExplainer.newsReference.url} target="_blank" rel="noopener noreferrer">{cseppExplainer.newsReference.label}</a>
                </div>
              {/if}

              {#if cseppExplainer.pdfDocuments && cseppExplainer.pdfDocuments.length}
                <div class="csepp-pdf-docs">
                  <h4>Program Documents</h4>
                  {#each cseppExplainer.pdfDocuments as doc}
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" class="csepp-pdf-link">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                      {doc.label}
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/if}

      <p>{paragraphs(data.emergencyContent)[1]}</p>

      {#if sarHighlights.length > 0}
        <ul class="em-bullets">
          {#each sarHighlights as item}
            <li>{item}</li>
          {/each}
        </ul>
      {/if}

      {#if data.wcsarExplainer}
        <div class="csepp-dropdown" style="margin-top: 12px;">
          <button class="csepp-toggle" on:click={toggleWcsar} aria-expanded={wcsarOpen}>
            <span class="csepp-toggle-label">{data.wcsarExplainer.title}</span>
            <span class="csepp-chevron" class:open={wcsarOpen}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>
          {#if wcsarOpen}
            <div class="csepp-content">
              <p class="csepp-personal" style="font-style: italic; font-size: 1.05em;">{data.wcsarExplainer.mission}</p>
              <p>{data.wcsarExplainer.overview}</p>
              <p>{data.wcsarExplainer.operations}</p>
              <h4>Notable Rescue</h4>
              <p>{data.wcsarExplainer.notableRescue}</p>
              <div class="csepp-news-ref" style="margin-top: 12px;">
                <a href={data.wcsarExplainer.websiteUrl} target="_blank" rel="noopener noreferrer">{data.wcsarExplainer.websiteLabel}</a>
              </div>
              <div style="margin-top: 16px;">
                <img src="./images/SAR-IMAGE-1C.jpg" alt="Wolfe County SAR" loading="lazy" style="width: 100%; border-radius: 6px;" />
              </div>
            </div>
          {/if}
        </div>
      {/if}

      <div class="thumb-row">
        {#if data.sarTeamPhoto}
          <div class="thumb-cell" on:click={() => openGallery(sarGallery, sarGallery.findIndex(x => x.src === './images/' + data.sarTeamPhoto))} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openGallery(sarGallery, sarGallery.findIndex(x => x.src === './images/' + data.sarTeamPhoto))}>
            <img src="./images/{data.sarTeamPhoto}" alt={data.sarTeamPhotoAlt || 'WCSAR Water Rescue'} loading="lazy" style="object-position: center 30%" />
            <div class="thumb-caption">{data.sarTeamPhotoAlt || 'WCSAR Water Rescue'}</div>
          </div>
        {/if}
        <div class="thumb-cell" on:click={() => openGallery(sarGallery, sarGallery.findIndex(x => x.src === './images/SAR-IMAGE-1B.jpg'))} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openGallery(sarGallery, sarGallery.findIndex(x => x.src === './images/SAR-IMAGE-1B.jpg'))}>
          <img src="./images/SAR-IMAGE-1B.jpg" alt="Wolfe County SAR" loading="lazy" />
          <div class="thumb-caption">Wolfe County SAR</div>
        </div>
        {#if data.wolfeCountySarPhoto}
          <div class="thumb-cell" on:click={() => openGallery(sarGallery, sarGallery.findIndex(x => x.src === './images/' + data.wolfeCountySarPhoto))} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openGallery(sarGallery, sarGallery.findIndex(x => x.src === './images/' + data.wolfeCountySarPhoto))}>
            <img src="./images/{data.wolfeCountySarPhoto}" alt={data.wolfeCountySarPhotoAlt || 'Wolfe County SAR'} loading="lazy" />
            <div class="thumb-caption">{data.wolfeCountySarPhotoAlt || 'Wolfe County SAR'}</div>
          </div>
        {/if}
      </div>

      <div class="thumb-row">
        <div class="thumb-cell" on:click={() => openGallery(sarGallery, sarGallery.findIndex(x => x.src === './images/14-sar-team-rock-climb.jpg'))} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openGallery(sarGallery, sarGallery.findIndex(x => x.src === './images/14-sar-team-rock-climb.jpg'))}>
          <img src="./images/14-sar-team-rock-climb.jpg" alt="WCSAR team members on sandstone cliff during rescue training" loading="lazy" />
          <div class="thumb-caption">Cliff Rescue Operations</div>
        </div>
        <div class="thumb-cell" on:click={() => openGallery(sarGallery, sarGallery.findIndex(x => x.src === './images/SAR-IMAGE-1A.jpg'))} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openGallery(sarGallery, sarGallery.findIndex(x => x.src === './images/SAR-IMAGE-1A.jpg'))}>
          <img src="./images/SAR-IMAGE-1A.jpg" alt="Wolfe County SAR" loading="lazy" />
          <div class="thumb-caption">Wolfe County SAR</div>
        </div>
        <div class="thumb-cell" on:click={() => openGallery(sarGallery, sarGallery.findIndex(x => x.src === './images/15-sar-cliff-rope-rescue.jpg'))} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openGallery(sarGallery, sarGallery.findIndex(x => x.src === './images/15-sar-cliff-rope-rescue.jpg'))}>
          <img src="./images/15-sar-cliff-rope-rescue.jpg" alt="Wolfe County SAR technical rope rescue on vertical sandstone cliff" loading="lazy" />
          <div class="thumb-caption">Technical Rope Rescue — Red River Gorge</div>
        </div>
      </div>
    </ResumeSection>

    <div class="sar-banner" on:click={() => openLightbox('./images/07-sar-cliff-edge-fog.jpg', 'Tommy Adams at cliff edge overlooking fog-filled valley during SAR operation')} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openLightbox('./images/07-sar-cliff-edge-fog.jpg', 'Tommy Adams at cliff edge overlooking fog-filled valley during SAR operation')}>
      <img src="./images/07-sar-cliff-edge-fog.jpg" alt="Tommy Adams at cliff edge overlooking fog-filled valley during SAR operation" loading="lazy" />
      <div class="sar-banner-caption">Cliff rescue operations — Red River Gorge area</div>
    </div>

    <ResumeSection sectionId="teaching-communication" icon="🎓" title="Teaching & Communication">
      <div class="classroom-banner" on:click={() => openLightbox('./images/10-classroom-professor.png', 'Tommy Adams in the classroom')} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openLightbox('./images/10-classroom-professor.png', 'Tommy Adams in the classroom')}>
        <img src="./images/10-classroom-professor.png" alt="Tommy Adams in the classroom" loading="lazy" />
        <div class="classroom-banner-caption">17 years shaping communicators</div>
      </div>
      {#each paragraphs(data.educationContent) as para}
        <p>{@html para}</p>
      {/each}
      {#if teachingInstitutions.length > 0}
        <div class="csepp-dropdown">
          <button class="csepp-toggle" on:click={toggleInstitutions} aria-expanded={institutionsOpen}>
            <span class="csepp-toggle-label">Institutions Where I Taught</span>
            <span class="csepp-chevron" class:open={institutionsOpen}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>
          {#if institutionsOpen}
            <div class="csepp-content">
              <div class="teaching-grid">
                {#each teachingInstitutions as inst}
                  <div class="teaching-card">{inst}</div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {/if}
      {#if educationHighlights.length > 0}
        <ul class="teaching-highlights">
          {#each educationHighlights as item}
            <li>{item}</li>
          {/each}
        </ul>
      {/if}
      {#if teachingPhotos.length > 0}
        <div class="thumb-row teaching-thumb-row">
          {#each teachingPhotos as photo, i}
            <div class="thumb-cell" class:teaching-wide={i >= teachingPhotos.length - 2} on:click={() => openGallery(teachingGallery, i)} role="button" tabindex="0" on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && openGallery(teachingGallery, i)}>
              <img src="./images/{encodeURIComponent(photo.file)}" alt={photo.alt || 'Teaching'} loading="lazy" />
            </div>
          {/each}
        </div>
      {/if}
      <div class="classroom-banner" on:click={() => openLightbox('./images/tommy-with-class.jpg', 'Tommy Adams with students')} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openLightbox('./images/tommy-with-class.jpg', 'Tommy Adams with students')}>
        <img src="./images/tommy-with-class.jpg" alt="Tommy Adams with students" loading="lazy" />
      </div>
    </ResumeSection>

    <ResumeSection sectionId="school-education" icon="🎓" title="School / Education">
      <div class="school-ed-list">
        {#each executiveEducation as ed}
          <div class="exec-ed-card" class:upcoming={ed.status === 'upcoming'}>
            {#if ed.status === 'upcoming'}
              <span class="exec-ed-badge upcoming-badge">Upcoming</span>
            {/if}
            <div class="exec-ed-top">
              <span class="exec-ed-program">{ed.program}</span>
              {#if ed.status !== 'upcoming'}
                <span class="exec-ed-year">{ed.year}</span>
              {/if}
            </div>
            <div class="exec-ed-inst">{ed.institution}{ed.status === 'upcoming' ? ` — ${ed.year}` : ''}</div>
            {#if ed.location}
              <div class="exec-ed-location">{ed.location}</div>
            {/if}
            {#if ed.photo}
              <div class="exec-ed-photo-wrap" on:click={() => openLightbox('./images/' + ed.photo, ed.photoAlt || ed.program)} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && openLightbox('./images/' + ed.photo, ed.photoAlt || ed.program)}>
                <img class="exec-ed-photo" src="./images/{ed.photo}" alt={ed.photoAlt || ed.program} loading="lazy" />
              </div>
            {/if}
          </div>
        {/each}

        {#if educationDegreesList.length > 0}
          <div class="ed-section-label">Academic Degrees</div>
          <div class="degrees-grid">
            {#each educationDegreesList as d}
              <div class="degree-card">
                <span class="degree-label">{d.degree}</span>
                <span class="degree-field">{d.field}</span>
                <span class="degree-inst">{d.institution}</span>
              </div>
            {/each}
          </div>
        {/if}

        {#if highSchool}
          <div class="degree-card-hs">
            <span class="degree-label">{highSchool.credential}</span>
            <span class="degree-field-hs">{highSchool.note}</span>
            <span class="degree-inst-hs">{highSchool.name}</span>
          </div>
        {/if}
      </div>
    </ResumeSection>

    <ResumeSection sectionId="nonprofit-service" icon="🤝" title="Nonprofit & Public Service Leadership" highlights={publicServiceHighlights}>
      {#each paragraphs(data.publicServiceContent) as para}
        <p>{para}</p>
      {/each}
    </ResumeSection>

    <ResumeSection sectionId="work-experience" icon="💼" title="Work Experience">
      {#each workExperience as job}
        <div class="job">
          <div class="job-header">
            <div class="job-title-wrap">
              <span class="job-title">{job.title}</span>
              <span class="job-org">{job.org}</span>
            </div>
            <span class="job-dates">{job.dates}</span>
          </div>
          <ul class="job-bullets">
            {#each job.bullets as bullet}
              <li>{bullet}</li>
            {/each}
          </ul>
        </div>
      {/each}

      <div class="csepp-dropdown" style="margin-top: 12px;">
        <button class="csepp-toggle" on:click={toggleAdditionalWork} aria-expanded={additionalWorkOpen}>
          <span class="csepp-toggle-label">Additional Work History</span>
          <span class="csepp-chevron" class:open={additionalWorkOpen}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>
        {#if additionalWorkOpen}
          <div class="csepp-content">
            {#if additionalWorkHistory.length > 0}
              {#each additionalWorkHistory as job}
                <div class="job" style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e8e2d8;">
                  <div class="job-header">
                    <div class="job-title-wrap">
                      <span class="job-title">{job.title}</span>
                      <span class="job-org">{job.org}</span>
                    </div>
                    <span class="job-dates">{job.dates}</span>
                  </div>
                  {#if job.bullets}
                    <ul class="job-bullets">
                      {#each job.bullets as bullet}
                        <li>{bullet}</li>
                      {/each}
                    </ul>
                  {/if}
                </div>
              {/each}
            {:else}
              <p style="font-style: italic; color: #7a8a84;">Full work history available upon request.</p>
            {/if}
          </div>
        {/if}
      </div>
    </ResumeSection>

    {#if publications.length > 0}
    <ResumeSection sectionId="publications" icon="📚" title="Publications & Scholarship">
      <div class="pub-list">
        {#each publications as pub}
          <div class="pub-item">
            <div class="pub-title">
              {#if pub.book}
                {@html `"${pub.title}", a chapter in <em>${pub.book}</em>`}
              {:else if pub.italicTitle}
                <em>{pub.title}</em>
              {:else}
                "{pub.title}"
              {/if}
            </div>
            <div class="pub-meta">
              {#if pub.book}
                {pub.role} · {pub.year}
              {:else}
                {pub.role} · {pub.publisher} · {pub.year}
              {/if}
            </div>
            {#if pub.award}
              <div class="pub-award">🏆 {pub.award}</div>
            {/if}
          </div>
        {/each}
      </div>
    </ResumeSection>
    {/if}

    {#if awards.length > 0}
    <ResumeSection sectionId="awards" icon="🏆" title="Awards & Recognition">
      <ul class="awards-list">
        {#each awards as award}
          <li>{award}</li>
        {/each}
      </ul>
    </ResumeSection>
    {/if}

    <ResumeSection sectionId="personal-excellence" icon="🏃" title="Personal Excellence & Global Perspective">
      <p><strong>Running Every Single Day Since October 2018:</strong> <span class="streak-count">{dayStreak.toLocaleString()}</span> consecutive days without missing a single one. This daily commitment reflects the discipline, resilience, and iterative refinement process I bring to every aspect of my life and work. {#if strava}<a class="strava-link" href={strava} target="_blank" rel="noopener noreferrer">Follow on Strava →</a>{/if}</p>
      <p><strong>Globally-Minded Traveler:</strong> Visited 30+ countries across six continents including Italy, UK, Germany, France, China, Japan, Thailand, Australia, Brazil, New Zealand, and many others. Studied abroad in Florence, Italy and taught in Shanghai, China as Visiting Professor.</p>
      {#if runningPhotos.length > 0}
        <div class="running-banner-list">
          {#each runningPhotos as photo, i}
            <div class="running-banner-item" on:click={() => openGallery(runningGallery, i)} role="button" tabindex="0" on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && openGallery(runningGallery, i)}>
              <img src="./images/{encodeURIComponent(photo.file)}" alt={photo.alt} loading="lazy" />
              {#if photo.caption}
                <div class="running-banner-caption">{photo.caption}</div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </ResumeSection>

    <ResumeSection sectionId="community-service" icon="🌱" title="Community Service & Volunteer Work">
      <p>Active volunteer and mentor with <strong>A Running Start</strong> (2021–Present), a Lexington, KY-based nonprofit that supports men in recovery from addiction through running. The program provides structure, accountability, and community for participants — primarily men at the <strong>Hope Center</strong> and <strong>Privett Center</strong> in Lexington — who train together for 5Ks and other races. Running becomes more than exercise: it's a new coping mechanism, a daily discipline, and a pathway back to confidence and community. Coaches are often in long-term recovery themselves, and the program has supported participants in navigating early recovery, rebuilding self-worth, and reintegrating into daily life. Also a founder of campus run clubs at multiple institutions. Advisor to student organizations, judge for business pitch competitions, and extensive committee service across academic and community organizations.</p>
      <p>Member of Wolfe County Search & Rescue since 2021 — contributing not only as a field responder but as an officer, treasurer, and finance officer supporting the organizational health of the team.</p>
      {#if runningStartPhotos.length > 0}
        <div class="running-start-label">A Running Start</div>
        <div class="thumb-row">
          {#each runningStartPhotos as photo, i}
            <div class="thumb-cell" on:click={() => openGallery(runningStartGallery, i)} role="button" tabindex="0" on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && openGallery(runningStartGallery, i)}>
              <img src="./images/{encodeURIComponent(photo.file)}" alt={photo.alt || 'A Running Start'} loading="lazy" />
              {#if photo.caption}<div class="thumb-caption">{photo.caption}</div>{/if}
            </div>
          {/each}
        </div>
      {/if}
    </ResumeSection>

    <ResumeSection sectionId="competencies" icon="⚡" title="Core Competencies & Certifications" skillCategories={coreSkillCategories} skills={coreSkills} collapsible={true}>
      {#if data.certifications}
        <div class="cert-section">
          <h4>Federal Grants Management Certificate</h4>
          <p>{data.certifications.grantsManagement}</p>
        </div>
        <div class="cert-section">
          <h4>FEMA / Emergency Management Training</h4>
          <ul class="course-list">
            {#each data.certifications.femaTraining as course}
              <li><strong>{course.code}</strong> — {course.name}</li>
            {/each}
          </ul>
        </div>
        <div class="cert-section">
          <h4>Search & Rescue Certifications</h4>
          <ul class="cert-list">
            {#each data.certifications.sarCertifications as cert}
              <li>{cert}</li>
            {/each}
          </ul>
        </div>
        <div class="cert-section">
          <h4>Executive Education</h4>
          <p>{data.certifications.executiveEducation}</p>
        </div>
      {/if}
    </ResumeSection>

    <ResumeSection sectionId="affiliations" icon="🏢" title="Professional Affiliations" orgs={affiliations} collapsible={true}>
    </ResumeSection>

  </div>

  <div class="footer-photo" class:footer-upside-down={easterEggMode} on:click={activateEasterEgg} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && activateEasterEgg()} title={easterEggMode ? 'You found the Upside Down' : ''}>
    <img src="./images/08-ridge-run-sunset.jpg" alt="Tommy Adams looking off into the distance at sunset on a Kentucky ridge" loading="lazy" />
    {#if data.closingQuote}
      <div class="footer-quote" aria-hidden="true">
        <span class="footer-quote-text">"{data.closingQuote.text}"</span>
        <span class="footer-quote-attribution">{data.closingQuote.attribution}</span>
      </div>
    {/if}
    {#if easterEggMode}
      <div class="footer-found-label">// you found it //</div>
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 850px;
    margin: 0 auto;
    background: white;
    box-shadow: 0 4px 24px rgba(0,0,0,0.12);
    border-radius: 6px;
    overflow: hidden;
    transition: transform 0.9s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ud-flipped {
    transform: rotate(180deg);
  }

  .lights-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9980;
    pointer-events: none;
  }

  .profile {
    padding: 35px 40px;
    background: #faf8f5;
    border-bottom: 2px solid #4a7c6b;
  }

  .profile p {
    font-size: 1em;
    color: #2d3a35;
    text-align: left;
    line-height: 1.75;
    margin: 0 0 12px;
  }

  .profile p:last-child {
    margin-bottom: 0;
  }

  /* ── ROADMAP NAVIGATION ────────────────────────── */
  .roadmap {
    background: #1e3a2f;
    padding: 18px 28px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    border-bottom: 3px solid #4a7c6b;
  }

  .roadmap-item {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: rgba(255, 248, 235, 0.88);
    padding: 7px 14px;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.82em;
    font-weight: 600;
    letter-spacing: 0.3px;
    transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
    white-space: nowrap;
  }

  .roadmap-item:hover {
    background: rgba(255, 255, 255, 0.16);
    border-color: rgba(255, 255, 255, 0.32);
    color: #fff;
  }

  .roadmap-icon {
    font-size: 1em;
    line-height: 1;
  }

  .roadmap-label {
    line-height: 1;
  }

  @media (max-width: 600px) {
    .roadmap {
      padding: 14px 16px;
      gap: 6px;
    }
    .roadmap-item {
      font-size: 0.76em;
      padding: 6px 10px;
    }
  }

  /* Footer panoramic photo */
  .footer-photo {
    position: relative;
    overflow: hidden;
    cursor: zoom-in;
  }

  .footer-photo img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.4s ease;
  }

  .footer-photo:hover img {
    transform: scale(1.02);
  }

  .footer-quote {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 54%;
    padding: 28px 24px 20px 24px;
    background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.42) 62%, transparent 100%);
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 10px;
    box-sizing: border-box;
    overflow: hidden;
  }

  @media (max-width: 600px) {
    .footer-quote {
      top: 0;
      bottom: 0;
      width: 100%;
      padding: 0 16px 20px 16px;
      background: linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.30) 65%, transparent 100%);
      justify-content: flex-end;
      overflow: visible;
    }
    .footer-quote-text {
      font-size: 0.72rem;
      line-height: 1.35;
      flex: 0 1 auto;
      overflow: visible;
    }
    .footer-quote-attribution {
      text-align: left;
    }
  }

  .footer-quote-text {
    display: block;
    font-style: italic;
    font-size: 1.05rem;
    line-height: 1.45;
    color: rgba(255, 248, 235, 0.96);
    text-shadow: 0 1px 4px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7);
    flex: 0 1 auto;
    overflow: visible;
  }

  @media (min-width: 601px) {
    .footer-quote-text {
      font-size: 1.13rem;
      line-height: 1.44;
    }
  }

  .footer-quote-attribution {
    display: block;
    font-size: 0.78rem;
    font-style: normal;
    font-weight: 600;
    letter-spacing: 0.03em;
    color: rgba(255, 220, 160, 0.95);
    text-shadow: 0 1px 4px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7);
    text-align: right;
    padding-right: 4px;
    flex-shrink: 0;
  }

  /* Photo mosaic — 2 photos side by side */
  .photo-mosaic {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 480px;
    gap: 3px;
    background: #1e3a2f;
  }

  .photo-cell {
    overflow: hidden;
    background: #e8e2d8;
    position: relative;
    cursor: zoom-in;
  }

  .photo-cell img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }

  .photo-cell:hover img {
    transform: scale(1.04);
  }

  .photo-caption,
  .thumb-caption,
  .sar-banner-caption,
  .classroom-banner-caption,
  .running-banner-caption {
    display: none;
  }

  .photo-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.72));
    color: white;
    padding: 24px 12px 10px;
    font-size: 0.78em;
    font-style: italic;
    letter-spacing: 0.3px;
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .photo-cell:hover .photo-caption {
    opacity: 1;
    transform: translateY(0);
  }

  @media (hover: none) {
    .photo-caption { opacity: 1; transform: none; }
  }

  .content {
    padding: 40px;
  }

  /* Pass paragraph spacing into section slots */
  .content :global(p) {
    margin-bottom: 12px;
  }

  .content :global(p:last-child) {
    margin-bottom: 0;
  }

  /* SAR action banner */
  .sar-banner {
    margin-bottom: 20px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    cursor: zoom-in;
  }

  .sar-banner img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    object-position: center 30%;
    display: block;
    transition: transform 0.4s ease;
  }

  .sar-banner:hover img {
    transform: scale(1.02);
  }

  .sar-banner-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.6));
    color: white;
    padding: 28px 18px 12px;
    font-size: 0.85em;
    font-style: italic;
    letter-spacing: 0.3px;
  }


  /* Inline highlights lists (EM / SAR) */
  .em-bullets {
    list-style: none;
    margin: 12px 0 18px;
    padding: 0;
  }

  .em-bullets li {
    padding: 10px 0 10px 30px;
    position: relative;
    color: #2d3a35;
    font-size: 1em;
    line-height: 1.7;
  }

  .em-bullets li::before {
    content: "—";
    position: absolute;
    left: 0;
    color: #4a7c6b;
    font-weight: 700;
  }

  /* CSEPP dropdown */
  .csepp-dropdown {
    margin: 20px 0;
    border: 1px solid #d4cdc2;
    border-radius: 6px;
    background: #faf8f4;
    overflow: hidden;
  }

  .csepp-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 12px 16px;
    background: #f5f2ec;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.95em;
    font-weight: 600;
    color: #2d5a47;
    letter-spacing: 0.3px;
    transition: background 0.2s ease;
  }

  .csepp-toggle:hover {
    background: #ede8e0;
  }

  .csepp-chevron {
    display: flex;
    align-items: center;
    color: #4a7c6b;
    transition: transform 0.25s ease;
  }

  .csepp-chevron.open {
    transform: rotate(180deg);
  }

  .csepp-content {
    padding: 16px 20px;
    font-size: 0.92em;
    line-height: 1.7;
    color: #34403b;
  }

  .csepp-content h4 {
    font-size: 0.95em;
    font-weight: 700;
    color: #1e3a2f;
    margin: 16px 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .csepp-content p {
    margin: 0 0 10px;
  }

  .csepp-content ul {
    margin: 8px 0 12px;
    padding-left: 20px;
  }

  .csepp-content li {
    margin-bottom: 8px;
  }

  .csepp-personal {
    margin-top: 16px !important;
    padding-top: 14px;
    border-top: 1px solid #e8e2d8;
    font-style: italic;
    color: #4a5c54;
  }

  .csepp-county-table {
    margin: 10px 0 14px;
    border: 1px solid #d4cdc2;
    border-radius: 4px;
    overflow: hidden;
    font-size: 0.9em;
  }

  .csepp-county-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #e8e2d8;
    padding: 7px 12px;
    font-weight: 700;
    color: #1e3a2f;
    font-size: 0.82em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .csepp-county-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 7px 12px;
    color: #34403b;
    border-top: 1px solid #e8e2d8;
  }

  .csepp-county-row:nth-child(odd) {
    background: #f5f2ec;
  }

  .csepp-partnership {
    margin-top: 16px !important;
    padding: 12px 16px;
    background: #f0f6f3;
    border-left: 3px solid #4a7c6b;
    border-radius: 0 4px 4px 0;
    font-style: italic;
    color: #2d5a47;
    font-size: 0.93em;
    line-height: 1.7;
  }

  .csepp-news-ref {
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid #e8e2d8;
    font-size: 0.88em;
    color: #4a5c54;
  }

  .csepp-news-ref a {
    color: #2d5a47;
    font-weight: 600;
    text-decoration: underline;
  }

  .csepp-news-ref a:hover {
    color: #1e3a2f;
  }

  .csepp-pdf-docs {
    margin-top: 16px;
  }

  .csepp-pdf-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #2d6a4f;
    text-decoration: none;
    font-size: 0.875rem;
    margin-top: 8px;
    transition: color 0.2s;
  }

  .csepp-pdf-link:hover {
    color: #1e3a2f;
    text-decoration: underline;
  }

  .csepp-pdf-link svg {
    flex-shrink: 0;
  }

  /* Certifications section */
  .content :global(.cert-section) {
    margin-top: 20px;
  }

  .content :global(.cert-section:first-child) {
    margin-top: 0;
  }

  .content :global(.cert-section h4) {
    font-size: 0.82em;
    font-weight: 700;
    color: #2d5a47;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin: 0 0 10px;
  }

  .content :global(.course-list),
  .content :global(.cert-list) {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .content :global(.course-list li),
  .content :global(.cert-list li) {
    padding: 5px 0;
    font-size: 0.93em;
    color: #34403b;
    border-bottom: 1px solid #f0ede8;
    line-height: 1.5;
  }

  .content :global(.course-list li:last-child),
  .content :global(.cert-list li:last-child) {
    border-bottom: none;
  }

  .content :global(.course-list strong) {
    color: #1e3a2f;
    font-variant-numeric: tabular-nums;
    min-width: 80px;
    display: inline-block;
  }

  @media (max-width: 768px) {
    .content { padding: 25px 18px; }
    .profile { padding: 25px 18px; }
    .sar-banner img { height: 220px; }
    .teaching-grid { grid-template-columns: repeat(2, 1fr); }
    .photo-mosaic { grid-template-rows: 320px; }
  }

  @media (max-width: 400px) {
    .content { padding: 20px 15px; }
    .profile { padding: 20px 15px; }
    .photo-mosaic { grid-template-rows: 240px; }
    .sar-banner img { height: 180px; }
  }

  /* Work experience */
  .job {
    margin-bottom: 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid #e8e2d8;
  }

  .job:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 10px;
  }

  .job-title-wrap {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .job-title {
    font-weight: 700;
    color: #1e3a2f;
    font-size: 1em;
    line-height: 1.3;
  }

  .job-org {
    font-size: 0.9em;
    color: #4a7c6b;
    font-weight: 600;
  }

  .job-dates {
    font-size: 0.85em;
    color: #7a8a84;
    white-space: nowrap;
    padding-top: 2px;
  }

  .job-bullets {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .job-bullets li {
    padding: 5px 0 5px 22px;
    position: relative;
    font-size: 0.95em;
    color: #34403b;
    line-height: 1.6;
  }

  .job-bullets li::before {
    content: "•";
    position: absolute;
    left: 6px;
    color: #4a7c6b;
  }

  .ed-section-label {
    font-size: 0.72em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: #7a8a84;
    margin-top: 4px;
    margin-bottom: 8px;
  }

  .degrees-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 10px;
  }

  .degree-card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: #f0f6f3;
    border: 1px solid #c8ddd6;
    border-top: 3px solid #4a7c6b;
    padding: 14px 16px;
    border-radius: 0 0 4px 4px;
  }

  .degree-label {
    font-weight: 700;
    color: #1e3a2f;
    font-size: 0.95em;
    line-height: 1.3;
  }

  .degree-field {
    color: #34403b;
    font-size: 0.87em;
    line-height: 1.45;
    flex: 1;
  }

  .degree-inst {
    font-size: 0.82em;
    color: #4a7c6b;
    font-weight: 600;
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid #d4e8e0;
  }

  /* High school — compact inline card */
  .degree-card-hs {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #faf8f5;
    border: 1px solid #e0d9cf;
    padding: 9px 16px;
    border-radius: 4px;
    flex-wrap: wrap;
  }

  .degree-field-hs {
    color: #34403b;
    font-size: 0.9em;
    flex: 1;
  }

  .degree-inst-hs {
    font-size: 0.88em;
    color: #7a8a84;
    font-weight: 500;
  }

  /* Classroom banner */
  .classroom-banner {
    margin-bottom: 22px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    cursor: zoom-in;
  }

  .classroom-banner img {
    width: 100%;
    height: 420px;
    object-fit: cover;
    object-position: center 8%;
    display: block;
    transition: transform 0.4s ease;
  }

  .classroom-banner:hover img {
    transform: scale(1.02);
  }

  .classroom-banner-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.65));
    color: white;
    padding: 28px 18px 12px;
    font-size: 0.85em;
    font-style: italic;
    letter-spacing: 0.3px;
  }

  @media (max-width: 768px) {
    .classroom-banner img { height: auto; }
  }

  /* Teaching grid */
  .teaching-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-bottom: 28px;
  }

  .teaching-card {
    background: #f0f6f3;
    border-left: 3px solid #4a7c6b;
    padding: 10px 14px;
    font-size: 0.88em;
    font-weight: 600;
    color: #1e3a2f;
    border-radius: 0 4px 4px 0;
  }

  /* School / Education */
  .school-ed-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 4px;
  }

  .exec-ed-card {
    background: #f0f6f3;
    border-left: 3px solid #4a7c6b;
    padding: 12px 16px;
    border-radius: 0 4px 4px 0;
  }

  .exec-ed-card.upcoming {
    background: #fdf8ee;
    border-left-color: #c8a45c;
  }

  .exec-ed-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 4px;
  }

  .exec-ed-program {
    font-weight: 700;
    color: #1e3a2f;
    font-size: 0.95em;
    line-height: 1.4;
    flex: 1;
  }

  .exec-ed-year {
    font-size: 0.82em;
    color: #7a8a84;
    white-space: nowrap;
    padding-top: 2px;
    flex-shrink: 0;
  }

  .upcoming-badge {
    font-size: 0.72em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #8a6a1a;
    background: #fdf5dc;
    border: 1px solid #e8d898;
    padding: 2px 8px;
    border-radius: 3px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .exec-ed-inst {
    font-size: 0.85em;
    color: #4a7c6b;
    font-weight: 500;
  }

  .exec-ed-card.upcoming .exec-ed-inst {
    color: #8a6a1a;
  }

  .exec-ed-location {
    font-size: 0.8em;
    color: #7a7a7a;
    margin-top: 2px;
  }

  .exec-ed-photo-wrap {
    cursor: zoom-in;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 12px;
  }

  .exec-ed-photo-wrap:hover .exec-ed-photo {
    transform: scale(1.02);
  }

  .exec-ed-photo {
    width: 100%;
    height: 430px;
    object-fit: cover;
    object-position: center 30%;
    border-radius: 4px;
    margin-top: 0;
    display: block;
    transition: transform 0.4s ease;
  }

  /* Shared clickable thumbnail row (SAR + Running Start) */
  .thumb-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 20px;
  }

  .teaching-thumb-row {
    grid-template-columns: repeat(5, 1fr);
  }

  .thumb-cell {
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    cursor: zoom-in;
  }

  .thumb-cell img {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }

  .thumb-cell:hover img {
    transform: scale(1.04);
  }

  .thumb-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.68));
    color: white;
    padding: 22px 10px 8px;
    font-size: 0.74em;
    font-style: italic;
    letter-spacing: 0.3px;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.3s, transform 0.3s;
  }

  .thumb-cell:hover .thumb-caption {
    opacity: 1;
    transform: translateY(0);
  }

  @media (hover: none) {
    .thumb-caption { opacity: 1; transform: none; }
  }

  @media (max-width: 500px) {
    .thumb-row { grid-template-columns: repeat(3, 1fr); }
  }

  @media (max-width: 768px) {
    .teaching-thumb-row { grid-template-columns: repeat(6, 1fr); }
    .teaching-thumb-row .thumb-cell { grid-column: span 2; }
    .teaching-thumb-row .teaching-wide { grid-column: span 3; }
  }

  /* Full-width running photo banner */
  .running-banner-list {
    margin-top: 20px;
  }

  .running-banner-item {
    position: relative;
    width: 100%;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 12px;
    cursor: zoom-in;
  }

  .running-banner-item img {
    width: 100%;
    height: 380px;
    object-fit: cover;
    object-position: center 30%;
    display: block;
    transition: transform 0.4s ease;
  }

  .running-banner-item:hover img {
    transform: scale(1.02);
  }

  .running-banner-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.6));
    color: white;
    padding: 28px 18px 12px;
    font-size: 0.85em;
    font-style: italic;
    letter-spacing: 0.3px;
  }

  @media (max-width: 768px) {
    .running-banner-item img { height: 240px; }
  }


  .streak-count {
    font-size: 1.15em;
    font-weight: 700;
    color: #fc4c02;
  }

  .strava-link {
    color: #fc4c02;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }

  .strava-link:hover {
    text-decoration: underline;
  }

  /* Publications */
  .pub-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .pub-item {
    background: #faf8f5;
    border: 1px solid #e0d9cf;
    border-radius: 4px;
    padding: 16px 20px;
  }

  .pub-title {
    font-weight: 700;
    color: #1e3a2f;
    font-size: 1em;
    margin-bottom: 4px;
  }

  .pub-meta {
    font-size: 0.88em;
    color: #7a8a84;
    margin-bottom: 6px;
  }

  .pub-award {
    font-size: 0.88em;
    color: #8a6a1a;
    font-weight: 600;
    background: #fdf5dc;
    display: inline-block;
    padding: 3px 10px;
    border-radius: 3px;
    border: 1px solid #e8d898;
  }

  /* Awards */
  .awards-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .awards-list li {
    padding: 10px 16px 10px 44px;
    position: relative;
    background: #faf8f5;
    border-radius: 4px;
    color: #2d3a35;
    font-size: 0.95em;
    border: 1px solid #e0d9cf;
  }

  .awards-list li::before {
    content: "🏆";
    position: absolute;
    left: 12px;
    top: 10px;
  }

  @media (max-width: 768px) {
    .job-header { flex-direction: column; gap: 4px; }
    .job-dates { font-size: 0.82em; }
    .degrees-grid { grid-template-columns: 1fr; }
    .degree-card-hs { flex-direction: column; align-items: flex-start; gap: 4px; }
    .exec-ed-photo { height: auto; object-position: center center; }
  }

  @media print {
    .container {
      box-shadow: none;
      max-width: 100%;
      border-radius: 0;
    }
  }

  /* Photo mosaic — clickable cursor */
  .photo-cell {
    cursor: zoom-in;
  }

  /* Lightbox */
  .lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    cursor: zoom-out;
  }

  .lightbox img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6);
    cursor: default;
  }

  .lightbox-close {
    position: absolute;
    top: 16px;
    right: 20px;
    background: none;
    border: none;
    color: white;
    font-size: 1.6rem;
    line-height: 1;
    cursor: pointer;
    opacity: 0.8;
    padding: 4px 8px;
  }

  .lightbox-close:hover {
    opacity: 1;
  }

  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.45);
    background: rgba(0, 0, 0, 0.35);
    color: #fff;
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lightbox-prev { left: 16px; }
  .lightbox-next { right: 16px; }

  .lightbox-counter {
    position: absolute;
    left: 50%;
    bottom: 16px;
    transform: translateX(-50%);
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    letter-spacing: 0.03em;
    background: rgba(0, 0, 0, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.25);
    border-radius: 999px;
    padding: 4px 10px;
  }

  /* Teaching highlights — rendered below institutions dropdown */
  .teaching-highlights {
    list-style: none;
    margin-top: 16px;
    padding: 0;
  }

  .teaching-highlights li {
    padding: 10px 0 10px 30px;
    position: relative;
    color: #2d3a35;
    font-size: 1em;
  }

  .teaching-highlights li::before {
    content: "—";
    position: absolute;
    left: 0;
    color: #4a7c6b;
    font-weight: 700;
  }

  /* Running Start group label */
  .running-start-label {
    font-size: 0.75em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: #4a7c6b;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  /* ════════════════════════════════════════════════════════
     UPSIDE DOWN EASTER EGG THEME
     ════════════════════════════════════════════════════════ */

  /* Activation intro overlay */
  .ud-intro {
    position: fixed;
    inset: 0;
    background: #000;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: udIntroAnim 3.2s ease-in-out forwards;
    overflow: hidden;
  }

  @keyframes udIntroAnim {
    0%   { opacity: 0; }
    8%   { opacity: 1; }
    78%  { opacity: 1; }
    100% { opacity: 0; pointer-events: none; }
  }

  .ud-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .ud-particle {
    position: absolute;
    bottom: -10px;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #ff2d2d;
    opacity: 0.7;
    animation: floatUp linear infinite;
  }

  @keyframes floatUp {
    0%   { transform: translateY(0) scale(1); opacity: 0.7; }
    100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
  }

  .ud-welcome {
    font-family: 'Courier New', Courier, monospace;
    font-size: clamp(0.9em, 3vw, 1.4em);
    color: #ff2d2d;
    text-transform: uppercase;
    letter-spacing: 8px;
    margin: 0 0 10px;
    text-shadow: 0 0 18px rgba(255, 45, 45, 0.9), 0 0 40px rgba(255, 0, 0, 0.4);
    opacity: 0;
    animation: textReveal 3.2s ease forwards;
    animation-delay: 0.3s;
  }

  .ud-title {
    font-family: 'Courier New', Courier, monospace;
    font-size: clamp(2em, 8vw, 4em);
    font-weight: 900;
    color: #ff2d2d;
    text-transform: uppercase;
    letter-spacing: 6px;
    margin: 0 0 18px;
    text-shadow: 0 0 24px rgba(255, 45, 45, 1), 0 0 60px rgba(255, 0, 0, 0.5), 0 0 100px rgba(180, 0, 0, 0.3);
    opacity: 0;
    animation: textReveal 3.2s ease forwards;
    animation-delay: 0.65s;
  }

  .ud-sub {
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.3em;
    color: #ff6666;
    letter-spacing: 10px;
    margin: 0;
    opacity: 0;
    animation: textReveal 3.2s ease forwards;
    animation-delay: 1s;
    text-shadow: 0 0 10px rgba(255, 45, 45, 0.7);
  }

  @keyframes textReveal {
    0%   { opacity: 0; transform: scale(0.85) translateY(8px); }
    15%  { opacity: 1; transform: scale(1) translateY(0); }
    78%  { opacity: 1; }
    100% { opacity: 0; }
  }

  /* CRT scanlines overlay */
  .scanlines {
    position: fixed;
    inset: 0;
    z-index: 9990;
    pointer-events: none;
    background: repeating-linear-gradient(
      transparent,
      transparent 3px,
      rgba(0, 0, 0, 0.18) 3px,
      rgba(0, 0, 0, 0.18) 4px
    );
  }

  /* Return button */
  .return-btn {
    position: fixed;
    top: 14px;
    right: 14px;
    z-index: 9995;
    background: #1a0000;
    color: #ff4444;
    border: 1px solid #8b0000;
    padding: 8px 16px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.82em;
    font-weight: 700;
    letter-spacing: 0.5px;
    cursor: pointer;
    border-radius: 3px;
    text-shadow: 0 0 8px rgba(255, 68, 68, 0.7);
    box-shadow: 0 0 12px rgba(180, 0, 0, 0.4);
    transition: background 0.2s, box-shadow 0.2s;
  }

  .return-btn:hover {
    background: #2a0000;
    box-shadow: 0 0 20px rgba(255, 45, 45, 0.5);
  }

  /* Footer found label */
  .footer-found-label {
    position: absolute;
    bottom: 16px;
    left: 0;
    right: 0;
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
    color: #ff4444;
    letter-spacing: 4px;
    text-shadow: 0 0 12px rgba(255, 45, 45, 0.9);
    animation: labelFlicker 2.5s ease-in-out infinite;
  }

  @keyframes labelFlicker {
    0%, 90%  { opacity: 1; }
    92%      { opacity: 0.2; }
    95%      { opacity: 1; }
    97%      { opacity: 0.4; }
    100%     { opacity: 1; }
  }

  /* ── Container & layout ────────────────────────── */
  :global(body.upside-down .container) {
    background: #0d0808;
    box-shadow: 0 0 40px rgba(180, 0, 0, 0.35), 0 0 80px rgba(100, 0, 0, 0.2);
    border: 1px solid #4a0808;
  }

  :global(body.upside-down .profile) {
    background: #110a0a;
    border-bottom: 2px solid #6b0000;
  }

  :global(body.upside-down .profile p) {
    color: #d4b0b0;
  }

  :global(body.upside-down .photo-mosaic) {
    background: #1a0505;
  }

  :global(body.upside-down .content) {
    background: #0d0808;
  }

  :global(body.upside-down .content p) {
    color: #d4b0b0;
  }

  /* Footer photo */
  :global(body.upside-down .footer-photo) {
    cursor: default;
    position: relative;
  }

  :global(body.upside-down .footer-photo img) {
    filter: brightness(0.45) sepia(0.6) hue-rotate(-20deg) saturate(0.5);
  }

  :global(body.upside-down .footer-upside-down) {
    cursor: default;
  }

  :global(body.upside-down .footer-quote-text) {
    color: rgba(200, 150, 150, 0.88);
  }

  :global(body.upside-down .footer-quote-attribution) {
    color: rgba(255, 100, 100, 0.78);
  }

  /* ── Work experience ───────────────────────────── */
  :global(body.upside-down .job) {
    border-bottom-color: #4a0808;
  }

  :global(body.upside-down .job-title) {
    color: #ff8c00;
  }

  :global(body.upside-down .job-org) {
    color: #cc5555;
  }

  :global(body.upside-down .job-dates) {
    color: #886060;
  }

  :global(body.upside-down .job-bullets li) {
    color: #d4b0b0;
  }

  :global(body.upside-down .job-bullets li::before) {
    color: #ff2d2d;
  }

  /* ── Education & degrees ───────────────────────── */
  :global(body.upside-down .degree-card) {
    background: #150a0a;
    border-color: #4a0808;
    border-top-color: #cc2200;
  }

  :global(body.upside-down .degree-label) {
    color: #ff8c00;
  }

  :global(body.upside-down .degree-field) {
    color: #d4b0b0;
  }

  :global(body.upside-down .degree-inst) {
    color: #cc5555;
    border-top-color: #4a0808;
  }

  :global(body.upside-down .degree-card-hs) {
    background: #150a0a;
    border-color: #4a0808;
  }

  :global(body.upside-down .degree-field-hs) {
    color: #d4b0b0;
  }

  :global(body.upside-down .degree-inst-hs) {
    color: #886060;
  }

  :global(body.upside-down .teaching-card) {
    background: #150a0a;
    border-left-color: #cc2200;
    color: #ff8c00;
  }

  /* ── Executive education ───────────────────────── */
  :global(body.upside-down .exec-ed-card) {
    background: #150a0a;
    border-left-color: #cc2200;
  }

  :global(body.upside-down .exec-ed-card.upcoming) {
    background: #180d00;
    border-left-color: #8b4500;
  }

  :global(body.upside-down .exec-ed-program) {
    color: #ff8c00;
  }

  :global(body.upside-down .exec-ed-year) {
    color: #886060;
  }

  :global(body.upside-down .exec-ed-inst) {
    color: #cc5555;
  }

  :global(body.upside-down .upcoming-badge) {
    background: #2a1000;
    border-color: #6b3300;
    color: #ff8c00;
  }

  /* ── Publications & awards ─────────────────────── */
  :global(body.upside-down .pub-item) {
    background: #150a0a;
    border-color: #4a0808;
  }

  :global(body.upside-down .pub-title) {
    color: #ff8c00;
  }

  :global(body.upside-down .pub-meta) {
    color: #886060;
  }

  :global(body.upside-down .pub-award) {
    background: #1a0a00;
    border-color: #6b3300;
    color: #ff8c00;
  }

  :global(body.upside-down .awards-list li) {
    background: #150a0a;
    border-color: #4a0808;
    color: #d4b0b0;
  }

  /* ── Running / streak ──────────────────────────── */
  :global(body.upside-down .streak-count) {
    color: #ff2d2d;
    text-shadow: 0 0 8px rgba(255, 45, 45, 0.7);
  }

  :global(body.upside-down .strava-link) {
    color: #ff8c00;
  }

  /* ── Lightbox ──────────────────────────────────── */
  :global(body.upside-down .lightbox) {
    background: rgba(5, 0, 0, 0.96);
  }

  /* ── CSEPP dropdown ──────────────────────────── */
  :global(body.upside-down .csepp-dropdown) {
    background: #150a0a;
    border-color: #4a0808;
  }

  :global(body.upside-down .csepp-toggle) {
    background: #1a0c0c;
    color: #ff8c00;
  }

  :global(body.upside-down .csepp-toggle:hover) {
    background: #1f0c0c;
  }

  :global(body.upside-down .csepp-chevron) {
    color: #cc4444;
  }

  :global(body.upside-down .csepp-content) {
    color: #d4b0b0;
  }

  :global(body.upside-down .csepp-content h4) {
    color: #ff2d2d;
  }

  :global(body.upside-down .csepp-personal) {
    border-top-color: #4a0808;
    color: #886060;
  }

  :global(body.upside-down .csepp-county-table) {
    border-color: #4a0808;
  }

  :global(body.upside-down .csepp-county-header) {
    background: #2a0a0a;
    color: #ff8c00;
  }

  :global(body.upside-down .csepp-county-row) {
    color: #d4b0b0;
    border-top-color: #4a0808;
  }

  :global(body.upside-down .csepp-county-row:nth-child(odd)) {
    background: #1a0c0c;
  }

  :global(body.upside-down .csepp-partnership) {
    background: #150a0a;
    border-left-color: #cc2200;
    color: #d4b0b0;
  }

  :global(body.upside-down .csepp-pdf-link) {
    color: #ff6b6b;
  }

  :global(body.upside-down .csepp-pdf-link:hover) {
    color: #ff9999;
  }

  :global(body.upside-down .teaching-highlights li) {
    color: #d4b0b0;
  }

  :global(body.upside-down .teaching-highlights li::before) {
    color: #ff2d2d;
  }
</style>
