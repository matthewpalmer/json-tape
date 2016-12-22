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

		for (var i = 0; i < initial[self.statements].length; i++) {
			initial[self.index] = i;

			const command = tokenizer.command(initial[self.statements][i]);
			if (!command) continue;
			if (!command.op) return done('Invalid command:' + JSON.stringify(command));
			instructionSet[command.op](initial, ...command.args);
		}

		delete initial[self.statements];
		delete initial[self.index];
		
		done(null, initial);
	};

	return self;
};


