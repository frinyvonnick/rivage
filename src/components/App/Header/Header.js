(function ( global, factory ) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Header = factory());
}(this, (function () { 'use strict';

var template = (function () {
const { LevelUp } = require('./LevelUp')
const { AddressBar } = require('./AddressBar')
const { SearchBar } = require('./SearchBar')

return {
  components: {
    LevelUp,
    AddressBar,
    SearchBar,
  },
}
}());

function encapsulateStyles ( node ) {
	setAttribute( node, 'svelte-2304861103', '' );
}

function add_css () {
	var style = createElement( 'style' );
	style.id = 'svelte-2304861103-style';
	style.textContent = "[svelte-2304861103].header,[svelte-2304861103] .header{padding:10px 15px;background-color:#ddd;border-bottom:#ccc;display:flex;align-items:center}[svelte-2304861103].header > *,[svelte-2304861103] .header > *{margin:0 10px}";
	appendNode( style, document.head );
}

function create_main_fragment ( state, component ) {
	var link, text, div, text_1, text_2;

	var levelup = new template.components.LevelUp({
		_root: component._root
	});

	var addressbar = new template.components.AddressBar({
		_root: component._root
	});

	var searchbar = new template.components.SearchBar({
		_root: component._root
	});

	return {
		create: function () {
			link = createElement( 'link' );
			text = createText( "\n" );
			div = createElement( 'div' );
			levelup._fragment.create();
			text_1 = createText( "\n  " );
			addressbar._fragment.create();
			text_2 = createText( "\n  " );
			searchbar._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			encapsulateStyles( link );
			link.rel = "stylesheet";
			setAttribute( link, 'type', "text/css" );
			link.href = "../../node_modules/js-autocomplete/auto-complete.css";
			encapsulateStyles( div );
			div.className = "header";
		},

		mount: function ( target, anchor ) {
			insertNode( link, target, anchor );
			insertNode( text, target, anchor );
			insertNode( div, target, anchor );
			levelup._fragment.mount( div, null );
			appendNode( text_1, div );
			addressbar._fragment.mount( div, null );
			appendNode( text_2, div );
			searchbar._fragment.mount( div, null );
		},

		unmount: function () {
			detachNode( link );
			detachNode( text );
			detachNode( div );
		},

		destroy: function () {
			levelup.destroy( false );
			addressbar.destroy( false );
			searchbar.destroy( false );
		}
	};
}

function Header ( options ) {
	options = options || {};
	this._state = options.data || {};

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._destroyed = false;
	if ( !document.getElementById( 'svelte-2304861103-style' ) ) add_css();

	if ( !options._root ) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}

	if ( !options._root ) {
		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign( Header.prototype, {
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set
 });

Header.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Header.prototype.teardown = Header.prototype.destroy = function destroy ( detach ) {
	if ( this._destroyed ) return;
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._destroyed = true;
};

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function createElement(name) {
	return document.createElement(name);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function createText(data) {
	return document.createTextNode(data);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function callAll(fns) {
	while (fns && fns.length) fns.pop()();
}

function assign(target) {
	var k,
		source,
		i = 1,
		len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) target[k] = source[k];
	}

	return target;
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function observe(key, callback, options) {
	var group = options && options.defer
		? this._observers.post
		: this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this._root._lock) return;
	this._root._lock = true;
	callAll(this._root._beforecreate);
	callAll(this._root._oncreate);
	callAll(this._root._aftercreate);
	this._root._lock = false;
}

function dispatchObservers(component, group, newState, oldState) {
	for (var key in group) {
		if (!(key in newState)) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		if (differs(newValue, oldValue)) {
			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}
}

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

return Header;

})));