<script>
  export let name;
  export let title;
  export let location;
  export let photoSrc;
  export let photoAlt;
  export let linkedin = '';
  export let cvLink = '';
  export let onPhotoClick = null;
</script>

<div class="header">
  <div class="topo-overlay"></div>
  <div class="header-content">
    {#if photoSrc}
      <div class="profile-photo" class:clickable={!!onPhotoClick}
        on:click={() => onPhotoClick && onPhotoClick()}
        on:keydown={(e) => e.key === 'Enter' && onPhotoClick && onPhotoClick()}
        role={onPhotoClick ? 'button' : null}
        tabindex={onPhotoClick ? 0 : null}>
        <img src={photoSrc} alt={photoAlt} />
      </div>
    {/if}
    <div class="header-text">
      <div class="title">{@html title}</div>
      <div class="name-loc">
        <h1>{name}</h1>
        <div class="location">{location}</div>
      </div>
      <div class="header-links">
        {#if linkedin}
          <a class="header-link" href={linkedin} target="_blank" rel="noopener noreferrer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        {/if}
        {#if cvLink}
          <a class="header-link cv-link" href={cvLink} target="_blank" rel="noopener noreferrer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Traditional CV
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .header {
    background: linear-gradient(160deg, #1e3a2f 0%, #2d5a47 100%);
    color: white;
    padding: 40px;
    position: relative;
    overflow: hidden;
  }

  .topo-overlay {
    position: absolute;
    inset: 0;
    opacity: 0.08;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cpath d='M40 200c30-60 80-100 160-100s130 40 160 100' fill='none' stroke='%23fff' stroke-width='1.2'/%3E%3Cpath d='M20 240c40-70 100-120 180-120s150 50 180 120' fill='none' stroke='%23fff' stroke-width='1'/%3E%3Cpath d='M60 160c25-50 70-80 140-80s115 30 140 80' fill='none' stroke='%23fff' stroke-width='1.2'/%3E%3Cpath d='M80 130c20-40 60-65 120-65s100 25 120 65' fill='none' stroke='%23fff' stroke-width='1'/%3E%3Cpath d='M0 280c50-80 120-140 200-140s150 60 200 140' fill='none' stroke='%23fff' stroke-width='1'/%3E%3Cpath d='M100 100c15-30 50-50 100-50s85 20 100 50' fill='none' stroke='%23fff' stroke-width='1.2'/%3E%3Cpath d='M0 320c60-90 140-160 200-160s140 70 200 160' fill='none' stroke='%23fff' stroke-width='0.8'/%3E%3Cpath d='M120 75c10-20 40-35 80-35s70 15 80 35' fill='none' stroke='%23fff' stroke-width='1'/%3E%3Cpath d='M0 360c70-100 150-180 200-180s130 80 200 180' fill='none' stroke='%23fff' stroke-width='0.8'/%3E%3C/svg%3E");
    background-size: 400px 400px;
  }

  .header-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 36px;
  }

  .profile-photo {
    width: 190px;
    height: 240px;
    flex-shrink: 0;
    border-radius: 6px;
    overflow: hidden;
    border: 3px solid rgba(200, 164, 92, 0.7);
    box-shadow: 0 6px 24px rgba(0,0,0,0.35);
  }

  .profile-photo.clickable {
    cursor: zoom-in;
  }

  .profile-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 15%;
  }

  .header-text {
    flex: 1;
  }

  .title {
    font-size: 0.85em;
    font-weight: 400;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #c8a45c;
    margin-bottom: 10px;
    line-height: 1.5;
  }

  h1 {
    font-size: clamp(0.9rem, 4.5vw, 2.1em);
    font-weight: 700;
    letter-spacing: 0.5px;
    margin: 0 0 10px;
    line-height: 1.1;
    white-space: nowrap;
  }

  .location {
    font-size: 0.9em;
    font-weight: 300;
    opacity: 0.8;
    letter-spacing: 0.3px;
    margin-bottom: 16px;
  }

  .header-links {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 0;
  }

  .header-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: white;
    text-decoration: none;
    font-size: 0.88em;
    font-weight: 500;
    opacity: 0.85;
    border: 1px solid rgba(255,255,255,0.3);
    padding: 6px 14px;
    border-radius: 4px;
    transition: opacity 0.2s, border-color 0.2s;
  }

  .header-link:hover {
    opacity: 1;
    border-color: rgba(255,255,255,0.7);
  }

  @media (max-width: 768px) {
    .header { padding: 30px 24px; }
    .header-content { gap: 24px; }
    .header-text { min-width: 0; }
    .profile-photo { width: 140px; height: 180px; }
    .title { font-size: 0.78em; letter-spacing: 1px; }
    h1 {
      font-size: clamp(0.9rem, 3.2vw, 1.7em);
      white-space: normal;
    }
  }

  @media (max-width: 500px) {
    .header { padding: 20px 16px; }
    /* 2-column grid: photo left, name+location right */
    .header-content {
      display: grid;
      grid-template-columns: 90px 1fr;
      column-gap: 14px;
      row-gap: 8px;
      align-items: start;
    }
    /* photo: left col, row 1 */
    .profile-photo {
      width: 90px;
      height: 116px;
      grid-column: 1;
      grid-row: 1;
    }
    /* dissolve wrapper so title/name-loc/links become direct grid items */
    .header-text { display: contents; }
    /* name + location: right col, row 1 (beside photo) */
    .name-loc {
      grid-column: 2;
      grid-row: 1;
      align-self: center;
    }
    h1 {
      font-size: clamp(0.82rem, 3.7vw, 1.1em);
      white-space: nowrap;
      line-height: 1.2;
      margin: 0 0 4px;
    }
    .location {
      font-size: 0.85em;
      margin-bottom: 0;
    }
    /* title roles: full width, row 2 */
    .title {
      grid-column: 1 / 3;
      grid-row: 2;
      font-size: 0.72em;
      letter-spacing: 1px;
      line-height: 1.75;
      padding-top: 10px;
      border-top: 1px solid rgba(255,255,255,0.15);
      margin-bottom: 0;
    }
    .title :global(span) { white-space: nowrap; }
    /* buttons: full width, row 3 */
    .header-links {
      grid-column: 1 / 3;
      grid-row: 3;
      gap: 8px;
      flex-wrap: wrap;
    }
    .header-link { font-size: 0.82em; padding: 6px 14px; }
  }

  /* ── Upside Down theme overrides ─────────────── */
  :global(body.upside-down .header) {
    background: linear-gradient(160deg, #0a0000 0%, #1a0606 100%);
    border-bottom: 1px solid #4a0808;
  }

  :global(body.upside-down .title) {
    color: #ff8c00;
    text-shadow: 0 0 10px rgba(255, 140, 0, 0.6);
  }

  :global(body.upside-down h1) {
    text-shadow: 0 0 16px rgba(255, 45, 45, 0.6);
    color: #ffe0e0;
    font-family: 'Courier New', Courier, monospace;
  }

  :global(body.upside-down .location) {
    color: rgba(255, 200, 200, 0.7);
  }

  :global(body.upside-down .profile-photo) {
    border-color: rgba(255, 45, 45, 0.65);
    box-shadow: 0 0 20px rgba(180, 0, 0, 0.5);
  }

  :global(body.upside-down .header-link) {
    border-color: rgba(255, 45, 45, 0.35);
    color: #ffcccc;
  }

  :global(body.upside-down .header-link:hover) {
    border-color: rgba(255, 45, 45, 0.8);
    color: #ff4444;
  }

  :global(body.upside-down .topo-overlay) {
    opacity: 0.04;
  }
</style>
