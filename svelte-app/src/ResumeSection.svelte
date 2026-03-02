<script>
  export let icon = '';
  export let title = '';
  export let highlights = [];  // array of strings
  export let skills = [];      // array of strings (rendered as badge pills)
  export let skillCategories = [];  // array of {category, items} (rendered as categorized badge groups)
  export let orgs = [];        // array of strings (rendered as org badges)
  export let collapsible = false;
  export let sectionId = '';

  let open = !collapsible;

  function toggle() {
    if (collapsible) open = !open;
  }
</script>

<div class="section" id={sectionId || undefined}>
  <div class="section-header" class:clickable={collapsible} on:click={toggle} role={collapsible ? 'button' : undefined} tabindex={collapsible ? 0 : undefined} on:keydown={e => (e.key === 'Enter' || e.key === ' ') && toggle()}>
    {#if icon}
      <span class="section-icon">{icon}</span>
    {/if}
    <div class="section-title-wrap">
      <h3 class="section-title">{title}</h3>
      {#if collapsible}
        <span class="expand-hint">{open ? 'tap to collapse' : 'tap to expand'}</span>
      {/if}
    </div>
    {#if collapsible}
      <span class="toggle-indicator" class:open>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    {/if}
  </div>

  {#if open}
    <div class="section-content">
      <slot />

      {#if highlights.length > 0}
        <ul class="highlights">
          {#each highlights as item}
            <li>{item}</li>
          {/each}
        </ul>
      {/if}

      {#if skillCategories.length > 0}
        {#each skillCategories as group}
          <div class="skill-category-group">
            <h4 class="skill-cat-label">{group.category}</h4>
            <div class="skills-grid">
              {#each group.items as skill}
                <div class="skill-badge">{skill}</div>
              {/each}
            </div>
          </div>
        {/each}
      {:else if skills.length > 0}
        <div class="skills-grid">
          {#each skills as skill}
            <div class="skill-badge">{skill}</div>
          {/each}
        </div>
      {/if}

      {#if orgs.length > 0}
        <div class="org-list">
          {#each orgs as org}
            <div class="org-badge">{org}</div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .section {
    margin-bottom: 40px;
  }

  .section:last-child {
    margin-bottom: 0;
  }

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 18px;
    padding-bottom: 12px;
    border-bottom: 2px solid #4a7c6b;
  }

  .section-header.clickable {
    cursor: pointer;
    user-select: none;
    margin-bottom: 0;
    background: #f5f2ec;
    border-radius: 4px 4px 0 0;
    padding: 10px 14px;
    margin-left: -14px;
    margin-right: -14px;
    border-bottom: 2px solid #4a7c6b;
  }

  .section-header.clickable:hover {
    background: #ede8e0;
  }

  .section-header.clickable:hover .section-title {
    color: #2d5a47;
  }

  .section-icon {
    font-size: 1.8em;
    margin-right: 12px;
  }

  .section-title-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .section-title {
    font-size: 1.4em;
    font-weight: 700;
    color: #1e3a2f;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
  }

  .expand-hint {
    font-size: 0.72em;
    font-weight: 400;
    color: #4a7c6b;
    text-transform: none;
    letter-spacing: 0.3px;
    font-style: italic;
  }

  .toggle-indicator {
    color: #4a7c6b;
    width: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: transform 0.25s ease;
  }

  .toggle-indicator.open {
    transform: rotate(180deg);
  }

  .section-content {
    color: #34403b;
    font-size: 1em;
    line-height: 1.7;
    padding-top: 18px;
  }

  /* Highlights */
  .highlights {
    list-style: none;
    margin-top: 12px;
    padding: 0;
  }

  .highlights li {
    padding: 10px 0 10px 30px;
    position: relative;
    color: #2d3a35;
    font-size: 1em;
  }

  .highlights li::before {
    content: "—";
    position: absolute;
    left: 0;
    color: #4a7c6b;
    font-weight: 700;
  }

  /* Skill categories */
  .skill-category-group {
    margin-top: 22px;
  }

  .skill-category-group:first-child {
    margin-top: 18px;
  }

  .skill-cat-label {
    font-size: 0.78em;
    font-weight: 700;
    color: #4a7c6b;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin: 0 0 10px;
  }

  /* Skills */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-top: 18px;
  }

  .skill-badge {
    background: #2d5a47;
    color: white;
    padding: 10px 18px;
    border-radius: 4px;
    text-align: center;
    font-weight: 600;
    font-size: 0.9em;
    letter-spacing: 0.3px;
  }

  /* Orgs */
  .org-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 15px;
  }

  .org-badge {
    background: #f5f2ec;
    padding: 8px 16px;
    border-radius: 4px;
    color: #2d3a35;
    font-weight: 600;
    font-size: 0.9em;
    border: 1px solid #d4cdc2;
  }

  @media (max-width: 768px) {
    .section-title { font-size: 1.15em; letter-spacing: 0.5px; }
    .skills-grid { grid-template-columns: repeat(2, 1fr); }
    .highlights li { padding-left: 24px; font-size: 0.95em; }
    .section-icon { font-size: 1.5em; margin-right: 10px; }
  }

  @media (max-width: 400px) {
    .skills-grid { grid-template-columns: 1fr; }
    .section-title { font-size: 1.05em; }
  }

  @media print {
    .section-content { display: block !important; }
    .toggle-indicator { display: none; }
  }

  /* ── Upside Down theme overrides ─────────────── */
  :global(body.upside-down .section-header) {
    border-bottom-color: #6b0000;
  }

  :global(body.upside-down .section-title) {
    color: #ff2d2d;
    text-shadow: 0 0 10px rgba(255, 45, 45, 0.7), 0 0 22px rgba(255, 0, 0, 0.3);
    font-family: 'Courier New', Courier, monospace;
  }

  :global(body.upside-down .section-header.clickable) {
    background: #150a0a;
    border-bottom-color: #6b0000;
  }

  :global(body.upside-down .section-header.clickable:hover) {
    background: #1f0c0c;
  }

  :global(body.upside-down .section-header.clickable:hover .section-title) {
    color: #ff4444;
  }

  :global(body.upside-down .section-content) {
    color: #d4b0b0;
  }

  :global(body.upside-down .highlights li) {
    color: #d4b0b0;
  }

  :global(body.upside-down .highlights li::before) {
    color: #ff2d2d;
  }

  :global(body.upside-down .skill-cat-label) {
    color: #cc4444;
    font-family: 'Courier New', Courier, monospace;
  }

  :global(body.upside-down .skill-badge) {
    background: #5a0000;
    color: #ffaaaa;
    font-family: 'Courier New', Courier, monospace;
  }

  :global(body.upside-down .org-badge) {
    background: #150a0a;
    border-color: #4a0808;
    color: #d4b0b0;
    font-family: 'Courier New', Courier, monospace;
  }

  :global(body.upside-down .expand-hint) {
    color: #886060;
  }

  :global(body.upside-down .toggle-indicator) {
    color: #cc4444;
  }
</style>
