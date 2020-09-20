const core = require('@actions/core');

const run = require('./run');

run().catch(err => core.setFailed(err.message));
