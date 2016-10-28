module.exports = ({
	tokenizer = require('./plain_text_delimiters')(),
	isa = require('./json_asm')()
} = {}) => {
	const self = {};

	self.replay = (logStream, initial, done = () => {}) => {
		logStream.on('data', (chunk) => {
			const commands = tokenizer.processChunk(chunk);
			commands.forEach(command => {
				if (!command.action) return done('Invalid command:' + JSON.stringify(command));
				isa[command.action](initial, ...command.args);
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
