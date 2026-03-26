import Stats from './components/Stats';
import Facets from './components/Facets';
import SearchComponent from './components/SearchComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ciencia Abierta MX',
  description: 'CienciaAbierta MX es un buscador independiente que reúne la producción científica mexicana de acceso abierto en un solo lugar.',
  keywords: ['publicaciones científicas, autores académicos, repositorios de investigación, acceso abierto, ciencia en México'],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

const SearchPage = () => {
  return (
    <div className={"content-wrapper page"}>
      <h1>
        Ciencia Abierta <span>MX:</span> Explorando la ciencia mexicana, en un solo lugar.
      </h1>
      <div className="intro-text">
        <p>
          CienciaAbierta MX es un buscador independiente que reúne la producción científica mexicana de acceso abierto en un solo lugar.
        </p>
        <p>
          Esta es una versión de prueba (alfa) con la intención de hacer visible y accesible el conocimiento producido en México.
        </p>
      </div>
      <SearchComponent />
      <Facets values="repository,subject_other_primary,creator,type" limit={10} />
      <Stats />
    </div>
  );
};

export default SearchPage;