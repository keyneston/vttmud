import { redirect } from "react-router-dom";

export default async function loginAction() {
	try {
		const response = await fetch("/api/v1/login"); // TODO: something here to sort out the hostname
		const parsed: {redirect_url: string} = await response.json();
		return redirect(parsed.redirect_url);
	} catch (error) {
		console.log(error);
		return <div>Error: {JSON.stringify(error)}</div>
	}
}
