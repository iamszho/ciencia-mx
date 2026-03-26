import { NextResponse } from 'next/server';

export async function GET() {

    try {
        const fastApiURL = `${process.env.API_BASE_URL}/stats`;
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