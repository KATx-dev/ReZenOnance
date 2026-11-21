/**
 * ReZenOnance Nightly · 80s Pop Reactive Application Controller
 * Handles SPA navigation, Universal Link copying, Provider hub, Jukebox telemetry, and Search
 */

(function(window) {
  'use strict';

  var currentView = 'station';

  window.switchView = function(viewId) {
    currentView = viewId;

    // Toggle views
    document.querySelectorAll('.app-view').forEach(function(view) {
      view.classList.remove('active');
    });
    var targetView = document.getElementById('view-' + viewId);
    if (targetView) targetView.classList.add('active');

    // Toggle bottom dock items
    document.querySelectorAll('.dock-item-btn').forEach(function(btn) {
      btn.classList.remove('active');
    });
    var targetBtn = document.getElementById('dock-btn-' + viewId);
    if (targetBtn) targetBtn.classList.add('active');

    // Sync hash
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '#' + viewId);
    }

    if (viewId === 'jukebox') {
      fetchCommunityTelemetry();
    }
  };

  // Restore view from URL hash
  var initialHash = window.location.hash.replace('#', '');
  if (['station', 'providers', 'jukebox', 'studio'].indexOf(initialHash) !== -1) {
    window.switchView(initialHash);
  }

  // --- Universal Link Management ---
  function getMasterManifestUrl() {
    return window.location.origin + '/manifest.json';
  }

  function getProviderManifestUrl(slug) {
    return window.location.origin + '/p/' + slug + '/manifest.json';
  }

  function updateLinkDisplay() {
    var masterInput = document.getElementById('master-link-input');
    if (masterInput) masterInput.value = getMasterManifestUrl();
    var bitchordBtn = document.getElementById('bitchord-install-link');
    if (bitchordBtn) bitchordBtn.href = 'bitchord://install-addon?url=' + encodeURIComponent(getMasterManifestUrl());
  }
  updateLinkDisplay();

  window.copyMasterLink = function() {
    var url = getMasterManifestUrl();
    navigator.clipboard.writeText(url).then(function() {
      var btn = document.getElementById('copy-master-btn-text');
      if (btn) btn.innerText = 'Copied to Clipboard!';
      setTimeout(function() { if (btn) btn.innerText = 'Copy Universal Link'; }, 2200);
    }).catch(function() {
      prompt('Copy your Universal Addon URL:', url);
    });
  };

  window.copyProviderLink = function(providerSlug, buttonId) {
    var url = getProviderManifestUrl(providerSlug);
    navigator.clipboard.writeText(url).then(function() {
      var btn = document.getElementById(buttonId);
      if (btn) btn.innerText = 'Copied!';
      setTimeout(function() { if (btn) btn.innerText = 'Copy Addon Link'; }, 2200);
    }).catch(function() {
      prompt('Copy Provider Addon URL:', url);
    });
  };

  // --- QR Code Modal ---
  window.openQrModal = function(customUrl) {
    var url = customUrl || getMasterManifestUrl();
    var qrImg = '<img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=' + encodeURIComponent(url) + '&margin=8&color=120e24" alt="QR" style="border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,0.6);">';
    var box = document.getElementById('qr-code-target');
    if (box) box.innerHTML = qrImg;
    var urlText = document.getElementById('qr-url-text');
    if (urlText) urlText.innerText = url;
    var modal = document.getElementById('qr-modal');
    if (modal) modal.classList.add('open');
  };

  window.closeQrModal = function() {
    var modal = document.getElementById('qr-modal');
    if (modal) modal.classList.remove('open');
  };

  // --- Community Jukebox Telemetry ---
  function fetchCommunityTelemetry() {
    fetch('/api/community')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        var cachedStreamsEl = document.getElementById('stat-cached-streams');
        var cacheHitsEl = document.getElementById('stat-cache-hits');
        var mbSavedEl = document.getElementById('stat-mb-saved');
        var hitRatioEl = document.getElementById('stat-hit-ratio');

        if (cachedStreamsEl) cachedStreamsEl.innerText = data.cachedStreamsCount || 0;
        if (cacheHitsEl) cacheHitsEl.innerText = data.totalHits || 0;
        if (mbSavedEl) mbSavedEl.innerText = (data.estimatedMbSaved || 0) + ' MB';

        var totalReqs = (data.totalHits || 0) + (data.totalMisses || 0);
        var ratio = totalReqs > 0 ? Math.round((data.totalHits / totalReqs) * 100) : 100;
        if (hitRatioEl) hitRatioEl.innerText = ratio + '%';

        // Render popular cached songs
        var tableBody = document.getElementById('top-songs-table-body');
        if (tableBody) {
          if (!data.topCachedTracks || data.topCachedTracks.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-dim);padding:18px;">Community cache warming up. Listen to tracks to populate!</td></tr>';
            return;
          }
          var html = '';
          data.topCachedTracks.forEach(function(song, i) {
            html += '<tr>' +
              '<td style="font-family:\'JetBrains Mono\';color:var(--neon-pink);font-weight:800;">#' + (i + 1) + '</td>' +
              '<td style="font-weight:700;color:#fff;">' + (song.title || 'Unknown Track') + '</td>' +
              '<td style="color:var(--text-muted);">' + (song.artist || 'Unknown Artist') + '</td>' +
              '<td style="font-family:\'JetBrains Mono\';color:var(--neon-mint);font-weight:800;">⚡ ' + song.hits + ' hits</td>' +
            '</tr>';
          });
          tableBody.innerHTML = html;
        }
      })
      .catch(function(err) {
        console.warn('Community telemetry error:', err);
      });
  }

  // --- Search Engine ---
  var currentSearchResults = [];

  window.handleSearch = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    var input = document.getElementById('search-query-field');
    var q = input ? input.value.trim() : '';
    if (!q) return false;

    var statusEl = document.getElementById('search-feedback-text');
    var listEl = document.getElementById('search-results-list');
    if (statusEl) statusEl.innerHTML = '<span style="color:var(--neon-cyan);">Racing upstream lossless nodes for "' + q + '"...</span>';
    if (listEl) listEl.innerHTML = '';

    fetch('/search?q=' + encodeURIComponent(q) + '&quality=LOSSLESS')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        currentSearchResults = data.tracks || [];
        if (!currentSearchResults.length) {
          if (statusEl) statusEl.innerText = 'No lossless tracks found. Try Daft Punk, Inertia AJR, or Pink Floyd.';
          return;
        }
        if (statusEl) statusEl.innerHTML = 'Found <strong>' + currentSearchResults.length + ' tracks</strong>. Playing directly caches bitstreams for the community!';

        var html = '';
        currentSearchResults.forEach(function(t, i) {
          var cover = t.artworkURL || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop';
          var artist = t.artist || t.album || 'Lossless Master';
          html += '<div style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:16px;padding:12px;display:flex;align-items:center;gap:14px;transition:all 0.2s ease;">' +
            '<img src="' + cover + '" alt="Cover" style="width:48px;height:48px;border-radius:10px;object-fit:cover;" loading="lazy">' +
            '<div style="flex:1;min-width:0;">' +
              '<div style="font-size:14px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + (t.title || 'Track') + '</div>' +
              '<div style="font-size:12px;color:var(--neon-gold);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + artist + '</div>' +
            '</div>' +
            '<div style="display:flex;gap:6px;">' +
              '<button class="chip-action" onclick="window.player.playTrack(currentSearchResults[' + i + '])" style="background:rgba(255,42,122,0.18);border-color:var(--neon-pink);color:#fff;" title="Play now">' +
                '▶ Play' +
              '</button>' +
              '<button class="chip-action" onclick="window.player.addToQueue(currentSearchResults[' + i + '])" title="Add to Queue">' +
                '+ Queue' +
              '</button>' +
            '</div>' +
          '</div>';
        });
        if (listEl) listEl.innerHTML = html;
      })
      .catch(function(err) {
        if (statusEl) statusEl.innerText = 'Search error: ' + err.message;
      });
    return false;
  };

  window.quickSearch = function(query) {
    var input = document.getElementById('search-query-field');
    if (input) {
      input.value = query;
      window.handleSearch();
    }
  };

  // Initialize Equalizer UI & Player
  document.addEventListener('DOMContentLoaded', function() {
    if (window.player && window.player.initEqUI) {
      window.player.initEqUI();
    }
  });

})(window);
