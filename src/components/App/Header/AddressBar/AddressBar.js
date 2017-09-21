(function ( global, factory ) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.AddressBar = factory());
}(this, (function () { 'use strict';

function recompute ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'availableAddresses' in newState && differs( state.availableAddresses, oldState.availableAddresses ) ) || ( 'address' in newState && differs( state.address, oldState.address ) ) ) {
		state.addresses = newState.addresses = template.computed.addresses( state.availableAddresses, state.address );
	}
}

var template = (function () {
const { noop } = require('lodash')
const AutoComplete = require('js-autocomplete')

return {
  oncreate () {
    const inputSelector = '#address'

    this.autoComplete = new AutoComplete({
      selector: inputSelector,
      minChars: 1,
      cache: false,
      source: (term, response) => {
        if(term.length < this._state.address.length) return response([])
        response(this._state.addresses.filter(address => address.toLowerCase().includes(term.toLowerCase())))
      }
    })

    document.querySelector(inputSelector).addEventListener('keyup', e => {
      if (e.keyCode == 13) {
        this._state.setAddress(e.target.value)
      }
    })
  },
  computed: {
    addresses: (availableAddresses, address) => availableAddresses.map(a => address + a)
  },
  ondestroy () {
    this.autoComplete.destroy()
  },
  data () {
    return {
      address: '',
      availableAddresses: [],
      setAddress: noop,
    }
  },
}
}());

function encapsulateStyles ( node ) {
	setAttribute( node, 'svelte-939388320', '' );
}

function add_css () {
	var style = createElement( 'style' );
	style.id = 'svelte-939388320-style';
	style.textContent = "[svelte-939388320]#address,[svelte-939388320] #address{width:100%;padding:10px 15px}";
	appendNode( style, document.head );
}

function create_main_fragment ( state, component ) {
	var input, input_value_value;

	return {
		create: function () {
			input = createElement( 'input' );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			encapsulateStyles( input );
			input.id = "address";
			input.type = "text";
			input.value = input_value_value = state.address;
		},

		mount: function ( target, anchor ) {
			insertNode( input, target, anchor );
		},

		update: function ( changed, state ) {
			if ( input_value_value !== ( input_value_value = state.address ) ) {
				input.value = input_value_value;
			}
		},

		unmount: function () {
			detachNode( input );
		},

		destroy: noop
	};
}

function AddressBar ( options ) {
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
	if ( !document.getElementById( 'svelte-939388320-style' ) ) add_css();

	var oncreate = template.oncreate.bind( this );

	if ( !options._root ) {
		this._oncreate = [oncreate];
	} else {
	 	this._root._oncreate.push(oncreate);
	 }

	this._fragment = create_main_fragment( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}

	if ( !options._root ) {
		callAll(this._oncreate);
	}
}

assign( AddressBar.prototype, {
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set
 });

AddressBar.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute( this._state, newState, oldState, false )
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

AddressBar.prototype.teardown = AddressBar.prototype.destroy = function destroy ( detach ) {
	if ( this._destroyed ) return;
	this.fire( 'destroy' );
	template.ondestroy.call( this );

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

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function noop() {}

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

function callAll(fns) {
	while (fns && fns.length) fns.pop()();
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

return AddressBar;

})));