import { Emoji, Client } from "discord.js";

export const stack: string[] = [
    'r0', 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'rs', 'r+', 'rr',
    'g0', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'gs', 'g+', 'gr',
    'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'bs', 'b+', 'br',
    'y0', 'y1', 'y2', 'y3', 'y4', 'y5', 'y6', 'y7', 'y8', 'y9', 'ys', 'y+', 'yr',
    'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'rs', 'r+', 'rr',
    'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'gs', 'g+', 'gr',
    'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'bs', 'b+', 'br',
    'y1', 'y2', 'y3', 'y4', 'y5', 'y6', 'y7', 'y8', 'y9', 'ys', 'y+', 'yr',
    's0', 's0', 's0', 's0', 's4', 's4', 's4', 's4'
];

export function isValidMove(n: string, o: string): boolean {
    return n[0] === o[0] || n[1] === o[1] || n[0] === "s";
}

export function displayCard(card: string, client: Client): Emoji | string {
    if (card === "r0") return client.emojis.cache.get("739599286769156168")!;
    if (card === "r1") return client.emojis.cache.get("739599286790258730")!;
    if (card === "r2") return client.emojis.cache.get("739599286957899807")!;
    if (card === "r3") return client.emojis.cache.get("739599286806773792")!;
    if (card === "r4") return client.emojis.cache.get("739599287008100352")!;
    if (card === "r5") return client.emojis.cache.get("739599286857105499")!;
    if (card === "r6") return client.emojis.cache.get("739599286861561957")!;
    if (card === "r7") return client.emojis.cache.get("739599286869819508")!;
    if (card === "r8") return client.emojis.cache.get("739599286714761247")!;
    if (card === "r9") return client.emojis.cache.get("739599286534144031")!;
    if (card === "rr") return client.emojis.cache.get("739599286844653619")!;
    if (card === "r+") return client.emojis.cache.get("739599287092248716")!;
    if (card === "rs") return client.emojis.cache.get("740290240861700117")!;
    if (card === "b0") return client.emojis.cache.get("x")!;
    if (card === "b1") return client.emojis.cache.get("x")!;
    if (card === "b2") return client.emojis.cache.get("x")!;
    if (card === "b3") return client.emojis.cache.get("x")!;
    if (card === "b4") return client.emojis.cache.get("x")!;
    if (card === "b5") return client.emojis.cache.get("x")!;
    if (card === "b6") return client.emojis.cache.get("x")!;
    if (card === "b7") return client.emojis.cache.get("x")!;
    if (card === "b8") return client.emojis.cache.get("x")!;
    return card;
}
