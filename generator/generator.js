
// Resize input field as text is typed
var filterInput = document.getElementById("criteria")
filterInput.oninput = filterInput.resize = function() {
    this.size = ( this.value.length > 18) ? this.value.length+2 : 20;
};

// write an error to the output table
var writeError = function(error) {
	var p = document.createElement('p');
	p.innerHTML = error;
	p.style.color = "red";
	p.style.fontFamily = "monospace";
	writeTable(p)
}

// write a result  to the output table
var writeResult = function(word) {
	var p = document.createElement('p');
	p.innerHTML = word;
	p.style.fontFamily = "monospace";
	writeTable(p)
}

var lastCell = 0;

// Write to the next cell in the table (tracked with lastCell)
var writeTable = function(elem) {
	if(lastCell < 100) {
		table.rows[lastCell % 10].cells[Math.floor(lastCell / 10)].appendChild(elem);
		lastCell += 1;	
	}
	else {
		console.log("Table full: "+elem.innerHTML)
	}
	
}

// make a 10x10 table of empty td s
var makeTable = function() {
	lastCell = 0;
	var rows = 10;
	var cols = 10;
	var base = document.getElementById("output")
	var table = document.createElement("table")
	table.id = "table";

	for(var i = 0; i < rows; i++) {
		var tr = document.createElement("tr");
		for(var j = 0; j < cols; j++) {
			var td = document.createElement("td")
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	base.appendChild(table);
}

// generate a large set of markov words, writing them to the output table
var generateWords = function(markovOrder, wordLists, minSize, maxSize, count, criteria) {
	var chain = new Foswig(markovOrder);

	wordLists.forEach(function(w){ chain.addWordsToChain(eval(w))});

	var matchesCriteria = function(word) { return eval(criteria);	}

	try {
		matchesCriteria("some test")
	}
	catch(e) {
		writeError("Invalid criteria") // javascript error
		return;
	}

	var word = "";
	for(var i = 0; i < count; i++) {
		var attempts = 0;
	    do {
	    	try {
	    		word = chain.generateWord(minSize, maxSize, false);	
	    	}
	    	catch(e) {
	    		writeError("Failed to generate with given parameters") // usually occurs from bad sizes or order
	    		word = '';
	    		break;
	    	}
	    	attempts += 1;
	    	if(attempts > 250) { // Break if this is taking too long to find a matching word
	    		writeError("Failed to generate with given criteria")
	    		word = '';
	    		break;
	    	}

	    }while(!matchesCriteria(word))
	    if(word != '') {
	    	writeResult(word)	
	    }
	}
}
var wordlists = [
	{"id": "wl_dw_german", "name" :"dw_german"},
	{"id": "wl_dw_english", "name" :"dw_english"},
	{"id": "wl_dw_beale", "name" :"dw_beale"}
]

var generate = function() {
	document.getElementById('output').innerHTML = '';
	makeTable();
	var order = document.getElementById('order').value || 3;
	var min = document.getElementById('min').value || 4;
	var max = document.getElementById('max').value || 15;
	var count =  100; //document.getElementById('count').value
	var criteria = document.getElementById('criteria').value || "true";
	var words = wordlists.reduce(function(sum, value) {
		if(document.getElementById(value.id).checked) {
			return sum.concat(value.name)
		}
		return sum;
	}, []);
	if(words.length <= 0) { writeError("Select a wordlist"); }
	else {generateWords(order, words, min, max, count, criteria);}

}