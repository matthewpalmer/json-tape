module.exports = ({
	tokenizer = require('./plain_text_delimiters')(),
	instructionSet = require('./json_asm')()
} = {}) => {
	const self = {};

	self.replay = (logStream, initial, done = () => {}) => {
		logStream.on('data', (chunk) => {
			const commands = tokenizer.processChunk(chunk);
			commands.forEach(command => {
				if (!command.op) return done('Invalid command:' + JSON.stringify(command));
				instructionSet[command.op](initial, ...command.args);
			});
		});

		logStream.on('close', () => {
			done(null, initial);
		});

		logStream.on('error', (error) => {
			done(error);
		});
	};

	return self;
};
