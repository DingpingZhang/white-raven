export function stringFormat(format: string, ...args: Array<Object>) {
  return format && args
    ? args
        .map((item) => item?.toString())
        .reduce((acc, item, index) => acc.replace(`{${index}}`, item), format)
    : format;
}

const bytesUnits = ['', 'K', 'M', 'G', 'T', 'P', 'E'];

export function toDisplayBytes(bytesLength: number, fractionDigits = 2) {
  let unitIndex = 0;
  while (bytesLength > 1024 || Math.abs(bytesLength - 1024) < 1e-6) {
    bytesLength /= 1024;
    unitIndex++;
  }

  return `${bytesLength.toFixed(fractionDigits)} ${bytesUnits[unitIndex]}B`;
}

export function toDisplayTimestamp(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}
