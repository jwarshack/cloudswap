export function shortAddress(addr) {
    const first = addr.slice(0, 6)
    const last = addr.slice(-4)
    return `${first}...${last}`
}