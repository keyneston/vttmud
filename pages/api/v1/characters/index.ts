import { NextRequest, NextResponse } from "next/server";
import { Character } from "../../types/characters";
import { loggedIn } from "../../utils/cookies/discord";

export default async function listCharacters(): Promise<Character[]> {
    if (!loggedIn()) {
        return [];
    }

    const results = await fetch("/api/v1/characters").then((d) => d.json());
    return results;
}
