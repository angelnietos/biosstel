export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatMonthName(month: number, year: number) {
  return capitalize(
    new Date(year, month).toLocaleDateString('es', { month: 'long' }),
  );
}

export function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}`;
}
