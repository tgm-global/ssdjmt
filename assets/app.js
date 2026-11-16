/* साझा स्क्रिप्ट: हेडर, फूटर, डेटा-रेंडरिंग, बुकिंग फ़ॉर्म, PWA */
(function () {
  'use strict';

  /* ---------- डेटा (config.js + admin पूर्वावलोकन) ---------- */
  var D = window.SITE_DEFAULT || {};
  var S = D;
  try {
    var o = JSON.parse(localStorage.getItem('ssdjmt_override') || 'null');
    if (o && o.baseStamp === D.updatedAt && o.data) S = o.data;
  } catch (e) {}
  window.SITE = S;
  (S.services || []).forEach(function (s, i) { if (!s.id) s.id = 's' + (i + 1); });

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var PAGES = [
    ['index.html', 'होम'], ['about.html', 'परिचय'], ['darshan.html', 'दर्शन व आरती'],
    ['seva.html', 'सेवाएँ'], ['booking.html', 'सेवा बुकिंग'], ['daan.html', 'दान'],
    ['events.html', 'उत्सव'], ['gallery.html', 'गैलरी'], ['library.html', 'पाठ-संग्रह'],
    ['contact.html', 'संपर्क']
  ];
  var TABS = [
    ['index.html', '🏠', 'होम'], ['darshan.html', '🛕', 'दर्शन'], ['seva.html', '🙏', 'सेवाएँ'],
    ['daan.html', '💝', 'दान'], ['contact.html', '📞', 'संपर्क']
  ];
  var cur = location.pathname.split('/').pop() || 'index.html';

  /* ---------- हेडर / फूटर ---------- */
  function buildChrome() {
    var h = $('#site-header');
    if (h) {
      h.innerHTML =
        '<header class="hdr"><div class="wrap hdr-in">' +
        '<a class="brand" href="index.html"><img src="assets/logo.svg" alt="मंदिर का लोगो" width="42" height="42">' +
        '<span><b>' + esc(S.name) + '</b><small>' + esc(S.address) + '</small></span></a>' +
        '<nav class="nav" id="nav" aria-label="मुख्य मेनू">' +
        PAGES.map(function (p) {
          return '<a href="' + p[0] + '"' + (p[0] === cur ? ' class="on"' : '') + '>' + p[1] + '</a>';
        }).join('') +
        '<button class="btn-install" id="btn-install" type="button">📲 ऐप इंस्टॉल करें</button>' +
        '</nav>' +
        '<button class="burger" id="burger" aria-label="मेनू खोलें" aria-expanded="false">☰</button>' +
        '</div></header>';
    }
    var f = $('#site-footer');
    if (f) {
      f.innerHTML =
        '<footer class="ftr"><div class="wrap ftr-in">' +
        '<div class="f-info">© ' + new Date().getFullYear() + ' ' + esc(S.name) + ' · ' + esc(S.address) +
        ' · <a href="tel:+91' + esc(S.phone) + '">📞 ' + esc(S.phone) + '</a></div>' +
        '<nav class="f-tabs" aria-label="त्वरित लिंक">' +
        TABS.map(function (t) {
          return '<a href="' + t[0] + '"' + (t[0] === cur ? ' class="on"' : '') + '><span class="ic">' + t[1] + '</span><span>' + t[2] + '</span></a>';
        }).join('') +
        '</nav></div></footer>';
    }
    var b = $('#burger'), n = $('#nav');
    if (b && n) {
      b.addEventListener('click', function () {
        var on = n.classList.toggle('open');
        b.setAttribute('aria-expanded', on ? 'true' : 'false');
        b.textContent = on ? '✕' : '☰';
      });
      $$('a', n).forEach(function (a) {
        a.addEventListener('click', function () { n.classList.remove('open'); b.textContent = '☰'; });
      });
    }
    var m = $('main');
    if (m && S.notice) {
      var d = document.createElement('div');
      d.className = 'notice';
      d.innerHTML = '<div class="wrap">' + esc(S.notice) + '</div>';
      m.insertBefore(d, m.firstChild);
    }
  }

  /* ---------- सेक्शन रेंडरर ---------- */
  function lim(el, arr) {
    var n = parseInt(el.getAttribute('data-limit') || '0', 10);
    return n > 0 ? arr.slice(0, n) : arr;
  }
  var R = {
    timings: function (el) {
      el.className = 'grid g3';
      el.innerHTML = (S.timings || []).map(function (t) {
        return '<div class="card time-card"><div class="ic">' + esc(t.icon || '🛕') + '</div><h3>' + esc(t.title) +
          '</h3><div class="t">' + esc(t.time) + '</div>' + (t.note ? '<div class="n">' + esc(t.note) + '</div>' : '') + '</div>';
      }).join('');
    },
    services: function (el) {
      el.className = 'grid g4';
      el.innerHTML = lim(el, S.services || []).map(function (s) {
        return '<div class="card"><div class="ic">' + esc(s.icon || '🙏') + '</div><h3>' + esc(s.name) + '</h3><p>' + esc(s.desc) + '</p>' +
          '<div class="amt">' + (s.amount ? '₹ ' + esc(s.amount) + ' से' : 'इच्छानुसार राशि') + '</div>' +
          '<a class="btn sm" href="booking.html?s=' + encodeURIComponent(s.id) + '">बुक करें</a></div>';
      }).join('');
    },
    events: function (el) {
      el.innerHTML = lim(el, S.events || []).map(function (e) {
        return '<div class="ev"><div class="d">' + esc(e.date) + '</div><div><h3>' + esc(e.title) + '</h3><p>' + esc(e.desc) + '</p></div></div>';
      }).join('');
    },
    gallery: function (el) {
      el.className = 'grid gal';
      el.innerHTML = lim(el, S.gallery || []).map(function (g) {
        return '<figure><img loading="lazy" src="' + esc(g.src) + '" alt="' + esc(g.caption) + '"><figcaption>' + esc(g.caption) + '</figcaption></figure>';
      }).join('');
      $$('figure img', el).forEach(function (img) {
        img.addEventListener('click', function () {
          var lb = $('#lightbox');
          if (!lb) { lb = document.createElement('div'); lb.id = 'lightbox'; lb.className = 'lightbox'; document.body.appendChild(lb);
            lb.addEventListener('click', function () { lb.classList.remove('on'); }); }
          lb.innerHTML = '<img src="' + esc(img.src) + '" alt="' + esc(img.alt) + '">';
          lb.classList.add('on');
        });
      });
    },
    about: function (el) {
      el.className = 'about-p';
      el.innerHTML = lim(el, S.about || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    },
    library: function (el) {
      el.innerHTML = (S.library || []).map(function (l, i) {
        return '<details class="lib"' + (i === 0 ? ' open' : '') + '><summary>' + esc(l.title) + '</summary><pre>' + esc(l.body) + '</pre></details>';
      }).join('');
    },
    dummywarn: function (el) {
      if (S.dummyDonation) el.innerHTML = '<div class="warn">⚠️ ध्यान दें: अभी UPI और बैंक विवरण केवल नमूना (डमी) हैं। असली विवरण जुड़ने तक इन पर भुगतान न करें।</div>';
    },
    bank: function (el) {
      var d = S.donation || {};
      var rows = [['खाता धारक का नाम', d.accountName], ['बैंक', d.bankName], ['खाता संख्या', d.accountNo], ['IFSC कोड', d.ifsc], ['शाखा', d.branch]];
      el.innerHTML = '<table class="tbl">' + rows.map(function (r) { return '<tr><th>' + r[0] + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</table>';
    },
    upi: function (el) {
      var d = S.donation || {};
      el.className = 'upi-box';
      el.innerHTML = (d.qrImage ? '<img src="' + esc(d.qrImage) + '" alt="UPI QR कोड">' : '') +
        '<div><div class="hint">UPI आईडी</div><div class="big">' + esc(d.upiId) + '</div><div class="hint">नाम: ' + esc(d.upiName) + '</div>' +
        '<p><a class="btn sm" href="upi://pay?pa=' + encodeURIComponent(d.upiId || '') + '&pn=' + encodeURIComponent(d.upiName || '') + '&cu=INR">UPI ऐप में खोलें</a></p></div>';
    },
    amounts: function (el) {
      el.className = 'amts';
      el.innerHTML = ['101', '251', '501', '1100', '2100', '5100'].map(function (a) {
        return '<a class="btn alt sm" href="booking.html?s=daan&amt=' + a + '">₹ ' + a + '</a>';
      }).join('');
    },
    map: function (el) {
      el.innerHTML = '<iframe title="मंदिर का नक्शा" loading="lazy" style="border:0;width:100%;height:340px;border-radius:14px" src="https://www.google.com/maps?q=' +
        encodeURIComponent(S.mapQuery || S.address) + '&output=embed"></iframe>';
    }
  };

  function bindData() {
    $$('[data-render]').forEach(function (el) {
      var fn = R[el.getAttribute('data-render')];
      if (fn) fn(el);
    });
    $$('[data-bind]').forEach(function (el) {
      var v = S[el.getAttribute('data-bind')];
      if (v != null) el.textContent = v;
    });
    $$('[data-link]').forEach(function (el) {
      var t = el.getAttribute('data-link');
      var map = {
        tel: 'tel:+91' + S.phone,
        wa: 'https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent('जय जिनेन्द्र 🙏'),
        mail: S.email ? 'mailto:' + S.email : '#',
        map: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(S.mapQuery || S.address)
      };
      if (map[t]) el.setAttribute('href', map[t]);
    });
  }

  /* ---------- बुकिंग फ़ॉर्म ---------- */
  function initBooking() {
    var form = $('#booking-form');
    if (!form) return;
    var sel = $('#f-service'), amt = $('#f-amount');
    sel.innerHTML = (S.services || []).map(function (s) {
      return '<option value="' + esc(s.id) + '">' + esc(s.name) + (s.amount ? ' (₹' + esc(s.amount) + ')' : '') + '</option>';
    }).join('');
    var q = new URLSearchParams(location.search);
    if (q.get('s')) sel.value = q.get('s');
    function svc() { return (S.services || []).filter(function (s) { return s.id === sel.value; })[0] || {}; }
    function setAmt() { amt.value = q.get('amt') && !amt.dataset.touched ? q.get('amt') : (svc().amount || ''); }
    sel.addEventListener('change', function () { q.delete('amt'); amt.dataset.touched = ''; setAmt(); });
    amt.addEventListener('input', function () { amt.dataset.touched = '1'; });
    setAmt();
    var dt = $('#f-date'); if (dt) dt.min = new Date().toISOString().slice(0, 10);

    function data() {
      var ref = form.dataset.ref || (form.dataset.ref = 'SSDJ-' + Date.now().toString(36).toUpperCase().slice(-6));
      return {
        ref: ref, service: svc().name || '', amount: amt.value, name: $('#f-name').value.trim(), phone: $('#f-phone').value.trim(),
        gotra: $('#f-gotra').value.trim(), date: $('#f-date').value, msg: $('#f-msg').value.trim(), at: new Date().toLocaleString('hi-IN')
      };
    }
    function text(d) {
      return '🙏 जय जिनेन्द्र\n' + S.name + '\nसेवा बुकिंग / दान\n\n' +
        'बुकिंग क्रमांक: ' + d.ref + '\nसेवा: ' + d.service + '\nराशि: ₹' + (d.amount || '—') + '\nनाम: ' + d.name + '\nमोबाइल: ' + d.phone +
        (d.gotra ? '\nगोत्र/पता: ' + d.gotra : '') + (d.date ? '\nतिथि: ' + d.date : '') + (d.msg ? '\nसंदेश: ' + d.msg : '');
    }
    function save(d) {
      try {
        var l = JSON.parse(localStorage.getItem('ssdjmt_bookings') || '[]');
        l.unshift(d); localStorage.setItem('ssdjmt_bookings', JSON.stringify(l.slice(0, 10)));
      } catch (e) {}
      renderHist();
    }
    function renderHist() {
      var box = $('#my-bookings'); if (!box) return;
      var l = []; try { l = JSON.parse(localStorage.getItem('ssdjmt_bookings') || '[]'); } catch (e) {}
      box.innerHTML = l.length ? '<h2>आपकी हाल की बुकिंग</h2><ul class="hist">' + l.slice(0, 5).map(function (d) {
        return '<li><b>' + esc(d.ref) + '</b> · ' + esc(d.service) + ' · ₹' + esc(d.amount || '—') + ' · ' + esc(d.at) + '</li>';
      }).join('') + '</ul><p class="hint">यह सूची केवल इसी फ़ोन/ब्राउज़र में सुरक्षित है।</p>' : '';
    }
    function valid() {
      if (!form.reportValidity()) return null;
      return data();
    }
    $('#btn-wa').addEventListener('click', function () {
      var d = valid(); if (!d) return; save(d);
      window.open('https://wa.me/' + S.whatsapp + '?text=' + encodeURIComponent(text(d)), '_blank', 'noopener');
      $('#book-out').innerHTML = '<div class="card">✅ आपका अनुरोध व्हाट्सऐप पर भेजने के लिए तैयार है। बुकिंग क्रमांक: <b>' + esc(d.ref) + '</b>। मंदिर समिति पुष्टि करेगी।</div>';
    });
    $('#btn-upi').addEventListener('click', function () {
      var d = valid(); if (!d) return;
      if (S.dummyDonation) { alert('अभी UPI विवरण डमी है। असली विवरण जुड़ने के बाद ही भुगतान करें।'); return; }
      if (!(parseFloat(d.amount) > 0)) { alert('कृपया सही राशि भरें।'); return; }
      save(d);
      var u = S.donation || {};
      location.href = 'upi://pay?pa=' + encodeURIComponent(u.upiId) + '&pn=' + encodeURIComponent(u.upiName) + '&am=' + encodeURIComponent(d.amount) +
        '&cu=INR&tn=' + encodeURIComponent(d.service + ' ' + d.ref);
    });
    renderHist();
  }

  /* ---------- PWA ---------- */
  function initPWA() {
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
    var ev, btn = function () { return $('#btn-install'); };
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault(); ev = e;
      if (btn()) btn().style.display = 'inline-block';
    });
    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'btn-install' && ev) {
        ev.prompt(); ev = null; e.target.style.display = 'none';
      }
    });
  }

  buildChrome();
  bindData();
  initBooking();
  initPWA();
})();
