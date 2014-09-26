
// Create a rule for each _.is* utility function
_.chain(_)
	.keys()
	.filter(function (a) {
		return a.slice(0, 2) == 'is';
	}).each(function (a) {
		var name = a.slice(2).toLowerCase();
		Rule[a] = new Rule(_[a], 'must be ' + name);
	});

// instanceof generator
Rule.instanceOf = function (constructor, name) {
	Rule.isFunction.check(constructor);
	return new Rule(function (val) {
		return val instanceof constructor;
	}, 'must be a ' + (name || constructor.name));
};

// string rules
Rule.maxLength = function (length, message) {
	Rule.isNumber.check(length);
	return new Rule(function (val) {
		return val.length <= length;
	}, message || ('may not be longer than ' + length));
};
Rule.minLength = function (length, message) {
	Rule.isNumber.check(length);
	return new Rule(function (val) {
		return val.length >= length;
	}, message || ('may not be shorter than ' + length));
};
Rule.matchesRegex = function (regex, message) {
	Rule.isRegExp.check(regex);
	return new Rule([
		Rule.isString
		, function (val) {
			return regex.test(val);
		}
	], message || ('must match regex ' + regex.toString()));
};

// number rules
Rule.minValue = function (min, message) {
	Rule.isNumber.check(min);
	return new Rule(function (val) {
		return val >= min;
	}, message || ('must be at least ' + min));
};
Rule.maxValue = function (max, message) {
	Rule.isNumber.check(max);
	return new Rule(function (val) {
		return val <= max;
	}, message || ('must be at most ' + max));
};
Rule.isInteger = function (interval, message) {
	if (_.isString(interval) && !message) {
		message = interval;
		interval = null;
	}
	if (!interval) {
		interval = 1;
	}
	Rule.isNumber.check(interval);
	message = message || (
		interval === 1 ?
		'must be an integer' :
		'must be divisible by ' + interval
		);
	return new Rule([
		Rule.isNumber
		, function (val) {
			return val % interval === 0;
		}
		
	], message);
};