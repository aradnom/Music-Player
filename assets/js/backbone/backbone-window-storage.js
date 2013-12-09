// Overrides to the default sync method to cache API search results to the local window
// Assumes that caches might be shared between APIs (i.e. several API results --> one cache)
// Requires: jQuery, Underscore (extend), Backbone

// Helper functions

// This is a simple implementation of djb2 - saved to US for use later
_.hash = function ( string ) {
	var hash = 5381;

	_.each( string, function ( char ) {
		hash = ( ( hash << 5 ) + hash ) + char.charCodeAt(0);
	});

	return hash;
}

// Save the existing sync method for posterity
Backbone.defaultSync = Backbone.sync;

// DOM element cachine //////////////////////////////////////////////////////////////

// Storing function for creating a new DOM element cache based on passed name - this
// does NOT have to be unique (and won't be in some cases)
Backbone.windowStore = function ( cacheName ) {

	this.cache = cacheName + '-cache';

	// Make sure the cache element exists and create it if not
	if ( ! $( '#' + this.cache ).length )
		$('body').append( '<div id="' + this.cache + '" style="display: none;"></div>' );

	this.cache = $( '#' + this.cache );

}

// Extend the WindowsStore function with CRUD functions
_.extend( Backbone.windowStore.prototype, {

	create : function ( model ) {
		this.cache.append( JSON.stringify( model.toJSON() ) );
	},

	read : function ( model ) {
		// Not needed at the moment
	},

	update : function ( model ) {
		// Not needed at the moment
	},

	delete : function ( model ) {
		// Not needed at the moment
	},

	// Erase the local cache
	clear : function () {
		this.cache.html( '' );
	}

});

// Function for delegating Backbone methods
Backbone.syncWindow = function ( method, model, options, error ) {				

	var store = model.windowStore || model.collection.windowStore;			

	switch ( method ) {
		case 'create' : store.create( model ); break;
		case 'read' : store.create( model ); break;
		case 'update' : store.update( model ); break;
		case 'delete' : store.delete( model ); break;
	}		

}	

// Local caching ////////////////////////////////////////////////////////////////

// Storing function for creating a new DOM element cache based on passed name - this
// does NOT have to be unique (and won't be in some cases)
Backbone.localStore = function ( parent, namespace ) {

	// Create local store as the specified namespace under the parent object
	this.cache = parent[namespace] = {};

}

// Extend the WindowsStore function with CRUD functions
_.extend( Backbone.localStore.prototype, {

	// Push Backbone model to the store array
	// Objects are keyed using a hash of artist + track title
	create : function ( model ) {
		this.cache[ _.hash( model.attributes.artist + model.attributes.title ) ] = model;
	},

	// Retrieve model - this assumes a model with artist and title set
	read : function ( model ) {
		return this.cache[ _.hash( model.attributes.artist + model.attributes.title ) ];
	},

	update : function ( model ) {
		this.cache[ _.hash( model.attributes.artist + model.attributes.title ) ] = model;
	},

	delete : function ( model ) {
		this.cache = _.omit( this.cache, _.hash( model.attributes.artist + model.attributes.title ) );
	},

	// Erase the local cache
	clear : function () {
		this.cache = {};
	}

});

// Function for delegating Backbone methods
Backbone.syncLocal = function ( method, model, options, error ) {				

	var store = model.localStore || model.collection.localStore;			

	switch ( method ) {
		case 'create' : store.create( model ); break;
		case 'read' : store.create( model ); break;
		case 'update' : store.update( model ); break;
		case 'delete' : store.delete( model ); break;
	}		

}

// Define function for checking sync type so multiple types can be used ////////////
// Use this type only if a windowStore or localStore element is defined
// Prefers local store over window store
Backbone.syncType = function ( model, options ) {

	// Switch based on options if available
	if ( options && options.cacheType == 'local' )
		return Backbone.syncLocal;
	else if ( options && options.cacheType == 'window' )
		return Backbone.syncWindow;

	// Otherwise switch by available model properties
	if ( model.localStore || model.collection.localStore )
		return Backbone.syncLocal;
	else if ( model.windowStore || model.collection.windowStore )
		return Backbone.syncWindow;
	else
		return Backbone.defaultSync;

}

// Redfine default sync method to check synctype and return appropriate sync function
// with args
Backbone.sync = function ( method, model, options, error ) {

	return Backbone.syncType( model, options ).apply( this, [method, model, options, error] );

}

