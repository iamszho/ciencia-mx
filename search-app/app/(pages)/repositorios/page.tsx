import Facets from "@/app/components/Facets";
import SearchComponent from "@/app/components/SearchComponent";
import { FaArchive } from "react-icons/fa";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Publicaciones científicas clasificadas por repositorio | Ciencia Abierta MX',
    description: 'Explora los artículos y documentos científicos almacenados en diferentes repositorios. Accede a investigaciones organizadas por autor, área de conocimiento y tipo de publicación.',
    keywords: ['repositorios científicos, artículos académicos, investigación, acceso abierto, open access'],
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/repositorios`,
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

    return (
        <div className="content-wrapper">
            <h1 className="page-title"><span className="page-title__icon"><FaArchive /></span>{hasSearchParams ? `Repositorio: ${query.get('repository')}` : 'Repositorios'}</h1>
            {
                hasSearchParams && <SearchComponent query={params} withForms={false} />
            }
            {
                !hasSearchParams && <Facets values="repository" type="page" showViewMore={false} />
            }
        </div>
    )
}