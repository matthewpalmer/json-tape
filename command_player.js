module.exports = ({
	tokenizer = require('./plain_text_delimiters')(),
	instructionSet = require('./json_asm')()
} = {}) => {
	const self = {};

	self.play = (source, initial, done = () => {}) => {
		if (typeof source === 'string') {
			// Treat as string
			const commands = tokenizer.processChunk(source);
			executeCommands(commands);
		} else {
			// Treat as stream
			source.on('data', (chunk) => {
				const commands = tokenizer.processChunk(chunk);
				executeCommands(commands);
			});

			source.on('end', () => {
				done(null, initial);
			});

			source.on('error', (error) => {
				done(error);
			});
		}

		const executeCommands = (commands) => {
			commands.forEach(command => {
				if (!command.op) return done('Invalid command:' + JSON.stringify(command));
				instructionSet[command.op](initial, ...command.args);
			});
		};
	};

	return self;
};
