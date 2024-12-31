export const getMonthName = (month: number): string => {
  if (month < 1 || month > 12) {
    throw new Error("Invalid month number. Must be between 1 and 12.");
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[month - 1];
};
