// Overrides to the default sync method to cache API search results to the local window
// Assumes that caches might be shared between APIs (i.e. several API results --> one cache)
// Requires: jQuery, Underscore (extend), Backbone

$(function () {

	// Save the existing sync method for posterity
	Backbone.defaultSync = Backbone.sync;

	// Storing function for creating a new window cache based on passed name - this
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
			console.log( 'test' );
		},

		read : function ( model ) {

		},

		update : function ( model ) {

		},

		delete : function ( model ) {

		}

	});

	// Function for delegating Backbone methods
	Backbone.syncWindow = function ( method, model, options, error ) {

		var store = model.windowStore;					

		switch ( method ) {
			case 'create' : store.create( model ); break;
			case 'read' : store.create( model ); break;
			case 'update' : store.update( model ); break;
			case 'delete' : store.delete( model ); break;
		}

	}

	// Define function for checking sync type so multiple types can be used
	// Use this type only if a windowStore element is defined
	Backbone.syncType = function ( model ) {
		return model.windowStore ? Backbone.syncWindow : Backbone.defaultSync;
	}

	// Redfine default sync method to check synctype and return appropriate sync function
	// with args
	Backbone.sync = function ( method, model, options, error ) {
		return Backbone.syncType( model ).apply( this, [method, model, options, error] );
	}
});
