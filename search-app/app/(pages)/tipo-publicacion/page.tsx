import Facets from "@/app/components/Facets";
import SearchComponent from "@/app/components/SearchComponent";
import { FaRegListAlt } from "react-icons/fa";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Publicaciones científicas clasificadas por tipo de publicación | Ciencia Abierta MX',
    description: 'Explora las publicaciones categorizadas por tipo de publicación. Accede a artículos, tesis, libros y otros documentos académicos según su tipo de publicación.',
    keywords: ['publicaciones', 'tipo de publicación', 'artículos', 'tesis', 'libros', 'documentos académicos'],
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/tipo-publicacion`,
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
    if (hasSearchParams) {
        params['operator'] = '=';
    }

    const formatFacetLabel = (str: string) => {
        const withSpaces = str.replace(/([A-Z])/g, ' $1').split(' ');
        return withSpaces.join(' ')
    }

    return (
        <div className="content-wrapper">
            <h1 className="page-title"><span className="page-title__icon"><FaRegListAlt /></span>{hasSearchParams ? `Tipo de publicación: ${formatFacetLabel(query.get('type') ?? '')?.toLowerCase()}` : 'Tipos de publicaciones'}</h1>
            {
                hasSearchParams && <SearchComponent query={params} withForms={false} />
            }
            {
                !hasSearchParams && <Facets values="type" type="page" showViewMore={false} />
            }
        </div>
    )
}