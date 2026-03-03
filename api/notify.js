import fetch from "node-fetch";
import fs from "fs";

export default async function handler(req, res) {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const dbFile = "visits.json";
    let data = {};
    if (fs.existsSync(dbFile)) {
        data = JSON.parse(fs.readFileSync(dbFile));
    }

    data[ip] = (data[ip] || 0) + 1;
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

    let location = "Desconocido";
    try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
        const geo = await geoRes.json();
        if (geo.status === "success") location = `${geo.country}, ${geo.city}`;
    } catch {}

    // Enviar webhook a Discord
    const webhook = "https://discord.com/api/webhooks/1450534630657888368/FIWSmNa2-4WiWZuL30mJPQssuNNrmEoKZIm0WNtaz-NXSYMeUbzuY3__CWTMusm934Bn";
    await fetch(webhook, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({content: `🌐 Nueva visita:\nIP: ${ip}\nUbicación: ${location}\nVeces que ha entrado: ${data[ip]}`})
    });

    res.status(200).send("ok");
}
