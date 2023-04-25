import React, { useState, useEffect } from "react";
import { CraftTemplate } from "components/CraftTemplate";
import { IncomeTemplate } from "components/IncomeTemplate";
import useLocalStorage from "utils/useLocalStorage";

import styles from "./index.module.scss";

export default function Templates() {
	const [name, setName] = useLocalStorage<string>("character_name", "");

	return (
		<>
			<div className={styles.fifty_fifty}>
				<div className={styles.content_left}>
					<CraftTemplate name={name} setName={setName} />
				</div>
				<div className={styles.content_right}>
					<IncomeTemplate name={name} setName={setName} />
				</div>
			</div>
		</>
	);
}
