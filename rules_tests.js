var existsTest = function (value) {
	return !!value;
};

var isStringTest = function (value) {
	return typeof value ==  'string';
};

var existsMessage = 'must exist';

var extendedMessage = 'my value';

Tinytest.add('Rules - match function', function (test) {
	test.equal(new Rule(existsTest).match(''), false);
	test.equal(new Rule(existsTest).match('has value'), true);
});

Tinytest.add('Rules - check function', function (test) {
	try {
		test.throws(new Rule(existsTest).check(''));
		test.equal(true, false);
	} catch (e) {}
	try {
		test.throws(new Rule(existsTest).check('has value'));
	} catch (e) {
		test.equal(true, false);
	}
});

Tinytest.add('Rules - errors function', function (test) {
	test.equal(!!new Rule(existsTest).errors('')[0], true);
	test.equal(!!new Rule(existsTest).errors('has value')[0], false);
});

Tinytest.add('Rules - message', function (test) {
	test.equal(new Rule(existsTest, 400, existsMessage).errors('')[0].reason, existsMessage);
	test.equal(new Rule(existsTest, 400, existsMessage).errors('', null, extendedMessage)[0].reason, extendedMessage + ' ' + existsMessage);
});

Tinytest.add('Rules - accepts rule as parameter', function (test) {
	test.equal(new Rule(new Rule(existsTest)).match(''), false);
	test.equal(new Rule(new Rule(existsTest)).match('has value'), true);
});

Tinytest.add('Rules - accepts array as parameter', function (test) {
	test.equal(new Rule([existsTest]).match(''), false);
	test.equal(new Rule([existsTest]).match('has value'), true);
});

Tinytest.add('Rules - processes whole array', function (test) {
	test.equal(new Rule([existsTest, isStringTest]).match(''), false);
	test.equal(new Rule([existsTest, isStringTest]).match(6), false);
	test.equal(new Rule([existsTest, isStringTest]).match('has value'), true);
});

Tinytest.add('Rules - respects a custom errors function', function (test) {
	var rule = new Rule(existsTest);
	rule.errors = function (value) {
		return ['error'];
	};
	test.equal(rule.match(''), false);
	test.equal(rule.match('has value'), false);
	try {
		test.throws(rule.check(''));
		test.equal(true, false);
	} catch (e) {
	}
	try {
		test.throws(rule.check('has value'));
		test.equal(true, false);
	} catch (e) {
	}
	test.equal(rule.errors('')[0], 'error');
});

Tinytest.add('Rules - treats objects with an errors function as rule objects', function (test) {
	var mockRule = {
		errors: function (a) {
			return a ? ['error'] : [];
		}
	};
	test.equal(new Rule(mockRule).match(''), true);
	test.equal(new Rule(mockRule).match('has value'), false);
});

Tinytest.add('Rules - reports all errors', function (test) {
	var rule = new Rule([
		new Rule(existsTest, 400, 'required')
		, new Rule(isStringTest, 400, 'string')
		]);
	var errors = rule.errors(null);
	test.equal(errors.length, 2);
	test.equal(errors[0].reason, 'required');
	test.equal(errors[1].reason, 'string');
});

Tinytest.add('Rules - respects short circut param', function (test) {
	var rule = new Rule([
		new Rule(existsTest, 400, 'required')
		, new Rule(isStringTest, 400, 'string')
		]);
	var errors = rule.errors(null, null, '', true);
	test.equal(errors.length, 1);
	test.equal(errors[0].reason, 'required');
});

Tinytest.add('Rules - returns a new rule if called without new operator', function (test) {
	var rule = Rule(_.isString);

	test.instanceOf(rule, Rule);

	test.isTrue(rule.match(''));
	test.isFalse(rule.match(1));
});

Tinytest.add('Rules - treats statusCode as optional (defaults to 400)', function (test) {
	var rule = new Rule(_.isString, 'must be a string');

	test.throws(function () {
		rule.check(1);
	}, 'must be a string [400]');

});

Tinytest.add('Rules - helper functions - optional helper returns an optional rule', function (test) {
	var rule = new Rule(_.isString, 'must be a string');
	var falsy = function (value) {
		return !value;
	};
	var empty;

	test.isTrue(rule.optional().match());
	test.isTrue(rule.optional().match(empty));
	test.isTrue(rule.optional().match(null));
	test.isFalse(rule.optional().match(0));
	test.isFalse(rule.optional().match(false));

	test.isTrue(rule.optional(falsy).match(0));
	test.isTrue(rule.optional(falsy).match(false));
});

// XXX implement and test some built in helpers:
// Rule.optional(isNullFn), converts a rule into an optional rule, useful
// for when a rule tests for a type (eg _.isNumber) but that value is optional
// the optional argument is a function which tests for emptiness, defaults to
// _.isUndefined && _.isNull
// Rule.internal(externalError), prevents rule from throwing client visible
// errors when run on the server, the optional argument is an error object
// eg: {message: 'access denied', statusCode: 403}
// Rule.or(rules...), succeeds if any of the rules succeed, otherwise throws the
// first error

// XXX implement and test some built in rules:
// _.is*
// etc.
