// All of the predefined sorting algorithms
var SortingAlgorithms = {

	functions : {},
	outputSelectId : "",

	// Convience function to get a pre defined sorting algorithm
	Get : function( name )
	{
		if( typeof SortingAlgorithms.functions[name] === "function" )
		{
			return SortingAlgorithms.functions[name];
		}

		return SortingAlgorithms.functions[0];
	},

	Set : function( name, fun )
	{
		if( typeof name === "string" && typeof fun === "function" )
		{
			SortingAlgorithms.functions[name] = fun;

			SortingAlgorithms.Render();
		}
	},

	// Returns all of the sorting functions loaded into the sorting algorithms object
	GetFunctions : function()
	{
		var output = [];
		for( var f in SortingAlgorithms.functions )
		{
			output.push( f );
		}

		return output;
	},

	// Renders the model into the provided div
	Render : function()
	{
		$(document).ready( function(){
			var output = $(SortingAlgorithms.outputSelectId);
			if( output.size() > 0 )
			{
				$(output).empty();

				// Add all of the default sorting algorithms
				var algorithms = SortingAlgorithms.GetFunctions();
				for( var i = 0; i < algorithms.length; i++ )
				{
					$(output)
						.append( 
							$("<option>", { 
								value:algorithms[i], 
								text:algorithms[i] 
							}) 
						);
				}
			}
		});
	},

	// Init the functions dropdown and add default sorting functions
	Init : function( selectId )
	{
		var obj = SortingAlgorithms
		obj.outputSelectId = "#"+selectId;

		obj.Set( "New", function Info(){
			//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||
			// Use these methods to access the elements of the array ||
			// this.size();                                          ||
			//  Will return the size of the array to be sorted       ||
			//                                                       ||
			// this.swap( i, j );                                    ||
			//  Will swap the elements at index from i to index j    ||
			//                                                       ||
			// this.get( i );                                        ||
			//  Will return the value at index i                     ||
			//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||
		});


		////////////////////////
		// Finished Functions //
		////////////////////////

		obj.Set( "Bubble Sort", function BubbleSort(){
			this.setFps( 60 );

			var swapped = true;
			while( swapped )
			{
				swapped = false;
				for( var i = 0; i < this.size()-1; i++ )
				{
					if( this.get(i) > this.get( i+1 ) )
					{
						this.swap( i, i+1 );
						swapped = true;
					}
				}
			}
		});

		obj.Set( "Selection Sort", function SelectionSort(){
			this.setFps( 60 );

			for( var i = 0; i < this.size(); i++ )
			{
				var min = i;
				for( var j = i+1; j < this.size(); j++ )
				{
					if( this.get( min ) > this.get( j, true ) )
					{
						min = j;
					}
				}
				this.swap( i, min );
			}
		});

		obj.Set( "Insertion Sort", function InsertionSort(){
			this.setFps( 60 );

			for( var i = 1; i < this.size(); i++ )
			{
				var j = i;
				while( j > 0 && this.get(j-1) > this.get(j) )
				{
					this.swap( j, j-1 );
					j--;
				}
			}
		});

		///////////////////////////
		// Pseudo-code Functions //
		///////////////////////////

		obj.Set( "Bubble Sort Pseudo", function BubbleSortPseudo(){
			// Bubble Sort Pseudo Code
			// Arthur Wuterich
			// 4/29/2014
			//
			//	swapped = true
			//	while swapped is true
			//		swapped = false 
			//		for i = 0 to A.size-1
			//			if A[i] > A[i+1]
			//				swap A[i] and A[i+1]
			//				swapped = true
		});

		obj.Set( "Selection Sort Pseudo", function SelectionSortPseudo(){
			// Selection Sort Pseudo Code
			// Arthur Wuterich
			// 4/29/2014
			//
			//	for i = 0 to A.size
			//		min = i;
			//		for j = i+1 to A.size
			//			if A[min] > A[j]
			//				min = j
			//	swap A[i] and A[min]
		});

		obj.Set( "Insertion Sort Pseudo", function InsertionSortPseudo(){
			// Insertion Sort Pseudo Code
			// 4/29/2014
			// http://en.wikipedia.org/wiki/Insertion_sort
			//
			//	for i = 1 to A.size
			//		j = i
			//			while j > 0 and A[j-1] > A[j]
			//				swap A[j] and A[j-1]
			//				j = j - 1
		});


	},
};
