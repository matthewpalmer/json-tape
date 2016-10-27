module.exports = ({
	parser = require('./command_parser')(),
	actions = require('./log_actions')()
} = {}) => {
	const self = {};

	self.replay = (logStream, initial, done = () => {}) => {
		logStream.on('data', (chunk) => {
			const commands = parser.processChunk(chunk);
			commands.forEach(command => {
				if (!command.action) return done('Invalid command:' + JSON.stringify(command));
				actions[command.action](initial, ...command.args);
			});
		});

		logStream.on('close', () => {
			done(null, initial);
		});

		logStream.on('error', (error) => {
			done(error);
		})
	};

	return self;
};
