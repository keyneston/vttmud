export default function Home() {
	return (
		<>
			<h2>Welcome</h2>
			<p>
				Welcome to VTTMud. This site is a work in progress. Please contact{" "}
				<a href="https://discordapp.com/users/620653174469951512">
					<i className="pi pi-discord" /> @keyneston#2930
				</a>{" "}
				on discord if you have feedback.
			</p>

			<h2>Changelog</h2>
			<ul>
				<li>April 18th</li>
				<ul>
					<li>Add editing of downtime entries</li>
				</ul>
				<li>April 17th</li>
				<ul>
					<li>Fix sorting of downtime entries</li>
					<li>Default level/craft dcs in downtime entries to current level</li>
					<li>Add editing of existing character log entries</li>
					<li>Fix bug where downtime log would record into the future</li>
					<li>Added bonus field to bulk set bonus on downtime logs</li>
				</ul>
				<li>April 16th</li>
				<ul>
					<li>
						Added log for tracking uses of downtime. UI is rudimentary at this
						point.
					</li>
					<li>Added pie chart for Activity type in Downtime Log.</li>
				</ul>
				<li>April 15th</li>
				<ul>
					<li>Added Homepage with changelog</li>
					<li>Link on Character Sheet to download JSON</li>
					<li>Navigation Sidebar</li>
				</ul>
			</ul>
		</>
	);
}
