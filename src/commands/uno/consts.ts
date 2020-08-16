import { Emoji, Client } from "discord.js";
import { unoCard } from "../../utils/interfaces";

export const stack: unoCard[] = [
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

export function displayCard(card: string, client: Client): Emoji;
export function displayCard(card: Emoji, client: Client): string;
export function displayCard(card: Emoji | string, client: Client): Emoji | string {
    if (typeof card === "string") {
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

        if (card === "b0") return client.emojis.cache.get("739607063897964625")!;
        if (card === "b1") return client.emojis.cache.get("739607063419945032")!;
        if (card === "b2") return client.emojis.cache.get("739607063323213875")!;
        if (card === "b3") return client.emojis.cache.get("739607063709352056")!;
        if (card === "b4") return client.emojis.cache.get("739607064044896276")!;
        if (card === "b5") return client.emojis.cache.get("739607063662952558")!;
        if (card === "b6") return client.emojis.cache.get("739607063654694922")!;
        if (card === "b7") return client.emojis.cache.get("739607063381934203")!;
        if (card === "b8") return client.emojis.cache.get("739607063629529208")!;
        if (card === "b9") return client.emojis.cache.get("739607063595974676")!;
        if (card === "br") return client.emojis.cache.get("739607064011341934")!;
        if (card === "b+") return client.emojis.cache.get("739607064027856986")!;
        if (card === "bs") return client.emojis.cache.get("739607063994564609")!;

        if (card === "g0") return client.emojis.cache.get("739601606399754280")!;
        if (card === "g1") return client.emojis.cache.get("739601606341034064")!;
        if (card === "g2") return client.emojis.cache.get("739601606437503077")!;
        if (card === "g3") return client.emojis.cache.get("739601606265536553")!;
        if (card === "g4") return client.emojis.cache.get("739601606303023174")!;
        if (card === "g5") return client.emojis.cache.get("739601606500286494")!;
        if (card === "g6") return client.emojis.cache.get("739601606009684040")!;
        if (card === "g7") return client.emojis.cache.get("739601606286377050")!;
        if (card === "g8") return client.emojis.cache.get("739601606261211227")!;
        if (card === "g9") return client.emojis.cache.get("739601605888049243")!;
        if (card === "gr") return client.emojis.cache.get("739601606420463647")!;
        if (card === "g+") return client.emojis.cache.get("739601606387171349")!;
        if (card === "gs") return client.emojis.cache.get("739601606185844737")!;

        if (card === "y0") return client.emojis.cache.get("739600628720074882")!;
        if (card === "y1") return client.emojis.cache.get("739600628690583593")!;
        if (card === "y2") return client.emojis.cache.get("739600628518748263")!;
        if (card === "y3") return client.emojis.cache.get("739600628640252027")!;
        if (card === "y4") return client.emojis.cache.get("739600628808024114")!;
        if (card === "y5") return client.emojis.cache.get("739600628720074853")!;
        if (card === "y6") return client.emojis.cache.get("739600628686258227")!;
        if (card === "y7") return client.emojis.cache.get("739600628892041240")!;
        if (card === "y8") return client.emojis.cache.get("739600629021933579")!;
        if (card === "y9") return client.emojis.cache.get("739600628866744500")!;
        if (card === "yr") return client.emojis.cache.get("739600628707230000")!;
        if (card === "y+") return client.emojis.cache.get("739600628413759550")!;
        if (card === "ys") return client.emojis.cache.get("739600628799766609")!;

        if (card === "s0") return client.emojis.cache.get("739608229755224125")!;
        return client.emojis.cache.get("739608229612355591")!; //s4
    } else {
        if (card.id === "739599286769156168") return "r0";
        if (card.id === "739599286790258730") return "r1";
        if (card.id === "739599286957899807") return "r2";
        if (card.id === "739599286806773792") return "r3";
        if (card.id === "739599287008100352") return "r4";
        if (card.id === "739599286857105499") return "r5";
        if (card.id === "739599286861561957") return "r6";
        if (card.id === "739599286869819508") return "r7";
        if (card.id === "739599286714761247") return "r8";
        if (card.id === "739599286534144031") return "r9";
        if (card.id === "739599286844653619") return "rr";
        if (card.id === "739599287092248716") return "r+";
        if (card.id === "740290240861700117") return "rs";

        if (card.id ==="739607063897964625") return "b0";
        if (card.id ==="739607063419945032") return "b1";
        if (card.id ==="739607063323213875") return "b2";
        if (card.id ==="739607063709352056") return "b3";
        if (card.id ==="739607064044896276") return "b4";
        if (card.id ==="739607063662952558") return "b5";
        if (card.id ==="739607063654694922") return "b6";
        if (card.id ==="739607063381934203") return "b7";
        if (card.id ==="739607063629529208") return "b8";
        if (card.id ==="739607063595974676") return "b9";
        if (card.id ==="739607064011341934") return "br";
        if (card.id ==="739607064027856986") return "b+";
        if (card.id ==="739607063994564609") return "bs";

        if (card.id === "739601606399754280") return "g0";
        if (card.id === "739601606341034064") return "g1";
        if (card.id === "739601606437503077") return "g2";
        if (card.id === "739601606265536553") return "g3";
        if (card.id === "739601606303023174") return "g4";
        if (card.id === "739601606500286494") return "g5";
        if (card.id === "739601606009684040") return "g6";
        if (card.id === "739601606286377050") return "g7";
        if (card.id === "739601606261211227") return "g8";
        if (card.id === "739601605888049243") return "g9";
        if (card.id === "739601606420463647") return "gr";
        if (card.id === "739601606387171349") return "g+";
        if (card.id === "739601606185844737") return "gs";

        if (card.id === "739600628720074882") return "y0";
        if (card.id === "739600628690583593") return "y1";
        if (card.id === "739600628518748263") return "y2";
        if (card.id === "739600628640252027") return "y3";
        if (card.id === "739600628808024114") return "y4";
        if (card.id === "739600628720074853") return "y5";
        if (card.id === "739600628686258227") return "y6";
        if (card.id === "739600628892041240") return "y7";
        if (card.id === "739600629021933579") return "y8";
        if (card.id === "739600628866744500") return "y9";
        if (card.id === "739600628707230000") return "yr";
        if (card.id === "739600628413759550") return "y+";
        if (card.id === "739600628799766609") return "ys";

        if (card.id === "739608229755224125") return "s0";
        return "s4";
    }
}