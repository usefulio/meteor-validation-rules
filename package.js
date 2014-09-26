Package.describe({
  summary: "A tiny package to replace meteor's Match package."
  , version: '0.0.1'
});

Package.on_use(function (api, where) {
  api.use('underscore');

  api.add_files('rules.js', ['client', 'server']);
  api.add_files('rules_builtinRules.js', ['client', 'server']);

  api.export('Rule');
});

Package.on_test(function (api) {
  api.use(['rules', 'underscore', 'tinytest', 'test-helpers']);

  api.add_files('rules_tests.js', ['client', 'server']);
  api.add_files('rules_builtinRules_tests.js', ['client', 'server']);
});
