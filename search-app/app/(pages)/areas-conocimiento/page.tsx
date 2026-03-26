import Facets from "@/app/components/Facets";
import SearchComponent from "@/app/components/SearchComponent";
import { Metadata } from "next";
import { FaBook } from "react-icons/fa";

export const metadata: Metadata = {
    title: 'Áreas de conocimiento | Ciencia Abierta MX',
    description: 'Consulta los artículos y publicaciones científicas clasificadas por área de conocimiento. Explora publicaciones, autores y repositorios especializados por área de conocimiento.',
    keywords: ['publicaciones científicas, autores académicos, repositorios de investigación, acceso abierto, open access'],
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/areas-conocimiento`,
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
            <h1 className="page-title"><span className="page-title__icon"><FaBook /></span>{hasSearchParams ? `Área de conocimiento: ${query.get('subject')}` : 'Áreas de conocimiento'}</h1>
            {
                hasSearchParams && <SearchComponent query={params} withForms={false} />
            }
            {
                !hasSearchParams && <Facets values="subject" type="page" showViewMore={false} />
            }
        </div>
    )
}