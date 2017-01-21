/*!
 * Buildgem. A pluggable build automation framework.
 *
 * Copyright (c) 2017 Kieran Potts
 * MIT License
 */

'use strict'

/**
 * Module exports.
 */
module.exports = Buildgem

/**
 * Initialize a new build.
 */
function Buildgem () {
  if (!(this instanceof Buildgem)) {
    return new Buildgem()
  }
  this.conf = {
    plugins: [],
    path: {
      source: './src',
      build: './build'
    }
  }
}
