import { redirect } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export async function loginAction() {
	try {
		const response = await fetch("/api/v1/login"); // TODO: something here to sort out the hostname
		const parsed: { redirect_url: string } = await response.json();
		return redirect(parsed.redirect_url);
	} catch (error) {
		console.log(error);
		return <div>Error: {JSON.stringify(error)}</div>;
	}
}

export async function logoutAction() {
	cookies.remove("discord");
	cookies.remove("discord-user");

	return redirect("/");
}
