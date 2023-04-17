const truncateAddress = (addr: string, start?: number, end?: number) =>
  addr.slice(0, start || 6) + "..." + addr.slice(-(end || 4));

export default truncateAddress;
