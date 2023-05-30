function formatLargeNumberWithSIPrefix(n: number): string {
  const units = ['', 'k', 'M', 'G', 'T', 'P'];
  let exponent = 0;
  while (n >= 1000 && exponent < units.length - 1) {
    n /= 1000;
    exponent++;
  }
  return (
    n.toPrecision(3).replace(/(\d+(\.\d+[1-9])?)(\.?0*$)/, '$1') +
    units[exponent]
  );
}

function formatSmallNumberWithSIPrefix(n: number): string {
  const units = ['', 'm', 'μ', 'n', 'p', 'f'];
  let exponent = 0;
  while (n < 1 && exponent < units.length - 1) {
    n *= 1000;
    exponent++;
  }
  return (
    n.toPrecision(3).replace(/(\d+(\.\d+[1-9])?)(\.?0*$)/, '$1') +
    units[exponent]
  );
}

export default function formatNumberWithSIPrefix(n: number): string {
  return n < 1
    ? formatSmallNumberWithSIPrefix(n)
    : formatLargeNumberWithSIPrefix(n);
}
