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
	if (error) throw error;
};

Rule.prototype.match = function (value, context) {
	return !this.errors(value, context, null, true).length;
};

Rule.prototype.makeError = function (error, message) {
	var errorMessage = _.filter(
				[]
				.concat(message)
				.concat([
					error && error.message || "is invalid"
				])
			, _.identity
			).join(' ');

	if (error && error.statusCode) {
		return new Meteor.Error(error.statusCode, errorMessage);
	} else if (error) {
		var e = new Error(errorMessage);
		e.name = 'ValidationError';
		e.details = error;
		return e;
	}
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
						error = {
							statusCode: self.statusCode
							, message: self.message
						};
					}
				} catch (e) {
					error = e;
				}
				if (error) errors.push(self.makeError(error, message));
			} else if (a && a.errors && typeof a.errors == "function") {
				_.each(a.errors(value, context, message, shortCircut), function (e) {
					errors.push(e);
				});
			}
			if (shortCircut && errors.length) return true;
		});
	return errors;
};

Rule.prototype.throwOnInvalid = Rule.prototype.check;
Rule.prototype.isValid = Rule.prototype.match;
Rule.prototype.validationErrors = Rule.prototype.errors;

Rule.prototype.isNotValid = function () {
	return !this.isValid.apply(this, arguments);
};