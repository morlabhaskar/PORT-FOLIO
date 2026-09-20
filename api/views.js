export default async function handler(req, res) {
    try {
        const token = process.env.VERCEL_TOKEN;
        const projectId = process.env.VERCEL_PROJECT_ID;
        const teamId = process.env.VERCEL_TEAM_ID;

        if (!token || !projectId) {
            return res.status(500).json({
                views: 0,
                error: "Missing Vercel environment variables"
            });
        }

        const url = new URL(
            "https://api.vercel.com/v1/query/web-analytics/visits/count"
        );

        url.searchParams.set("projectId", projectId);

        // Only needed if this is a team project
        if (teamId) {
            url.searchParams.set("teamId", teamId);
        }

        // Count only your homepage
        url.searchParams.set(
            "filter",
            "requestPath eq '/'"
        );

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                views: 0,
                error: data
            });
        }

        return res.status(200).json({
            views: data.data?.pageviews ?? 0
        });

    } catch (error) {
        return res.status(500).json({
            views: 0,
            error: error.message
        });
    }
}