import SearchComponent from "@/app/components/SearchComponent";
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Búsqueda | Ciencia Abierta MX',
    description: 'Realiza la busqueda de producción científica mexicana de acceso abierto. La busqueda puede ser por autor, título, tipo de publicación, repositorio, área de conocimiento y más.',
    keywords: ['buscador ciencia abierta, buscar por publicaciones científicas, buscar por autores académicos, buscar por repositorios de investigación, buscar por área de conocimiento'],
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/busqueda`,
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
    const params = await searchParams;
    return (
        <div className="search__container content-wrapper">
            <h1>Busqueda</h1>
            <SearchComponent query={params} />
        </div>
    )
}