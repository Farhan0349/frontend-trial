// File: /pages/api/proxy/shedLocation.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const token = "63|tftiy6qdBIen4DZj0d1LlFzX1w8H00uwLnsaowRsdec21faa"

        const apiRes = await fetch('https://farm-management.outscalers.com/api/v1/livestock/shedLocation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(req.body),
        });

        const data = await apiRes.json();

        // Forward status and data
        res.status(apiRes.status).json(data);

    } catch (error) {
        console.error("Proxy Error:", error.message); // 🛠 Debug print
        res.status(500).json({ message: 'Proxy request failed', error: error.message });
    }
}

