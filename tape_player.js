const access = require('./json_pointer');
const defaultTokenizer = require('./plain_text_delimiters')();
const defaultInstructionSet = require('./json_asm')(access)

module.exports = (tokenizer=defaultTokenizer, instructionSet=defaultInstructionSet) => {
	const self = {
		tokenizer,
		instructionSet,
		access,

		statements: '__statements__', // Program
		index: '__index__' // Program counter
	};

	self.play = (source, initial, done = () => {}) => {
		initial[self.statements] = tokenizer.statements(source);

		function next(finished) {
			const command = tokenizer.command(initial[self.statements][initial[self.index]]);
			if (!command) {
				initial[self.index]++;
				return next(finished);
			};

			if (!command.op) return done('Invalid command:' + JSON.stringify(command));

			const wait = instructionSet[command.op](initial, ...command.args);

			function go() {
				initial[self.index]++;
				if (initial[self.index] >= initial[self.statements].length) return finished();
				next(finished);
			}

			if (wait && typeof wait === 'number') return setTimeout(go, wait);
			go();
		}

		initial[self.index] = 0;
		next(() => {
			delete initial[self.statements];
			delete initial[self.index];
			
			done(null, initial);
		});
	};

	return self;
};


