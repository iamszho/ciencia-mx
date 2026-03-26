import { Metadata } from "next"
import { FaRegCheckCircle } from "react-icons/fa";


export const metadata: Metadata = {
    title: 'Información técnica | Ciencia Abierta MX',
    description: 'Ciencia Abierta MX utiliza estándares, tecnologías y lineamientos con los que operamos para asegurar interoperabilidad total',
    keywords: ['ciencia abierta, publicaciones científicas, autores académicos, repositorios de investigación, acceso abierto, open access'],
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/informacion-tecnica`,
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function Page() {
    return (
        <div className="content-wrapper page">
            <h1>Bibliotecarios</h1>
            <div className="intro-text">
                <p>Ciencia Abierta MX facilita la visibilidad institucional, incrementa lectura y citación, y fortalece repositorios institucionales mediante un buscador moderno y unificado que centraliza el conocimiento producido por tu comunidad académica.</p>
            </div>
            <div className="list">
                <p>Los estándares, tecnologías y lineamientos con los que operamos para asegurar interoperabilidad total con los repositorios institucionales y plataformas académicas existentes.</p>
                <ul className="list__items list-standards">
                    <li className="list__item"><FaRegCheckCircle /> OAI-PMH 2.0 para cosecha de metadatos.</li>
                    <li className="list__item"><FaRegCheckCircle /> Dublin Core + OpenAIRE como base de normalización y estandarización.</li>
                    <li className="list__item"><FaRegCheckCircle /> Compatibilidad con DSpace, Dataverse, EPrints, Invenio y cualquier repositorio con endpoint OAI-PMH.</li>
                </ul>
            </div>
            <div className="list list--with-title">
                <h2 className="list__title">Requerimientos mínimos de integración:</h2>
                <ul className="list__items">
                    <li className="list__item">Endpoint OAI-PMH activo, sets opcionales, contacto técnico.</li>
                    <li className="list__item">Compatibilidad con DSpace, Dataverse, EPrints, Invenio.</li>
                </ul>
            </div>
        </div>
    )
}