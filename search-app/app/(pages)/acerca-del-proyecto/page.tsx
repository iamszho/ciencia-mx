import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Acerca del proyecto | Ciencia Abierta MX',
    description: 'Ciencia Abierta MX es un buscador independiente que reúne la producción científica mexicana de acceso abierto en un solo lugar. ',
    keywords: ['ciencia abierta, publicaciones científicas, autores académicos, repositorios de investigación, acceso abierto, open access'],
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_APP_URL}/acerca-del-proyecto`,
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function Page() {
    return (
        <div className="content-wrapper page">
            <h1>Acerca del proyecto</h1>
            <div className="intro-text">
                <p>El conocimiento existe, pero está disperso. México produce miles de publicaciones cada año, pero están fragmentadas entre decenas de repositorios y plataformas. Ciencia MX nace para resolver esa dispersión, facilitar la búsqueda y ampliar la visibilidad de la investigación mexicana.</p>
            </div>
            <div className="list list--with-title">
                <h2 className="list__title">Manifiesto de Ciencia MX</h2>
                <ul className="list__items">
                    <li className="list__item">Creemos en la accesibilidad, transparencia, apertura y ciencia como bien público. Nuestro compromiso es construir una infraestructura digital que amplifique la ciencia mexicana sin apropiarse del contenido, respetando derechos y exponiendo únicamente metadata para hacerla encontrable.</li>
                    <li className="list__item">Creemos que el conocimiento científico es un bien público.</li>
                    <li className="list__item">Creemos que la ciencia mexicana merece mayor visibilidad y la tecnología, para ampliar su impacto.</li>
                    <li className="list__item">Creemos en la apertura, la transparencia y la colaboración.</li>
                    <li className="list__item">Creemos en el respeto al trabajo de cada institución y autor.</li>
                    <li className="list__item">Creemos en la tecnología como herramienta para ampliar el impacto:</li>
                    <li className="list__item">Creemos que el futuro de la ciencia depende de cómo la compartimos hoy</li>
                </ul>
            </div>

            <div>
                <h2> Por estas razones:</h2>
                <ul className="reasons-list">
                    <li>Ciencia MX no compite: complementa.</li>
                    <li>No sustituye: conecta.</li>
                    <li>Los derechos de autor permanecen intactos.</li>
                    <li>Indexamos únicamente metadatos expuestos públicamente para facilitar su descubrimiento, siempre apuntando a las fuentes originales.</li>
                    <li>Por eso este es un proyecto abierto, en evolución, construido con la comunidad.</li>
                </ul>

                <div className="call-to-action txt-center">
                    <a href="https://cienciaabierta.mx/#contacto" className="button button--primary">Contáctanos, y colabora con nosotros</a>
                </div>
            </div>
        </div>
    )
}
