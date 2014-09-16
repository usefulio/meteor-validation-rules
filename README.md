Very Simple Validation For Meteor
===============================
This package is designed as a replacement for the meteor Match package. It get's away from the type based validation checking, and provides a more powerful and flexible rule based validation checking paradigm.

The Rules package provides several added features which make it a powerful tool for validation and other forms of constraint checking:

1. The rules package is centered around functions. This makes it easy to write complex custom validators.
2. The rules package puts error reporting front and center. This package isn't just to let developers know that they've called a function with the wrong arguments. A rule constructor takes a string error message, and when you call the rules check function it also takes a string error message, if validation fails, these strings are used to construct a useful, user readable error message. (e.g. 'name' + 'must be a string' outputs 'name must be a string')
3. The rules package provides excelent support for taking the environment into the equation. You can pass additional parameters to the rule's validation object in a clear easy to understand way. For example, you could validate a user's right to update an object by passing the object as the 'value' to be validated and the current userId as part of the Rule context.
4. Rule objects are addative, you can, and should string multiple rules together where it makes sense, for example the following is a valid rule: `mayOrderAddons = new Rule([Users.mustBeOwner, Users.mustHaveCredit])` calling `mayOrderAddons.check(someOrder)` means: if the user is not the owner of the order or does not have credit throw an error (the app would throw the first error which it encounters).
5. The rules package doesn't make assumptions about how you do validation, you have several options when validating an object:

 - `Rule.match(value)` - The simplest method, returns true if there are 0 failed validations, false if there are 1 or more failed validations.
 - `Rule.check(value)` - Similar to Meteor's check method, throws an error if any validations fail (always throws the first error to fail).
 - `Rule.errors(value)` - The most powerful method, and the core of the rules package, this function processes all validations and returns an array with all the failing validations. Every error is a javascript error object, you can throw it if you like, but each error also has a very human readable error message which you can display to the user (for example in a form).

 Each of the three methods also accepts 3 additional parameters (match only accepts the first paramater, and check only accepts the first two):

 - `context` - passed as 'this' to validation functions, you can use this object to specify additional contextual information, for example the current userId or data context.
 - `message` - a custom error message which is prepended to generated errors, for example if validating a form property you could pass the field name like this: `Rules.mustBeUSPhoneNumber(phoneNumber, null, 'phone number')` failed validation would then generate an error message including your custom message: 'phone number must be a US phone number'.
 - `shortCircut` - causes the errors method to return as soon as it finds a single error. We use this internally to keep from needlessly checking rules after validation has already failed.

Usage
=================================
It's easy to use the rules package:

1. Create a rule:

        var mustBeAStringFn = function (value) {
        	return typeof value === 'string';
        };
        var mustBeAString = new Rule(mustBeAStringFn, 400, 'must be a string');

2. Call check to prevent code from executing if the value is invalid:

        var saveRecord = function (value) {
        	mustBeAString.check(value, null, 'name');
        	Records.insert({
        		name: value
        	});
        };

3. Call match to deturmine if a value is valid:

        Template.myForm.helpers({
        	nameIsValid: function () {
        		return mustBeAString.match(this.name);
        	}
        	// use this to show or hide an error message
        });

4. Call errors to get a list of errors:

        var passwordValidator = new Rule(mustBeAString, mustBeAStrongPassowrd));

        Template.myForm.helpers({
        	errors: function () {
        		return _.map(passwordValidator.errors(this.password, null, 'password'), function (e) {
        			return e.reason;
        		});
        	}
        	// use this to display a list of error messages, e.g.:
        	// password must be a strong password
        	// or
        	// password must be a string
        });

5. Feel free to use on the server side, rules produce meteor errors:

		var isOwner = function (doc) {
			return doc.userId == this.userId;
		};
        var mustBeTheOwner = new Rule(isOwner, 403, 'you must be the owner');

        Meteor.methods({
        	'deleteProfile': function (profileId) {
        		var profile = Profiles.findOne(profileId);
        		isOwner.check(profile, {userId: Meteor.userId()}, 'to delete a profile');
        		// if the check fails it will throw a new
        		// Meteor.Error('to delete a profile you must be the owner', 403);
        	}
        });
