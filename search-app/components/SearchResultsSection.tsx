import SearchComponent from './SearchComponent';
import Facets from './Facets';
import Stats from './Stats';

interface SearchResultsSectionProps {
  query: { [key: string]: string };
}

export default function SearchResultsSection({ query }: SearchResultsSectionProps) {
  return (
    <>
      <SearchComponent query={query} />
      <Facets values="repository,subject,creator,type" limit={10} />
      <Stats />
    </>
  );
}