'use client'
import "@/app/components/SearchComponent/search-component.css";
import React, { useState } from "react";
import { redirect } from 'next/navigation'


export default function SimpleSearch({ onSubmit, query, onReset }: { onSubmit?: () => void, query?: { [key: string]: string }, onReset?: () => void }) {
  const [simpleQuery, setSimpleQuery] = useState(query?.q || '');

  const handleSimpleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({ q: simpleQuery });
    const queryString = `?${searchParams.toString()}`;
    onSubmit?.();
    redirect(`/busqueda${queryString}`);
  };

  const handleReset = () => {
    setSimpleQuery('');
    onReset?.();
    redirect(`/busqueda`);
  };

  return (
    <form onSubmit={handleSimpleSearch} className={"form search-form"}>
      <div className={"form__group"}>
        <label htmlFor="simpleQuery">Buscar en todos los registros:</label>
        <input
          type="text"
          id="simpleQuery"
          value={simpleQuery}
          onChange={(e) => setSimpleQuery(e.target.value)}
          placeholder="Escribe título, autor, fecha..."
          className={"input search-form-input"}
        />
      </div>
      <div className={"actions search-form-actions"}>
        <button type="submit" className={"button"}>
          Búscar
        </button>
        {
          query?.q && (
            <button className={"button--reset"} onClick={(e) => { e.preventDefault(); handleReset(); }}>
              Limpiar
            </button>
          )
        }
      </div>
    </form>
  );
}