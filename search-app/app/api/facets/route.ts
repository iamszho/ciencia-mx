import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const facets = searchParams.get('facets');
    const limit = searchParams.get('limit');

    if (!facets) {
        return NextResponse.json(
            { error: 'Facets parameter is required' },
            { status: 400 }
        );
    }

    try {
        const fastApiURL = `${process.env.API_BASE_URL}/search/facets?facets=${facets}${limit ? `&max_values=${limit}` : ''}`;
        const response = await fetch(fastApiURL, {
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'FastAPI error', status: response.status },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Server connection error' },
            { status: 500 }
        );
    }
}
