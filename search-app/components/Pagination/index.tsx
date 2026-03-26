export default function Pagination({ totalPages, currentPage, fn }: { totalPages: number, currentPage: number, fn: (page: number) => void }) {
    const generatePageNumbers = () => {
        const pages = [];
        const delta = 2;

        pages.push(1);
        let start = Math.max(2, currentPage - delta);
        let end = Math.min(totalPages - 1, currentPage + delta);

        if (currentPage <= delta + 1) {
            end = Math.min(totalPages - 1, delta * 2 + 1);
        }
        if (currentPage >= totalPages - delta) {
            start = Math.max(2, totalPages - delta * 2 - 1);
        }

        if (start > 2) pages.push('...');
        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== totalPages) pages.push(i);
        }
        if (end < totalPages - 1) pages.push('...');
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="pagination">
            {totalPages > 1 && (
                <div className="pagination-info">
                    <span className="pagination-info__text">página {currentPage} de {totalPages}</span>
                </div>
            )}
            <nav className="pagination-nav" aria-label="Paginación">
                <button
                    type="button"
                    className="pagination-nav__prev"
                    onClick={() => fn(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                >
                    <span className="pagination-nav__arrow" aria-hidden>←</span>
                    Anterior
                </button>
                <div className="pagination-nav__pages">
                    {pageNumbers.map((page, index) => (
                        typeof page === 'number' ? (
                            <button
                                key={index}
                                type="button"
                                onClick={() => fn(page)}
                                className={`pagination-nav__page ${page === currentPage ? 'pagination-nav__page--active' : ''}`}
                                aria-label={`Ir a página ${page}`}
                                aria-current={page === currentPage ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        ) : (
                            <span key={index} className="pagination-ellipsis" aria-hidden="true">
                                {page}
                            </span>
                        )
                    ))}
                </div>
                <button
                    type="button"
                    className="pagination-nav__next"
                    onClick={() => fn(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                >
                    Siguiente
                    <span className="pagination-nav__arrow" aria-hidden>→</span>
                </button>
            </nav>
        </div>
    );
}
