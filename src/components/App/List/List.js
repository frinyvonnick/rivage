(function ( global, factory ) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./File')) :
	typeof define === 'function' && define.amd ? define([''], factory) :
	(global.List = factory(File));
}(this, (function ( File ) { 'use strict';

File = ( File && File.__esModule ) ? File['default'] : File;

var template = (function () {
  const { ipcRenderer } = require('electron')

  return {
    data () {
      return {
        files: [],
      }
    },
    methods: {
      browse: function (path) {
        ipcRenderer.send('change-path', path)
      }
    }
  }
}());

function add_css () {
	var style = createElement( 'style' );
	style.id = 'svelte-3794444557-style';
	style.textContent = "\n  [svelte-3794444557].list, [svelte-3794444557] .list {\n    width: 100%;\n    display: flex;\n    flex-wrap: wrap;\n  }\n";
	appendNode( style, document.head );
}

function create_main_fragment ( state, component ) {
	var div;

	var each_block_value = state.files;

	var each_block_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_iterations[i] = create_each_block( state, each_block_value, each_block_value[i], i, component );
	}

	return {
		create: function () {
			div = createElement( 'div' );

			for ( var i = 0; i < each_block_iterations.length; i += 1 ) {
				each_block_iterations[i].create();
			}
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			setAttribute( div, 'svelte-3794444557', '' );
			div.className = "list";
		},

		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );

			for ( var i = 0; i < each_block_iterations.length; i += 1 ) {
				each_block_iterations[i].mount( div, null );
			}
		},

		update: function ( changed, state ) {
			var each_block_value = state.files;

			if ( 'files' in changed ) {
				for ( var i = 0; i < each_block_value.length; i += 1 ) {
					if ( each_block_iterations[i] ) {
						each_block_iterations[i].update( changed, state, each_block_value, each_block_value[i], i );
					} else {
						each_block_iterations[i] = create_each_block( state, each_block_value, each_block_value[i], i, component );
						each_block_iterations[i].create();
						each_block_iterations[i].mount( div, null );
					}
				}

				for ( ; i < each_block_iterations.length; i += 1 ) {
					each_block_iterations[i].unmount();
					each_block_iterations[i].destroy();
				}
				each_block_iterations.length = each_block_value.length;
			}
		},

		unmount: function () {
			detachNode( div );

			for ( var i = 0; i < each_block_iterations.length; i += 1 ) {
				each_block_iterations[i].unmount();
			}
		},

		destroy: function () {
			destroyEach( each_block_iterations, false, 0 );
		}
	};
}

function create_each_block ( state, each_block_value, file, file_index, component ) {

	var file_1 = new File({
		_root: component._root,
		data: {
			name: file.name,
			path: file.path,
			thumbnail: file.thumbnail,
			isDirectory: file.isDirectory
		}
	});

	file_1.on( 'browse', function ( event ) {
		component.browse(event);
	});

	return {
		create: function () {
			file_1._fragment.create();
		},

		mount: function ( target, anchor ) {
			file_1._fragment.mount( target, anchor );
		},

		update: function ( changed, state, each_block_value, file, file_index ) {
			var file_1_changes = {};

			if ( 'files' in changed ) file_1_changes.name = file.name;
			if ( 'files' in changed ) file_1_changes.path = file.path;
			if ( 'files' in changed ) file_1_changes.thumbnail = file.thumbnail;
			if ( 'files' in changed ) file_1_changes.isDirectory = file.isDirectory;

			if ( Object.keys( file_1_changes ).length ) file_1.set( file_1_changes );
		},

		unmount: function () {
			file_1._fragment.unmount();
		},

		destroy: function () {
			file_1.destroy( false );
		}
	};
}

function List ( options ) {
	options = options || {};
	this._state = assign( template.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;
	if ( !document.getElementById( 'svelte-3794444557-style' ) ) add_css();
	this._oncreate = [];

	this._fragment = create_main_fragment( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}

	callAll(this._oncreate);
}

assign( List.prototype, template.methods, {
 	get: get,
 	fire: fire,
 	observe: observe,
 	on: on,
 	set: set
 });

List.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
	callAll(this._oncreate);
};

List.prototype.teardown = List.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

function createElement(name) {
	return document.createElement(name);
}

function appendNode(node, target) {
	target.appendChild(node);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

function destroyEach(iterations, detach, start) {
	for (var i = start; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].destroy(detach);
	}
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
	callAll(this._root._oncreate);
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

return List;

})));