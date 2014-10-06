Package.describe({
  summary: "A simple package providing functional validation logic with smart error messages."
  , version: '0.1.2'
  , name: "cwohlman:rules"
  , git: "https://github.com/cwohlman/meteor-validation-rules.git"
});

Package.on_use(function (api, where) {
  api.versionsFrom('0.9.0');
  
  api.use('underscore');

  api.add_files('rules.js', ['client', 'server']);
  api.add_files('rules_builtinRules.js', ['client', 'server']);

  api.export('Rule');
});

Package.on_test(function (api) {
  api.use(['cwohlman:rules', 'underscore', 'tinytest', 'test-helpers']);

  api.add_files('rules_tests.js', ['client', 'server']);
  api.add_files('rules_builtinRules_tests.js', ['client', 'server']);
});
