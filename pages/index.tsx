import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Panel } from "primereact/panel";
import { Fragment, ReactNode } from "react";
import "./index.module.css";

dayjs.extend(advancedFormat);

type Entry = {
	date: dayjs.Dayjs;
	tasks: string[];
};

const logEntries: Entry[] = [
	{
		date: dayjs("2023-04-25"),
		tasks: [
			"Ignore 'Other' entries when calculating remaining downtime",
		],
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
		<div className="home-root">
			<Panel header="Welcome">
				<p>
					Welcome to VTTMud. This site is a work in progress. Please contact{" "}
					<a href="https://discordapp.com/users/620653174469951512">
						<i className="pi pi-discord" /> @keyneston#2930
					</a>{" "}
					on discord if you have feedback.
				</p>
			</Panel>
			<Changelog data={logEntries} />
		</div>
	);
}

function Changelog({ data }: { data: Entry[] }) {
	return (
		<Panel header="Changelog">
			<ul>
				{data.map((e: any): ReactNode => {
					return <FormatEntry key={e.date} entry={e} />;
				})}
			</ul>
		</Panel>
	);
}

function FormatEntry({ entry }: { entry: Entry }) {
	return (
		<Fragment key={`changelog-${entry.date.format("yyyy-mm-DD")}`}>
			<li>{entry.date.format("MMM Do")}</li>
			<ul>
				{entry.tasks.map((t, i) => {
					return <li key={i}>{t}</li>;
				})}
			</ul>
		</Fragment>
	);
}
