var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

/**
 *  Ajax Autocomplete for jQuery, version 1.2.9
 *  (c) 2013 Tomas Kirda
 *
 *  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
 *  For details, see the web site: https://github.com/devbridge/jQuery-Autocomplete
 *
 */
(function(d) {
	"function" === typeof define && define.amd ? define([
		"jquery"
	], d) : d(jQuery)
})(function(d) {
	function g(a, b) {
		var c = function() {
		},
				c = {
					autoSelectFirst: !1,
					appendTo: "body",
					serviceUrl: null,
					lookup: null,
					onSelect: null,
					width: "auto",
					minChars: 1,
					maxHeight: 300,
					deferRequestBy: 0,
					params: {},
					formatResult: g.formatResult,
					delimiter: null,
					zIndex: 9999,
					type: "GET",
					noCache: !1,
					onSearchStart: c,
					onSearchComplete: c,
					onSearchError: c,
					containerClass: "autocomplete-suggestions",
					tabDisabled: !1,
					dataType: "text",
					currentRequest: null,
					triggerSelectOnValidInput: !0,
					lookupFilter: function(a, b, c) {
						return -1 !== a.value.toLowerCase().indexOf(c)
					},
					paramName: "query",
					transformResult: function(a) {
						return "string" === typeof a ? d.parseJSON(a) : a
					}
				};
		this.element = a;
		this.el = d(a);
		this.suggestions = [
		];
		this.badQueries = [
		];
		this.selectedIndex = -1;
		this.currentValue = this.element.value;
		this.intervalId = 0;
		this.cachedResponse = {};
		this.onChange = this.onChangeInterval = null;
		this.isLocal = !1;
		this.suggestionsContainer = null;
		this.options = d.extend({}, c, b);
		this.classes = {
			selected: "autocomplete-selected",
			suggestion: "autocomplete-suggestion"
		};
		this.hint = null;
		this.hintValue = "";
		this.selection = null;
		this.initialize();
		this.setOptions(b)
	}
	function stripVowelAccent(str) {
		var s = str;
		var rExps = [
			/[\xC0-\xC2]/g,
			/[\xE0-\xE2]/g,
			/[\xC8-\xCA]/g,
			/[\xE8-\xEB]/g,
			/[\xCC-\xCE]/g,
			/[\xEC-\xEE]/g,
			/[\xD2-\xD4]/g,
			/[\xF2-\xF4]/g,
			/[\xD9-\xDB]/g,
			/[\xF9-\xFB]/g
		];
		var repChar = [
			'A',
			'a',
			'E',
			'e',
			'I',
			'i',
			'O',
			'o',
			'U',
			'u'
		];

		for (var i = 0;
				i < rExps.length;
				i++) {
			s = s.replace(rExps[i], repChar[i]);
		}
		return s;
	}
	var k = function() {
		return {
			escapeRegExChars: function(a) {
				return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
			},
			createNode: function(a) {
				var b = document.createElement("div");
				b.className = a;
				b.style.position = "absolute";
				b.style.display = "none";
				return b
			}
		}
	}();
	g.utils = k;
	d.Autocomplete = g;
	g.formatResult = function(a, b) {
		var c = "(" + k.escapeRegExChars(b) + ")";
		return a.value.replace(RegExp(c, "gi"), "<strong>$1</strong>")
	};
	g.prototype = {
		killerFn: null,
		initialize: function() {
			var a = this,
					b = "." + a.classes.suggestion,
					c = a.classes.selected,
					e = a.options,
					f;
			a.element.setAttribute("autocomplete", "off");
			a.killerFn = function(b) {
				0 === d(b.target).closest("." + a.options.containerClass).length && (a.killSuggestions(), a.disableKillerFn())
			};
			a.suggestionsContainer = g.utils.createNode(e.containerClass);
			f = d(a.suggestionsContainer);
			f.appendTo(e.appendTo);
			"auto" !== e.width && f.width(e.width);
			f.on("mouseover.autocomplete", b, function() {
				a.activate(d(this).data("index"))
			});
			f.on("mouseout.autocomplete", function() {
				a.selectedIndex = -1;
				f.children("." + c).removeClass(c)
			});
			f.on("click.autocomplete", b, function() {
				a.select(d(this).data("index"))
			});
			a.fixPosition();
			a.fixPositionCapture = function() {
				a.visible && a.fixPosition()
			};
			d(window).on("resize.autocomplete", a.fixPositionCapture);
			a.el.on("keydown.autocomplete", function(b) {
				a.onKeyPress(b)
			});
			a.el.on("keyup.autocomplete", function(b) {
				a.onKeyUp(b)
			});
			a.el.on("blur.autocomplete", function() {
				a.onBlur()
			});
			a.el.on("focus.autocomplete", function() {
				a.onFocus()
			});
			a.el.on("change.autocomplete", function(b) {
				a.onKeyUp(b)
			})
		},
		onFocus: function() {
			this.fixPosition();
			if (this.options.minChars <= this.el.val().length)
				this.onValueChange()
		},
		onBlur: function() {
			this.enableKillerFn()
		},
		setOptions: function(a) {
			var b = this.options;
			d.extend(b, a);
			if (this.isLocal = d.isArray(b.lookup))
				b.lookup = this.verifySuggestionsFormat(b.lookup);
			d(this.suggestionsContainer).css({
				"max-height": b.maxHeight + "px",
				width: b.width + "px",
				"z-index": b.zIndex
			})
		},
		clearCache: function() {
			this.cachedResponse = {};
			this.badQueries = [
			]
		},
		clear: function() {
			this.clearCache();
			this.currentValue = "";
			this.suggestions = [
			]
		},
		disable: function() {
			this.disabled = !0;
			this.currentRequest && this.currentRequest.abort()
		},
		enable: function() {
			this.disabled = !1
		},
		fixPosition: function() {
			var a;
			"body" === this.options.appendTo && (a = this.el.offset(), a = {
				top: a.top + this.el.outerHeight() + "px",
				left: a.left + "px"
			}, "auto" === this.options.width && (a.width = this.el.outerWidth() - 2 + "px"), d(this.suggestionsContainer).css(a))
		},
		enableKillerFn: function() {
			d(document).on("click.autocomplete",
					this.killerFn)
		},
		disableKillerFn: function() {
			d(document).off("click.autocomplete", this.killerFn)
		},
		killSuggestions: function() {
			var a = this;
			a.stopKillSuggestions();
			a.intervalId = window.setInterval(function() {
				a.hide();
				a.stopKillSuggestions()
			}, 50)
		},
		stopKillSuggestions: function() {
			window.clearInterval(this.intervalId)
		},
		isCursorAtEnd: function() {
			var a = this.el.val().length,
					b = this.element.selectionStart;
			return "number" === typeof b ? b === a : document.selection ? (b = document.selection.createRange(), b.moveStart("character", -a), a === b.text.length) : !0
		},
		onKeyPress: function(a) {
			if (!this.disabled && !this.visible && 40 === a.which && this.currentValue)
				this.suggest();
			else if (!this.disabled && this.visible) {
				switch (a.which) {
					case 27:
						this.el.val(this.currentValue);
						this.hide();
						break;
					case 39:
						if (this.hint && this.options.onHint && this.isCursorAtEnd()) {
							this.selectHint();
							break
						}
						return;
					case 9:
						if (this.hint && this.options.onHint) {
							this.selectHint();
							return
						}
					case 13:
						if (-1 === this.selectedIndex) {
							this.hide();
							return
						}
						this.select(this.selectedIndex);
						if (9 === a.which &&
								!1 === this.options.tabDisabled)
							return;
						break;
					case 38:
						this.moveUp();
						break;
					case 40:
						this.moveDown();
						break;
					default:
						return
				}
				a.stopImmediatePropagation();
				a.preventDefault()
			}
		},
		onKeyUp: function(a) {
			var b = this;
			if (!b.disabled) {
				switch (a.which) {
					case 38:
					case 40:
						return
				}
				clearInterval(b.onChangeInterval);
				if (b.currentValue !== b.el.val())
					if (b.findBestHint(), 0 < b.options.deferRequestBy)
						b.onChangeInterval = setInterval(function() {
							b.onValueChange()
						}, b.options.deferRequestBy);
					else
						b.onValueChange()
			}
		},
		onValueChange: function() {
			var a =
					this.options,
					b = this.el.val(),
					c = this.getQuery(b);
			this.selection && (this.selection = null, (a.onInvalidateSelection || d.noop).call(this.element));
			clearInterval(this.onChangeInterval);
			this.currentValue = b;
			if (a.triggerSelectOnValidInput && (b = this.findSuggestionIndex(c), -1 !== b)) {
				this.select(b);
				return
			}
			var q = this.getQuery(stripVowelAccent(this.currentValue));
			this.selectedIndex = -1;
			if (q === '' || q.length < this.options.minChars) {
				this.hide();
			} else {
				this.getSuggestions(q);
			}
		},
		findSuggestionIndex: function(a) {
			var b = -1,
					c = a.toLowerCase();
			d.each(this.suggestions, function(a, d) {
				if (d.value.toLowerCase() === c)
					return b =
							a, !1
			});
			return b
		},
		getQuery: function(a) {
			var b = this.options.delimiter;
			if (!b)
				return a;
			a = a.split(b);
			return d.trim(a[a.length - 1])
		},
		getSuggestionsLocal: function(a) {
			var b = this.options,
					c = a.toLowerCase(),
					e = b.lookupFilter,
					f = parseInt(b.lookupLimit, 10),
					b = {
						suggestions: d.grep(b.lookup, function(b) {
							return e(b, a, c)
						})
					};
			f && b.suggestions.length > f && (b.suggestions = b.suggestions.slice(0, f));
			return b
		},
		getSuggestions: function(a) {
			var b,
					c = this,
					e = c.options,
					f = e.serviceUrl,
					l,
					g;
			e.params[e.paramName] = a;
			l = e.ignoreParams ? null : e.params;
			c.isLocal ? b = c.getSuggestionsLocal(a) : (d.isFunction(f) && (f = f.call(c.element, a)), g = f + "?" + d.param(l || {}), b = c.cachedResponse[g]);
			b && d.isArray(b.suggestions) ? (c.suggestions = b.suggestions, c.suggest()) : c.isBadQuery(a) || !1 === e.onSearchStart.call(c.element, e.params) || (c.currentRequest && c.currentRequest.abort(), c.currentRequest = d.ajax({
				url: f,
				data: l,
				type: e.type,
				dataType: e.dataType
			}).done(function(b) {
				c.currentRequest = null;
				c.processResponse(b, a, g);
				e.onSearchComplete.call(c.element, a)
			}).fail(function(b, d, f) {
				e.onSearchError.call(c.element,
						a, b, d, f)
			}))
		},
		isBadQuery: function(a) {
			for (var b = this.badQueries,
					c = b.length;
					c--; )
				if (0 === a.indexOf(b[c]))
					return !0;
			return !1
		},
		hide: function() {
			this.visible = !1;
			this.selectedIndex = -1;
			d(this.suggestionsContainer).hide();
			this.signalHint(null)
		},
		suggest: function() {
			if (0 === this.suggestions.length)
				this.hide();
			else {
				var a = this.options,
						b = a.formatResult,
						c = this.getQuery(this.currentValue),
						e = this.classes.suggestion,
						f = this.classes.selected,
						g = d(this.suggestionsContainer),
						k = a.beforeRender,
						m = "",
						h;
				if (a.triggerSelectOnValidInput &&
						(h = this.findSuggestionIndex(c), -1 !== h)) {
					this.select(h);
					return
				}
				d.each(this.suggestions, function(a, d) {
					m += '<div class="' + e + '" data-index="' + a + '">' + b(d, c) + "</div>"
				});
				"auto" === a.width && (h = this.el.outerWidth() - 2, g.width(0 < h ? h : 300));
				g.html(m);
				a.autoSelectFirst && (this.selectedIndex = 0, g.children().first().addClass(f));
				d.isFunction(k) && k.call(this.element, g);
				g.show();
				this.visible = !0;
				this.findBestHint()
			}
		},
		findBestHint: function() {
			var a = this.el.val().toLowerCase(),
					b = null;
			a && (d.each(this.suggestions, function(c,
					d) {
				var f = 0 === d.value.toLowerCase().indexOf(a);
				f && (b = d);
				return !f
			}), this.signalHint(b))
		},
		signalHint: function(a) {
			var b = "";
			a && (b = this.currentValue + a.value.substr(this.currentValue.length));
			this.hintValue !== b && (this.hintValue = b, this.hint = a, (this.options.onHint || d.noop)(b))
		},
		verifySuggestionsFormat: function(a) {
			return a.length && "string" === typeof a[0] ? d.map(a, function(a) {
				return {
					value: a,
					data: null
				}
			}) : a
		},
		processResponse: function(a, b, c) {
			var d = this.options;
			a = d.transformResult(a, b);
			a.suggestions = this.verifySuggestionsFormat(a.suggestions);
			d.noCache || (this.cachedResponse[c] = a, 0 === a.suggestions.length && this.badQueries.push(c));
			b === this.getQuery(this.currentValue) && (this.suggestions = a.suggestions, this.suggest())
		},
		activate: function(a) {
			var b = this.classes.selected,
					c = d(this.suggestionsContainer),
					e = c.children();
			c.children("." + b).removeClass(b);
			this.selectedIndex = a;
			return -1 !== this.selectedIndex && e.length > this.selectedIndex ? (a = e.get(this.selectedIndex), d(a).addClass(b), a) : null
		},
		selectHint: function() {
			var a = d.inArray(this.hint, this.suggestions);
			this.select(a)
		},
		select: function(a) {
			this.hide();
			this.onSelect(a)
		},
		moveUp: function() {
			-1 !== this.selectedIndex && (0 === this.selectedIndex ? (d(this.suggestionsContainer).children().first().removeClass(this.classes.selected), this.selectedIndex = -1, this.el.val(this.currentValue), this.findBestHint()) : this.adjustScroll(this.selectedIndex - 1))
		},
		moveDown: function() {
			this.selectedIndex !== this.suggestions.length - 1 && this.adjustScroll(this.selectedIndex + 1)
		},
		adjustScroll: function(a) {
			var b = this.activate(a),
					c,
					e;
			b && (b = b.offsetTop,
					c = d(this.suggestionsContainer).scrollTop(), e = c + this.options.maxHeight - 25, b < c ? d(this.suggestionsContainer).scrollTop(b) : b > e && d(this.suggestionsContainer).scrollTop(b - this.options.maxHeight + 25), this.el.val(this.getValue(this.suggestions[a].value)), this.signalHint(null))
		},
		onSelect: function(a) {
			var b = this.options.onSelect;
			a = this.suggestions[a];
			this.currentValue = this.getValue(a.value);
			this.el.val(this.currentValue);
			this.signalHint(null);
			this.suggestions = [
			];
			this.selection = a;
			d.isFunction(b) && b.call(this.element,
					a)
		},
		getValue: function(a) {
			var b = this.options.delimiter,
					c;
			if (!b)
				return a;
			c = this.currentValue;
			b = c.split(b);
			return 1 === b.length ? a : c.substr(0, c.length - b[b.length - 1].length) + a
		},
		dispose: function() {
			this.el.off(".autocomplete").removeData("autocomplete");
			this.disableKillerFn();
			d(window).off("resize.autocomplete", this.fixPositionCapture);
			d(this.suggestionsContainer).remove()
		}
	};
	d.fn.autocomplete = function(a, b) {
		return 0 === arguments.length ? this.first().data("autocomplete") : this.each(function() {
			var c = d(this),
					e =
					c.data("autocomplete");
			if ("string" === typeof a) {
				if (e && "function" === typeof e[a])
					e[a](b)
			} else
				e && e.dispose && e.dispose(), e = new g(this, a), c.data("autocomplete", e)
		})
	}
});

}
/*
     FILE ARCHIVED ON 14:56:03 Dec 16, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 19:46:12 Jan 22, 2024.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 158.024
  exclusion.robots: 0.103
  exclusion.robots.policy: 0.087
  cdx.remote: 0.212
  esindex: 0.012
  LoadShardBlock: 104.019 (3)
  PetaboxLoader3.datanode: 108.097 (4)
  load_resource: 92.067
  PetaboxLoader3.resolve: 46.29
*/