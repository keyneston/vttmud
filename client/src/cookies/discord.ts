import Cookies from "universal-cookie";

const cookies = new Cookies();

export const DiscordUserCookie = "discord-user";
export const DiscordCookie = "discord";

export function avatarImage(): string {
    var user = discordUser();
    return user?.username ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : "";
}

export function loggedIn(): boolean {
    return discordUser()?.username ? true : false;
}

export interface DiscordUser {
    username: string;
    id: string;
    avatar: string;
    global_name: string;
    display_name: string;
    avatar_decoration: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    banner: string;
    banner_color: string;
    accent_color: string;
    locale: string;
    mfa_enabled: string;
    premium_type: number;
}

export function discordUser(): DiscordUser | null {
    var c = cookies.get(DiscordUserCookie);
    if (!c) return null;
    c = c.replace(/^([sj]:)+/, "").replace(/\..*$/, "");

    try {
        return JSON.parse(c);
    } catch (c) {
        return null;
    }
}
