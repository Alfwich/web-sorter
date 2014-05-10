var MAIN_LOADED = true

// Controls the logging messages through this function
var Log = function( msg )
{
	if( typeof console !== 'undefined' )
	{
		console.log( msg );
	}
}

// Convience function to convert ints to PX mesurments
var ToPx = function( obj )
{
	return obj + "px";
}

