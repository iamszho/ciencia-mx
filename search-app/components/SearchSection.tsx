import SearchComponent from './SearchComponent';

interface SearchSectionProps {
  query: { [key: string]: string };
}

export default function SearchSection({ query }: SearchSectionProps) {
  return (
    <section className="py-16 bg-surface/50 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="search__container">
          <SearchComponent query={query} />
        </div>
      </div>
    </section>
  );
}