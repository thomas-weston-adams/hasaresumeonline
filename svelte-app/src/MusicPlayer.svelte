<script>
  import { onMount, onDestroy } from 'svelte';

  export let src = './audio/Song for Walking.mp3';
  export let title = 'Song for Walking';
  export let artist = '';
  export let autoplay = true;
  export let initialVolume = 0.18;

  let audio;
  let playing = false;
  let currentTime = 0;
  let duration = 0;
  let volume = initialVolume;
  let dragging = false;
  let progressBar;

  onMount(() => {
    audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;

    audio.addEventListener('timeupdate', () => {
      if (!dragging) currentTime = audio.currentTime;
    });
    audio.addEventListener('loadedmetadata', () => {
      duration = audio.duration;
    });
    audio.addEventListener('ended', () => { playing = false; });

    if (autoplay) {
      audio.play().then(() => { playing = true; }).catch(() => { playing = false; });
    }
  });

  onDestroy(() => {
    if (audio) { audio.pause(); audio.src = ''; }
  });

  function togglePlay() {
    if (!audio) return;
    if (playing) {
      audio.pause();
      playing = false;
    } else {
      audio.play().then(() => { playing = true; }).catch(() => {});
    }
  }

  function seek(e) {
    if (!audio || !duration) return;
    const rect = progressBar.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = pct * duration;
    currentTime = audio.currentTime;
  }

  function onVolumeChange(e) {
    volume = parseFloat(e.target.value);
    if (audio) audio.volume = volume;
  }

  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  $: progress = duration ? (currentTime / duration) * 100 : 0;
</script>

<div class="music-player" role="region" aria-label="Music player">
  <button class="play-btn" on:click={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
    {#if playing}
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <rect x="5" y="4" width="4" height="16" rx="1"/>
        <rect x="15" y="4" width="4" height="16" rx="1"/>
      </svg>
    {:else}
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
        <polygon points="6,3 20,12 6,21"/>
      </svg>
    {/if}
  </button>

  <div class="track-info">
    <div class="track-meta">
      <span class="track-title">{title}</span>
      {#if artist}<span class="track-artist">{artist}</span>{/if}
    </div>
    {#if playing}
      <span class="playing-indicator" aria-hidden="true">
        <span></span><span></span><span></span>
      </span>
    {/if}
  </div>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="progress-wrap"
    bind:this={progressBar}
    on:click={seek}
    on:mousedown={() => dragging = true}
    on:mouseup={() => dragging = false}
    on:touchstart|passive={() => dragging = true}
    on:touchend={() => { dragging = false; }}
    on:touchmove|passive={seek}
    role="slider"
    aria-label="Seek"
    aria-valuenow={Math.round(progress)}
    aria-valuemin="0"
    aria-valuemax="100"
    tabindex="0"
  >
    <div class="progress-track">
      <div class="progress-fill" style="width: {progress}%"></div>
    </div>
  </div>

  <span class="time">{fmt(currentTime)}</span>

  <div class="volume-wrap" aria-label="Volume">
    <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
    </svg>
    <input
      type="range" min="0" max="1" step="0.01"
      value={volume}
      on:input={onVolumeChange}
      aria-label="Volume"
      class="volume-slider"
    />
  </div>
</div>

<style>
  .music-player {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 20px;
    background: rgba(18, 36, 26, 0.75);
    border-top: 1px solid rgba(200, 164, 92, 0.25);
    backdrop-filter: blur(8px);
    color: #e8dfc8;
    font-size: 0.78em;
    letter-spacing: 0.3px;
  }

  .play-btn {
    background: none;
    border: 1px solid rgba(200, 164, 92, 0.4);
    border-radius: 50%;
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #c8a45c;
    flex-shrink: 0;
    transition: border-color 0.2s, color 0.2s;
    padding: 0;
  }
  .play-btn:hover { border-color: #c8a45c; color: #e0bc78; }

  .track-info {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    min-width: 0;
  }

  .track-meta {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .track-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
    color: #d4c9a8;
    font-weight: 500;
  }

  .track-artist {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
    color: #a89878;
    font-size: 0.85em;
    opacity: 0.8;
  }

  .playing-indicator {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 12px;
  }
  .playing-indicator span {
    display: block;
    width: 2.5px;
    background: #c8a45c;
    border-radius: 1px;
    animation: bar-bounce 0.9s ease-in-out infinite alternate;
  }
  .playing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .playing-indicator span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bar-bounce {
    from { height: 3px; }
    to   { height: 12px; }
  }

  .progress-wrap {
    flex: 1;
    cursor: pointer;
    padding: 8px 0;
    min-width: 60px;
  }
  .progress-track {
    height: 3px;
    background: rgba(255,255,255,0.12);
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: #c8a45c;
    border-radius: 2px;
    transition: width 0.25s linear;
  }

  .time {
    flex-shrink: 0;
    opacity: 0.55;
    font-variant-numeric: tabular-nums;
  }

  .volume-wrap {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
    opacity: 0.7;
  }
  .volume-wrap:hover { opacity: 1; }

  .volume-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 64px;
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,0.15);
    outline: none;
    cursor: pointer;
  }
  .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #c8a45c;
    cursor: pointer;
  }
  .volume-slider::-moz-range-thumb {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #c8a45c;
    border: none;
    cursor: pointer;
  }

  @media (max-width: 500px) {
    .music-player { gap: 8px; padding: 8px 14px; }
    .track-title { max-width: 100px; }
    .volume-wrap { display: none; }
  }

  /* Upside Down theme */
  :global(body.upside-down) .music-player {
    background: rgba(12, 2, 2, 0.96);
    border-top-color: rgba(255, 45, 45, 0.25);
    color: #ffcccc;
  }
  :global(body.upside-down) .play-btn {
    border-color: rgba(255, 45, 45, 0.4);
    color: #ff6b6b;
  }
  :global(body.upside-down) .play-btn:hover {
    border-color: #ff2d2d;
    color: #ff4444;
  }
  :global(body.upside-down) .progress-fill {
    background: #ff2d2d;
  }
  :global(body.upside-down) .playing-indicator span {
    background: #ff2d2d;
  }
  :global(body.upside-down) .volume-slider::-webkit-slider-thumb {
    background: #ff2d2d;
  }
  :global(body.upside-down) .volume-slider::-moz-range-thumb {
    background: #ff2d2d;
  }
</style>
