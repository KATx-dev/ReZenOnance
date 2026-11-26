/* ReZenOnance Obsidian Portal Controller — real-time community polling, theme sync, links & audition */
(function () {
  var THEME_KEY = 'rezenonance:theme';
  var origin = window.location.origin;

  var URLS = {
    master: origin + '/manifest.json',
    arcod: origin + '/p/arcod/manifest.json',
    monochrome: origin + '/p/monochrome/manifest.json',
  };

  var personalManifestUrl = '';
  var auditionAudio = new Audio();
  auditionAudio.crossOrigin = 'anonymous';
  var activePreviewTrack = null;

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatTime(secs) {
    var total = Math.max(0, Math.floor(Number(secs) || 0));
    var m = Math.floor(total / 60);
    var s = total % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function formatRelative(ts) {
    var diffSec = Math.max(0, Math.floor((Date.now() - Number(ts || 0)) / 1000));
    if (diffSec < 12) return 'just now';
    if (diffSec < 60) return diffSec + 's ago';
    var mins = Math.floor(diffSec / 60);
    if (mins < 60) return mins + 'm ago';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    return Math.floor(hrs / 24) + 'd ago';
  }

  function showToast(msg) {
    var el = $('portal-toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(el._timer);
    el._timer = setTimeout(function () {
      el.hidden = true;
    }, 2600);
  }

  function setTheme(theme) {
    if (theme !== 'aurora' && theme !== 'sunset' && theme !== 'noir' && theme !== 'mono') return;
    document.documentElement.setAttribute('data-theme', theme);
    var stage = $('portal-stage');
    if (stage) stage.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}
    document.querySelectorAll('[data-theme-btn]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-theme-btn') === theme);
    });
  }

  function switchView(name) {
    document.querySelectorAll('[data-nav]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-nav') === name);
    });

    var sections = document.querySelectorAll('[data-section]');
    sections.forEach(function (sec) {
      var kind = sec.getAttribute('data-section');
      if (name === 'home') {
        sec.hidden = false;
      } else {
        sec.hidden = kind !== name;
      }
    });
  }

  function copyText(url, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        function () {
          showToast(label + ' copied');
        },
        function () {
          window.prompt('Copy URL:', url);
        }
      );
    } else {
      window.prompt('Copy URL:', url);
    }
  }

  function copyMasterLink() {
    copyText(URLS.master, 'Universal Master Link');
  }

  function copySplitLink(path, label) {
    copyText(origin + path, label || 'Split Link');
  }

  function openBitChord(kind) {
    var target = kind === 'personal' ? personalManifestUrl : URLS[kind] || URLS.master;
    if (!target) return showToast('Mint a personal link first');
    window.location.href = 'bitchord://addon/' + encodeURIComponent(target);
  }

  function toggleQrModal(kind) {
    var target = kind === 'personal' ? personalManifestUrl : URLS[kind] || URLS.master;
    if (!target) return;
    $('qr-url-label').textContent = target;
    $('qr-image').src =
      'https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=1&data=' + encodeURIComponent(target);
    $('qr-modal').hidden = false;
  }

  function closeQrModal() {
    $('qr-modal').hidden = true;
  }

  function hydrateUrls() {
    if ($('master-url-text')) $('master-url-text').textContent = URLS.master;
    if ($('arcod-url-text')) $('arcod-url-text').textContent = URLS.arcod;
    if ($('monochrome-url-text')) $('monochrome-url-text').textContent = URLS.monochrome;
  }

  function refreshTelemetry() {
    fetch('/api/telemetry')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data || !Array.isArray(data.sources)) return;
        var up = data.sources.filter(function (s) { return s.status === 'operational'; }).length;
        var pill = $('upstream-health-pill');
        if (pill) pill.textContent = up + '/' + data.sources.length + ' clusters online';

        data.sources.forEach(function (src) {
          var lower = String(src.name || '').toLowerCase();
          var key = lower.indexOf('monochrome') >= 0 ? 'monochrome' : (lower.indexOf('arcod') >= 0 || lower.indexOf('instable') >= 0 ? 'arcod' : '');
          var badge = key ? $('badge-' + key) : null;
          if (badge) {
            badge.textContent = src.status === 'operational'
              ? (src.latency ? 'Online · ' + src.latency + 'ms' : 'Online')
              : 'Paused';
          }
        });
      })
      .catch(function () {});
  }

  function refreshCommunity(manual) {
    fetch('/api/community', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data) return;
        var tracksCount = Number(data.cachedStreamsCount || 0);
        var hitsCount = Number(data.totalHits || 0);
        var missesCount = Number(data.totalMisses || 0);
        var savedMb = Number(data.estimatedMbSaved || 0);
        var totalPlays = Number(data.totalPlays || (hitsCount + missesCount));
        var hitRatio = hitsCount + missesCount > 0
          ? Math.round((hitsCount / (hitsCount + missesCount)) * 100)
          : (totalPlays > 0 && tracksCount > 0 ? Math.min(100, Math.round((hitsCount / totalPlays) * 100)) : 0);

        if ($('metric-cached-tracks')) $('metric-cached-tracks').textContent = tracksCount.toLocaleString();
        if ($('metric-cache-hits')) $('metric-cache-hits').textContent = hitsCount.toLocaleString();
        if ($('metric-saved-mb')) $('metric-saved-mb').textContent = savedMb.toLocaleString() + ' MB';
        if ($('metric-hit-ratio')) $('metric-hit-ratio').textContent = hitRatio + '%';
        if ($('metric-total-plays')) $('metric-total-plays').textContent = totalPlays.toLocaleString() + ' logged plays';

        if ($('hero-stat-cached')) $('hero-stat-cached').textContent = tracksCount + ' cached streams';
        if ($('hero-stat-hits')) $('hero-stat-hits').textContent = hitsCount + ' shared hits';

        var mode = data.persistenceBackend || 'disk+memory';
        var days = data.retentionDays || 30;
        var backendLabel =
          mode === 'upstash-redis'
            ? 'Upstash Redis · ' + days + 'd persistent'
            : mode === 'supabase'
              ? 'Supabase DB · ' + days + 'd persistent'
              : 'L1 Disk+Memory · ' + days + 'd TTL';

        if ($('cache-persistence-badge')) $('cache-persistence-badge').textContent = backendLabel;
        if ($('hero-backend-pill')) $('hero-backend-pill').textContent = backendLabel;

        renderRouteBreakdown(data.providerBreakdown || {});
        renderRecentPlays(data.recentPlays || []);
        renderTopCached(data.topCachedTracks || []);

        if (manual) showToast('Community cache synced');
      })
      .catch(function () {});
  }

  function renderRouteBreakdown(breakdown) {
    var wrap = $('route-pills');
    if (!wrap) return;
    var entries = Object.keys(breakdown);
    if (entries.length === 0) {
      wrap.innerHTML = '<span class="status-pill">Waiting for first stream event…</span>';
      return;
    }
    wrap.innerHTML = entries
      .map(function (route) {
        return (
          '<span class="status-pill">' +
          escapeHtml(route) +
          ': <strong>' +
          Number(breakdown[route] || 0) +
          '</strong></span>'
        );
      })
      .join('');
  }

  function renderRecentPlays(plays) {
    var container = $('recent-plays-feed');
    if (!container) return;
    if (!plays || plays.length === 0) {
      container.innerHTML = '<p class="empty-note">No live streams logged yet. Play from Search or any BitChord link.</p>';
      return;
    }
    container.innerHTML = plays
      .slice(0, 24)
      .map(function (item) {
        var tagCls = item.cacheHit ? 'pill tag-hit' : 'pill tag-live';
        var tagTxt = item.cacheHit ? 'CACHE HIT' : 'LIVE';
        return (
          '<div class="feed-item">' +
          '<div class="feed-item__info">' +
          '<span class="feed-item__title">' + escapeHtml(item.title) + '</span>' +
          '<span class="feed-item__meta">' +
          escapeHtml(item.artist) +
          ' · ' +
          escapeHtml(item.routePrefix || item.route || '/') +
          (item.deliveryMode ? ' (' + escapeHtml(item.deliveryMode) + ')' : '') +
          ' · ' +
          formatRelative(item.playedAt) +
          '</span>' +
          '</div>' +
          '<div class="feed-item__tags">' +
          '<span class="' + tagCls + '">' + tagTxt + '</span>' +
          '<button class="btn btn--ghost btn--sm" data-play-id="' + escapeHtml(item.id) + '" data-play-title="' + escapeHtml(item.title) + '" data-play-artist="' + escapeHtml(item.artist) + '" data-play-art="' + escapeHtml(item.artworkURL || '') + '">Play</button>' +
          '</div>' +
          '</div>'
        );
      })
      .join('');
    bindPlayButtons(container);
  }

  function renderTopCached(tracks) {
    var container = $('top-cached-table');
    if (!container) return;
    if (!tracks || tracks.length === 0) {
      container.innerHTML = '<p class="empty-note">No cached streams yet. Play any track to seed the 30-day cache.</p>';
      return;
    }
    container.innerHTML = tracks
      .slice(0, 15)
      .map(function (track) {
        var art = track.artworkURL
          ? '<img src="' + escapeHtml(track.artworkURL) + '" alt="" loading="lazy" />'
          : escapeHtml((track.title || 'R').slice(0, 2).toUpperCase());
        return (
          '<div class="track-row">' +
          '<div class="track-row__art">' + art + '</div>' +
          '<div class="track-row__main">' +
          '<span class="track-row__title">' + escapeHtml(track.title) + '</span>' +
          '<span class="track-row__artist">' + escapeHtml(track.artist) + '</span>' +
          '</div>' +
          '<span class="track-row__badge">' + escapeHtml((track.provider || track.format || 'flac').toUpperCase()) + '</span>' +
          '<span class="track-row__hits">' + Number(track.hits || 0) + ' hits</span>' +
          '<button class="btn btn--ghost btn--sm" data-play-id="' + escapeHtml(track.id) + '" data-play-title="' + escapeHtml(track.title) + '" data-play-artist="' + escapeHtml(track.artist) + '" data-play-art="' + escapeHtml(track.artworkURL || '') + '">Play</button>' +
          '</div>'
        );
      })
      .join('');
    bindPlayButtons(container);
  }

  function bindPlayButtons(scope) {
    scope.querySelectorAll('[data-play-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        playPreview({
          id: btn.getAttribute('data-play-id'),
          title: btn.getAttribute('data-play-title') || 'Unknown Track',
          artist: btn.getAttribute('data-play-artist') || 'Unknown Artist',
          album: btn.getAttribute('data-play-album') || '',
          artworkURL: btn.getAttribute('data-play-art') || '',
        });
      });
    });
  }

  function buildMetaQuery(track) {
    var qs = 'quality=LOSSLESS';
    if (track.title) qs += '&title=' + encodeURIComponent(track.title);
    if (track.artist) qs += '&artist=' + encodeURIComponent(track.artist);
    if (track.album) qs += '&album=' + encodeURIComponent(track.album);
    if (track.artworkURL) qs += '&artwork=' + encodeURIComponent(track.artworkURL);
    return qs;
  }

  function playPreview(track) {
    if (!track || !track.id) return;
    activePreviewTrack = track;
    var routePrefix = ($('portal-route-select') && $('portal-route-select').value) || '';
    var mini = $('mini-player');
    mini.hidden = false;
    $('mini-title').textContent = track.title;
    $('mini-artist').textContent = track.artist;
    $('mini-art').innerHTML = track.artworkURL
      ? '<img src="' + escapeHtml(track.artworkURL) + '" alt="" />'
      : '';
    $('mini-open-player').href =
      '/player?id=' +
      encodeURIComponent(track.id) +
      '&title=' +
      encodeURIComponent(track.title || '') +
      '&artist=' +
      encodeURIComponent(track.artist || '') +
      (track.artworkURL ? '&artwork=' + encodeURIComponent(track.artworkURL) : '');

    var qs = buildMetaQuery(track);
    var streamEndpoint = routePrefix + '/stream/' + encodeURIComponent(track.id) + '?' + qs;
    var fallback = origin + routePrefix + '/stream/' + encodeURIComponent(track.id) + '/audio?' + qs;
    fetch(streamEndpoint)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var direct = data && (data.url || (data.stream && data.stream.url)) ? (data.url || data.stream.url) : '';
        startAudioWithFallback(direct || fallback, fallback);
        setTimeout(function () { refreshCommunity(false); }, 800);
      })
      .catch(function () {
        startAudioWithFallback(fallback, fallback);
      });
  }

  function startAudioWithFallback(primaryUrl, fallbackUrl) {
    var retried = false;
    auditionAudio.onerror = function () {
      if (!retried && fallbackUrl && auditionAudio.src !== fallbackUrl) {
        retried = true;
        auditionAudio.src = fallbackUrl;
        auditionAudio.play().catch(function () {});
      }
    };
    auditionAudio.src = primaryUrl;
    auditionAudio.play().then(syncMiniState).catch(function () {
      if (!retried && fallbackUrl) {
        retried = true;
        auditionAudio.src = fallbackUrl;
        auditionAudio.play().then(syncMiniState).catch(function () {});
      }
    });
  }

  function syncMiniState() {
    var icon = $('mini-play-icon');
    if (!icon) return;
    icon.innerHTML = auditionAudio.paused
      ? '<path d="M8 5.4v13.2L19 12z"/>'
      : '<rect x="7.5" y="5" width="3.5" height="14" rx="1"/><rect x="13" y="5" width="3.5" height="14" rx="1"/>';
  }

  function toggleMiniPlay() {
    if (!activePreviewTrack) return;
    if (auditionAudio.paused) auditionAudio.play().catch(function () {});
    else auditionAudio.pause();
    syncMiniState();
  }

  function stopMiniPlayer() {
    auditionAudio.pause();
    auditionAudio.removeAttribute('src');
    $('mini-player').hidden = true;
  }

  auditionAudio.addEventListener('timeupdate', function () {
    var dur = Number(auditionAudio.duration) || 0;
    var cur = Number(auditionAudio.currentTime) || 0;
    if ($('mini-time-cur')) $('mini-time-cur').textContent = formatTime(cur);
    if ($('mini-time-dur')) $('mini-time-dur').textContent = formatTime(dur);
    if ($('mini-bar-fill')) {
      $('mini-bar-fill').style.width = dur > 0 ? Math.min(100, (cur / dur) * 100) + '%' : '0%';
    }
  });
  auditionAudio.addEventListener('play', syncMiniState);
  auditionAudio.addEventListener('pause', syncMiniState);

  function quickSearch(q) {
    var input = $('portal-search-input');
    if (!input) return;
    input.value = q;
    runPortalSearch();
  }

  function runPortalSearch() {
    var input = $('portal-search-input');
    var routePrefix = ($('portal-route-select') && $('portal-route-select').value) || '';
    var q = input ? input.value.trim() : '';
    if (!q) return showToast('Enter a search query');
    var btn = $('portal-search-btn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Searching…';
    }
    fetch(routePrefix + '/search?q=' + encodeURIComponent(q) + '&quality=LOSSLESS')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var wrap = $('audition-results-wrap');
        var list = $('audition-results-list');
        var tracks = (data && (data.tracks || data.results)) || [];
        wrap.hidden = false;
        if (tracks.length === 0) {
          list.innerHTML = '<p class="empty-note">No tracks matched on this route.</p>';
          return;
        }
        list.innerHTML = tracks
          .slice(0, 12)
          .map(function (t) {
            var art = t.artworkURL
              ? '<img src="' + escapeHtml(t.artworkURL) + '" alt="" loading="lazy" />'
              : 'FLAC';
            var qLink =
              '/player?id=' +
              encodeURIComponent(t.id) +
              '&title=' +
              encodeURIComponent(t.title || '') +
              '&artist=' +
              encodeURIComponent(t.artist || '') +
              (t.album ? '&album=' + encodeURIComponent(t.album) : '') +
              (t.artworkURL ? '&artwork=' + encodeURIComponent(t.artworkURL) : '');
            return (
              '<div class="track-row">' +
              '<div class="track-row__art">' + art + '</div>' +
              '<div class="track-row__main">' +
              '<span class="track-row__title">' + escapeHtml(t.title) + '</span>' +
              '<span class="track-row__artist">' + escapeHtml(t.artist) + '</span>' +
              '</div>' +
              '<span class="track-row__badge">' + escapeHtml((t.provider || 'lossless').toUpperCase()) + '</span>' +
              '<a href="' + qLink + '" class="btn btn--plain btn--sm">In /player</a>' +
              '<button class="btn btn--solid btn--sm" data-play-id="' + escapeHtml(t.id) + '" data-play-title="' + escapeHtml(t.title) + '" data-play-artist="' + escapeHtml(t.artist) + '" data-play-album="' + escapeHtml(t.album || '') + '" data-play-art="' + escapeHtml(t.artworkURL || '') + '">Play</button>' +
              '</div>'
            );
          })
          .join('');
        bindPlayButtons(list);
      })
      .catch(function () {
        showToast('Search failed upstream');
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Search';
        }
      });
  }

  function loadSessionGateway() {
    fetch('/api/auth/me')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.authenticated && data.addon && data.addon.slug) {
          setPersonalGateway(data.addon.slug);
        }
      })
      .catch(function () {});
  }

  function setPersonalGateway(slug) {
    personalManifestUrl = origin + '/u/' + encodeURIComponent(slug) + '/manifest.json';
    if ($('personal-url-text')) $('personal-url-text').textContent = personalManifestUrl;
    if ($('personal-status-tag')) $('personal-status-tag').textContent = 'Active · ' + slug;
    if ($('personal-actions')) {
      $('personal-actions').innerHTML =
        '<button class="btn btn--solid btn--sm" onclick="copySplitLink(\'/u/' + encodeURIComponent(slug) + '/manifest.json\', \'Personal Gateway\')">Copy Gateway Link</button>' +
        '<button class="btn btn--ghost btn--sm" onclick="openBitChord(\'personal\')">BitChord</button>';
    }
  }

  function mintGuestGateway() {
    fetch('/api/auth/guest', { method: 'POST' })
      .then(function (r) { return r.json(); })
      .then(function (session) {
        if (!session || !session.user || !session.user.email) throw new Error('Guest session error');
        return fetch('/api/user/claim-addon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.user.email }),
        });
      })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.addon && res.addon.addon_slug) {
          setPersonalGateway(res.addon.addon_slug);
          showToast('Guest gateway minted');
        }
      })
      .catch(function () {
        showToast('Could not mint guest gateway');
      });
  }

  function openClaimPrompt() {
    var email = window.prompt('Enter your permanent email to claim a personal gateway slug:');
    if (!email) return;
    fetch('/api/user/claim-addon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.addon && res.addon.addon_slug) {
          setPersonalGateway(res.addon.addon_slug);
          showToast('Personal gateway active');
        } else {
          showToast(res.error || 'Claim failed');
        }
      })
      .catch(function () {
        showToast('Claim request failed');
      });
  }

  window.switchView = switchView;
  window.setTheme = setTheme;
  window.copyMasterLink = copyMasterLink;
  window.copySplitLink = copySplitLink;
  window.openBitChord = openBitChord;
  window.toggleQrModal = toggleQrModal;
  window.closeQrModal = closeQrModal;
  window.refreshCommunity = refreshCommunity;
  window.runPortalSearch = runPortalSearch;
  window.quickSearch = quickSearch;
  window.toggleMiniPlay = toggleMiniPlay;
  window.stopMiniPlayer = stopMiniPlayer;
  window.mintGuestGateway = mintGuestGateway;
  window.openClaimPrompt = openClaimPrompt;

  document.addEventListener('DOMContentLoaded', function () {
    var savedTheme = 'aurora';
    try {
      var stored = localStorage.getItem(THEME_KEY);
      if (stored === 'aurora' || stored === 'sunset' || stored === 'noir' || stored === 'mono') {
        savedTheme = stored;
      }
    } catch (e) {}
    setTheme(savedTheme);
    hydrateUrls();
    refreshTelemetry();
    refreshCommunity(false);
    loadSessionGateway();

    var input = $('portal-search-input');
    if (input) {
      input.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          runPortalSearch();
        }
      });
    }

    setInterval(function () {
      refreshCommunity(false);
    }, 8000);
  });
})();
