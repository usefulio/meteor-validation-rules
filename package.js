Package.describe({
  summary: "A tiny package to replace meteor's Match package."
});

Package.on_use(function (api, where) {
  api.add_files('rules.js', ['client', 'server']);

  api.export('Rule');
});

Package.on_test(function (api) {
  api.use(['rules', 'tinytest', 'test-helpers']);

  api.add_files('rules_tests.js', ['client', 'server']);
});
