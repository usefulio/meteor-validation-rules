
// Create a rule for each _.is* utility function
_.chain(_)
	.keys()
	.filter(function (a) {
		return a.slice(0, 2) == 'is';
	}).each(function (a) {
		var name = a.slice(2);
		Rule[a] = new Rule(_[a], 'must be ' + name.toLowerCase());
		Rule["not" + name] = new Rule(function (val) {
			return !_[a](val);
		}, 'must not be ' + name.toLowerCase());
	});

// instanceof generator
Rule.instanceOf = function (constructor, name) {
	Rule.isFunction.check(constructor);
	return new Rule(function (val) {
		return val instanceof constructor;
	}, 'must be a ' + (name || constructor.name));
};

Rule.oneOf = function (_options, message) {
	Rule.isArray.check(_options);
	Rule.isString.optional().check(message);


	var options = _options;
	if (_.all(options, function (a) {
		return _.isString(a) || _.isNumber(a);
	})) {
		options = _.map(options, function (a) {
			return {
				_id: a
				, name: a
			};
		});
	}

	var conforms = _.all(options, function (a) {
		return _.isObject(a) && (_.isString(a._id) || _.isNumber(a._id));
	});

	if (!message) {
		message = 'must be one of ' + (
			conforms ?
			"[" + _.map(options, function (a) {
				return a.name || a._id;
			}).join(', ') + "]" :
			"options"
			);
	}
	var result = new Rule(function (val) {
		return conforms ?
			_.any(options, function (a) {return a._id == val;}) :
			_.contains(_options, val);
	}, message);

	if (conforms) result.options = options;
	else result._options = _options;

	return result;
};

// string rules
Rule.maxLength = function (length, message) {
	Rule.isNumber.check(length);
	return new Rule(function (val) {
		return !(_.isNull(val) || _.isUndefined(val)) && val.length <= length;
	}, message || ('may not be longer than ' + length));
};
Rule.minLength = function (length, message) {
	Rule.isNumber.check(length);
	return new Rule(function (val) {
		return !(_.isNull(val) || _.isUndefined(val)) && val.length >= length;
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

Rule.number = new Rule(Rule.isFinite.rules, 'must be a number');
Rule.text = new Rule(Rule.isString.rules, 'must be text');
Rule.email = Rule.matchesRegex(
	/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
	, 'must be a valid email address'
	);
Rule.url = Rule.matchesRegex(
	/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
	, 'must be a valid url'
	);
Rule.usPhoneNumber = new Rule(function (val) {
	 return val.replace(/[^0-9]/g, '').length == 10;
}, 'must be a 10 digit phone number');

var attachFunctions = function (rule, ruleDefs) {
	var rulePlugins = {};
	_.each(ruleDefs, function (a, i) {
		rulePlugins[i] = function () {
			var rule, rules;
			if (typeof a == 'function') rule = a.apply(null, arguments);
			else rule = a;
			if (_.isArray(this.rules)) rules = this.rules;
			else rules = [this];
			rules = [rule].concat(rules);
			var result = new Rule(rules);
			_.extend(result, rulePlugins);
			return result;
		};
	});
	_.extend(rule, rulePlugins);
};

attachFunctions(Rule.number, {
	min: function (min) {
		return new Rule(function (val) {
			return val >= min;
		}, 'must not be less than ' + min);
	}
	, max: function (max) {
		return new Rule(function (val) {
			return val <= max;
		}, 'must not be greater than ' + max);
	}
	, positive: function (zeroLine) {
		zeroLine = zeroLine || 0;
		return new Rule(function (val) {
			return val > zeroLine;
		}, !zeroLine ? 'must be a positive value' : 'must be greater than ' + zeroLine);
	}
	, negative: function (zeroLine) {
		zeroLine = zeroLine || 0;
		return new Rule(function (val) {
			return val < zeroLine;
		}, !zeroLine ? 'must be a negative value' : 'must be less than ' + zeroLine);
	}
});

Rule.number.greaterThan = Rule.number.positive;
Rule.number.lessThan = Rule.number.negative;

attachFunctions(Rule.text, {
	minLength: function (len) {
		return new Rule(function (val) {
			return val.length >= len;
		}, 'must be at least ' + len + ' characters');
	}
	, maxLength: function (len) {
		return new Rule(function (val) {
			return val.length <= len;
		}, 'must be at most ' + len + ' characters');
	}
});

attachFunctions(Rule.email, {
	domain: function (endsWith, message) {
		message = message || 'must be a ' + endsWith + ' email address';
		return new Rule(function (val) {
			return val.indexOf(message) != -1;
		}, message);
	}
});

attachFunctions(Rule.url, {
	domain: function (endsWith, message) {
		message = message || 'must be a ' + endsWith + ' url';
		return new Rule(function (val) {
			return val.indexOf(message) != -1;
		}, message);
	}
});
