// init.js: Will init the sorting application. This has a precondition that both main.js and SortBox.js have been loaded first

// Protection against false inclusion orders
if( typeof MAIN_LOADED !== 'undefined' && typeof SORT_BOX_LOADED !== 'undefined' )
{
	$(document).ready( function(){

		// Bind events
		$("#play_all").click( function(){
			SortBox.PlayAll();	
		});

		$("#reset_all").click( function(){
			SortBox.ResetAll();	
		});

		$("#new_sort").click( function(){
			var name = $("#sort_algo").val();
			new SortBox.Make( name, 'application', 25, SortingAlgorithms.Get( name ) );
		});

		SortingAlgorithms.Init( "sort_algo" );

		// If there is a sort function provided as a hash attempt to run it
		if( document.location.hash.length != 0 && window.location.hash.indexOf( "function" ) != -1 )
		{
			// Only execute the code if the user has accepted the consequences
			if( confirm( "The javascript provided with this link could potentially be malicious. Run at your own risk." ) )
			{
				try
				{
					var code = decodeURIComponent( window.location.hash.substr(1) );
					eval( "var newFn = " + code );
					SortingAlgorithms.Set( "remote", newFn );
					new SortBox.Make( newFn.name, 'application', 25, newFn );
				}
				catch(err)
				{
					alert( "Could not load URL function:\n" + err );
				}
			}
			else
			{
				window.location.hash = "";
			}
		}

	});
}
else
{
	console.log( "Required JS files were not defined before the init.js inclusion." );
}
