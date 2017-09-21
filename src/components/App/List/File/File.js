(function ( global, factory ) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.File = factory());
}(this, (function () { 'use strict';

function recompute ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'isDirectory' in newState && differs( state.isDirectory, oldState.isDirectory ) ) ) {
		state.className = newState.className = template.computed.className( state.isDirectory );
	}
}

var template = (function () {
  const { noop } = require('lodash')
  const classNames = require('classnames')

  return {
    data () {
      return {
        thumbnail: '',
        name: '',
        path: '',
        isDirectory: false,
        setAddress: noop,
        openItem: noop,
      }
    },
    computed: {
      className: isDirectory => classNames('file', { 'directory' :isDirectory })
    },
    methods: {
      click: function () {
        const { isDirectory, setAddress, openItem, path } = this._state

        if (isDirectory) {
          setAddress()
        } else {
          openItem()
        }
      },
    }
  }
}());

function encapsulateStyles ( node ) {
	setAttribute( node, 'svelte-3076271833', '' );
}

function add_css () {
	var style = createElement( 'style' );
	style.id = 'svelte-3076271833-style';
	style.textContent = "[svelte-3076271833].file,[svelte-3076271833] .file{padding:10px;width:12.5%;min-width:100px;display:flex;flex-direction:column;align-items:center}[svelte-3076271833].file p,[svelte-3076271833] .file p{margin-bottom:0;margin-top:5px;width:100%;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}[svelte-3076271833].directory svg,[svelte-3076271833] .directory svg{fill:yellow}";
	appendNode( style, document.head );
}

function create_main_fragment ( state, component ) {
	var div, div_class_value, img, img_src_value, text, p, p_title_value, text_1_value, text_1;

	function click_handler ( event ) {
		component.click();
	}

	return {
		create: function () {
			div = createElement( 'div' );
			img = createElement( 'img' );
			text = createText( "\n  " );
			p = createElement( 'p' );
			text_1 = createText( text_1_value = state.name );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			encapsulateStyles( div );
			div.className = div_class_value = state.className;
			img.src = img_src_value = state.thumbnail;
			img.height = "80";
			addListener( img, 'click', click_handler );
			p.title = p_title_value = state.name;
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
			appendNode( img, div );
			appendNode( text, div );
			appendNode( p, div );
			appendNode( text_1, p );
		},

		update: function ( changed, state ) {
			if ( div_class_value !== ( div_class_value = state.className ) ) {
				div.className = div_class_value;
			}

			if ( img_src_value !== ( img_src_value = state.thumbnail ) ) {
				img.src = img_src_value;
			}

			if ( p_title_value !== ( p_title_value = state.name ) ) {
				p.title = p_title_value;
			}

			if ( text_1_value !== ( text_1_value = state.name ) ) {
				text_1.data = text_1_value;
			}
		},

		unmount: function () {
			detachNode( div );
		},

		destroy: function () {
			removeListener( img, 'click', click_handler );
		}
	};
}

function File ( options ) {
	options = options || {};
	this._state = assign( template.data(), options.data );
	recompute( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._destroyed = false;
	if ( !document.getElementById( 'svelte-3076271833-style' ) ) add_css();

	this._fragment = create_main_fragment( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( File.prototype, template.methods, {
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set
 });

File.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute( this._state, newState, oldState, false )
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

File.prototype.teardown = File.prototype.destroy = function destroy ( detach ) {
	if ( this._destroyed ) return;
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._destroyed = true;
};

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

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

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
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

function callAll(fns) {
	while (fns && fns.length) fns.pop()();
}

return File;

})));