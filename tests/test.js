const assert = require('assert');
const fs = require('fs');
const stream = fs.createReadStream(__dirname + '/sample_log.txt');

const replayer = require('../command_player')();

const original = {
	results: [
		{ weight: 65, title: 'sixty five' },
		{ weight: 120, title: 'one twenty' },
	],
	values: []
};

console.log('Default log stream (json_asm, plain_text_delimiters)');

const expected = { results: 
	[ { weight: 153, title: 'one twenty' }, { weight: 6, title: 'okay like overwrite this' } ],
	values: [ 1, 4, 6, 7 ],
	what: 'we can set nonexistent props on the root object'
};

replayer.replay(stream, original, (error, mutated) => {
	assert(JSON.stringify(mutated) === JSON.stringify(expected));
	console.log('Sample log stream passed.');
});
