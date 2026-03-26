'use client';

import { useEffect, useState } from 'react';
import './search-component.css';
import SimpleSearch from "@/app/components/SimpleSearchForm";
import AdvancedSearchForm from '../AdvancedSearchForm';
import { RecordItem, searchParams } from '@/app/types/search-types';
import RecordCard from '../RecordCard';
import Pagination from '../Pagination';
import { FaSearch, FaSlidersH } from "react-icons/fa";


type SearchType = 'simple' | 'advanced';

export default function SearchComponent({ query, withForms = true }: { query?: { [key: string]: string } | undefined, withForms?: boolean }) {
  const params = new URLSearchParams(query);
  const queryString = params.toString();
  const [searchType, setSearchType] = useState<SearchType>('simple');
  const [hasSearch, setHasSearch] = useState(query && Object.keys(query).length > 0);

  const [hits, setHits] = useState<RecordItem[]>();
  const [totalHits, setTotalHits] = useState(0);
  const [page, setPage] = useState(1);
  const [hitsLimit, setHitsLimit] = useState(20);

  const searchUrl = '/api/search';

  const handleSearch = async ({ url, params, offset = 0, limit = hitsLimit }: { url: string, params: string | undefined, offset?: number, limit?: number }) => {
    try {
      const response = await fetch(`${url}?${params}&limit=${limit}&offset=${offset}`);
      const data = await response.json();
      setHits(data.hits);
      setTotalHits(data.estimatedTotalHits);
      setHasSearch(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    setPage(1);
    setHasSearch(true);
  };

  const handleReset = () => {
    setHasSearch(false);
    setHits(undefined);
    setTotalHits(0);
    setPage(1);
  };

  useEffect(() => {
    if (hasSearch) {
      handleSearch({ url: searchUrl, params: queryString, offset: (page - 1) * hitsLimit, limit: hitsLimit });
    }
  }, [query, page, hasSearch]);


  return (
    <div className={"search__container"}>
      {
        withForms && (
          <div className={"search__block"}>
            <div className={"toggle__buttons"}>
              <button
                onClick={() => setSearchType('simple')}
                className={searchType === 'simple' ? 'active' : ''}
              >
                <span className="icon"><FaSearch /></span> Búsqueda Simple
              </button>
              <button
                onClick={() => setSearchType('advanced')}
                className={searchType === 'advanced' ? 'active' : ''}
              >
                <span className="icon"><FaSlidersH /></span> Búsqueda Avanzada
              </button>
            </div>
            {
              searchType === 'simple' && (
                <SimpleSearch onSubmit={handleSubmit} query={query} onReset={handleReset} />
              )
            }
            {
              searchType === 'advanced' && (
                <AdvancedSearchForm onSubmit={handleSubmit} query={query} onReset={handleReset} />
              )
            }
          </div>
        )
      }
      {
        (hasSearch && hits && hits?.length > 0) && (
          <>
            <h2 className={"h2"}>Resultados: <span className={"results__count"}>{totalHits} elementos</span></h2>
          </>
        )
      }
      {
        (hasSearch && hits && hits?.length === 0) && (
          <div className={"results__count"}>No se encontraron resultados</div>
        )
      }
      {
        (hasSearch && hits && hits?.length > 0) && (
          <RecordCard records={hits} />
        )
      }
      {
        Math.ceil(totalHits / hitsLimit) > 1 && (
          <Pagination totalPages={Math.ceil(totalHits / hitsLimit)} currentPage={page} fn={setPage} />
        )
      }
    </div>
  );
};
