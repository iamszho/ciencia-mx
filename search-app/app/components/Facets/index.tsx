'use client'
import { useEffect, useState } from "react"
import Link from 'next/link'
import { FaArchive, FaBook, FaRegListAlt, FaUsers } from "react-icons/fa";
import "./facets.css"

export default function Facets({ values, limit, type = 'section', showViewMore = true }: { values: string, limit?: number, type?: 'section' | 'page', showViewMore?: boolean }) {
    const [facets, setFacets] = useState({})

    useEffect(() => {
        const fetchFacets = async () => {
            try {
                const response = await fetch(`/api/facets?facets=${values}${limit ? `&limit=${limit}` : ''}`)
                const data = await response.json()
                setFacets(data.facetDistribution)
            } catch (error) {
                console.error('Error fetching facets:', error)
            }
        }
        fetchFacets()
    }, [])

    const facetDictionary = {
        repository: {
            label: "Repositorios",
            taxonomia: "repositorios",
            icon: <FaArchive />
        },
        subject: {
            label: "Áreas de conocimiento",
            taxonomia: "areas-conocimiento",
            icon: <FaBook />
        },
        subject_other_primary: {
            label: "Clasificación",
            taxonomia: "clasificacion",
            icon: <FaBook />
        },
        creator: {
            label: "Autores",
            taxonomia: "autores",
            icon: <FaUsers />
        },
        type: {
            label: "Tipos de publicaciones",
            taxonomia: "tipo-publicacion",
            icon: <FaRegListAlt />
        },
    }

    const formatFacetLabel = (str: string) => {
        const withSpaces = str.replace(/([A-Z])/g, ' $1').split(' ');
        return withSpaces.join(' ')
    }

    const capitalizeLabel = (str: string, facet?: string) => {
        if (facet === 'repository') {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
        const lowerWords = ['de', 'del', 'la', 'el', 'los', 'las', 'y', 'en', 'a', 'con', 'por', 'para'];
        return str.split(' ').map(word => {
            if (word === word.toUpperCase() && word.length > 1) {
                return word;
            } else if (lowerWords.includes(word.toLowerCase())) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    }

    return (
        <div className={`facets facets-${type}`}>
            {
                facets && Object.entries(facets).map(([facet, values]) => {
                    return (
                        <div key={facet} className="facet">
                            {
                                type === 'section' && (
                                    <h2 className="facet-title">
                                        <span className="facet-icon">{facetDictionary[facet as keyof typeof facetDictionary].icon}</span>
                                        {facetDictionary[facet as keyof typeof facetDictionary].label}</h2>
                                )
                            }
                            <ul className="facet-list">
                                {
                                    Object.entries(values as { [key: string]: number }).map(([value, count]) => {
                                        const label = facet === 'type' ? formatFacetLabel(value) : value
                                        return (
                                            <li key={value} className="facet-item">
                                                <Link href={`/${facetDictionary[facet as keyof typeof facetDictionary].taxonomia}?${facet}=${encodeURIComponent(value)}`}>
                                                    <span className="facet-label">{label}</span>
                                                    <span className="facet-count">{count}</span>
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            {showViewMore && limit && Object.keys(values as object).length >= limit && (
                                <div className="txt-center">
                                    <Link href={`/${facetDictionary[facet as keyof typeof facetDictionary].taxonomia}`} className="button button--primary">
                                        Ver más
                                    </Link>
                                </div>
                            )}
                        </div>
                    )
                })
            }
        </div>
    )
}
