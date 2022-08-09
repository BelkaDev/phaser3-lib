(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rexhorrifipipelineplugin = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

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
      Object.defineProperty(target, descriptor.key, descriptor);
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

  var frag = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n#define highmedp highp\n#else\n#define highmedp mediump\n#endif\nprecision highmedp float;\n\nuniform float seed;\nuniform float time;\n\n// Scene buffer\nuniform sampler2D uMainSampler; \nvarying vec2 outTexCoord;\n\n// Effect parameters\n#define SAMPLES 32.\n\n// Bloom\nuniform float enableBloom;\nuniform vec3 bloom;\nuniform vec2 bloomTexel;\n\n// Chromatic abberation\nuniform float enableChromatic;\nuniform float chabIntensity;\n\n// Vignette\nuniform float enableVignette;\nuniform vec2 vignette;\n\n// Noise\nuniform float enableNoise;\nuniform float noiseStrength;\n\n// VHS\nuniform float enableVHS;\nuniform float vhsStrength;\n\n// Scanlines\nuniform float enableScanlines;\nuniform float scanStrength;\n\n// CRT\nuniform float enableCRT;\nuniform vec2 crtSize;\n\n\n// Noise\nfloat noise(vec2 uv) {\n  return fract(sin(uv.x*12.9898+uv.y*78.233)*437.585453*seed);\n}\n\n// VHS\nvec4 vhs(vec2 uv) {\n  vec2 tcoord = uv;\n  tcoord.x += sin(time*noise(uv));\n  return texture2D( uMainSampler, tcoord)*vhsStrength;\t\n}\n\n// Vignette\nfloat vig(vec2 uv) {\n  uv *= 1. - uv;\n  return ( pow(uv.x*uv.y*vignette.x*10.,vignette.y) );\n}\n\n// Chromatic abberation\nvec3 chromatic(vec2 uv, float offset) {\n  float r = texture2D( uMainSampler, vec2(uv.x+offset, uv.y)).r;\n  float g = texture2D( uMainSampler, uv).g;\n  float b = texture2D( uMainSampler, vec2(uv.x-offset, uv.y)).b;\n  return vec3(r,g,b);\n}\n\n// Bloom\nvec4 blur(vec2 uv) {\n  float total = 0.;\n  float rad = 1.;\n  mat2 ang = mat2(.73736882209777832,-.67549037933349609,.67549037933349609,.73736882209777832);\n  vec2 point = normalize(fract(cos(uv*mat2(195,174,286,183))*742.)-.5)*(bloom.x/sqrt(SAMPLES));\n  vec4 amount = vec4(0);\n\t\n  for ( float i=0.; i<SAMPLES; i++ ) {\n    point*=ang;\n    rad+=1./rad;\n    vec4 samp = texture2D(uMainSampler, uv + point * (rad-1.) * bloomTexel);\n    \n    float mul = 1.;\n    float lum = ( samp.r+samp.g+samp.b )/3.;\n    if ( lum < bloom.z ){ mul = 0.; }\n    \n    amount += samp*(1./rad)*mul;\n    total+=(1./rad);\n  }\n  amount /= total;\n  return amount*bloom.y;\n}\n\n// TV Curve\nvec2 crtRunCurve( vec2 uv ) {\n  uv = uv*2.-1.;\n  vec2 uvoff = abs(uv.xy) / crtSize;\n  uv = uv + uv * uvoff * uvoff;\n  uv = uv * .5 + .5;\n  return uv;\n}\n\nvoid main() {\t\n  vec2 mainUv = outTexCoord;\n\n  // CRT\n  if ( enableCRT > .5 ) {\n    mainUv = crtRunCurve(outTexCoord);\n  }\n\t\n  // Base coloring\n  vec4 color = texture2D( uMainSampler, mainUv);\n\t\n  // Chromatic abberation\n  if ( enableChromatic > .5 ) {\n    color.rgb *= chromatic(mainUv, chabIntensity * 0.01);\n  }\n\t\n  // Scanlines\n  if ( enableScanlines > .5 ) {\n    color.rgb *= (1.-scanStrength)+(sin(mainUv.y*1024.)*scanStrength);\n  }\n\n  // Bloom\n  if ( enableBloom > .5 ) {\n    color.rgb += blur(mainUv).rgb;\n  }\n\t\n  // Noise\n  if ( enableNoise > .5 ) {\n    color.rgb += noise(mainUv)*noiseStrength;\n  }\n\t\n  // VHS\n  if ( enableVHS > .5 ) {\n    color += vhs(mainUv);\n  }\n\t\n  // Vignette\n  if ( enableVignette > .5) {\n    color.rgb *= vig(mainUv);\n  }\n\t\n  // Cutoff edges\n  if ( enableCRT > .5) {\n    if ( (mainUv.x < 0.)|| (mainUv.y < 0.) || (mainUv.x > 1.)|| (mainUv.y > 1.) ) {\n      color.rgb *= 0.;\n    }\n  }\n\t\n  gl_FragColor = color;\n}\n";

  var BloonConfigurationMethods = {
    setBloomEnable: function setBloomEnable(enable) {
      if (enable === undefined) {
        enable = true;
      }

      this.enableBloom = enable;
      return this;
    },
    setBloomRadius: function setBloomRadius(value) {
      this.bloomRadius = value;
      return this;
    },
    setBloomIntensity: function setBloomIntensity(value) {
      this.bloomIntensity = value;
      return this;
    },
    setBloomThreshold: function setBloomThreshold(value) {
      this.bloomThreshold = value;
      return this;
    }
  };

  var ChromaticConfigurationMethods = {
    setChromaticEnable: function setChromaticEnable(enable) {
      if (enable === undefined) {
        enable = true;
      }

      this.enableChromatic = enable;
      return this;
    },
    setChabIntensity: function setChabIntensity(value) {
      this.chabIntensity = value;
      return this;
    }
  };

  var VignetteConfigurationMethod = {
    setVignetteEnable: function setVignetteEnable(enable) {
      if (enable === undefined) {
        enable = true;
      }

      this.enableVignette = enable;
      return this;
    },
    setVignetteStrength: function setVignetteStrength(value) {
      this.vignetteStrength = value;
      return this;
    },
    setVignetteIntensity: function setVignetteIntensity(value) {
      this.vignetteIntensity = value;
      return this;
    }
  };

  var NoiseConfigurationMethod = {
    setNoiseEnable: function setNoiseEnable(enable) {
      if (enable === undefined) {
        enable = true;
      }

      this.enableNoise = enable;
      return this;
    },
    setNoiseStrength: function setNoiseStrength(value) {
      this.noiseStrength = value;
      return this;
    }
  };

  var VHSConfigurationMethod = {
    setVHSEnable: function setVHSEnable(enable) {
      if (enable === undefined) {
        enable = true;
      }

      this.enableVHS = enable;
      return this;
    },
    setVhsStrength: function setVhsStrength(value) {
      this.vhsStrength = value;
      return this;
    }
  };

  var ScanlinesConfigurationMethod = {
    setScanlinesEnable: function setScanlinesEnable(enable) {
      if (enable === undefined) {
        enable = true;
      }

      this.enableScanlines = enable;
      return this;
    },
    setScanStrength: function setScanStrength(value) {
      this.scanStrength = value;
      return this;
    }
  };

  var CRTConfigurationMethod = {
    setCRTEnable: function setCRTEnable(enable) {
      if (enable === undefined) {
        enable = true;
      }

      this.enableCRT = enable;
      return this;
    },
    setCrtSize: function setCrtSize(width, height) {
      this.crtWidth = width;
      this.crtHeight = height;
      return this;
    }
  };

  var Methods = {};
  Object.assign(Methods, BloonConfigurationMethods, ChromaticConfigurationMethods, VignetteConfigurationMethod, NoiseConfigurationMethod, VHSConfigurationMethod, ScanlinesConfigurationMethod, CRTConfigurationMethod);

  var PostFXPipeline = Phaser.Renderer.WebGL.Pipelines.PostFXPipeline;
  var GetValue = Phaser.Utils.Objects.GetValue;

  var HorrifiPostFxPipeline = /*#__PURE__*/function (_PostFXPipeline) {
    _inherits(HorrifiPostFxPipeline, _PostFXPipeline);

    var _super = _createSuper(HorrifiPostFxPipeline);

    function HorrifiPostFxPipeline(game) {
      var _this;

      _classCallCheck(this, HorrifiPostFxPipeline);

      _this = _super.call(this, {
        name: 'rexHorrifiPostFx',
        game: game,
        renderTarget: true,
        fragShader: frag
      });
      _this.seed = Math.random();
      _this.now = 0; // Bloon

      _this.enableBloom = false;
      _this.bloomRadius = 0;
      _this.bloomIntensity = 0;
      _this.bloomThreshold = 0;
      _this.bloomTexelX = 0;
      _this.bloomTexelY = 0; // Chromatic abberation

      _this.enableChromatic = false;
      _this.chabIntensity = 0; // Vignette

      _this.enableVignette = false;
      _this.vignetteStrength = 0;
      _this.vignetteIntensity = 0; // Noise

      _this.enableNoise = false;
      _this.noiseStrength = 0; // VHS

      _this.enableVHS = false;
      _this.vhsStrength = 0; // Scanlines

      _this.enableScanlines = false;
      _this.scanStrength = 0; // CRT

      _this.enableCRT = false;
      _this.crtWidth = 1;
      _this.crtHeight = 1;
      return _this;
    }

    _createClass(HorrifiPostFxPipeline, [{
      key: "resetFromJSON",
      value: function resetFromJSON(o) {
        var enable = GetValue(o, 'enable', false); // Bloom

        this.setBloomEnable(GetValue(o, 'bloomEnable', enable));
        this.setBloomRadius(GetValue(o, 'bloomRadius', 0));
        return this;
      }
    }, {
      key: "onPreRender",
      value: function onPreRender() {
        this.set1f('seed', this.seed); // Bloon

        this.set1f('enableBloom', this.enableBloom ? 1 : 0);
        this.set3f('bloom', this.bloomRadius, this.bloomIntensity, this.bloomThreshold);
        this.set2f('bloomTexel', this.bloomTexelX, this.bloomTexelY); // Chromatic abberation

        this.set1f('enableChromatic', this.enableChromatic ? 1 : 0);
        this.set1f('chabIntensity', this.chabIntensity); // Vignette

        this.set1f('enableVignette', this.enableVignette ? 1 : 0);
        this.set2f('vignette', this.vignetteStrength, this.vignetteIntensity); // Noise

        this.set1f('enableNoise', this.enableNoise ? 1 : 0);
        this.set1f('noiseStrength', this.noiseStrength); // VHS

        this.set1f('enableVHS', this.enableVHS ? 1 : 0);
        this.set1f('vhsStrength', this.vhsStrength); // Scanlines

        this.set1f('enableScanlines', this.enableScanlines ? 1 : 0);
        this.set1f('scanStrength', this.scanStrength); // CRT        

        this.set1f('enableCRT', this.enableCRT ? 1 : 0);
        this.set2f('crtSize', this.crtWidth, this.crtHeight); // Eanble by VHS    

        if (this.enableVHS) {
          this.now += this.game.loop.delta;
        }

        this.set1f('time', this.now);
      }
    }]);

    return HorrifiPostFxPipeline;
  }(PostFXPipeline);

  Object.assign(HorrifiPostFxPipeline.prototype, Methods);

  var GameClass = Phaser.Game;

  var IsGame = function IsGame(object) {
    return object instanceof GameClass;
  };

  var SceneClass = Phaser.Scene;

  var IsSceneObject = function IsSceneObject(object) {
    return object instanceof SceneClass;
  };

  var GetGame = function GetGame(object) {
    if (IsGame(object)) {
      return object;
    } else if (IsGame(object.game)) {
      return object.game;
    } else if (IsSceneObject(object.scene)) {
      // object = game object
      return object.scene.game;
    }
  };

  var RegisterPostPipeline = function RegisterPostPipeline(game, postFxPipelineName, PostFxPipelineClass) {
    GetGame(game).renderer.pipelines.addPostPipeline(postFxPipelineName, PostFxPipelineClass);
  };

  var AddPostFxPipelineInstance = function AddPostFxPipelineInstance(gameObject, PostFxPipelineClass, config) {
    if (config === undefined) {
      config = {};
    }

    gameObject.setPostPipeline(PostFxPipelineClass);
    var pipeline = gameObject.postPipelines[gameObject.postPipelines.length - 1];
    pipeline.resetFromJSON(config);

    if (config.name) {
      pipeline.name = config.name;
    }

    return pipeline;
  };

  var SpliceOne = Phaser.Utils.Array.SpliceOne;

  var RemovePostFxPipelineInstance = function RemovePostFxPipelineInstance(gameObject, PostFxPipelineClass, name) {
    if (name === undefined) {
      var pipelines = gameObject.postPipelines;

      for (var i = pipelines.length - 1; i >= 0; i--) {
        var instance = pipelines[i];

        if (instance instanceof PostFxPipelineClass) {
          instance.destroy();
          SpliceOne(pipelines, i);
        }
      }
    } else {
      var pipelines = gameObject.postPipelines;

      for (var i = 0, cnt = pipelines.length; i < cnt; i++) {
        var instance = pipelines[i];

        if (instance instanceof PostFxPipelineClass && instance.name === name) {
          instance.destroy();
          SpliceOne(pipelines, i);
        }
      }
    }
  };

  var GetPostFxPipelineInstance = function GetPostFxPipelineInstance(gameObject, PostFxPipelineClass, name) {
    if (name === undefined) {
      var result = [];
      var pipelines = gameObject.postPipelines;

      for (var i = 0, cnt = pipelines.length; i < cnt; i++) {
        var instance = pipelines[i];

        if (instance instanceof PostFxPipelineClass) {
          result.push(instance);
        }
      }

      return result;
    } else {
      var pipelines = gameObject.postPipelines;

      for (var i = 0, cnt = pipelines.length; i < cnt; i++) {
        var instance = pipelines[i];

        if (instance instanceof PostFxPipelineClass && instance.name === name) {
          return instance;
        }
      }
    }
  };

  var BasePostFxPipelinePlugin = /*#__PURE__*/function (_Phaser$Plugins$BaseP) {
    _inherits(BasePostFxPipelinePlugin, _Phaser$Plugins$BaseP);

    var _super = _createSuper(BasePostFxPipelinePlugin);

    function BasePostFxPipelinePlugin() {
      _classCallCheck(this, BasePostFxPipelinePlugin);

      return _super.apply(this, arguments);
    }

    _createClass(BasePostFxPipelinePlugin, [{
      key: "setPostPipelineClass",
      value: function setPostPipelineClass(PostFxPipelineClass, postFxPipelineName) {
        this.PostFxPipelineClass = PostFxPipelineClass;
        this.postFxPipelineName = postFxPipelineName;
        return this;
      }
    }, {
      key: "start",
      value: function start() {
        var eventEmitter = this.game.events;
        eventEmitter.once('destroy', this.destroy, this);
        RegisterPostPipeline(this.game, this.postFxPipelineName, this.PostFxPipelineClass);
      }
    }, {
      key: "add",
      value: function add(gameObject, config) {
        return AddPostFxPipelineInstance(gameObject, this.PostFxPipelineClass, config);
      }
    }, {
      key: "remove",
      value: function remove(gameObject, name) {
        RemovePostFxPipelineInstance(gameObject, this.PostFxPipelineClass, name);
        return this;
      }
    }, {
      key: "get",
      value: function get(gameObject, name) {
        return GetPostFxPipelineInstance(gameObject, this.PostFxPipelineClass, name);
      }
    }]);

    return BasePostFxPipelinePlugin;
  }(Phaser.Plugins.BasePlugin);

  var IsInValidKey = function IsInValidKey(keys) {
    return keys == null || keys === '' || keys.length === 0;
  };

  var GetEntry = function GetEntry(target, keys, defaultEntry) {
    var entry = target;

    if (IsInValidKey(keys)) ; else {
      if (typeof keys === 'string') {
        keys = keys.split('.');
      }

      var key;

      for (var i = 0, cnt = keys.length; i < cnt; i++) {
        key = keys[i];

        if (entry[key] == null || _typeof(entry[key]) !== 'object') {
          var newEntry;

          if (i === cnt - 1) {
            if (defaultEntry === undefined) {
              newEntry = {};
            } else {
              newEntry = defaultEntry;
            }
          } else {
            newEntry = {};
          }

          entry[key] = newEntry;
        }

        entry = entry[key];
      }
    }

    return entry;
  };

  var SetValue = function SetValue(target, keys, value, delimiter) {
    if (delimiter === undefined) {
      delimiter = '.';
    } // no object


    if (_typeof(target) !== 'object') {
      return;
    } // invalid key
    else if (IsInValidKey(keys)) {
      // don't erase target
      if (value == null) {
        return;
      } // set target to another object
      else if (_typeof(value) === 'object') {
        target = value;
      }
    } else {
      if (typeof keys === 'string') {
        keys = keys.split(delimiter);
      }

      var lastKey = keys.pop();
      var entry = GetEntry(target, keys);
      entry[lastKey] = value;
    }

    return target;
  };

  var HorrifiPipelinePlugin = /*#__PURE__*/function (_BasePostFxPipelinePl) {
    _inherits(HorrifiPipelinePlugin, _BasePostFxPipelinePl);

    var _super = _createSuper(HorrifiPipelinePlugin);

    function HorrifiPipelinePlugin(pluginManager) {
      var _this;

      _classCallCheck(this, HorrifiPipelinePlugin);

      _this = _super.call(this, pluginManager);

      _this.setPostPipelineClass(HorrifiPostFxPipeline, 'rexHorrifiPostFx');

      return _this;
    } // addBehavior(gameObject, config) {
    //     return new HorrifiPostFxPipelineBehavior(gameObject, config);
    // }


    return _createClass(HorrifiPipelinePlugin);
  }(BasePostFxPipelinePlugin);

  SetValue(window, 'RexPlugins.Pipelines.HorrifiPostFx', HorrifiPostFxPipeline);

  return HorrifiPipelinePlugin;

}));
