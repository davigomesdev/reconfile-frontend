export const truncateInitials = (fullName: string): string => {
  const names = fullName.split(' ');
  const firstNameInitial = names[0]?.charAt(0).toUpperCase();
  const lastNameInitial = names[1]?.charAt(0).toUpperCase();

  if (lastNameInitial) return `${firstNameInitial}${lastNameInitial}`;
  return firstNameInitial;
};

export const formatDateToBR = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
