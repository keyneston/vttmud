import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import { loggedIn, avatarImage } from "../utils/cookies/discord";

import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";

import styles from "./NavBar.module.css";

function NavBar() {
	const [avatarStyle, setAvatarStyle] = useState<any>({});
	const [image, setImage] = useState<string>("");

	const toast = useRef<Toast>(null);
	useEffect(() => {
		setAvatarStyle(loggedIn() ? {} : { backgroundColor: "#2196F3", color: "#ffffff" });
		setImage(avatarImage());
	});

	return (
		<>
			<div className={styles.navbar}>
				<div className={styles.navbar_left}>
					<div className={styles.logo}>
						<Link className={styles.logo} href="/">
							VTTMud
						</Link>
					</div>
				</div>
				<div className={styles.navbar_right}>
					<Avatar
						label="U"
						size="xlarge"
						style={avatarStyle}
						image={image}
						shape="circle"
					/>
					<Toast ref={toast} />
				</div>
			</div>
			<div className={styles.navbar_divider} />
		</>
	);
}

export { NavBar };
