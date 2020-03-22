module.exports = {
  assert: '@hapi/code',
  globals: '__set__,__get__,__with__',
  lint: true,
  'lint-fix': true,
  seed: Math.floor(Math.random() * 100000 + 1),
  shuffle: true,
  threshold: 100
}
