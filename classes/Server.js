/**
 * Copyright (c) S. Yuri
 * https://github.com/semiromid
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

const
  liveAlertBP = require('live-alert-bp'),
  Transform = require('stream').Transform;


class Server{

  constructor(options){
    this.liveAlertBP = new liveAlertBP(options);
  }


  run(){
    this.liveAlertBP.run();
  }


  close(options = {}){
    let transformStream = new Transform({objectMode: true});
    let lastFile = null;

    this.liveAlertBP.error = false;

    transformStream._transform = function(file, encoding, callback) {
      let error = null;
      let output = file;

      lastFile = file;

      callback(error, output);
    }

    transformStream._flush = function(callback){
      if(null != lastFile){
        if(this.liveAlertBP.hasError() != true){
          this.liveAlertBP.close();
        }
      }

      callback();
    }.bind(this);

    return transformStream;
  }


  open(message){
		if(message.length > 0){
			this.liveAlertBP.error = true;
			this.liveAlertBP.open(message);
		}
  }


  reloadNotification(){
		let transformStream = new Transform({objectMode: true});
		let lastFile = null;
	
		this.liveAlertBP.error = false;

		transformStream._transform = function(file, encoding, callback) {
			let error = null;
			let output = file;
			
			lastFile = file;

			callback(error, output);
		}

		transformStream._flush = function(callback){
			if(null != lastFile){
				if(this.liveAlertBP.hasError() != true){
					this.liveAlertBP.reloadNotification();
				}
			}

			callback();
		}.bind(this);

		return transformStream;		
  }


  resetError(){
		this.liveAlertBP.resetError();
  }


  hasError(){
		return this.liveAlertBP.hasError();
  }

}

module.exports = Server;

