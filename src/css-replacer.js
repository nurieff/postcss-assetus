/**
 * @param {String} css
 * @param {AssetusList} AssetusList
 * @param {String} searchPrefix
 * @constructor
 */
function AssetusCssReplacer(css, AssetusList, searchPrefix) {

  if (!(this instanceof AssetusCssReplacer)) return new AssetusCssReplacer(AssetusList, searchPrefix);

  this._searchPrefix = searchPrefix;

  /**
   * @type {AssetusList}
   */
  this.AssetusList = AssetusList;
}

AssetusCssReplacer.prototype._reg = function (mod, dopArgs) {

  var r = [];
  r.push(this._searchPrefix);
  if (mod) {
    if (Array.isArray(mod)) {
      r.push("\\-(" + mod.join('|') + ')');
    } else {
      r.push("\\-" + mod);
    }
  }

  if (dopArgs) {
    r.push("\\(\\\"([^\\)\\\"]+)\\\"");
    r.push(",?\\s*?\\\"?([^\\)\\\"]*)\\\"?\\)");
  } else {
    r.push("\\(\\\"([^\\)\\\"]+)\\\"\\)");
  }

  return new RegExp(r.join(''), 'ig');
};

AssetusCssReplacer.prototype._regAsProperty = function (mod, dopArgs) {

  var r = [];
  r.push(this._searchPrefix + '\\:\\s*?');

  if (Array.isArray(mod)) {
    r.push("(" + mod.join('|') + ')');
  } else {
    r.push(mod);
  }


  if (dopArgs) {
    r.push("\\(\\\"([^\\)\\\"]+)\\\"");
    r.push(",?\\s*?\\\"?([^\\)\\\"]*)\\\"?\\)");
  } else {
    r.push("\\(\\\"([^\\)\\\"]+)\\\"\\)");
  }

  return new RegExp(r.join(''), 'ig');
};

AssetusCssReplacer.prototype._common = function (v) {

  var allow = ['width','height'];
  var self = this;
  v = v.replace(this._reg(allow, true), function () {
    var propertiy = arguments[1];
    var str = arguments[2];

    if (!self.AssetusList.get(str)) {
      if (['height','width'].indexOf(propertiy) !== -1) {
        return 'auto';
      }

      return '';
    }

    return self.AssetusList.get(str)[propertiy]();
  });

  return v;
};

AssetusCssReplacer.prototype._forParent = function (v) {
  var allow = ['url','size','inline'];
  var self = this;
  v = v.replace(this._reg(allow), function () {
    var propertiy = arguments[1];
    var str = arguments[2];

    if (!self.AssetusList.get(str)) {
      if (propertiy === 'size') {
        return '';
      }

      return '';
    }

    return self.AssetusList.get(str)[propertiy]();
  });

  return v;
};

AssetusCssReplacer.prototype.ihw = function () {
  var str = null;
  var img = null;
  this.css = this.css.replace(this._regAsProperty('ihw', true), function () {
    str = arguments[1];
    img = arguments[2];
  });

  if (!img || !this.AssetusList.get(str)) {
    return null;
  }

  return [
    {
      prop: 'background-image',
      value: this.AssetusList.get(str).url(img)
    },
    {
      prop: 'height',
      value: this.AssetusList.get(str).height(img)
    },
    {
      prop: 'width',
      value: this.AssetusList.get(str).width(img)
    }
  ];
};

/**
 * @returns {AssetusCssReplacer}
 */
AssetusCssReplacer.prototype.asValue = function (v) {
  v = this._forParent(v);
  v = this._common(v);

  return v;
};

module.exports = AssetusCssReplacer;