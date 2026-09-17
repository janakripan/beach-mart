import { useMemo, useState, useEffect } from "react";
import { useEditReturnStatus, useGetReturnProducts } from "../user/hooks/useReturn";

export function useReturnData({ initialPage = 1, pageSize = 6 } = {}) {
  // ================= Pagination =================
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  // ================= Date Default =================
  const getLast30Days = () => {
    const today = new Date();
    const past = new Date();
    past.setDate(past.getDate() - 30);

    const format = (d) => d.toISOString().split("T")[0];

    return {
      preset: "last30days",
      from: format(past),
      to: format(today),
    };
  };

  const defaultDates = getLast30Days();

  const [preset, setPreset] = useState(defaultDates.preset);
  const [fromDate, setFromDate] = useState(defaultDates.from);
  const [toDate, setToDate] = useState(defaultDates.to);

  const [searchQuery, setSearchQuery] = useState("");
  const [returnId, setReturnId] = useState("");
  const [status, setStatus] = useState("");

  const { data, isLoading, isError, refetch } =
    useGetReturnProducts({
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });

  const { mutateAsync: updateReturnStatus } = useEditReturnStatus();

  // ================= Filtered Data =================
  const filteredReturns = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.UserName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesReturnId =
        !returnId ||
        item.ReturnId?.toString().includes(returnId);

      const matchesStatus =
        !status ||
        item.ReturnStatus?.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesReturnId && matchesStatus;
    });
  }, [data, searchQuery, returnId, status]);

  // ================= Calculate Total Pages =================
  useEffect(() => {
    setTotalPages(Math.ceil(filteredReturns.length / pageSize) || 1);
  }, [filteredReturns, pageSize]);

  // ================= Paginated Data =================
  const paginatedReturns = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredReturns.slice(startIndex, endIndex);
  }, [filteredReturns, currentPage, pageSize]);

  // ================= Reset Page On Filter Change =================
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, returnId, status, fromDate, toDate]);

  // ================= Page Change =================
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // ================= Update Status =================
  const handleReturnStatus = async (id, newStatus) => {
    await updateReturnStatus({
      returnId: id,
      returnStatus: newStatus,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setReturnId("");
    setStatus("");
    setPreset("last30days");
  };



  return {
      returns: {
    returns: paginatedReturns,
    totalCount: filteredReturns.length,
    totalPages,
  },
    pagination: {
      currentPage,
      totalPages,
      pageSize,
      handlePageChange,
    },

    filters: {
      search: {
        query: searchQuery,
        setQuery: setSearchQuery,
      },
      orderId: {
        value: returnId,
        setValue: setReturnId,
      },
      dateRange: {
        preset,
        from: fromDate,
        to: toDate,
        setPreset,
        setFrom: setFromDate,
        setTo: setToDate,
      },
      status: {
        value: status,
        setValue: setStatus,
      },
      clearAll: clearFilters,
    },

    statusState: {
      isLoading,
      isError,
    },

    operations: {
      refetch,
      handleReturnStatus,
    },
  };

  
}
