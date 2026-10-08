<script>
  // Renders text, turning any phrase listed in data.json → citations into a
  // dotted-underline reference whose source note shows on hover, focus, or tap.
  // A citation is a note string, or { note, url, label } to link the source.
  import data from './data.json';

  export let text = '';

  const citations = data.citations || {};
  const phrases = Object.keys(citations);
  const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = phrases.length ? new RegExp(`(${phrases.map(escape).join('|')})`) : null;

  $: parts = pattern ? text.split(pattern) : [text];

  const cite = phrase => {
    const c = citations[phrase];
    return typeof c === 'string' ? { note: c } : c;
  };

  let openIndex = -1;
  const toggle = i => (openIndex = openIndex === i ? -1 : i);

  // Keep the note inside the page card, which clips anything that overflows it.
  function place(e) {
    const cite = e.currentTarget;
    const note = cite.querySelector('.cite-note');
    const bounds = (cite.closest('.container') || document.documentElement).getBoundingClientRect();
    const c = cite.getBoundingClientRect();
    const width = Math.min(280, bounds.width - 16);
    const left = Math.min(Math.max(c.left, bounds.left + 8), bounds.right - 8 - width);
    note.style.width = `${width}px`;
    note.style.left = `${left - c.left}px`;
  }
</script>

{#each parts as part, i}{#if citations[part]}<span
      class="cite"
      class:open={openIndex === i}
      tabindex="0"
      role="button"
      aria-expanded={openIndex === i}
      on:mouseenter={place}
      on:focus={place}
      on:click|stopPropagation={e => (place(e), toggle(i))}
      on:keydown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(i))}
      on:focusout={e => !e.currentTarget.contains(e.relatedTarget) && openIndex === i && (openIndex = -1)}
    >{part}<span class="cite-note" role="tooltip">{cite(part).note}{#if cite(part).url} <a href={cite(part).url} target="_blank" rel="noopener noreferrer" on:click|stopPropagation>{cite(part).label || 'Source'} ↗</a>{/if}</span></span>{:else}{part}{/if}{/each}

<style>
  .cite {
    position: relative;
    text-decoration: underline dotted #4a7c6b;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 3px;
    cursor: help;
    outline: none;
  }

  .cite:focus-visible {
    border-radius: 2px;
    box-shadow: 0 0 0 2px #4a7c6b;
  }

  .cite-note {
    display: none;
    position: absolute;
    left: 0;
    bottom: calc(100% + 8px);
    z-index: 20;
    width: 280px;
    padding: 8px 11px;
    background: #1e3a2f;
    color: #fff8eb;
    border-radius: 5px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
    font-size: 0.82rem;
    font-weight: 500;
    font-style: normal;
    line-height: 1.45;
    text-align: left;
    white-space: normal;
  }

  /* Invisible strip over the gap so the pointer can travel up to the link. */
  .cite-note::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    height: 10px;
  }

  .cite-note a {
    display: block;
    margin-top: 6px;
    color: #b8e0cf;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .cite:hover .cite-note,
  .cite:focus-within .cite-note,
  .cite.open .cite-note {
    display: block;
  }
</style>
