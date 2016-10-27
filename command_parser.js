module.exports = () => {
	const self = {};

	var mostRecentCompletedCommandString = undefined;
	var currentCommandString = '';

	// Returns { action: "ACTION_NAME", args: ["ARG_1", "ARG_2", "ARG_3"]}
	self.commandFromString = (string) => {
		const command = {};
		const parts = string.split(':')
		command.action = parts[0];
		command.args = parts.slice(1);

		if (!command.action || !command.args) return;
		if (command.action[0] === '#') return;
		return command;
	};

	// Returns the latest command if a complete command is available, otherwise returns undefined.
	self.processChunk = (chunk) => {
		// TODO: handle cross chunk boundaries
		return chunk.toString()
			.split('\n')
			.map(self.commandFromString)
			.filter(c => !!c);
	};

	return self;
}