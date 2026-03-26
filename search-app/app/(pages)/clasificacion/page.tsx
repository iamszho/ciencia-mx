import Facets from "@/app/components/Facets";
import SearchComponent from "@/app/components/SearchComponent";
import ClasificacionOtherLevels from "./ClasificacionOtherLevels";
import { Metadata } from "next";
import { FaBook } from "react-icons/fa";

export const metadata: Metadata = {
    title: 'Clasificación | Ciencia Abierta MX',
    description: 'Consulta los recursos clasificados por subject_other. Explora publicaciones por clasificación y otros niveles.',
    keywords: ['clasificación, publicaciones científicas, áreas, ciencia abierta'],
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/clasificacion`,
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
    const params = await searchParams;
    const hasSearchParams = Object.keys(params).length > 0;
    const query = new URLSearchParams(params);
    const primary = query.get('subject_other_primary') ?? undefined;
    const valor = query.get('subject_other') ?? undefined;
    const titleLabel = primary ?? valor ?? null;
    if (hasSearchParams) {
        params['operator'] = '=';
    }

    return (
        <div className="content-wrapper">
            <h1 className="page-title">
                <span className="page-title__icon"><FaBook /></span>
                {hasSearchParams && titleLabel ? `Clasificación: ${titleLabel}` : 'Clasificación'}
            </h1>
            {hasSearchParams && (
                <>
                    <SearchComponent query={params} withForms={false} />
                    <ClasificacionOtherLevels
                        query={params}
                        currentPrimary={primary}
                        currentValor={valor}
                    />
                </>
            )}
            {!hasSearchParams && (
                <Facets values="subject_other_primary" type="page" showViewMore={false} />
            )}
        </div>
    );
}
