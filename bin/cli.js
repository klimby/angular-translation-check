#!/usr/bin/env node

const angularTranslationCheck = require('../dist/index');

angularTranslationCheck(process.argv).catch(() => {
  process.exit(1);
});

