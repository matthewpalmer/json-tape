module.exports = (access = require('safe-access')) => {
	const self = {};

	self.add = (state, writeParent, writeProperty, operand1, operand2) => {
		const result = self.load(state, operand1) + self.load(state, operand2);
		self.store(state, writeParent, writeProperty, result);
	},

	self.load = (state, operand) => {
		if (operand === 'true' || operand === 'false') return operand === 'true';
		if (!isNaN(operand)) return Number(operand); // Number
		if (operand.indexOf('"') !== -1 || operand.indexOf("'") !== -1) return operand; // String literal
		return access(state, operand); // Location reference
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
