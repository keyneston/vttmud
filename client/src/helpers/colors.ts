import crypto from "crypto";

// cyrb53 is from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
const cyrb53 = (str: string, seed: number = 0) => {
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

type colorPair = { backgroundColor: string; color: string };
const colors: colorPair[] = [
    { backgroundColor: "#2196F3", color: "#ffffff" },
    { backgroundColor: "#9c27b0", color: "#ffffff" },
    { backgroundColor: "#4caf4f", color: "#ffffff" },
    { backgroundColor: "#3772FF", color: "#ffffff" },
    { backgroundColor: "#F038FF", color: "#ffffff" },
    { backgroundColor: "#EF709D", color: "#ffffff" },
    { backgroundColor: "#70E4EF", color: "#ffffff" },
    { backgroundColor: "#37123C", color: "#ffffff" },
    { backgroundColor: "#00A878", color: "#ffffff" },
    { backgroundColor: "#134074", color: "#ffffff" },
];

export function getColor(input: string): colorPair {
    let value = cyrb53(input);
    return colors[value % colors.length];
}
