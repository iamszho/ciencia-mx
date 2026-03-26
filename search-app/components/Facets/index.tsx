'use client'
import { useEffect, useState } from "react"
import Link from 'next/link'
import { FaArchive, FaBook, FaRegListAlt, FaUsers } from "react-icons/fa";
import "./facets.css"

export default function Facets({ values, limit, type = 'section' }: { values: string, limit?: number, type?: 'section' | 'page' }) {
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
                                                <Link href={`/${facetDictionary[facet as keyof typeof facetDictionary].taxonomia}?${facet}=${value}`}>
                                                    <span className="facet-label">{label.toLowerCase()}</span>
                                                    <span className="facet-count">{count}</span>
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    )
                })
            }
        </div>
    )
}