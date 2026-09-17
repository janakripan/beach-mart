// src/hooks/useNavbarSearch.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../utils/useDebounce";
import { useProductSearch } from "../api/hooks/useProduct";

export const useNavbarSearch = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(search, 300);
  const { data: results = [], isLoading } =
    useProductSearch(debouncedSearch);

  useEffect(() => {
    setIsOpen(debouncedSearch.length >= 3);
  }, [debouncedSearch]);

  const selectProduct = (productId) => {
    navigate(`/product/${productId}`);
    setSearch("");
    setIsOpen(false);
  };

  return {
    search,
    setSearch,
    isOpen,
    setIsOpen,
    results,
    isLoading,
    selectProduct,
  };
};
