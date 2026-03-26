'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaTags } from 'react-icons/fa';
import { RecordItem } from '@/app/types/search-types';
import './ClasificacionOtherLevels.css';

type Props = {
  query: { [key: string]: string };
  currentPrimary?: string;
  currentValor?: string;
};

export default function ClasificacionOtherLevels({ query, currentPrimary, currentValor }: Props) {
  const [otherValues, setOtherValues] = useState<string[]>([]);

  useEffect(() => {
    const fetchHits = async () => {
      try {
        const params = new URLSearchParams(query);
        params.set('limit', '500');
        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        const hits: RecordItem[] = data.hits || [];
        const seen = new Set<string>();
        const current = new Set([currentPrimary, currentValor].filter(Boolean));
        hits.forEach((hit) => {
          const arr = hit.subject_other;
          if (Array.isArray(arr)) {
            arr.forEach((v) => {
              if (v && !current.has(v)) seen.add(v);
            });
          }
        });
        setOtherValues(Array.from(seen).sort());
      } catch {
        setOtherValues([]);
      }
    };
    fetchHits();
  }, [query, currentPrimary, currentValor]);

  if (otherValues.length === 0) return null;

  return (
    <section className="clasificacion-other-levels" aria-label="Otros niveles de clasificación">
      <h3 className="clasificacion-other-levels__title">
        <FaTags aria-hidden />
        Otros niveles de clasificación
      </h3>
      <ul className="clasificacion-other-levels__list">
        {otherValues.map((valor) => (
          <li key={valor} className="clasificacion-other-levels__item">
            <Link
              href={`/clasificacion?subject_other=${encodeURIComponent(valor)}`}
              className="clasificacion-other-levels__link"
            >
              {valor}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
