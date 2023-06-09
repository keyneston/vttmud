import React from "react";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Panel } from "primereact/panel";
import { Fragment, ReactNode } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import styles from "./index.module.css";
import MarkdownIt from "markdown-it";

dayjs.extend(advancedFormat);

const md = new MarkdownIt();

type Entry = {
	date: dayjs.Dayjs;
	tasks: string[];
};

type RoadmapEntry = {
	complete?: boolean;
	item: string;
};

const roadmap: RoadmapEntry[] = [
	{ item: "Deletion of downtime entries" },
	{ item: "Deletion of log entries" },
	{ item: "Per-server character directory" },
	{ item: "Discord integration to track player activity to allow filtering by active players" },
	{ item: "Event organisation" },
	{ item: "Download data as CSV", complete: true },
	{ item: "Editing of character ancestry and heritage", complete: true },
	{ item: "Per-server admin tools" },
	{ item: "Tracking of non-money values, e.g. adamantine" },
];

const logEntries: Entry[] = [
	{
		date: dayjs("2023-05-16"),
		tasks: ["Don't filter servers by discord membership. This works around issues with discord API"],
	},
	{
		date: dayjs("2023-05-12"),
		tasks: ["Allow editing of character ancestry and heritage"],
	},
	{
		date: dayjs("2023-05-11"),
		tasks: [
			"Fix issue in how money was rounding silver values [issue#26](https://github.com/keyneston/vttmud/issues/26)",
		],
	},
	{
		date: dayjs("2023-05-04"),
		tasks: [
			"Fix download csv on downtime log page",
			"Fix bug where earned income template was including one too many days",
			"Fixed [issue#20](https://github.com/keyneston/vttmud/issues/20) where cropper wasn't displaying",
		],
	},
	{
		date: dayjs("2023-04-28"),
		tasks: [
			"Start of server gallery",
			"Ability to set ancestry and heritage at character creation. Editing existing characters to come",
		],
	},
	{
		date: dayjs("2023-04-26"),
		tasks: ["Added download as CSV to Wallet and Downtime logs"],
	},
	{
		date: dayjs("2023-04-25"),
		tasks: ["Ability to delete characters", "Ignore 'Other' entries when calculating remaining downtime"],
	},
	{
		date: dayjs("2023-04-22"),
		tasks: [
			"Now displays (partially accurate) skill modifiers based upon uploaded JSON file",
			"Fixed bug in how negative monetary amounts are recorded",
		],
	},
	{
		date: dayjs("2023-04-21"),
		tasks: [
			"Added Roll Distribution chart to downtime log",
			"Added 'Other' activity to downtime",
			"Rudimentary parsing of JSON files",
		],
	},
	{
		date: dayjs("2023-04-20"),
		tasks: [
			"Add avatar to log pages to indicate which character is selected",
			"Allow setting custom items when crafting",
		],
	},
	{
		date: dayjs("2023-04-19"),
		tasks: ["Added cropping tool to crop avatar images before uploading"],
	},
	{
		date: dayjs("2023-04-18"),
		tasks: ["Add editing of downtime entries", "Display remaining downtime on downtime log"],
	},
	{
		date: dayjs("2023-04-17"),
		tasks: [
			"Fix sorting of downtime entries",
			"Default level/craft dcs in downtime entries to current level",
			"Add editing of existing character log entries",
			"Fix bug where downtime log would record into the future",
			"Added bonus field to bulk set bonus on downtime logs",
		],
	},
	{
		date: dayjs("2023-04-16"),
		tasks: [
			"Added log for tracking uses of downtime, UI is rudimentary at this point",
			"Added pie chart for Activity type in Downtime Log",
		],
	},
	{
		date: dayjs("2023-04-15"),
		tasks: [
			"Added Homepage with changelog",
			"Link on Character Sheet to download JSON",
			"Navigation Sidebar",
		],
	},
];

export default function Home() {
	return (
		<div className={styles.home_root}>
			<Panel header="Welcome">
				<p>
					Welcome to VTTMud. This site is a work in progress. Please contact{" "}
					<a href="https://discordapp.com/users/620653174469951512">
						<i className="pi pi-discord" /> @keyneston#2930
					</a>{" "}
					on discord if you have feedback.
				</p>
			</Panel>
			<TabView>
				<TabPanel header="Changelog">
					<Changelog data={logEntries} />
				</TabPanel>
				<TabPanel header="Roadmap">
					<Roadmap data={roadmap} />
				</TabPanel>
			</TabView>
		</div>
	);
}

function Changelog({ data }: { data: Entry[] }) {
	return (
		<ul>
			{data.map((e: any): ReactNode => {
				return <FormatEntry key={e.date} entry={e} />;
			})}
		</ul>
	);
}

function FormatEntry({ entry }: { entry: Entry }) {
	return (
		<Fragment key={`changelog-${entry.date.format("yyyy-mm-DD")}`}>
			<li>{entry.date.format("MMM Do")}</li>
			<ul>
				{entry.tasks.map((t, i) => {
					return <li key={i} dangerouslySetInnerHTML={{ __html: md.renderInline(t) }} />;
				})}
			</ul>
		</Fragment>
	);
}

function Roadmap({ data }: { data: RoadmapEntry[] }) {
	return (
		<ul style={{ listStyle: "none" }}>
			{data.map((e: any, i): ReactNode => {
				if (e.item === "") {
					return;
				}
				return (
					<Fragment key={i}>
						<li>
							<i className={"pi " + (e.complete ? "pi-check" : "pi-times")} />{" "}
							<span
								dangerouslySetInnerHTML={{
									__html: md.renderInline(e.item),
								}}
							/>
						</li>
					</Fragment>
				);
			})}
		</ul>
	);
}
