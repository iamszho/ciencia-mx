import { Metadata } from "next"


export const metadata: Metadata = {
    title: 'Plan de Trabajo | Ciencia Abierta MX',
    description: 'Plan de trabajo para desarrollar un buscador que apoye al ecosistema que genera la investigación en México',
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/plan-de-trabajo`,
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function Page() {
    return (
        <div className="content-wrapper page">
            <h1>Plan de Trabajo</h1>
            <div className="intro-text">
                <p>Desarrollar un producto que apoye al ecosistema que genera la investigación en México; por lo tanto, iremos ajustándolo conforme escuchemos a universidades, investigadores, bibliotecarios y usuarios.</p>
            </div>
            <h2>Estos son nuestros planes: </h2>
            <div className="road-map">
                <div className="road-map__item list list--with-title">
                    <h3 className="list__title">Fase 1 — Interoperabilidad total</h3>
                    <ul className="list__items">
                        <li className="list__item">Integración continua vía OAI-PMH de más repositorios</li>
                        <li className="list__item">Normalización Dublin Core/OpenAIRE, perfiles institucionales</li>
                        <li className="list__item">Integración de filtrados sobre los resultados</li>
                    </ul>
                </div>
                <div className="road-map__item list list--with-title">
                    <h3 className="list__title">Fase 2 — Servicios avanzados para instituciones</h3>
                    <ul className="list__items">
                        <li className="list__item">Registro masivo de DOIs</li>
                        <li className="list__item">Dashboards de impacto</li>
                        <li className="list__item">Métricas de visibilidad</li>
                        <li className="list__item">Integración del chatbot en una sola búsqueda</li>
                    </ul>
                </div>
                <div className="road-map__item list list--with-title">
                    <h3 className="list__title">Fase 3 — Ciencia enriquecida</h3>
                    <ul className="list__items">
                        <li className="list__item">Recomendador de artículos</li>
                        <li className="list__item">Redes de coautoría</li>
                        <li className="list__item">Identificación de líneas emergentes</li>
                    </ul>
                </div>
                <div className="road-map__item list list--with-title">
                    <h3 className="list__title">Fase 4 — Ecosistema nacional</h3>
                    <ul className="list__items">
                        <li className="list__item">Integración con SIICYT</li>
                        <li className="list__item">Mapas de instituciones</li>
                        <li className="list__item">Datos abiertos unificados</li>
                    </ul>
                </div>
            </div>
            <h2 className="list__title">Lo que ya puedes hacer</h2>
            <ul className="reasons-list">
                <li>Buscar artículos, tesis y documentos científicos de acceso abierto.</li>
                <li>Explorar resultados con una interfaz mínima y funcional.</li>
                <li>Ver los acervos de las primeras 40 instituciones que hemos integrado.</li>
                <li>Acceder a metadatos normalizados.</li>
            </ul>
            <h2>Llamado a colaboración</h2>
            <p>Universidades, administradores de repositorios, bibliotecarios, investigadores y divulgadores: su colaboración es crucial. Si administras un repositorio, podemos integrarlo; si eres académico, puedes validar resultados; si eres divulgador, puedes ayudarnos a mejorar la experiencia. Universidades, bibliotecarios, administradores de repositorios, investigadores y divulgadores.</p>
            <div className="call-to-action txt-center">
                <a href="https://cienciaabierta.mx/#contacto" className="button button--primary">Contáctanos, y colabora con nosotros</a>
            </div>
            <p>Ciencia Abierta MX aspira a convertirse en un aparador de la  producción científica para México y el mundo. Esta es la primera versión, pero nuestra visión es grande: construir un ecosistema digital que potencie la visibilidad, colaboración e impacto de la ciencia mexicana.</p>
            <div className="call-to-action txt-center">
                <a href="https://cienciaabierta.mx/#contacto" className="button button--primary">Conoce la ciencia que mueve a México</a>
            </div>
        </div>
    )
}
