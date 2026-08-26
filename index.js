const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Kick Botu Ücretsiz 7/24 Aktif!'));
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda aktif.`));

const CHECK_INTERVAL = 30000;

async function claimPoints() {
  const userCookie = process.env.KICK_COOKIE;

  if (!userCookie) {
    console.error('HATA: KICK_COOKIE eklenmedi!');
    return;
  }

  try {
    const response = await axios.post(
      'https://kick.com/api/v1/entry-points/claim',
      {},
      {
        headers: {
          'Cookie': `kick_session=${userCookie}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Referer': 'https://kick.com/'
        }
      }
    );

    const time = new Date().toLocaleTimeString('tr-TR');
    console.log(`[${time}] İstek başarılı ->`, response.data);
  } catch (error) {
    const time = new Date().toLocaleTimeString('tr-TR');
    if (error.response) {
      console.log(`[${time}] Puan henüz aktif değil veya kontrol edildi (${error.response.status}).`);
    } else {
      console.log(`[${time}] Bağlantı hatası:`, error.message);
    }
  }
}

setInterval(claimPoints, CHECK_INTERVAL);

// Render uykusunu önleme ping'i
setInterval(() => {
  if (process.env.RENDER_EXTERNAL_URL) {
    axios.get(process.env.RENDER_EXTERNAL_URL).catch(() => {});
  }
}, 280000);
