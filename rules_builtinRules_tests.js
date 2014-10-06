var test = function test() {};

_.each([
		{
			name: "isEmpty"
			, expectedError: "must be empty"
			, validValues: [
				0,
				NaN,
				"",
				[],
				false,
				null,
				undefined,
				{},
				function () {},
				1,
				Infinity,
				true
				]
			, invalidValues: [
				" ",
				"0",
				"1",
				{a: '5'},
				[""]

			]
		}
		, {
			name: "isElement"
			, expectedError: "must be element"
			, validValues: Meteor.isClient ? [document.createElement('a')] : []
			, invalidValues: [
				0,
				1,
				NaN,
				Infinity,
				"",
				" ",
				"0",
				"1",
				null,
				undefined,
				{},
				{a: '5'},
				function () {},
				true,
				false,
				[],
				[""]
			]
		}
		, {
			name: "isArray"
			, expectedError: "must be array"
			, validValues: [
				[],
				[""]]
			, invalidValues: [
				0,
				1,
				NaN,
				Infinity,
				"",
				" ",
				"0",
				"1",
				null,
				undefined,
				{},
				{a: '5'},
				function () {},
				true,
				false,
			]
		}
		, {
			name: "isObject"
			, expectedError: "must be object"
			, validValues: [
				{},
				function () {},
				{a: '5'},
				[],
				[""]
				]
			, invalidValues: [
				0,
				1,
				NaN,
				Infinity,
				"",
				" ",
				"0",
				"1",
				null,
				undefined,
				true,
				false,
			]
		}
		, {
			name: "isArguments"
			, expectedError: "must be arguments"
			, validValues: [(function (a) {return arguments;})()]
			, invalidValues: [
				0,
				1,
				NaN,
				Infinity,
				"",
				" ",
				"0",
				"1",
				null,
				undefined,
				{},
				{a: '5'},
				function () {},
				true,
				false,
				[],
				[""]
			]
		}
		, {
			name: "isFunction"
			, expectedError: "must be function"
			, validValues: [
				function () {}]
			, invalidValues: [
				0,
				1,
				NaN,
				Infinity,
				"",
				" ",
				"0",
				"1",
				null,
				undefined,
				{},
				{a: '5'},
				true,
				false,
				[],
				[""]
			]
		}
		, {
			name: "isString"
			, expectedError: "must be string"
			, validValues: [
				"",
				" ",
				"0",
				"1"]
			, invalidValues: [
				0,
				1,
				NaN,
				Infinity,
				null,
				undefined,
				{},
				{a: '5'},
				function () {},
				true,
				false,
				[],
				[""]
			]
		}
		, {
			name: "isNumber"
			, expectedError: "must be number"
			, validValues: [
				0,
				1,
				NaN,
				Infinity]
			, invalidValues: [
				"",
				" ",
				"0",
				"1",
				null,
				undefined,
				{},
				{a: '5'},
				function () {},
				true,
				false,
				[],
				[""]
			]
		}
		, {
			name: "isDate"
			, expectedError: "must be date"
			, validValues: [new Date()]
			, invalidValues: [
				0,
				1,
				NaN,
				Infinity,
				"",
				" ",
				"0",
				"1",
				null,
				undefined,
				{},
				{a: '5'},
				function () {},
				true,
				false,
				[],
				[""]
			]
		}
		, {
			name: "isRegExp"
			, expectedError: "must be regexp"
			, validValues: [/abc/]
			, invalidValues: [
				0,
				1,
				NaN,
				Infinity,
				"",
				" ",
				"0",
				"1",
				null,
				undefined,
				{},
				{a: '5'},
				function () {},
				true,
				false,
				[],
				[""]
			]
		}
		, {
			name: "isFinite"
			, expectedError: "must be finite"
			, validValues: [
				0,
				1,
				"0",
				"1"]
			, invalidValues: [
				NaN,
				Infinity,
				"",
				" ",
				null,
				undefined,
				{},
				{a: '5'},
				function () {},
				true,
				false,
				[],
				[""]
			]
		}
		, {
			name: "isNaN"
			, expectedError: "must be nan"
			, validValues: [
				NaN]
			, invalidValues: [
				0,
				1,
				Infinity,
				"",
				" ",
				"0",
				"1",
				null,
				undefined,
				{},
				{a: '5'},
				function () {},
				true,
				false,
				[],
				[""]
			]
		}
		, {
			name: "isBoolean"
			, expectedError: "must be boolean"
			, validValues: [
				true,
				false]
			, invalidValues: [
				0,
				1,
				NaN,
				Infinity,
				"",
				" ",
				"0",
				"1",
				null,
				undefined,
				{},
				{a: '5'},
				function () {},
				[],
				[""]
			]
		}
		, {
			name: "isNull"
			, expectedError: "must be null"
			, validValues: [
				null]
			, invalidValues: [
				0,
				1,
				NaN,
				Infinity,
				"",
				" ",
				"0",
				"1",
				undefined,
				{},
				{a: '5'},
				function () {},
				true,
				false,
				[],
				[""]
			]
		}
		, {
			name: "isUndefined"
			, expectedError: "must be undefined"
			, validValues: [
				undefined]
			, invalidValues: [
				0,
				1,
				NaN,
				Infinity,
				"",
				" ",
				"0",
				"1",
				null,
				{},
				{a: '5'},
				function () {},
				true,
				false,
				[],
				[""]
			]
		}
		, {
			name: "instanceOf"
			, expectedError: 'must be a test'
			, param: test
			, validValues: [
				new test()
			]
			, invalidValues: [
				{}
			]
		}
		, {
			name: "instanceOf"
			, expectedError: 'must be a Object'
			, param: Object
			, validValues: [
				{}
			]
			, invalidValues: [
				""
			]
		}
		, {
			name: "maxLength"
			, expectedError: 'may not be longer than 7'
			, param: 7
			, validValues: [
				[1,2,3,4,5,6,7],
				[1],
				"",
				"1234567"
			]
			, invalidValues: [
				[1,2,3,4,5,6,7,8],
				"123456789",
				{
					length: 10
				}
			]
		}
		, {
			name: "maxLength"
			, expectedError: 'may not be longer than 3'
			, param: 3
			, validValues: [
				[1,2,3],
				[1],
				"",
				"123"
			]
			, invalidValues: [
				[1,2,3,4],
				"1234",
				{
					length: 10000
				}
			]
		}
		, {
			name: "minLength"
			, expectedError: 'may not be shorter than 7'
			, param: 7
			, validValues: [
				[1,2,3,4,5,6,7,8],
				"123456789",
				{
					length: 10
				},
				[1,2,3,4,5,6,7],
				"1234567"
			]
			, invalidValues: [
				[1],
				""
			]
		}
		, {
			name: "minLength"
			, expectedError: 'may not be shorter than 3'
			, param: 3
			, validValues: [
				[1,2,3],
				"123",
				[1,2,3,4],
				"1234",
				{
					length: 10000
				}
			]
			, invalidValues: [
				[1],
				""
			]
		}
		, {
			name: "matchesRegex"
			, expectedError: 'must match regex /x/'
			, param: /x/
			, validValues: [
				"x",
				"ax",
				"xa",
				"axa"
			]
			, invalidValues: [
				""
				, "asdf"
			]
		}
		, {
			name: "matchesRegex"
			, expectedError: 'must be string'
			, param: /f|O|1/
			, validValues: [
				'f'
				, 'O'
			]
			, invalidValues: [
				123
				, {}
				, function x() {}
			]
		}
		, {
			name: "minValue"
			, expectedError: 'must be at least 10'
			, param: 10
			, validValues: [
				10
				, 11
				, 100
				, 10000000
			]
			, invalidValues: [
				1
				, 9
				, -1
				, -100000
			]
		}
		, {
			name: "maxValue"
			, expectedError: 'must be at most 10'
			, param: 10
			, validValues: [
				1
				, 10
				, -1
				, -100000
			]
			, invalidValues: [
				11
				, 100
				, 10000000
			]
		}
		, {
			name: "isInteger"
			, expectedError: 'must be an integer'
			, param: 1
			, validValues: [
				0,
				1,
				2,
				3,
				-1
			]
			, invalidValues: [
				0.5,
				-0.5,
				NaN,
				Infinity
			]
		}
		, {
			name: "isInteger"
			, expectedError: 'must be number'
			, param: 2
			, validValues: [
				2,
				4,
				6
			]
			, invalidValues:[
				"",
				"0",
				"1"
			]
		}
		, {
			name: "isInteger"
			, expectedError: 'must be divisible by 3'
			, param: 3
			, validValues: [
				3,
				6,
				9
			]
			, invalidValues:[
				1,2,4,5
			]
		}
		, {
			name: "oneOf"
			, expectedError: 'must be one of [a, b, c]'
			, param: ['a', 'b', 'c']
			, validValues: [
				'a'
				, 'b'
				, 'c'
			]
			, invalidValues:[
				1,2,4,5
				, 'aa'
				, '1'
				, 'd'
				, {}
				, []
				, null
			]
		}
		, {
			name: "oneOf"
			, expectedError: 'must be one of [A, B, C]'
			, param: [
				{_id: 'a', name: 'A'}
				, {_id: 'b', name: 'B'}
				, {_id: 'c', name: 'C'}
				]
			, validValues: [
				'a'
				, 'b'
				, 'c'
			]
			, invalidValues:[
				1,2,4,5
				, 'aa'
				, '1'
				, 'd'
				, {}
				, []
				, null
			]
		}
	], function (a) {
		var name = a.name;
		if (a.param) {
			name += ' - ' + a.expectedError || a.param;
		}
		Tinytest.add('Rules - built in rules - ' + name, function (test) {
			var rule = Rule[a.name];
			if (a.param) {
				rule = rule(a.param);
			}
			_.each(a.validValues, function (val) {
				test.isTrue(rule.match(val));
			});
			_.each(a.invalidValues, function (val) {
				test.throws(function () {
					rule.check(val);
				}, a.expectedError);
			});
		});
	});