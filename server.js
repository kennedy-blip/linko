import express from 'express';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import { setupDb } from './src/database.js';

const app = express();
app.use(express.json());
app.use(express.static('public'));

let db;
setupDb().then(database => { 
    db = database;
    console.log("🚀 Linko Database Ready");
}).catch(err => console.error("Database initialization failed:", err));

app.post('/shorten', async (req, res) => {
    let { longUrl, customAlias, expires } = req.body;
    if (!longUrl) return res.status(400).json({ error: "URL is required" });
    if (!longUrl.startsWith('http')) longUrl = `https://${longUrl}`;

    const shortCode = customAlias ? customAlias.trim().replace(/\s+/g, '-') : nanoid(6);
    const expiryDate = expires ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null;

    try {
        await db.run('INSERT INTO links (long_url, short_code, expires_at) VALUES (?, ?, ?)', [longUrl, shortCode, expiryDate]);
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
        const qrCode = await QRCode.toDataURL(shortUrl);
        res.json({ shortUrl, shortCode, qrCode });
    } catch (err) {
        if (err.message.includes('UNIQUE')) return res.status(400).json({ error: "Alias already taken!" });
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/:code', async (req, res) => {
    const link = await db.get('SELECT * FROM links WHERE short_code = ?', [req.params.code]);
    if (!link) return res.status(404).send('<h1>Link not found</h1>');
    if (link.expires_at && new Date() > new Date(link.expires_at)) return res.status(410).send('<h1>Link Expired</h1>');

    await db.run('UPDATE links SET clicks = clicks + 1, last_clicked = CURRENT_TIMESTAMP WHERE short_code = ?', [req.params.code]);
    res.redirect(link.long_url);
});

app.get('/api/links', async (req, res) => {
    const links = await db.all('SELECT * FROM links ORDER BY id DESC');
    const linksWithQR = await Promise.all(links.map(async (l) => ({
        ...l,
        qrCode: await QRCode.toDataURL(`${req.protocol}://${req.get('host')}/${l.short_code}`)
    })));
    res.json(linksWithQR);
});

app.delete('/api/links/:code', async (req, res) => {
    await db.run('DELETE FROM links WHERE short_code = ?', [req.params.code]);
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server on port ${PORT}`));