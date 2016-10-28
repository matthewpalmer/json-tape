module.exports = () => {
	const self = {
		fieldDelimiter: ':',
		commandDelimiter: '\n',
		commentToken: '#'
	};

	// Takes a { action: "NAME", args: [ "ARG_1", ... ]} and 
	// returns the formatted command suitable to write to a log file
	self.stringFromCommand = ({ action, args }) => {
		return [action].concat(args).join(self.fieldDelimiter) + self.commandDelimiter;
	};

	// Takes a formatted command from the log file (i.e. `stringFromCommand`) 
	// and returns { action: "ACTION_NAME", args: ["ARG_1", "ARG_2", "ARG_3"]} 
	self.commandFromString = (string) => {
		const command = {};
		const parts = string.split(self.fieldDelimiter)
		command.action = parts[0];
		command.args = parts.slice(1);

		if (!command.action || !command.args) return;
		if (command.action[0] === self.commentToken) return;
		return command;
	};

	// Returns a list of commands discovered in this chunk of data
	self.processChunk = (chunk) => {
		// TODO: handle cross chunk boundaries
		return chunk.toString()
			.split(self.commandDelimiter)
			.map(self.commandFromString)
			.filter(c => !!c);
	};

	return self;
}