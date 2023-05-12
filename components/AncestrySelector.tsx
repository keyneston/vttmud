import { Dropdown } from "primereact/dropdown";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import * as types from "types/characters";

export interface AncestrySelectorProps {
	value: types.Ancestry;
	setValue: (ancestry: types.Ancestry) => void;
	className: string;
}

export function AncestrySelector({ value, setValue, className }: AncestrySelectorProps) {
	const { data } = useQuery({
		queryKey: ["ancestriesDB"],
		queryFn: () => fetch("/ancestries.db.json").then((response) => response.json()),
		placeholderData: [],
		cacheTime: 7200 * 1000, // 1 hour
		staleTime: 3600 * 1000,
	});

	const _data = [...data];
	_data.push({ id: "other", name: "Other" });

	return (
		<>
			<Dropdown
				className={className}
				value={value}
				onChange={(e) => setValue(e.value)}
				options={_data}
				optionLabel="name"
				placeholder="Select an Ancestry"
			/>
		</>
	);
}

export interface HeritageSelectorProps {
	value: Heritage;
	setValue: (h: Heritage) => void;
	ancestry: types.Ancestry;
	className: string;
}

export function HeritageSelector({ value, setValue, ancestry, className }: HeritageSelectorProps) {
	const { data } = useQuery({
		queryKey: ["heritageDB"],
		queryFn: () => fetch("/heritages.db.json").then((response) => response.json()),
		placeholderData: [],
		cacheTime: 7200 * 1000, // 1 hour
		staleTime: 3600 * 1000,
	});

	const results = useMemo(() => {
		return data.filter((e: types.Heritage) => {
			return e.ancestry == null || e.ancestry.name === ancestry?.name;
		});
	}, [ancestry]);

	const _results = [...results];
	_results.push({ id: "other", name: "Other" });

	return (
		<>
			<Dropdown
				value={value}
				onChange={(e) => setValue(e.value)}
				options={_results}
				optionLabel="name"
				placeholder="Select a Heritage"
				className={className}
			/>
		</>
	);
}
