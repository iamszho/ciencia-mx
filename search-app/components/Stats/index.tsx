'use client'
import { useEffect, useState } from "react";
import { FaLayerGroup } from "react-icons/fa";

export default function Stats() {
    const [stats, setStats] = useState<{ number_of_documents: number }>();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats')
                const data = await response.json()
                setStats(data)
            } catch (error) {
                console.error('Error fetching stats:', error)
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="number-items">
            <h2><span className="number-items__icon"><FaLayerGroup /></span>Total de documentos indexados:</h2>
            {
                stats?.number_of_documents && (
                    <div className="number-items__count">{(stats?.number_of_documents).toLocaleString()}</div>
                )
            }
        </div>
    )
}