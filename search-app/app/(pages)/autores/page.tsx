import Facets from "@/app/components/Facets";
import SearchComponent from "@/app/components/SearchComponent";
import { FaUsers } from "react-icons/fa";
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Publicaciones científicas clasificadas por autor | Ciencia Abierta MX',
    description: 'Consulta los artículos y publicaciones científicas clasificadas por autor. Explora producción académica, líneas de investigación, repositorios y áreas de conocimiento relacionadas clasificadas por autor.',
    keywords: ['publicaciones científicas, autores académicos, repositorios de investigación, acceso abierto, open access'],
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/autores`,
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
            <h1 className="page-title"><span className="page-title__icon"><FaUsers /></span>{hasSearchParams ? `Autor: ${query.get('creator')}` : 'Autores'}</h1>
            {
                hasSearchParams && <SearchComponent query={params} withForms={false} />
            }
            {
                !hasSearchParams && <Facets values="creator" type="page" showViewMore={false} />
            }
        </div>
    )
}