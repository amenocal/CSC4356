
function Person(name, kind) {
	this.name = name;
	this.kind = kind;
};


Person.prototype.identify = function() {
	return this.name + " the " + this.kind;
};

var j = new Person("Jake", "Dog");
var f = new Person("Finn", "Human");


word = {

	"0" : "alfa",
	"1" : "bravo",
	"2" : "charlie",
	"3" : "delta"
};




word = [
		"alfa",
		"bravo",
		"charlie",
		"delta",
];


for (i in word) {
	document.writeln(i + "=" + word);
}



