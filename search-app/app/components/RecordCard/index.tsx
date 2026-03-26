import { RecordItem } from "@/app/types/search-types";

export default function RecordCard({ records }: { records: RecordItem[] }) {
    return (
        <ul className={"results__list"}>
            {records.map((record, i) => {
                return (
                    <li key={i} className={"result__item"}>
                        <a
                            href={`/recurso/${record['id']}-${record['slug']}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <h3>{record['title']}</h3>
                        </a>

                        {
                            record['description'] && (
                                <p className="description">
                                    {record['description'].substring(0, 200)}...
                                </p>
                            )
                        }

                        <p>
                            <strong>Autor:</strong> {record['creator']?.toString()}
                        </p>
                        <p>
                            <strong>Fecha:</strong> {record['date']}
                        </p>
                    </li>
                );
            })}
        </ul>
    );
}