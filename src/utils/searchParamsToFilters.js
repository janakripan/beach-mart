export const searchParamsToFilters = (searchParams) => ({
  pageNumber: Number(searchParams.get("page")) || 1,
  pageSize: 12,
  brandIDs: searchParams.get("brand")
    ? searchParams.get("brand").split(",").map(Number)
    : [],
  categoryIDs: searchParams.get("category")
    ? searchParams.get("category").split(",").map(Number)
    : [],
   ratingFilter: searchParams.get("rating")
    ? Number(searchParams.get("rating"))
    : null,
  availability: searchParams.get("inStock") !== null
    ? searchParams.get("inStock") === "true"
    : null,
  minPrice: searchParams.get("min")
    ? Number(searchParams.get("min"))
    : null,
  maxPrice: searchParams.get("max")
    ? Number(searchParams.get("max"))
    : null,
    sortBy: searchParams.get("sortBy") || "product",
    sortType: searchParams.get("sortType") || "asc",
});
