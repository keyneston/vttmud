import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { loginAction, logoutAction } from "./routes/login";
import reportWebVitals from "./reportWebVitals";
import { Link, createBrowserRouter, RouterProvider } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import Root from "./routes/root";
import Templates from "./routes/templates";
import Home from "./routes/home";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{
				path: "",
				element: <Link to="/templates">Templates</Link>,
				loader: Home,
			},
			{
				path: "templates",
				element: <Templates />,
			},
			{
				path: "login",
				loader: loginAction,
			},
			{
				path: "logout",
				loader: logoutAction,
			},
		],
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
