import fetch from "node-fetch";

let visits = {}; // temporal, reinicios borran datos

export default async function handler(req, res) {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    visits[ip] = (visits[ip] || 0) + 1;

    // Geolocalización
    let location = "Desconocido";
    try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
        const geo = await geoRes.json();
        if (geo.status === "success") location = `${geo.country}, ${geo.city}`;
    } catch {}

    const webhook = "https://discord.com/api/webhooks/1450534630657888368/FIWSmNa2-4WiWZuL30mJPQssuNNrmEoKZIm0WNtaz-NXSYMeUbzuY3__CWTMusm934Bn";
    await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: `🌐 Nueva visita:
IP: ${ip}
Ubicación: ${location}
Veces que ha entrado: ${visits[ip]}`
        })
    });

    res.status(200).send("ok");
}
