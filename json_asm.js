const jsonPointer = require('./json-pointer');

// See tests/sample_log.txt for an example of what this can handle.
module.exports = (access=jsonPointer) => {
	const self = {};

	self.add = (state, lvalue, operand1, operand2) => {
		const result = (self.load(state, operand1) || 0) + (self.load(state, operand2) || 0);
		self.store(state, lvalue, result);
	},

	self.load = (state, operand) => {
		// Handle literals and convert to their true type if possible
		if (operand === 'true' || operand === 'false') return operand === 'true';
		if (!isNaN(operand)) return Number(operand);
		if (operand.indexOf('"') === 0 || operand.indexOf("'") === 0) {
			const endQuote = operand[operand.length - 1] === '"' || operand[operand.length - 1] === "'";
			return operand.slice(1, endQuote ? operand.length - 1 : operand.length);
		}

		// Dereference pointers
		return access.get(state, operand);
	},

	self.store = (state, path, value) => {
		access.set(state, path, self.load(state, value));
	},

	self.sort = (state, path, property, order) => {
		const array = access.get(state, path);
		const get = (obj, property) => {
			if (!property) return obj;
			return obj[property];
		};

		array.sort((a,b) => get(a, property) >= get(b, property) ? order : -order);
	};

	self.jump = (state, amount) => {
		
	};

	return self;
};
