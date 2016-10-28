const assert = require('assert');
const tokenizer = require('../plain_text_delimiters')();

module.exports = (done) => {
	console.log('Tokenizer: Plain text delimiters');
	const cmd = tokenizer.commandFromString('store:results[19]:title:"SPRING CARNIVAL: WEEKEND BEST BETS"');
	const cmd2 = tokenizer.commandFromString('store:results[19]:title:"John\'s shoes: some trippy \'input\'"');

	assert(cmd.op === 'store');
	assert(cmd.args[0] === 'results[19]');
	assert(cmd.args[1] === 'title');
	assert(cmd.args[2] === '"SPRING CARNIVAL: WEEKEND BEST BETS"');

	assert(cmd2.op === 'store');
	assert(cmd2.args[0] === 'results[19]');
	assert(cmd2.args[1] === 'title');
	assert(cmd2.args[2] === "\"John\'s shoes: some trippy \'input\'\"");
	console.log('Tokenizer: Plain text delimiters passed');

	done();
}
