/**
 * ReZenOnance Nightly · Standalone Audiophile Web Player & DSP Equalizer
 * Features: 10-Band Peaking Biquad EQ, AutoEQ Presets, Canvas Visualizer, Play Queue
 */

(function(window) {
  'use strict';

  var audioEl = new Audio();
  audioEl.crossOrigin = 'anonymous';

  var audioCtx = null;
  var sourceNode = null;
  var analyserNode = null;
  var eqFilters = [];
  var isAudioContextInit = false;

  var EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  var AUTOEQ_PRESETS = {
    flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    harman: [4.5, 4.0, 2.5, 1.0, 0.0, 0.5, 2.0, 3.0, 2.0, 1.0],
    '80s_warmth': [3.0, 4.0, 3.5, 2.5, 1.0, -0.5, 0.0, 1.5, -1.0, -2.5],
    hires_air: [0.0, 0.5, 0.5, 0.0, 0.5, 1.0, 2.0, 3.5, 5.0, 5.5],
    bass_boom: [7.0, 6.0, 4.5, 2.0, 0.5, 0.0, 0.0, 0.5, 1.0, 1.0],
    vocal: [-1.0, -1.0, 0.0, 1.0, 2.5, 3.5, 3.0, 2.0, 1.0, 0.5]
  };

  var playQueue = [];
  var currentTrackIndex = -1;
  var currentTrackData = null;

  function initAudioContext() {
    if (isAudioContextInit) return;
    try {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();

      sourceNode = audioCtx.createMediaElementSource(audioEl);
      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 128;
      analyserNode.smoothingTimeConstant = 0.8;

      // Build 10-band peaking filter chain
      var prevNode = sourceNode;
      eqFilters = EQ_FREQUENCIES.map(function(freq, index) {
        var filter = audioCtx.createBiquadFilter();
        if (index === 0) {
          filter.type = 'lowshelf';
        } else if (index === EQ_FREQUENCIES.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = 0;

        prevNode.connect(filter);
        prevNode = filter;
        return filter;
      });

      prevNode.connect(analyserNode);
      analyserNode.connect(audioCtx.destination);
      isAudioContextInit = true;
    } catch (err) {
      console.warn('Web Audio API EQ initialization deferred or limited by browser policy:', err);
    }
  }

  // --- AutoEQ & Sliders API ---
  function setEqBandGain(bandIndex, gainDb) {
    if (bandIndex < 0 || bandIndex >= eqFilters.length) return;
    var clamped = Math.max(-12, Math.min(12, parseFloat(gainDb) || 0));
    if (eqFilters[bandIndex]) {
      eqFilters[bandIndex].gain.setTargetAtTime(clamped, audioCtx ? audioCtx.currentTime : 0, 0.05);
    }
    var gainLabel = document.getElementById('eq-gain-val-' + bandIndex);
    if (gainLabel) {
      gainLabel.innerText = (clamped > 0 ? '+' : '') + clamped.toFixed(1) + ' dB';
    }
    var slider = document.getElementById('eq-slider-' + bandIndex);
    if (slider) slider.value = clamped;
  }

  function applyAutoEqPreset(presetName) {
    var gains = AUTOEQ_PRESETS[presetName] || AUTOEQ_PRESETS.flat;
    gains.forEach(function(gain, idx) {
      setEqBandGain(idx, gain);
    });

    document.querySelectorAll('.autoeq-chip').forEach(function(chip) {
      chip.classList.toggle('active', chip.dataset.preset === presetName);
    });
  }

  // --- Visualizer Rendering Loop ---
  function startVisualizer() {
    var canvas = document.getElementById('audio-visualizer-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var dataArray = new Uint8Array(analyserNode ? analyserNode.frequencyBinCount : 64);

    function render() {
      requestAnimationFrame(render);
      if (!analyserNode || audioEl.paused) {
        // Idle animation / quiet state
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        updateVuMeters(0, 0);
        return;
      }

      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var barWidth = (canvas.width / dataArray.length) * 2.2;
      var x = 0;

      var sumBass = 0;
      var sumTreble = 0;

      for (var i = 0; i < dataArray.length; i++) {
        var barHeight = (dataArray[i] / 255) * canvas.height * 0.95;

        // Gradient 80s hot pink -> cyan
        var grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, '#ff2a7a');
        grad.addColorStop(0.6, '#ffd166');
        grad.addColorStop(1, '#00f0ff');

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

        if (i < 8) sumBass += dataArray[i];
        if (i > dataArray.length - 16) sumTreble += dataArray[i];

        x += barWidth;
        if (x > canvas.width) break;
      }

      var vuLeft = Math.min(100, (sumBass / (8 * 255)) * 130);
      var vuRight = Math.min(100, (sumTreble / (16 * 255)) * 140);
      updateVuMeters(vuLeft, vuRight);
    }
    render();
  }

  function updateVuMeters(leftPct, rightPct) {
    var barL = document.getElementById('vu-bar-l');
    var barR = document.getElementById('vu-bar-r');
    if (barL) barL.style.width = Math.round(leftPct) + '%';
    if (barR) barR.style.width = Math.round(rightPct) + '%';
  }

  // --- Playback Engine ---
  function playTrackAt(index) {
    if (index < 0 || index >= playQueue.length) return;
    currentTrackIndex = index;
    var t = playQueue[index];
    currentTrackData = t;

    initAudioContext();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    updatePlayerUi(t, 'Resolving bit-perfect FLAC stream...');

    var metaParams = (t.title ? '&title=' + encodeURIComponent(t.title) : '') + (t.artist ? '&artist=' + encodeURIComponent(t.artist) : '');
    var directApi = '/stream/' + encodeURIComponent(t.id) + '?quality=LOSSLESS' + metaParams;
    var proxyApi = '/stream/' + encodeURIComponent(t.id) + '/audio?quality=LOSSLESS' + metaParams;

    fetch(directApi)
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data) {
        if (!data || !data.url) throw new Error('No stream rendition');
        loadAndPlay(data.url, proxyApi, t);
      })
      .catch(function() {
        // Fallback to proxy
        loadAndPlay(proxyApi, null, t);
      });
  }

  function loadAndPlay(url, fallbackUrl, t) {
    audioEl.src = url;
    audioEl.load();
    audioEl.play()
      .then(function() {
        updatePlayerUi(t, 'Playing', true);
        setSpoolsSpinning(true);
      })
      .catch(function(err) {
        if (fallbackUrl) {
          console.warn('Direct stream rejected, switching to gateway audio proxy...', err);
          loadAndPlay(fallbackUrl, null, t);
        } else {
          updatePlayerUi(t, 'Playback notice: ' + err.message, false);
          setSpoolsSpinning(false);
        }
      });
  }

  function setSpoolsSpinning(spinning) {
    document.querySelectorAll('.spool').forEach(function(spool) {
      spool.classList.toggle('spinning', spinning);
    });
  }

  function updatePlayerUi(t, statusText, isPlaying) {
    // Tape counter & info
    var titleEl = document.getElementById('tape-display-title');
    var artistEl = document.getElementById('tape-display-artist');
    var statusEl = document.getElementById('player-status-badge');
    if (titleEl) titleEl.innerText = t.title || 'Untitled Track';
    if (artistEl) artistEl.innerText = t.artist || t.album || 'Lossless Stream';
    if (statusEl) statusEl.innerText = statusText;

    // Toggle Play/Pause button
    var playBtn = document.getElementById('master-play-btn');
    if (playBtn) {
      playBtn.innerHTML = isPlaying
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>PAUSE</span>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>PLAY</span>';
    }

    renderQueueUi();
  }

  function renderQueueUi() {
    var queueContainer = document.getElementById('studio-queue-list');
    if (!queueContainer) return;
    if (playQueue.length === 0) {
      queueContainer.innerHTML = '<div style="font-size:12px;color:var(--text-dim);padding:12px;">Queue is empty. Search tracks to add!</div>';
      return;
    }
    var html = '';
    for (var i = 0; i < playQueue.length; i++) {
      var item = playQueue[i];
      var isCurrent = (i === currentTrackIndex);
      html += '<div class="queue-item ' + (isCurrent ? 'playing' : '') + '">' +
        '<div style="min-width:0;flex:1;">' +
          '<div style="font-size:13px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (item.title || 'Track') + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted);">' + (item.artist || 'Unknown') + '</div>' +
        '</div>' +
        '<button onclick="window.player.playIndex(' + i + ')" style="background:none;border:none;color:' + (isCurrent ? 'var(--neon-mint)' : 'var(--neon-pink)') + ';cursor:pointer;font-weight:800;font-size:12px;">' + (isCurrent ? '▶ PLAYING' : 'PLAY') + '</button>' +
      '</div>';
    }
    queueContainer.innerHTML = html;
  }

  // --- Audio Events ---
  audioEl.addEventListener('timeupdate', function() {
    var counterEl = document.getElementById('lcd-time-counter');
    if (counterEl) {
      var cur = Math.floor(audioEl.currentTime || 0);
      var m = Math.floor(cur / 60);
      var s = cur % 60;
      counterEl.innerText = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
  });

  audioEl.addEventListener('ended', function() {
    // Auto-advance to next track in queue
    if (currentTrackIndex + 1 < playQueue.length) {
      playTrackAt(currentTrackIndex + 1);
    } else {
      setSpoolsSpinning(false);
      updatePlayerUi(currentTrackData, 'Finished', false);
    }
  });

  audioEl.addEventListener('pause', function() {
    setSpoolsSpinning(false);
    if (currentTrackData) updatePlayerUi(currentTrackData, 'Paused', false);
  });

  audioEl.addEventListener('play', function() {
    setSpoolsSpinning(true);
    if (currentTrackData) updatePlayerUi(currentTrackData, 'Playing', true);
  });

  // --- Public API ---
  window.player = {
    playTrack: function(track) {
      playQueue.push(track);
      playTrackAt(playQueue.length - 1);
    },
    addToQueue: function(track) {
      playQueue.push(track);
      renderQueueUi();
    },
    playIndex: function(idx) {
      playTrackAt(idx);
    },
    togglePlay: function() {
      if (audioEl.paused) {
        initAudioContext();
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        audioEl.play().catch(function() {});
      } else {
        audioEl.pause();
      }
    },
    next: function() {
      if (currentTrackIndex + 1 < playQueue.length) playTrackAt(currentTrackIndex + 1);
    },
    prev: function() {
      if (currentTrackIndex > 0) playTrackAt(currentTrackIndex - 1);
    },
    setBandGain: setEqBandGain,
    applyPreset: applyAutoEqPreset,
    initEqUI: function() {
      // Build 10 EQ slider controls into #eq-rack-container
      var rack = document.getElementById('eq-rack-container');
      if (!rack) return;
      var html = '';
      EQ_FREQUENCIES.forEach(function(freq, idx) {
        var label = freq >= 1000 ? (freq / 1000) + 'k' : freq + 'Hz';
        html += '<div class="eq-band-col">' +
          '<div class="eq-band-gain" id="eq-gain-val-' + idx + '">0.0 dB</div>' +
          '<input type="range" class="eq-slider-vertical" id="eq-slider-' + idx + '" min="-12" max="12" step="0.5" value="0" oninput="window.player.setBandGain(' + idx + ', this.value)">' +
          '<div class="eq-band-freq">' + label + '</div>' +
        '</div>';
      });
      rack.innerHTML = html;
      startVisualizer();
    }
  };

})(window);
