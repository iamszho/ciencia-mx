from fastapi import APIRouter, HTTPException, Request
from meilisearch import Client
import os

from ..security import limiter

router = APIRouter()

# MeiliSearch client
client = Client(os.getenv('MEILISEARCH_URL', 'http://localhost:7700'))

# Index name
INDEX_NAME = 'documents'

@router.get(
    "/search/facets",
    summary="Search with facets",
    description="Perform a search query and return facet distributions. Available facets: repository, type, subject, format, date, creator. Facets are sorted by count descending, except for 'date' which is sorted by date descending. Results are limited per facet."
)
@limiter.limit("60/minute")
async def search_with_facets(request: Request, q: str = '', facets: str = None, max_values: int = 20000):
    """
    Search documents and retrieve facet distributions.

    Available facets: repository, type, subject, format, date, creator.

    - **q**: Search query string (default: empty string for all documents)
    - **facets**: Comma-separated list of facets to retrieve (default: all available facets)
    - **max_values**: Maximum number of values to return per facet (default: 10)

    Returns facet distributions sorted appropriately, along with total estimated hits.
    """
    try:
        all_facets = ['repository', 'type', 'subject', 'subject_other_primary', 'format', 'date', 'creator', 'identifier']
        if facets:
            selected_facets = [f.strip() for f in facets.split(',') if f.strip()]
            for f in selected_facets:
                if f not in all_facets:
                    raise HTTPException(status_code=400, detail=f"Invalid facet: {f}")
        else:
            selected_facets = all_facets
        results = client.index(INDEX_NAME).search(q, {
            'facets': selected_facets
        })
        facet_distribution = results.get('facetDistribution', {})
        # Sort each facet's values by count descending, limit to max_values
        sorted_facet_distribution = {}
        for facet_name, facet_values in facet_distribution.items():
            if facet_name == 'date':
                # For date, sort by date value descending (assuming YYYY format)
                sorted_items = sorted(facet_values.items(), key=lambda item: item[0], reverse=True)[:max_values]
            else:
                sorted_items = sorted(facet_values.items(), key=lambda item: item[1], reverse=True)[:max_values]
            sorted_facet_distribution[facet_name] = dict(sorted_items)
        return {
            # "results": results['hits'],
            "facetDistribution": sorted_facet_distribution,
            # "total": results['estimatedTotalHits']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))