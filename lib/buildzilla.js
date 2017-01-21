/*!
 * Buildgem. Build static sites, or anything at all, using simple plugins.
 *
 * Copyright (c) 2017 Kieran Potts
 * MIT License
 */

module.exports = (function () {
  'use strict'

  /**
   * Initialize a new build
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

  /**
   * Module exports
   */
  return Buildgem
}())
