// SortBox.js: Defined the abstract class which will sort and render the results of sorting to a provided output div.

var SORT_BOX_LOADED = true;

// Constructor for a SortBox object
var SortBox = {

	sortBoxes : [],

	Get : function( id )
	{
		if( typeof id === "undefined" || id >= SortBox.sortBoxes.length )
		{
			return null;
		}

		return SortBox.sortBoxes[id];
	},

	PlayAll : function()
	{
		for( var i = 0; i < SortBox.sortBoxes.length; i++ )
		{
			if( SortBox.sortBoxes[i].outputDiv != null )
			{
				SortBox.sortBoxes[i].start();
			}
		}
	},

	ResetAll : function()
	{
		for( var i = 0; i < SortBox.sortBoxes.length; i++ )
		{
			if( SortBox.sortBoxes[i].outputDiv != null )
			{
				SortBox.sortBoxes[i].stop();
				SortBox.sortBoxes[i].setSize();
				SortBox.sortBoxes[i].render( 0 );
			}
		}
	},

	StopAll : function()
	{
		for( var i = 0; i < SortBox.sortBoxes.length; i++ )
		{
			if( SortBox.sortBoxes[i].outputDiv != null )
			{
				SortBox.sortBoxes[i].stop();
			}
		}
	},

	Make : function( name, div, size, algo ){

		// Only execute if this is called with the new keyword
		if( SortBox === this )
		{
			return;
		}

		// Methods

		// Mutators
		this.setSize = function( n )
		{ 
			if( typeof n === "undefined" )
			{
				n = (this.sortArray[0].length == 0)?20:this.sortArray[0].length;
			}

			this.framePos = 0;
			this.sortArray = [[]];
			for( var i = 0; i < n; i++ )
			{
				this.sortArray[this.framePos].push( this.makeSortElement( ( 100 / n * (i+1) ) ) );
			}

			for( var i = 0; i < n; i++ )
			{
				this.swap( i, Math.floor( Math.random() * n ), false );
			}
		};

		this.deltaSize = function( n )
		{
			if( typeof n !== "number" )
			{
				return;
			}

			var size = this.frameLength();
			if( size + n <= 0 )
			{
				n = 0;
			}

			this.setSize( size + n );

		}

		this.makeSortElement = function( n )
		{
			n = Math.floor( ( typeof n === "undefined" )?(Math.random() * 100 + 1):n );
			return { 'value' :n, 'color' : 0, access : 0 };
		}

		this.setOutput = function( div )
		{
			
			var divId = "SORT_BOX_" + $(".sortbox").size();
			$("<div>", { id:divId } ).insertAfter( $("#"+div).children("#main_controls") );

			this.outputDiv = $("#"+divId);
			$(this.outputDiv).addClass( "sortbox" ).hide();

			
		};

		this.setSortAlgorithm = function( algo, setHash )
		{
			if( typeof algo === "function" )
			{
				this.sortFunction = algo;
				this.codeHasChanged = false;
			}

			this.setName();
			
			if( setHash == true )
			{
				window.location.hash = encodeURIComponent( algo.toString() );
			}
		};

		this.setFps = function( fps )
		{
			if( typeof fps === "number" && fps > 0 && fps <= 1000 )
			{
				this.fps = fps;
			}
		};

		this.setName = function( name )
		{
			if( typeof name === "undefined" )
			{
				name = (typeof this.sortFunction == "function")?this.sortFunction.name:"Sort";
			}

			this.name = name;

			if( this.hasControls )
			{
				$(this.outputDiv).find(".sort_label").text( name );
			}
		};

		// Returns the value at the position
		this.get = function( pos, autoSnap )
		{
			if( this.sortArray[this.framePos][pos].access < 10 )
			{
				this.sortArray[this.framePos][pos].access++;
			}

			if( autoSnap )
			{
				this.nextFrame();
				this.sortArray[this.framePos][pos].color = 3;
			}

			return this.sortArray[this.framePos][pos].value;
		};

		// Returns the value at the position
		this.set = function( pos, val, col )
		{
			if( typeof col === 'undefined' )
			{
				col = 0;
			}

			this.sortArray[this.framePos][pos].value = val;
			this.sortArray[this.framePos][pos].color = col;
		};

		this.nextFrame = function()
		{
			var frame = [];
			for( var i = 0; i < this.frameLength(); i++ )
			{
				var obj = {};
				for( var k in this.sortArray[this.framePos][i] )
				{
					obj[k] = this.sortArray[this.framePos][i][k];
				}

				obj['color'] = 0;

				if( obj['access'] > 0 )
				{
					obj['access']-=.2;

					if( obj['access'] < 0 )
					{
						obj['access'] = 0;
					}
				}

				frame.push( obj );
			}

			this.sortArray.push( frame );
			this.framePos++;
		};

		this.frameLength = function()
		{
			return this.sortArray[0].length;
		}

		this.size = function()
		{
			return this.frameLength();
		}

		// Will swap two values in the array and re-render
		this.swap = function( from, to, autoSnap )
		{
			// Make sure that the swap is valid
			if( from < 0 || to < 0 || from == to || from >= this.sortArray[this.framePos].length || to > this.sortArray[this.framePos].length )
			{
				return;
			}


			// Move the frame to the next position
			if( autoSnap != false )
			{
				this.nextFrame();
				this.sortArray[this.framePos][to].color = 1;
				this.sortArray[this.framePos][from].color = 2;
			}


			var tmp = this.sortArray[this.framePos][from];	
			this.sortArray[this.framePos][from] = this.sortArray[this.framePos][to];
			this.sortArray[this.framePos][to] = tmp;
		}

		this.snapshot = function()
		{
			this.nextFrame();
		}

		this.settle = function()
		{
			this.snapshot();
			return;

			for( var i = 0; i < this.frameLength(); i++ )
			{
				if( this.sortArray[this.framePos][i].access != 0 )
				{
					this.snapshot();
					i = -1;
				}
			}
		}

		this.playButton = function()
		{
			var obj = this;
			return $("<button>", {
				"class":"sortbox_button",
				"text":"Play",
				"animation_id" : this.controllerID,
			}).click( function(){ obj.start(); });
		}

		this.stopButton = function()
		{
			var obj = this;
			return $("<button>", {
				"class":"sortbox_button",
				"text":"Stop",
				"animation_id" : this.controllerID,
			}).click( function(){ obj.stop() });
		}

		this.resetButton = function()
		{
			var obj = this;
			return $("<button>", {
				"class":"sortbox_button",
				"text":"Reset",
				"animation_id" : this.controllerID,
			}).click( function(){ obj.stop(); obj.setSize(); obj.render(0); });
		}

		this.openCodeWindow = function()
		{

			// If there is an open code window toggle the window
			if( $(this.outputDiv).find( ".code_input" ).size() > 0 )
			{
				this.closeCodeWindow();
				return;
			}

			var obj = this;
			
			// Code Window
			var codeWindow = $("<textarea>", {
				spellcheck : "false",
				class : "code_input",
			})
			.val( this.sortFunction.toString().replace( /\t/g, " " ) )
			.keydown( function(e){ 
				obj.codeHasChanged = true; 

				// Tab replace
				if( e.keyCode == 9 )
				{
					var start = this.selectionStart;
					var end = this.selectionEnd;

					var val = $(this).val();

					if( e.shiftKey )
					{
						var lineStart = start;
						while( lineStart > 0 && val.charAt( lineStart ) != "\n" ){ lineStart--; }

						if( lineStart > 0 && val.charAt(lineStart+1) == " " )
						{
							$(this).val( val.substring( 0, lineStart+1 ) + val.substring( lineStart+2 ) );
							this.selectionStart = this.selectionEnd = start-1;
						}
					}
					else
					{
						$(this).val( val.substring( 0, start ) + " " + val.substring( end ) );
						this.selectionStart = this.selectionEnd = start+1;
					}

					e.preventDefault();
				}
			});

			// Controls for code window
			var closeCodeButton = $("<button>", { 
				class:"code_button close", 
				text:"Close" 
			})
			.click( function(){ obj.closeCodeWindow(); } );

			$( this.outputDiv ).append( closeCodeButton, codeWindow );
		};

		this.updateFunction = function()
		{
			var functionText = $(this.outputDiv).find(".code_input").val();

			if( typeof functionText !== "undefined" )
			{
				try
				{
					eval( "var newFn = " + functionText );
					SortingAlgorithms.Set( "user", newFn );
					this.setSortAlgorithm( newFn, true );
				} 
				catch(err) 
				{
					alert( err );
				}
			}
		};

		this.closeCodeWindow = function()
		{
			// Save before closing
			this.updateFunction();

			(this.outputDiv).find( ".code_input, .code_button" ).remove();
		};

		this.codeButton = function()
		{
			var obj = this;

			return $("<button>", {
				"class":"sortbox_button",
				"text":"Code",
			}).click( function(){ obj.openCodeWindow(); });
		};

		this.incButton = function()
		{
			var obj = this;
			return $("<button>", {
				"class":"sortbox_button",
				"text":"+",
			})
			.mousedown( function(){ obj.sizeChange( 1 ); } )
			.mouseup(   function(){ obj.endSizeChange(); } );
		};

		this.decButton = function()
		{
			var obj = this;
			return $("<button>", {
				"class":"sortbox_button",
				"text":"-",
			})
			.mousedown( function(){ obj.sizeChange( -1 ); } )
			.mouseup(   function(){ obj.endSizeChange(); } );
		};

		this.deleteButton = function()
		{
			var obj = this;
			return $("<button>", {
				"class":"sortbox_button",
				"text":"Delete",
			})
			.click( function(){ obj.remove(); } )

		};

		// Removes the most data intensive part of the structure and removes the html associated
		this.remove = function()
		{
			this.stop();
			this.setSize(0);
			$(this.outputDiv).remove();
			this.outputDiv = null;
		};

		this.sizeChange = function( dir, relapse )
		{
			if( !this.isPlaying() )
			{ 
				this.deltaSize( dir );
				this.render(0); 

				var obj = this;
				relapse = ( typeof relapse === "undefined")?1000:relapse;
				if( relapse < 50 ){ relapse = 50 };
				this.sizeChangeHandle = setTimeout( function(){ obj.sizeChange( dir, relapse/2.5 ) }, relapse );
			} 
		};

		this.endSizeChange = function()
		{
			clearTimeout( this.sizeChangeHandle );
			this.sizeChangeHandle = 0;
		};
		// Will render the current state of the array at a perticular frame position
		this.render = function( frame )
		{
			this.renderControls();

			var OutputDiv = $(this.outputDiv).children( ".sortbox_output" );

			$(OutputDiv).empty();

			for( var i = 0; i < this.frameLength(); i++ )
			{
				$(OutputDiv).append( 
					$("<div>", { "class":"sortbox_bar b" + this.sortArray[frame][i].color } )
					.css( { "height" : this.sortArray[frame][i].value } ) );
			}	
		};

		this.renderControls = function()
		{
			if( !this.hasControls )
			{

				this.hasControls = true;
				$(this.outputDiv).append( 
					$("<div>",{ class:"sortbox_controls" }).append( 
						$("<div>", { class:"sort_label", text:this.name } ), 
						this.playButton(), 
						this.resetButton(), 
						this.codeButton(), 
						this.incButton(),
						this.decButton(),
						this.deleteButton()
					),
					$("<div>", { class:"sortbox_output" } )
				);

				// Make sure that the sortbox is visible
				$(this.outputDiv).css({ }).show();
			}
		};

		this.play = function( obj )
		{
			if( obj.currentFrame != obj.sortArray.length-1 )
			{
				obj.render( ++obj.currentFrame );
				obj.playHandle = setTimeout( function(){ obj.play( obj ) }, 1000/obj.fps );
			}
			else
			{
				obj.playHandle = 0;
			}
		};

		this.isPlaying = function()
		{
			return this.playHandle != 0 && typeof this.playHandle != "undefined";
		}

		// Will init the provided sorting function
		this.start = function()
		{
			// Don't do anything unless we have a valid sorting function
			// or the animation is currently playing
			if( this.isPlaying() )
			{
				return;
			}

			// If the code has changed since the last play then update the function and attempt to play
			if( this.codeHasChanged )
			{
				this.updateFunction();
			}

			this.sortArray = [ this.sortArray[this.framePos] ];
			this.framePos = 0;
			this.currentFrame = 0;

			try
			{
				this.sortFunction();
				this.settle();
				this.play( this );
			}
			catch(err)
			{
				alert( "Sort function has errors:\n'"+err+"'" );
			}
		};

		this.stop = function()
		{
			if( this.playHandle == 0 )
			{
				return;
			}
				
			clearTimeout( this.playHandle );
			this.playHandle = 0;
		}


		// Init Properties
		this.setOutput( div );
		this.setSize( size );
		this.setFps( 30 );
		this.setSortAlgorithm( algo );

		// Attributes
		this.currentFrame = 0;
		this.playHandle = 0;
		this.controllerID = SortBox.sortBoxes.length;
		this.hasControls = false;
		this.sizeChangeHandle = 0;
		this.codeHasChanged = false;
		
		// Push the new object into the SortBoxes array
		SortBox.sortBoxes.push( this );

		this.render( 0 );
	},
};

















// EOF
