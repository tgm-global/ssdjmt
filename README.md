# श्री शान्तिनाथ दिगम्बर जैन मंदिर, बड़ागाँव, बागपत - वेबसाइट (PWA)

लाइव लिंक: https://tgm-global.github.io/ssdjmt/

## GitHub Pages पर लाइव करना
1. GitHub पर `tgm-global` में नया रिपॉज़िटरी `ssdjmt` बनाएँ (Public)।
2. इस फ़ोल्डर की **सारी फ़ाइलें** (index.html, assets/, data/ आदि) रिपॉज़िटरी के root में अपलोड करें (Add file > Upload files)।
3. Settings > Pages > Source: **Deploy from a branch** > Branch: `main` / `(root)` > Save।
4. 1-2 मिनट में साइट `https://tgm-global.github.io/ssdjmt/` पर चालू हो जाएगी।

## जानकारी / सेवाएँ बदलना (एक ही जगह से)
सारा डेटा `data/config.js` में है। आसान तरीका: `/admin.html` खोलें, बदलाव करें, "config.js डाउनलोड करें" दबाएँ और GitHub में `data/config.js` को उससे बदल दें।

## बाद में बदलने वाली चीज़ें
- लोगो: `assets/logo.svg`, `assets/favicon.svg` और `assets/icon-*.png`
- फोटो: `assets/img/` में अपनी फोटो डालें और admin में गैलरी का पथ बदलें
- UPI / बैंक विवरण: admin > दान विवरण (डमी टिक हटाएँ)
- UPI QR चित्र: `assets/img/qr.png` डालें और admin में पथ लिखें
