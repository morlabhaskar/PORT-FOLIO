export default async function handler(req, res) {
    try {
        const response = await fetch(
            "https://api.vercel.com/v1/query/web-analytics/visits/count?" +
            new URLSearchParams({
                projectId: process.env.VERCEL_PROJECT_ID,
                teamId: process.env.VERCEL_TEAM_ID,
                filter: "requestPath eq '/'"
            }),
            {
                headers: {
                    Authorization: `Bearer ${process.env.VERCEL_TOKEN}`
                }
            }
        );

        if (!response.ok) {
            throw new Error("Vercel Analytics API failed");
        }

        const data = await response.json();

        res.status(200).json({
            views: data.result
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            views: 0,
            error: "Unable to fetch views"
        });
    }
}