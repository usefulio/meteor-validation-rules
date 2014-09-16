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
