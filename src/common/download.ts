export const download = (source: string, name: string) => {
  const link = document.createElement('a');
  link.href = source;
  link.setAttribute('download', name);
  link.click();
}
