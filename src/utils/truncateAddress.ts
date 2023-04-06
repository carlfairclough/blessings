const truncateAddress = (addr: string) => addr.slice(0, 6) + "..." + addr.slice(-4);

export default truncateAddress