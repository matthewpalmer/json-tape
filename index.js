const fs = require('fs');
const stream = fs.createReadStream('sample_log.txt');

const replayer = require('./log_replayer')();

const original = {
	results: [
		{ weight: 65, title: 'sixty five' },
		{ weight: 120, title: 'one twenty' },
	],
	values: []
};

console.log('Original is', original);

console.log('\n\nReplaying log stream');

replayer.replay(stream, original, (error, mutated) => {
	console.log('After replay', error, mutated);
});

