/**
 * Copyright (c) Yuri Svetlov
 * https://github.com/Yuriy-Svetlov
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const Server = require('./classes/Server.js');

module.exports = function(options = {}) {
	return new Server(options);
};
