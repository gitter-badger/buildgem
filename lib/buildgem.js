/*!
 * BuildGem. A pluggable build automation framework.
 *
 * Copyright (c) 2017 Kieran Potts
 * MIT License
 */

'use strict'

/**
 * Module exports.
 */
module.exports = BuildGem

/**
 * Initialize a new build.
 */
function BuildGem () {
  if (!(this instanceof BuildGem)) {
    return new BuildGem()
  }
  this.conf = {
    plugins: [],
    path: {
      source: './src',
      build: './build'
    }
  }
}
