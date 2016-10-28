const assert = require('assert');
const fs = require('fs');
const stream = fs.createReadStream(__dirname + '/custom_log.txt');

const customParser = {
	processChunk: (chunk) => {
		return JSON.parse(chunk.toString());
	}
};

const customActions = {
	pushRandom: (state, negative) => {
		const val = negative ? -1 : 1;
		state.push(val);
	}
};

const replayer = require('../log_replayer')({
	actions: customActions,
	parser: customParser
});

const original = [];
const expected = [-1, 1];

console.log('JSON custom format and actions');

replayer.replay(stream, original, (error, mutated) => {
	assert(mutated[0] === expected[0]);
	assert(mutated[1] === expected[1]);
	console.log('JSON passed.')
});
