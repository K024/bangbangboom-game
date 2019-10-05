(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("pixi.js"));
	else if(typeof define === 'function' && define.amd)
		define("BangGame", ["pixi.js"], factory);
	else if(typeof exports === 'object')
		exports["BangGame"] = factory(require("pixi.js"));
	else
		root["BangGame"] = factory(root["PIXI"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_pixi_js__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/howler/dist/howler.js":
/*!********************************************!*\
  !*** ./node_modules/howler/dist/howler.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 *  howler.js v2.1.2
 *  howlerjs.com
 *
 *  (c) 2013-2019, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Create the global controller. All contained methods and properties apply
   * to all sounds that are currently playing or will be in the future.
   */
  var HowlerGlobal = function() {
    this.init();
  };
  HowlerGlobal.prototype = {
    /**
     * Initialize the global Howler object.
     * @return {Howler}
     */
    init: function() {
      var self = this || Howler;

      // Create a global ID counter.
      self._counter = 1000;

      // Pool of unlocked HTML5 Audio objects.
      self._html5AudioPool = [];
      self.html5PoolSize = 10;

      // Internal properties.
      self._codecs = {};
      self._howls = [];
      self._muted = false;
      self._volume = 1;
      self._canPlayEvent = 'canplaythrough';
      self._navigator = (typeof window !== 'undefined' && window.navigator) ? window.navigator : null;

      // Public properties.
      self.masterGain = null;
      self.noAudio = false;
      self.usingWebAudio = true;
      self.autoSuspend = true;
      self.ctx = null;

      // Set to false to disable the auto audio unlocker.
      self.autoUnlock = true;

      // Setup the various state values for global tracking.
      self._setup();

      return self;
    },

    /**
     * Get/set the global volume for all sounds.
     * @param  {Float} vol Volume from 0.0 to 1.0.
     * @return {Howler/Float}     Returns self or current volume.
     */
    volume: function(vol) {
      var self = this || Howler;
      vol = parseFloat(vol);

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        self._volume = vol;

        // Don't update any of the nodes if we are muted.
        if (self._muted) {
          return self;
        }

        // When using Web Audio, we just need to adjust the master gain.
        if (self.usingWebAudio) {
          self.masterGain.gain.setValueAtTime(vol, Howler.ctx.currentTime);
        }

        // Loop through and change volume for all HTML5 audio nodes.
        for (var i=0; i<self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and change the volumes.
            for (var j=0; j<ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node) {
                sound._node.volume = sound._volume * vol;
              }
            }
          }
        }

        return self;
      }

      return self._volume;
    },

    /**
     * Handle muting and unmuting globally.
     * @param  {Boolean} muted Is muted or not.
     */
    mute: function(muted) {
      var self = this || Howler;

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      self._muted = muted;

      // With Web Audio, we just need to mute the master gain.
      if (self.usingWebAudio) {
        self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler.ctx.currentTime);
      }

      // Loop through and mute all HTML5 Audio nodes.
      for (var i=0; i<self._howls.length; i++) {
        if (!self._howls[i]._webAudio) {
          // Get all of the sounds in this Howl group.
          var ids = self._howls[i]._getSoundIds();

          // Loop through all sounds and mark the audio node as muted.
          for (var j=0; j<ids.length; j++) {
            var sound = self._howls[i]._soundById(ids[j]);

            if (sound && sound._node) {
              sound._node.muted = (muted) ? true : sound._muted;
            }
          }
        }
      }

      return self;
    },

    /**
     * Unload and destroy all currently loaded Howl objects.
     * @return {Howler}
     */
    unload: function() {
      var self = this || Howler;

      for (var i=self._howls.length-1; i>=0; i--) {
        self._howls[i].unload();
      }

      // Create a new AudioContext to make sure it is fully reset.
      if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== 'undefined') {
        self.ctx.close();
        self.ctx = null;
        setupAudioContext();
      }

      return self;
    },

    /**
     * Check for codec support of specific extension.
     * @param  {String} ext Audio file extention.
     * @return {Boolean}
     */
    codecs: function(ext) {
      return (this || Howler)._codecs[ext.replace(/^x-/, '')];
    },

    /**
     * Setup various state values for global tracking.
     * @return {Howler}
     */
    _setup: function() {
      var self = this || Howler;

      // Keeps track of the suspend/resume state of the AudioContext.
      self.state = self.ctx ? self.ctx.state || 'suspended' : 'suspended';

      // Automatically begin the 30-second suspend process
      self._autoSuspend();

      // Check if audio is available.
      if (!self.usingWebAudio) {
        // No audio is available on this system if noAudio is set to true.
        if (typeof Audio !== 'undefined') {
          try {
            var test = new Audio();

            // Check if the canplaythrough event is available.
            if (typeof test.oncanplaythrough === 'undefined') {
              self._canPlayEvent = 'canplay';
            }
          } catch(e) {
            self.noAudio = true;
          }
        } else {
          self.noAudio = true;
        }
      }

      // Test to make sure audio isn't disabled in Internet Explorer.
      try {
        var test = new Audio();
        if (test.muted) {
          self.noAudio = true;
        }
      } catch (e) {}

      // Check for supported codecs.
      if (!self.noAudio) {
        self._setupCodecs();
      }

      return self;
    },

    /**
     * Check for browser support for various codecs and cache the results.
     * @return {Howler}
     */
    _setupCodecs: function() {
      var self = this || Howler;
      var audioTest = null;

      // Must wrap in a try/catch because IE11 in server mode throws an error.
      try {
        audioTest = (typeof Audio !== 'undefined') ? new Audio() : null;
      } catch (err) {
        return self;
      }

      if (!audioTest || typeof audioTest.canPlayType !== 'function') {
        return self;
      }

      var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');

      // Opera version <33 has mixed MP3 support, so we need to check for and block it.
      var checkOpera = self._navigator && self._navigator.userAgent.match(/OPR\/([0-6].)/g);
      var isOldOpera = (checkOpera && parseInt(checkOpera[0].split('/')[1], 10) < 33);

      self._codecs = {
        mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, ''))),
        mpeg: !!mpegTest,
        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
        caf: !!audioTest.canPlayType('audio/x-caf;').replace(/^no$/, ''),
        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        weba: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        webm: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ''),
        flac: !!(audioTest.canPlayType('audio/x-flac;') || audioTest.canPlayType('audio/flac;')).replace(/^no$/, '')
      };

      return self;
    },

    /**
     * Some browsers/devices will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * @return {Howler}
     */
    _unlockAudio: function() {
      var self = this || Howler;

      // Only run this if Web Audio is supported and it hasn't already been unlocked.
      if (self._audioUnlocked || !self.ctx) {
        return;
      }

      self._audioUnlocked = false;
      self.autoUnlock = false;

      // Some mobile devices/platforms have distortion issues when opening/closing tabs and/or web views.
      // Bugs in the browser (especially Mobile Safari) can cause the sampleRate to change from 44100 to 48000.
      // By calling Howler.unload(), we create a new AudioContext with the correct sampleRate.
      if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
        self._mobileUnloaded = true;
        self.unload();
      }

      // Scratch buffer for enabling iOS to dispose of web audio buffers correctly, as per:
      // http://stackoverflow.com/questions/24119684
      self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);

      // Call this method on touch start to create and play a buffer,
      // then check if the audio actually played to determine if
      // audio has now been unlocked on iOS, Android, etc.
      var unlock = function(e) {
        // Create a pool of unlocked HTML5 Audio objects that can
        // be used for playing sounds without user interaction. HTML5
        // Audio objects must be individually unlocked, as opposed
        // to the WebAudio API which only needs a single activation.
        // This must occur before WebAudio setup or the source.onended
        // event will not fire.
        for (var i=0; i<self.html5PoolSize; i++) {
          try {
            var audioNode = new Audio();

            // Mark this Audio object as unlocked to ensure it can get returned
            // to the unlocked pool when released.
            audioNode._unlocked = true;

            // Add the audio node to the pool.
            self._releaseHtml5Audio(audioNode);
          } catch (e) {
            self.noAudio = true;
          }
        }

        // Loop through any assigned audio nodes and unlock them.
        for (var i=0; i<self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and unlock the audio nodes.
            for (var j=0; j<ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node && !sound._node._unlocked) {
                sound._node._unlocked = true;
                sound._node.load();
              }
            }
          }
        }

        // Fix Android can not play in suspend state.
        self._autoResume();

        // Create an empty buffer.
        var source = self.ctx.createBufferSource();
        source.buffer = self._scratchBuffer;
        source.connect(self.ctx.destination);

        // Play the empty buffer.
        if (typeof source.start === 'undefined') {
          source.noteOn(0);
        } else {
          source.start(0);
        }

        // Calling resume() on a stack initiated by user gesture is what actually unlocks the audio on Android Chrome >= 55.
        if (typeof self.ctx.resume === 'function') {
          self.ctx.resume();
        }

        // Setup a timeout to check that we are unlocked on the next event loop.
        source.onended = function() {
          source.disconnect(0);

          // Update the unlocked state and prevent this check from happening again.
          self._audioUnlocked = true;

          // Remove the touch start listener.
          document.removeEventListener('touchstart', unlock, true);
          document.removeEventListener('touchend', unlock, true);
          document.removeEventListener('click', unlock, true);

          // Let all sounds know that audio has been unlocked.
          for (var i=0; i<self._howls.length; i++) {
            self._howls[i]._emit('unlock');
          }
        };
      };

      // Setup a touch start listener to attempt an unlock in.
      document.addEventListener('touchstart', unlock, true);
      document.addEventListener('touchend', unlock, true);
      document.addEventListener('click', unlock, true);

      return self;
    },

    /**
     * Get an unlocked HTML5 Audio object from the pool. If none are left,
     * return a new Audio object and throw a warning.
     * @return {Audio} HTML5 Audio object.
     */
    _obtainHtml5Audio: function() {
      var self = this || Howler;

      // Return the next object from the pool if one exists.
      if (self._html5AudioPool.length) {
        return self._html5AudioPool.pop();
      }

      //.Check if the audio is locked and throw a warning.
      var testPlay = new Audio().play();
      if (testPlay && typeof Promise !== 'undefined' && (testPlay instanceof Promise || typeof testPlay.then === 'function')) {
        testPlay.catch(function() {
          console.warn('HTML5 Audio pool exhausted, returning potentially locked audio object.');
        });
      }

      return new Audio();
    },

    /**
     * Return an activated HTML5 Audio object to the pool.
     * @return {Howler}
     */
    _releaseHtml5Audio: function(audio) {
      var self = this || Howler;

      // Don't add audio to the pool if we don't know if it has been unlocked.
      if (audio._unlocked) {
        self._html5AudioPool.push(audio);
      }

      return self;
    },

    /**
     * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
     * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
     * @return {Howler}
     */
    _autoSuspend: function() {
      var self = this;

      if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      // Check if any sounds are playing.
      for (var i=0; i<self._howls.length; i++) {
        if (self._howls[i]._webAudio) {
          for (var j=0; j<self._howls[i]._sounds.length; j++) {
            if (!self._howls[i]._sounds[j]._paused) {
              return self;
            }
          }
        }
      }

      if (self._suspendTimer) {
        clearTimeout(self._suspendTimer);
      }

      // If no sound has played after 30 seconds, suspend the context.
      self._suspendTimer = setTimeout(function() {
        if (!self.autoSuspend) {
          return;
        }

        self._suspendTimer = null;
        self.state = 'suspending';
        self.ctx.suspend().then(function() {
          self.state = 'suspended';

          if (self._resumeAfterSuspend) {
            delete self._resumeAfterSuspend;
            self._autoResume();
          }
        });
      }, 30000);

      return self;
    },

    /**
     * Automatically resume the Web Audio AudioContext when a new sound is played.
     * @return {Howler}
     */
    _autoResume: function() {
      var self = this;

      if (!self.ctx || typeof self.ctx.resume === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      if (self.state === 'running' && self._suspendTimer) {
        clearTimeout(self._suspendTimer);
        self._suspendTimer = null;
      } else if (self.state === 'suspended') {
        self.ctx.resume().then(function() {
          self.state = 'running';

          // Emit to all Howls that the audio has resumed.
          for (var i=0; i<self._howls.length; i++) {
            self._howls[i]._emit('resume');
          }
        });

        if (self._suspendTimer) {
          clearTimeout(self._suspendTimer);
          self._suspendTimer = null;
        }
      } else if (self.state === 'suspending') {
        self._resumeAfterSuspend = true;
      }

      return self;
    }
  };

  // Setup the global audio controller.
  var Howler = new HowlerGlobal();

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Create an audio group controller.
   * @param {Object} o Passed in properties for this group.
   */
  var Howl = function(o) {
    var self = this;

    // Throw an error if no source is provided.
    if (!o.src || o.src.length === 0) {
      console.error('An array of source files must be passed with any new Howl.');
      return;
    }

    self.init(o);
  };
  Howl.prototype = {
    /**
     * Initialize a new Howl group object.
     * @param  {Object} o Passed in properties for this group.
     * @return {Howl}
     */
    init: function(o) {
      var self = this;

      // If we don't have an AudioContext created yet, run the setup.
      if (!Howler.ctx) {
        setupAudioContext();
      }

      // Setup user-defined default properties.
      self._autoplay = o.autoplay || false;
      self._format = (typeof o.format !== 'string') ? o.format : [o.format];
      self._html5 = o.html5 || false;
      self._muted = o.mute || false;
      self._loop = o.loop || false;
      self._pool = o.pool || 5;
      self._preload = (typeof o.preload === 'boolean') ? o.preload : true;
      self._rate = o.rate || 1;
      self._sprite = o.sprite || {};
      self._src = (typeof o.src !== 'string') ? o.src : [o.src];
      self._volume = o.volume !== undefined ? o.volume : 1;
      self._xhrWithCredentials = o.xhrWithCredentials || false;

      // Setup all other default properties.
      self._duration = 0;
      self._state = 'unloaded';
      self._sounds = [];
      self._endTimers = {};
      self._queue = [];
      self._playLock = false;

      // Setup event listeners.
      self._onend = o.onend ? [{fn: o.onend}] : [];
      self._onfade = o.onfade ? [{fn: o.onfade}] : [];
      self._onload = o.onload ? [{fn: o.onload}] : [];
      self._onloaderror = o.onloaderror ? [{fn: o.onloaderror}] : [];
      self._onplayerror = o.onplayerror ? [{fn: o.onplayerror}] : [];
      self._onpause = o.onpause ? [{fn: o.onpause}] : [];
      self._onplay = o.onplay ? [{fn: o.onplay}] : [];
      self._onstop = o.onstop ? [{fn: o.onstop}] : [];
      self._onmute = o.onmute ? [{fn: o.onmute}] : [];
      self._onvolume = o.onvolume ? [{fn: o.onvolume}] : [];
      self._onrate = o.onrate ? [{fn: o.onrate}] : [];
      self._onseek = o.onseek ? [{fn: o.onseek}] : [];
      self._onunlock = o.onunlock ? [{fn: o.onunlock}] : [];
      self._onresume = [];

      // Web Audio or HTML5 Audio?
      self._webAudio = Howler.usingWebAudio && !self._html5;

      // Automatically try to enable audio.
      if (typeof Howler.ctx !== 'undefined' && Howler.ctx && Howler.autoUnlock) {
        Howler._unlockAudio();
      }

      // Keep track of this Howl group in the global controller.
      Howler._howls.push(self);

      // If they selected autoplay, add a play event to the load queue.
      if (self._autoplay) {
        self._queue.push({
          event: 'play',
          action: function() {
            self.play();
          }
        });
      }

      // Load the source file unless otherwise specified.
      if (self._preload) {
        self.load();
      }

      return self;
    },

    /**
     * Load the audio file.
     * @return {Howler}
     */
    load: function() {
      var self = this;
      var url = null;

      // If no audio is available, quit immediately.
      if (Howler.noAudio) {
        self._emit('loaderror', null, 'No audio support.');
        return;
      }

      // Make sure our source is in an array.
      if (typeof self._src === 'string') {
        self._src = [self._src];
      }

      // Loop through the sources and pick the first one that is compatible.
      for (var i=0; i<self._src.length; i++) {
        var ext, str;

        if (self._format && self._format[i]) {
          // If an extension was specified, use that instead.
          ext = self._format[i];
        } else {
          // Make sure the source is a string.
          str = self._src[i];
          if (typeof str !== 'string') {
            self._emit('loaderror', null, 'Non-string found in selected audio sources - ignoring.');
            continue;
          }

          // Extract the file extension from the URL or base64 data URI.
          ext = /^data:audio\/([^;,]+);/i.exec(str);
          if (!ext) {
            ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
          }

          if (ext) {
            ext = ext[1].toLowerCase();
          }
        }

        // Log a warning if no extension was found.
        if (!ext) {
          console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
        }

        // Check if this extension is available.
        if (ext && Howler.codecs(ext)) {
          url = self._src[i];
          break;
        }
      }

      if (!url) {
        self._emit('loaderror', null, 'No codec support for selected audio sources.');
        return;
      }

      self._src = url;
      self._state = 'loading';

      // If the hosting page is HTTPS and the source isn't,
      // drop down to HTML5 Audio to avoid Mixed Content errors.
      if (window.location.protocol === 'https:' && url.slice(0, 5) === 'http:') {
        self._html5 = true;
        self._webAudio = false;
      }

      // Create a new sound object and add it to the pool.
      new Sound(self);

      // Load and decode the audio data for playback.
      if (self._webAudio) {
        loadBuffer(self);
      }

      return self;
    },

    /**
     * Play a sound or resume previous playback.
     * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Number}          Sound ID.
     */
    play: function(sprite, internal) {
      var self = this;
      var id = null;

      // Determine if a sprite, sound id or nothing was passed
      if (typeof sprite === 'number') {
        id = sprite;
        sprite = null;
      } else if (typeof sprite === 'string' && self._state === 'loaded' && !self._sprite[sprite]) {
        // If the passed sprite doesn't exist, do nothing.
        return null;
      } else if (typeof sprite === 'undefined') {
        // Use the default sound sprite (plays the full audio length).
        sprite = '__default';

        // Check if there is a single paused sound that isn't ended. 
        // If there is, play that sound. If not, continue as usual.  
        if (!self._playLock) {
          var num = 0;
          for (var i=0; i<self._sounds.length; i++) {
            if (self._sounds[i]._paused && !self._sounds[i]._ended) {
              num++;
              id = self._sounds[i]._id;
            }
          }

          if (num === 1) {
            sprite = null;
          } else {
            id = null;
          }
        }
      }

      // Get the selected node, or get one from the pool.
      var sound = id ? self._soundById(id) : self._inactiveSound();

      // If the sound doesn't exist, do nothing.
      if (!sound) {
        return null;
      }

      // Select the sprite definition.
      if (id && !sprite) {
        sprite = sound._sprite || '__default';
      }

      // If the sound hasn't loaded, we must wait to get the audio's duration.
      // We also need to wait to make sure we don't run into race conditions with
      // the order of function calls.
      if (self._state !== 'loaded') {
        // Set the sprite value on this sound.
        sound._sprite = sprite;

        // Mark this sound as not ended in case another sound is played before this one loads.
        sound._ended = false;

        // Add the sound to the queue to be played on load.
        var soundId = sound._id;
        self._queue.push({
          event: 'play',
          action: function() {
            self.play(soundId);
          }
        });

        return soundId;
      }

      // Don't play the sound if an id was passed and it is already playing.
      if (id && !sound._paused) {
        // Trigger the play event, in order to keep iterating through queue.
        if (!internal) {
          self._loadQueue('play');
        }

        return sound._id;
      }

      // Make sure the AudioContext isn't suspended, and resume it if it is.
      if (self._webAudio) {
        Howler._autoResume();
      }

      // Determine how long to play for and where to start playing.
      var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000);
      var duration = Math.max(0, ((self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000) - seek);
      var timeout = (duration * 1000) / Math.abs(sound._rate);
      var start = self._sprite[sprite][0] / 1000;
      var stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000;
      var loop = !!(sound._loop || self._sprite[sprite][2]);
      sound._sprite = sprite;

      // Mark the sound as ended instantly so that this async playback
      // doesn't get grabbed by another call to play while this one waits to start.
      sound._ended = false;

      // Update the parameters of the sound.
      var setParams = function() {
        sound._paused = false;
        sound._seek = seek;
        sound._start = start;
        sound._stop = stop;
        sound._loop = loop;
      };

      // End the sound instantly if seek is at the end.
      if (seek >= stop) {
        self._ended(sound);
        return;
      }

      // Begin the actual playback.
      var node = sound._node;
      if (self._webAudio) {
        // Fire this when the sound is ready to play to begin Web Audio playback.
        var playWebAudio = function() {
          self._playLock = false;
          setParams();
          self._refreshBuffer(sound);

          // Setup the playback params.
          var vol = (sound._muted || self._muted) ? 0 : sound._volume;
          node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
          sound._playStart = Howler.ctx.currentTime;

          // Play the sound using the supported method.
          if (typeof node.bufferSource.start === 'undefined') {
            sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
          } else {
            sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
          }

          // Start a new timer if none is present.
          if (timeout !== Infinity) {
            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
          }

          if (!internal) {
            setTimeout(function() {
              self._emit('play', sound._id);
              self._loadQueue();
            }, 0);
          }
        };

        if (Howler.state === 'running') {
          playWebAudio();
        } else {
          self._playLock = true;

          // Wait for the audio context to resume before playing.
          self.once('resume', playWebAudio);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      } else {
        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
        var playHtml5 = function() {
          node.currentTime = seek;
          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
          node.volume = sound._volume * Howler.volume();
          node.playbackRate = sound._rate;

          // Some browsers will throw an error if this is called without user interaction.
          try {
            var play = node.play();

            // Support older browsers that don't support promises, and thus don't have this issue.
            if (play && typeof Promise !== 'undefined' && (play instanceof Promise || typeof play.then === 'function')) {
              // Implements a lock to prevent DOMException: The play() request was interrupted by a call to pause().
              self._playLock = true;

              // Set param values immediately.
              setParams();

              // Releases the lock and executes queued actions.
              play
                .then(function() {
                  self._playLock = false;
                  node._unlocked = true;
                  if (!internal) {
                    self._emit('play', sound._id);
                    self._loadQueue();
                  }
                })
                .catch(function() {
                  self._playLock = false;
                  self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
                    'on mobile devices and Chrome where playback was not within a user interaction.');

                  // Reset the ended and paused values.
                  sound._ended = true;
                  sound._paused = true;
                });
            } else if (!internal) {
              self._playLock = false;
              setParams();
              self._emit('play', sound._id);
              self._loadQueue();
            }

            // Setting rate before playing won't work in IE, so we set it again here.
            node.playbackRate = sound._rate;

            // If the node is still paused, then we can assume there was a playback issue.
            if (node.paused) {
              self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
                'on mobile devices and Chrome where playback was not within a user interaction.');
              return;
            }

            // Setup the end timer on sprites or listen for the ended event.
            if (sprite !== '__default' || sound._loop) {
              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
            } else {
              self._endTimers[sound._id] = function() {
                // Fire ended on this audio node.
                self._ended(sound);

                // Clear this listener.
                node.removeEventListener('ended', self._endTimers[sound._id], false);
              };
              node.addEventListener('ended', self._endTimers[sound._id], false);
            }
          } catch (err) {
            self._emit('playerror', sound._id, err);
          }
        };

        // If this is streaming audio, make sure the src is set and load again.
        if (node.src === 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA') {
          node.src = self._src;
          node.load();
        }

        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
        var loadedNoReadyState = (window && window.ejecta) || (!node.readyState && Howler._navigator.isCocoonJS);
        if (node.readyState >= 3 || loadedNoReadyState) {
          playHtml5();
        } else {
          self._playLock = true;

          var listener = function() {
            // Begin playback.
            playHtml5();

            // Clear this listener.
            node.removeEventListener(Howler._canPlayEvent, listener, false);
          };
          node.addEventListener(Howler._canPlayEvent, listener, false);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      }

      return sound._id;
    },

    /**
     * Pause playback and save current position.
     * @param  {Number} id The sound ID (empty to pause all in group).
     * @return {Howl}
     */
    pause: function(id) {
      var self = this;

      // If the sound hasn't loaded or a play() promise is pending, add it to the load queue to pause when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'pause',
          action: function() {
            self.pause(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be paused.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound && !sound._paused) {
          // Reset the seek position.
          sound._seek = self.seek(ids[i]);
          sound._rateSeek = 0;
          sound._paused = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound has been created.
              if (!sound._node.bufferSource) {
                continue;
              }

              if (typeof sound._node.bufferSource.stop === 'undefined') {
                sound._node.bufferSource.noteOff(0);
              } else {
                sound._node.bufferSource.stop(0);
              }

              // Clean up the buffer source.
              self._cleanBuffer(sound._node);
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.pause();
            }
          }
        }

        // Fire the pause event, unless `true` is passed as the 2nd argument.
        if (!arguments[1]) {
          self._emit('pause', sound ? sound._id : null);
        }
      }

      return self;
    },

    /**
     * Stop playback and reset to start.
     * @param  {Number} id The sound ID (empty to stop all in group).
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Howl}
     */
    stop: function(id, internal) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to stop when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'stop',
          action: function() {
            self.stop(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be stopped.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          // Reset the seek position.
          sound._seek = sound._start || 0;
          sound._rateSeek = 0;
          sound._paused = true;
          sound._ended = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound's AudioBufferSourceNode has been created.
              if (sound._node.bufferSource) {
                if (typeof sound._node.bufferSource.stop === 'undefined') {
                  sound._node.bufferSource.noteOff(0);
                } else {
                  sound._node.bufferSource.stop(0);
                }

                // Clean up the buffer source.
                self._cleanBuffer(sound._node);
              }
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.currentTime = sound._start || 0;
              sound._node.pause();

              // If this is a live stream, stop download once the audio is stopped.
              if (sound._node.duration === Infinity) {
                self._clearSound(sound._node);
              }
            }
          }

          if (!internal) {
            self._emit('stop', sound._id);
          }
        }
      }

      return self;
    },

    /**
     * Mute/unmute a single sound or all sounds in this Howl group.
     * @param  {Boolean} muted Set to true to mute and false to unmute.
     * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
     * @return {Howl}
     */
    mute: function(muted, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to mute when capable.
      if (self._state !== 'loaded'|| self._playLock) {
        self._queue.push({
          event: 'mute',
          action: function() {
            self.mute(muted, id);
          }
        });

        return self;
      }

      // If applying mute/unmute to all sounds, update the group's value.
      if (typeof id === 'undefined') {
        if (typeof muted === 'boolean') {
          self._muted = muted;
        } else {
          return self._muted;
        }
      }

      // If no id is passed, get all ID's to be muted.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          sound._muted = muted;

          // Cancel active fade and set the volume to the end value.
          if (sound._interval) {
            self._stopFade(sound._id);
          }

          if (self._webAudio && sound._node) {
            sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler.ctx.currentTime);
          } else if (sound._node) {
            sound._node.muted = Howler._muted ? true : muted;
          }

          self._emit('mute', sound._id);
        }
      }

      return self;
    },

    /**
     * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
     *   volume() -> Returns the group's volume value.
     *   volume(id) -> Returns the sound id's current volume.
     *   volume(vol) -> Sets the volume of all sounds in this Howl group.
     *   volume(vol, id) -> Sets the volume of passed sound id.
     * @return {Howl/Number} Returns self or current volume.
     */
    volume: function() {
      var self = this;
      var args = arguments;
      var vol, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // Return the value of the groups' volume.
        return self._volume;
      } else if (args.length === 1 || args.length === 2 && typeof args[1] === 'undefined') {
        // First check if this is an ID, and if not, assume it is a new volume.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          vol = parseFloat(args[0]);
        }
      } else if (args.length >= 2) {
        vol = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the volume or return the current volume.
      var sound;
      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        // If the sound hasn't loaded, add it to the load queue to change volume when capable.
        if (self._state !== 'loaded'|| self._playLock) {
          self._queue.push({
            event: 'volume',
            action: function() {
              self.volume.apply(self, args);
            }
          });

          return self;
        }

        // Set the group volume.
        if (typeof id === 'undefined') {
          self._volume = vol;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            sound._volume = vol;

            // Stop currently running fades.
            if (!args[2]) {
              self._stopFade(id[i]);
            }

            if (self._webAudio && sound._node && !sound._muted) {
              sound._node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
            } else if (sound._node && !sound._muted) {
              sound._node.volume = vol * Howler.volume();
            }

            self._emit('volume', sound._id);
          }
        }
      } else {
        sound = id ? self._soundById(id) : self._sounds[0];
        return sound ? sound._volume : 0;
      }

      return self;
    },

    /**
     * Fade a currently playing sound between two volumes (if no id is passsed, all sounds will fade).
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id (omit to fade all sounds).
     * @return {Howl}
     */
    fade: function(from, to, len, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to fade when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'fade',
          action: function() {
            self.fade(from, to, len, id);
          }
        });

        return self;
      }

      // Make sure the to/from/len values are numbers.
      from = parseFloat(from);
      to = parseFloat(to);
      len = parseFloat(len);

      // Set the volume to the start position.
      self.volume(from, id);

      // Fade the volume of one or all sounds.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        // Create a linear fade or fall back to timeouts with HTML5 Audio.
        if (sound) {
          // Stop the previous fade if no sprite is being used (otherwise, volume handles this).
          if (!id) {
            self._stopFade(ids[i]);
          }

          // If we are using Web Audio, let the native methods do the actual fade.
          if (self._webAudio && !sound._muted) {
            var currentTime = Howler.ctx.currentTime;
            var end = currentTime + (len / 1000);
            sound._volume = from;
            sound._node.gain.setValueAtTime(from, currentTime);
            sound._node.gain.linearRampToValueAtTime(to, end);
          }

          self._startFadeInterval(sound, from, to, len, ids[i], typeof id === 'undefined');
        }
      }

      return self;
    },

    /**
     * Starts the internal interval to fade a sound.
     * @param  {Object} sound Reference to sound to fade.
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id to fade.
     * @param  {Boolean} isGroup   If true, set the volume on the group.
     */
    _startFadeInterval: function(sound, from, to, len, id, isGroup) {
      var self = this;
      var vol = from;
      var diff = to - from;
      var steps = Math.abs(diff / 0.01);
      var stepLen = Math.max(4, (steps > 0) ? len / steps : len);
      var lastTick = Date.now();

      // Store the value being faded to.
      sound._fadeTo = to;

      // Update the volume value on each interval tick.
      sound._interval = setInterval(function() {
        // Update the volume based on the time since the last tick.
        var tick = (Date.now() - lastTick) / len;
        lastTick = Date.now();
        vol += diff * tick;

        // Make sure the volume is in the right bounds.
        vol = Math.max(0, vol);
        vol = Math.min(1, vol);

        // Round to within 2 decimal points.
        vol = Math.round(vol * 100) / 100;

        // Change the volume.
        if (self._webAudio) {
          sound._volume = vol;
        } else {
          self.volume(vol, sound._id, true);
        }

        // Set the group's volume.
        if (isGroup) {
          self._volume = vol;
        }

        // When the fade is complete, stop it and fire event.
        if ((to < from && vol <= to) || (to > from && vol >= to)) {
          clearInterval(sound._interval);
          sound._interval = null;
          sound._fadeTo = null;
          self.volume(to, sound._id);
          self._emit('fade', sound._id);
        }
      }, stepLen);
    },

    /**
     * Internal method that stops the currently playing fade when
     * a new fade starts, volume is changed or the sound is stopped.
     * @param  {Number} id The sound id.
     * @return {Howl}
     */
    _stopFade: function(id) {
      var self = this;
      var sound = self._soundById(id);

      if (sound && sound._interval) {
        if (self._webAudio) {
          sound._node.gain.cancelScheduledValues(Howler.ctx.currentTime);
        }

        clearInterval(sound._interval);
        sound._interval = null;
        self.volume(sound._fadeTo, id);
        sound._fadeTo = null;
        self._emit('fade', id);
      }

      return self;
    },

    /**
     * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
     *   loop() -> Returns the group's loop value.
     *   loop(id) -> Returns the sound id's loop value.
     *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
     *   loop(loop, id) -> Sets the loop value of passed sound id.
     * @return {Howl/Boolean} Returns self or current loop value.
     */
    loop: function() {
      var self = this;
      var args = arguments;
      var loop, id, sound;

      // Determine the values for loop and id.
      if (args.length === 0) {
        // Return the grou's loop value.
        return self._loop;
      } else if (args.length === 1) {
        if (typeof args[0] === 'boolean') {
          loop = args[0];
          self._loop = loop;
        } else {
          // Return this sound's loop value.
          sound = self._soundById(parseInt(args[0], 10));
          return sound ? sound._loop : false;
        }
      } else if (args.length === 2) {
        loop = args[0];
        id = parseInt(args[1], 10);
      }

      // If no id is passed, get all ID's to be looped.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        sound = self._soundById(ids[i]);

        if (sound) {
          sound._loop = loop;
          if (self._webAudio && sound._node && sound._node.bufferSource) {
            sound._node.bufferSource.loop = loop;
            if (loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop;
            }
          }
        }
      }

      return self;
    },

    /**
     * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   rate() -> Returns the first sound node's current playback rate.
     *   rate(id) -> Returns the sound id's current playback rate.
     *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
     *   rate(rate, id) -> Sets the playback rate of passed sound id.
     * @return {Howl/Number} Returns self or the current playback rate.
     */
    rate: function() {
      var self = this;
      var args = arguments;
      var rate, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current rate of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new rate value.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          rate = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        rate = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the playback rate or return the current value.
      var sound;
      if (typeof rate === 'number') {
        // If the sound hasn't loaded, add it to the load queue to change playback rate when capable.
        if (self._state !== 'loaded' || self._playLock) {
          self._queue.push({
            event: 'rate',
            action: function() {
              self.rate.apply(self, args);
            }
          });

          return self;
        }

        // Set the group rate.
        if (typeof id === 'undefined') {
          self._rate = rate;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            // Keep track of our position when the rate changed and update the playback
            // start position so we can properly adjust the seek position for time elapsed.
            if (self.playing(id[i])) {
              sound._rateSeek = self.seek(id[i]);
              sound._playStart = self._webAudio ? Howler.ctx.currentTime : sound._playStart;
            }
            sound._rate = rate;

            // Change the playback rate.
            if (self._webAudio && sound._node && sound._node.bufferSource) {
              sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler.ctx.currentTime);
            } else if (sound._node) {
              sound._node.playbackRate = rate;
            }

            // Reset the timers.
            var seek = self.seek(id[i]);
            var duration = ((self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1000) - seek;
            var timeout = (duration * 1000) / Math.abs(sound._rate);

            // Start a new end timer if sound is already playing.
            if (self._endTimers[id[i]] || !sound._paused) {
              self._clearTimer(id[i]);
              self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
            }

            self._emit('rate', sound._id);
          }
        }
      } else {
        sound = self._soundById(id);
        return sound ? sound._rate : self._rate;
      }

      return self;
    },

    /**
     * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   seek() -> Returns the first sound node's current seek position.
     *   seek(id) -> Returns the sound id's current seek position.
     *   seek(seek) -> Sets the seek position of the first sound node.
     *   seek(seek, id) -> Sets the seek position of passed sound id.
     * @return {Howl/Number} Returns self or the current seek position.
     */
    seek: function() {
      var self = this;
      var args = arguments;
      var seek, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current position of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new seek position.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else if (self._sounds.length) {
          id = self._sounds[0]._id;
          seek = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        seek = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // If there is no ID, bail out.
      if (typeof id === 'undefined') {
        return self;
      }

      // If the sound hasn't loaded, add it to the load queue to seek when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'seek',
          action: function() {
            self.seek.apply(self, args);
          }
        });

        return self;
      }

      // Get the sound.
      var sound = self._soundById(id);

      if (sound) {
        if (typeof seek === 'number' && seek >= 0) {
          // Pause the sound and update position for restarting playback.
          var playing = self.playing(id);
          if (playing) {
            self.pause(id, true);
          }

          // Move the position of the track and cancel timer.
          sound._seek = seek;
          sound._ended = false;
          self._clearTimer(id);

          // Update the seek position for HTML5 Audio.
          if (!self._webAudio && sound._node && !isNaN(sound._node.duration)) {
            sound._node.currentTime = seek;
          }

          // Seek and emit when ready.
          var seekAndEmit = function() {
            self._emit('seek', id);

            // Restart the playback if the sound was playing.
            if (playing) {
              self.play(id, true);
            }
          };

          // Wait for the play lock to be unset before emitting (HTML5 Audio).
          if (playing && !self._webAudio) {
            var emitSeek = function() {
              if (!self._playLock) {
                seekAndEmit();
              } else {
                setTimeout(emitSeek, 0);
              }
            };
            setTimeout(emitSeek, 0);
          } else {
            seekAndEmit();
          }
        } else {
          if (self._webAudio) {
            var realTime = self.playing(id) ? Howler.ctx.currentTime - sound._playStart : 0;
            var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
            return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
          } else {
            return sound._node.currentTime;
          }
        }
      }

      return self;
    },

    /**
     * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
     * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
     * @return {Boolean} True if playing and false if not.
     */
    playing: function(id) {
      var self = this;

      // Check the passed sound ID (if any).
      if (typeof id === 'number') {
        var sound = self._soundById(id);
        return sound ? !sound._paused : false;
      }

      // Otherwise, loop through all sounds and check if any are playing.
      for (var i=0; i<self._sounds.length; i++) {
        if (!self._sounds[i]._paused) {
          return true;
        }
      }

      return false;
    },

    /**
     * Get the duration of this sound. Passing a sound id will return the sprite duration.
     * @param  {Number} id The sound id to check. If none is passed, return full source duration.
     * @return {Number} Audio duration in seconds.
     */
    duration: function(id) {
      var self = this;
      var duration = self._duration;

      // If we pass an ID, get the sound and return the sprite length.
      var sound = self._soundById(id);
      if (sound) {
        duration = self._sprite[sound._sprite][1] / 1000;
      }

      return duration;
    },

    /**
     * Returns the current loaded state of this Howl.
     * @return {String} 'unloaded', 'loading', 'loaded'
     */
    state: function() {
      return this._state;
    },

    /**
     * Unload and destroy the current Howl object.
     * This will immediately stop all sound instances attached to this group.
     */
    unload: function() {
      var self = this;

      // Stop playing any active sounds.
      var sounds = self._sounds;
      for (var i=0; i<sounds.length; i++) {
        // Stop the sound if it is currently playing.
        if (!sounds[i]._paused) {
          self.stop(sounds[i]._id);
        }

        // Remove the source or disconnect.
        if (!self._webAudio) {
          // Set the source to 0-second silence to stop any downloading (except in IE).
          self._clearSound(sounds[i]._node);

          // Remove any event listeners.
          sounds[i]._node.removeEventListener('error', sounds[i]._errorFn, false);
          sounds[i]._node.removeEventListener(Howler._canPlayEvent, sounds[i]._loadFn, false);

          // Release the Audio object back to the pool.
          Howler._releaseHtml5Audio(sounds[i]._node);
        }

        // Empty out all of the nodes.
        delete sounds[i]._node;

        // Make sure all timers are cleared out.
        self._clearTimer(sounds[i]._id);
      }

      // Remove the references in the global Howler object.
      var index = Howler._howls.indexOf(self);
      if (index >= 0) {
        Howler._howls.splice(index, 1);
      }

      // Delete this sound from the cache (if no other Howl is using it).
      var remCache = true;
      for (i=0; i<Howler._howls.length; i++) {
        if (Howler._howls[i]._src === self._src || self._src.indexOf(Howler._howls[i]._src) >= 0) {
          remCache = false;
          break;
        }
      }

      if (cache && remCache) {
        delete cache[self._src];
      }

      // Clear global errors.
      Howler.noAudio = false;

      // Clear out `self`.
      self._state = 'unloaded';
      self._sounds = [];
      self = null;

      return null;
    },

    /**
     * Listen to a custom event.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
     * @return {Howl}
     */
    on: function(event, fn, id, once) {
      var self = this;
      var events = self['_on' + event];

      if (typeof fn === 'function') {
        events.push(once ? {id: id, fn: fn, once: once} : {id: id, fn: fn});
      }

      return self;
    },

    /**
     * Remove a custom event. Call without parameters to remove all events.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to remove. Leave empty to remove all.
     * @param  {Number}   id    (optional) Only remove events for this sound.
     * @return {Howl}
     */
    off: function(event, fn, id) {
      var self = this;
      var events = self['_on' + event];
      var i = 0;

      // Allow passing just an event and ID.
      if (typeof fn === 'number') {
        id = fn;
        fn = null;
      }

      if (fn || id) {
        // Loop through event store and remove the passed function.
        for (i=0; i<events.length; i++) {
          var isId = (id === events[i].id);
          if (fn === events[i].fn && isId || !fn && isId) {
            events.splice(i, 1);
            break;
          }
        }
      } else if (event) {
        // Clear out all events of this type.
        self['_on' + event] = [];
      } else {
        // Clear out all events of every type.
        var keys = Object.keys(self);
        for (i=0; i<keys.length; i++) {
          if ((keys[i].indexOf('_on') === 0) && Array.isArray(self[keys[i]])) {
            self[keys[i]] = [];
          }
        }
      }

      return self;
    },

    /**
     * Listen to a custom event and remove it once fired.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @return {Howl}
     */
    once: function(event, fn, id) {
      var self = this;

      // Setup the event listener.
      self.on(event, fn, id, 1);

      return self;
    },

    /**
     * Emit all events of a specific type and pass the sound id.
     * @param  {String} event Event name.
     * @param  {Number} id    Sound ID.
     * @param  {Number} msg   Message to go with event.
     * @return {Howl}
     */
    _emit: function(event, id, msg) {
      var self = this;
      var events = self['_on' + event];

      // Loop through event store and fire all functions.
      for (var i=events.length-1; i>=0; i--) {
        // Only fire the listener if the correct ID is used.
        if (!events[i].id || events[i].id === id || event === 'load') {
          setTimeout(function(fn) {
            fn.call(this, id, msg);
          }.bind(self, events[i].fn), 0);

          // If this event was setup with `once`, remove it.
          if (events[i].once) {
            self.off(event, events[i].fn, events[i].id);
          }
        }
      }

      // Pass the event type into load queue so that it can continue stepping.
      self._loadQueue(event);

      return self;
    },

    /**
     * Queue of actions initiated before the sound has loaded.
     * These will be called in sequence, with the next only firing
     * after the previous has finished executing (even if async like play).
     * @return {Howl}
     */
    _loadQueue: function(event) {
      var self = this;

      if (self._queue.length > 0) {
        var task = self._queue[0];

        // Remove this task if a matching event was passed.
        if (task.event === event) {
          self._queue.shift();
          self._loadQueue();
        }

        // Run the task if no event type is passed.
        if (!event) {
          task.action();
        }
      }

      return self;
    },

    /**
     * Fired when playback ends at the end of the duration.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _ended: function(sound) {
      var self = this;
      var sprite = sound._sprite;

      // If we are using IE and there was network latency we may be clipping
      // audio before it completes playing. Lets check the node to make sure it
      // believes it has completed, before ending the playback.
      if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
        setTimeout(self._ended.bind(self, sound), 100);
        return self;
      }

      // Should this sound loop?
      var loop = !!(sound._loop || self._sprite[sprite][2]);

      // Fire the ended event.
      self._emit('end', sound._id);

      // Restart the playback for HTML5 Audio loop.
      if (!self._webAudio && loop) {
        self.stop(sound._id, true).play(sound._id);
      }

      // Restart this timer if on a Web Audio loop.
      if (self._webAudio && loop) {
        self._emit('play', sound._id);
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        sound._playStart = Howler.ctx.currentTime;

        var timeout = ((sound._stop - sound._start) * 1000) / Math.abs(sound._rate);
        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
      }

      // Mark the node as paused.
      if (self._webAudio && !loop) {
        sound._paused = true;
        sound._ended = true;
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        self._clearTimer(sound._id);

        // Clean up the buffer source.
        self._cleanBuffer(sound._node);

        // Attempt to auto-suspend AudioContext if no sounds are still playing.
        Howler._autoSuspend();
      }

      // When using a sprite, end the track.
      if (!self._webAudio && !loop) {
        self.stop(sound._id, true);
      }

      return self;
    },

    /**
     * Clear the end timer for a sound playback.
     * @param  {Number} id The sound ID.
     * @return {Howl}
     */
    _clearTimer: function(id) {
      var self = this;

      if (self._endTimers[id]) {
        // Clear the timeout or remove the ended listener.
        if (typeof self._endTimers[id] !== 'function') {
          clearTimeout(self._endTimers[id]);
        } else {
          var sound = self._soundById(id);
          if (sound && sound._node) {
            sound._node.removeEventListener('ended', self._endTimers[id], false);
          }
        }

        delete self._endTimers[id];
      }

      return self;
    },

    /**
     * Return the sound identified by this ID, or return null.
     * @param  {Number} id Sound ID
     * @return {Object}    Sound object or null.
     */
    _soundById: function(id) {
      var self = this;

      // Loop through all sounds and find the one with this ID.
      for (var i=0; i<self._sounds.length; i++) {
        if (id === self._sounds[i]._id) {
          return self._sounds[i];
        }
      }

      return null;
    },

    /**
     * Return an inactive sound from the pool or create a new one.
     * @return {Sound} Sound playback object.
     */
    _inactiveSound: function() {
      var self = this;

      self._drain();

      // Find the first inactive node to recycle.
      for (var i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          return self._sounds[i].reset();
        }
      }

      // If no inactive node was found, create a new one.
      return new Sound(self);
    },

    /**
     * Drain excess inactive sounds from the pool.
     */
    _drain: function() {
      var self = this;
      var limit = self._pool;
      var cnt = 0;
      var i = 0;

      // If there are less sounds than the max pool size, we are done.
      if (self._sounds.length < limit) {
        return;
      }

      // Count the number of inactive sounds.
      for (i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          cnt++;
        }
      }

      // Remove excess inactive sounds, going in reverse order.
      for (i=self._sounds.length - 1; i>=0; i--) {
        if (cnt <= limit) {
          return;
        }

        if (self._sounds[i]._ended) {
          // Disconnect the audio source when using Web Audio.
          if (self._webAudio && self._sounds[i]._node) {
            self._sounds[i]._node.disconnect(0);
          }

          // Remove sounds until we have the pool size.
          self._sounds.splice(i, 1);
          cnt--;
        }
      }
    },

    /**
     * Get all ID's from the sounds pool.
     * @param  {Number} id Only return one ID if one is passed.
     * @return {Array}    Array of IDs.
     */
    _getSoundIds: function(id) {
      var self = this;

      if (typeof id === 'undefined') {
        var ids = [];
        for (var i=0; i<self._sounds.length; i++) {
          ids.push(self._sounds[i]._id);
        }

        return ids;
      } else {
        return [id];
      }
    },

    /**
     * Load the sound back into the buffer source.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _refreshBuffer: function(sound) {
      var self = this;

      // Setup the buffer source for playback.
      sound._node.bufferSource = Howler.ctx.createBufferSource();
      sound._node.bufferSource.buffer = cache[self._src];

      // Connect to the correct node.
      if (sound._panner) {
        sound._node.bufferSource.connect(sound._panner);
      } else {
        sound._node.bufferSource.connect(sound._node);
      }

      // Setup looping and playback rate.
      sound._node.bufferSource.loop = sound._loop;
      if (sound._loop) {
        sound._node.bufferSource.loopStart = sound._start || 0;
        sound._node.bufferSource.loopEnd = sound._stop || 0;
      }
      sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler.ctx.currentTime);

      return self;
    },

    /**
     * Prevent memory leaks by cleaning up the buffer source after playback.
     * @param  {Object} node Sound's audio node containing the buffer source.
     * @return {Howl}
     */
    _cleanBuffer: function(node) {
      var self = this;
      var isIOS = Howler._navigator && Howler._navigator.vendor.indexOf('Apple') >= 0;

      if (Howler._scratchBuffer && node.bufferSource) {
        node.bufferSource.onended = null;
        node.bufferSource.disconnect(0);
        if (isIOS) {
          try { node.bufferSource.buffer = Howler._scratchBuffer; } catch(e) {}
        }
      }
      node.bufferSource = null;

      return self;
    },

    /**
     * Set the source to a 0-second silence to stop any downloading (except in IE).
     * @param  {Object} node Audio node to clear.
     */
    _clearSound: function(node) {
      var checkIE = /MSIE |Trident\//.test(Howler._navigator && Howler._navigator.userAgent);
      if (!checkIE) {
        node.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      }
    }
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Setup the sound object, which each node attached to a Howl group is contained in.
   * @param {Object} howl The Howl parent group.
   */
  var Sound = function(howl) {
    this._parent = howl;
    this.init();
  };
  Sound.prototype = {
    /**
     * Initialize a new Sound object.
     * @return {Sound}
     */
    init: function() {
      var self = this;
      var parent = self._parent;

      // Setup the default parameters.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a unique ID for this sound.
      self._id = ++Howler._counter;

      // Add itself to the parent's pool.
      parent._sounds.push(self);

      // Create the new node.
      self.create();

      return self;
    },

    /**
     * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
     * @return {Sound}
     */
    create: function() {
      var self = this;
      var parent = self._parent;
      var volume = (Howler._muted || self._muted || self._parent._muted) ? 0 : self._volume;

      if (parent._webAudio) {
        // Create the gain node for controlling volume (the source will connect to this).
        self._node = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
        self._node.gain.setValueAtTime(volume, Howler.ctx.currentTime);
        self._node.paused = true;
        self._node.connect(Howler.masterGain);
      } else {
        // Get an unlocked Audio object from the pool.
        self._node = Howler._obtainHtml5Audio();

        // Listen for errors (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror).
        self._errorFn = self._errorListener.bind(self);
        self._node.addEventListener('error', self._errorFn, false);

        // Listen for 'canplaythrough' event to let us know the sound is ready.
        self._loadFn = self._loadListener.bind(self);
        self._node.addEventListener(Howler._canPlayEvent, self._loadFn, false);

        // Setup the new audio node.
        self._node.src = parent._src;
        self._node.preload = 'auto';
        self._node.volume = volume * Howler.volume();

        // Begin loading the source.
        self._node.load();
      }

      return self;
    },

    /**
     * Reset the parameters of this sound to the original state (for recycle).
     * @return {Sound}
     */
    reset: function() {
      var self = this;
      var parent = self._parent;

      // Reset all of the parameters of this sound.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._rateSeek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a new ID so that it isn't confused with the previous sound.
      self._id = ++Howler._counter;

      return self;
    },

    /**
     * HTML5 Audio error listener callback.
     */
    _errorListener: function() {
      var self = this;

      // Fire an error event and pass back the code.
      self._parent._emit('loaderror', self._id, self._node.error ? self._node.error.code : 0);

      // Clear the event listener.
      self._node.removeEventListener('error', self._errorFn, false);
    },

    /**
     * HTML5 Audio canplaythrough listener callback.
     */
    _loadListener: function() {
      var self = this;
      var parent = self._parent;

      // Round up the duration to account for the lower precision in HTML5 Audio.
      parent._duration = Math.ceil(self._node.duration * 10) / 10;

      // Setup a sprite if none is defined.
      if (Object.keys(parent._sprite).length === 0) {
        parent._sprite = {__default: [0, parent._duration * 1000]};
      }

      if (parent._state !== 'loaded') {
        parent._state = 'loaded';
        parent._emit('load');
        parent._loadQueue();
      }

      // Clear the event listener.
      self._node.removeEventListener(Howler._canPlayEvent, self._loadFn, false);
    }
  };

  /** Helper Methods **/
  /***************************************************************************/

  var cache = {};

  /**
   * Buffer a sound from URL, Data URI or cache and decode to audio source (Web Audio API).
   * @param  {Howl} self
   */
  var loadBuffer = function(self) {
    var url = self._src;

    // Check if the buffer has already been cached and use it instead.
    if (cache[url]) {
      // Set the duration from the cache.
      self._duration = cache[url].duration;

      // Load the sound into this Howl.
      loadSound(self);

      return;
    }

    if (/^data:[^;]+;base64,/.test(url)) {
      // Decode the base64 data URI without XHR, since some browsers don't support it.
      var data = atob(url.split(',')[1]);
      var dataView = new Uint8Array(data.length);
      for (var i=0; i<data.length; ++i) {
        dataView[i] = data.charCodeAt(i);
      }

      decodeAudioData(dataView.buffer, self);
    } else {
      // Load the buffer from the URL.
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.withCredentials = self._xhrWithCredentials;
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        // Make sure we get a successful response back.
        var code = (xhr.status + '')[0];
        if (code !== '0' && code !== '2' && code !== '3') {
          self._emit('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
          return;
        }

        decodeAudioData(xhr.response, self);
      };
      xhr.onerror = function() {
        // If there is an error, switch to HTML5 Audio.
        if (self._webAudio) {
          self._html5 = true;
          self._webAudio = false;
          self._sounds = [];
          delete cache[url];
          self.load();
        }
      };
      safeXhrSend(xhr);
    }
  };

  /**
   * Send the XHR request wrapped in a try/catch.
   * @param  {Object} xhr XHR to send.
   */
  var safeXhrSend = function(xhr) {
    try {
      xhr.send();
    } catch (e) {
      xhr.onerror();
    }
  };

  /**
   * Decode audio data from an array buffer.
   * @param  {ArrayBuffer} arraybuffer The audio data.
   * @param  {Howl}        self
   */
  var decodeAudioData = function(arraybuffer, self) {
    // Fire a load error if something broke.
    var error = function() {
      self._emit('loaderror', null, 'Decoding audio data failed.');
    };

    // Load the sound on success.
    var success = function(buffer) {
      if (buffer && self._sounds.length > 0) {
        cache[self._src] = buffer;
        loadSound(self, buffer);
      } else {
        error();
      }
    };

    // Decode the buffer into an audio source.
    if (typeof Promise !== 'undefined' && Howler.ctx.decodeAudioData.length === 1) {
      Howler.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
    } else {
      Howler.ctx.decodeAudioData(arraybuffer, success, error);
    }
  }

  /**
   * Sound is now loaded, so finish setting everything up and fire the loaded event.
   * @param  {Howl} self
   * @param  {Object} buffer The decoded buffer sound source.
   */
  var loadSound = function(self, buffer) {
    // Set the duration.
    if (buffer && !self._duration) {
      self._duration = buffer.duration;
    }

    // Setup a sprite if none is defined.
    if (Object.keys(self._sprite).length === 0) {
      self._sprite = {__default: [0, self._duration * 1000]};
    }

    // Fire the loaded event.
    if (self._state !== 'loaded') {
      self._state = 'loaded';
      self._emit('load');
      self._loadQueue();
    }
  };

  /**
   * Setup the audio context when available, or switch to HTML5 Audio mode.
   */
  var setupAudioContext = function() {
    // If we have already detected that Web Audio isn't supported, don't run this step again.
    if (!Howler.usingWebAudio) {
      return;
    }

    // Check if we are using Web Audio and setup the AudioContext if we are.
    try {
      if (typeof AudioContext !== 'undefined') {
        Howler.ctx = new AudioContext();
      } else if (typeof webkitAudioContext !== 'undefined') {
        Howler.ctx = new webkitAudioContext();
      } else {
        Howler.usingWebAudio = false;
      }
    } catch(e) {
      Howler.usingWebAudio = false;
    }

    // If the audio context creation still failed, set using web audio to false.
    if (!Howler.ctx) {
      Howler.usingWebAudio = false;
    }

    // Check if a webview is being used on iOS8 or earlier (rather than the browser).
    // If it is, disable Web Audio as it causes crashing.
    var iOS = (/iP(hone|od|ad)/.test(Howler._navigator && Howler._navigator.platform));
    var appVersion = Howler._navigator && Howler._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    var version = appVersion ? parseInt(appVersion[1], 10) : null;
    if (iOS && version && version < 9) {
      var safari = /safari/.test(Howler._navigator && Howler._navigator.userAgent.toLowerCase());
      if (Howler._navigator && Howler._navigator.standalone && !safari || Howler._navigator && !Howler._navigator.standalone && !safari) {
        Howler.usingWebAudio = false;
      }
    }

    // Create and expose the master GainNode when using Web Audio (useful for plugins or advanced usage).
    if (Howler.usingWebAudio) {
      Howler.masterGain = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
      Howler.masterGain.gain.setValueAtTime(Howler._muted ? 0 : 1, Howler.ctx.currentTime);
      Howler.masterGain.connect(Howler.ctx.destination);
    }

    // Re-run the setup on Howler.
    Howler._setup();
  };

  // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return {
        Howler: Howler,
        Howl: Howl
      };
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }

  // Add support for CommonJS libraries such as browserify.
  if (true) {
    exports.Howler = Howler;
    exports.Howl = Howl;
  }

  // Define globally in case AMD is not available or unused.
  if (typeof window !== 'undefined') {
    window.HowlerGlobal = HowlerGlobal;
    window.Howler = Howler;
    window.Howl = Howl;
    window.Sound = Sound;
  } else if (typeof global !== 'undefined') { // Add to global in Node.js (for testing, etc).
    global.HowlerGlobal = HowlerGlobal;
    global.Howler = Howler;
    global.Howl = Howl;
    global.Sound = Sound;
  }
})();


/*!
 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
 *  
 *  howler.js v2.1.2
 *  howlerjs.com
 *
 *  (c) 2013-2019, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  // Setup default properties.
  HowlerGlobal.prototype._pos = [0, 0, 0];
  HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Helper method to update the stereo panning position of all current Howls.
   * Future Howls will not use this value unless explicitly set.
   * @param  {Number} pan A value of -1.0 is all the way left and 1.0 is all the way right.
   * @return {Howler/Number}     Self or current stereo panning value.
   */
  HowlerGlobal.prototype.stereo = function(pan) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Loop through all Howls and update their stereo panning.
    for (var i=self._howls.length-1; i>=0; i--) {
      self._howls[i].stereo(pan);
    }

    return self;
  };

  /**
   * Get/set the position of the listener in 3D cartesian space. Sounds using
   * 3D position will be relative to the listener's position.
   * @param  {Number} x The x-position of the listener.
   * @param  {Number} y The y-position of the listener.
   * @param  {Number} z The z-position of the listener.
   * @return {Howler/Array}   Self or current listener position.
   */
  HowlerGlobal.prototype.pos = function(x, y, z) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._pos[1] : y;
    z = (typeof z !== 'number') ? self._pos[2] : z;

    if (typeof x === 'number') {
      self._pos = [x, y, z];

      if (typeof self.ctx.listener.positionX !== 'undefined') {
        self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
        self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
        self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
      } else {
        self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
      }
    } else {
      return self._pos;
    }

    return self;
  };

  /**
   * Get/set the direction the listener is pointing in the 3D cartesian space.
   * A front and up vector must be provided. The front is the direction the
   * face of the listener is pointing, and up is the direction the top of the
   * listener is pointing. Thus, these values are expected to be at right angles
   * from each other.
   * @param  {Number} x   The x-orientation of the listener.
   * @param  {Number} y   The y-orientation of the listener.
   * @param  {Number} z   The z-orientation of the listener.
   * @param  {Number} xUp The x-orientation of the top of the listener.
   * @param  {Number} yUp The y-orientation of the top of the listener.
   * @param  {Number} zUp The z-orientation of the top of the listener.
   * @return {Howler/Array}     Returns self or the current orientation vectors.
   */
  HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    var or = self._orientation;
    y = (typeof y !== 'number') ? or[1] : y;
    z = (typeof z !== 'number') ? or[2] : z;
    xUp = (typeof xUp !== 'number') ? or[3] : xUp;
    yUp = (typeof yUp !== 'number') ? or[4] : yUp;
    zUp = (typeof zUp !== 'number') ? or[5] : zUp;

    if (typeof x === 'number') {
      self._orientation = [x, y, z, xUp, yUp, zUp];

      if (typeof self.ctx.listener.forwardX !== 'undefined') {
        self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
      } else {
        self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
      }
    } else {
      return or;
    }

    return self;
  };

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core init.
   * @param  {Function} _super Core init method.
   * @return {Howl}
   */
  Howl.prototype.init = (function(_super) {
    return function(o) {
      var self = this;

      // Setup user-defined default properties.
      self._orientation = o.orientation || [1, 0, 0];
      self._stereo = o.stereo || null;
      self._pos = o.pos || null;
      self._pannerAttr = {
        coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : 360,
        coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : 360,
        coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : 0,
        distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : 'inverse',
        maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : 10000,
        panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : 'HRTF',
        refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : 1,
        rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : 1
      };

      // Setup event listeners.
      self._onstereo = o.onstereo ? [{fn: o.onstereo}] : [];
      self._onpos = o.onpos ? [{fn: o.onpos}] : [];
      self._onorientation = o.onorientation ? [{fn: o.onorientation}] : [];

      // Complete initilization with howler.js core's init function.
      return _super.call(this, o);
    };
  })(Howl.prototype.init);

  /**
   * Get/set the stereo panning of the audio source for this sound or all in the group.
   * @param  {Number} pan  A value of -1.0 is all the way left and 1.0 is all the way right.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Number}    Returns self or the current stereo panning value.
   */
  Howl.prototype.stereo = function(pan, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change stereo pan when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'stereo',
        action: function() {
          self.stereo(pan, id);
        }
      });

      return self;
    }

    // Check for PannerStereoNode support and fallback to PannerNode if it doesn't exist.
    var pannerType = (typeof Howler.ctx.createStereoPanner === 'undefined') ? 'spatial' : 'stereo';

    // Setup the group's stereo panning if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's stereo panning if no parameters are passed.
      if (typeof pan === 'number') {
        self._stereo = pan;
        self._pos = [pan, 0, 0];
      } else {
        return self._stereo;
      }
    }

    // Change the streo panning of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof pan === 'number') {
          sound._stereo = pan;
          sound._pos = [pan, 0, 0];

          if (sound._node) {
            // If we are falling back, make sure the panningModel is equalpower.
            sound._pannerAttr.panningModel = 'equalpower';

            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || !sound._panner.pan) {
              setupPanner(sound, pannerType);
            }

            if (pannerType === 'spatial') {
              if (typeof sound._panner.positionX !== 'undefined') {
                sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
              } else {
                sound._panner.setPosition(pan, 0, 0);
              }
            } else {
              sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
            }
          }

          self._emit('stereo', sound._id);
        } else {
          return sound._stereo;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the 3D spatial position of the audio source for this sound or group relative to the global listener.
   * @param  {Number} x  The x-position of the audio source.
   * @param  {Number} y  The y-position of the audio source.
   * @param  {Number} z  The z-position of the audio source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial position: [x, y, z].
   */
  Howl.prototype.pos = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change position when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'pos',
        action: function() {
          self.pos(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? 0 : y;
    z = (typeof z !== 'number') ? -0.5 : z;

    // Setup the group's spatial position if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial position if no parameters are passed.
      if (typeof x === 'number') {
        self._pos = [x, y, z];
      } else {
        return self._pos;
      }
    }

    // Change the spatial position of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._pos = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || sound._panner.pan) {
              setupPanner(sound, 'spatial');
            }

            if (typeof sound._panner.positionX !== 'undefined') {
              sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
              sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
              sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
            } else {
              sound._panner.setPosition(x, y, z);
            }
          }

          self._emit('pos', sound._id);
        } else {
          return sound._pos;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the direction the audio source is pointing in the 3D cartesian coordinate
   * space. Depending on how direction the sound is, based on the `cone` attributes,
   * a sound pointing away from the listener can be quiet or silent.
   * @param  {Number} x  The x-orientation of the source.
   * @param  {Number} y  The y-orientation of the source.
   * @param  {Number} z  The z-orientation of the source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial orientation: [x, y, z].
   */
  Howl.prototype.orientation = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change orientation when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'orientation',
        action: function() {
          self.orientation(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._orientation[1] : y;
    z = (typeof z !== 'number') ? self._orientation[2] : z;

    // Setup the group's spatial orientation if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial orientation if no parameters are passed.
      if (typeof x === 'number') {
        self._orientation = [x, y, z];
      } else {
        return self._orientation;
      }
    }

    // Change the spatial orientation of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._orientation = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner) {
              // Make sure we have a position to setup the node with.
              if (!sound._pos) {
                sound._pos = self._pos || [0, 0, -0.5];
              }

              setupPanner(sound, 'spatial');
            }

            if (typeof sound._panner.orientationX !== 'undefined') {
              sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
              sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
              sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
            } else {
              sound._panner.setOrientation(x, y, z);
            }
          }

          self._emit('orientation', sound._id);
        } else {
          return sound._orientation;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the panner node's attributes for a sound or group of sounds.
   * This method can optionall take 0, 1 or 2 arguments.
   *   pannerAttr() -> Returns the group's values.
   *   pannerAttr(id) -> Returns the sound id's values.
   *   pannerAttr(o) -> Set's the values of all sounds in this Howl group.
   *   pannerAttr(o, id) -> Set's the values of passed sound id.
   *
   *   Attributes:
   *     coneInnerAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      inside of which there will be no volume reduction.
   *     coneOuterAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      outside of which the volume will be reduced to a constant value of `coneOuterGain`.
   *     coneOuterGain - (0 by default) A parameter for directional audio sources, this is the gain outside of the
   *                     `coneOuterAngle`. It is a linear value in the range `[0, 1]`.
   *     distanceModel - ('inverse' by default) Determines algorithm used to reduce volume as audio moves away from
   *                     listener. Can be `linear`, `inverse` or `exponential.
   *     maxDistance - (10000 by default) The maximum distance between source and listener, after which the volume
   *                   will not be reduced any further.
   *     refDistance - (1 by default) A reference distance for reducing volume as source moves further from the listener.
   *                   This is simply a variable of the distance model and has a different effect depending on which model
   *                   is used and the scale of your coordinates. Generally, volume will be equal to 1 at this distance.
   *     rolloffFactor - (1 by default) How quickly the volume reduces as source moves from listener. This is simply a
   *                     variable of the distance model and can be in the range of `[0, 1]` with `linear` and `[0, ∞]`
   *                     with `inverse` and `exponential`.
   *     panningModel - ('HRTF' by default) Determines which spatialization algorithm is used to position audio.
   *                     Can be `HRTF` or `equalpower`.
   *
   * @return {Howl/Object} Returns self or current panner attributes.
   */
  Howl.prototype.pannerAttr = function() {
    var self = this;
    var args = arguments;
    var o, id, sound;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // Determine the values based on arguments.
    if (args.length === 0) {
      // Return the group's panner attribute values.
      return self._pannerAttr;
    } else if (args.length === 1) {
      if (typeof args[0] === 'object') {
        o = args[0];

        // Set the grou's panner attribute values.
        if (typeof id === 'undefined') {
          if (!o.pannerAttr) {
            o.pannerAttr = {
              coneInnerAngle: o.coneInnerAngle,
              coneOuterAngle: o.coneOuterAngle,
              coneOuterGain: o.coneOuterGain,
              distanceModel: o.distanceModel,
              maxDistance: o.maxDistance,
              refDistance: o.refDistance,
              rolloffFactor: o.rolloffFactor,
              panningModel: o.panningModel
            };
          }

          self._pannerAttr = {
            coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== 'undefined' ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
            coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== 'undefined' ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
            coneOuterGain: typeof o.pannerAttr.coneOuterGain !== 'undefined' ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
            distanceModel: typeof o.pannerAttr.distanceModel !== 'undefined' ? o.pannerAttr.distanceModel : self._distanceModel,
            maxDistance: typeof o.pannerAttr.maxDistance !== 'undefined' ? o.pannerAttr.maxDistance : self._maxDistance,
            refDistance: typeof o.pannerAttr.refDistance !== 'undefined' ? o.pannerAttr.refDistance : self._refDistance,
            rolloffFactor: typeof o.pannerAttr.rolloffFactor !== 'undefined' ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
            panningModel: typeof o.pannerAttr.panningModel !== 'undefined' ? o.pannerAttr.panningModel : self._panningModel
          };
        }
      } else {
        // Return this sound's panner attribute values.
        sound = self._soundById(parseInt(args[0], 10));
        return sound ? sound._pannerAttr : self._pannerAttr;
      }
    } else if (args.length === 2) {
      o = args[0];
      id = parseInt(args[1], 10);
    }

    // Update the values of the specified sounds.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      sound = self._soundById(ids[i]);

      if (sound) {
        // Merge the new values into the sound.
        var pa = sound._pannerAttr;
        pa = {
          coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : pa.coneInnerAngle,
          coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : pa.coneOuterAngle,
          coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : pa.coneOuterGain,
          distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : pa.distanceModel,
          maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : pa.maxDistance,
          refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : pa.refDistance,
          rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : pa.rolloffFactor,
          panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : pa.panningModel
        };

        // Update the panner values or create a new panner if none exists.
        var panner = sound._panner;
        if (panner) {
          panner.coneInnerAngle = pa.coneInnerAngle;
          panner.coneOuterAngle = pa.coneOuterAngle;
          panner.coneOuterGain = pa.coneOuterGain;
          panner.distanceModel = pa.distanceModel;
          panner.maxDistance = pa.maxDistance;
          panner.refDistance = pa.refDistance;
          panner.rolloffFactor = pa.rolloffFactor;
          panner.panningModel = pa.panningModel;
        } else {
          // Make sure we have a position to setup the node with.
          if (!sound._pos) {
            sound._pos = self._pos || [0, 0, -0.5];
          }

          // Create a new panner node.
          setupPanner(sound, 'spatial');
        }
      }
    }

    return self;
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core Sound init.
   * @param  {Function} _super Core Sound init method.
   * @return {Sound}
   */
  Sound.prototype.init = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Setup user-defined default properties.
      self._orientation = parent._orientation;
      self._stereo = parent._stereo;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // Complete initilization with howler.js core Sound's init function.
      _super.call(this);

      // If a stereo or position was specified, set it up.
      if (self._stereo) {
        parent.stereo(self._stereo);
      } else if (self._pos) {
        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
      }
    };
  })(Sound.prototype.init);

  /**
   * Override the Sound.reset method to clean up properties from the spatial plugin.
   * @param  {Function} _super Sound reset method.
   * @return {Sound}
   */
  Sound.prototype.reset = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Reset all spatial plugin properties on this sound.
      self._orientation = parent._orientation;
      self._stereo = parent._stereo;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // If a stereo or position was specified, set it up.
      if (self._stereo) {
        parent.stereo(self._stereo);
      } else if (self._pos) {
        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
      } else if (self._panner) {
        // Disconnect the panner.
        self._panner.disconnect(0);
        self._panner = undefined;
        parent._refreshBuffer(self);
      }

      // Complete resetting of the sound.
      return _super.call(this);
    };
  })(Sound.prototype.reset);

  /** Helper Methods **/
  /***************************************************************************/

  /**
   * Create a new panner node and save it on the sound.
   * @param  {Sound} sound Specific sound to setup panning on.
   * @param {String} type Type of panner to create: 'stereo' or 'spatial'.
   */
  var setupPanner = function(sound, type) {
    type = type || 'spatial';

    // Create the new panner node.
    if (type === 'spatial') {
      sound._panner = Howler.ctx.createPanner();
      sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
      sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
      sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
      sound._panner.distanceModel = sound._pannerAttr.distanceModel;
      sound._panner.maxDistance = sound._pannerAttr.maxDistance;
      sound._panner.refDistance = sound._pannerAttr.refDistance;
      sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
      sound._panner.panningModel = sound._pannerAttr.panningModel;

      if (typeof sound._panner.positionX !== 'undefined') {
        sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
        sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
        sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
      } else {
        sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
      }

      if (typeof sound._panner.orientationX !== 'undefined') {
        sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
        sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
        sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
      } else {
        sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
      }
    } else {
      sound._panner = Howler.ctx.createStereoPanner();
      sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
    }

    sound._panner.connect(sound._node);

    // Update the connections.
    if (!sound._paused) {
      sound._parent.pause(sound._id, true).play(sound._id, true);
    }
  };
})();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/inversify/lib/annotation/decorator_utils.js":
/*!******************************************************************!*\
  !*** ./node_modules/inversify/lib/annotation/decorator_utils.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ERROR_MSGS = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
function tagParameter(annotationTarget, propertyName, parameterIndex, metadata) {
    var metadataKey = METADATA_KEY.TAGGED;
    _tagParameterOrProperty(metadataKey, annotationTarget, propertyName, metadata, parameterIndex);
}
exports.tagParameter = tagParameter;
function tagProperty(annotationTarget, propertyName, metadata) {
    var metadataKey = METADATA_KEY.TAGGED_PROP;
    _tagParameterOrProperty(metadataKey, annotationTarget.constructor, propertyName, metadata);
}
exports.tagProperty = tagProperty;
function _tagParameterOrProperty(metadataKey, annotationTarget, propertyName, metadata, parameterIndex) {
    var paramsOrPropertiesMetadata = {};
    var isParameterDecorator = (typeof parameterIndex === "number");
    var key = (parameterIndex !== undefined && isParameterDecorator) ? parameterIndex.toString() : propertyName;
    if (isParameterDecorator && propertyName !== undefined) {
        throw new Error(ERROR_MSGS.INVALID_DECORATOR_OPERATION);
    }
    if (Reflect.hasOwnMetadata(metadataKey, annotationTarget)) {
        paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, annotationTarget);
    }
    var paramOrPropertyMetadata = paramsOrPropertiesMetadata[key];
    if (!Array.isArray(paramOrPropertyMetadata)) {
        paramOrPropertyMetadata = [];
    }
    else {
        for (var _i = 0, paramOrPropertyMetadata_1 = paramOrPropertyMetadata; _i < paramOrPropertyMetadata_1.length; _i++) {
            var m = paramOrPropertyMetadata_1[_i];
            if (m.key === metadata.key) {
                throw new Error(ERROR_MSGS.DUPLICATED_METADATA + " " + m.key.toString());
            }
        }
    }
    paramOrPropertyMetadata.push(metadata);
    paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
    Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, annotationTarget);
}
function _decorate(decorators, target) {
    Reflect.decorate(decorators, target);
}
function _param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); };
}
function decorate(decorator, target, parameterIndex) {
    if (typeof parameterIndex === "number") {
        _decorate([_param(parameterIndex, decorator)], target);
    }
    else if (typeof parameterIndex === "string") {
        Reflect.decorate([decorator], target, parameterIndex);
    }
    else {
        _decorate([decorator], target);
    }
}
exports.decorate = decorate;


/***/ }),

/***/ "./node_modules/inversify/lib/annotation/inject.js":
/*!*********************************************************!*\
  !*** ./node_modules/inversify/lib/annotation/inject.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var error_msgs_1 = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var metadata_1 = __webpack_require__(/*! ../planning/metadata */ "./node_modules/inversify/lib/planning/metadata.js");
var decorator_utils_1 = __webpack_require__(/*! ./decorator_utils */ "./node_modules/inversify/lib/annotation/decorator_utils.js");
var LazyServiceIdentifer = (function () {
    function LazyServiceIdentifer(cb) {
        this._cb = cb;
    }
    LazyServiceIdentifer.prototype.unwrap = function () {
        return this._cb();
    };
    return LazyServiceIdentifer;
}());
exports.LazyServiceIdentifer = LazyServiceIdentifer;
function inject(serviceIdentifier) {
    return function (target, targetKey, index) {
        if (serviceIdentifier === undefined) {
            throw new Error(error_msgs_1.UNDEFINED_INJECT_ANNOTATION(target.name));
        }
        var metadata = new metadata_1.Metadata(METADATA_KEY.INJECT_TAG, serviceIdentifier);
        if (typeof index === "number") {
            decorator_utils_1.tagParameter(target, targetKey, index, metadata);
        }
        else {
            decorator_utils_1.tagProperty(target, targetKey, metadata);
        }
    };
}
exports.inject = inject;


/***/ }),

/***/ "./node_modules/inversify/lib/annotation/injectable.js":
/*!*************************************************************!*\
  !*** ./node_modules/inversify/lib/annotation/injectable.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ERRORS_MSGS = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
function injectable() {
    return function (target) {
        if (Reflect.hasOwnMetadata(METADATA_KEY.PARAM_TYPES, target)) {
            throw new Error(ERRORS_MSGS.DUPLICATED_INJECTABLE_DECORATOR);
        }
        var types = Reflect.getMetadata(METADATA_KEY.DESIGN_PARAM_TYPES, target) || [];
        Reflect.defineMetadata(METADATA_KEY.PARAM_TYPES, types, target);
        return target;
    };
}
exports.injectable = injectable;


/***/ }),

/***/ "./node_modules/inversify/lib/annotation/multi_inject.js":
/*!***************************************************************!*\
  !*** ./node_modules/inversify/lib/annotation/multi_inject.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var metadata_1 = __webpack_require__(/*! ../planning/metadata */ "./node_modules/inversify/lib/planning/metadata.js");
var decorator_utils_1 = __webpack_require__(/*! ./decorator_utils */ "./node_modules/inversify/lib/annotation/decorator_utils.js");
function multiInject(serviceIdentifier) {
    return function (target, targetKey, index) {
        var metadata = new metadata_1.Metadata(METADATA_KEY.MULTI_INJECT_TAG, serviceIdentifier);
        if (typeof index === "number") {
            decorator_utils_1.tagParameter(target, targetKey, index, metadata);
        }
        else {
            decorator_utils_1.tagProperty(target, targetKey, metadata);
        }
    };
}
exports.multiInject = multiInject;


/***/ }),

/***/ "./node_modules/inversify/lib/annotation/named.js":
/*!********************************************************!*\
  !*** ./node_modules/inversify/lib/annotation/named.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var metadata_1 = __webpack_require__(/*! ../planning/metadata */ "./node_modules/inversify/lib/planning/metadata.js");
var decorator_utils_1 = __webpack_require__(/*! ./decorator_utils */ "./node_modules/inversify/lib/annotation/decorator_utils.js");
function named(name) {
    return function (target, targetKey, index) {
        var metadata = new metadata_1.Metadata(METADATA_KEY.NAMED_TAG, name);
        if (typeof index === "number") {
            decorator_utils_1.tagParameter(target, targetKey, index, metadata);
        }
        else {
            decorator_utils_1.tagProperty(target, targetKey, metadata);
        }
    };
}
exports.named = named;


/***/ }),

/***/ "./node_modules/inversify/lib/annotation/optional.js":
/*!***********************************************************!*\
  !*** ./node_modules/inversify/lib/annotation/optional.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var metadata_1 = __webpack_require__(/*! ../planning/metadata */ "./node_modules/inversify/lib/planning/metadata.js");
var decorator_utils_1 = __webpack_require__(/*! ./decorator_utils */ "./node_modules/inversify/lib/annotation/decorator_utils.js");
function optional() {
    return function (target, targetKey, index) {
        var metadata = new metadata_1.Metadata(METADATA_KEY.OPTIONAL_TAG, true);
        if (typeof index === "number") {
            decorator_utils_1.tagParameter(target, targetKey, index, metadata);
        }
        else {
            decorator_utils_1.tagProperty(target, targetKey, metadata);
        }
    };
}
exports.optional = optional;


/***/ }),

/***/ "./node_modules/inversify/lib/annotation/post_construct.js":
/*!*****************************************************************!*\
  !*** ./node_modules/inversify/lib/annotation/post_construct.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ERRORS_MSGS = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var metadata_1 = __webpack_require__(/*! ../planning/metadata */ "./node_modules/inversify/lib/planning/metadata.js");
function postConstruct() {
    return function (target, propertyKey, descriptor) {
        var metadata = new metadata_1.Metadata(METADATA_KEY.POST_CONSTRUCT, propertyKey);
        if (Reflect.hasOwnMetadata(METADATA_KEY.POST_CONSTRUCT, target.constructor)) {
            throw new Error(ERRORS_MSGS.MULTIPLE_POST_CONSTRUCT_METHODS);
        }
        Reflect.defineMetadata(METADATA_KEY.POST_CONSTRUCT, metadata, target.constructor);
    };
}
exports.postConstruct = postConstruct;


/***/ }),

/***/ "./node_modules/inversify/lib/annotation/tagged.js":
/*!*********************************************************!*\
  !*** ./node_modules/inversify/lib/annotation/tagged.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metadata_1 = __webpack_require__(/*! ../planning/metadata */ "./node_modules/inversify/lib/planning/metadata.js");
var decorator_utils_1 = __webpack_require__(/*! ./decorator_utils */ "./node_modules/inversify/lib/annotation/decorator_utils.js");
function tagged(metadataKey, metadataValue) {
    return function (target, targetKey, index) {
        var metadata = new metadata_1.Metadata(metadataKey, metadataValue);
        if (typeof index === "number") {
            decorator_utils_1.tagParameter(target, targetKey, index, metadata);
        }
        else {
            decorator_utils_1.tagProperty(target, targetKey, metadata);
        }
    };
}
exports.tagged = tagged;


/***/ }),

/***/ "./node_modules/inversify/lib/annotation/target_name.js":
/*!**************************************************************!*\
  !*** ./node_modules/inversify/lib/annotation/target_name.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var metadata_1 = __webpack_require__(/*! ../planning/metadata */ "./node_modules/inversify/lib/planning/metadata.js");
var decorator_utils_1 = __webpack_require__(/*! ./decorator_utils */ "./node_modules/inversify/lib/annotation/decorator_utils.js");
function targetName(name) {
    return function (target, targetKey, index) {
        var metadata = new metadata_1.Metadata(METADATA_KEY.NAME_TAG, name);
        decorator_utils_1.tagParameter(target, targetKey, index, metadata);
    };
}
exports.targetName = targetName;


/***/ }),

/***/ "./node_modules/inversify/lib/annotation/unmanaged.js":
/*!************************************************************!*\
  !*** ./node_modules/inversify/lib/annotation/unmanaged.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var metadata_1 = __webpack_require__(/*! ../planning/metadata */ "./node_modules/inversify/lib/planning/metadata.js");
var decorator_utils_1 = __webpack_require__(/*! ./decorator_utils */ "./node_modules/inversify/lib/annotation/decorator_utils.js");
function unmanaged() {
    return function (target, targetKey, index) {
        var metadata = new metadata_1.Metadata(METADATA_KEY.UNMANAGED_TAG, true);
        decorator_utils_1.tagParameter(target, targetKey, index, metadata);
    };
}
exports.unmanaged = unmanaged;


/***/ }),

/***/ "./node_modules/inversify/lib/bindings/binding.js":
/*!********************************************************!*\
  !*** ./node_modules/inversify/lib/bindings/binding.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var literal_types_1 = __webpack_require__(/*! ../constants/literal_types */ "./node_modules/inversify/lib/constants/literal_types.js");
var id_1 = __webpack_require__(/*! ../utils/id */ "./node_modules/inversify/lib/utils/id.js");
var Binding = (function () {
    function Binding(serviceIdentifier, scope) {
        this.id = id_1.id();
        this.activated = false;
        this.serviceIdentifier = serviceIdentifier;
        this.scope = scope;
        this.type = literal_types_1.BindingTypeEnum.Invalid;
        this.constraint = function (request) { return true; };
        this.implementationType = null;
        this.cache = null;
        this.factory = null;
        this.provider = null;
        this.onActivation = null;
        this.dynamicValue = null;
    }
    Binding.prototype.clone = function () {
        var clone = new Binding(this.serviceIdentifier, this.scope);
        clone.activated = false;
        clone.implementationType = this.implementationType;
        clone.dynamicValue = this.dynamicValue;
        clone.scope = this.scope;
        clone.type = this.type;
        clone.factory = this.factory;
        clone.provider = this.provider;
        clone.constraint = this.constraint;
        clone.onActivation = this.onActivation;
        clone.cache = this.cache;
        return clone;
    };
    return Binding;
}());
exports.Binding = Binding;


/***/ }),

/***/ "./node_modules/inversify/lib/bindings/binding_count.js":
/*!**************************************************************!*\
  !*** ./node_modules/inversify/lib/bindings/binding_count.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BindingCount = {
    MultipleBindingsAvailable: 2,
    NoBindingsAvailable: 0,
    OnlyOneBindingAvailable: 1
};
exports.BindingCount = BindingCount;


/***/ }),

/***/ "./node_modules/inversify/lib/constants/error_msgs.js":
/*!************************************************************!*\
  !*** ./node_modules/inversify/lib/constants/error_msgs.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DUPLICATED_INJECTABLE_DECORATOR = "Cannot apply @injectable decorator multiple times.";
exports.DUPLICATED_METADATA = "Metadata key was used more than once in a parameter:";
exports.NULL_ARGUMENT = "NULL argument";
exports.KEY_NOT_FOUND = "Key Not Found";
exports.AMBIGUOUS_MATCH = "Ambiguous match found for serviceIdentifier:";
exports.CANNOT_UNBIND = "Could not unbind serviceIdentifier:";
exports.NOT_REGISTERED = "No matching bindings found for serviceIdentifier:";
exports.MISSING_INJECTABLE_ANNOTATION = "Missing required @injectable annotation in:";
exports.MISSING_INJECT_ANNOTATION = "Missing required @inject or @multiInject annotation in:";
exports.UNDEFINED_INJECT_ANNOTATION = function (name) {
    return "@inject called with undefined this could mean that the class " + name + " has " +
        "a circular dependency problem. You can use a LazyServiceIdentifer to  " +
        "overcome this limitation.";
};
exports.CIRCULAR_DEPENDENCY = "Circular dependency found:";
exports.NOT_IMPLEMENTED = "Sorry, this feature is not fully implemented yet.";
exports.INVALID_BINDING_TYPE = "Invalid binding type:";
exports.NO_MORE_SNAPSHOTS_AVAILABLE = "No snapshot available to restore.";
exports.INVALID_MIDDLEWARE_RETURN = "Invalid return type in middleware. Middleware must return!";
exports.INVALID_FUNCTION_BINDING = "Value provided to function binding must be a function!";
exports.INVALID_TO_SELF_VALUE = "The toSelf function can only be applied when a constructor is " +
    "used as service identifier";
exports.INVALID_DECORATOR_OPERATION = "The @inject @multiInject @tagged and @named decorators " +
    "must be applied to the parameters of a class constructor or a class property.";
exports.ARGUMENTS_LENGTH_MISMATCH = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return "The number of constructor arguments in the derived class " +
        (values[0] + " must be >= than the number of constructor arguments of its base class.");
};
exports.CONTAINER_OPTIONS_MUST_BE_AN_OBJECT = "Invalid Container constructor argument. Container options " +
    "must be an object.";
exports.CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE = "Invalid Container option. Default scope must " +
    "be a string ('singleton' or 'transient').";
exports.CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE = "Invalid Container option. Auto bind injectable must " +
    "be a boolean";
exports.CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK = "Invalid Container option. Skip base check must " +
    "be a boolean";
exports.MULTIPLE_POST_CONSTRUCT_METHODS = "Cannot apply @postConstruct decorator multiple times in the same class";
exports.POST_CONSTRUCT_ERROR = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return "@postConstruct error in class " + values[0] + ": " + values[1];
};
exports.CIRCULAR_DEPENDENCY_IN_FACTORY = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return "It looks like there is a circular dependency " +
        ("in one of the '" + values[0] + "' bindings. Please investigate bindings with") +
        ("service identifier '" + values[1] + "'.");
};
exports.STACK_OVERFLOW = "Maximum call stack size exceeded";


/***/ }),

/***/ "./node_modules/inversify/lib/constants/literal_types.js":
/*!***************************************************************!*\
  !*** ./node_modules/inversify/lib/constants/literal_types.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var BindingScopeEnum = {
    Request: "Request",
    Singleton: "Singleton",
    Transient: "Transient"
};
exports.BindingScopeEnum = BindingScopeEnum;
var BindingTypeEnum = {
    ConstantValue: "ConstantValue",
    Constructor: "Constructor",
    DynamicValue: "DynamicValue",
    Factory: "Factory",
    Function: "Function",
    Instance: "Instance",
    Invalid: "Invalid",
    Provider: "Provider"
};
exports.BindingTypeEnum = BindingTypeEnum;
var TargetTypeEnum = {
    ClassProperty: "ClassProperty",
    ConstructorArgument: "ConstructorArgument",
    Variable: "Variable"
};
exports.TargetTypeEnum = TargetTypeEnum;


/***/ }),

/***/ "./node_modules/inversify/lib/constants/metadata_keys.js":
/*!***************************************************************!*\
  !*** ./node_modules/inversify/lib/constants/metadata_keys.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NAMED_TAG = "named";
exports.NAME_TAG = "name";
exports.UNMANAGED_TAG = "unmanaged";
exports.OPTIONAL_TAG = "optional";
exports.INJECT_TAG = "inject";
exports.MULTI_INJECT_TAG = "multi_inject";
exports.TAGGED = "inversify:tagged";
exports.TAGGED_PROP = "inversify:tagged_props";
exports.PARAM_TYPES = "inversify:paramtypes";
exports.DESIGN_PARAM_TYPES = "design:paramtypes";
exports.POST_CONSTRUCT = "post_construct";


/***/ }),

/***/ "./node_modules/inversify/lib/container/container.js":
/*!***********************************************************!*\
  !*** ./node_modules/inversify/lib/container/container.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var binding_1 = __webpack_require__(/*! ../bindings/binding */ "./node_modules/inversify/lib/bindings/binding.js");
var ERROR_MSGS = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
var literal_types_1 = __webpack_require__(/*! ../constants/literal_types */ "./node_modules/inversify/lib/constants/literal_types.js");
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var metadata_reader_1 = __webpack_require__(/*! ../planning/metadata_reader */ "./node_modules/inversify/lib/planning/metadata_reader.js");
var planner_1 = __webpack_require__(/*! ../planning/planner */ "./node_modules/inversify/lib/planning/planner.js");
var resolver_1 = __webpack_require__(/*! ../resolution/resolver */ "./node_modules/inversify/lib/resolution/resolver.js");
var binding_to_syntax_1 = __webpack_require__(/*! ../syntax/binding_to_syntax */ "./node_modules/inversify/lib/syntax/binding_to_syntax.js");
var id_1 = __webpack_require__(/*! ../utils/id */ "./node_modules/inversify/lib/utils/id.js");
var serialization_1 = __webpack_require__(/*! ../utils/serialization */ "./node_modules/inversify/lib/utils/serialization.js");
var container_snapshot_1 = __webpack_require__(/*! ./container_snapshot */ "./node_modules/inversify/lib/container/container_snapshot.js");
var lookup_1 = __webpack_require__(/*! ./lookup */ "./node_modules/inversify/lib/container/lookup.js");
var Container = (function () {
    function Container(containerOptions) {
        var options = containerOptions || {};
        if (typeof options !== "object") {
            throw new Error("" + ERROR_MSGS.CONTAINER_OPTIONS_MUST_BE_AN_OBJECT);
        }
        if (options.defaultScope === undefined) {
            options.defaultScope = literal_types_1.BindingScopeEnum.Transient;
        }
        else if (options.defaultScope !== literal_types_1.BindingScopeEnum.Singleton &&
            options.defaultScope !== literal_types_1.BindingScopeEnum.Transient &&
            options.defaultScope !== literal_types_1.BindingScopeEnum.Request) {
            throw new Error("" + ERROR_MSGS.CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE);
        }
        if (options.autoBindInjectable === undefined) {
            options.autoBindInjectable = false;
        }
        else if (typeof options.autoBindInjectable !== "boolean") {
            throw new Error("" + ERROR_MSGS.CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE);
        }
        if (options.skipBaseClassChecks === undefined) {
            options.skipBaseClassChecks = false;
        }
        else if (typeof options.skipBaseClassChecks !== "boolean") {
            throw new Error("" + ERROR_MSGS.CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK);
        }
        this.options = {
            autoBindInjectable: options.autoBindInjectable,
            defaultScope: options.defaultScope,
            skipBaseClassChecks: options.skipBaseClassChecks
        };
        this.id = id_1.id();
        this._bindingDictionary = new lookup_1.Lookup();
        this._snapshots = [];
        this._middleware = null;
        this.parent = null;
        this._metadataReader = new metadata_reader_1.MetadataReader();
    }
    Container.merge = function (container1, container2) {
        var container = new Container();
        var bindingDictionary = planner_1.getBindingDictionary(container);
        var bindingDictionary1 = planner_1.getBindingDictionary(container1);
        var bindingDictionary2 = planner_1.getBindingDictionary(container2);
        function copyDictionary(origin, destination) {
            origin.traverse(function (key, value) {
                value.forEach(function (binding) {
                    destination.add(binding.serviceIdentifier, binding.clone());
                });
            });
        }
        copyDictionary(bindingDictionary1, bindingDictionary);
        copyDictionary(bindingDictionary2, bindingDictionary);
        return container;
    };
    Container.prototype.load = function () {
        var modules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            modules[_i] = arguments[_i];
        }
        var getHelpers = this._getContainerModuleHelpersFactory();
        for (var _a = 0, modules_1 = modules; _a < modules_1.length; _a++) {
            var currentModule = modules_1[_a];
            var containerModuleHelpers = getHelpers(currentModule.id);
            currentModule.registry(containerModuleHelpers.bindFunction, containerModuleHelpers.unbindFunction, containerModuleHelpers.isboundFunction, containerModuleHelpers.rebindFunction);
        }
    };
    Container.prototype.loadAsync = function () {
        var modules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            modules[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var getHelpers, _a, modules_2, currentModule, containerModuleHelpers;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        getHelpers = this._getContainerModuleHelpersFactory();
                        _a = 0, modules_2 = modules;
                        _b.label = 1;
                    case 1:
                        if (!(_a < modules_2.length)) return [3, 4];
                        currentModule = modules_2[_a];
                        containerModuleHelpers = getHelpers(currentModule.id);
                        return [4, currentModule.registry(containerModuleHelpers.bindFunction, containerModuleHelpers.unbindFunction, containerModuleHelpers.isboundFunction, containerModuleHelpers.rebindFunction)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _a++;
                        return [3, 1];
                    case 4: return [2];
                }
            });
        });
    };
    Container.prototype.unload = function () {
        var _this = this;
        var modules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            modules[_i] = arguments[_i];
        }
        var conditionFactory = function (expected) { return function (item) {
            return item.moduleId === expected;
        }; };
        modules.forEach(function (module) {
            var condition = conditionFactory(module.id);
            _this._bindingDictionary.removeByCondition(condition);
        });
    };
    Container.prototype.bind = function (serviceIdentifier) {
        var scope = this.options.defaultScope || literal_types_1.BindingScopeEnum.Transient;
        var binding = new binding_1.Binding(serviceIdentifier, scope);
        this._bindingDictionary.add(serviceIdentifier, binding);
        return new binding_to_syntax_1.BindingToSyntax(binding);
    };
    Container.prototype.rebind = function (serviceIdentifier) {
        this.unbind(serviceIdentifier);
        return this.bind(serviceIdentifier);
    };
    Container.prototype.unbind = function (serviceIdentifier) {
        try {
            this._bindingDictionary.remove(serviceIdentifier);
        }
        catch (e) {
            throw new Error(ERROR_MSGS.CANNOT_UNBIND + " " + serialization_1.getServiceIdentifierAsString(serviceIdentifier));
        }
    };
    Container.prototype.unbindAll = function () {
        this._bindingDictionary = new lookup_1.Lookup();
    };
    Container.prototype.isBound = function (serviceIdentifier) {
        var bound = this._bindingDictionary.hasKey(serviceIdentifier);
        if (!bound && this.parent) {
            bound = this.parent.isBound(serviceIdentifier);
        }
        return bound;
    };
    Container.prototype.isBoundNamed = function (serviceIdentifier, named) {
        return this.isBoundTagged(serviceIdentifier, METADATA_KEY.NAMED_TAG, named);
    };
    Container.prototype.isBoundTagged = function (serviceIdentifier, key, value) {
        var bound = false;
        if (this._bindingDictionary.hasKey(serviceIdentifier)) {
            var bindings = this._bindingDictionary.get(serviceIdentifier);
            var request_1 = planner_1.createMockRequest(this, serviceIdentifier, key, value);
            bound = bindings.some(function (b) { return b.constraint(request_1); });
        }
        if (!bound && this.parent) {
            bound = this.parent.isBoundTagged(serviceIdentifier, key, value);
        }
        return bound;
    };
    Container.prototype.snapshot = function () {
        this._snapshots.push(container_snapshot_1.ContainerSnapshot.of(this._bindingDictionary.clone(), this._middleware));
    };
    Container.prototype.restore = function () {
        var snapshot = this._snapshots.pop();
        if (snapshot === undefined) {
            throw new Error(ERROR_MSGS.NO_MORE_SNAPSHOTS_AVAILABLE);
        }
        this._bindingDictionary = snapshot.bindings;
        this._middleware = snapshot.middleware;
    };
    Container.prototype.createChild = function (containerOptions) {
        var child = new Container(containerOptions || this.options);
        child.parent = this;
        return child;
    };
    Container.prototype.applyMiddleware = function () {
        var middlewares = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            middlewares[_i] = arguments[_i];
        }
        var initial = (this._middleware) ? this._middleware : this._planAndResolve();
        this._middleware = middlewares.reduce(function (prev, curr) { return curr(prev); }, initial);
    };
    Container.prototype.applyCustomMetadataReader = function (metadataReader) {
        this._metadataReader = metadataReader;
    };
    Container.prototype.get = function (serviceIdentifier) {
        return this._get(false, false, literal_types_1.TargetTypeEnum.Variable, serviceIdentifier);
    };
    Container.prototype.getTagged = function (serviceIdentifier, key, value) {
        return this._get(false, false, literal_types_1.TargetTypeEnum.Variable, serviceIdentifier, key, value);
    };
    Container.prototype.getNamed = function (serviceIdentifier, named) {
        return this.getTagged(serviceIdentifier, METADATA_KEY.NAMED_TAG, named);
    };
    Container.prototype.getAll = function (serviceIdentifier) {
        return this._get(true, true, literal_types_1.TargetTypeEnum.Variable, serviceIdentifier);
    };
    Container.prototype.getAllTagged = function (serviceIdentifier, key, value) {
        return this._get(false, true, literal_types_1.TargetTypeEnum.Variable, serviceIdentifier, key, value);
    };
    Container.prototype.getAllNamed = function (serviceIdentifier, named) {
        return this.getAllTagged(serviceIdentifier, METADATA_KEY.NAMED_TAG, named);
    };
    Container.prototype.resolve = function (constructorFunction) {
        var tempContainer = this.createChild();
        tempContainer.bind(constructorFunction).toSelf();
        return tempContainer.get(constructorFunction);
    };
    Container.prototype._getContainerModuleHelpersFactory = function () {
        var _this = this;
        var setModuleId = function (bindingToSyntax, moduleId) {
            bindingToSyntax._binding.moduleId = moduleId;
        };
        var getBindFunction = function (moduleId) {
            return function (serviceIdentifier) {
                var _bind = _this.bind.bind(_this);
                var bindingToSyntax = _bind(serviceIdentifier);
                setModuleId(bindingToSyntax, moduleId);
                return bindingToSyntax;
            };
        };
        var getUnbindFunction = function (moduleId) {
            return function (serviceIdentifier) {
                var _unbind = _this.unbind.bind(_this);
                _unbind(serviceIdentifier);
            };
        };
        var getIsboundFunction = function (moduleId) {
            return function (serviceIdentifier) {
                var _isBound = _this.isBound.bind(_this);
                return _isBound(serviceIdentifier);
            };
        };
        var getRebindFunction = function (moduleId) {
            return function (serviceIdentifier) {
                var _rebind = _this.rebind.bind(_this);
                var bindingToSyntax = _rebind(serviceIdentifier);
                setModuleId(bindingToSyntax, moduleId);
                return bindingToSyntax;
            };
        };
        return function (mId) { return ({
            bindFunction: getBindFunction(mId),
            isboundFunction: getIsboundFunction(mId),
            rebindFunction: getRebindFunction(mId),
            unbindFunction: getUnbindFunction(mId)
        }); };
    };
    Container.prototype._get = function (avoidConstraints, isMultiInject, targetType, serviceIdentifier, key, value) {
        var result = null;
        var defaultArgs = {
            avoidConstraints: avoidConstraints,
            contextInterceptor: function (context) { return context; },
            isMultiInject: isMultiInject,
            key: key,
            serviceIdentifier: serviceIdentifier,
            targetType: targetType,
            value: value
        };
        if (this._middleware) {
            result = this._middleware(defaultArgs);
            if (result === undefined || result === null) {
                throw new Error(ERROR_MSGS.INVALID_MIDDLEWARE_RETURN);
            }
        }
        else {
            result = this._planAndResolve()(defaultArgs);
        }
        return result;
    };
    Container.prototype._planAndResolve = function () {
        var _this = this;
        return function (args) {
            var context = planner_1.plan(_this._metadataReader, _this, args.isMultiInject, args.targetType, args.serviceIdentifier, args.key, args.value, args.avoidConstraints);
            context = args.contextInterceptor(context);
            var result = resolver_1.resolve(context);
            return result;
        };
    };
    return Container;
}());
exports.Container = Container;


/***/ }),

/***/ "./node_modules/inversify/lib/container/container_module.js":
/*!******************************************************************!*\
  !*** ./node_modules/inversify/lib/container/container_module.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var id_1 = __webpack_require__(/*! ../utils/id */ "./node_modules/inversify/lib/utils/id.js");
var ContainerModule = (function () {
    function ContainerModule(registry) {
        this.id = id_1.id();
        this.registry = registry;
    }
    return ContainerModule;
}());
exports.ContainerModule = ContainerModule;
var AsyncContainerModule = (function () {
    function AsyncContainerModule(registry) {
        this.id = id_1.id();
        this.registry = registry;
    }
    return AsyncContainerModule;
}());
exports.AsyncContainerModule = AsyncContainerModule;


/***/ }),

/***/ "./node_modules/inversify/lib/container/container_snapshot.js":
/*!********************************************************************!*\
  !*** ./node_modules/inversify/lib/container/container_snapshot.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ContainerSnapshot = (function () {
    function ContainerSnapshot() {
    }
    ContainerSnapshot.of = function (bindings, middleware) {
        var snapshot = new ContainerSnapshot();
        snapshot.bindings = bindings;
        snapshot.middleware = middleware;
        return snapshot;
    };
    return ContainerSnapshot;
}());
exports.ContainerSnapshot = ContainerSnapshot;


/***/ }),

/***/ "./node_modules/inversify/lib/container/lookup.js":
/*!********************************************************!*\
  !*** ./node_modules/inversify/lib/container/lookup.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ERROR_MSGS = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
var Lookup = (function () {
    function Lookup() {
        this._map = new Map();
    }
    Lookup.prototype.getMap = function () {
        return this._map;
    };
    Lookup.prototype.add = function (serviceIdentifier, value) {
        if (serviceIdentifier === null || serviceIdentifier === undefined) {
            throw new Error(ERROR_MSGS.NULL_ARGUMENT);
        }
        if (value === null || value === undefined) {
            throw new Error(ERROR_MSGS.NULL_ARGUMENT);
        }
        var entry = this._map.get(serviceIdentifier);
        if (entry !== undefined) {
            entry.push(value);
            this._map.set(serviceIdentifier, entry);
        }
        else {
            this._map.set(serviceIdentifier, [value]);
        }
    };
    Lookup.prototype.get = function (serviceIdentifier) {
        if (serviceIdentifier === null || serviceIdentifier === undefined) {
            throw new Error(ERROR_MSGS.NULL_ARGUMENT);
        }
        var entry = this._map.get(serviceIdentifier);
        if (entry !== undefined) {
            return entry;
        }
        else {
            throw new Error(ERROR_MSGS.KEY_NOT_FOUND);
        }
    };
    Lookup.prototype.remove = function (serviceIdentifier) {
        if (serviceIdentifier === null || serviceIdentifier === undefined) {
            throw new Error(ERROR_MSGS.NULL_ARGUMENT);
        }
        if (!this._map.delete(serviceIdentifier)) {
            throw new Error(ERROR_MSGS.KEY_NOT_FOUND);
        }
    };
    Lookup.prototype.removeByCondition = function (condition) {
        var _this = this;
        this._map.forEach(function (entries, key) {
            var updatedEntries = entries.filter(function (entry) { return !condition(entry); });
            if (updatedEntries.length > 0) {
                _this._map.set(key, updatedEntries);
            }
            else {
                _this._map.delete(key);
            }
        });
    };
    Lookup.prototype.hasKey = function (serviceIdentifier) {
        if (serviceIdentifier === null || serviceIdentifier === undefined) {
            throw new Error(ERROR_MSGS.NULL_ARGUMENT);
        }
        return this._map.has(serviceIdentifier);
    };
    Lookup.prototype.clone = function () {
        var copy = new Lookup();
        this._map.forEach(function (value, key) {
            value.forEach(function (b) { return copy.add(key, b.clone()); });
        });
        return copy;
    };
    Lookup.prototype.traverse = function (func) {
        this._map.forEach(function (value, key) {
            func(key, value);
        });
    };
    return Lookup;
}());
exports.Lookup = Lookup;


/***/ }),

/***/ "./node_modules/inversify/lib/inversify.js":
/*!*************************************************!*\
  !*** ./node_modules/inversify/lib/inversify.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var keys = __webpack_require__(/*! ./constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
exports.METADATA_KEY = keys;
var container_1 = __webpack_require__(/*! ./container/container */ "./node_modules/inversify/lib/container/container.js");
exports.Container = container_1.Container;
var literal_types_1 = __webpack_require__(/*! ./constants/literal_types */ "./node_modules/inversify/lib/constants/literal_types.js");
exports.BindingScopeEnum = literal_types_1.BindingScopeEnum;
exports.BindingTypeEnum = literal_types_1.BindingTypeEnum;
exports.TargetTypeEnum = literal_types_1.TargetTypeEnum;
var container_module_1 = __webpack_require__(/*! ./container/container_module */ "./node_modules/inversify/lib/container/container_module.js");
exports.AsyncContainerModule = container_module_1.AsyncContainerModule;
exports.ContainerModule = container_module_1.ContainerModule;
var injectable_1 = __webpack_require__(/*! ./annotation/injectable */ "./node_modules/inversify/lib/annotation/injectable.js");
exports.injectable = injectable_1.injectable;
var tagged_1 = __webpack_require__(/*! ./annotation/tagged */ "./node_modules/inversify/lib/annotation/tagged.js");
exports.tagged = tagged_1.tagged;
var named_1 = __webpack_require__(/*! ./annotation/named */ "./node_modules/inversify/lib/annotation/named.js");
exports.named = named_1.named;
var inject_1 = __webpack_require__(/*! ./annotation/inject */ "./node_modules/inversify/lib/annotation/inject.js");
exports.inject = inject_1.inject;
exports.LazyServiceIdentifer = inject_1.LazyServiceIdentifer;
var optional_1 = __webpack_require__(/*! ./annotation/optional */ "./node_modules/inversify/lib/annotation/optional.js");
exports.optional = optional_1.optional;
var unmanaged_1 = __webpack_require__(/*! ./annotation/unmanaged */ "./node_modules/inversify/lib/annotation/unmanaged.js");
exports.unmanaged = unmanaged_1.unmanaged;
var multi_inject_1 = __webpack_require__(/*! ./annotation/multi_inject */ "./node_modules/inversify/lib/annotation/multi_inject.js");
exports.multiInject = multi_inject_1.multiInject;
var target_name_1 = __webpack_require__(/*! ./annotation/target_name */ "./node_modules/inversify/lib/annotation/target_name.js");
exports.targetName = target_name_1.targetName;
var post_construct_1 = __webpack_require__(/*! ./annotation/post_construct */ "./node_modules/inversify/lib/annotation/post_construct.js");
exports.postConstruct = post_construct_1.postConstruct;
var metadata_reader_1 = __webpack_require__(/*! ./planning/metadata_reader */ "./node_modules/inversify/lib/planning/metadata_reader.js");
exports.MetadataReader = metadata_reader_1.MetadataReader;
var id_1 = __webpack_require__(/*! ./utils/id */ "./node_modules/inversify/lib/utils/id.js");
exports.id = id_1.id;
var decorator_utils_1 = __webpack_require__(/*! ./annotation/decorator_utils */ "./node_modules/inversify/lib/annotation/decorator_utils.js");
exports.decorate = decorator_utils_1.decorate;
var constraint_helpers_1 = __webpack_require__(/*! ./syntax/constraint_helpers */ "./node_modules/inversify/lib/syntax/constraint_helpers.js");
exports.traverseAncerstors = constraint_helpers_1.traverseAncerstors;
exports.taggedConstraint = constraint_helpers_1.taggedConstraint;
exports.namedConstraint = constraint_helpers_1.namedConstraint;
exports.typeConstraint = constraint_helpers_1.typeConstraint;
var serialization_1 = __webpack_require__(/*! ./utils/serialization */ "./node_modules/inversify/lib/utils/serialization.js");
exports.getServiceIdentifierAsString = serialization_1.getServiceIdentifierAsString;
var binding_utils_1 = __webpack_require__(/*! ./utils/binding_utils */ "./node_modules/inversify/lib/utils/binding_utils.js");
exports.multiBindToService = binding_utils_1.multiBindToService;


/***/ }),

/***/ "./node_modules/inversify/lib/planning/context.js":
/*!********************************************************!*\
  !*** ./node_modules/inversify/lib/planning/context.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var id_1 = __webpack_require__(/*! ../utils/id */ "./node_modules/inversify/lib/utils/id.js");
var Context = (function () {
    function Context(container) {
        this.id = id_1.id();
        this.container = container;
    }
    Context.prototype.addPlan = function (plan) {
        this.plan = plan;
    };
    Context.prototype.setCurrentRequest = function (currentRequest) {
        this.currentRequest = currentRequest;
    };
    return Context;
}());
exports.Context = Context;


/***/ }),

/***/ "./node_modules/inversify/lib/planning/metadata.js":
/*!*********************************************************!*\
  !*** ./node_modules/inversify/lib/planning/metadata.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var Metadata = (function () {
    function Metadata(key, value) {
        this.key = key;
        this.value = value;
    }
    Metadata.prototype.toString = function () {
        if (this.key === METADATA_KEY.NAMED_TAG) {
            return "named: " + this.value.toString() + " ";
        }
        else {
            return "tagged: { key:" + this.key.toString() + ", value: " + this.value + " }";
        }
    };
    return Metadata;
}());
exports.Metadata = Metadata;


/***/ }),

/***/ "./node_modules/inversify/lib/planning/metadata_reader.js":
/*!****************************************************************!*\
  !*** ./node_modules/inversify/lib/planning/metadata_reader.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var MetadataReader = (function () {
    function MetadataReader() {
    }
    MetadataReader.prototype.getConstructorMetadata = function (constructorFunc) {
        var compilerGeneratedMetadata = Reflect.getMetadata(METADATA_KEY.PARAM_TYPES, constructorFunc);
        var userGeneratedMetadata = Reflect.getMetadata(METADATA_KEY.TAGGED, constructorFunc);
        return {
            compilerGeneratedMetadata: compilerGeneratedMetadata,
            userGeneratedMetadata: userGeneratedMetadata || {}
        };
    };
    MetadataReader.prototype.getPropertiesMetadata = function (constructorFunc) {
        var userGeneratedMetadata = Reflect.getMetadata(METADATA_KEY.TAGGED_PROP, constructorFunc) || [];
        return userGeneratedMetadata;
    };
    return MetadataReader;
}());
exports.MetadataReader = MetadataReader;


/***/ }),

/***/ "./node_modules/inversify/lib/planning/plan.js":
/*!*****************************************************!*\
  !*** ./node_modules/inversify/lib/planning/plan.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Plan = (function () {
    function Plan(parentContext, rootRequest) {
        this.parentContext = parentContext;
        this.rootRequest = rootRequest;
    }
    return Plan;
}());
exports.Plan = Plan;


/***/ }),

/***/ "./node_modules/inversify/lib/planning/planner.js":
/*!********************************************************!*\
  !*** ./node_modules/inversify/lib/planning/planner.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var binding_count_1 = __webpack_require__(/*! ../bindings/binding_count */ "./node_modules/inversify/lib/bindings/binding_count.js");
var ERROR_MSGS = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
var literal_types_1 = __webpack_require__(/*! ../constants/literal_types */ "./node_modules/inversify/lib/constants/literal_types.js");
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var exceptions_1 = __webpack_require__(/*! ../utils/exceptions */ "./node_modules/inversify/lib/utils/exceptions.js");
var serialization_1 = __webpack_require__(/*! ../utils/serialization */ "./node_modules/inversify/lib/utils/serialization.js");
var context_1 = __webpack_require__(/*! ./context */ "./node_modules/inversify/lib/planning/context.js");
var metadata_1 = __webpack_require__(/*! ./metadata */ "./node_modules/inversify/lib/planning/metadata.js");
var plan_1 = __webpack_require__(/*! ./plan */ "./node_modules/inversify/lib/planning/plan.js");
var reflection_utils_1 = __webpack_require__(/*! ./reflection_utils */ "./node_modules/inversify/lib/planning/reflection_utils.js");
var request_1 = __webpack_require__(/*! ./request */ "./node_modules/inversify/lib/planning/request.js");
var target_1 = __webpack_require__(/*! ./target */ "./node_modules/inversify/lib/planning/target.js");
function getBindingDictionary(cntnr) {
    return cntnr._bindingDictionary;
}
exports.getBindingDictionary = getBindingDictionary;
function _createTarget(isMultiInject, targetType, serviceIdentifier, name, key, value) {
    var metadataKey = isMultiInject ? METADATA_KEY.MULTI_INJECT_TAG : METADATA_KEY.INJECT_TAG;
    var injectMetadata = new metadata_1.Metadata(metadataKey, serviceIdentifier);
    var target = new target_1.Target(targetType, name, serviceIdentifier, injectMetadata);
    if (key !== undefined) {
        var tagMetadata = new metadata_1.Metadata(key, value);
        target.metadata.push(tagMetadata);
    }
    return target;
}
function _getActiveBindings(metadataReader, avoidConstraints, context, parentRequest, target) {
    var bindings = getBindings(context.container, target.serviceIdentifier);
    var activeBindings = [];
    if (bindings.length === binding_count_1.BindingCount.NoBindingsAvailable &&
        context.container.options.autoBindInjectable &&
        typeof target.serviceIdentifier === "function" &&
        metadataReader.getConstructorMetadata(target.serviceIdentifier).compilerGeneratedMetadata) {
        context.container.bind(target.serviceIdentifier).toSelf();
        bindings = getBindings(context.container, target.serviceIdentifier);
    }
    if (!avoidConstraints) {
        activeBindings = bindings.filter(function (binding) {
            var request = new request_1.Request(binding.serviceIdentifier, context, parentRequest, binding, target);
            return binding.constraint(request);
        });
    }
    else {
        activeBindings = bindings;
    }
    _validateActiveBindingCount(target.serviceIdentifier, activeBindings, target, context.container);
    return activeBindings;
}
function _validateActiveBindingCount(serviceIdentifier, bindings, target, container) {
    switch (bindings.length) {
        case binding_count_1.BindingCount.NoBindingsAvailable:
            if (target.isOptional()) {
                return bindings;
            }
            else {
                var serviceIdentifierString = serialization_1.getServiceIdentifierAsString(serviceIdentifier);
                var msg = ERROR_MSGS.NOT_REGISTERED;
                msg += serialization_1.listMetadataForTarget(serviceIdentifierString, target);
                msg += serialization_1.listRegisteredBindingsForServiceIdentifier(container, serviceIdentifierString, getBindings);
                throw new Error(msg);
            }
        case binding_count_1.BindingCount.OnlyOneBindingAvailable:
            if (!target.isArray()) {
                return bindings;
            }
        case binding_count_1.BindingCount.MultipleBindingsAvailable:
        default:
            if (!target.isArray()) {
                var serviceIdentifierString = serialization_1.getServiceIdentifierAsString(serviceIdentifier);
                var msg = ERROR_MSGS.AMBIGUOUS_MATCH + " " + serviceIdentifierString;
                msg += serialization_1.listRegisteredBindingsForServiceIdentifier(container, serviceIdentifierString, getBindings);
                throw new Error(msg);
            }
            else {
                return bindings;
            }
    }
}
function _createSubRequests(metadataReader, avoidConstraints, serviceIdentifier, context, parentRequest, target) {
    var activeBindings;
    var childRequest;
    if (parentRequest === null) {
        activeBindings = _getActiveBindings(metadataReader, avoidConstraints, context, null, target);
        childRequest = new request_1.Request(serviceIdentifier, context, null, activeBindings, target);
        var thePlan = new plan_1.Plan(context, childRequest);
        context.addPlan(thePlan);
    }
    else {
        activeBindings = _getActiveBindings(metadataReader, avoidConstraints, context, parentRequest, target);
        childRequest = parentRequest.addChildRequest(target.serviceIdentifier, activeBindings, target);
    }
    activeBindings.forEach(function (binding) {
        var subChildRequest = null;
        if (target.isArray()) {
            subChildRequest = childRequest.addChildRequest(binding.serviceIdentifier, binding, target);
        }
        else {
            if (binding.cache) {
                return;
            }
            subChildRequest = childRequest;
        }
        if (binding.type === literal_types_1.BindingTypeEnum.Instance && binding.implementationType !== null) {
            var dependencies = reflection_utils_1.getDependencies(metadataReader, binding.implementationType);
            if (!context.container.options.skipBaseClassChecks) {
                var baseClassDependencyCount = reflection_utils_1.getBaseClassDependencyCount(metadataReader, binding.implementationType);
                if (dependencies.length < baseClassDependencyCount) {
                    var error = ERROR_MSGS.ARGUMENTS_LENGTH_MISMATCH(reflection_utils_1.getFunctionName(binding.implementationType));
                    throw new Error(error);
                }
            }
            dependencies.forEach(function (dependency) {
                _createSubRequests(metadataReader, false, dependency.serviceIdentifier, context, subChildRequest, dependency);
            });
        }
    });
}
function getBindings(container, serviceIdentifier) {
    var bindings = [];
    var bindingDictionary = getBindingDictionary(container);
    if (bindingDictionary.hasKey(serviceIdentifier)) {
        bindings = bindingDictionary.get(serviceIdentifier);
    }
    else if (container.parent !== null) {
        bindings = getBindings(container.parent, serviceIdentifier);
    }
    return bindings;
}
function plan(metadataReader, container, isMultiInject, targetType, serviceIdentifier, key, value, avoidConstraints) {
    if (avoidConstraints === void 0) { avoidConstraints = false; }
    var context = new context_1.Context(container);
    var target = _createTarget(isMultiInject, targetType, serviceIdentifier, "", key, value);
    try {
        _createSubRequests(metadataReader, avoidConstraints, serviceIdentifier, context, null, target);
        return context;
    }
    catch (error) {
        if (exceptions_1.isStackOverflowExeption(error)) {
            if (context.plan) {
                serialization_1.circularDependencyToException(context.plan.rootRequest);
            }
        }
        throw error;
    }
}
exports.plan = plan;
function createMockRequest(container, serviceIdentifier, key, value) {
    var target = new target_1.Target(literal_types_1.TargetTypeEnum.Variable, "", serviceIdentifier, new metadata_1.Metadata(key, value));
    var context = new context_1.Context(container);
    var request = new request_1.Request(serviceIdentifier, context, null, [], target);
    return request;
}
exports.createMockRequest = createMockRequest;


/***/ }),

/***/ "./node_modules/inversify/lib/planning/queryable_string.js":
/*!*****************************************************************!*\
  !*** ./node_modules/inversify/lib/planning/queryable_string.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var QueryableString = (function () {
    function QueryableString(str) {
        this.str = str;
    }
    QueryableString.prototype.startsWith = function (searchString) {
        return this.str.indexOf(searchString) === 0;
    };
    QueryableString.prototype.endsWith = function (searchString) {
        var reverseString = "";
        var reverseSearchString = searchString.split("").reverse().join("");
        reverseString = this.str.split("").reverse().join("");
        return this.startsWith.call({ str: reverseString }, reverseSearchString);
    };
    QueryableString.prototype.contains = function (searchString) {
        return (this.str.indexOf(searchString) !== -1);
    };
    QueryableString.prototype.equals = function (compareString) {
        return this.str === compareString;
    };
    QueryableString.prototype.value = function () {
        return this.str;
    };
    return QueryableString;
}());
exports.QueryableString = QueryableString;


/***/ }),

/***/ "./node_modules/inversify/lib/planning/reflection_utils.js":
/*!*****************************************************************!*\
  !*** ./node_modules/inversify/lib/planning/reflection_utils.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var inject_1 = __webpack_require__(/*! ../annotation/inject */ "./node_modules/inversify/lib/annotation/inject.js");
var ERROR_MSGS = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
var literal_types_1 = __webpack_require__(/*! ../constants/literal_types */ "./node_modules/inversify/lib/constants/literal_types.js");
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var serialization_1 = __webpack_require__(/*! ../utils/serialization */ "./node_modules/inversify/lib/utils/serialization.js");
exports.getFunctionName = serialization_1.getFunctionName;
var target_1 = __webpack_require__(/*! ./target */ "./node_modules/inversify/lib/planning/target.js");
function getDependencies(metadataReader, func) {
    var constructorName = serialization_1.getFunctionName(func);
    var targets = getTargets(metadataReader, constructorName, func, false);
    return targets;
}
exports.getDependencies = getDependencies;
function getTargets(metadataReader, constructorName, func, isBaseClass) {
    var metadata = metadataReader.getConstructorMetadata(func);
    var serviceIdentifiers = metadata.compilerGeneratedMetadata;
    if (serviceIdentifiers === undefined) {
        var msg = ERROR_MSGS.MISSING_INJECTABLE_ANNOTATION + " " + constructorName + ".";
        throw new Error(msg);
    }
    var constructorArgsMetadata = metadata.userGeneratedMetadata;
    var keys = Object.keys(constructorArgsMetadata);
    var hasUserDeclaredUnknownInjections = (func.length === 0 && keys.length > 0);
    var iterations = (hasUserDeclaredUnknownInjections) ? keys.length : func.length;
    var constructorTargets = getConstructorArgsAsTargets(isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata, iterations);
    var propertyTargets = getClassPropsAsTargets(metadataReader, func);
    var targets = constructorTargets.concat(propertyTargets);
    return targets;
}
function getConstructorArgsAsTarget(index, isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata) {
    var targetMetadata = constructorArgsMetadata[index.toString()] || [];
    var metadata = formatTargetMetadata(targetMetadata);
    var isManaged = metadata.unmanaged !== true;
    var serviceIdentifier = serviceIdentifiers[index];
    var injectIdentifier = (metadata.inject || metadata.multiInject);
    serviceIdentifier = (injectIdentifier) ? (injectIdentifier) : serviceIdentifier;
    if (serviceIdentifier instanceof inject_1.LazyServiceIdentifer) {
        serviceIdentifier = serviceIdentifier.unwrap();
    }
    if (isManaged) {
        var isObject = serviceIdentifier === Object;
        var isFunction = serviceIdentifier === Function;
        var isUndefined = serviceIdentifier === undefined;
        var isUnknownType = (isObject || isFunction || isUndefined);
        if (!isBaseClass && isUnknownType) {
            var msg = ERROR_MSGS.MISSING_INJECT_ANNOTATION + " argument " + index + " in class " + constructorName + ".";
            throw new Error(msg);
        }
        var target = new target_1.Target(literal_types_1.TargetTypeEnum.ConstructorArgument, metadata.targetName, serviceIdentifier);
        target.metadata = targetMetadata;
        return target;
    }
    return null;
}
function getConstructorArgsAsTargets(isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata, iterations) {
    var targets = [];
    for (var i = 0; i < iterations; i++) {
        var index = i;
        var target = getConstructorArgsAsTarget(index, isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata);
        if (target !== null) {
            targets.push(target);
        }
    }
    return targets;
}
function getClassPropsAsTargets(metadataReader, constructorFunc) {
    var classPropsMetadata = metadataReader.getPropertiesMetadata(constructorFunc);
    var targets = [];
    var keys = Object.keys(classPropsMetadata);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var targetMetadata = classPropsMetadata[key];
        var metadata = formatTargetMetadata(classPropsMetadata[key]);
        var targetName = metadata.targetName || key;
        var serviceIdentifier = (metadata.inject || metadata.multiInject);
        var target = new target_1.Target(literal_types_1.TargetTypeEnum.ClassProperty, targetName, serviceIdentifier);
        target.metadata = targetMetadata;
        targets.push(target);
    }
    var baseConstructor = Object.getPrototypeOf(constructorFunc.prototype).constructor;
    if (baseConstructor !== Object) {
        var baseTargets = getClassPropsAsTargets(metadataReader, baseConstructor);
        targets = targets.concat(baseTargets);
    }
    return targets;
}
function getBaseClassDependencyCount(metadataReader, func) {
    var baseConstructor = Object.getPrototypeOf(func.prototype).constructor;
    if (baseConstructor !== Object) {
        var baseConstructorName = serialization_1.getFunctionName(baseConstructor);
        var targets = getTargets(metadataReader, baseConstructorName, baseConstructor, true);
        var metadata = targets.map(function (t) {
            return t.metadata.filter(function (m) {
                return m.key === METADATA_KEY.UNMANAGED_TAG;
            });
        });
        var unmanagedCount = [].concat.apply([], metadata).length;
        var dependencyCount = targets.length - unmanagedCount;
        if (dependencyCount > 0) {
            return dependencyCount;
        }
        else {
            return getBaseClassDependencyCount(metadataReader, baseConstructor);
        }
    }
    else {
        return 0;
    }
}
exports.getBaseClassDependencyCount = getBaseClassDependencyCount;
function formatTargetMetadata(targetMetadata) {
    var targetMetadataMap = {};
    targetMetadata.forEach(function (m) {
        targetMetadataMap[m.key.toString()] = m.value;
    });
    return {
        inject: targetMetadataMap[METADATA_KEY.INJECT_TAG],
        multiInject: targetMetadataMap[METADATA_KEY.MULTI_INJECT_TAG],
        targetName: targetMetadataMap[METADATA_KEY.NAME_TAG],
        unmanaged: targetMetadataMap[METADATA_KEY.UNMANAGED_TAG]
    };
}


/***/ }),

/***/ "./node_modules/inversify/lib/planning/request.js":
/*!********************************************************!*\
  !*** ./node_modules/inversify/lib/planning/request.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var id_1 = __webpack_require__(/*! ../utils/id */ "./node_modules/inversify/lib/utils/id.js");
var Request = (function () {
    function Request(serviceIdentifier, parentContext, parentRequest, bindings, target) {
        this.id = id_1.id();
        this.serviceIdentifier = serviceIdentifier;
        this.parentContext = parentContext;
        this.parentRequest = parentRequest;
        this.target = target;
        this.childRequests = [];
        this.bindings = (Array.isArray(bindings) ? bindings : [bindings]);
        this.requestScope = parentRequest === null
            ? new Map()
            : null;
    }
    Request.prototype.addChildRequest = function (serviceIdentifier, bindings, target) {
        var child = new Request(serviceIdentifier, this.parentContext, this, bindings, target);
        this.childRequests.push(child);
        return child;
    };
    return Request;
}());
exports.Request = Request;


/***/ }),

/***/ "./node_modules/inversify/lib/planning/target.js":
/*!*******************************************************!*\
  !*** ./node_modules/inversify/lib/planning/target.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var id_1 = __webpack_require__(/*! ../utils/id */ "./node_modules/inversify/lib/utils/id.js");
var metadata_1 = __webpack_require__(/*! ./metadata */ "./node_modules/inversify/lib/planning/metadata.js");
var queryable_string_1 = __webpack_require__(/*! ./queryable_string */ "./node_modules/inversify/lib/planning/queryable_string.js");
var Target = (function () {
    function Target(type, name, serviceIdentifier, namedOrTagged) {
        this.id = id_1.id();
        this.type = type;
        this.serviceIdentifier = serviceIdentifier;
        this.name = new queryable_string_1.QueryableString(name || "");
        this.metadata = new Array();
        var metadataItem = null;
        if (typeof namedOrTagged === "string") {
            metadataItem = new metadata_1.Metadata(METADATA_KEY.NAMED_TAG, namedOrTagged);
        }
        else if (namedOrTagged instanceof metadata_1.Metadata) {
            metadataItem = namedOrTagged;
        }
        if (metadataItem !== null) {
            this.metadata.push(metadataItem);
        }
    }
    Target.prototype.hasTag = function (key) {
        for (var _i = 0, _a = this.metadata; _i < _a.length; _i++) {
            var m = _a[_i];
            if (m.key === key) {
                return true;
            }
        }
        return false;
    };
    Target.prototype.isArray = function () {
        return this.hasTag(METADATA_KEY.MULTI_INJECT_TAG);
    };
    Target.prototype.matchesArray = function (name) {
        return this.matchesTag(METADATA_KEY.MULTI_INJECT_TAG)(name);
    };
    Target.prototype.isNamed = function () {
        return this.hasTag(METADATA_KEY.NAMED_TAG);
    };
    Target.prototype.isTagged = function () {
        return this.metadata.some(function (m) {
            return (m.key !== METADATA_KEY.INJECT_TAG) &&
                (m.key !== METADATA_KEY.MULTI_INJECT_TAG) &&
                (m.key !== METADATA_KEY.NAME_TAG) &&
                (m.key !== METADATA_KEY.UNMANAGED_TAG) &&
                (m.key !== METADATA_KEY.NAMED_TAG);
        });
    };
    Target.prototype.isOptional = function () {
        return this.matchesTag(METADATA_KEY.OPTIONAL_TAG)(true);
    };
    Target.prototype.getNamedTag = function () {
        if (this.isNamed()) {
            return this.metadata.filter(function (m) { return m.key === METADATA_KEY.NAMED_TAG; })[0];
        }
        return null;
    };
    Target.prototype.getCustomTags = function () {
        if (this.isTagged()) {
            return this.metadata.filter(function (m) {
                return (m.key !== METADATA_KEY.INJECT_TAG) &&
                    (m.key !== METADATA_KEY.MULTI_INJECT_TAG) &&
                    (m.key !== METADATA_KEY.NAME_TAG) &&
                    (m.key !== METADATA_KEY.UNMANAGED_TAG) &&
                    (m.key !== METADATA_KEY.NAMED_TAG);
            });
        }
        return null;
    };
    Target.prototype.matchesNamedTag = function (name) {
        return this.matchesTag(METADATA_KEY.NAMED_TAG)(name);
    };
    Target.prototype.matchesTag = function (key) {
        var _this = this;
        return function (value) {
            for (var _i = 0, _a = _this.metadata; _i < _a.length; _i++) {
                var m = _a[_i];
                if (m.key === key && m.value === value) {
                    return true;
                }
            }
            return false;
        };
    };
    return Target;
}());
exports.Target = Target;


/***/ }),

/***/ "./node_modules/inversify/lib/resolution/instantiation.js":
/*!****************************************************************!*\
  !*** ./node_modules/inversify/lib/resolution/instantiation.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var error_msgs_1 = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
var literal_types_1 = __webpack_require__(/*! ../constants/literal_types */ "./node_modules/inversify/lib/constants/literal_types.js");
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
function _injectProperties(instance, childRequests, resolveRequest) {
    var propertyInjectionsRequests = childRequests.filter(function (childRequest) {
        return (childRequest.target !== null &&
            childRequest.target.type === literal_types_1.TargetTypeEnum.ClassProperty);
    });
    var propertyInjections = propertyInjectionsRequests.map(resolveRequest);
    propertyInjectionsRequests.forEach(function (r, index) {
        var propertyName = "";
        propertyName = r.target.name.value();
        var injection = propertyInjections[index];
        instance[propertyName] = injection;
    });
    return instance;
}
function _createInstance(Func, injections) {
    return new (Func.bind.apply(Func, [void 0].concat(injections)))();
}
function _postConstruct(constr, result) {
    if (Reflect.hasMetadata(METADATA_KEY.POST_CONSTRUCT, constr)) {
        var data = Reflect.getMetadata(METADATA_KEY.POST_CONSTRUCT, constr);
        try {
            result[data.value]();
        }
        catch (e) {
            throw new Error(error_msgs_1.POST_CONSTRUCT_ERROR(constr.name, e.message));
        }
    }
}
function resolveInstance(constr, childRequests, resolveRequest) {
    var result = null;
    if (childRequests.length > 0) {
        var constructorInjectionsRequests = childRequests.filter(function (childRequest) {
            return (childRequest.target !== null && childRequest.target.type === literal_types_1.TargetTypeEnum.ConstructorArgument);
        });
        var constructorInjections = constructorInjectionsRequests.map(resolveRequest);
        result = _createInstance(constr, constructorInjections);
        result = _injectProperties(result, childRequests, resolveRequest);
    }
    else {
        result = new constr();
    }
    _postConstruct(constr, result);
    return result;
}
exports.resolveInstance = resolveInstance;


/***/ }),

/***/ "./node_modules/inversify/lib/resolution/resolver.js":
/*!***********************************************************!*\
  !*** ./node_modules/inversify/lib/resolution/resolver.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ERROR_MSGS = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
var literal_types_1 = __webpack_require__(/*! ../constants/literal_types */ "./node_modules/inversify/lib/constants/literal_types.js");
var exceptions_1 = __webpack_require__(/*! ../utils/exceptions */ "./node_modules/inversify/lib/utils/exceptions.js");
var serialization_1 = __webpack_require__(/*! ../utils/serialization */ "./node_modules/inversify/lib/utils/serialization.js");
var instantiation_1 = __webpack_require__(/*! ./instantiation */ "./node_modules/inversify/lib/resolution/instantiation.js");
var invokeFactory = function (factoryType, serviceIdentifier, fn) {
    try {
        return fn();
    }
    catch (error) {
        if (exceptions_1.isStackOverflowExeption(error)) {
            throw new Error(ERROR_MSGS.CIRCULAR_DEPENDENCY_IN_FACTORY(factoryType, serviceIdentifier.toString()));
        }
        else {
            throw error;
        }
    }
};
var _resolveRequest = function (requestScope) {
    return function (request) {
        request.parentContext.setCurrentRequest(request);
        var bindings = request.bindings;
        var childRequests = request.childRequests;
        var targetIsAnArray = request.target && request.target.isArray();
        var targetParentIsNotAnArray = !request.parentRequest ||
            !request.parentRequest.target ||
            !request.target ||
            !request.parentRequest.target.matchesArray(request.target.serviceIdentifier);
        if (targetIsAnArray && targetParentIsNotAnArray) {
            return childRequests.map(function (childRequest) {
                var _f = _resolveRequest(requestScope);
                return _f(childRequest);
            });
        }
        else {
            var result = null;
            if (request.target.isOptional() && bindings.length === 0) {
                return undefined;
            }
            var binding_1 = bindings[0];
            var isSingleton = binding_1.scope === literal_types_1.BindingScopeEnum.Singleton;
            var isRequestSingleton = binding_1.scope === literal_types_1.BindingScopeEnum.Request;
            if (isSingleton && binding_1.activated) {
                return binding_1.cache;
            }
            if (isRequestSingleton &&
                requestScope !== null &&
                requestScope.has(binding_1.id)) {
                return requestScope.get(binding_1.id);
            }
            if (binding_1.type === literal_types_1.BindingTypeEnum.ConstantValue) {
                result = binding_1.cache;
            }
            else if (binding_1.type === literal_types_1.BindingTypeEnum.Function) {
                result = binding_1.cache;
            }
            else if (binding_1.type === literal_types_1.BindingTypeEnum.Constructor) {
                result = binding_1.implementationType;
            }
            else if (binding_1.type === literal_types_1.BindingTypeEnum.DynamicValue && binding_1.dynamicValue !== null) {
                result = invokeFactory("toDynamicValue", binding_1.serviceIdentifier, function () { return binding_1.dynamicValue(request.parentContext); });
            }
            else if (binding_1.type === literal_types_1.BindingTypeEnum.Factory && binding_1.factory !== null) {
                result = invokeFactory("toFactory", binding_1.serviceIdentifier, function () { return binding_1.factory(request.parentContext); });
            }
            else if (binding_1.type === literal_types_1.BindingTypeEnum.Provider && binding_1.provider !== null) {
                result = invokeFactory("toProvider", binding_1.serviceIdentifier, function () { return binding_1.provider(request.parentContext); });
            }
            else if (binding_1.type === literal_types_1.BindingTypeEnum.Instance && binding_1.implementationType !== null) {
                result = instantiation_1.resolveInstance(binding_1.implementationType, childRequests, _resolveRequest(requestScope));
            }
            else {
                var serviceIdentifier = serialization_1.getServiceIdentifierAsString(request.serviceIdentifier);
                throw new Error(ERROR_MSGS.INVALID_BINDING_TYPE + " " + serviceIdentifier);
            }
            if (typeof binding_1.onActivation === "function") {
                result = binding_1.onActivation(request.parentContext, result);
            }
            if (isSingleton) {
                binding_1.cache = result;
                binding_1.activated = true;
            }
            if (isRequestSingleton &&
                requestScope !== null &&
                !requestScope.has(binding_1.id)) {
                requestScope.set(binding_1.id, result);
            }
            return result;
        }
    };
};
function resolve(context) {
    var _f = _resolveRequest(context.plan.rootRequest.requestScope);
    return _f(context.plan.rootRequest);
}
exports.resolve = resolve;


/***/ }),

/***/ "./node_modules/inversify/lib/syntax/binding_in_syntax.js":
/*!****************************************************************!*\
  !*** ./node_modules/inversify/lib/syntax/binding_in_syntax.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var literal_types_1 = __webpack_require__(/*! ../constants/literal_types */ "./node_modules/inversify/lib/constants/literal_types.js");
var binding_when_on_syntax_1 = __webpack_require__(/*! ./binding_when_on_syntax */ "./node_modules/inversify/lib/syntax/binding_when_on_syntax.js");
var BindingInSyntax = (function () {
    function BindingInSyntax(binding) {
        this._binding = binding;
    }
    BindingInSyntax.prototype.inRequestScope = function () {
        this._binding.scope = literal_types_1.BindingScopeEnum.Request;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
    };
    BindingInSyntax.prototype.inSingletonScope = function () {
        this._binding.scope = literal_types_1.BindingScopeEnum.Singleton;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
    };
    BindingInSyntax.prototype.inTransientScope = function () {
        this._binding.scope = literal_types_1.BindingScopeEnum.Transient;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
    };
    return BindingInSyntax;
}());
exports.BindingInSyntax = BindingInSyntax;


/***/ }),

/***/ "./node_modules/inversify/lib/syntax/binding_in_when_on_syntax.js":
/*!************************************************************************!*\
  !*** ./node_modules/inversify/lib/syntax/binding_in_when_on_syntax.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var binding_in_syntax_1 = __webpack_require__(/*! ./binding_in_syntax */ "./node_modules/inversify/lib/syntax/binding_in_syntax.js");
var binding_on_syntax_1 = __webpack_require__(/*! ./binding_on_syntax */ "./node_modules/inversify/lib/syntax/binding_on_syntax.js");
var binding_when_syntax_1 = __webpack_require__(/*! ./binding_when_syntax */ "./node_modules/inversify/lib/syntax/binding_when_syntax.js");
var BindingInWhenOnSyntax = (function () {
    function BindingInWhenOnSyntax(binding) {
        this._binding = binding;
        this._bindingWhenSyntax = new binding_when_syntax_1.BindingWhenSyntax(this._binding);
        this._bindingOnSyntax = new binding_on_syntax_1.BindingOnSyntax(this._binding);
        this._bindingInSyntax = new binding_in_syntax_1.BindingInSyntax(binding);
    }
    BindingInWhenOnSyntax.prototype.inRequestScope = function () {
        return this._bindingInSyntax.inRequestScope();
    };
    BindingInWhenOnSyntax.prototype.inSingletonScope = function () {
        return this._bindingInSyntax.inSingletonScope();
    };
    BindingInWhenOnSyntax.prototype.inTransientScope = function () {
        return this._bindingInSyntax.inTransientScope();
    };
    BindingInWhenOnSyntax.prototype.when = function (constraint) {
        return this._bindingWhenSyntax.when(constraint);
    };
    BindingInWhenOnSyntax.prototype.whenTargetNamed = function (name) {
        return this._bindingWhenSyntax.whenTargetNamed(name);
    };
    BindingInWhenOnSyntax.prototype.whenTargetIsDefault = function () {
        return this._bindingWhenSyntax.whenTargetIsDefault();
    };
    BindingInWhenOnSyntax.prototype.whenTargetTagged = function (tag, value) {
        return this._bindingWhenSyntax.whenTargetTagged(tag, value);
    };
    BindingInWhenOnSyntax.prototype.whenInjectedInto = function (parent) {
        return this._bindingWhenSyntax.whenInjectedInto(parent);
    };
    BindingInWhenOnSyntax.prototype.whenParentNamed = function (name) {
        return this._bindingWhenSyntax.whenParentNamed(name);
    };
    BindingInWhenOnSyntax.prototype.whenParentTagged = function (tag, value) {
        return this._bindingWhenSyntax.whenParentTagged(tag, value);
    };
    BindingInWhenOnSyntax.prototype.whenAnyAncestorIs = function (ancestor) {
        return this._bindingWhenSyntax.whenAnyAncestorIs(ancestor);
    };
    BindingInWhenOnSyntax.prototype.whenNoAncestorIs = function (ancestor) {
        return this._bindingWhenSyntax.whenNoAncestorIs(ancestor);
    };
    BindingInWhenOnSyntax.prototype.whenAnyAncestorNamed = function (name) {
        return this._bindingWhenSyntax.whenAnyAncestorNamed(name);
    };
    BindingInWhenOnSyntax.prototype.whenAnyAncestorTagged = function (tag, value) {
        return this._bindingWhenSyntax.whenAnyAncestorTagged(tag, value);
    };
    BindingInWhenOnSyntax.prototype.whenNoAncestorNamed = function (name) {
        return this._bindingWhenSyntax.whenNoAncestorNamed(name);
    };
    BindingInWhenOnSyntax.prototype.whenNoAncestorTagged = function (tag, value) {
        return this._bindingWhenSyntax.whenNoAncestorTagged(tag, value);
    };
    BindingInWhenOnSyntax.prototype.whenAnyAncestorMatches = function (constraint) {
        return this._bindingWhenSyntax.whenAnyAncestorMatches(constraint);
    };
    BindingInWhenOnSyntax.prototype.whenNoAncestorMatches = function (constraint) {
        return this._bindingWhenSyntax.whenNoAncestorMatches(constraint);
    };
    BindingInWhenOnSyntax.prototype.onActivation = function (handler) {
        return this._bindingOnSyntax.onActivation(handler);
    };
    return BindingInWhenOnSyntax;
}());
exports.BindingInWhenOnSyntax = BindingInWhenOnSyntax;


/***/ }),

/***/ "./node_modules/inversify/lib/syntax/binding_on_syntax.js":
/*!****************************************************************!*\
  !*** ./node_modules/inversify/lib/syntax/binding_on_syntax.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var binding_when_syntax_1 = __webpack_require__(/*! ./binding_when_syntax */ "./node_modules/inversify/lib/syntax/binding_when_syntax.js");
var BindingOnSyntax = (function () {
    function BindingOnSyntax(binding) {
        this._binding = binding;
    }
    BindingOnSyntax.prototype.onActivation = function (handler) {
        this._binding.onActivation = handler;
        return new binding_when_syntax_1.BindingWhenSyntax(this._binding);
    };
    return BindingOnSyntax;
}());
exports.BindingOnSyntax = BindingOnSyntax;


/***/ }),

/***/ "./node_modules/inversify/lib/syntax/binding_to_syntax.js":
/*!****************************************************************!*\
  !*** ./node_modules/inversify/lib/syntax/binding_to_syntax.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ERROR_MSGS = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
var literal_types_1 = __webpack_require__(/*! ../constants/literal_types */ "./node_modules/inversify/lib/constants/literal_types.js");
var binding_in_when_on_syntax_1 = __webpack_require__(/*! ./binding_in_when_on_syntax */ "./node_modules/inversify/lib/syntax/binding_in_when_on_syntax.js");
var binding_when_on_syntax_1 = __webpack_require__(/*! ./binding_when_on_syntax */ "./node_modules/inversify/lib/syntax/binding_when_on_syntax.js");
var BindingToSyntax = (function () {
    function BindingToSyntax(binding) {
        this._binding = binding;
    }
    BindingToSyntax.prototype.to = function (constructor) {
        this._binding.type = literal_types_1.BindingTypeEnum.Instance;
        this._binding.implementationType = constructor;
        return new binding_in_when_on_syntax_1.BindingInWhenOnSyntax(this._binding);
    };
    BindingToSyntax.prototype.toSelf = function () {
        if (typeof this._binding.serviceIdentifier !== "function") {
            throw new Error("" + ERROR_MSGS.INVALID_TO_SELF_VALUE);
        }
        var self = this._binding.serviceIdentifier;
        return this.to(self);
    };
    BindingToSyntax.prototype.toConstantValue = function (value) {
        this._binding.type = literal_types_1.BindingTypeEnum.ConstantValue;
        this._binding.cache = value;
        this._binding.dynamicValue = null;
        this._binding.implementationType = null;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
    };
    BindingToSyntax.prototype.toDynamicValue = function (func) {
        this._binding.type = literal_types_1.BindingTypeEnum.DynamicValue;
        this._binding.cache = null;
        this._binding.dynamicValue = func;
        this._binding.implementationType = null;
        return new binding_in_when_on_syntax_1.BindingInWhenOnSyntax(this._binding);
    };
    BindingToSyntax.prototype.toConstructor = function (constructor) {
        this._binding.type = literal_types_1.BindingTypeEnum.Constructor;
        this._binding.implementationType = constructor;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
    };
    BindingToSyntax.prototype.toFactory = function (factory) {
        this._binding.type = literal_types_1.BindingTypeEnum.Factory;
        this._binding.factory = factory;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
    };
    BindingToSyntax.prototype.toFunction = function (func) {
        if (typeof func !== "function") {
            throw new Error(ERROR_MSGS.INVALID_FUNCTION_BINDING);
        }
        var bindingWhenOnSyntax = this.toConstantValue(func);
        this._binding.type = literal_types_1.BindingTypeEnum.Function;
        return bindingWhenOnSyntax;
    };
    BindingToSyntax.prototype.toAutoFactory = function (serviceIdentifier) {
        this._binding.type = literal_types_1.BindingTypeEnum.Factory;
        this._binding.factory = function (context) {
            var autofactory = function () { return context.container.get(serviceIdentifier); };
            return autofactory;
        };
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
    };
    BindingToSyntax.prototype.toProvider = function (provider) {
        this._binding.type = literal_types_1.BindingTypeEnum.Provider;
        this._binding.provider = provider;
        return new binding_when_on_syntax_1.BindingWhenOnSyntax(this._binding);
    };
    BindingToSyntax.prototype.toService = function (service) {
        this.toDynamicValue(function (context) { return context.container.get(service); });
    };
    return BindingToSyntax;
}());
exports.BindingToSyntax = BindingToSyntax;


/***/ }),

/***/ "./node_modules/inversify/lib/syntax/binding_when_on_syntax.js":
/*!*********************************************************************!*\
  !*** ./node_modules/inversify/lib/syntax/binding_when_on_syntax.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var binding_on_syntax_1 = __webpack_require__(/*! ./binding_on_syntax */ "./node_modules/inversify/lib/syntax/binding_on_syntax.js");
var binding_when_syntax_1 = __webpack_require__(/*! ./binding_when_syntax */ "./node_modules/inversify/lib/syntax/binding_when_syntax.js");
var BindingWhenOnSyntax = (function () {
    function BindingWhenOnSyntax(binding) {
        this._binding = binding;
        this._bindingWhenSyntax = new binding_when_syntax_1.BindingWhenSyntax(this._binding);
        this._bindingOnSyntax = new binding_on_syntax_1.BindingOnSyntax(this._binding);
    }
    BindingWhenOnSyntax.prototype.when = function (constraint) {
        return this._bindingWhenSyntax.when(constraint);
    };
    BindingWhenOnSyntax.prototype.whenTargetNamed = function (name) {
        return this._bindingWhenSyntax.whenTargetNamed(name);
    };
    BindingWhenOnSyntax.prototype.whenTargetIsDefault = function () {
        return this._bindingWhenSyntax.whenTargetIsDefault();
    };
    BindingWhenOnSyntax.prototype.whenTargetTagged = function (tag, value) {
        return this._bindingWhenSyntax.whenTargetTagged(tag, value);
    };
    BindingWhenOnSyntax.prototype.whenInjectedInto = function (parent) {
        return this._bindingWhenSyntax.whenInjectedInto(parent);
    };
    BindingWhenOnSyntax.prototype.whenParentNamed = function (name) {
        return this._bindingWhenSyntax.whenParentNamed(name);
    };
    BindingWhenOnSyntax.prototype.whenParentTagged = function (tag, value) {
        return this._bindingWhenSyntax.whenParentTagged(tag, value);
    };
    BindingWhenOnSyntax.prototype.whenAnyAncestorIs = function (ancestor) {
        return this._bindingWhenSyntax.whenAnyAncestorIs(ancestor);
    };
    BindingWhenOnSyntax.prototype.whenNoAncestorIs = function (ancestor) {
        return this._bindingWhenSyntax.whenNoAncestorIs(ancestor);
    };
    BindingWhenOnSyntax.prototype.whenAnyAncestorNamed = function (name) {
        return this._bindingWhenSyntax.whenAnyAncestorNamed(name);
    };
    BindingWhenOnSyntax.prototype.whenAnyAncestorTagged = function (tag, value) {
        return this._bindingWhenSyntax.whenAnyAncestorTagged(tag, value);
    };
    BindingWhenOnSyntax.prototype.whenNoAncestorNamed = function (name) {
        return this._bindingWhenSyntax.whenNoAncestorNamed(name);
    };
    BindingWhenOnSyntax.prototype.whenNoAncestorTagged = function (tag, value) {
        return this._bindingWhenSyntax.whenNoAncestorTagged(tag, value);
    };
    BindingWhenOnSyntax.prototype.whenAnyAncestorMatches = function (constraint) {
        return this._bindingWhenSyntax.whenAnyAncestorMatches(constraint);
    };
    BindingWhenOnSyntax.prototype.whenNoAncestorMatches = function (constraint) {
        return this._bindingWhenSyntax.whenNoAncestorMatches(constraint);
    };
    BindingWhenOnSyntax.prototype.onActivation = function (handler) {
        return this._bindingOnSyntax.onActivation(handler);
    };
    return BindingWhenOnSyntax;
}());
exports.BindingWhenOnSyntax = BindingWhenOnSyntax;


/***/ }),

/***/ "./node_modules/inversify/lib/syntax/binding_when_syntax.js":
/*!******************************************************************!*\
  !*** ./node_modules/inversify/lib/syntax/binding_when_syntax.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var binding_on_syntax_1 = __webpack_require__(/*! ./binding_on_syntax */ "./node_modules/inversify/lib/syntax/binding_on_syntax.js");
var constraint_helpers_1 = __webpack_require__(/*! ./constraint_helpers */ "./node_modules/inversify/lib/syntax/constraint_helpers.js");
var BindingWhenSyntax = (function () {
    function BindingWhenSyntax(binding) {
        this._binding = binding;
    }
    BindingWhenSyntax.prototype.when = function (constraint) {
        this._binding.constraint = constraint;
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenTargetNamed = function (name) {
        this._binding.constraint = constraint_helpers_1.namedConstraint(name);
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenTargetIsDefault = function () {
        this._binding.constraint = function (request) {
            var targetIsDefault = (request.target !== null) &&
                (!request.target.isNamed()) &&
                (!request.target.isTagged());
            return targetIsDefault;
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenTargetTagged = function (tag, value) {
        this._binding.constraint = constraint_helpers_1.taggedConstraint(tag)(value);
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenInjectedInto = function (parent) {
        this._binding.constraint = function (request) {
            return constraint_helpers_1.typeConstraint(parent)(request.parentRequest);
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenParentNamed = function (name) {
        this._binding.constraint = function (request) {
            return constraint_helpers_1.namedConstraint(name)(request.parentRequest);
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenParentTagged = function (tag, value) {
        this._binding.constraint = function (request) {
            return constraint_helpers_1.taggedConstraint(tag)(value)(request.parentRequest);
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenAnyAncestorIs = function (ancestor) {
        this._binding.constraint = function (request) {
            return constraint_helpers_1.traverseAncerstors(request, constraint_helpers_1.typeConstraint(ancestor));
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenNoAncestorIs = function (ancestor) {
        this._binding.constraint = function (request) {
            return !constraint_helpers_1.traverseAncerstors(request, constraint_helpers_1.typeConstraint(ancestor));
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenAnyAncestorNamed = function (name) {
        this._binding.constraint = function (request) {
            return constraint_helpers_1.traverseAncerstors(request, constraint_helpers_1.namedConstraint(name));
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenNoAncestorNamed = function (name) {
        this._binding.constraint = function (request) {
            return !constraint_helpers_1.traverseAncerstors(request, constraint_helpers_1.namedConstraint(name));
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenAnyAncestorTagged = function (tag, value) {
        this._binding.constraint = function (request) {
            return constraint_helpers_1.traverseAncerstors(request, constraint_helpers_1.taggedConstraint(tag)(value));
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenNoAncestorTagged = function (tag, value) {
        this._binding.constraint = function (request) {
            return !constraint_helpers_1.traverseAncerstors(request, constraint_helpers_1.taggedConstraint(tag)(value));
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenAnyAncestorMatches = function (constraint) {
        this._binding.constraint = function (request) {
            return constraint_helpers_1.traverseAncerstors(request, constraint);
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    BindingWhenSyntax.prototype.whenNoAncestorMatches = function (constraint) {
        this._binding.constraint = function (request) {
            return !constraint_helpers_1.traverseAncerstors(request, constraint);
        };
        return new binding_on_syntax_1.BindingOnSyntax(this._binding);
    };
    return BindingWhenSyntax;
}());
exports.BindingWhenSyntax = BindingWhenSyntax;


/***/ }),

/***/ "./node_modules/inversify/lib/syntax/constraint_helpers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/inversify/lib/syntax/constraint_helpers.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var METADATA_KEY = __webpack_require__(/*! ../constants/metadata_keys */ "./node_modules/inversify/lib/constants/metadata_keys.js");
var metadata_1 = __webpack_require__(/*! ../planning/metadata */ "./node_modules/inversify/lib/planning/metadata.js");
var traverseAncerstors = function (request, constraint) {
    var parent = request.parentRequest;
    if (parent !== null) {
        return constraint(parent) ? true : traverseAncerstors(parent, constraint);
    }
    else {
        return false;
    }
};
exports.traverseAncerstors = traverseAncerstors;
var taggedConstraint = function (key) { return function (value) {
    var constraint = function (request) {
        return request !== null && request.target !== null && request.target.matchesTag(key)(value);
    };
    constraint.metaData = new metadata_1.Metadata(key, value);
    return constraint;
}; };
exports.taggedConstraint = taggedConstraint;
var namedConstraint = taggedConstraint(METADATA_KEY.NAMED_TAG);
exports.namedConstraint = namedConstraint;
var typeConstraint = function (type) { return function (request) {
    var binding = null;
    if (request !== null) {
        binding = request.bindings[0];
        if (typeof type === "string") {
            var serviceIdentifier = binding.serviceIdentifier;
            return serviceIdentifier === type;
        }
        else {
            var constructor = request.bindings[0].implementationType;
            return type === constructor;
        }
    }
    return false;
}; };
exports.typeConstraint = typeConstraint;


/***/ }),

/***/ "./node_modules/inversify/lib/utils/binding_utils.js":
/*!***********************************************************!*\
  !*** ./node_modules/inversify/lib/utils/binding_utils.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.multiBindToService = function (container) {
    return function (service) {
        return function () {
            var types = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                types[_i] = arguments[_i];
            }
            return types.forEach(function (t) { return container.bind(t).toService(service); });
        };
    };
};


/***/ }),

/***/ "./node_modules/inversify/lib/utils/exceptions.js":
/*!********************************************************!*\
  !*** ./node_modules/inversify/lib/utils/exceptions.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ERROR_MSGS = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
function isStackOverflowExeption(error) {
    return (error instanceof RangeError ||
        error.message === ERROR_MSGS.STACK_OVERFLOW);
}
exports.isStackOverflowExeption = isStackOverflowExeption;


/***/ }),

/***/ "./node_modules/inversify/lib/utils/id.js":
/*!************************************************!*\
  !*** ./node_modules/inversify/lib/utils/id.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var idCounter = 0;
function id() {
    return idCounter++;
}
exports.id = id;


/***/ }),

/***/ "./node_modules/inversify/lib/utils/serialization.js":
/*!***********************************************************!*\
  !*** ./node_modules/inversify/lib/utils/serialization.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ERROR_MSGS = __webpack_require__(/*! ../constants/error_msgs */ "./node_modules/inversify/lib/constants/error_msgs.js");
function getServiceIdentifierAsString(serviceIdentifier) {
    if (typeof serviceIdentifier === "function") {
        var _serviceIdentifier = serviceIdentifier;
        return _serviceIdentifier.name;
    }
    else if (typeof serviceIdentifier === "symbol") {
        return serviceIdentifier.toString();
    }
    else {
        var _serviceIdentifier = serviceIdentifier;
        return _serviceIdentifier;
    }
}
exports.getServiceIdentifierAsString = getServiceIdentifierAsString;
function listRegisteredBindingsForServiceIdentifier(container, serviceIdentifier, getBindings) {
    var registeredBindingsList = "";
    var registeredBindings = getBindings(container, serviceIdentifier);
    if (registeredBindings.length !== 0) {
        registeredBindingsList = "\nRegistered bindings:";
        registeredBindings.forEach(function (binding) {
            var name = "Object";
            if (binding.implementationType !== null) {
                name = getFunctionName(binding.implementationType);
            }
            registeredBindingsList = registeredBindingsList + "\n " + name;
            if (binding.constraint.metaData) {
                registeredBindingsList = registeredBindingsList + " - " + binding.constraint.metaData;
            }
        });
    }
    return registeredBindingsList;
}
exports.listRegisteredBindingsForServiceIdentifier = listRegisteredBindingsForServiceIdentifier;
function alreadyDependencyChain(request, serviceIdentifier) {
    if (request.parentRequest === null) {
        return false;
    }
    else if (request.parentRequest.serviceIdentifier === serviceIdentifier) {
        return true;
    }
    else {
        return alreadyDependencyChain(request.parentRequest, serviceIdentifier);
    }
}
function dependencyChainToString(request) {
    function _createStringArr(req, result) {
        if (result === void 0) { result = []; }
        var serviceIdentifier = getServiceIdentifierAsString(req.serviceIdentifier);
        result.push(serviceIdentifier);
        if (req.parentRequest !== null) {
            return _createStringArr(req.parentRequest, result);
        }
        return result;
    }
    var stringArr = _createStringArr(request);
    return stringArr.reverse().join(" --> ");
}
function circularDependencyToException(request) {
    request.childRequests.forEach(function (childRequest) {
        if (alreadyDependencyChain(childRequest, childRequest.serviceIdentifier)) {
            var services = dependencyChainToString(childRequest);
            throw new Error(ERROR_MSGS.CIRCULAR_DEPENDENCY + " " + services);
        }
        else {
            circularDependencyToException(childRequest);
        }
    });
}
exports.circularDependencyToException = circularDependencyToException;
function listMetadataForTarget(serviceIdentifierString, target) {
    if (target.isTagged() || target.isNamed()) {
        var m_1 = "";
        var namedTag = target.getNamedTag();
        var otherTags = target.getCustomTags();
        if (namedTag !== null) {
            m_1 += namedTag.toString() + "\n";
        }
        if (otherTags !== null) {
            otherTags.forEach(function (tag) {
                m_1 += tag.toString() + "\n";
            });
        }
        return " " + serviceIdentifierString + "\n " + serviceIdentifierString + " - " + m_1;
    }
    else {
        return " " + serviceIdentifierString;
    }
}
exports.listMetadataForTarget = listMetadataForTarget;
function getFunctionName(v) {
    if (v.name) {
        return v.name;
    }
    else {
        var name_1 = v.toString();
        var match = name_1.match(/^function\s*([^\s(]+)/);
        return match ? match[1] : "Anonymous function: " + name_1;
    }
}
exports.getFunctionName = getFunctionName;


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/reflect-metadata/Reflect.js":
/*!**************************************************!*\
  !*** ./node_modules/reflect-metadata/Reflect.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof global === "object" ? global :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect || (Reflect = {}));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js"), __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/core/MapCore.ts":
/*!*****************************!*\
  !*** ./src/core/MapCore.ts ***!
  \*****************************/
/*! exports provided: GameMapToString, GameMapFromString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameMapToString", function() { return GameMapToString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameMapFromString", function() { return GameMapFromString; });
/* harmony import */ var _Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Utils */ "./src/core/Utils.ts");

function GameMapToString(map) {
    var buffer = [""];
    for (var _i = 0, _a = map.timepoints; _i < _a.length; _i++) {
        var tp = _a[_i];
        buffer.push("\n+|", tp.offset.toString(), "|", tp.bpm.toString(), "|", tp.bpb.toFixed(), "\n\n");
        for (var _b = 0, _c = tp.notes; _b < _c.length; _b++) {
            var note = _c[_b];
            if (note.type === "single") {
                buffer.push("s|", note.time.toFixed(), ":", note.lane.toFixed(), "\n");
            }
            else if (note.type === "flick") {
                buffer.push("f|", note.time.toFixed(), ":", note.lane.toFixed(), "\n");
            }
            else if (note.type === "slide") {
                buffer.push("l|", note.flickend ? "1" : "0");
                for (var _d = 0, _e = note.notes; _d < _e.length; _d++) {
                    var n = _e[_d];
                    buffer.push("|", n.time.toFixed(), ":", n.lane.toFixed());
                }
                buffer.push("\n");
            }
        }
    }
    return buffer.join("");
}
function pi(s) {
    var value = parseInt(s);
    if (isNaN(value))
        throw new Error("Not a number");
    return value;
}
function pf(s) {
    var value = parseFloat(s);
    if (isNaN(value))
        throw new Error("Not a number");
    return value;
}
function GameMapFromString(mapstring) {
    var lines = mapstring.split(/\r?\n/);
    var gamemap = {
        timepoints: []
    };
    function addTp(items) {
        gamemap.timepoints.push({
            id: Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["uuid"])(),
            offset: pf(items[1]),
            bpm: pf(items[2]),
            bpb: pi(items[3]),
            notes: [],
        });
    }
    function addSingle(items) {
        var tl = items[1].split(":").map(function (it) { return it.trim(); });
        Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["findex"])(gamemap.timepoints, -1).notes.push({
            id: Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["uuid"])(),
            type: "single",
            time: pi(tl[0]),
            lane: pi(tl[1]),
        });
    }
    function addFlick(items) {
        var tl = items[1].split(":").map(function (it) { return it.trim(); });
        Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["findex"])(gamemap.timepoints, -1).notes.push({
            id: Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["uuid"])(),
            type: "flick",
            time: pi(tl[0]),
            lane: pi(tl[1]),
        });
    }
    function addSlide(items) {
        var notes = [];
        for (var i = 2; i < items.length; i++) {
            var tl = items[i].split(":").map(function (it) { return it.trim(); });
            notes.push({
                id: Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["uuid"])(),
                time: pi(tl[0]),
                lane: pi(tl[1]),
            });
        }
        if (notes.length < 2)
            throw new Error("Not a slide");
        Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["findex"])(gamemap.timepoints, -1).notes.push({
            id: Object(_Utils__WEBPACK_IMPORTED_MODULE_0__["uuid"])(),
            type: "slide",
            flickend: items[1] === "1",
            notes: notes
        });
    }
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var items = line.split("|").map(function (it) { return it.trim(); }).filter(function (it) { return it.length > 0; });
        if (items.length < 1)
            continue;
        try {
            switch (items[0]) {
                case "+":
                    addTp(items);
                    break;
                case "s":
                    addSingle(items);
                    break;
                case "f":
                    addFlick(items);
                    break;
                case "l":
                    addSlide(items);
                    break;
            }
        }
        catch (error) {
            console.error("[GameMap] error parsing line " + i + ": " + error);
        }
    }
    return gamemap;
}


/***/ }),

/***/ "./src/core/Utils.ts":
/*!***************************!*\
  !*** ./src/core/Utils.ts ***!
  \***************************/
/*! exports provided: uuid, findex, binarySearch, ratio */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uuid", function() { return uuid; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findex", function() { return findex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "binarySearch", function() { return binarySearch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ratio", function() { return ratio; });
function uuid() {
    return Math.random().toString(36).substring(2, 10);
}
function findex(list, i) {
    if (list.length <= 0)
        return undefined;
    if (i >= list.length)
        return undefined;
    if (i < -list.length)
        return undefined;
    if (i < 0)
        i += list.length;
    return list[i];
}
/**
 * return the index of the largest element equal or smaller than target
 */
function binarySearch(list, length, target, force) {
    if (force === void 0) { force = false; }
    var l = 0;
    var r = length - 1;
    if (length <= 0)
        return -1;
    if (target < list(l))
        return -1;
    if (list(r) <= target)
        return r;
    if (!force && length < 10) {
        while (list(l) <= target)
            l++;
        return l - 1;
    }
    while (l < r - 1) {
        var m = Math.floor((l + r) / 2);
        var v = list(m);
        if (target < v)
            r = m;
        else if (v < target)
            l = m;
        else
            return m;
    }
    return l;
}
function ratio(start, end, target, from, to) {
    var r = (target - start) / (end - start);
    return (to - from) * r + from;
}


/***/ }),

/***/ "./src/game/Common/Animation.ts":
/*!**************************************!*\
  !*** ./src/game/Common/Animation.ts ***!
  \**************************************/
/*! exports provided: AnimationManager, CreatePixiTargetPropMapper, keyFramePresets, createSimpleAnimation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimationManager", function() { return AnimationManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreatePixiTargetPropMapper", function() { return CreatePixiTargetPropMapper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keyFramePresets", function() { return keyFramePresets; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createSimpleAnimation", function() { return createSimpleAnimation; });
/* harmony import */ var _core_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/Utils */ "./src/core/Utils.ts");
/* harmony import */ var _Utils_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Utils/Utils */ "./src/game/Utils/Utils.ts");
/* harmony import */ var _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Utils/GameEvent */ "./src/game/Utils/GameEvent.ts");



function bezier(ctrl) {
    if (ctrl[0] < 0 || ctrl[0] > 1 || ctrl[2] < 0 || ctrl[2] > 1)
        console.warn("Unexpected control points of bezier curve");
    return function (t) {
        var t1 = 3 * t * (1 - t) * (1 - t);
        var t2 = 3 * t * t * (1 - t);
        var t3 = t * t * t;
        return {
            x: ctrl[0] * t1 + ctrl[2] * t2 + t3,
            y: ctrl[1] * t1 + ctrl[3] * t2 + t3,
        };
    };
}
function CreateBezierCurve(ctrl, precision) {
    if (precision === void 0) { precision = 0.1; }
    var points = [];
    var calc = bezier(ctrl);
    var t = 0;
    while (t < 1) {
        points.push(calc(t));
        t += precision;
    }
    points.push(calc(1));
    return function (x) {
        if (x < 0)
            x = 0;
        if (x > 1)
            x = 1;
        var i = 1;
        if (x <= 0)
            return points[0].y;
        if (x >= 1)
            return Object(_core_Utils__WEBPACK_IMPORTED_MODULE_0__["findex"])(points, -1).y;
        i = Object(_core_Utils__WEBPACK_IMPORTED_MODULE_0__["binarySearch"])(function (id) { return points[id].x; }, points.length, x);
        return Object(_core_Utils__WEBPACK_IMPORTED_MODULE_0__["ratio"])(points[i].x, points[i + 1].x, x, points[i].y, points[i + 1].y);
    };
}
function CalcAnimation(anim, time) {
    if (anim.loop || anim.yoyo) {
        var t = Math.floor(time / anim.totaltime);
        time -= anim.totaltime * t;
        if (anim.yoyo)
            if (t % 2)
                time = anim.totaltime - time;
    }
    var list = anim.keyframes;
    if (list.length === 0) {
        console.warn("Empty animation");
        return 0;
    }
    var i = Object(_core_Utils__WEBPACK_IMPORTED_MODULE_0__["binarySearch"])(function (id) { return list[id].time; }, list.length, time);
    if (i === list.length - 1)
        return list[i].value;
    if (i === -1)
        return list[0].value;
    var start = list[i];
    var end = list[i + 1];
    switch (start.type) {
        case "static": return start.value;
        case "linear": return Object(_core_Utils__WEBPACK_IMPORTED_MODULE_0__["ratio"])(start.time, end.time, time, start.value, end.value);
        case "bezier":
            if (!start.calc)
                start.calc = CreateBezierCurve(start.ctrl);
            var t = start.calc((time - start.time) / (end.time - start.time));
            return (end.value - start.value) * t + start.value;
    }
}
var AnimationManager = /** @class */ (function () {
    function AnimationManager(mapper) {
        this.currentTime = 0;
        this.animations = new Map();
        this.onEnd = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_2__["GameEvent"]();
        this.paused = false;
        this._ended = false;
        this.targetPropMapper = mapper;
    }
    /**
     * @param dt in seconds
     */
    AnimationManager.prototype.update = function (dt) {
        var _this = this;
        if (this.paused)
            return;
        this.currentTime += dt;
        var endcount = 0;
        this.animations.forEach(function (anim, prop) {
            var origvalue = CalcAnimation(anim, _this.currentTime);
            var value = origvalue * (typeof anim.scale === "number" ? anim.scale : 1)
                + (typeof anim.base === "number" ? anim.base : 0);
            _this.targetPropMapper(prop, value);
            if (!anim.loop && !anim.yoyo && _this.currentTime >= anim.totaltime)
                endcount++;
        });
        if (endcount === this.animations.size) {
            if (!this._ended)
                this.onEnd.emit();
            this._ended = true;
        }
        else {
            this._ended = false;
        }
    };
    Object.defineProperty(AnimationManager.prototype, "ended", {
        get: function () {
            return this._ended;
        },
        enumerable: true,
        configurable: true
    });
    return AnimationManager;
}());

function CreatePixiTargetPropMapper(obj) {
    var s = obj;
    return function (prop, value) {
        switch (prop) {
            case "x":
            case "y":
            case "alpha":
            case "rotation":
            case "angle":
                obj[prop] = value;
                break;
            case "scale":
                obj.scale.set(value);
                break;
            case "scalex":
                obj.scale.x = value;
                break;
            case "scaley":
                obj.scale.y = value;
                break;
            case "r":
            case "g":
            case "b":
                if (s.isSprite)
                    s.tint = Object(_Utils_Utils__WEBPACK_IMPORTED_MODULE_1__["setByte"])(s.tint, _Utils_Utils__WEBPACK_IMPORTED_MODULE_1__["colorByte"][prop], value);
        }
    };
}
var keyFramePresets = {
    linear: {
        type: "linear",
        time: 0,
        value: 0
    },
    easeInOUt: {
        type: "bezier",
        ctrl: [.42, 0, .58, 1],
        time: 0,
        value: 0,
    },
    easeIn: {
        type: "bezier",
        ctrl: [.42, 0, 1, 1],
        time: 0,
        value: 0,
    },
    easeOut: {
        type: "bezier",
        ctrl: [0, 0, .58, 1],
        time: 0,
        value: 0,
    },
};
function createSimpleAnimation(from, to, time, keyframe) {
    return {
        keyframes: [keyframe, {
                type: "linear",
                time: time,
                value: 1
            }],
        totaltime: time,
        base: from,
        scale: (to - from),
    };
}


/***/ }),

/***/ "./src/game/Common/FixRatioContainer.ts":
/*!**********************************************!*\
  !*** ./src/game/Common/FixRatioContainer.ts ***!
  \**********************************************/
/*! exports provided: FixRatioContainer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FixRatioContainer", function() { return FixRatioContainer; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var FixRatioContainer = /** @class */ (function (_super) {
    __extends(FixRatioContainer, _super);
    function FixRatioContainer(initWidth, initHeight) {
        var _this = _super.call(this) || this;
        _this._width = initWidth;
        _this._height = initHeight;
        return _this;
    }
    Object.defineProperty(FixRatioContainer.prototype, "width", {
        get: function () { return this._width * this.scale.x; },
        set: function (v) {
            var p = v / this._width;
            this.scale.set(p, p);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FixRatioContainer.prototype, "height", {
        get: function () { return this._height * this.scale.x; },
        set: function (v) {
            var p = v / this._height;
            this.scale.set(p, p);
        },
        enumerable: true,
        configurable: true
    });
    FixRatioContainer.prototype.setInit = function (width, height) {
        this._width = width;
        this._height = height;
    };
    Object.defineProperty(FixRatioContainer.prototype, "ratio", {
        get: function () { return this._width / this._height; },
        enumerable: true,
        configurable: true
    });
    FixRatioContainer.prototype.resize = function (containerWidth, containerHeight, cover, hori, vert) {
        if (cover === void 0) { cover = false; }
        if (hori === void 0) { hori = 0.5; }
        if (vert === void 0) { vert = 0.5; }
        var cr = containerWidth / containerHeight;
        var r = this.ratio;
        if ((cr > r) !== cover) {
            this.height = containerHeight;
            this.x = containerWidth * hori - this.width * hori;
            this.y = 0;
        }
        else {
            this.width = containerWidth;
            this.x = 0;
            this.y = containerHeight * vert - this.height * vert;
        }
    };
    return FixRatioContainer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Common/InCodeAssests.ts":
/*!******************************************!*\
  !*** ./src/game/Common/InCodeAssests.ts ***!
  \******************************************/
/*! exports provided: LoadingBackground, LoadingMessages */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadingBackground", function() { return LoadingBackground; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadingMessages", function() { return LoadingMessages; });
var LoadingBackgroundUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASAAAACQCAYAAACoPrZBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAvoSURBVHhe7d1tV9NKG4ZhFSwKuBVBBUQsBSv4hv//z/V5rujgML2Spk2applzr3WsVe9Oyod9r8m8z5P//zfDP//999/s+/fvBX12ZYAy5M/SbDBbSpzfv38X9NmVAcqQP0uzwWyRQGiC/FmaDWaLJjSaIH+WZoMA0AUbBIAu2ODg0VRGE+RPa2xw8JQ4DBZiVeRPa2xw8EggNEH+tMYGB48mNJogf1pjgwDQBRsEgC7Y4GDQVEYT5M/a2eBgKHEYLMSqyJ+1s8HBIIHQBPmzdjbYa0+fPp29f/9+dnh4aL+P0YRGE+TP2tlgr7148eLhrXRzczN79eqVLQeklCvX19dUJv1hg72mJAoVUHB3dzc7Ojqy5QFRy/nbt29Fvvz8+XP2/PlzWw6dssFee/v27VwFFIzH4yLR3HPI27t37+ZyxZVDp2yw1zT+EydS6tOnT/Y55OvZs2ezHz9+zOUKXbGNs8FeOz8/n0uk1MuXL+2zyNPp6anNE3XJVDm5Z9AJG+y1y8vL2efPn2cfPnyYTSaT2a9fv+YS6+zszD6LvOzs7Mxev35djPmkORJoIkOtarWGGBfqnA32mmYx4il4vcE0LnR7e/uQVFdXV4+eQR5U4bx582b28ePH2devXx9VNHWpslKldHBwYP8GWmWDvaaKZm9vz36nVtH9/X3RMnLfY7hU+Wi9jqtUVkEOdcIGe02DiUo2951otkNdNPcdhmt3d7d4+bjKZBXqurm/g1bZYG9pil1jPu67QGVYE5Qndb/aqITUkna/j9bZYG9pkFAzF+47QPTyaVIJ0XrulA1unCoaDSSqslEyhYHBi4uL2ZcvX+wzQHB8fGwrl0Wm0ynT8t2ywY3SXi+3aCxghgt1pCuf6xiNRva3sDY2uDHxfp0yagW5Z4FYvGm5Lhawds4GN6Zqn1egRWPuWSCmdTwuf6poENv9FtbGBjdGrRuXGDG92dyzQEzT6C5/qjD71Tkb3JiyPTuBtmG454BUndZ0ivzqnA1ujGa/ylazapc7R22gLjcIre0Z6mZprEet7XQfITOsnbPBjVIlpJaQZrtEG0v39/dtWaBMPBWv6XW3sllT7ioX9o1p6UdaBmtlg8DWU2tZlUvdI3urtvdgbWwQALpggwDQBRtcO647QRPkz2DY4NrFM1367MoAZcifwbDBtSOB0AT5Mxg2uHY0odEE+TMYNggAXbBBAOiCDbaGpjKaIH8GzwZbo8RhsBCrIn8GzwZbQwKhCfJn8GywNTSh0QT5M3g2CABdsEGgNeG6ZJ3PU3ajLbJlg0ujqQxH5zLHN5yU3elG/mTLBpemxGGwEDGd3Z2eOKjKyJUlf7Jlg0sjgZDS8aYhJ4Lz83NblvzJlg0ujSY0Yu5GCt1uW3bqIPmTrfng7u5ucZSlDoEfj8fFXdm6i4vrcFCHjkK9vb2dq4C48gbGv3+o4tFNAVUX+19fX3N7JCq563A09qMD4HXhAHevI/LngyqVRVciB6qglGTRjwCFsqu1J5PJQ6tIA9O0pvHXn2tw4qnSOlQJ0VdH6uTkxOZL6ujoyD6P7DyZ3dzc2CTRG0tjQPredcs0qKjKK/lBZEpdKw0ip3mSUi6RNyjozqQ0QZREWkAWFxyNRsX4T1qWi9wQaJA5zQ9H44zueWRId2HHyaG3U9lyefXvww2SgSorVxZ50fS6WsRxbjga/9Fkh/sNZOju7u5Rgiy6nF/jPnF5YUARuj47zQtH5dzzyFS6VH7R7JbedHF5qXv1LYZJLZo0j5yqhYjIVNps1gJEW/AvKiCktEg1zQmHhYiYk47paNWzLfiXW2JPFyxvaffLLekICxHd88iYZrHiRNEgdDoDFiiB0gqrbHcz8qEumDaZyuHhoV2IqPVB7llkTiug02RRt0wtnbigpuHdeiGm4RHToWNpjqhC0gyqK4/sPSm6XWnSiKbYtfZnOp3a71VRMaWKQC1k1/1i2w4q/GlCp9PxdeiYzeTHkDG3EFGr6Wn9oMKfD1oan47vlNGUK281xNT6cQsR2S+IBf79Q0mkt1jVmg6NA3EcB1KaCU1zpez0QyAyH1RFpO6VEkiHkmnvjgYXmW5HGXWzrq6uinFDHcXKbnfUZIOAxdGpaMLkjy8IOEqc0MXSZ1cGKGPyxxcEHCogNEEFhEbogqEJumAA+sQGAaALNojM0dVCE0vkjw0ic0ocBpuxqiXyxwaROSogNEEFhEbogqEJumAAtoENAkAXbBCZoKuFJlrIHxtEJpQ4DDZjVS3kjw0iE1RAaIIKCI3QBUNKZzvprjfdcOK+j9EFwyO6JFIXCVCZYFXx6ZY6AXXNF4/aILaQ3lzhTi6dz6xzvl05oIoqnFABBbq0Yk2nXNogtlB6J9d4PLblgCq6cCLOo5hyquVbTmwQW6bsTi66YljWorv+dU68e25FNogtc3p6apNFXTJVTu4ZwNFlFC6XYi3ejGOD2BI7OzvFNdruTq5AA4l6q6k1xLgQFrm8vCxuS9YVXZPJxF7TdXZ2Zp9dgQ2ip1Th6Mok3clf9yLJlCorVUoHBwf2byBvmkWNp+DVgta4kG65DTmkK5jiZxqwQfSQKh+tt4grkyb0dnN/B3lTRbO3t2e/U6vo/v6+zdyxQfSQ7vDX/3xXmaxCXTf3d5A3TWboZee+E822qovmvluBDaKn1P1qoxLSm8z9PvKmKXaN+bjvApVpcU2QDaLH9D+/SSXU4tsLA6NJCs2cuu/WxAbRc8fHx7ZyWWQ6nTItj6Ki0USGKhu9zMLExMXFRXG3v3tmTWwQWyBd+VzHaDSyv4V8aK+XW7QatDjDVYcNYgvEmwbranEBGbZQvF+wjFpB7tk1sUFsAa3jcQlURYPY7reQh6p9XoEWrbpn18QGsQU0je4SqAqzX3lT68blRUwta/fsmtggtkCdt1lKy+zdbyEPZXsGgw3khw1iC7hBaG3PUDdLYz1626X7eDqe4UDPaParbDW9drm3fNRGHTaILRBPxWt63a1s1pS7yoV9Y5p6TcsgL6qE1BLSbJdoY+n+/r4t2wEbxBbQ20qVS90jM6uW1wMbYoMA0AUbBIAu2CA2rIXrTpCxLcofG8SGxTMV+uzKAGW2KH9sEBtGBYQmqIDQCF0wNEEXDAAWs0EA6IINoiN0tdDEAPLHBtERJQ6DzVjVAPLHBtERKiA0QQWERuiCoQm6YACwOhvEEsJ1yTqfp+xGSQCWDaImncsc3zBQdqcSXS00MeD8sUHUoLNz0xMHVRm5skqcUEafXRmgzIDzxwZRg443DUkRnJ+f27JUQGiCCgiPuBspdLtk2amDdMHQBF0wPNBRqLe3t3MVEFfeoI7d3d3iKF0dAj8ej4u7+nUXV8fX4fSFDaKCuw5HYz86AF4HfnP3OhxVPLqpRHexp/kTXF9f53Z7rQ2iRNnVtpPJ5KFVpIHpTN9mKKFKZdGVyIEqKL3k3O8MkA2ixMnJiU2a1NHRkX0e+VGrOF6qUYcqoUzGCm0QhrpWGgR0CRNT8ijp3G8gPzc3NzZP1GLWGJC+d90yTWpkkEc2CEODzGmSOOrnu+eRH93ZluaHXmJawBqXG41GxfhPWjaDiyRtEAlNr+uNlCZISuM/Gmx0v4H86K71OD/U0inbrqPxxXCDbaDKypUdEBtEQtfXxolRRuXc88jT3d3do/xQheTKBRr3icvLwCc0bBARtWjSLRdO1UJE5CnNm0WzW8qfuLzUvXp7S9kgIlokliaFw0JEpNJuuxYgunIBFRDmpN0vN6UaFiK655GvdExHq55ducBt8aELljl1wbTJVA4PD+2CMq0Pcs8ib5rFivNEg9DpDFigF1haYZWdrjAgNogSOnQsThBRhaQZDFceedMK6DRf1C1TSycup2l4t16IaXg80BvKdb8yWjaPFajbleaMaIpda3+m06n9XhVVBks6bBCGW4io1ay0flBFlUg6HV+Hjvl1vzcwNoiEWj9uISJn+6AObalIx3fKaOqezah4RDMRaaKUnX4IOHqJqRVdtaZM40Acx4E56mZdXV0V/XYdxcpud6xKFZG6V3qB6VAy7R3U5EZ+R7g8mf0PvyfvUdCSoaMAAAAASUVORK5CYII=';
var LoadingBackground = document.createElement("img");
LoadingBackground.src = LoadingBackgroundUrl;
var LoadingMessages = [
    "Loading...",
    "bangbangboom 今天炸了么",
    "在加载了",
    "???"
];


/***/ }),

/***/ "./src/game/Common/InfoEffect.ts":
/*!***************************************!*\
  !*** ./src/game/Common/InfoEffect.ts ***!
  \***************************************/
/*! exports provided: InfoEffect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InfoEffect", function() { return InfoEffect; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ParticleEmitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ParticleEmitter */ "./src/game/Common/ParticleEmitter.ts");
/* harmony import */ var _InfoSprite__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./InfoSprite */ "./src/game/Common/InfoSprite.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var InfoEffect = /** @class */ (function (_super) {
    __extends(InfoEffect, _super);
    function InfoEffect(info, textures) {
        var _this = _super.call(this) || this;
        _this.delaymap = new Map();
        _this.update = function (dt) {
            if (!_this.visible)
                return;
            _this.children.forEach(function (x) {
                if (x instanceof _InfoSprite__WEBPACK_IMPORTED_MODULE_2__["InfoSprite"] || x instanceof _ParticleEmitter__WEBPACK_IMPORTED_MODULE_1__["ParticleEmitter"]) {
                    x.update(dt);
                }
            });
        };
        if (info.particles instanceof Array) {
            info.particles.forEach(function (x) {
                var p = new _ParticleEmitter__WEBPACK_IMPORTED_MODULE_1__["ParticleEmitter"](x.textures.map(function (t) { return textures[t]; }), x.option);
                p.currentTime = -x.delay || 0;
                _this.delaymap.set(p, -x.delay || 0);
                _this.addChild(p);
            });
        }
        if (info.sprites instanceof Array) {
            info.sprites.forEach(function (x) {
                var s = new _InfoSprite__WEBPACK_IMPORTED_MODULE_2__["InfoSprite"](x, textures);
                _this.addChild(s);
            });
        }
        return _this;
    }
    InfoEffect.prototype.setPosition = function (x, y) {
        var s = this.scale;
        this.children.forEach(function (c) {
            if (c instanceof _InfoSprite__WEBPACK_IMPORTED_MODULE_2__["InfoSprite"]) {
                c.position.set(x / s.x, y / s.y);
            }
            else if (c instanceof _ParticleEmitter__WEBPACK_IMPORTED_MODULE_1__["ParticleEmitter"]) {
                c.offset = { x: x / s.x, y: y / s.y };
            }
        });
    };
    InfoEffect.prototype.resetAnim = function () {
        var _this = this;
        this.children.forEach(function (x) {
            if (x instanceof _ParticleEmitter__WEBPACK_IMPORTED_MODULE_1__["ParticleEmitter"]) {
                x.currentTime = _this.delaymap.get(x);
                x.emitEnded = false;
                x.allEnd = false;
                x.visible = true;
                x.canEmit = true;
            }
            else if (x instanceof _InfoSprite__WEBPACK_IMPORTED_MODULE_2__["InfoSprite"]) {
                x.resetAnim();
            }
        });
    };
    InfoEffect.prototype.stopEmit = function () {
        this.children.forEach(function (x) {
            if (x instanceof _ParticleEmitter__WEBPACK_IMPORTED_MODULE_1__["ParticleEmitter"]) {
                x.canEmit = false;
            }
            else if (x instanceof _InfoSprite__WEBPACK_IMPORTED_MODULE_2__["InfoSprite"]) {
                x.visible = false;
            }
        });
    };
    InfoEffect.prototype.allAnimEnd = function () {
        return this.children.findIndex(function (x) {
            if (x instanceof _ParticleEmitter__WEBPACK_IMPORTED_MODULE_1__["ParticleEmitter"]) {
                if (x.allEnd)
                    return false;
            }
            else if (x instanceof _InfoSprite__WEBPACK_IMPORTED_MODULE_2__["InfoSprite"]) {
                if (!x.visible)
                    return false;
                if (x.allAnimEnd())
                    return false;
            }
            return true;
        }) < 0;
    };
    return InfoEffect;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Common/InfoNumberSprite.ts":
/*!*********************************************!*\
  !*** ./src/game/Common/InfoNumberSprite.ts ***!
  \*********************************************/
/*! exports provided: InfoNumberSprite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InfoNumberSprite", function() { return InfoNumberSprite; });
/* harmony import */ var _NumberSprite__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NumberSprite */ "./src/game/Common/NumberSprite.ts");
/* harmony import */ var _InfoType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InfoType */ "./src/game/Common/InfoType.ts");
/* harmony import */ var _InfoSprite__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./InfoSprite */ "./src/game/Common/InfoSprite.ts");
/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Animation */ "./src/game/Common/Animation.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var InfoNumberSprite = /** @class */ (function (_super) {
    __extends(InfoNumberSprite, _super);
    function InfoNumberSprite(info, textures) {
        var _this = _super.call(this, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (x) { return x.toString(); }).map(function (x) { return textures[x]; })) || this;
        _this.infoSprites = [];
        _this.animation = new _Animation__WEBPACK_IMPORTED_MODULE_3__["AnimationManager"]();
        _this.update = function (dt) {
            if (!_this.visible)
                return;
            _this.animation.update(dt);
            _this.infoSprites.forEach(function (x) { return x.update(dt); });
        };
        if (info.fontSize !== undefined)
            _this.fontSize = info.fontSize;
        if (info.fontTint !== undefined)
            _this.tint = parseInt(info.fontTint.replace("#", "0x"));
        if (info.fontPadding !== undefined)
            _this.padding = info.fontPadding;
        Object(_InfoType__WEBPACK_IMPORTED_MODULE_1__["setPositionInfo"])(_this, info.position);
        _this.animation.targetPropMapper = Object(_Animation__WEBPACK_IMPORTED_MODULE_3__["CreatePixiTargetPropMapper"])(_this);
        if (info.animations instanceof Object) {
            for (var prop in info.animations) {
                _this.animation.animations.set(prop, info.animations[prop]);
            }
        }
        if (info.children instanceof Array) {
            info.children.forEach(function (x) {
                var c = new _InfoSprite__WEBPACK_IMPORTED_MODULE_2__["InfoSprite"](x, textures);
                _this.addChild(c);
                _this.infoSprites.push(c);
            });
        }
        return _this;
    }
    InfoNumberSprite.prototype.resetAnim = function () {
        this.animation.currentTime = 0;
        this.infoSprites.forEach(function (x) { return x.resetAnim(); });
    };
    InfoNumberSprite.prototype.allAnimEnd = function () {
        return this.animation.ended
            && this.infoSprites.findIndex(function (x) { return !x.allAnimEnd(); }) < 0;
    };
    return InfoNumberSprite;
}(_NumberSprite__WEBPACK_IMPORTED_MODULE_0__["NumberSprite"]));



/***/ }),

/***/ "./src/game/Common/InfoSprite.ts":
/*!***************************************!*\
  !*** ./src/game/Common/InfoSprite.ts ***!
  \***************************************/
/*! exports provided: InfoSprite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InfoSprite", function() { return InfoSprite; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Animation */ "./src/game/Common/Animation.ts");
/* harmony import */ var _InfoType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./InfoType */ "./src/game/Common/InfoType.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



var InfoSprite = /** @class */ (function (_super) {
    __extends(InfoSprite, _super);
    function InfoSprite(info, textures) {
        var _this = _super.call(this, textures[info.texture]) || this;
        _this.animation = new _Animation__WEBPACK_IMPORTED_MODULE_1__["AnimationManager"]();
        _this.update = function (dt) {
            if (!_this.visible)
                return;
            _this.animation.update(dt);
            _this.children.forEach(function (x) { return x.update(dt); });
        };
        _this.animation.targetPropMapper = Object(_Animation__WEBPACK_IMPORTED_MODULE_1__["CreatePixiTargetPropMapper"])(_this);
        Object(_InfoType__WEBPACK_IMPORTED_MODULE_2__["setPositionInfo"])(_this, info.position);
        if (info.animations instanceof Object) {
            for (var prop in info.animations) {
                _this.animation.animations.set(prop, info.animations[prop]);
            }
        }
        if (info.children instanceof Array) {
            info.children.forEach(function (x) {
                var c = new InfoSprite(x, textures);
                _this.addChild(c);
            });
        }
        if (info.blend === "add")
            _this.blendMode = pixi_js__WEBPACK_IMPORTED_MODULE_0__["BLEND_MODES"].ADD;
        if (info.tint !== undefined)
            _this.tint = parseInt(info.tint.replace("#", "0x"));
        return _this;
    }
    InfoSprite.prototype.resetAnim = function () {
        this.visible = true;
        this.animation.currentTime = 0;
        this.children.forEach(function (x) { return x.resetAnim(); });
    };
    InfoSprite.prototype.allAnimEnd = function () {
        return this.animation.ended
            && this.children.findIndex(function (x) { return !x.allAnimEnd(); }) < 0;
    };
    return InfoSprite;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"]));



/***/ }),

/***/ "./src/game/Common/InfoType.ts":
/*!*************************************!*\
  !*** ./src/game/Common/InfoType.ts ***!
  \*************************************/
/*! exports provided: setPositionInfo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setPositionInfo", function() { return setPositionInfo; });
function setPositionInfo(s, pos) {
    if (!pos)
        return;
    if (pos.x !== undefined)
        s.x = pos.x;
    if (pos.y !== undefined)
        s.y = pos.y;
    if (pos.width !== undefined)
        s.width = pos.width;
    if (pos.height !== undefined)
        s.height = pos.height;
    if (pos.anchor !== undefined) {
        if (typeof pos.anchor === "number")
            s.anchor.set(pos.anchor);
        else
            s.anchor.set(pos.anchor.x, pos.anchor.y);
    }
    if (pos.rotation !== undefined)
        s.rotation = pos.rotation;
    if (pos.scale !== undefined) {
        if (typeof pos.scale === "number")
            s.scale.set(pos.scale);
        else
            s.scale.set(pos.scale.x, pos.scale.y);
    }
}


/***/ }),

/***/ "./src/game/Common/NumberSprite.ts":
/*!*****************************************!*\
  !*** ./src/game/Common/NumberSprite.ts ***!
  \*****************************************/
/*! exports provided: NumberSprite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NumberSprite", function() { return NumberSprite; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var DigitSprite = /** @class */ (function (_super) {
    __extends(DigitSprite, _super);
    function DigitSprite(num, texture) {
        var _this = _super.call(this, texture) || this;
        _this.num = num;
        _this.anchor.set(0.5);
        return _this;
    }
    return DigitSprite;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"]));
var NumberContentSprite = /** @class */ (function (_super) {
    __extends(NumberContentSprite, _super);
    function NumberContentSprite(numberTextures) {
        var _this = _super.call(this) || this;
        _this.tex = [];
        _this.spritepool = [];
        _this.charWidth = 0;
        _this.charHeight = 0;
        _this.tint = 0xffffff;
        /** the size of max height of number textures */
        _this.fontSize = 36;
        _this.padding = 4;
        _this.tex = numberTextures;
        _this.charWidth = Math.max.apply(Math, numberTextures.map(function (x) { return x.width; }));
        _this.charHeight = Math.max.apply(Math, numberTextures.map(function (x) { return x.height; }));
        return _this;
    }
    NumberContentSprite.prototype.setValue = function (num) {
        var _this = this;
        var digits = num.toFixed().split("").map(function (x) { return parseInt(x); });
        var scale = this.fontSize / this.charHeight;
        var dx = this.charWidth * scale + this.padding;
        var offx = this.charWidth * scale / 2;
        var offy = this.charHeight * scale / 2;
        this.children.forEach(function (x) {
            _this.saveDigit(x);
        });
        this.removeChildren();
        digits.forEach(function (x, i) {
            var s = _this.getDigit(x);
            s.position.set(offx + dx * i, offy);
            s.scale.set(scale);
            s.tint = _this.tint;
            _this.addChild(s);
        });
    };
    NumberContentSprite.prototype.getDigit = function (x) {
        var pool = this.spritepool[x];
        if (pool === undefined) {
            pool = [];
            this.spritepool[x] = pool;
        }
        if (pool.length <= 0) {
            pool.push(new DigitSprite(x, this.tex[x]));
        }
        return pool.pop();
    };
    NumberContentSprite.prototype.saveDigit = function (s) {
        var x = s.num;
        var pool = this.spritepool[x];
        if (pool === undefined) {
            pool = [];
            this.spritepool[x] = pool;
        }
        pool.push(s);
    };
    return NumberContentSprite;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));
var NumberSprite = /** @class */ (function (_super) {
    __extends(NumberSprite, _super);
    function NumberSprite(numberTextures) {
        var _this = _super.call(this) || this;
        _this.content = new NumberContentSprite(numberTextures);
        _this.addChild(_this.content);
        _this.anchor = new pixi_js__WEBPACK_IMPORTED_MODULE_0__["ObservablePoint"](function () {
            _this.justifyPos();
        }, undefined);
        return _this;
    }
    Object.defineProperty(NumberSprite.prototype, "tint", {
        get: function () { return this.content.tint; },
        set: function (v) { this.content.tint = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberSprite.prototype, "fontSize", {
        get: function () { return this.content.fontSize; },
        set: function (v) { this.content.fontSize = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberSprite.prototype, "padding", {
        get: function () { return this.content.padding; },
        set: function (v) { this.content.padding = v; },
        enumerable: true,
        configurable: true
    });
    NumberSprite.prototype.setValue = function (num) {
        this.content.setValue(num);
        this.justifyPos();
    };
    NumberSprite.prototype.justifyPos = function () {
        var scale = this.fontSize / this.content.charHeight;
        var width = this.content.children.length * this.content.charWidth * scale + (this.content.children.length - 1) * this.padding;
        var height = this.content.charHeight * scale;
        this.content.position.set(-width * this.anchor.x, -height * this.anchor.y);
    };
    return NumberSprite;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Common/ParticleEmitter.ts":
/*!********************************************!*\
  !*** ./src/game/Common/ParticleEmitter.ts ***!
  \********************************************/
/*! exports provided: Particle, ParticleEmitter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Particle", function() { return Particle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParticleEmitter", function() { return ParticleEmitter; });
/* harmony import */ var _Utils_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Utils/Utils */ "./src/game/Utils/Utils.ts");
/* harmony import */ var _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Utils/GameEvent */ "./src/game/Utils/GameEvent.ts");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_2__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();



function getRangeValue(n) {
    if (n === undefined)
        return undefined;
    if (typeof n === "number")
        return n;
    if (n instanceof Array)
        return n[Math.floor(Math.random() * n.length)];
    if ("max" in n)
        return n.min + Math.random() * (n.max - n.min);
    return n.base + (Math.random() * 2 - 1) * n.offset;
}
function ratio(start, end, target, from, to) {
    if (to === undefined)
        return from;
    var r = (target - start) / (end - start);
    return (to - from) * r + from;
}
var Particle = /** @class */ (function (_super) {
    __extends(Particle, _super);
    function Particle(texture) {
        var _this = _super.call(this, texture) || this;
        _this.startX = 0;
        _this.startY = 0;
        _this.speedX = 0;
        _this.speedY = 0;
        _this.lifetime = 0;
        _this.currentTime = 0;
        _this.accelRad = 0;
        _this.accelTan = 0;
        _this.shouldRemove = false;
        _this.anchor.set(0.5);
        return _this;
    }
    Particle.prototype.setOption = function (option, offset) {
        if (option.blend === "add")
            this.blendMode = pixi_js__WEBPACK_IMPORTED_MODULE_2__["BLEND_MODES"].ADD;
        var speed = getRangeValue(option.speed);
        var radian = getRangeValue(option.radian);
        this.speedX = speed * Math.cos(radian);
        this.speedY = speed * Math.sin(radian);
        this.lifetime = getRangeValue(option.lifeTime);
        this.gravity = option.gravity;
        this.accelRad = getRangeValue(option.accelRad);
        this.accelTan = getRangeValue(option.accelTan);
        this.startX = getRangeValue(option.emitRect.x) + offset.x;
        this.startY = getRangeValue(option.emitRect.y) + offset.y;
        this.x = this.startX;
        this.y = this.startY;
        this.start = {
            size: getRangeValue(option.start.size),
            spin: getRangeValue(option.start.spin),
            r: getRangeValue(option.start.r),
            g: getRangeValue(option.start.g),
            b: getRangeValue(option.start.b),
            alpha: getRangeValue(option.start.alpha),
        };
        this.end = {
            size: getRangeValue(option.end.size),
            spin: getRangeValue(option.end.spin),
            r: getRangeValue(option.end.r),
            g: getRangeValue(option.end.g),
            b: getRangeValue(option.end.b),
            alpha: getRangeValue(option.end.alpha),
        };
    };
    // tslint:disable: no-bitwise
    /**
     *
     * @param dt in seconds
     */
    Particle.prototype.update = function (dt) {
        var _this = this;
        this.currentTime += dt;
        if (this.currentTime > this.lifetime) {
            this.visible = false;
            this.shouldRemove = true;
            return;
        }
        {
            this.x += this.speedX * dt;
            this.y += this.speedY * dt;
            var dvx = 0;
            var dvy = 0;
            if (this.gravity) {
                dvx += this.gravity.x;
                dvy += this.gravity.y;
            }
            if (this.accelTan) {
                dvx += this.accelTan * this.speedY;
                dvy += this.accelTan * -this.speedX;
            }
            if (this.accelRad) {
                dvx += this.accelRad * (this.x - this.startX);
                dvy += this.accelRad * (this.y - this.startY);
            }
            this.speedX += dvx * dt;
            this.speedY += dvy * dt;
        }
        {
            var setRatio = function (prop, set) {
                var v = ratio(0, _this.lifetime, _this.currentTime, _this.start[prop], _this.end[prop]);
                if (v !== undefined) {
                    set(v);
                }
            };
            setRatio("size", function (v) { return _this.scale.set(v); });
            setRatio("spin", function (v) { return _this.rotation = v; });
            setRatio("r", function (v) { return _this.tint = Object(_Utils_Utils__WEBPACK_IMPORTED_MODULE_0__["setByte"])(_this.tint, 2, v); });
            setRatio("g", function (v) { return _this.tint = Object(_Utils_Utils__WEBPACK_IMPORTED_MODULE_0__["setByte"])(_this.tint, 1, v); });
            setRatio("b", function (v) { return _this.tint = Object(_Utils_Utils__WEBPACK_IMPORTED_MODULE_0__["setByte"])(_this.tint, 0, v); });
            setRatio("alpha", function (v) { return _this.alpha = v; });
        }
    };
    return Particle;
}(pixi_js__WEBPACK_IMPORTED_MODULE_2__["Sprite"]));

var ParticleEmitter = /** @class */ (function (_super) {
    __extends(ParticleEmitter, _super);
    function ParticleEmitter(textures, option) {
        var _this = _super.call(this) || this;
        _this.textures = textures;
        _this.option = option;
        _this.freeIndexes = [];
        _this.offset = { x: 0, y: 0 };
        _this.canEmit = true;
        _this.destroyed = false;
        _this.currentTime = 0;
        _this.counter = 0;
        _this.onEmitEnd = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_1__["GameEvent"]();
        _this.emitEnded = false;
        _this.onAllEnd = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_1__["GameEvent"]();
        _this.allEnd = false;
        return _this;
    }
    ParticleEmitter.prototype.useParticle = function (index) {
        var x = this.children[index];
        x.visible = true;
        x.setOption(this.option, this.offset);
        x.currentTime = 0;
        var i = Math.floor(Math.random() * this.textures.length);
        x.texture = this.textures[i];
        return x;
    };
    /**
     *
     * @param dt in seconds
     */
    ParticleEmitter.prototype.update = function (dt) {
        var _this = this;
        this.currentTime += dt;
        if (this.destroyed || this.currentTime < 0) {
            return;
        }
        if (this.currentTime - dt < 0)
            this.currentTime = 0;
        if (this.canEmit && this.option.duration <= 0 || this.currentTime - dt < this.option.duration) {
            var time = this.option.duration > 0 ? (this.currentTime < this.option.duration ? dt : this.option.duration - this.currentTime + dt) : dt;
            this.counter += time * this.option.emissionRate;
            while (this.counter > 1) {
                this.counter -= 1;
                if (this.freeIndexes.length <= 0) {
                    this.addChild(new Particle(this.textures[0]));
                    this.freeIndexes.push(this.children.length - 1);
                }
                var i = this.freeIndexes.pop();
                this.useParticle(i);
            }
        }
        var visibleCount = 0;
        this.children.forEach(function (c, i) {
            var p = c;
            if (!p.visible)
                return;
            p.update(dt);
            if (p.shouldRemove) {
                p.shouldRemove = false;
                p.visible = false;
                _this.freeIndexes.push(i);
            }
            if (p.visible)
                visibleCount++;
        });
        if (!this.canEmit || this.option.duration > 0 && this.currentTime >= this.option.duration) {
            if (!this.emitEnded)
                this.onEmitEnd.emit();
            this.emitEnded = true;
        }
        else {
            this.emitEnded = false;
        }
        if (visibleCount <= 0 && this.emitEnded) {
            if (!this.allEnd)
                this.onAllEnd.emit();
            this.allEnd = true;
        }
        else {
            this.allEnd = false;
        }
    };
    ParticleEmitter.prototype.destroy = function () {
        this.destroyed = true;
        this.removeChildren();
    };
    return ParticleEmitter;
}(pixi_js__WEBPACK_IMPORTED_MODULE_2__["Container"]));



/***/ }),

/***/ "./src/game/Common/Sprite2d.ts":
/*!*************************************!*\
  !*** ./src/game/Common/Sprite2d.ts ***!
  \*************************************/
/*! exports provided: Sprite2d */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sprite2d", function() { return Sprite2d; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

// modified from
// https://github.com/pixijs/pixi-projection/
// tslint:disable: no-bitwise
var shaderVert = "\nprecision highp float;\n\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position.xyw = projectionMatrix * aVertexPosition;\n    gl_Position.z = 0.0;\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor;\n}";
var shaderFrag = "\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%;\n    gl_FragColor = color * vColor;\n}";
var Batch2dGeometry = /** @class */ (function (_super) {
    __extends(Batch2dGeometry, _super);
    function Batch2dGeometry(_static) {
        if (_static === void 0) { _static = false; }
        var _this = _super.call(this) || this;
        _this._buffer = new pixi_js__WEBPACK_IMPORTED_MODULE_0__["Buffer"](null, _static, false);
        _this._indexBuffer = new pixi_js__WEBPACK_IMPORTED_MODULE_0__["Buffer"](null, _static, true);
        _this.addAttribute('aVertexPosition', _this._buffer, 3, false, pixi_js__WEBPACK_IMPORTED_MODULE_0__["TYPES"].FLOAT)
            .addAttribute('aTextureCoord', _this._buffer, 2, false, pixi_js__WEBPACK_IMPORTED_MODULE_0__["TYPES"].FLOAT)
            .addAttribute('aColor', _this._buffer, 4, true, pixi_js__WEBPACK_IMPORTED_MODULE_0__["TYPES"].UNSIGNED_BYTE)
            .addAttribute('aTextureId', _this._buffer, 1, true, pixi_js__WEBPACK_IMPORTED_MODULE_0__["TYPES"].FLOAT)
            .addIndex(_this._indexBuffer);
        return _this;
    }
    return Batch2dGeometry;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Geometry"]));
var Batch2dPlugin = /** @class */ (function (_super) {
    __extends(Batch2dPlugin, _super);
    function Batch2dPlugin(renderer) {
        var _this = _super.call(this, renderer) || this;
        _this.shaderGenerator = new pixi_js__WEBPACK_IMPORTED_MODULE_0__["BatchShaderGenerator"](shaderVert, shaderFrag);
        _this.geometryClass = Batch2dGeometry;
        _this.vertexSize = 7;
        return _this;
    }
    Batch2dPlugin.prototype.packInterleavedGeometry = function (element, attributeBuffer, indexBuffer, aIndex, iIndex) {
        var uint32View = attributeBuffer.uint32View, float32View = attributeBuffer.float32View;
        var p = aIndex / this.vertexSize; // float32View.length / 6 / 2
        var uvs = element.uvs;
        var indicies = element.indices; // geometry.getIndex().data;// indicies
        var vertexData = element.vertexData;
        var vertexData2d = element.vertexData2d;
        var textureId = element._texture.baseTexture._id;
        var alpha = Math.min(element.worldAlpha, 1.0);
        var argb = alpha < 1.0 && element._texture.baseTexture.premultiplyAlpha ? pixi_js__WEBPACK_IMPORTED_MODULE_0__["utils"].premultiplyTint(element._tintRGB, alpha)
            : element._tintRGB + (alpha * 255 << 24);
        if (vertexData2d) {
            var j = 0;
            for (var i = 0; i < vertexData2d.length; i += 3, j += 2) {
                float32View[aIndex++] = vertexData2d[i];
                float32View[aIndex++] = vertexData2d[i + 1];
                float32View[aIndex++] = vertexData2d[i + 2];
                float32View[aIndex++] = uvs[j];
                float32View[aIndex++] = uvs[j + 1];
                uint32View[aIndex++] = argb;
                float32View[aIndex++] = textureId;
            }
        }
        else {
            for (var i = 0; i < vertexData.length; i += 2) {
                float32View[aIndex++] = vertexData[i];
                float32View[aIndex++] = vertexData[i + 1];
                float32View[aIndex++] = 1.0;
                float32View[aIndex++] = uvs[i];
                float32View[aIndex++] = uvs[i + 1];
                uint32View[aIndex++] = argb;
                float32View[aIndex++] = textureId;
            }
        }
        // tslint:disable-next-line: prefer-for-of
        for (var i = 0; i < indicies.length; i++) {
            indexBuffer[iIndex++] = p + indicies[i];
        }
    };
    return Batch2dPlugin;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["AbstractBatchRenderer"]));
pixi_js__WEBPACK_IMPORTED_MODULE_0__["Renderer"].registerPlugin('mybatch2d', Batch2dPlugin);
var Sprite2d = /** @class */ (function (_super) {
    __extends(Sprite2d, _super);
    function Sprite2d(texture) {
        var _this = _super.call(this, texture) || this;
        _this.vertexData2d = null;
        _this.projection = new pixi_js__WEBPACK_IMPORTED_MODULE_0__["Point"]();
        _this.pluginName = 'mybatch2d';
        return _this;
    }
    Object.defineProperty(Sprite2d.prototype, "projectionX", {
        get: function () { return this.projection.x; },
        set: function (v) { this.projection.x = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite2d.prototype, "projectionY", {
        get: function () { return this.projection.y; },
        set: function (v) { this.projection.y = v; },
        enumerable: true,
        configurable: true
    });
    Sprite2d.prototype.calculateVertices = function () {
        var texture = this.texture;
        var self = this;
        var wid = this.transform._worldID;
        var tuid = texture._updateID;
        if (self._transformID === wid && self._textureID === tuid) {
            return;
        }
        // update texture UV here, because base texture can be changed without calling `_onTextureUpdate`
        if (self._textureID !== tuid) {
            self.uvs = texture._uvs.uvsFloat32;
        }
        self._transformID = wid;
        self._textureID = tuid;
        var vertexData = self.vertexData;
        var trim = texture.trim;
        var orig = texture.orig;
        var anchor = self._anchor;
        var w0 = 0;
        var w1 = 0;
        var h0 = 0;
        var h1 = 0;
        if (trim) {
            // if the sprite is trimmed and is not a tilingsprite then we need to add the extra
            // space before transforming the sprite coords.
            w1 = trim.x - (anchor._x * orig.width);
            w0 = w1 + trim.width;
            h1 = trim.y - (anchor._y * orig.height);
            h0 = h1 + trim.height;
        }
        else {
            w1 = -anchor._x * orig.width;
            w0 = w1 + orig.width;
            h1 = -anchor._y * orig.height;
            h0 = h1 + orig.height;
        }
        if (!this.vertexData2d) {
            this.vertexData2d = new Float32Array(12);
        }
        var vertexData2d = this.vertexData2d;
        var px = (this.projectionX || 0) / (w0 - w1);
        var py = (this.projectionY || 0) / (h0 - h1);
        var wt = this.transform.worldTransform;
        var a = wt.a;
        var b = wt.b;
        var c = wt.c;
        var d = wt.d;
        var tx = wt.tx;
        var ty = wt.ty;
        // xy
        vertexData2d[2] = w1 * px + h1 * py + 1;
        vertexData2d[0] = (a * w1) + (c * h1) + tx * vertexData2d[2];
        vertexData2d[1] = (d * h1) + (b * w1) + ty * vertexData2d[2];
        vertexData[0] = vertexData2d[0] / vertexData2d[2];
        vertexData[1] = vertexData2d[1] / vertexData2d[2];
        // xy
        vertexData2d[5] = w0 * px + h1 * py + 1;
        vertexData2d[3] = (a * w0) + (c * h1) + tx * vertexData2d[5];
        vertexData2d[4] = (d * h1) + (b * w0) + ty * vertexData2d[5];
        vertexData[2] = vertexData2d[3] / vertexData2d[5];
        vertexData[3] = vertexData2d[4] / vertexData2d[5];
        // xy
        vertexData2d[8] = w0 * px + h0 * py + 1;
        vertexData2d[6] = (a * w0) + (c * h0) + tx * vertexData2d[8];
        vertexData2d[7] = (d * h0) + (b * w0) + ty * vertexData2d[8];
        vertexData[4] = vertexData2d[6] / vertexData2d[8];
        vertexData[5] = vertexData2d[7] / vertexData2d[8];
        // xy
        vertexData2d[11] = w1 * px + h0 * py + 1;
        vertexData2d[9] = (a * w1) + (c * h0) + tx * vertexData2d[11];
        vertexData2d[10] = (d * h0) + (b * w1) + ty * vertexData2d[11];
        vertexData[6] = vertexData2d[9] / vertexData2d[11];
        vertexData[7] = vertexData2d[10] / vertexData2d[11];
        if (self._roundPixels) {
            for (var i = 0; i < 8; i++) {
                vertexData[i] = Math.round(vertexData[i]);
            }
        }
    };
    return Sprite2d;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"]));



/***/ }),

/***/ "./src/game/Core/Constants.ts":
/*!************************************!*\
  !*** ./src/game/Core/Constants.ts ***!
  \************************************/
/*! exports provided: LayerWidth, LayerHeight, CenterX, LaneInfY, LaneBottomY, LaneWidth, LaneCenterXs, FarLineZ, FarLineY, JudgeOffset */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayerWidth", function() { return LayerWidth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayerHeight", function() { return LayerHeight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CenterX", function() { return CenterX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaneInfY", function() { return LaneInfY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaneBottomY", function() { return LaneBottomY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaneWidth", function() { return LaneWidth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaneCenterXs", function() { return LaneCenterXs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FarLineZ", function() { return FarLineZ; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FarLineY", function() { return FarLineY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JudgeOffset", function() { return JudgeOffset; });
var LayerWidth = 1280;
var LayerHeight = 720;
var CenterX = LayerWidth / 2;
var LaneInfY = -5;
var LaneBottomY = LayerHeight * 0.85;
var LaneWidth = 0.12 * LayerWidth;
var LaneCenterXs = [];
for (var i = -3; i < 4; i++) {
    LaneCenterXs.push(CenterX + i * LaneWidth);
}
var FarLineZ = 20;
var FarLineY = (LaneBottomY - LaneInfY) / FarLineZ + LaneInfY;
var JudgeOffset = {
    /**
     * single
     * flick (pointer down time)
     * long start
     */
    typeA: function (offset) {
        var off = offset * 1000;
        if (off < -200)
            return undefined;
        if (off < -150 || off > 150)
            return "miss";
        if (off < -125 || off > 125)
            return "bad";
        if (off < -100 || off > 100)
            return "good";
        if (off < -50 || off > 50)
            return "great";
        return "perfect";
    },
    /**
     * long end
     * long end flick (point move out time)
     */
    typeB: function (offset) {
        var off = offset * 1000;
        if (off < -200)
            return undefined;
        if (off < -170 || off > 170)
            return "miss";
        if (off < -150 || off > 150)
            return "bad";
        if (off < -120 || off > 120)
            return "good";
        if (off < -70 || off > 70)
            return "great";
        return "perfect";
    },
    /**
     * slide start
     * slide end
     */
    typeC: function (offset) {
        var off = offset * 1000;
        if (off < -200)
            return undefined;
        if (off < -150 || off > 200)
            return "miss";
        if (off < -125)
            return "bad";
        if (off < -100)
            return "good";
        if (off < -50)
            return "great";
        return "perfect";
    },
    /**
     * slide end flick (pointer move out time)
     */
    typeD: function (offset) {
        var off = offset * 1000;
        if (off < 0)
            return undefined;
        if (off > 100)
            return "miss";
        return "perfect";
    },
    /**
     * slide among
     */
    typeE: function (offset) {
        var off = offset * 1000;
        if (off < 0)
            return undefined;
        if (off > 200)
            return "miss";
        return "perfect";
    },
    flickOutTime: 0.1,
    flickOutDis: 40
};


/***/ }),

/***/ "./src/game/Core/GameConfig.ts":
/*!*************************************!*\
  !*** ./src/game/Core/GameConfig.ts ***!
  \*************************************/
/*! exports provided: GameConfig, GameLoadConfig, jsonNames, soundNames, staytime */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameConfig", function() { return GameConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameLoadConfig", function() { return GameLoadConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "jsonNames", function() { return jsonNames; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "soundNames", function() { return soundNames; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staytime", function() { return staytime; });
var GameConfig = /** @class */ (function () {
    function GameConfig() {
        this.judgeOffset = 0;
        this.visualOffset = 0;
        this.speed = 10;
        this.resolution = 2;
        this.noteScale = 1;
        this.barOpacity = 0.7;
        this.backgroundDim = 0.7;
        this.effectVolume = 1;
        this.showSimLine = true;
        this.laneEffect = true;
        this.mirror = false;
        this.beatNote = true;
        this.autoplay = false;
        // showTapOffset = true
        this.debug = false;
    }
    return GameConfig;
}());

var GameLoadConfig = /** @class */ (function () {
    function GameLoadConfig() {
        this.musicSrc = "";
        this.mapSrc = "";
        this.backgroundSrc = "";
        this.skin = "";
        this.songName = "";
    }
    return GameLoadConfig;
}());

var jsonNames = {
    effect: "effect.json",
    game: "game.json",
    ui: "ui.json",
};
var soundNames = {
    flick: "flick.mp3",
    button: "game_button.mp3",
    good: "good.mp3",
    great: "great.mp3",
    long: "long.mp3",
    perfect: "perfect.mp3",
};
function staytime(speed) {
    return 5.5 - (speed - 1) / 2;
}


/***/ }),

/***/ "./src/game/Core/GameMap.ts":
/*!**********************************!*\
  !*** ./src/game/Core/GameMap.ts ***!
  \**********************************/
/*! exports provided: FromMapCore, FromString */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FromMapCore", function() { return FromMapCore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FromString", function() { return FromString; });
/* harmony import */ var _core_MapCore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core/MapCore */ "./src/core/MapCore.ts");
/* harmony import */ var _core_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/Utils */ "./src/core/Utils.ts");


function FromMapCore(map) {
    var notes = [];
    var bars = [];
    var combo = 0;
    var _loop_1 = function (tp) {
        var dt = 60 / tp.bpm / 24;
        var off = tp.offset;
        var realtime = function (time) { return off + dt * time; };
        for (var _i = 0, _a = tp.notes; _i < _a.length; _i++) {
            var n = _a[_i];
            switch (n.type) {
                case "single":
                    notes.push({ type: "single", time: realtime(n.time), lane: n.lane, onbeat: n.time % 24 === 0 });
                    combo++;
                    break;
                case "flick":
                    notes.push({ type: "flick", time: realtime(n.time), lane: n.lane });
                    combo++;
                    break;
                case "slide":
                    var slide = {
                        type: "slide", flickend: n.flickend,
                        notes: []
                    };
                    notes.push({
                        type: "slidestart", parent: slide,
                        time: realtime(n.notes[0].time), lane: n.notes[0].lane,
                    });
                    slide.notes.push(Object(_core_Utils__WEBPACK_IMPORTED_MODULE_1__["findex"])(notes, -1));
                    combo++;
                    for (var i = 1; i < n.notes.length - 1; i++) {
                        notes.push({
                            type: "slideamong", parent: slide,
                            time: realtime(n.notes[i].time), lane: n.notes[i].lane
                        });
                        slide.notes.push(Object(_core_Utils__WEBPACK_IMPORTED_MODULE_1__["findex"])(notes, -1));
                        bars.push({
                            type: "slidebar",
                            start: Object(_core_Utils__WEBPACK_IMPORTED_MODULE_1__["findex"])(notes, -2), end: Object(_core_Utils__WEBPACK_IMPORTED_MODULE_1__["findex"])(notes, -1)
                        });
                        combo++;
                    }
                    var end = Object(_core_Utils__WEBPACK_IMPORTED_MODULE_1__["findex"])(n.notes, -1);
                    notes.push({
                        type: n.flickend ? "flickend" : "slideend", parent: slide,
                        time: realtime(end.time), lane: end.lane
                    });
                    slide.notes.push(Object(_core_Utils__WEBPACK_IMPORTED_MODULE_1__["findex"])(notes, -1));
                    bars.push({
                        type: "slidebar",
                        start: Object(_core_Utils__WEBPACK_IMPORTED_MODULE_1__["findex"])(notes, -2), end: Object(_core_Utils__WEBPACK_IMPORTED_MODULE_1__["findex"])(notes, -1)
                    });
                    combo++;
                    if (n.notes.length === 2 && n.notes[0].lane === n.notes[1].lane)
                        slide.long = true;
            }
        }
    };
    for (var _i = 0, _a = map.timepoints; _i < _a.length; _i++) {
        var tp = _a[_i];
        _loop_1(tp);
    }
    notes.sort(function (a, b) {
        var dt = a.time - b.time;
        if (dt)
            return dt;
        return a.lane - b.lane;
    });
    bars.sort(function (a, b) {
        var dt = a.start.time - b.start.time;
        if (dt)
            return dt;
        return a.start.lane - b.start.lane;
    });
    var timemap = new Map();
    var simlines = [];
    for (var _b = 0, notes_1 = notes; _b < notes_1.length; _b++) {
        var n = notes_1[_b];
        switch (n.type) {
            case "single":
            case "flick":
            case "slidestart":
            case "slideend":
            case "flickend":
                var s = timemap.get(n.time);
                if (s) {
                    simlines.push({ type: "simline", left: s, right: n });
                }
                timemap.set(n.time, n);
        }
    }
    simlines.sort(function (a, b) {
        return a.left.time - b.left.time;
    });
    return { notes: notes, combo: combo, bars: bars, simlines: simlines };
}
function FromString(str, mirror) {
    if (mirror === void 0) { mirror = false; }
    var map = FromMapCore(_core_MapCore__WEBPACK_IMPORTED_MODULE_0__["GameMapFromString"](str));
    if (mirror) {
        map.notes.forEach(function (x) { return x.lane = 6 - x.lane; });
    }
    return map;
}


/***/ }),

/***/ "./src/game/Core/GameState.ts":
/*!************************************!*\
  !*** ./src/game/Core/GameState.ts ***!
  \************************************/
/*! exports provided: GameState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameState", function() { return GameState; });
/* harmony import */ var _GameMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GameMap */ "./src/game/Core/GameMap.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Utils/GameEvent */ "./src/game/Utils/GameEvent.ts");
/* harmony import */ var _GameConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GameConfig */ "./src/game/Core/GameConfig.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var scoremap = {
    perfect: 2000,
    great: 1000,
    good: 600,
    bad: 300,
    miss: 0
};
var GameState = /** @class */ (function () {
    function GameState(resources, config) {
        var _this = this;
        this.maxCombo = 0;
        this.currentCombo = 0;
        this.perfect = 0;
        this.great = 0;
        this.good = 0;
        this.bad = 0;
        this.miss = 0;
        this.onMusicTimeUpdate = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_3__["GameEvent"]();
        this.onPointer = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_3__["GameEvent"]();
        this.onJudge = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_3__["GameEvent"]();
        this.onEmptyTap = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_3__["GameEvent"]();
        this.onPause = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_3__["GameEvent"]();
        this.onContinue = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_3__["GameEvent"]();
        this.onFullCombo = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_3__["GameEvent"]();
        this.onEnd = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_3__["GameEvent"]();
        this.onRestart = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_3__["GameEvent"]();
        this.onAbort = new _Utils_GameEvent__WEBPACK_IMPORTED_MODULE_3__["GameEvent"]();
        this.GetMusicTime = function () { return 0; };
        // -------------- private field ----------
        this.maxScore = 0;
        this.currentScore = 0;
        this._ended = false;
        this._paused = false;
        this.judged = 0;
        this.bonus = 0;
        this.map = Object(_GameMap__WEBPACK_IMPORTED_MODULE_0__["FromString"])(resources.map.data, config.mirror);
        this.musicTime = Math.min(-1, this.map.notes[0].time - 5);
        this.maxScore = (scoremap.perfect + 1 + scoremap.perfect + this.map.combo) * this.map.combo / 2;
        this.onJudge.add(function (note) {
            if (_this.ended)
                return "remove";
            _this.addJudge(note.judge);
        });
        this.onEnd.add(function () {
            _this._ended = true;
            _this.onMusicTimeUpdate.clear();
            _this.onPause.clear();
            _this.onContinue.clear();
            _this.onJudge.clear();
            _this.onPointer.clear();
        });
        this.onPause.add(function () { _this._paused = true; });
        this.onContinue.add(function () { _this._paused = false; });
    }
    Object.defineProperty(GameState.prototype, "paused", {
        get: function () { return this._paused; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameState.prototype, "ended", {
        get: function () { return this._ended; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameState.prototype, "score", {
        get: function () { return Math.floor(this.currentScore * 1000000 / this.maxScore); },
        enumerable: true,
        configurable: true
    });
    GameState.prototype.addJudge = function (j) {
        if (j === "perfect" || j === "great") {
            this.currentCombo++;
            if (this.maxCombo < this.currentCombo)
                this.maxCombo = this.currentCombo;
            if (this.currentCombo === this.map.combo)
                this.onFullCombo.emit();
        }
        else {
            this.currentCombo = 0;
        }
        this.currentScore += scoremap[j] + this.currentCombo;
        this[j]++;
        this.judged++;
        // if (this.judged === this.map.combo)
        //     this.onEnd.emit()
    };
    GameState = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["Resources"], _GameConfig__WEBPACK_IMPORTED_MODULE_4__["GameConfig"]])
    ], GameState);
    return GameState;
}());



/***/ }),

/***/ "./src/game/Core/JudgeManager.Auto.ts":
/*!********************************************!*\
  !*** ./src/game/Core/JudgeManager.Auto.ts ***!
  \********************************************/
/*! exports provided: AutoJudgeManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AutoJudgeManager", function() { return AutoJudgeManager; });
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _JudgeManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JudgeManager */ "./src/game/Core/JudgeManager.ts");
/* harmony import */ var _GameState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GameState */ "./src/game/Core/GameState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AutoJudgeManager = /** @class */ (function (_super) {
    __extends(AutoJudgeManager, _super);
    function AutoJudgeManager(state) {
        var _this = _super.call(this) || this;
        var nextJudgeIndex = 0;
        var list = state.map.notes;
        var interval = setInterval(function () {
            if (state.paused)
                return;
            if (state.ended) {
                clearInterval(interval);
            }
            var time = state.GetMusicTime();
            var i = nextJudgeIndex;
            while (i < list.length && list[i].time < time) {
                var note = list[i];
                note.judge = "perfect";
                if (note.type === "slidestart") {
                    note.parent.pointerId = 1;
                    note.parent.nextJudgeIndex = 1;
                }
                else if (note.type === "slideamong") {
                    note.parent.nextJudgeIndex++;
                }
                else if (note.type === "slideend" || note.type === "flickend") {
                    note.parent.pointerId = 0;
                }
                state.onJudge.emit(note);
                i++;
            }
            nextJudgeIndex = i;
        });
        return _this;
    }
    AutoJudgeManager = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_0__["injectable"])(),
        __metadata("design:paramtypes", [_GameState__WEBPACK_IMPORTED_MODULE_2__["GameState"]])
    ], AutoJudgeManager);
    return AutoJudgeManager;
}(_JudgeManager__WEBPACK_IMPORTED_MODULE_1__["AbsctractJudgeManager"]));



/***/ }),

/***/ "./src/game/Core/JudgeManager.ts":
/*!***************************************!*\
  !*** ./src/game/Core/JudgeManager.ts ***!
  \***************************************/
/*! exports provided: AbsctractJudgeManager, JudgeManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AbsctractJudgeManager", function() { return AbsctractJudgeManager; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JudgeManager", function() { return JudgeManager; });
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _GameState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GameState */ "./src/game/Core/GameState.ts");
/* harmony import */ var _GameConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Constants */ "./src/game/Core/Constants.ts");
/* harmony import */ var _core_Utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/Utils */ "./src/core/Utils.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AbsctractJudgeManager = /** @class */ (function () {
    function AbsctractJudgeManager() {
    }
    return AbsctractJudgeManager;
}());

function getJudgeFunction(note) {
    if (note.type === "single")
        return _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].typeA;
    if (note.type === "flick")
        return _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].typeA;
    if (note.type === "slidestart") {
        if (note.parent.long)
            return _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].typeA;
        return _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].typeC;
    }
    if (note.type === "slideamong") {
        if (!note.parent.pointerId)
            return _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].typeC;
        return _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].typeE;
    }
    if (note.type === "slideend") {
        if (!note.parent.pointerId)
            return _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].typeA;
        if (note.parent.long)
            return _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].typeB;
        return _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].typeC;
    }
    if (note.type === "flickend") {
        if (!note.parent.pointerId)
            return _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].typeA;
    }
    return _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].typeD;
}
function slideNowJudge(note) {
    var i = note.parent.nextJudgeIndex || 0;
    return note.parent.notes[i] === note;
}
function distance2(p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return dx * dx + dy * dy;
}
var JudgeManager = /** @class */ (function (_super) {
    __extends(JudgeManager, _super);
    function JudgeManager(state, config) {
        var _this = _super.call(this) || this;
        var list = state.map.notes;
        var pool = [];
        var holdingSlides = new Map();
        var holdingFlicks = new Map();
        var nextJudgeIndex = 0;
        var lastMusicTime = 0;
        // --------------------------------------- Interval Judges ---------------------------------------
        var interval = setInterval(function () {
            if (state.paused)
                return;
            if (state.ended) {
                clearInterval(interval);
            }
            var mt = state.GetMusicTime() + config.judgeOffset / 1000;
            var i = nextJudgeIndex;
            while (i < list.length && list[i].time <= mt + 0.3) {
                if (!list[i].judge)
                    pool.push(list[i]);
                i++;
            }
            nextJudgeIndex = i;
            var removeList = [];
            var ableToMiss = pool.filter(function (x) { return mt - x.time >= 0.1; });
            ableToMiss.forEach(function (x) {
                var j = getJudgeFunction(x)(mt - x.time);
                if (j === "miss") {
                    x.judge = j;
                    if (x.type === "slidestart") {
                        x.parent.nextJudgeIndex = 1;
                    }
                    else if (x.type !== "single" && x.type !== "flick") {
                        x.parent.nextJudgeIndex++;
                        if (x.type !== "slideamong") {
                            holdingSlides.delete(x.parent.pointerId);
                            holdingFlicks.delete(x.parent.pointerId);
                            x.parent.pointerId = undefined;
                        }
                    }
                    else if (x.type === "flick") {
                        holdingFlicks.delete(x.pointerId);
                        x.pointerId = undefined;
                    }
                    state.onJudge.emit(x);
                    removeList.push(x);
                }
            });
            if (removeList.length > 0) {
                pool = pool.filter(function (x) { return removeList.indexOf(x) < 0; });
                removeList.length = 0;
            }
            var slideAmongs = pool.filter(function (x) { return x.type === "slideamong" && x.parent.pointerId && slideNowJudge(x); });
            slideAmongs.forEach(function (x) {
                var s = x;
                var j = getJudgeFunction(s)(mt - s.time);
                if (j === "perfect") { // this only indicates we can judge it now
                    var p = s.parent;
                    var info = holdingSlides.get(p.pointerId);
                    if (info) {
                        if (Math.abs(Object(_core_Utils__WEBPACK_IMPORTED_MODULE_4__["findex"])(info.track, -1).lane - s.lane) <= 1) { // todo: care about this
                            s.judge = j;
                            p.nextJudgeIndex++;
                            state.onJudge.emit(s);
                            removeList.push(x);
                        }
                    }
                }
            });
            if (removeList.length > 0) {
                pool = pool.filter(function (x) { return removeList.indexOf(x) < 0; });
                removeList.length = 0;
            }
            var hodingfs = [];
            holdingFlicks.forEach(function (x) { return hodingfs.push(x); });
            hodingfs.forEach(function (x) {
                var jt = x.note.type === "flick" ? x.start.time : x.note.time;
                if (mt - jt > _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].flickOutTime) {
                    x.note.judge = "miss";
                    if (x.note.type === "flickend") {
                        holdingSlides.delete(x.note.parent.pointerId);
                        x.note.parent.pointerId = undefined;
                        x.note.parent.nextJudgeIndex++;
                    }
                    holdingFlicks.delete(x.start.pointerId);
                    state.onJudge.emit(x.note);
                    removeList.push(x.note);
                }
            });
            if (removeList.length > 0) {
                pool = pool.filter(function (x) { return removeList.indexOf(x) < 0; });
                removeList.length = 0;
            }
            var flickEnd = pool.filter(function (x) { return x.type === "flickend" && !x.parent.long && x.parent.pointerId; });
            flickEnd.forEach(function (x) {
                var func = getJudgeFunction(x);
                if (func(mt - x.time) === "perfect" && func(lastMusicTime - x.time) === undefined) {
                    var s = x;
                    var start = Object(_core_Utils__WEBPACK_IMPORTED_MODULE_4__["findex"])(holdingSlides.get(s.parent.pointerId).track, -1);
                    if (Math.abs(start.lane - s.lane) <= 1) {
                        holdingFlicks.set(s.parent.pointerId, {
                            note: s,
                            start: start
                        });
                    }
                    else {
                        holdingSlides.delete(s.parent.pointerId);
                        s.parent.pointerId = undefined;
                        s.parent.nextJudgeIndex++;
                        s.judge = "miss";
                        state.onJudge.emit(s);
                        removeList.push(s);
                    }
                }
            });
            if (removeList.length > 0) {
                pool = pool.filter(function (x) { return removeList.indexOf(x) < 0; });
                removeList.length = 0;
            }
            pool.forEach(function (x) {
                if ("parent" in x && x.type !== "slidestart") {
                    var index = (x.parent.nextJudgeIndex || 0) + 1;
                    if (x.parent.notes[index] === x && mt >= x.time && lastMusicTime < x.time) {
                        var last = x.parent.notes[index - 1];
                        if (last.judge)
                            return;
                        last.judge = "miss";
                        x.parent.nextJudgeIndex = index;
                        state.onJudge.emit(last);
                        removeList.push(last);
                    }
                }
            });
            if (removeList.length > 0) {
                pool = pool.filter(function (x) { return removeList.indexOf(x) < 0; });
                removeList.length = 0;
            }
            lastMusicTime = mt;
        });
        // --------------------------------------- Pointer Events ---------------------------------------
        state.onPointer.add(function (pointer) {
            if (state.ended)
                return "remove";
            if (state.paused)
                return;
            var mt = state.GetMusicTime() + config.judgeOffset / 1000;
            pointer.time = mt;
            var comparator = function (l, r) {
                var dt = Math.abs(l.time - mt) - Math.abs(r.time - mt);
                if (dt)
                    return dt;
                return Math.abs(l.lane - pointer.lane) - Math.abs(r.lane - pointer.lane);
            };
            var removeList = [];
            var downHandled = false;
            switch (pointer.type) {
                case "down": {
                    if (pointer.lane < 0)
                        break;
                    var canDown = pool.filter(function (x) {
                        if (Math.abs(x.lane - pointer.lane) > 1)
                            return false;
                        if ("parent" in x && !slideNowJudge(x))
                            return false;
                        if (x.type === "flick" && x.pointerId)
                            return false;
                        if ((x.type === "slideamong" || x.type === "slideend" || x.type === "flickend") && x.parent.pointerId)
                            return false;
                        return true;
                    });
                    if (canDown.length <= 0)
                        break;
                    canDown = canDown.sort(comparator); // can be optimised by heap
                    var n = canDown[0];
                    var j = getJudgeFunction(n)(mt - n.time);
                    if (j !== undefined) {
                        if (n.type !== "flick" && n.type !== "flickend") {
                            downHandled = true;
                            n.judge = j;
                            if (n.type === "slidestart" || n.type === "slideamong") {
                                n.parent.pointerId = pointer.pointerId;
                                if (!n.parent.nextJudgeIndex)
                                    n.parent.nextJudgeIndex = 0;
                                n.parent.nextJudgeIndex++;
                                holdingSlides.set(pointer.pointerId, {
                                    track: [pointer],
                                    slide: n.parent
                                });
                                if (n.type === "slidestart" && n.parent.long && n.parent.flickend) {
                                    holdingFlicks.set(pointer.pointerId, {
                                        note: n.parent.notes[1],
                                        start: pointer
                                    });
                                }
                            }
                            else if (n.type === "slideend") {
                                n.parent.nextJudgeIndex++;
                                n.parent.pointerId = undefined;
                            }
                            state.onJudge.emit(n);
                            removeList.push(n);
                        }
                        else {
                            downHandled = true;
                            holdingFlicks.set(pointer.pointerId, {
                                note: n,
                                start: pointer
                            });
                            if (n.type === "flick")
                                n.pointerId = pointer.pointerId;
                        }
                    }
                    break;
                }
                case "up": {
                    var f = holdingFlicks.get(pointer.pointerId);
                    var s = holdingSlides.get(pointer.pointerId);
                    if (f) {
                        f.note.judge = "miss";
                        if (f.note.type === "flickend") {
                            f.note.parent.pointerId = undefined;
                            f.note.parent.nextJudgeIndex++;
                        }
                        removeList.push(f.note);
                        state.onJudge.emit(f.note);
                    }
                    else if (s) {
                        var n = s.slide.notes[s.slide.nextJudgeIndex];
                        if (n) {
                            if (n.type === "slideamong" || n.type === "flickend") {
                                n.parent.pointerId = undefined;
                                n.parent.nextJudgeIndex++;
                                n.judge = "miss";
                                removeList.push(n);
                                state.onJudge.emit(n);
                            }
                            else if (n.type === "slideend") {
                                var j = getJudgeFunction(n)(mt - n.time);
                                if (j === undefined || Math.abs(pointer.lane - n.lane) > 1)
                                    j = "miss";
                                n.judge = j;
                                n.parent.pointerId = undefined;
                                n.parent.nextJudgeIndex++;
                                removeList.push(n);
                                state.onJudge.emit(n);
                            }
                        }
                    }
                    holdingSlides.delete(pointer.pointerId);
                    holdingFlicks.delete(pointer.pointerId);
                    break;
                }
                case "move": {
                    var pointerHis = holdingSlides.get(pointer.pointerId);
                    if (pointerHis)
                        pointerHis.track.push(pointer);
                    var f = holdingFlicks.get(pointer.pointerId);
                    if (f) {
                        if (distance2(f.start, pointer) > _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].flickOutDis * _Constants__WEBPACK_IMPORTED_MODULE_3__["JudgeOffset"].flickOutDis) {
                            var jt = f.note.type === "flick" ? f.start.time : mt;
                            var j = getJudgeFunction(f.note)(jt - f.note.time);
                            if (j !== undefined) {
                                if (f.note.type === "flickend") {
                                    f.note.parent.pointerId = undefined;
                                    f.note.parent.nextJudgeIndex++;
                                }
                                f.note.judge = j;
                                removeList.push(f.note);
                                state.onJudge.emit(f.note);
                                holdingSlides.delete(pointer.pointerId);
                                holdingFlicks.delete(pointer.pointerId);
                            }
                        }
                    }
                    break;
                }
            }
            if (removeList.length > 0) {
                pool = pool.filter(function (x) { return removeList.indexOf(x) < 0; });
                removeList.length = 0;
            }
            if (pointer.type === "down" && !downHandled) {
                if (pointer.lane !== -1)
                    state.onEmptyTap.emit(pointer.lane);
            }
        });
        return _this;
    }
    JudgeManager = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_0__["injectable"])(),
        __metadata("design:paramtypes", [_GameState__WEBPACK_IMPORTED_MODULE_1__["GameState"], _GameConfig__WEBPACK_IMPORTED_MODULE_2__["GameConfig"]])
    ], JudgeManager);
    return JudgeManager;
}(AbsctractJudgeManager));



/***/ }),

/***/ "./src/game/Core/MusicManager.ts":
/*!***************************************!*\
  !*** ./src/game/Core/MusicManager.ts ***!
  \***************************************/
/*! exports provided: MusciManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MusciManager", function() { return MusciManager; });
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _GameState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GameState */ "./src/game/Core/GameState.ts");
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _GameConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var _core_Utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/Utils */ "./src/core/Utils.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MusciManager = /** @class */ (function () {
    function MusciManager(state, resources, events, config) {
        var music = resources.music.data;
        music.stop();
        var musicid = music.play();
        music.pause(musicid);
        music.seek(0, musicid);
        var endPadding = Math.max(4 - music.duration() + Object(_core_Utils__WEBPACK_IMPORTED_MODULE_4__["findex"])(state.map.notes, -1).time, 0);
        music.once("end", function () {
            events.Update.add(function (dt) {
                if (state.ended)
                    return "remove";
                if (state.paused)
                    return;
                endPadding -= dt;
                if (endPadding < 0) {
                    state.onEnd.emit();
                    return "remove";
                }
            });
        });
        var started = false;
        var padding = Math.min(state.musicTime, -1);
        var lastMt = performance.now();
        var lastTime = performance.now();
        state.GetMusicTime = function () {
            var mt = music.seek(musicid);
            if (mt === lastMt)
                mt += (performance.now() - lastTime) / 1000;
            return mt;
        };
        events.Update.add(function (dt) {
            if (state.ended)
                return "remove";
            if (state.paused)
                return;
            var mt = 0;
            if (!started) {
                padding += dt;
                mt = padding;
                if (padding >= 0) {
                    started = true;
                    music.play(musicid);
                    mt = music.seek(musicid);
                }
            }
            else {
                mt = music.seek(musicid);
            }
            if (lastMt === mt) {
                mt += (performance.now() - lastTime) / 1000;
            }
            else {
                lastMt = mt;
                lastTime = performance.now();
            }
            state.onMusicTimeUpdate.emit({
                musicTime: mt,
                visualTime: mt + config.visualOffset / 1000,
                judgeTime: mt + config.judgeOffset / 1000
            });
        });
        events.WindowBlur.add(function () {
            state.onPause.emit();
        });
        // events.WindowFocus.add(() => {
        //     state.onContinue.emit()
        // })
        state.onPause.add(function () {
            music.pause(musicid);
        });
        state.onContinue.add(function () {
            music.play(musicid);
        });
        state.onMusicTimeUpdate.add(function (mt) {
            if (state.onMusicTimeUpdate.prevArgs)
                if (state.onMusicTimeUpdate.prevArgs[0].musicTime === mt.musicTime)
                    console.warn("no use music time update:", mt.musicTime);
        });
        events.End.add(function () {
            music.stop();
            music.unload();
        });
    }
    MusciManager = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_0__["injectable"])(),
        __metadata("design:paramtypes", [_GameState__WEBPACK_IMPORTED_MODULE_1__["GameState"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["Resources"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["GlobalEvents"], _GameConfig__WEBPACK_IMPORTED_MODULE_3__["GameConfig"]])
    ], MusciManager);
    return MusciManager;
}());



/***/ }),

/***/ "./src/game/Core/Projection.ts":
/*!*************************************!*\
  !*** ./src/game/Core/Projection.ts ***!
  \*************************************/
/*! exports provided: projection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "projection", function() { return projection; });
/* harmony import */ var _Constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Constants */ "./src/game/Core/Constants.ts");
/* harmony import */ var _core_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/Utils */ "./src/core/Utils.ts");


/**
 * fall function
 * @param t 0: near, -1: far
 * @returns 0 -> 1, ratio of y
 */
function fall(t) {
    return Math.pow(1.1, 50 * t);
}
var falllist = [];
for (var i = 0; i < 100; i++) {
    falllist.push(Math.pow(1.1, i - 50));
}
function fastfall(t) {
    var tt = (t + 1) * 50;
    var i = Math.floor(tt);
    if (i > 98)
        i = 98;
    else if (i < 0)
        i = 0;
    return Object(_core_Utils__WEBPACK_IMPORTED_MODULE_1__["ratio"])(i, i + 1, tt, falllist[i], falllist[i + 1]);
}
/**
 * projection
 * @param trackpos 0: near, -1: far
 * @param laneOffset Lane center x or other
 */
function projection(trackpos, laneOffset) {
    // const f = fall(trackpos);
    var f = fastfall(trackpos);
    var r = ((_Constants__WEBPACK_IMPORTED_MODULE_0__["FarLineZ"] - 1) * f + 1) / _Constants__WEBPACK_IMPORTED_MODULE_0__["FarLineZ"];
    return {
        x: _Constants__WEBPACK_IMPORTED_MODULE_0__["CenterX"] + (laneOffset - _Constants__WEBPACK_IMPORTED_MODULE_0__["CenterX"]) * r,
        y: _Constants__WEBPACK_IMPORTED_MODULE_0__["LaneInfY"] + (_Constants__WEBPACK_IMPORTED_MODULE_0__["LaneBottomY"] - _Constants__WEBPACK_IMPORTED_MODULE_0__["LaneInfY"]) * r,
        scale: r,
    };
}


/***/ }),

/***/ "./src/game/Core/SoundManager.ts":
/*!***************************************!*\
  !*** ./src/game/Core/SoundManager.ts ***!
  \***************************************/
/*! exports provided: SoundManager */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SoundManager", function() { return SoundManager; });
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _GameState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GameState */ "./src/game/Core/GameState.ts");
/* harmony import */ var _GameConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GameConfig */ "./src/game/Core/GameConfig.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SoundManager = /** @class */ (function () {
    function SoundManager(resources, state, config, events) {
        this.state = state;
        var sounds = {
            perfect: resources.perfect.data,
            great: resources.great.data,
            good: resources.good.data,
            flick: resources.flick.data,
            long: resources.long.data,
            button: resources.button.data
        };
        var lastTime = {};
        var play = function (s) {
            var now = performance.now();
            if (lastTime[s] && now - lastTime[s] < 10)
                return;
            lastTime[s] = now;
            sounds[s].play();
        };
        for (var prop in sounds) {
            sounds[prop].volume(config.effectVolume);
        }
        state.onJudge.add(function (note) {
            if (state.ended)
                return "remove";
            if (note.judge === "miss") {
                if (note.type !== "single" && note.type !== "flick") {
                    //
                }
            }
            else if (note.judge !== "bad") {
                if (note.type === "flick" || note.type === "flickend") {
                    play("flick");
                }
                else {
                    play(note.judge);
                }
            }
        });
        state.onEmptyTap.add(function () {
            if (state.ended)
                return "remove";
            play("button");
        });
        events.End.add(function () {
            for (var prop in sounds) {
                sounds[prop].unload();
            }
        });
    }
    SoundManager = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_0__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__["Resources"], _GameState__WEBPACK_IMPORTED_MODULE_2__["GameState"], _GameConfig__WEBPACK_IMPORTED_MODULE_3__["GameConfig"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__["GlobalEvents"]])
    ], SoundManager);
    return SoundManager;
}());



/***/ }),

/***/ "./src/game/Game.ts":
/*!**************************!*\
  !*** ./src/game/Game.ts ***!
  \**************************/
/*! exports provided: Game */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Game", function() { return Game; });
/* harmony import */ var reflect_metadata__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! reflect-metadata */ "./node_modules/reflect-metadata/Reflect.js");
/* harmony import */ var reflect_metadata__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(reflect_metadata__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Utils_Ticker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Utils/Ticker */ "./src/game/Utils/Ticker.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Core/GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Scenes_LoadingScene__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Scenes/LoadingScene */ "./src/game/Scenes/LoadingScene.ts");
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Utils_Utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Utils/Utils */ "./src/game/Utils/Utils.ts");
/* harmony import */ var _Utils_SceneSwitcher__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Utils/SceneSwitcher */ "./src/game/Utils/SceneSwitcher.ts");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_8__);









var Game = /** @class */ (function () {
    function Game(canvas, config, loadConfig) {
        var _this = this;
        this.stage = new _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_5__["MainStage"]();
        this.ticker = new _Utils_Ticker__WEBPACK_IMPORTED_MODULE_1__["Ticker"]();
        this.ioc = new inversify__WEBPACK_IMPORTED_MODULE_3__["Container"]({ skipBaseClassChecks: true });
        this.events = new _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_5__["GlobalEvents"]();
        this._destroyed = false;
        this.renderer = Object(pixi_js__WEBPACK_IMPORTED_MODULE_8__["autoDetectRenderer"])({
            view: canvas,
            width: canvas.clientWidth,
            height: canvas.clientHeight,
            resolution: config.resolution,
        });
        this.ioc.bind(inversify__WEBPACK_IMPORTED_MODULE_3__["Container"]).toConstantValue(this.ioc);
        this.ioc.bind(_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_5__["MainStage"]).toConstantValue(this.stage);
        this.ioc.bind(_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_5__["GlobalEvents"]).toConstantValue(this.events);
        if (config instanceof _Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__["GameConfig"])
            this.ioc.bind(_Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__["GameConfig"]).toConstantValue(config);
        else
            this.ioc.bind(_Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__["GameConfig"]).toConstantValue(Object.assign(new _Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__["GameConfig"](), config));
        if (loadConfig instanceof _Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__["GameLoadConfig"])
            this.ioc.bind(_Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__["GameLoadConfig"]).toConstantValue(loadConfig);
        else
            this.ioc.bind(_Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__["GameLoadConfig"]).toConstantValue(Object.assign(new _Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__["GameLoadConfig"](), loadConfig));
        this.ioc.bind(_Utils_SceneSwitcher__WEBPACK_IMPORTED_MODULE_7__["SceneSwitcher"]).toSelf().inSingletonScope();
        this.ticker.Tick.add(function (delta, now) {
            _this.resize();
            _this.events.Update.emit(delta, now);
            _this.renderer.render(_this.stage);
        });
        this.resize();
        this.stage.addChild(this.ioc.resolve(_Scenes_LoadingScene__WEBPACK_IMPORTED_MODULE_4__["LoadingScene"]));
        Object(_Utils_Utils__WEBPACK_IMPORTED_MODULE_6__["addAutoListener"])(window, "blur", function () {
            if (_this._destroyed)
                return "remove";
            _this.events.WindowBlur.emit();
            _this.ticker.Stop();
        });
        Object(_Utils_Utils__WEBPACK_IMPORTED_MODULE_6__["addAutoListener"])(window, "focus", function () {
            if (_this._destroyed)
                return "remove";
            _this.ticker.Start();
            _this.events.WindowFocus.emit();
        });
        this.events.End.add(function () {
            if (_this._destroyed)
                return "remove";
            _this.destroy();
        });
    }
    Game.prototype.start = function () {
        this.ticker.Start();
    };
    Game.prototype.pause = function () {
        this.ticker.Stop();
    };
    Game.prototype.destroy = function () {
        if (this._destroyed)
            return;
        this._destroyed = true;
        this.ticker.Stop();
        this.ticker.Tick.clear();
        this.events.End.emit();
        for (var e in this.events)
            this.events[e].clear();
        this.ioc.unbindAll();
        this.stage.destroy();
        this.renderer.clear();
        this.renderer.destroy();
        pixi_js__WEBPACK_IMPORTED_MODULE_8__["utils"].clearTextureCache();
        if (this.ondestroyed instanceof Function)
            this.ondestroyed();
    };
    Game.prototype.resize = function () {
        var h = window.innerHeight;
        var w = window.innerWidth;
        var s = this.renderer.screen;
        if (h !== s.height || w !== s.width || !this.events.Resize.prevArgs) {
            this.renderer.resize(w, h);
            this.events.Resize.emit(w, h);
        }
    };
    return Game;
}());



/***/ }),

/***/ "./src/game/Layers/BackgroundLayer.ts":
/*!********************************************!*\
  !*** ./src/game/Layers/BackgroundLayer.ts ***!
  \********************************************/
/*! exports provided: BackgroundLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BackgroundLayer", function() { return BackgroundLayer; });
/* harmony import */ var _Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Common/FixRatioContainer */ "./src/game/Common/FixRatioContainer.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_4__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var BackgroundLayer = /** @class */ (function (_super) {
    __extends(BackgroundLayer, _super);
    function BackgroundLayer(config, resources, events) {
        var _this = _super.call(this, 0, 0) || this;
        var bg = new pixi_js__WEBPACK_IMPORTED_MODULE_4__["Sprite"](resources.background.texture);
        bg.alpha = 1 - config.backgroundDim;
        _this.setInit(bg.width, bg.height);
        {
            var _a = events.Resize.prevArgs, w = _a[0], h = _a[1];
            _this.resize(w, h, true);
        }
        events.Resize.add(function (w, h) {
            if (!_this.parent)
                return "remove";
            _this.resize(w, h, true);
        });
        _this.addChild(bg);
        return _this;
    }
    BackgroundLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__["GameConfig"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_3__["Resources"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_3__["GlobalEvents"]])
    ], BackgroundLayer);
    return BackgroundLayer;
}(_Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_0__["FixRatioContainer"]));



/***/ }),

/***/ "./src/game/Layers/Components/FlickNoteSprite.ts":
/*!*******************************************************!*\
  !*** ./src/game/Layers/Components/FlickNoteSprite.ts ***!
  \*******************************************************/
/*! exports provided: FlickNoteSprite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FlickNoteSprite", function() { return FlickNoteSprite; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_2__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var FlickNoteSprite = /** @class */ (function (_super) {
    __extends(FlickNoteSprite, _super);
    function FlickNoteSprite(resource, helper) {
        var _this = _super.call(this) || this;
        _this.resource = resource;
        _this.helper = helper;
        _this.shouldRemove = false;
        _this.anchor.set(0.5);
        _this.visible = false;
        _this.top = new pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"](resource.game.textures.flick_top);
        _this.top.anchor.set(0.5, 1);
        _this.addChild(_this.top);
        return _this;
    }
    FlickNoteSprite.prototype.setTexture = function (lane) {
        this.texture = this.resource.game.textures["flick_" + lane];
    };
    FlickNoteSprite.prototype.applyInfo = function (note) {
        this.note = note;
        this.setTexture(note.lane);
        this.shouldRemove = false;
        this.visible = true;
    };
    FlickNoteSprite.prototype.update = function (musicTime) {
        if (this.visible === false || this.shouldRemove)
            return;
        if (this.note.judge || musicTime > this.note.time + 1) {
            this.shouldRemove = true;
            this.visible = false;
            this.zIndex = 0;
            return;
        }
        var p = this.helper.calc(this.note, musicTime);
        this.position.set(p.x, p.y);
        this.helper.setScale(this, p.scale);
        this.top.y = Math.sin(musicTime * 10) * 30 - 30;
        this.zIndex = p.scale;
    };
    FlickNoteSprite = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_2__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__["Resources"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__["NoteHelper"]])
    ], FlickNoteSprite);
    return FlickNoteSprite;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"]));



/***/ }),

/***/ "./src/game/Layers/Components/SimLineSprite.ts":
/*!*****************************************************!*\
  !*** ./src/game/Layers/Components/SimLineSprite.ts ***!
  \*****************************************************/
/*! exports provided: SimLineSprite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimLineSprite", function() { return SimLineSprite; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SimLineSprite = /** @class */ (function (_super) {
    __extends(SimLineSprite, _super);
    function SimLineSprite(resources, helper) {
        var _this = _super.call(this, resources.game.textures.simultaneous_line) || this;
        _this.helper = helper;
        _this.shouldRemove = false;
        _this.anchor.set(0.5);
        _this.visible = false;
        return _this;
    }
    SimLineSprite.prototype.applyInfo = function (sim) {
        this.sim = sim;
        this.shouldRemove = false;
        this.visible = true;
    };
    SimLineSprite.prototype.update = function (musicTime) {
        if (this.visible === false || this.shouldRemove)
            return;
        if (this.sim.left.judge || this.sim.right.judge || musicTime > this.sim.left.time + 1) {
            this.shouldRemove = true;
            this.visible = false;
            this.zIndex = 0;
            return;
        }
        var lp = this.helper.calc(this.sim.left, musicTime);
        var rp = this.helper.calc(this.sim.right, musicTime);
        this.height = lp.scale * this.texture.height * this.helper.noteScale;
        this.width = lp.x - rp.x;
        this.x = (lp.x + rp.x) / 2;
        this.y = lp.y;
        this.zIndex = lp.scale;
    };
    SimLineSprite = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["Resources"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["NoteHelper"]])
    ], SimLineSprite);
    return SimLineSprite;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"]));



/***/ }),

/***/ "./src/game/Layers/Components/SingleNoteSprite.ts":
/*!********************************************************!*\
  !*** ./src/game/Layers/Components/SingleNoteSprite.ts ***!
  \********************************************************/
/*! exports provided: SingleNoteSprite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SingleNoteSprite", function() { return SingleNoteSprite; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SingleNoteSprite = /** @class */ (function (_super) {
    __extends(SingleNoteSprite, _super);
    function SingleNoteSprite(resource, helper, config) {
        var _this = _super.call(this) || this;
        _this.resource = resource;
        _this.helper = helper;
        _this.config = config;
        _this.shouldRemove = false;
        _this.anchor.set(0.5);
        _this.visible = false;
        return _this;
    }
    SingleNoteSprite.prototype.setTexture = function (lane) {
        if (!this.note.onbeat && this.config.beatNote)
            this.texture = this.resource.game.textures["gray_" + lane];
        else
            this.texture = this.resource.game.textures["single_" + lane];
    };
    SingleNoteSprite.prototype.applyInfo = function (note) {
        this.note = note;
        this.setTexture(note.lane);
        this.shouldRemove = false;
        this.visible = true;
    };
    SingleNoteSprite.prototype.update = function (musicTime) {
        if (this.visible === false || this.shouldRemove)
            return;
        if (this.note.judge || musicTime > this.note.time + 1) {
            this.shouldRemove = true;
            this.visible = false;
            this.zIndex = 0;
            return;
        }
        var p = this.helper.calc(this.note, musicTime);
        this.position.set(p.x, p.y);
        this.helper.setScale(this, p.scale);
        this.zIndex = p.scale;
    };
    SingleNoteSprite = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_2__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__["Resources"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__["NoteHelper"], _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__["GameConfig"]])
    ], SingleNoteSprite);
    return SingleNoteSprite;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"]));



/***/ }),

/***/ "./src/game/Layers/Components/SlideAmongSprite.ts":
/*!********************************************************!*\
  !*** ./src/game/Layers/Components/SlideAmongSprite.ts ***!
  \********************************************************/
/*! exports provided: SlideAmongSprite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SlideAmongSprite", function() { return SlideAmongSprite; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_2__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SlideAmongSprite = /** @class */ (function (_super) {
    __extends(SlideAmongSprite, _super);
    function SlideAmongSprite(resource, helper) {
        var _this = _super.call(this, resource.game.textures.slide_among) || this;
        _this.helper = helper;
        _this.shouldRemove = false;
        _this.anchor.set(0.5);
        _this.visible = false;
        return _this;
    }
    SlideAmongSprite.prototype.applyInfo = function (note) {
        this.note = note;
        this.shouldRemove = false;
        this.visible = true;
    };
    SlideAmongSprite.prototype.update = function (musicTime) {
        if (this.visible === false || this.shouldRemove)
            return;
        if (this.note.judge || musicTime > this.note.time + 1) {
            this.shouldRemove = true;
            this.visible = false;
            this.zIndex = 0;
            return;
        }
        var p = this.helper.calc(this.note, musicTime);
        this.position.set(p.x, p.y);
        this.helper.setScale(this, p.scale);
        this.zIndex = p.scale;
    };
    SlideAmongSprite = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_2__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__["Resources"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__["NoteHelper"]])
    ], SlideAmongSprite);
    return SlideAmongSprite;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"]));



/***/ }),

/***/ "./src/game/Layers/Components/SlideBarSprite.ts":
/*!******************************************************!*\
  !*** ./src/game/Layers/Components/SlideBarSprite.ts ***!
  \******************************************************/
/*! exports provided: SlideBarSprite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SlideBarSprite", function() { return SlideBarSprite; });
/* harmony import */ var _Common_Sprite2d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Common/Sprite2d */ "./src/game/Common/Sprite2d.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _core_Utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../core/Utils */ "./src/core/Utils.ts");
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Core/Constants */ "./src/game/Core/Constants.ts");
/* harmony import */ var _Core_Projection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../Core/Projection */ "./src/game/Core/Projection.ts");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_6__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SlideBarSprite = /** @class */ (function (_super) {
    __extends(SlideBarSprite, _super);
    function SlideBarSprite(resources, helper) {
        var _this = _super.call(this, resources.game.textures.slide_bar) || this;
        _this.helper = helper;
        _this.shouldRemove = false;
        _this.anchor.set(0.5, 1);
        _this.visible = false;
        return _this;
    }
    SlideBarSprite.prototype.applyInfo = function (bar) {
        this.bar = bar;
        this.visible = true;
        this.shouldRemove = false;
    };
    SlideBarSprite.prototype.update = function (musicTime) {
        if (this.visible === false || this.shouldRemove)
            return;
        var st = this.bar.start.time;
        if (st < musicTime && this.bar.start.parent.pointerId)
            st = musicTime;
        var et = this.bar.end.time;
        if (et > musicTime + this.helper.staytime)
            et = musicTime + this.helper.staytime;
        if (this.bar.end.judge || this.bar.start.judge === "miss" || st >= et || musicTime > this.bar.end.time + 1
            || (!this.bar.start.parent.pointerId && musicTime > this.bar.start.time + 1)) {
            this.shouldRemove = true;
            this.visible = false;
            this.zIndex = 0;
            return;
        }
        var startPos = Object(_core_Utils__WEBPACK_IMPORTED_MODULE_3__["ratio"])(this.bar.start.time, this.bar.end.time, st, _Core_Constants__WEBPACK_IMPORTED_MODULE_4__["LaneCenterXs"][this.bar.start.lane], _Core_Constants__WEBPACK_IMPORTED_MODULE_4__["LaneCenterXs"][this.bar.end.lane]);
        var startT = (musicTime - st) / this.helper.staytime;
        var sp = Object(_Core_Projection__WEBPACK_IMPORTED_MODULE_5__["projection"])(startT, startPos);
        var endPos = Object(_core_Utils__WEBPACK_IMPORTED_MODULE_3__["ratio"])(this.bar.start.time, this.bar.end.time, et, _Core_Constants__WEBPACK_IMPORTED_MODULE_4__["LaneCenterXs"][this.bar.start.lane], _Core_Constants__WEBPACK_IMPORTED_MODULE_4__["LaneCenterXs"][this.bar.end.lane]);
        var endT = (musicTime - et) / this.helper.staytime;
        var ep = Object(_Core_Projection__WEBPACK_IMPORTED_MODULE_5__["projection"])(endT, endPos);
        var f = sp.scale / ep.scale;
        var sx = this.helper.noteScale * sp.scale / _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["NoteHelper"].noteInitScale;
        var sy = (sp.y - ep.y) / this.texture.height * f;
        this.transform.setFromMatrix(new pixi_js__WEBPACK_IMPORTED_MODULE_6__["Matrix"](sx, 0, (ep.x - sp.x) / (ep.y - sp.y) * sy, sy, sp.x, sp.y));
        this.projectionY = 1 - f;
        this.zIndex = sp.scale;
    };
    SlideBarSprite = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["Resources"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["NoteHelper"]])
    ], SlideBarSprite);
    return SlideBarSprite;
}(_Common_Sprite2d__WEBPACK_IMPORTED_MODULE_0__["Sprite2d"]));



/***/ }),

/***/ "./src/game/Layers/Components/SlideNoteSprite.ts":
/*!*******************************************************!*\
  !*** ./src/game/Layers/Components/SlideNoteSprite.ts ***!
  \*******************************************************/
/*! exports provided: SlideNoteSprite */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SlideNoteSprite", function() { return SlideNoteSprite; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_2__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SlideNoteSprite = /** @class */ (function (_super) {
    __extends(SlideNoteSprite, _super);
    function SlideNoteSprite(resource, helper) {
        var _this = _super.call(this) || this;
        _this.resource = resource;
        _this.helper = helper;
        _this.shouldRemove = false;
        _this.anchor.set(0.5);
        _this.visible = false;
        return _this;
    }
    SlideNoteSprite.prototype.setTexture = function (lane) {
        this.texture = this.resource.game.textures["slide_" + lane];
    };
    SlideNoteSprite.prototype.applyInfo = function (note) {
        this.note = note;
        this.setTexture(note.lane);
        this.shouldRemove = false;
        this.visible = true;
    };
    SlideNoteSprite.prototype.update = function (musicTime) {
        if (this.visible === false || this.shouldRemove)
            return;
        if (this.note.judge || musicTime > this.note.time + 1) {
            this.shouldRemove = true;
            this.visible = false;
            this.zIndex = 0;
            return;
        }
        var p = this.helper.calc(this.note, musicTime);
        this.position.set(p.x, p.y);
        this.helper.setScale(this, p.scale);
        this.zIndex = p.scale;
    };
    SlideNoteSprite = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_2__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__["Resources"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__["NoteHelper"]])
    ], SlideNoteSprite);
    return SlideNoteSprite;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"]));



/***/ }),

/***/ "./src/game/Layers/DebugLayer.ts":
/*!***************************************!*\
  !*** ./src/game/Layers/DebugLayer.ts ***!
  \***************************************/
/*! exports provided: DebugLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DebugLayer", function() { return DebugLayer; });
/* harmony import */ var _Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Common/FixRatioContainer */ "./src/game/Common/FixRatioContainer.ts");
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Core/Constants */ "./src/game/Core/Constants.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DebugLayer = /** @class */ (function (_super) {
    __extends(DebugLayer, _super);
    function DebugLayer(events, config) {
        var _this = _super.call(this, _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerWidth"], _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerHeight"]) || this;
        _this.visible = config.debug;
        _this.alpha = 0.2;
        _this.resize.apply(_this, events.Resize.prevArgs);
        events.Resize.add(function (w, h) {
            if (!_this.parent)
                return "remove";
            _this.resize(w, h);
        });
        var border = new pixi_js__WEBPACK_IMPORTED_MODULE_4__["Graphics"]();
        border.lineStyle(2, 0xff8800);
        border.moveTo(0, 0).lineTo(0, _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerHeight"]).lineTo(_Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerWidth"], _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerHeight"]).lineTo(_Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerWidth"], 0).lineTo(0, 0);
        _this.addChild(border);
        var nearFarLines = new pixi_js__WEBPACK_IMPORTED_MODULE_4__["Graphics"]();
        nearFarLines.lineStyle(4, 0x0088ff);
        nearFarLines.moveTo(0, _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneBottomY"]).lineTo(_Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerWidth"], _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneBottomY"]);
        nearFarLines.lineStyle(2, 0x0088ff);
        nearFarLines.moveTo(0, _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["FarLineY"]).lineTo(_Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerWidth"], _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["FarLineY"]);
        _this.addChild(nearFarLines);
        var centerLines = new pixi_js__WEBPACK_IMPORTED_MODULE_4__["Graphics"]();
        centerLines.lineStyle(2, 0x004422);
        _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneCenterXs"].forEach(function (x) {
            centerLines.moveTo(_Core_Constants__WEBPACK_IMPORTED_MODULE_1__["CenterX"], _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneInfY"]).lineTo(x, _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneBottomY"]);
        });
        _this.addChild(centerLines);
        var borderLines = new pixi_js__WEBPACK_IMPORTED_MODULE_4__["Graphics"]();
        borderLines.lineStyle(2, 0x00aa44);
        var borderXs = _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneCenterXs"].map(function (x) { return x - _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneWidth"] / 2; });
        borderXs.push(borderXs[borderXs.length - 1] + _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneWidth"]);
        borderXs.forEach(function (x) {
            borderLines.moveTo(_Core_Constants__WEBPACK_IMPORTED_MODULE_1__["CenterX"], _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneInfY"]).lineTo(x, _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneBottomY"]);
        });
        _this.addChild(borderLines);
        return _this;
    }
    DebugLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_2__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_3__["GlobalEvents"],
            _Core_GameConfig__WEBPACK_IMPORTED_MODULE_5__["GameConfig"]])
    ], DebugLayer);
    return DebugLayer;
}(_Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_0__["FixRatioContainer"]));



/***/ }),

/***/ "./src/game/Layers/FinishLayer.ts":
/*!****************************************!*\
  !*** ./src/game/Layers/FinishLayer.ts ***!
  \****************************************/
/*! exports provided: FinishLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FinishLayer", function() { return FinishLayer; });
/* harmony import */ var _Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Common/FixRatioContainer */ "./src/game/Common/FixRatioContainer.ts");
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Core/Constants */ "./src/game/Core/Constants.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Core_GameState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Core/GameState */ "./src/game/Core/GameState.ts");
/* harmony import */ var _Common_InfoType__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Common/InfoType */ "./src/game/Common/InfoType.ts");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Common/InfoSprite */ "./src/game/Common/InfoSprite.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var _Common_InfoNumberSprite__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Common/InfoNumberSprite */ "./src/game/Common/InfoNumberSprite.ts");
/* harmony import */ var _Sublayers_AutoPlayLayer__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Sublayers/AutoPlayLayer */ "./src/game/Layers/Sublayers/AutoPlayLayer.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var FinishLayer = /** @class */ (function (_super) {
    __extends(FinishLayer, _super);
    function FinishLayer(state, events, resources, loadcfg, ioc, config) {
        var _this = _super.call(this, _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerWidth"], _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerHeight"]) || this;
        _this.onRetry = function () { };
        _this.onBack = function () { };
        _this.resize.apply(_this, events.Resize.prevArgs);
        events.Resize.add(function (w, h) {
            if (!_this.parent)
                return "remove";
            _this.resize(w, h);
        });
        var info = resources.ui.data.info.score;
        var textures = resources.ui.textures;
        if (info.other instanceof Array) {
            info.other.forEach(function (x) {
                _this.addChild(new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_7__["InfoSprite"](x, textures));
            });
        }
        var numbers = ["perfect", "great", "good", "bad", "miss", "score", "combo"];
        numbers.forEach(function (x) {
            var n = new _Common_InfoNumberSprite__WEBPACK_IMPORTED_MODULE_9__["InfoNumberSprite"](info[x], textures);
            if (x === "combo")
                n.setValue(state.maxCombo);
            else
                n.setValue(state[x]);
            _this.addChild(n);
        });
        if (state.maxCombo === state.map.combo) {
            _this.addChild(new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_7__["InfoSprite"](info.fullcombo, textures));
        }
        if (info.name) {
            var name_1 = new pixi_js__WEBPACK_IMPORTED_MODULE_5__["Text"](loadcfg.songName, info.name.style);
            Object(_Common_InfoType__WEBPACK_IMPORTED_MODULE_4__["setPositionInfo"])(name_1, info.name.position);
            _this.addChild(name_1);
        }
        var retry = new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_7__["InfoSprite"](info.retry, textures);
        var back = new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_7__["InfoSprite"](info.back, textures);
        retry.interactive = true;
        //        retry.buttonMode = true
        back.interactive = true;
        //        back.buttonMode = true
        retry.once("pointertap", function () {
            _this.onRetry();
        });
        back.once("pointertap", function () {
            _this.onBack();
        });
        _this.addChild(retry, back);
        events.Update.add(function (dt) {
            if (!_this.parent)
                return "remove";
            _this.children.forEach(function (x) {
                if (x instanceof _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_7__["InfoSprite"] || x instanceof _Common_InfoNumberSprite__WEBPACK_IMPORTED_MODULE_9__["InfoNumberSprite"]) {
                    x.update(dt);
                }
            });
        });
        if (config.autoplay) {
            _this.addChild(ioc.resolve(_Sublayers_AutoPlayLayer__WEBPACK_IMPORTED_MODULE_10__["AutoPlayLayer"]));
        }
        return _this;
    }
    FinishLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_2__["injectable"])(),
        __metadata("design:paramtypes", [_Core_GameState__WEBPACK_IMPORTED_MODULE_3__["GameState"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_6__["GlobalEvents"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_6__["Resources"], _Core_GameConfig__WEBPACK_IMPORTED_MODULE_8__["GameLoadConfig"], inversify__WEBPACK_IMPORTED_MODULE_2__["Container"], _Core_GameConfig__WEBPACK_IMPORTED_MODULE_8__["GameConfig"]])
    ], FinishLayer);
    return FinishLayer;
}(_Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_0__["FixRatioContainer"]));



/***/ }),

/***/ "./src/game/Layers/GameLayer.ts":
/*!**************************************!*\
  !*** ./src/game/Layers/GameLayer.ts ***!
  \**************************************/
/*! exports provided: GameLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameLayer", function() { return GameLayer; });
/* harmony import */ var _Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Common/FixRatioContainer */ "./src/game/Common/FixRatioContainer.ts");
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Core/Constants */ "./src/game/Core/Constants.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Sublayers_LaneLayer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Sublayers/LaneLayer */ "./src/game/Layers/Sublayers/LaneLayer.ts");
/* harmony import */ var _Sublayers_IntereactionLayer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Sublayers/IntereactionLayer */ "./src/game/Layers/Sublayers/IntereactionLayer.ts");
/* harmony import */ var _Sublayers_NotesLayer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Sublayers/NotesLayer */ "./src/game/Layers/Sublayers/NotesLayer.ts");
/* harmony import */ var _Sublayers_UILayer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Sublayers/UILayer */ "./src/game/Layers/Sublayers/UILayer.ts");
/* harmony import */ var _Sublayers_EffectLayer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Sublayers/EffectLayer */ "./src/game/Layers/Sublayers/EffectLayer.ts");
/* harmony import */ var _Sublayers_LaneEffectLayer__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Sublayers/LaneEffectLayer */ "./src/game/Layers/Sublayers/LaneEffectLayer.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var _Sublayers_AutoPlayLayer__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Sublayers/AutoPlayLayer */ "./src/game/Layers/Sublayers/AutoPlayLayer.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var GameLayer = /** @class */ (function (_super) {
    __extends(GameLayer, _super);
    function GameLayer(ioc, events, config) {
        var _this = _super.call(this, _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerWidth"], _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerHeight"]) || this;
        _this.resize.apply(_this, events.Resize.prevArgs);
        events.Resize.add(function (w, h) {
            if (!_this.parent)
                return "remove";
            _this.resize(w, h);
        });
        _this.addChild(ioc.resolve(_Sublayers_LaneLayer__WEBPACK_IMPORTED_MODULE_4__["LaneLayer"]));
        _this.addChild(ioc.resolve(_Sublayers_LaneEffectLayer__WEBPACK_IMPORTED_MODULE_9__["LaneEffectLayer"]));
        _this.addChild(ioc.resolve(_Sublayers_EffectLayer__WEBPACK_IMPORTED_MODULE_8__["EffectLayer"]));
        _this.addChild(ioc.resolve(_Sublayers_NotesLayer__WEBPACK_IMPORTED_MODULE_6__["NotesLayer"]));
        _this.addChild(ioc.resolve(_Sublayers_UILayer__WEBPACK_IMPORTED_MODULE_7__["UILayer"]));
        _this.addChild(ioc.resolve(_Sublayers_IntereactionLayer__WEBPACK_IMPORTED_MODULE_5__["IntereactionLayer"]));
        if (config.autoplay) {
            _this.addChild(ioc.resolve(_Sublayers_AutoPlayLayer__WEBPACK_IMPORTED_MODULE_11__["AutoPlayLayer"]));
        }
        return _this;
    }
    GameLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_2__["injectable"])(),
        __metadata("design:paramtypes", [inversify__WEBPACK_IMPORTED_MODULE_2__["Container"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_3__["GlobalEvents"], _Core_GameConfig__WEBPACK_IMPORTED_MODULE_10__["GameConfig"]])
    ], GameLayer);
    return GameLayer;
}(_Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_0__["FixRatioContainer"]));



/***/ }),

/***/ "./src/game/Layers/LoadingLayer.ts":
/*!*****************************************!*\
  !*** ./src/game/Layers/LoadingLayer.ts ***!
  \*****************************************/
/*! exports provided: LoadingLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadingLayer", function() { return LoadingLayer; });
/* harmony import */ var _Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Common/FixRatioContainer */ "./src/game/Common/FixRatioContainer.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Core/Constants */ "./src/game/Core/Constants.ts");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Common_InCodeAssests__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Common/InCodeAssests */ "./src/game/Common/InCodeAssests.ts");
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Common_Animation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Common/Animation */ "./src/game/Common/Animation.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __spreadArrays = (undefined && undefined.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};








var LoadProgress = /** @class */ (function () {
    function LoadProgress() {
        this.progress = 0;
        this.targetProgress = 0;
        this.finished = false;
    }
    LoadProgress.prototype.set = function (target) {
        this.targetProgress = target;
        if (target >= 1)
            this.finished = true;
    };
    /**
     *
     * @param dt 以秒计
     */
    LoadProgress.prototype.update = function (dt) {
        this.progress += dt * (this.targetProgress - this.progress) * 5;
        if (this.finished) {
            this.progress += dt * 0.1;
            if (this.progress > 1) {
                this.progress = 1;
                return true;
            }
        }
    };
    return LoadProgress;
}());
var LoadingLayer = /** @class */ (function (_super) {
    __extends(LoadingLayer, _super);
    function LoadingLayer(events, config) {
        var _this = _super.call(this) || this;
        _this.progress = new LoadProgress();
        var backtexture = pixi_js__WEBPACK_IMPORTED_MODULE_3__["Texture"].from(_Common_InCodeAssests__WEBPACK_IMPORTED_MODULE_4__["LoadingBackground"]);
        var back = new (pixi_js__WEBPACK_IMPORTED_MODULE_3__["TilingSprite"].bind.apply(pixi_js__WEBPACK_IMPORTED_MODULE_3__["TilingSprite"], __spreadArrays([void 0, backtexture], events.Resize.prevArgs)))();
        _this.addChild(back);
        var container = new _Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_0__["FixRatioContainer"](_Core_Constants__WEBPACK_IMPORTED_MODULE_2__["LayerWidth"], _Core_Constants__WEBPACK_IMPORTED_MODULE_2__["LayerHeight"]);
        container.resize.apply(container, events.Resize.prevArgs);
        var text = new pixi_js__WEBPACK_IMPORTED_MODULE_3__["Text"](_Common_InCodeAssests__WEBPACK_IMPORTED_MODULE_4__["LoadingMessages"][0], {
            fontSize: 72,
            fill: "white",
        });
        text.position.set(400, 330);
        text.scale.set(0.5);
        container.addChild(text);
        var barback = new pixi_js__WEBPACK_IMPORTED_MODULE_3__["Graphics"]().beginFill(0x808080).drawRoundedRect(0, 0, 480, 18, 8).endFill();
        barback.position.set(400, 380);
        container.addChild(barback);
        var bar = new pixi_js__WEBPACK_IMPORTED_MODULE_3__["Graphics"]();
        bar.position.set(400, 380);
        container.addChild(bar);
        _this.addChild(container);
        var textanim = _this.setTextAnim(text, events.Update);
        events.Resize.add(function (w, h) {
            if (!_this.parent)
                return "remove";
            back.width = w;
            back.height = h;
            back.tileScale.set(Math.max(w, h) / 1000);
            container.resize(w, h);
        });
        var lastProg = 0;
        events.Update.add(function (dt, now) {
            if (!_this.parent)
                return "remove";
            back.tilePosition.x += dt * 20;
            back.tilePosition.y += dt * 10;
            textanim.update(dt);
            _this.progress.update(dt);
            var progress = _this.progress.progress;
            if (progress > 0.04 && lastProg !== progress) {
                lastProg = progress;
                bar.clear().beginFill(0xe93f5f).drawRoundedRect(0, 0, 480 * progress, 18, 8).endFill();
            }
        });
        _this.messages = config.loadingMessages || _Common_InCodeAssests__WEBPACK_IMPORTED_MODULE_4__["LoadingMessages"];
        return _this;
    }
    LoadingLayer.prototype.getRandomMessage = function (prev) {
        if (prev === void 0) { prev = ""; }
        var str = prev;
        while (str === prev) {
            var i = Math.floor(Math.random() * this.messages.length);
            str = this.messages[i];
        }
        return str;
    };
    LoadingLayer.prototype.setTextAnim = function (text, update) {
        var _this = this;
        var timeout = 5;
        var textanim = new _Common_Animation__WEBPACK_IMPORTED_MODULE_6__["AnimationManager"](Object(_Common_Animation__WEBPACK_IMPORTED_MODULE_6__["CreatePixiTargetPropMapper"])(text));
        textanim.paused = true;
        var anim1 = Object(_Common_Animation__WEBPACK_IMPORTED_MODULE_6__["createSimpleAnimation"])(1, 0, 0.3, _Common_Animation__WEBPACK_IMPORTED_MODULE_6__["keyFramePresets"].easeOut);
        var anim2 = Object(_Common_Animation__WEBPACK_IMPORTED_MODULE_6__["createSimpleAnimation"])(text.x, text.x - 20, 0.3, _Common_Animation__WEBPACK_IMPORTED_MODULE_6__["keyFramePresets"].easeOut);
        var changeText = function () {
            if (!_this.parent)
                return;
            textanim.paused = false;
            textanim.animations.set("alpha", anim1);
            textanim.animations.set("x", anim2);
            textanim.onEnd.add(changeText2);
        };
        var anim3 = Object(_Common_Animation__WEBPACK_IMPORTED_MODULE_6__["createSimpleAnimation"])(0, 1, 0.3, _Common_Animation__WEBPACK_IMPORTED_MODULE_6__["keyFramePresets"].easeOut);
        var anim4 = Object(_Common_Animation__WEBPACK_IMPORTED_MODULE_6__["createSimpleAnimation"])(text.x + 20, text.x, 0.3, _Common_Animation__WEBPACK_IMPORTED_MODULE_6__["keyFramePresets"].easeOut);
        var changeText2 = function () {
            text.text = _this.getRandomMessage(text.text);
            textanim.currentTime = 0;
            textanim.animations.set("alpha", anim3);
            textanim.animations.set("x", anim4);
            textanim.onEnd.add(function () {
                textanim.paused = true;
                textanim.currentTime = 0;
                timeout = 5;
                return "remove";
            });
            return "remove";
        };
        update.add(function (dt) {
            if (!_this.parent)
                return "remove";
            timeout -= dt;
            if (timeout < 0 && timeout + dt >= 0)
                changeText();
        });
        return textanim;
    };
    LoadingLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_5__["GlobalEvents"],
            _Core_GameConfig__WEBPACK_IMPORTED_MODULE_7__["GameLoadConfig"]])
    ], LoadingLayer);
    return LoadingLayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_3__["Container"]));



/***/ }),

/***/ "./src/game/Layers/PauseLayer.ts":
/*!***************************************!*\
  !*** ./src/game/Layers/PauseLayer.ts ***!
  \***************************************/
/*! exports provided: PauseLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PauseLayer", function() { return PauseLayer; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Core_GameState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Core/GameState */ "./src/game/Core/GameState.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Common/InfoSprite */ "./src/game/Common/InfoSprite.ts");
/* harmony import */ var _Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Common/FixRatioContainer */ "./src/game/Common/FixRatioContainer.ts");
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Core/Constants */ "./src/game/Core/Constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var PauseLayer = /** @class */ (function (_super) {
    __extends(PauseLayer, _super);
    function PauseLayer(state, config, resources, events) {
        var _this = _super.call(this) || this;
        var mask = new pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"](pixi_js__WEBPACK_IMPORTED_MODULE_0__["Texture"].WHITE);
        mask.tint = 0;
        mask.alpha = 0.5;
        var container = new _Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_6__["FixRatioContainer"](_Core_Constants__WEBPACK_IMPORTED_MODULE_7__["LayerWidth"], _Core_Constants__WEBPACK_IMPORTED_MODULE_7__["LayerHeight"]);
        mask.width = events.Resize.prevArgs[0];
        mask.height = events.Resize.prevArgs[1];
        container.resize.apply(container, events.Resize.prevArgs);
        events.Resize.add(function (w, h) {
            if (!_this.parent)
                return "remove";
            mask.width = w;
            mask.height = h;
            container.resize(w, h);
        });
        mask.interactive = true;
        mask.on("pointertap", function (e) { return e.stopPropagation(); });
        _this.addChild(mask);
        _this.addChild(container);
        var info = resources.ui.data.info.pause;
        var textures = resources.ui.textures;
        if (info.other instanceof Array) {
            info.other.forEach(function (x) {
                _this.addChild(new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_5__["InfoSprite"](x, textures));
            });
        }
        var continuebtn = new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_5__["InfoSprite"](info.continue, textures);
        var restart = new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_5__["InfoSprite"](info.restart, textures);
        var back = new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_5__["InfoSprite"](info.back, textures);
        continuebtn.interactive = true;
        //        continuebtn.buttonMode = true
        continuebtn.on("pointertap", function () {
            state.onContinue.emit();
        });
        restart.interactive = true;
        //        restart.buttonMode = true
        restart.on("pointertap", function () {
            state.onRestart.emit();
        });
        back.interactive = true;
        //        back.buttonMode = true
        back.on("pointertap", function () {
            state.onAbort.emit();
        });
        container.addChild(continuebtn, restart, back);
        events.Update.add(function (dt) {
            if (!_this.parent)
                return "remove";
            _this.children.forEach(function (x) {
                if (x instanceof _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_5__["InfoSprite"]) {
                    x.update(dt);
                }
            });
        });
        return _this;
    }
    PauseLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Core_GameState__WEBPACK_IMPORTED_MODULE_2__["GameState"], _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__["GameConfig"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__["Resources"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__["GlobalEvents"]])
    ], PauseLayer);
    return PauseLayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Layers/ReadyLayer.ts":
/*!***************************************!*\
  !*** ./src/game/Layers/ReadyLayer.ts ***!
  \***************************************/
/*! exports provided: ReadyLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReadyLayer", function() { return ReadyLayer; });
/* harmony import */ var _Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Common/FixRatioContainer */ "./src/game/Common/FixRatioContainer.ts");
/* harmony import */ var _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Common/InfoSprite */ "./src/game/Common/InfoSprite.ts");
/* harmony import */ var _Common_InfoType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Common/InfoType */ "./src/game/Common/InfoType.ts");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Core/Constants */ "./src/game/Core/Constants.ts");
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ReadyLayer = /** @class */ (function (_super) {
    __extends(ReadyLayer, _super);
    function ReadyLayer(resources, loadcfg, events) {
        var _this = _super.call(this, _Core_Constants__WEBPACK_IMPORTED_MODULE_5__["LayerWidth"], _Core_Constants__WEBPACK_IMPORTED_MODULE_5__["LayerHeight"]) || this;
        _this.start = function (auto) {
            if (auto === void 0) { auto = false; }
        };
        _this.resize.apply(_this, events.Resize.prevArgs);
        events.Resize.add(function (w, h) {
            if (!_this.parent)
                return "remove";
            _this.resize(w, h);
        });
        var info = resources.ui.data.info.ready;
        var textures = resources.ui.textures;
        if (info.other instanceof Array) {
            info.other.forEach(function (x) {
                _this.addChild(new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_1__["InfoSprite"](x, textures));
            });
        }
        var playbtn = new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_1__["InfoSprite"](info.play, textures);
        _this.addChild(playbtn);
        var autobtn = new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_1__["InfoSprite"](info.auto, textures);
        _this.addChild(autobtn);
        if (info.name) {
            var name_1 = new pixi_js__WEBPACK_IMPORTED_MODULE_3__["Text"](loadcfg.songName, info.name.style);
            Object(_Common_InfoType__WEBPACK_IMPORTED_MODULE_2__["setPositionInfo"])(name_1, info.name.position);
            _this.addChild(name_1);
        }
        playbtn.interactive = true;
        //        playbtn.buttonMode = true
        autobtn.interactive = true;
        //        autobtn.buttonMode = true
        playbtn.once("pointertap", function () { return _this.start(); });
        autobtn.once("pointertap", function () { return _this.start(true); });
        events.Update.add(function (dt) {
            if (!_this.parent)
                return "remove";
            _this.children.forEach(function (x) {
                if (x instanceof _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_1__["InfoSprite"]) {
                    x.update(dt);
                }
            });
        });
        return _this;
    }
    ReadyLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_4__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_6__["Resources"], _Core_GameConfig__WEBPACK_IMPORTED_MODULE_7__["GameLoadConfig"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_6__["GlobalEvents"]])
    ], ReadyLayer);
    return ReadyLayer;
}(_Common_FixRatioContainer__WEBPACK_IMPORTED_MODULE_0__["FixRatioContainer"]));



/***/ }),

/***/ "./src/game/Layers/Sublayers/AutoPlayLayer.ts":
/*!****************************************************!*\
  !*** ./src/game/Layers/Sublayers/AutoPlayLayer.ts ***!
  \****************************************************/
/*! exports provided: AutoPlayLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AutoPlayLayer", function() { return AutoPlayLayer; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Core/Constants */ "./src/game/Core/Constants.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_2__);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AutoPlayLayer = /** @class */ (function (_super) {
    __extends(AutoPlayLayer, _super);
    function AutoPlayLayer() {
        var _this = _super.call(this) || this;
        var auto = new pixi_js__WEBPACK_IMPORTED_MODULE_0__["Text"]("AUTOPLAY", {
            fontSize: 52,
            fill: [0xffffff, 0x888888]
        });
        auto.blendMode = pixi_js__WEBPACK_IMPORTED_MODULE_0__["BLEND_MODES"].ADD;
        auto.alpha = 0.3;
        auto.anchor.x = 0.5;
        auto.position.set(_Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerWidth"] / 2, _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerHeight"] / 2);
        _this.addChild(auto);
        return _this;
    }
    AutoPlayLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_2__["injectable"])(),
        __metadata("design:paramtypes", [])
    ], AutoPlayLayer);
    return AutoPlayLayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Layers/Sublayers/EffectLayer.ts":
/*!**************************************************!*\
  !*** ./src/game/Layers/Sublayers/EffectLayer.ts ***!
  \**************************************************/
/*! exports provided: SingleEffectLayer, EffectLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SingleEffectLayer", function() { return SingleEffectLayer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EffectLayer", function() { return EffectLayer; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Common_InfoEffect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Common/InfoEffect */ "./src/game/Common/InfoEffect.ts");
/* harmony import */ var _Core_GameState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Core/GameState */ "./src/game/Core/GameState.ts");
/* harmony import */ var _core_Utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../core/Utils */ "./src/core/Utils.ts");
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../Core/Constants */ "./src/game/Core/Constants.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var SingleEffectLayer = /** @class */ (function (_super) {
    __extends(SingleEffectLayer, _super);
    function SingleEffectLayer(info, textures, initScale) {
        var _this = _super.call(this) || this;
        _this.info = info;
        _this.textures = textures;
        _this.initScale = initScale;
        return _this;
    }
    SingleEffectLayer.prototype.update = function (dt) {
        this.children.forEach(function (x) {
            if (x instanceof _Common_InfoEffect__WEBPACK_IMPORTED_MODULE_3__["InfoEffect"]) {
                x.update(dt);
                if (x.allAnimEnd())
                    x.visible = false;
            }
        });
    };
    SingleEffectLayer.prototype.setEffect = function (x, y) {
        var e = this.children.find(function (ef) { return !ef.visible; });
        if (!e) {
            e = new _Common_InfoEffect__WEBPACK_IMPORTED_MODULE_3__["InfoEffect"](this.info, this.textures);
            e.scale.set(this.initScale);
            this.addChild(e);
        }
        e.setPosition(x, y);
        e.resetAnim();
        e.visible = true;
    };
    SingleEffectLayer.prototype.setTrackedEffect = function (tracker) {
        var e = this.children.find(function (ef) { return !ef.visible; });
        if (!e) {
            e = new _Common_InfoEffect__WEBPACK_IMPORTED_MODULE_3__["InfoEffect"](this.info, this.textures);
            e.scale.set(this.initScale);
            this.addChild(e);
        }
        var pupdate = e.update;
        e.update = function (dt) {
            if (!e.visible)
                return;
            var t = tracker();
            if (!t.visible) {
                e.update = pupdate;
                e.stopEmit();
                return;
            }
            e.setPosition(t.x, t.y);
            pupdate.call(e, dt);
        };
        var tr = tracker();
        e.setPosition(tr.x, tr.y);
        e.resetAnim();
        e.visible = true;
    };
    return SingleEffectLayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));

function GetSlidePos(note, musicTime) {
    var i = note.nextJudgeIndex || 1;
    var n1 = note.notes[i - 1];
    var n2 = note.notes[i];
    return Object(_core_Utils__WEBPACK_IMPORTED_MODULE_5__["ratio"])(n1.time, n2.time, musicTime, _Core_Constants__WEBPACK_IMPORTED_MODULE_6__["LaneCenterXs"][n1.lane], _Core_Constants__WEBPACK_IMPORTED_MODULE_6__["LaneCenterXs"][n2.lane]);
}
var EffectLayer = /** @class */ (function (_super) {
    __extends(EffectLayer, _super);
    function EffectLayer(resources, state, events, config) {
        var _this = _super.call(this) || this;
        var info = resources.effect.data.info;
        var textures = resources.effect.textures;
        var tap = new SingleEffectLayer(info.tap, textures, config.noteScale);
        var single = new SingleEffectLayer(info.single, textures, config.noteScale);
        var flick = new SingleEffectLayer(info.flick, textures, config.noteScale);
        var slide = new SingleEffectLayer(info.slide, textures, config.noteScale);
        var fullcombo = new SingleEffectLayer(info.fullcombo, textures, config.noteScale);
        var slides = new Set();
        state.onJudge.add(function (n) {
            if (n.judge === "miss") {
                if ("parent" in n) {
                    slides.delete(n.parent);
                }
                return;
            }
            if (n.type === "flick" || n.type === "flickend") {
                flick.setEffect(_Core_Constants__WEBPACK_IMPORTED_MODULE_6__["LaneCenterXs"][n.lane], _Core_Constants__WEBPACK_IMPORTED_MODULE_6__["LaneBottomY"]);
            }
            else {
                single.setEffect(_Core_Constants__WEBPACK_IMPORTED_MODULE_6__["LaneCenterXs"][n.lane], _Core_Constants__WEBPACK_IMPORTED_MODULE_6__["LaneBottomY"]);
            }
            if (n.type !== "single" && n.type !== "flick") {
                if (slides.has(n.parent)) {
                    if (n.type === "slideend" || n.type === "flickend")
                        slides.delete(n.parent);
                }
                else {
                    slides.add(n.parent);
                    slide.setTrackedEffect(function () {
                        var p = n.parent;
                        var mt = state.onMusicTimeUpdate.prevArgs[0].visualTime;
                        var visible = n.parent.nextJudgeIndex < n.parent.notes.length
                            && slides.has(p) && Object(_core_Utils__WEBPACK_IMPORTED_MODULE_5__["findex"])(p.notes, -1).time >= mt;
                        return {
                            x: visible && GetSlidePos(p, mt) || 0,
                            y: _Core_Constants__WEBPACK_IMPORTED_MODULE_6__["LaneBottomY"],
                            visible: visible
                        };
                    });
                }
            }
        });
        state.onEmptyTap.add(function (l) {
            if (0 <= l && l <= 6)
                tap.setEffect(_Core_Constants__WEBPACK_IMPORTED_MODULE_6__["LaneCenterXs"][l], _Core_Constants__WEBPACK_IMPORTED_MODULE_6__["LaneBottomY"]);
        });
        state.onFullCombo.add(function () {
            fullcombo.setEffect(_Core_Constants__WEBPACK_IMPORTED_MODULE_6__["LayerWidth"] / 2, _Core_Constants__WEBPACK_IMPORTED_MODULE_6__["LayerHeight"] / 2);
        });
        events.Update.add(function (dt) {
            if (!_this.parent)
                return "remove";
            if (state.paused)
                return;
            _this.children.forEach(function (x) {
                if (x instanceof SingleEffectLayer) {
                    x.update(dt);
                }
            });
        });
        _this.addChild(tap, single, flick, slide, fullcombo);
        return _this;
    }
    EffectLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["Resources"], _Core_GameState__WEBPACK_IMPORTED_MODULE_4__["GameState"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["GlobalEvents"], _Core_GameConfig__WEBPACK_IMPORTED_MODULE_7__["GameConfig"]])
    ], EffectLayer);
    return EffectLayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Layers/Sublayers/IntereactionLayer.ts":
/*!********************************************************!*\
  !*** ./src/game/Layers/Sublayers/IntereactionLayer.ts ***!
  \********************************************************/
/*! exports provided: IntereactionLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntereactionLayer", function() { return IntereactionLayer; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../Core/Constants */ "./src/game/Core/Constants.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Core_GameState__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Core/GameState */ "./src/game/Core/GameState.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var IntereactionLayer = /** @class */ (function (_super) {
    __extends(IntereactionLayer, _super);
    function IntereactionLayer(config, state) {
        var _this = _super.call(this) || this;
        var hw = 3.7 * _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneWidth"];
        var h = _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerHeight"];
        var rect = new pixi_js__WEBPACK_IMPORTED_MODULE_0__["Graphics"]();
        rect.position.set(_Core_Constants__WEBPACK_IMPORTED_MODULE_1__["CenterX"], _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LayerHeight"] / 2);
        rect.lineStyle(3, 0xff0088);
        rect.moveTo(-hw, 0).lineTo(hw, 0).lineTo(hw, h).lineTo(-hw, h).lineTo(-hw, 0);
        _this.addChild(rect);
        rect.alpha = config.debug ? 1 : 0;
        rect.interactive = true;
        //        rect.buttonMode = true
        rect.hitArea = rect.getLocalBounds();
        var getlane = function (x, y) {
            if (y < 0)
                return -1;
            var pm = x >= 0 ? 1 : -1;
            var dl = (Math.abs(x) + _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneWidth"] / 2) / _Core_Constants__WEBPACK_IMPORTED_MODULE_1__["LaneWidth"];
            if (dl >= 4 && dl < 4.2)
                dl = 3.5;
            if (dl > 4)
                return -1;
            return 3 + Math.floor(dl) * pm;
        };
        var typemap = {
            pointerup: "up",
            pointerdown: "down",
            pointerupoutside: "up",
            pointermove: "move"
        };
        var listen = function () {
            var events = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                events[_i] = arguments[_i];
            }
            events.forEach(function (name) { return rect.on(name, function (e) {
                e.stopPropagation();
                var type = typemap[name];
                var p = rect.toLocal(e.data.global);
                var pointerId = e.data.pointerId || 0xffffff;
                var ev = {
                    pointerId: pointerId,
                    time: 0,
                    lane: getlane(p.x, p.y),
                    type: type,
                    x: p.x,
                    y: p.y
                };
                state.onPointer.emit(ev);
                if (config.debug && name.indexOf("move") < 0)
                    console.log(name, ev);
            }); });
        };
        listen("pointerup", "pointerdown", "pointerupoutside", "pointermove");
        return _this;
    }
    IntereactionLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_3__["injectable"])(),
        __metadata("design:paramtypes", [_Core_GameConfig__WEBPACK_IMPORTED_MODULE_2__["GameConfig"],
            _Core_GameState__WEBPACK_IMPORTED_MODULE_4__["GameState"]])
    ], IntereactionLayer);
    return IntereactionLayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Layers/Sublayers/LaneEffectLayer.ts":
/*!******************************************************!*\
  !*** ./src/game/Layers/Sublayers/LaneEffectLayer.ts ***!
  \******************************************************/
/*! exports provided: LaneEffect, LaneEffectLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaneEffect", function() { return LaneEffect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaneEffectLayer", function() { return LaneEffectLayer; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Common_Animation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Common/Animation */ "./src/game/Common/Animation.ts");
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Core/Constants */ "./src/game/Core/Constants.ts");
/* harmony import */ var _Core_GameState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../Core/GameState */ "./src/game/Core/GameState.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var LaneEffect = /** @class */ (function (_super) {
    __extends(LaneEffect, _super);
    function LaneEffect(texture, flip) {
        if (flip === void 0) { flip = false; }
        var _this = _super.call(this, texture) || this;
        _this.anim = new _Common_Animation__WEBPACK_IMPORTED_MODULE_3__["AnimationManager"]();
        _this.anim.targetPropMapper = Object(_Common_Animation__WEBPACK_IMPORTED_MODULE_3__["CreatePixiTargetPropMapper"])(_this);
        _this.anim.animations.set("scalex", {
            keyframes: [{ time: 0, value: flip ? -1 : 1, type: "bezier", ctrl: [1, 0, 1, 1] },
                { time: 0.25, value: flip ? -0.4 : 0.4, type: "static" }],
            totaltime: 0.25
        });
        _this.anim.animations.set("scaley", {
            keyframes: [{ time: 0, value: 1, type: "bezier", ctrl: [1, 0, 1, 1] },
                { time: 0.25, value: 0.4, type: "static" }],
            totaltime: 0.25
        });
        _this.anim.animations.set("alpha", {
            keyframes: [{ time: 0, value: 0.8, type: "bezier", ctrl: [.42, 0, 1, 1] },
                { time: 0.25, value: 0, type: "static" }],
            totaltime: 0.25
        });
        _this.anim.onEnd.add(function () {
            _this.visible = false;
        });
        return _this;
    }
    LaneEffect.prototype.setAnim = function () {
        this.visible = true;
        this.anim.currentTime = 0;
    };
    LaneEffect.prototype.update = function (dt) {
        if (!this.visible)
            return;
        this.anim.update(dt);
    };
    return LaneEffect;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"]));

var LaneEffectLayer = /** @class */ (function (_super) {
    __extends(LaneEffectLayer, _super);
    function LaneEffectLayer(resources, state, events, config) {
        var _this = _super.call(this) || this;
        if (!config.laneEffect)
            return _this;
        var list = [0.166, 0.23, 0.36, 0.5];
        var effects = [0, 1, 2, 3, 4, 5, 6].map(function (x) {
            var i = (3 - Math.abs(x - 3));
            var e = new LaneEffect(resources.game.textures["bg_line" + i], x > 3);
            e.y = _Core_Constants__WEBPACK_IMPORTED_MODULE_4__["LaneBottomY"];
            e.x = _Core_Constants__WEBPACK_IMPORTED_MODULE_4__["LaneCenterXs"][x];
            e.visible = false;
            e.anchor.set(list[i], 1);
            return e;
        });
        _this.addChild.apply(_this, effects);
        events.Update.add(function (dt) {
            if (state.ended)
                return "remove";
            if (state.paused)
                return;
            effects.forEach(function (x) { return x.update(dt); });
        });
        state.onJudge.add(function (n) {
            if (n.judge !== "miss")
                effects[n.lane].setAnim();
        });
        state.onEmptyTap.add(function (l) {
            effects[l].setAnim();
        });
        return _this;
    }
    LaneEffectLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["Resources"], _Core_GameState__WEBPACK_IMPORTED_MODULE_5__["GameState"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["GlobalEvents"], _Core_GameConfig__WEBPACK_IMPORTED_MODULE_6__["GameConfig"]])
    ], LaneEffectLayer);
    return LaneEffectLayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Layers/Sublayers/LaneLayer.ts":
/*!************************************************!*\
  !*** ./src/game/Layers/Sublayers/LaneLayer.ts ***!
  \************************************************/
/*! exports provided: LaneLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaneLayer", function() { return LaneLayer; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Core/Constants */ "./src/game/Core/Constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LaneLayer = /** @class */ (function (_super) {
    __extends(LaneLayer, _super);
    function LaneLayer(resources) {
        var _this = _super.call(this) || this;
        var lane = new pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"](resources.game.textures.rhythm_line);
        lane.anchor.set(0.5, 1);
        lane.position.set(_Core_Constants__WEBPACK_IMPORTED_MODULE_3__["CenterX"], _Core_Constants__WEBPACK_IMPORTED_MODULE_3__["LaneBottomY"]);
        _this.addChild(lane);
        var line = new pixi_js__WEBPACK_IMPORTED_MODULE_0__["Sprite"](resources.game.textures.play_line);
        line.anchor.set(0.5);
        line.position.set(_Core_Constants__WEBPACK_IMPORTED_MODULE_3__["CenterX"], _Core_Constants__WEBPACK_IMPORTED_MODULE_3__["LaneBottomY"]);
        _this.addChild(line);
        return _this;
        // this.cacheAsBitmap = true
    }
    LaneLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_2__["Resources"]])
    ], LaneLayer);
    return LaneLayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Layers/Sublayers/NotesLayer.ts":
/*!*************************************************!*\
  !*** ./src/game/Layers/Sublayers/NotesLayer.ts ***!
  \*************************************************/
/*! exports provided: NotesLayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotesLayer", function() { return NotesLayer; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Core_GameState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Core/GameState */ "./src/game/Core/GameState.ts");
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Components_SlideBarSprite__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Components/SlideBarSprite */ "./src/game/Layers/Components/SlideBarSprite.ts");
/* harmony import */ var _Components_SimLineSprite__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Components/SimLineSprite */ "./src/game/Layers/Components/SimLineSprite.ts");
/* harmony import */ var _Components_SingleNoteSprite__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Components/SingleNoteSprite */ "./src/game/Layers/Components/SingleNoteSprite.ts");
/* harmony import */ var _Components_FlickNoteSprite__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Components/FlickNoteSprite */ "./src/game/Layers/Components/FlickNoteSprite.ts");
/* harmony import */ var _Components_SlideNoteSprite__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Components/SlideNoteSprite */ "./src/game/Layers/Components/SlideNoteSprite.ts");
/* harmony import */ var _Components_SlideAmongSprite__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Components/SlideAmongSprite */ "./src/game/Layers/Components/SlideAmongSprite.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var BarLayer = /** @class */ (function (_super) {
    __extends(BarLayer, _super);
    function BarLayer(state, helper, ioc) {
        var _this = _super.call(this) || this;
        _this.state = state;
        _this.helper = helper;
        _this.ioc = ioc;
        _this.nextBarIndex = 0;
        _this.sortableChildren = true;
        return _this;
    }
    BarLayer.prototype.update = function (musicTime, showTime) {
        var index = this.nextBarIndex;
        var list = this.state.map.bars;
        while (index < list.length && list[index].start.time < showTime) {
            var bar = this.children.find(function (x) { return x.shouldRemove; });
            if (!bar) {
                bar = this.ioc.resolve(_Components_SlideBarSprite__WEBPACK_IMPORTED_MODULE_4__["SlideBarSprite"]);
                bar.applyInfo(list[index]);
                this.addChild(bar);
            }
            else {
                bar.applyInfo(list[index]);
            }
            index++;
        }
        this.nextBarIndex = index;
        this.children.forEach(function (x) { return x.update(musicTime); });
    };
    BarLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Core_GameState__WEBPACK_IMPORTED_MODULE_2__["GameState"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_3__["NoteHelper"], inversify__WEBPACK_IMPORTED_MODULE_1__["Container"]])
    ], BarLayer);
    return BarLayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));
var SimLineLayer = /** @class */ (function (_super) {
    __extends(SimLineLayer, _super);
    function SimLineLayer(config, state, ioc) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.state = state;
        _this.ioc = ioc;
        _this.nextSimIndex = 0;
        _this.sortableChildren = true;
        return _this;
    }
    SimLineLayer.prototype.update = function (musicTime, showTime) {
        if (this.config.showSimLine) {
            var index = this.nextSimIndex;
            var list = this.state.map.simlines;
            while (index < list.length && list[index].left.time < showTime) {
                var sim = this.children.find(function (x) { return x.shouldRemove; });
                if (!sim) {
                    sim = this.ioc.resolve(_Components_SimLineSprite__WEBPACK_IMPORTED_MODULE_5__["SimLineSprite"]);
                    sim.applyInfo(list[index]);
                    this.addChild(sim);
                }
                else {
                    sim.applyInfo(list[index]);
                }
                index++;
            }
            this.nextSimIndex = index;
            this.children.forEach(function (x) { return x.update(musicTime); });
        }
    };
    SimLineLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Core_GameConfig__WEBPACK_IMPORTED_MODULE_10__["GameConfig"], _Core_GameState__WEBPACK_IMPORTED_MODULE_2__["GameState"], inversify__WEBPACK_IMPORTED_MODULE_1__["Container"]])
    ], SimLineLayer);
    return SimLineLayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));
var spritemap = {
    single: _Components_SingleNoteSprite__WEBPACK_IMPORTED_MODULE_6__["SingleNoteSprite"],
    flick: _Components_FlickNoteSprite__WEBPACK_IMPORTED_MODULE_7__["FlickNoteSprite"],
    flickend: _Components_FlickNoteSprite__WEBPACK_IMPORTED_MODULE_7__["FlickNoteSprite"],
    slidestart: _Components_SlideNoteSprite__WEBPACK_IMPORTED_MODULE_8__["SlideNoteSprite"],
    slideend: _Components_SlideNoteSprite__WEBPACK_IMPORTED_MODULE_8__["SlideNoteSprite"],
    slideamong: _Components_SlideAmongSprite__WEBPACK_IMPORTED_MODULE_9__["SlideAmongSprite"],
};
var NoteLayer = /** @class */ (function (_super) {
    __extends(NoteLayer, _super);
    function NoteLayer(state, ioc) {
        var _this = _super.call(this) || this;
        _this.state = state;
        _this.ioc = ioc;
        _this.nextNoteIndex = 0;
        _this.sortableChildren = true;
        return _this;
    }
    NoteLayer.prototype.update = function (musicTime, showTime) {
        var index = this.nextNoteIndex;
        var list = this.state.map.notes;
        var _loop_1 = function () {
            var n = list[index];
            var spriteType = spritemap[n.type];
            var note = this_1.children.find(function (x) {
                return x.shouldRemove && x instanceof spriteType;
            });
            if (!note) {
                note = this_1.ioc.resolve(spriteType);
                note.applyInfo(n);
                this_1.addChild(note);
            }
            else {
                note.applyInfo(n);
            }
            index++;
        };
        var this_1 = this;
        while (index < list.length && list[index].time < showTime) {
            _loop_1();
        }
        this.nextNoteIndex = index;
        this.children.forEach(function (x) { return x.update(musicTime); });
    };
    NoteLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Core_GameState__WEBPACK_IMPORTED_MODULE_2__["GameState"], inversify__WEBPACK_IMPORTED_MODULE_1__["Container"]])
    ], NoteLayer);
    return NoteLayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));
var NotesLayer = /** @class */ (function (_super) {
    __extends(NotesLayer, _super);
    function NotesLayer(state, ioc, helper, config) {
        var _this = _super.call(this) || this;
        _this.state = state;
        _this.helper = helper;
        _this.config = config;
        _this.update = function (musicTime) {
            if (_this.state.ended)
                return "remove";
            var time = _this.helper.staytime + musicTime.visualTime;
            _this.barLayer.update(musicTime.visualTime, time);
            _this.simLineLayer.update(musicTime.visualTime, time);
            _this.noteLayer.update(musicTime.visualTime, time);
        };
        state.onMusicTimeUpdate.add(_this.update);
        _this.barLayer = ioc.resolve(BarLayer);
        _this.noteLayer = ioc.resolve(NoteLayer);
        _this.simLineLayer = ioc.resolve(SimLineLayer);
        _this.addChild(_this.barLayer);
        _this.addChild(_this.simLineLayer);
        _this.addChild(_this.noteLayer);
        _this.barLayer.alpha = config.barOpacity;
        return _this;
    }
    NotesLayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Core_GameState__WEBPACK_IMPORTED_MODULE_2__["GameState"], inversify__WEBPACK_IMPORTED_MODULE_1__["Container"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_3__["NoteHelper"], _Core_GameConfig__WEBPACK_IMPORTED_MODULE_10__["GameConfig"]])
    ], NotesLayer);
    return NotesLayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Layers/Sublayers/UILayer.ts":
/*!**********************************************!*\
  !*** ./src/game/Layers/Sublayers/UILayer.ts ***!
  \**********************************************/
/*! exports provided: UILayer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UILayer", function() { return UILayer; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Core_GameState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../Core/GameState */ "./src/game/Core/GameState.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../Common/InfoSprite */ "./src/game/Common/InfoSprite.ts");
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Common_InfoNumberSprite__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../Common/InfoNumberSprite */ "./src/game/Common/InfoNumberSprite.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var UILayer = /** @class */ (function (_super) {
    __extends(UILayer, _super);
    function UILayer(state, config, resources, events) {
        var _this = _super.call(this) || this;
        var info = resources.ui.data.info.game;
        var textures = resources.ui.textures;
        if (info.other instanceof Array) {
            info.other.forEach(function (x) {
                _this.addChild(new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_4__["InfoSprite"](x, textures));
            });
        }
        var judge = new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_4__["InfoSprite"](info.judge, textures);
        var pause = new _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_4__["InfoSprite"](info.pause, textures);
        var combo = new _Common_InfoNumberSprite__WEBPACK_IMPORTED_MODULE_6__["InfoNumberSprite"](info.combo, textures);
        var score = new _Common_InfoNumberSprite__WEBPACK_IMPORTED_MODULE_6__["InfoNumberSprite"](info.score, textures);
        // if (!config.autoplay)
        _this.addChild(judge);
        _this.addChild(pause);
        _this.addChild(combo);
        _this.addChild(score);
        pause.interactive = true;
        //        pause.buttonMode = true
        pause.on("pointertap", function () {
            state.onPause.emit();
        });
        score.setValue(0);
        combo.visible = false;
        state.onJudge.add(function (note) {
            if (!_this.parent)
                return "remove";
            judge.texture = textures[note.judge];
            judge.resetAnim();
            if (state.currentCombo > 0) {
                combo.setValue(state.currentCombo);
                combo.resetAnim();
                combo.visible = true;
            }
            else {
                combo.visible = false;
            }
            score.setValue(state.score);
            score.resetAnim();
        });
        events.Update.add(function (dt) {
            if (!_this.parent)
                return "remove";
            if (state.paused)
                return;
            _this.children.forEach(function (x) {
                if (x instanceof _Common_InfoSprite__WEBPACK_IMPORTED_MODULE_4__["InfoSprite"] || x instanceof _Common_InfoNumberSprite__WEBPACK_IMPORTED_MODULE_6__["InfoNumberSprite"]) {
                    x.update(dt);
                }
            });
        });
        return _this;
    }
    UILayer = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [_Core_GameState__WEBPACK_IMPORTED_MODULE_2__["GameState"], _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__["GameConfig"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_5__["Resources"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_5__["GlobalEvents"]])
    ], UILayer);
    return UILayer;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Scenes/FinishScene.ts":
/*!****************************************!*\
  !*** ./src/game/Scenes/FinishScene.ts ***!
  \****************************************/
/*! exports provided: FinishScene */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FinishScene", function() { return FinishScene; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Layers_FinishLayer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Layers/FinishLayer */ "./src/game/Layers/FinishLayer.ts");
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _ReadyScene__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ReadyScene */ "./src/game/Scenes/ReadyScene.ts");
/* harmony import */ var _Utils_SceneSwitcher__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Utils/SceneSwitcher */ "./src/game/Utils/SceneSwitcher.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var FinishScene = /** @class */ (function (_super) {
    __extends(FinishScene, _super);
    function FinishScene(ioc, events, swicher) {
        var _this = _super.call(this) || this;
        var layer = ioc.resolve(_Layers_FinishLayer__WEBPACK_IMPORTED_MODULE_2__["FinishLayer"]);
        layer.onBack = function () {
            events.End.emit();
        };
        layer.onRetry = function () {
            var ready = ioc.resolve(_ReadyScene__WEBPACK_IMPORTED_MODULE_4__["ReadyScene"]);
            swicher.switch(_this, ready).outEnd.add(function () {
                _this.destroy({ children: true });
                return "remove";
            });
        };
        _this.addChild(layer);
        return _this;
    }
    FinishScene = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [inversify__WEBPACK_IMPORTED_MODULE_1__["Container"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_3__["GlobalEvents"], _Utils_SceneSwitcher__WEBPACK_IMPORTED_MODULE_5__["SceneSwitcher"]])
    ], FinishScene);
    return FinishScene;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Scenes/GameScene.ts":
/*!**************************************!*\
  !*** ./src/game/Scenes/GameScene.ts ***!
  \**************************************/
/*! exports provided: GameScene */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameScene", function() { return GameScene; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Layers_GameLayer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Layers/GameLayer */ "./src/game/Layers/GameLayer.ts");
/* harmony import */ var _Layers_DebugLayer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Layers/DebugLayer */ "./src/game/Layers/DebugLayer.ts");
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Core_GameState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Core/GameState */ "./src/game/Core/GameState.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var _Core_JudgeManager_Auto__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../Core/JudgeManager.Auto */ "./src/game/Core/JudgeManager.Auto.ts");
/* harmony import */ var _Core_JudgeManager__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Core/JudgeManager */ "./src/game/Core/JudgeManager.ts");
/* harmony import */ var _Core_MusicManager__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../Core/MusicManager */ "./src/game/Core/MusicManager.ts");
/* harmony import */ var _Core_SoundManager__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../Core/SoundManager */ "./src/game/Core/SoundManager.ts");
/* harmony import */ var _Layers_PauseLayer__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../Layers/PauseLayer */ "./src/game/Layers/PauseLayer.ts");
/* harmony import */ var _FinishScene__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./FinishScene */ "./src/game/Scenes/FinishScene.ts");
/* harmony import */ var _Utils_SceneSwitcher__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../Utils/SceneSwitcher */ "./src/game/Utils/SceneSwitcher.ts");
/* harmony import */ var _ReadyScene__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ReadyScene */ "./src/game/Scenes/ReadyScene.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};















var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene(ioc, config, stage, events, switcher) {
        var _this = _super.call(this) || this;
        if (ioc.isBound(_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__["NoteHelper"]))
            ioc.unbind(_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__["NoteHelper"]);
        ioc.bind(_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__["NoteHelper"]).toConstantValue(ioc.resolve(_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__["NoteHelper"]));
        if (ioc.isBound(_Core_GameState__WEBPACK_IMPORTED_MODULE_5__["GameState"]))
            ioc.unbind(_Core_GameState__WEBPACK_IMPORTED_MODULE_5__["GameState"]);
        var state = ioc.resolve(_Core_GameState__WEBPACK_IMPORTED_MODULE_5__["GameState"]);
        ioc.bind(_Core_GameState__WEBPACK_IMPORTED_MODULE_5__["GameState"]).toConstantValue(state);
        var judger = config.autoplay ? ioc.resolve(_Core_JudgeManager_Auto__WEBPACK_IMPORTED_MODULE_7__["AutoJudgeManager"])
            : ioc.resolve(_Core_JudgeManager__WEBPACK_IMPORTED_MODULE_8__["JudgeManager"]);
        ioc.resolve(_Core_MusicManager__WEBPACK_IMPORTED_MODULE_9__["MusciManager"]);
        ioc.resolve(_Core_SoundManager__WEBPACK_IMPORTED_MODULE_10__["SoundManager"]);
        _this.addChild(ioc.resolve(_Layers_GameLayer__WEBPACK_IMPORTED_MODULE_2__["GameLayer"]));
        if (config.debug)
            _this.addChild(ioc.resolve(_Layers_DebugLayer__WEBPACK_IMPORTED_MODULE_3__["DebugLayer"]));
        var pauseLayer = ioc.resolve(_Layers_PauseLayer__WEBPACK_IMPORTED_MODULE_11__["PauseLayer"]);
        state.onPause.add(function () {
            _this.addChild(pauseLayer);
        });
        state.onContinue.add(function () {
            _this.removeChild(pauseLayer);
        });
        state.onEnd.add(function () {
            var finish = ioc.resolve(_FinishScene__WEBPACK_IMPORTED_MODULE_12__["FinishScene"]);
            switcher.switch(_this, finish).outEnd.add(function () {
                _this.destroy({ children: true });
                return "remove";
            });
        });
        state.onRestart.add(function () {
            var ready = ioc.resolve(_ReadyScene__WEBPACK_IMPORTED_MODULE_14__["ReadyScene"]);
            switcher.switch(_this, ready).outEnd.add(function () {
                _this.destroy({ children: true });
                return "remove";
            });
        });
        state.onAbort.add(function () {
            events.End.emit();
        });
        return _this;
    }
    GameScene = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [inversify__WEBPACK_IMPORTED_MODULE_1__["Container"], _Core_GameConfig__WEBPACK_IMPORTED_MODULE_6__["GameConfig"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__["MainStage"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__["GlobalEvents"], _Utils_SceneSwitcher__WEBPACK_IMPORTED_MODULE_13__["SceneSwitcher"]])
    ], GameScene);
    return GameScene;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Scenes/LoadingScene.ts":
/*!*****************************************!*\
  !*** ./src/game/Scenes/LoadingScene.ts ***!
  \*****************************************/
/*! exports provided: LoadingScene */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadingScene", function() { return LoadingScene; });
/* harmony import */ var howler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! howler */ "./node_modules/howler/dist/howler.js");
/* harmony import */ var howler__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(howler__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Layers_LoadingLayer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Layers/LoadingLayer */ "./src/game/Layers/LoadingLayer.ts");
/* harmony import */ var _Layers_BackgroundLayer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Layers/BackgroundLayer */ "./src/game/Layers/BackgroundLayer.ts");
/* harmony import */ var _ReadyScene__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ReadyScene */ "./src/game/Scenes/ReadyScene.ts");
/* harmony import */ var _Utils_SceneSwitcher__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../Utils/SceneSwitcher */ "./src/game/Utils/SceneSwitcher.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var LoadingScene = /** @class */ (function (_super) {
    __extends(LoadingScene, _super);
    function LoadingScene(ioc, 
    // private stage: MainStage,
    config) {
        var _this = _super.call(this) || this;
        _this.ioc = ioc;
        _this.loadedcount = 0;
        _this.progress = function (loader) {
            _this.loadedcount++;
            var count = 0;
            for (var key in loader.resources)
                count++;
            _this.layer.progress.set(_this.loadedcount === count ? 1 : _this.loadedcount / (count + 3));
        };
        _this.loaded = function (loader, res) {
            console.log("loaded");
            _this.ioc.bind(_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__["Resources"]).toConstantValue(res);
            var stage = _this.ioc.get(_Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__["MainStage"]);
            stage.addChildAt(_this.ioc.resolve(_Layers_BackgroundLayer__WEBPACK_IMPORTED_MODULE_6__["BackgroundLayer"]), 0);
            var ready = _this.ioc.resolve(_ReadyScene__WEBPACK_IMPORTED_MODULE_7__["ReadyScene"]);
            var swicher = _this.ioc.get(_Utils_SceneSwitcher__WEBPACK_IMPORTED_MODULE_8__["SceneSwitcher"]);
            swicher.switch(_this, ready).outEnd.add(function () {
                _this.destroy({ children: true });
                return "remove";
            });
        };
        _this.alertedError = false;
        _this.error = function (err, loader, res) {
            console.error("load ", res, " error:", err);
            if (!_this.alertedError) {
                alert("load " + res.url + " error: " + err);
                _this.alertedError = true;
            }
        };
        var loader = new pixi_js__WEBPACK_IMPORTED_MODULE_1__["Loader"]();
        loader.pre(howlerMiddleware);
        loader.add("music", config.musicSrc, { loadType: pixi_js__WEBPACK_IMPORTED_MODULE_1__["LoaderResource"].LOAD_TYPE.AUDIO });
        loader.add("background", config.backgroundSrc, { loadType: pixi_js__WEBPACK_IMPORTED_MODULE_1__["LoaderResource"].LOAD_TYPE.IMAGE });
        loader.add("map", config.mapSrc, { loadType: pixi_js__WEBPACK_IMPORTED_MODULE_1__["LoaderResource"].LOAD_TYPE.XHR });
        for (var key in _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__["jsonNames"])
            loader.add(key, config.skin + "/" + _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__["jsonNames"][key]);
        for (var key in _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__["soundNames"])
            loader.add(key, config.skin + "/" + _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__["soundNames"][key]);
        loader.on("progress", _this.progress);
        loader.on("error", _this.error);
        loader.load(_this.loaded);
        _this.layer = ioc.resolve(_Layers_LoadingLayer__WEBPACK_IMPORTED_MODULE_5__["LoadingLayer"]);
        _this.addChild(_this.layer);
        return _this;
    }
    LoadingScene = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_2__["injectable"])(),
        __metadata("design:paramtypes", [inversify__WEBPACK_IMPORTED_MODULE_2__["Container"],
            _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__["GameLoadConfig"]])
    ], LoadingScene);
    return LoadingScene;
}(pixi_js__WEBPACK_IMPORTED_MODULE_1__["Container"]));

function howlerMiddleware(resource, next) {
    if (resource.loadType !== pixi_js__WEBPACK_IMPORTED_MODULE_1__["LoaderResource"].LOAD_TYPE.AUDIO) {
        next();
        return;
    }
    var howl = new howler__WEBPACK_IMPORTED_MODULE_0__["Howl"]({
        src: resource.url,
        format: /\..{1,5}$/.test(resource.url) ? undefined : "mp3",
        onload: function () {
            resource.data = howl;
            resource.complete();
            next();
        },
        onloaderror: function (id, err) {
            resource.error = err;
            resource.abort("load error");
            next();
        }
    });
}


/***/ }),

/***/ "./src/game/Scenes/ReadyScene.ts":
/*!***************************************!*\
  !*** ./src/game/Scenes/ReadyScene.ts ***!
  \***************************************/
/*! exports provided: ReadyScene */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReadyScene", function() { return ReadyScene; });
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Layers_ReadyLayer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Layers/ReadyLayer */ "./src/game/Layers/ReadyLayer.ts");
/* harmony import */ var _GameScene__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./GameScene */ "./src/game/Scenes/GameScene.ts");
/* harmony import */ var _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Utils/SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var _Utils_SceneSwitcher__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../Utils/SceneSwitcher */ "./src/game/Utils/SceneSwitcher.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ReadyScene = /** @class */ (function (_super) {
    __extends(ReadyScene, _super);
    function ReadyScene(ioc, swicher, events, config) {
        var _this = _super.call(this) || this;
        var layer = ioc.resolve(_Layers_ReadyLayer__WEBPACK_IMPORTED_MODULE_2__["ReadyLayer"]);
        layer.start = function (auto) {
            if (auto)
                config.autoplay = true;
            else
                config.autoplay = false;
            var game = ioc.resolve(_GameScene__WEBPACK_IMPORTED_MODULE_3__["GameScene"]);
            swicher.switch(_this, game).outEnd.add(function () {
                _this.destroy({ children: true });
                return "remove";
            });
        };
        _this.addChild(layer);
        return _this;
    }
    ReadyScene = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_1__["injectable"])(),
        __metadata("design:paramtypes", [inversify__WEBPACK_IMPORTED_MODULE_1__["Container"], _Utils_SceneSwitcher__WEBPACK_IMPORTED_MODULE_6__["SceneSwitcher"], _Utils_SymbolClasses__WEBPACK_IMPORTED_MODULE_4__["GlobalEvents"], _Core_GameConfig__WEBPACK_IMPORTED_MODULE_5__["GameConfig"]])
    ], ReadyScene);
    return ReadyScene;
}(pixi_js__WEBPACK_IMPORTED_MODULE_0__["Container"]));



/***/ }),

/***/ "./src/game/Utils/GameEvent.ts":
/*!*************************************!*\
  !*** ./src/game/Utils/GameEvent.ts ***!
  \*************************************/
/*! exports provided: GameEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameEvent", function() { return GameEvent; });
var GameEvent = /** @class */ (function () {
    function GameEvent() {
        this.listeners = [];
        this.clearFlag = false;
        this.prevArgs = null;
    }
    GameEvent.prototype.emit = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.clearFlag = false;
        var list = this.listeners.splice(0);
        this.listeners.length = 0;
        list = list.filter(function (l) {
            try {
                return l.apply(void 0, args) !== "remove";
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
        this.listeners = this.listeners.concat(list);
        if (this.clearFlag)
            this.listeners.length = 0;
        this.prevArgs = args;
    };
    /** a listener returns "remove" to remove itself from this event */
    GameEvent.prototype.add = function (listener) {
        this.listeners.push(listener);
    };
    GameEvent.prototype.remove = function (listener) {
        var index = this.listeners.indexOf(listener);
        if (index >= 0)
            this.listeners = this.listeners.splice(index, 1);
    };
    GameEvent.prototype.clear = function () {
        this.listeners.length = 0;
        this.clearFlag = true;
    };
    return GameEvent;
}());



/***/ }),

/***/ "./src/game/Utils/SceneSwitcher.ts":
/*!*****************************************!*\
  !*** ./src/game/Utils/SceneSwitcher.ts ***!
  \*****************************************/
/*! exports provided: SceneSwitcher */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SceneSwitcher", function() { return SceneSwitcher; });
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _SymbolClasses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SymbolClasses */ "./src/game/Utils/SymbolClasses.ts");
/* harmony import */ var _Common_Animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Common/Animation */ "./src/game/Common/Animation.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SceneSwitcher = /** @class */ (function () {
    function SceneSwitcher(stage, events) {
        this.stage = stage;
        this.events = events;
    }
    SceneSwitcher.prototype.switch = function (from, to, outTime, inTime, inDelay) {
        var _this = this;
        if (outTime === void 0) { outTime = 0.6; }
        if (inTime === void 0) { inTime = 0.6; }
        if (inDelay === void 0) { inDelay = 0; }
        var outAnim = new _Common_Animation__WEBPACK_IMPORTED_MODULE_2__["AnimationManager"](Object(_Common_Animation__WEBPACK_IMPORTED_MODULE_2__["CreatePixiTargetPropMapper"])(from));
        var inAnim = new _Common_Animation__WEBPACK_IMPORTED_MODULE_2__["AnimationManager"](Object(_Common_Animation__WEBPACK_IMPORTED_MODULE_2__["CreatePixiTargetPropMapper"])(to));
        to.alpha = 0;
        outAnim.animations.set("alpha", Object(_Common_Animation__WEBPACK_IMPORTED_MODULE_2__["createSimpleAnimation"])(1, 0, outTime, _Common_Animation__WEBPACK_IMPORTED_MODULE_2__["keyFramePresets"].easeOut));
        inAnim.animations.set("alpha", Object(_Common_Animation__WEBPACK_IMPORTED_MODULE_2__["createSimpleAnimation"])(0, 1, inTime, _Common_Animation__WEBPACK_IMPORTED_MODULE_2__["keyFramePresets"].easeOut));
        var ended = 0;
        this.events.Update.add(function (dt) {
            if (outAnim.ended)
                return "remove";
            outAnim.update(dt);
            if (outAnim.currentTime > inDelay)
                inAnim.update(dt);
        });
        var i = this.stage.getChildIndex(from);
        this.stage.addChildAt(to, i);
        inAnim.onEnd.add(function () {
            ended++;
        });
        outAnim.onEnd.add(function () {
            _this.stage.removeChild(from);
            ended++;
        });
        return {
            inEnd: inAnim.onEnd,
            outEnd: outAnim.onEnd,
        };
    };
    SceneSwitcher = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_0__["injectable"])(),
        __metadata("design:paramtypes", [_SymbolClasses__WEBPACK_IMPORTED_MODULE_1__["MainStage"], _SymbolClasses__WEBPACK_IMPORTED_MODULE_1__["GlobalEvents"]])
    ], SceneSwitcher);
    return SceneSwitcher;
}());



/***/ }),

/***/ "./src/game/Utils/SymbolClasses.ts":
/*!*****************************************!*\
  !*** ./src/game/Utils/SymbolClasses.ts ***!
  \*****************************************/
/*! exports provided: MainStage, GlobalEvents, Resources, NoteHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainStage", function() { return MainStage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GlobalEvents", function() { return GlobalEvents; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Resources", function() { return Resources; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NoteHelper", function() { return NoteHelper; });
/* harmony import */ var _GameEvent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GameEvent */ "./src/game/Utils/GameEvent.ts");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pixi.js */ "pixi.js");
/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(pixi_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! inversify */ "./node_modules/inversify/lib/inversify.js");
/* harmony import */ var inversify__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(inversify__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Core/GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony import */ var _Core_Projection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../Core/Projection */ "./src/game/Core/Projection.ts");
/* harmony import */ var _Core_Constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Core/Constants */ "./src/game/Core/Constants.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MainStage = /** @class */ (function (_super) {
    __extends(MainStage, _super);
    function MainStage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MainStage;
}(pixi_js__WEBPACK_IMPORTED_MODULE_1__["Container"]));

var GlobalEvents = /** @class */ (function () {
    function GlobalEvents() {
        /** delta, time in seconds */
        this.Update = new _GameEvent__WEBPACK_IMPORTED_MODULE_0__["GameEvent"]();
        /** width, height */
        this.Resize = new _GameEvent__WEBPACK_IMPORTED_MODULE_0__["GameEvent"]();
        this.WindowBlur = new _GameEvent__WEBPACK_IMPORTED_MODULE_0__["GameEvent"]();
        this.WindowFocus = new _GameEvent__WEBPACK_IMPORTED_MODULE_0__["GameEvent"]();
        this.End = new _GameEvent__WEBPACK_IMPORTED_MODULE_0__["GameEvent"]();
    }
    return GlobalEvents;
}());

var Resources = /** @class */ (function () {
    function Resources() {
    }
    return Resources;
}());

var NoteHelper = /** @class */ (function () {
    function NoteHelper(config) {
        this.staytime = Object(_Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__["staytime"])(config.speed);
        this.noteScale = NoteHelper_1.noteInitScale * config.noteScale;
    }
    NoteHelper_1 = NoteHelper;
    /** pre-multiplied config note scale */
    NoteHelper.prototype.calc = function (note, musicTime) {
        var dt = musicTime - note.time;
        var t = dt / this.staytime;
        return Object(_Core_Projection__WEBPACK_IMPORTED_MODULE_4__["projection"])(t, _Core_Constants__WEBPACK_IMPORTED_MODULE_5__["LaneCenterXs"][note.lane]);
    };
    NoteHelper.prototype.setScale = function (note, scale) {
        note.scale.set(scale * this.noteScale);
    };
    var NoteHelper_1;
    NoteHelper.noteInitScale = 0.7;
    NoteHelper = NoteHelper_1 = __decorate([
        Object(inversify__WEBPACK_IMPORTED_MODULE_2__["injectable"])(),
        __metadata("design:paramtypes", [_Core_GameConfig__WEBPACK_IMPORTED_MODULE_3__["GameConfig"]])
    ], NoteHelper);
    return NoteHelper;
}());



/***/ }),

/***/ "./src/game/Utils/Ticker.ts":
/*!**********************************!*\
  !*** ./src/game/Utils/Ticker.ts ***!
  \**********************************/
/*! exports provided: Ticker */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Ticker", function() { return Ticker; });
var now = function () { return performance.now() / 1000; };
var Ticker = /** @class */ (function () {
    function Ticker() {
        /** delta and now are in seconds */
        this.Tick = new Set();
        this.lasttime = 0;
        this.StopFlag = true;
        this.EndFlag = true;
        this.SkipFrame = 0;
    }
    Ticker.prototype.Start = function () {
        var _this = this;
        if (!this.EndFlag)
            return;
        this.StopFlag = false;
        var skipframecounter = 0;
        var func = function () {
            _this.EndFlag = false;
            if (_this.StopFlag) {
                _this.EndFlag = true;
                return;
            }
            requestAnimationFrame(func);
            if (skipframecounter > 0) {
                skipframecounter--;
                return;
            }
            skipframecounter = _this.SkipFrame;
            var n = now();
            if (_this.Tick)
                _this.Tick.forEach(function (t) { return t(n - _this.lasttime, n); });
            _this.lasttime = n;
        };
        this.lasttime = now();
        func();
    };
    Ticker.prototype.Stop = function () {
        this.StopFlag = true;
    };
    return Ticker;
}());



/***/ }),

/***/ "./src/game/Utils/Utils.ts":
/*!*********************************!*\
  !*** ./src/game/Utils/Utils.ts ***!
  \*********************************/
/*! exports provided: getByte, setByte, colorByte, ObjectPool, addAutoListener */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getByte", function() { return getByte; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setByte", function() { return setByte; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "colorByte", function() { return colorByte; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjectPool", function() { return ObjectPool; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addAutoListener", function() { return addAutoListener; });
// tslint:disable: no-bitwise
function getByte(number, byte) {
    var off = (byte | 0) * 8;
    var mask = 0xFF << off;
    return (number & mask) >> off;
}
function setByte(number, byte, value) {
    var off = (byte | 0) * 8;
    var v = (value & 0xFF) << off;
    var imask = ~(0xFF << off);
    number = (number & imask) | v;
    return number;
}
var colorByte = {
    r: 2,
    g: 1,
    b: 0,
};
var ObjectPool = /** @class */ (function () {
    function ObjectPool() {
        this.pool = [];
    }
    ObjectPool.prototype.get = function () {
        if (this.pool.length <= 0) {
            this.pool.push(this.newObj());
        }
        var v = this.pool.pop();
        if (this.pre)
            return this.pre(v);
        return v;
    };
    ObjectPool.prototype.save = function (o) {
        if (this.after)
            this.pool.push(this.after(o));
        else
            this.pool.push(o);
    };
    ObjectPool.prototype.ensure = function (n) {
        while (this.pool.length < n)
            this.pool.push(this.newObj());
    };
    ObjectPool.prototype.destroy = function () {
        this.pool.length = 0;
    };
    return ObjectPool;
}());

/** a listener returns "remove" to remove itself from this.event */
function addAutoListener(element, event, listener) {
    var wrap = function (ev) {
        if (listener(ev) === "remove")
            element.removeEventListener(event, wrap);
    };
    element.addEventListener(event, wrap);
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: Game, GameConfig, GameLoadConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_Game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game/Game */ "./src/game/Game.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Game", function() { return _game_Game__WEBPACK_IMPORTED_MODULE_0__["Game"]; });

/* harmony import */ var _game_Core_GameConfig__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game/Core/GameConfig */ "./src/game/Core/GameConfig.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GameConfig", function() { return _game_Core_GameConfig__WEBPACK_IMPORTED_MODULE_1__["GameConfig"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "GameLoadConfig", function() { return _game_Core_GameConfig__WEBPACK_IMPORTED_MODULE_1__["GameLoadConfig"]; });





/***/ }),

/***/ "pixi.js":
/*!*******************************************************************************************!*\
  !*** external {"root":"PIXI","commonjs":"pixi.js","commonjs2":"pixi.js","amd":"pixi.js"} ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_pixi_js__;

/***/ })

/******/ });
});
//# sourceMappingURL=bangbangboom-game.js.map