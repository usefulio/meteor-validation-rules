Rule = function (validateFn, statusCode, message) {
	if (!(this instanceof Rule)) {
		return new Rule(validateFn, statusCode, message);
	}
	if (typeof statusCode == 'string' && _.isUndefined(message)) {
		message = statusCode;
		statusCode = 400;
	}

	this.rules = validateFn;
	this.statusCode = statusCode;
	this.message = message;
};

Rule.prototype.check = function(value, context, message) {
	if (context && typeof context != 'object') {
		message = context;
		context = {};
	}
	var error = this.errors(value, context, message, true)[0];
	if (error) throw this.makeError(error);
};

Rule.prototype.match = function (value, context) {
	return !this.errors(value, context, null, true).length;
};

Rule.prototype.makeError = function (error) {
	return error.error;
};

Rule.prototype.makeMessage = function (path) {
	return _.chain([].concat(path).concat(this.message || 'is invalid'))
		.flatten()
		.filter(_.identity)
		.value()
		.join(' ');
};

Rule.prototype.errors = function (value, context, message, shortCircut) {
	var validators = [].concat(this.rules);
	var errors = [];
	var self = this;
	_.chain(validators)
		.flatten()
		.find(function (a) {
			if (typeof a == 'function') {
				var error;
				try {
					if (!a.call(context, value)) {
						var errorMessage = self.makeMessage(message);
						error = {
							message: errorMessage
							, statusCode: self.statusCode
							, error: new Meteor.Error(self.statusCode, errorMessage)
						};
					}
				} catch (e) {
					error = {
						error: e
						, message: self.makeMessage(message, ['validation failed:', e.message])
					};
				}
				if (error) errors.push(error);
			} else if (a && a.errors && typeof a.errors == "function") {
				_.each(a.errors(value, context, message, shortCircut), function (e) {
					errors.push(e);
				});
			}
			if (shortCircut && errors.length) return true;
		});
	return errors;
};

Rule.emptynessFn = function (value) {
	return _.isNull(value) || _.isUndefined(value);
};

Rule.prototype.optional = function (emptynessFn) {
	var original = this;
	emptynessFn = emptynessFn || Rule.emptynessFn;
	var self = new Rule(original);
	self.errors = function (value) {
		if (emptynessFn(value)) return [];
		else return Rule.prototype.errors.apply(this, arguments);
	};
	return self;
};

Rule.prototype.internal = function (externalError) {
	var original = this;
	var self = new Rule(original);
	self.makeError = function (error) {
		var result = externalError ?
			new Meteor.Error(externalError.statusCode, externalError.message) :
			new Error(error.message);
		result.stack = error.error.stack;
		return result;
	};
	return self;
};