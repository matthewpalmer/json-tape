module.exports = (access) => {
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

	self.splice = (state, path, start, deleteCount, ...newValues) => {
		const array = access.get(state, path);
		array.splice(self.load(state, start), 
			self.load(state, deleteCount), 
			...(newValues.map(v => self.load(state, v))));
	};

	self.if_not_equal = (state, operand1, operand2, command) => {
		if (self.load(state, operand1) == self.load(state, operand2)) return;
		const next_instr = self.load(state, '/__index__') + 1;
		self.splice(state, '/__statements__', next_instr, 0, command);
	};

	return self;
};
