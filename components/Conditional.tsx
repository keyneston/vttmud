import React, { ReactNode } from "react";

export interface ConditionalProps {
	show: boolean;
	children: ReactNode;
}

// Inspired by and based on
// https://medium.com/@brandonlostboy/build-it-better-next-js-conditional-rendering-be5617431cef
export default function Conditional({ show, children }: ConditionalProps) {
	if (show === undefined) {
		throw "Conditional: show must not be undefined";
	}
	if (show) {
		return <>{children}</>;
	} else {
		return <></>;
	}
}
