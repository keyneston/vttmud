import { Server } from "prisma/client";

export async function fetchServer(slug: string): Promise<Server> {
    const resp = await fetch(`/api/v1/server/${slug}`);
    return resp.json();
}
