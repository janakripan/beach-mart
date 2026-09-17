export const filtersToSearchParams = (filters) => {
  const params = new URLSearchParams();

  if (filters.brandIDs.length)
    params.set("brand", filters.brandIDs.join(","));

  if (filters.categoryIDs.length)
    params.set("category", filters.categoryIDs.join(","));

  if (filters.ratingFilter !== null)
    params.set("rating", filters.ratingFilter);

  if (filters.availability !== null)
    params.set("inStock", filters.availability);

  if (filters.minPrice !== null)
    params.set("min", filters.minPrice);

  if (filters.maxPrice !== null)
    params.set("max", filters.maxPrice);

  if (filters.sortBy)
    params.set("sortBy", filters.sortBy);

  if (filters.sortType)
    params.set("sortType", filters.sortType);

  params.set("page", filters.pageNumber);

  return params;
};
