import "@/app/components/SearchComponent/search-component.css";
import React, { useState } from "react";
import { redirect } from 'next/navigation'

export default function AdvancedSearchForm({ onSubmit, query, onReset }: { onSubmit: () => void, query?: { [key: string]: string; } | undefined, onReset?: () => void }) {

  const [advancedQuery, setAdvancedQuery] = useState<{ [key: string]: string; } | undefined>(query || undefined);

  const handleAdvancedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdvancedQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdvancedSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advancedQuery) return;

    delete advancedQuery?.q;
    const cleanedQuery = Object.entries(advancedQuery).filter(([key, value]) => value !== null && value !== undefined);
    const searchParams = new URLSearchParams(cleanedQuery);
    const queryString = `?${searchParams.toString()}`;
    onSubmit?.();
    redirect(`/busqueda${queryString}`);
  };

  const handleReset = () => {
    setAdvancedQuery(undefined);
    onReset?.();
    redirect(`/busqueda`);
  };

  return (
    <form onSubmit={handleAdvancedSearch} className={"form search-form"}>
      <div className={"form__grid"}>
        <div className={"form__group"}>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={advancedQuery?.title || ''}
            onChange={handleAdvancedChange}
            className={"input"}
          />
        </div>
        <div className={"form__group"}>
          <label htmlFor="creator">Autor:</label>
          <input
            type="text"
            id="creator"
            name="creator"
            value={advancedQuery?.creator || ''}
            onChange={handleAdvancedChange}
            className={"input"}
          />
        </div>
        <div className={"form__group"}>
          <label htmlFor="subject">Materia:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={advancedQuery?.subject || ''}
            onChange={handleAdvancedChange}
            className={"input"}
          />
        </div>
        <div className={"form__group"}>
          <label htmlFor="description">Descripción:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={advancedQuery?.description || ''}
            onChange={handleAdvancedChange}
            className={"input"}
          />
        </div>
        <div className={"form__group"}>
          <label htmlFor="date">Fecha:</label>
          <input
            type="text"
            id="date"
            name="date"
            value={advancedQuery?.date || ''}
            onChange={handleAdvancedChange}
            className={"input"}
            placeholder="Ej: 2020"
          />
        </div>
      </div>
      <div className={"actions"}>
        <button type="submit" className={"button"}>
          Búsqueda Avanzada
        </button>
        {
          advancedQuery && (
            <button className={"button--reset"} onClick={(e) => { e.preventDefault(); handleReset(); }}>
              Limpiar
            </button>
          )
        }
      </div>
    </form>
  );
}