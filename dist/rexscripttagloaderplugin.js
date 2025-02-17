(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rexscripttagloaderplugin = factory());
})(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }
  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
        result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var FILE_POPULATED = Phaser.Loader.FILE_POPULATED;
  var UUID = Phaser.Utils.String.UUID;
  var AwaitFile = /*#__PURE__*/function (_Phaser$Loader$File) {
    _inherits(AwaitFile, _Phaser$Loader$File);
    var _super = _createSuper(AwaitFile);
    function AwaitFile(loader, fileConfig) {
      _classCallCheck(this, AwaitFile);
      if (!fileConfig.hasOwnProperty('type')) {
        fileConfig.type = 'await';
      }
      if (!fileConfig.hasOwnProperty('url')) {
        fileConfig.url = '';
      }
      if (!fileConfig.hasOwnProperty('key')) {
        fileConfig.key = UUID();
      }
      return _super.call(this, loader, fileConfig);
    }
    _createClass(AwaitFile, [{
      key: "load",
      value: function load() {
        if (this.state === FILE_POPULATED) {
          //  Can happen for example in a JSONFile if they've provided a JSON object instead of a URL
          this.loader.nextFile(this, true);
        } else {
          // start loading task
          var config = this.config;
          var callback = config.callback;
          var scope = config.scope;
          if (callback) {
            var self = this;
            var runOnce = false;
            var successCallback = function successCallback() {
              if (runOnce) {
                return;
              }
              self.onLoad();
              runOnce = true;
            };
            var failureCallback = function failureCallback() {
              if (runOnce) {
                return;
              }
              self.onError();
              runOnce = true;
            };
            if (scope) {
              callback.call(scope, successCallback, failureCallback);
            } else {
              callback(successCallback, failureCallback);
            }
          } else {
            this.onLoad();
          }
        }
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        this.loader.nextFile(this, true);
      }
    }, {
      key: "onError",
      value: function onError() {
        this.loader.nextFile(this, false);
      }
    }]);
    return AwaitFile;
  }(Phaser.Loader.File);

  var LoadScript = function LoadScript(url, onload) {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0, cnt = scripts.length; i < cnt; i++) {
      if (scripts[i].src.indexOf(url) != -1) {
        if (onload) {
          onload();
        }
        return;
      }
    }
    var newScriptTag = document.createElement('script');
    newScriptTag.setAttribute('src', url);
    if (onload) {
      newScriptTag.onload = onload;
    }
    document.head.appendChild(newScriptTag);
  };

  var LoadScriptPromise = function LoadScriptPromise(url) {
    return new Promise(function (resolve, reject) {
      LoadScript(url, resolve);
    });
  };

  var Delay = function Delay(time, result) {
    if (time === undefined) {
      time = 0;
    }
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(result);
      }, time);
    });
  };

  var IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
  var GetFastValue = Phaser.Utils.Objects.GetFastValue;
  var LoaderCallback = function LoaderCallback(url) {
    if (Array.isArray(url)) {
      for (var i = 0, cnt = url.length; i < cnt; i++) {
        this.addFile(CreateAwiatFile(this, url[i]));
      }
    } else {
      this.addFile(CreateAwiatFile(this, url));
    }
    return this;
  };
  var CreateAwiatFile = function CreateAwiatFile(loader, url, availableTest) {
    if (IsPlainObject(url)) {
      var config = url;
      url = GetFastValue(config, 'url');
      availableTest = GetFastValue(config, 'availableTest');
    }
    var callback = function callback(successCallback, failureCallback) {
      LoadScriptPromise(url).then(function () {
        if (!availableTest) {
          return Promise.resolve();
        }
        var AvailableTestPromise = function AvailableTestPromise() {
          if (availableTest()) {
            return Promise.resolve();
          }
          return Delay(10).then(function () {
            return AvailableTestPromise();
          });
        };
        return AvailableTestPromise();
      }).then(function () {
        successCallback();
      });
    };
    return new AwaitFile(loader, {
      type: 'scriptTag',
      config: {
        callback: callback
      }
    });
  };

  var ScriptTagLoaderPlugin = /*#__PURE__*/function (_Phaser$Plugins$BaseP) {
    _inherits(ScriptTagLoaderPlugin, _Phaser$Plugins$BaseP);
    var _super = _createSuper(ScriptTagLoaderPlugin);
    function ScriptTagLoaderPlugin(pluginManager) {
      var _this;
      _classCallCheck(this, ScriptTagLoaderPlugin);
      _this = _super.call(this, pluginManager);
      pluginManager.registerFileType('rexScriptTag', LoaderCallback);
      return _this;
    }
    _createClass(ScriptTagLoaderPlugin, [{
      key: "addToScene",
      value: function addToScene(scene) {
        scene.sys.load['rexScriptTag'] = LoaderCallback;
      }
    }]);
    return ScriptTagLoaderPlugin;
  }(Phaser.Plugins.BasePlugin);

  return ScriptTagLoaderPlugin;

}));
