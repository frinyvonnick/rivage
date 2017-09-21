(function ( global, factory ) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.SearchBar = factory());
}(this, (function () { 'use strict';

var template = (function () {
  return {
    data() {
      return {
        search: '',
      }
    },
    methods: {
      keyup: function (e) {
        if (e.key === "Enter") {
          this._state.setSearch(e.target.value)
        }
      },
    },
  }
}());

function encapsulateStyles ( node ) {
	setAttribute( node, 'svelte-3501490515', '' );
}

function add_css () {
	var style = createElement( 'style' );
	style.id = 'svelte-3501490515-style';
	style.textContent = "[svelte-3501490515]#search,[svelte-3501490515] #search{width:250px;padding:10px 15px}";
	appendNode( style, document.head );
}

function create_main_fragment ( state, component ) {
	var input, input_value_value;

	function keyup_handler ( event ) {
		component.keyup(event);
	}

	return {
		create: function () {
			input = createElement( 'input' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			encapsulateStyles( input );
			input.id = "search";
			input.type = "text";
			input.value = input_value_value = state.search;
			input.placeholder = "Rechercher un fichier 🔎";
			addListener( input, 'keyup', keyup_handler );
		},

		mount: function ( target, anchor ) {
			insertNode( input, target, anchor );
		},

		update: function ( changed, state ) {
			if ( input_value_value !== ( input_value_value = state.search ) ) {
				input.value = input_value_value;
			}
		},

		unmount: function () {
			detachNode( input );
		},

		destroy: function () {
			removeListener( input, 'keyup', keyup_handler );
		}
	};
}

function SearchBar ( options ) {
	options = options || {};
	this._state = assign( template.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._destroyed = false;
	if ( !document.getElementById( 'svelte-3501490515-style' ) ) add_css();

	this._fragment = create_main_fragment( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( SearchBar.prototype, template.methods, {
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set
 });

SearchBar.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

SearchBar.prototype.teardown = SearchBar.prototype.destroy = function destroy ( detach ) {
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

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

return SearchBar;

})));