export const calculateDateRange = (selectedTimeframe) => {
  const today = new Date();
  let fromDate = new Date();
  let toDate = new Date();

  switch (selectedTimeframe) {
    case "Today":
      fromDate = new Date(today.setHours(0, 0, 0, 0));
      toDate = new Date(today.setHours(23, 59, 59, 999));
      break;
    case "Yesterday":
      fromDate = new Date(today.setDate(today.getDate() - 1));
      fromDate.setHours(0, 0, 0, 0);
      toDate = new Date(fromDate);
      toDate.setHours(23, 59, 59, 999);
      break;
    case "Last 7 Days":
      fromDate = new Date(today.setDate(today.getDate() - 7));
      fromDate.setHours(0, 0, 0, 0);
      toDate = new Date();
      toDate.setHours(23, 59, 59, 999);
      break;
    case "Last 30 Days":
      fromDate = new Date(today.setDate(today.getDate() - 30));
      fromDate.setHours(0, 0, 0, 0);
      toDate = new Date();
      toDate.setHours(23, 59, 59, 999);
      break;
    case "This Month":
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
      toDate = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      break;
    case "Last Month":
      fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      toDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
        23,
        59,
        59,
        999
      );
      break;
    case "This Year":
      fromDate = new Date(today.getFullYear(), 0, 1);
      toDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    case "Last Year":
      fromDate = new Date(today.getFullYear() - 1, 0, 1);
      toDate = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
      break;
    default:
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
      toDate = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
  }

  return {
    fromDate: fromDate.toISOString().split("T")[0],
    toDate: toDate.toISOString().split("T")[0],
  };
};
