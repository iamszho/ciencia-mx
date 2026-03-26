
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Preguntas frecuentes | Ciencia Abierta MX',
    description: 'Ciencia Abierta MX responde a las preguntas frecuentes relacionadas con el proyecto',
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/preguntas-frecuentes`,
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function Page() {
    return (
        <div className="content-wrapper page">
            <h1>Preguntas frecuentes</h1>
            <div className="faqs__list">
                <div className="faqs__question">
                    <h2 className="faqs__question-title">¿Qué es Ciencia MX?</h2>
                    <div className="faqs__answer">
                        <p>Es un buscador independiente que centraliza la ciencia mexicana de acceso abierto, facilitando que cualquier persona encuentre artículos, tesis y documentos de investigación en un solo lugar.</p>
                    </div>
                </div>
                <div className="faqs__question">
                    <h2 className="faqs__question-title">¿Es oficial del gobierno?</h2>
                    <div className="faqs__answer">
                        <p>No. Es un proyecto independiente que usa estándares abiertos y se alinea a los principios de Ciencia Abierta, sin afiliación institucional.</p>
                    </div>
                </div>
                <div className="faqs__question">
                    <h2 className="faqs__question-title">¿Por qué Alfa?</h2>
                    <div className="faqs__answer">
                        <p>Porque esta es una primera versión diseñada para validar interés, recopilar retroalimentación y evolucionar rápido junto con los usuarios.</p>
                    </div>
                </div>
                <div className="faqs__question">
                    <h2 className="faqs__question-title">¿De dónde salen los datos?</h2>
                    <div className="faqs__answer">
                        <p>De repositorios institucionales accesibles vía OAI-PMH, con metadatos Dublin Core y OpenAIRE.</p>
                    </div>
                </div>
                <div className="faqs__question">
                    <h2 className="faqs__question-title">¿Cómo integrar un repositorio?</h2>
                    <div className="faqs__answer">
                        <p>Solo se necesita que lo solicites y tengas un repositorio funcionando con un endpoint OAI-PMH, el conjunto a cosechar (si aplica) y un contacto técnico.</p>
                    </div>
                </div>
                <div className="faqs__question">
                    <h2 className="faqs__question-title">¿Tiene costo el buscador?</h2>
                    <div className="faqs__answer">
                        <p>No. El uso del buscador es gratuito y asi deseamos mantenerlo, si deseas que te ayudemos, o bien no tienes un repositorio y quisieras tenerlo, nuestro equipo te puede asesorar y ayudarte a obtenerlo.</p>
                    </div>
                </div>
                <div className="faqs__question">
                    <h2 className="faqs__question-title">¿Ofrecen servicios con costo para asesorar a mi institución con proyectos técnicos?</h2>
                    <div className="faqs__answer">
                        <p>Sí. Aunque el uso del buscador es completamente gratuito, contamos con un equipo técnico que puede apoyar a tu institución en proyectos como:</p>
                        <ul>
                            <li>implementación o modernización de repositorios institucionales;</li>
                            <li>Integración mediante OAI-PMH;</li>
                            <li>normalización de metadatos;</li>
                            <li>registro y gestión de DOIs;</li>
                            <li>dashboards de impacto y analítica;</li>
                            <li>Migración y optimización de infraestructura.</li>
                        </ul>
                        <p>Estos servicios son opcionales, se cotizan por proyecto y están pensados para fortalecer las capacidades técnicas de cada institución según sus necesidades.</p>
                    </div>
                </div>
                <div className="faqs__question">
                    <h2 className="faqs__question-title">¿Habrá servicios diseñados específicamente para investigadores y cuerpos académicos?</h2>
                    <div className="faqs__answer">
                        <p>Sí, es una posibilidad. Estamos evaluando qué servicios serían más útiles para investigadores y cuerpos académicos, y los desarrollaremos conforme exista interés y retroalimentación directa de la comunidad. Si consideras que tu grupo requiere apoyo específico, te invitamos a decírnoslo: entre más solicitudes recibamos, más pronto podremos integrarlo al roadmap.</p>
                    </div>
                </div>
                <div className="faqs__question">
                    <h2 className="faqs__question-title">¿Habrá DOIs o métricas?</h2>
                    <div className="faqs__answer">
                        <p>Sí. Forman parte del roadmap: registro de DOIs, dashboards de impacto, visibilidad institucional y analítica de uso. El orden en que iremos liberando versiones depende del interés que muestren las instituciones y sus miembros.</p>
                    </div>
                </div>
                <div className="faqs__question">
                    <h2 className="faqs__question-title">¿Qué sucede respecto a los derechos de autor de los artículos publicados?</h2>
                    <div className="faqs__answer">
                        <p>Los derechos de autor permanecen íntegros y exactamente como los haya determinado el propietario original de cada obra. Ciencia MX no almacena, redistribuye ni altera el contenido de los artículos. Únicamente indexamos la metadata pública expuesta por los repositorios institucionales para hacerla más fácil de encontrar y consultar en sus fuentes originales.</p>
                    </div>
                </div>
                <div className="faqs__question">
                    <h2 className="faqs__question-title">¿Por qué hicieron esto si ya existe Repositorio Nacional?</h2>
                    <div className="faqs__answer">
                        <p>Porque el Repositorio Nacional es una pieza importante del ecosistema, pero no siempre resulta suficiente para todas las necesidades de búsqueda, interoperabilidad, velocidad o visibilidad que investigadores, estudiantes y divulgadores requieren hoy. Ciencia MX surge como un esfuerzo independiente y complementario que busca:</p>
                        <ul>
                            <li>ofrecer una experiencia de búsqueda más moderna, rápida y accesible;</li>
                            <li>Integrar instituciones que aún no participan activamente en el RN; </li>
                            <li>No tendremos barreras de entrada respecto a los metadatos de entrada, más allá de la calidad.;</li>
                            <li>Mostrar metadatos normalizados y consistentes;</li>
                            <li>Mejorar la visibilidad de la ciencia mexicana mediante nuevas herramientas y tecnologías;</li>
                            <li>experimentar con funcionalidades que, por su naturaleza, el RN no puede implementar con la misma agilidad.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}