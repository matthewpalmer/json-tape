// See tests/sample_log.txt for an example of what this can handle.
module.exports = (access = require('safe-access')) => {
	const self = {};

	self.add = (state, writeParent, writeProperty, operand1, operand2) => {
		const result = (self.load(state, operand1) || 0) + (self.load(state, operand2) || 0);
		self.store(state, writeParent, writeProperty, result);
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
		return access(state, operand);
	},

	self.store = (state, writeParent, writeProperty, value) => {
		access(state, writeParent)[writeProperty] = self.load(state, value);
	},

	self.sort = (state, path, property, order) => {
		const array = access(state, path);
		const get = (obj, property) => {
			if (!property) return obj;
			return obj[property];
		};

		array.sort((a,b) => get(a, property) >= get(b, property) ? order : -order);
	}

	return self;
};
