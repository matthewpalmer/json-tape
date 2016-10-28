const defaultTokenizer = require('./plain_text_delimiters')();
const defaultInstructionSet = require('./json_asm')()

module.exports = (tokenizer=defaultTokenizer, instructionSet=defaultInstructionSet) => {
	const self = {};

	self.play = (source, initial, done = () => {}) => {
		const executeCommands = (commands) => {
			commands.forEach(command => {
				if (!command.op) return done('Invalid command:' + JSON.stringify(command));
				instructionSet[command.op](initial, ...command.args);
			});
		};

		if (typeof source === 'string') {
			// Treat as string
			const commands = tokenizer.processChunk(source);
			executeCommands(commands);
			done(null, initial);
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
	};

	return self;
};
