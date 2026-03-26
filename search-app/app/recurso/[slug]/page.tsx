import React from 'react';
import { Resource } from '@/app/types/search-types';
import "@/app/recurso/recurso.css"
import Link from 'next/link';
import type { Metadata } from 'next'

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Call backend directly from server to avoid HTTPS self-signed cert issues (no fetch to our own app URL)
const backendResourceUrl = (id: string) =>
    `${process.env.API_BASE_URL || 'http://localhost:8000'}/resource/${encodeURIComponent(id)}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const resource_id = slug.split('-', 1)[0]
    const res = await fetch(backendResourceUrl(resource_id));
    // Handle errors
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    const data = await res.json();
    const resource: Resource = data.resource;

    // Build metadata
    return {
        title: resource.title,
        description: resource.description,
        keywords: resource.subject.join(", "),
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_APP_URL}/recurso/${resource_id}-${resource.slug}`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

async function getResourceData({ resource_id }: { resource_id: string }) {
    const res = await fetch(backendResourceUrl(resource_id));
    // Handle errors
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    return res.json();
}


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const resource_id = slug.split('-', 1)[0]

    const res = await getResourceData({ resource_id })
    const resource: Resource = res.resource;

    return (
        <div className="recurso-container content-wrapper">
            <h1 className="recurso-title">{resource.title}</h1>
            <div className="recurso-meta">
                <span>Año: {resource.date}</span> | <span>Tipo: <Link href={`/tipo-publicacion?type=${encodeURIComponent(resource.type)}`}>{resource.type}</Link></span>
            </div>

            {resource.description &&
                <div className="recurso-description">
                    <p dangerouslySetInnerHTML={{ __html: resource.description }} />
                </div>

            }

            <div className="recurso-section recurso-info">
                <div className="recurso-format">
                    <h3>Formato</h3>
                    <p>{resource.format}</p>
                </div>
                <div className="recurso-language">
                    <h3>Lenguaje</h3>
                    <p>{resource.language}</p>
                </div>
                <div className="recurso-repository">
                    <h3>Repositorio</h3>
                    <p><Link href={`/repositorios?repository=${encodeURIComponent(resource.repository)}`}>{resource.repository}</Link></p>
                </div>
            </div>


            <div className="recurso-section">
                <h3>Autores</h3>
                <ul className="recurso-chip-list">
                    {(Array.isArray(resource.creator) ? resource.creator : [resource.creator]).map((creator, i) => (
                        <li key={i} className="recurso-chip-item">
                            <Link href={`/autores?creator=${encodeURIComponent(creator)}`} className="recurso-chip-link">
                                {creator}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>


            <div className="recurso-section">
                <h3>Identificadores</h3>
                <ul className="recurso-list">
                    {
                        Array.isArray(resource.identifier) ? (
                            resource.identifier.map((idLink, i) => (
                                <li key={i}>
                                    <a href={idLink} target="_blank" rel="noopener noreferrer">
                                        {idLink}
                                    </a>
                                </li>
                            ))
                        ) : (
                            <li>
                                <a href={resource.identifier} target="_blank" rel="noopener noreferrer">
                                    {resource.identifier}
                                </a>
                            </li>
                        )}
                </ul>
            </div>

            <div className="recurso-section">
                <h3>Derechos</h3>
                <ul className="recurso-list">
                    {resource.rights.map((r, i) => (
                        <li key={i}>
                            {r.startsWith("http") ? (
                                <a href={r} target="_blank" rel="noopener noreferrer">
                                    {r}
                                </a>
                            ) : (
                                r
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="recurso-section">
                <h3>Asignaturas / Temas</h3>
                <ul className="recurso-chip-list">
                    {resource.subject.map((s, i) => (
                        <li key={i} className="recurso-chip-item">
                            <Link href={`/areas-conocimiento?subject=${encodeURIComponent(s)}`} className="recurso-chip-link">
                                {s}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {resource.subject_other && resource.subject_other.length > 0 && (
                <div className="recurso-section">
                    <h3>Clasificación</h3>
                    <ul className="recurso-chip-list">
                        {resource.subject_other.map((item, i) => (
                            <li key={i} className="recurso-chip-item">
                                <Link
                                    href={i === 0
                                        ? `/clasificacion?subject_other_primary=${encodeURIComponent(item)}`
                                        : `/clasificacion?subject_other=${encodeURIComponent(item)}`
                                    }
                                    className="recurso-chip-link"
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
