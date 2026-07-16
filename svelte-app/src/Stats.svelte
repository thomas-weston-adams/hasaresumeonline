<script>
  export let stats = [];
  // Each stat: { number, label }
</script>

<div class="stats">
  {#each stats as stat}
    <div class="stat-box">
      <span class="stat-number">{stat.number}</span>
      <span class="stat-label">{stat.label}</span>
    </div>
  {/each}
</div>

<style>
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    background: #faf8f5;
  }

  .stat-box {
    padding: 30px 20px;
    text-align: center;
    border-right: 1px solid #e8e2d8;
    border-bottom: 1px solid #e8e2d8;
  }

  .stat-number {
    font-size: 2.8em;
    font-weight: 700;
    color: #2d5a47;
    display: block;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 0.85em;
    color: #6b7c75;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .stats { grid-template-columns: repeat(2, 1fr); }
    /* When the last item is alone on a row (odd nth-child), span it full width */
    .stat-box:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 400px) {
    .stats { grid-template-columns: repeat(2, 1fr); }
    .stat-number { font-size: 2.2em; }
    .stat-box:last-child:nth-child(odd) {
      grid-column: 1 / -1;
    }
  }

  @media print {
    .stat-box:hover { transform: none; }
  }

  /* ── Upside Down theme overrides ─────────────── */
  :global(body.upside-down .stats) {
    background: #110a0a;
  }

  :global(body.upside-down .stat-box) {
    border-color: #4a0808;
  }

  :global(body.upside-down .stat-number) {
    color: #ff2d2d;
    text-shadow: 0 0 14px rgba(255, 45, 45, 0.8), 0 0 30px rgba(255, 0, 0, 0.3);
    font-family: 'Courier New', Courier, monospace;
  }

  :global(body.upside-down .stat-label) {
    color: #886060;
    font-family: 'Courier New', Courier, monospace;
  }
</style>
