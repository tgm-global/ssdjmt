/* Admin पेज: सारी जानकारी एक जगह से बदलें, फिर config.js डाउनलोड करें */
(function () {
  'use strict';
  var D = window.SITE_DEFAULT;
  var C = JSON.parse(JSON.stringify(window.SITE));
  var root = document.getElementById('admin-root');
  if (!root) return;

  var LISTS = {
    timings: { title: 'दर्शन / अभिषेक / आरती का समय', add: 'समय जोड़ें', fields: [['title', 'नाम'], ['time', 'समय'], ['note', 'टिप्पणी'], ['icon', 'चिह्न (emoji)']] },
    services: { title: 'सेवाएँ (जोड़ें / हटाएँ)', add: 'नई सेवा जोड़ें', fields: [['name', 'सेवा का नाम'], ['amount', 'राशि ₹ (खाली = इच्छानुसार)'], ['icon', 'चिह्न (emoji)'], ['desc', 'विवरण', 'ta']] },
    events: { title: 'उत्सव / कार्यक्रम', add: 'कार्यक्रम जोड़ें', fields: [['date', 'तिथि / अवधि'], ['title', 'शीर्षक'], ['desc', 'विवरण', 'ta']] },
    gallery: { title: 'गैलरी (चित्र)', add: 'चित्र जोड़ें', fields: [['src', 'चित्र का पथ (जैसे assets/img/photo1.jpg) या लिंक'], ['caption', 'कैप्शन']] },
    library: { title: 'पाठ-संग्रह (आरती, पूजन, मंत्र)', add: 'पाठ जोड़ें', fields: [['title', 'शीर्षक'], ['body', 'पाठ', 'ta']] }
  };
  var NEW = {
    timings: { title: '', time: '', note: '', icon: '🛕' },
    services: { id: '', name: '', amount: '', icon: '🙏', desc: '' },
    events: { date: '', title: '', desc: '' },
    gallery: { src: '', caption: '' },
    library: { title: '', body: '' }
  };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function getp(o, p) { return p.split('.').reduce(function (a, k) { return a ? a[k] : ''; }, o); }
  function setp(o, p, v) { var k = p.split('.'); var l = k.pop(); var t = k.reduce(function (a, x) { a[x] = a[x] || {}; return a[x]; }, o); t[l] = v; }
  function inp(label, path, type) {
    var v = getp(C, path);
    return '<label>' + label + (type === 'ta'
      ? '<textarea data-k="' + path + '">' + esc(v) + '</textarea>'
      : '<input data-k="' + path + '" value="' + esc(v) + '">') + '</label>';
  }
  function listBox(key) {
    var L = LISTS[key], arr = C[key] || [];
    return '<div class="box"><h2>' + L.title + '</h2>' + arr.map(function (it, i) {
      return '<div class="item"><div class="row2">' + L.fields.map(function (f) {
        var tag = f[2] === 'ta'
          ? '<textarea data-list="' + key + '" data-i="' + i + '" data-f="' + f[0] + '">' + esc(it[f[0]]) + '</textarea>'
          : '<input data-list="' + key + '" data-i="' + i + '" data-f="' + f[0] + '" value="' + esc(it[f[0]]) + '">';
        return '<label>' + f[1] + tag + '</label>';
      }).join('') + '</div><button type="button" class="btn sm del" data-del="' + key + ':' + i + '">🗑 हटाएँ</button></div>';
    }).join('') + '<button type="button" class="btn dark sm" data-add="' + key + '">➕ ' + L.add + '</button></div>';
  }

  function render() {
    var y = window.scrollY;
    root.innerHTML =
      '<div class="bar">' +
      '<button class="btn" type="button" id="a-dl">⬇️ config.js डाउनलोड करें</button>' +
      '<button class="btn alt" type="button" id="a-prev">👁 इस ब्राउज़र में पूर्वावलोकन</button>' +
      '<button class="btn alt" type="button" id="a-reset">↩️ रीसेट</button></div>' +
      '<div class="box"><p><b>कैसे काम करता है?</b> यहाँ बदलाव करें → "config.js डाउनलोड करें" → GitHub में <code>data/config.js</code> को इस नई फ़ाइल से बदलें → लगभग 1 मिनट में सभी पेज अपडेट। ' +
      '"पूर्वावलोकन" से बदलाव सिर्फ़ आपके ब्राउज़र में दिखते हैं, वेबसाइट पर तभी आते हैं जब फ़ाइल GitHub पर अपलोड हो।</p></div>' +
      '<div class="box"><h2>मंदिर की जानकारी</h2><div class="row2">' +
      inp('मंदिर का नाम', 'name') + inp('संक्षिप्त नाम', 'shortName') + inp('मोबाइल नंबर (10 अंक)', 'phone') +
      inp('व्हाट्सऐप नंबर (91 सहित)', 'whatsapp') + inp('ईमेल', 'email') + inp('पता', 'address') +
      inp('गूगल मैप खोज-शब्द', 'mapQuery') + inp('मुख्य पंक्ति (tagline)', 'tagline') + '</div>' +
      inp('सूचना पट्टी (ऊपर दिखने वाला संदेश; खाली = बंद)', 'notice', 'ta') +
      '<label>परिचय (हर अनुच्छेद के बीच एक खाली पंक्ति रखें)<textarea id="a-about" style="min-height:160px">' + esc((C.about || []).join('\n\n')) + '</textarea></label></div>' +
      '<div class="box"><h2>दान विवरण (UPI / बैंक)</h2>' +
      '<label style="grid-template-columns:auto 1fr;align-items:center;gap:10px"><input type="checkbox" id="a-dummy"' + (C.dummyDonation ? ' checked' : '') + ' style="width:auto"> अभी विवरण डमी हैं (असली डालने के बाद यह टिक हटा दें)</label><br>' +
      '<div class="row2">' + inp('UPI आईडी', 'donation.upiId') + inp('UPI पर दिखने वाला नाम', 'donation.upiName') +
      inp('QR चित्र का पथ (जैसे assets/img/qr.png)', 'donation.qrImage') + inp('खाता धारक', 'donation.accountName') +
      inp('बैंक का नाम', 'donation.bankName') + inp('खाता संख्या', 'donation.accountNo') + inp('IFSC', 'donation.ifsc') + inp('शाखा', 'donation.branch') + '</div></div>' +
      Object.keys(LISTS).map(listBox).join('');
    window.scrollTo(0, y);
  }

  root.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'a-about') { C.about = t.value.split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean); return; }
    if (t.id === 'a-dummy') { C.dummyDonation = t.checked; return; }
    if (t.dataset.k) setp(C, t.dataset.k, t.value);
    else if (t.dataset.list) C[t.dataset.list][+t.dataset.i][t.dataset.f] = t.value;
  });
  root.addEventListener('change', function (e) { if (e.target.id === 'a-dummy') C.dummyDonation = e.target.checked; });
  root.addEventListener('click', function (e) {
    var t = e.target;
    if (t.dataset.add) {
      var n = JSON.parse(JSON.stringify(NEW[t.dataset.add]));
      if (t.dataset.add === 'services') n.id = 's' + Date.now().toString(36);
      (C[t.dataset.add] = C[t.dataset.add] || []).push(n); render(); return;
    }
    if (t.dataset.del) {
      var p = t.dataset.del.split(':');
      if (confirm('क्या आप इसे हटाना चाहते हैं?')) { C[p[0]].splice(+p[1], 1); render(); }
      return;
    }
    if (t.id === 'a-prev') {
      localStorage.setItem('ssdjmt_override', JSON.stringify({ baseStamp: D.updatedAt, data: C }));
      alert('पूर्वावलोकन सेव हुआ। अब होम पेज खोलकर देखें। (केवल इसी ब्राउज़र में)');
    }
    if (t.id === 'a-reset') {
      localStorage.removeItem('ssdjmt_override'); C = JSON.parse(JSON.stringify(D)); render();
    }
    if (t.id === 'a-dl') {
      var out = JSON.parse(JSON.stringify(C));
      out.updatedAt = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
      var txt = '/* श्री शान्तिनाथ दिगम्बर जैन मंदिर - मुख्य डेटा फ़ाइल. admin.html से बनी। */\nwindow.SITE_DEFAULT = ' + JSON.stringify(out, null, 2) + ';\n';
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([txt], { type: 'text/javascript;charset=utf-8' }));
      a.download = 'config.js'; document.body.appendChild(a); a.click(); a.remove();
      alert('config.js डाउनलोड हो गई। अब GitHub में data/config.js को इससे बदलें।');
    }
  });
  render();
})();
