/*
	To parse your expression, delete spaces and put extra brackets like in example: 
		(a&b)|~c  => "(((a)&(b))|(~(c)))"
		
*/
//=================================================================//
const operation = (operation) => {
	let doOperation = (...args) => (values) => operation(...args.map(arg => arg(values)));
	doOperation.arity = operation.length;
	return doOperation;
};

const op_and = operation((a, b) => (a && b));
const op_or = operation((a, b) => (a || b));
const op_not = operation(a => (!a));

const toOperation = {
    "&" : op_and,
    "|" : op_or,
    "~" : op_not
};
//=================================================================//
const variable = (name) => (values) => (values[toVariable.indexOf(name)]);

let toVariable = [
	//"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"
];
//=================================================================//
const cnst = (value) => () => (value);

const zero = cnst(false);
const one = cnst(true);

const toConst = {
    "0" : zero,
    "1" : one
};
//=================================================================//
const makePart = (values) => {
	result = "(";
	for (let i = 0; i < values.length; i++) {
		// :NOTE: - Использование == вместо ===
		if (values[i] == 0) {
			result += toVariable[i];
			result += "|";
		} else {
			result += "~" + toVariable[i];
			result += "|";
		}
	}
	
	return result.slice(0, -1) + ")";
}

const build = (expression) => {
	let col = Math.pow(2, toVariable.length);
	let result = "";
	let cur = [];
	for (let i = 0; i < toVariable.length; i++) {
		cur.push(false);
	}
	for (let i = 0; i < col; i++) {
		if (!expression(cur)) {
			let part = makePart(cur);
			result += part + "&";
		}
		let j = toVariable.length-1;
		if (!cur[j]) {
			cur[j] = true;
		} else {
			while (cur[j]) {
				cur[j--] = false;
			}
			cur[j--] = true;
		}
	}
	
	return result.slice(0, -1);
};
//=================================================================//
const makeBrackets = (expression) => {
	//====== for not
	for (let i = 0; i < expression.length; i++) {
		let ch = expression[i];
		if (ch == "~") {
			
		}
	}
}

const cnf = (expression) => {
	let expr = parse(expression);
	//console.log(build(expr));
	return build(expr);
}

const parse = (expression) => {
	//console.log(expression);
	if (expression.length == 3) {
		let ch = expression[1];
		if ("a" <= ch && ch <= "z") {
			if (!toVariable.includes(ch)) {
				toVariable.push(ch);
			}
			//console.log("var" + ch);
			return variable(ch)
		} else {
			return toConst[ch];
		}
	} else {
		let i = 1;
		let notOp = false;
		if (expression[i] == "~") {
			i++;
			notOp = true;
		}
		
		let leftPartStr = "(";
		i++;
		let op = "";
		let k = 1;
		while (k > 0) { // expression[i] != ")"
			if (expression[i] == "(") {
				k++;
			} else if ((expression[i] == ")")) {
				k--;
			}
			leftPartStr += expression[i++];
		}
		//leftPartStr += ")";
		let leftPart = parse(leftPartStr);
		
		if (notOp) {
			return toOperation["~"](leftPart);
		}
		if (i < expression.length) {
			op = expression[i];
			let rightPartStr = "(";
			let w = 1;
			i += 2;
			while (w > 0) {
				if (expression[i] == "(") {
					w++;
				} else if ((expression[i] == ")")) {
					w--;
				}
				rightPartStr += expression[i++];
			}
			let rightPart = parse(rightPartStr);
			return toOperation[op](leftPart, rightPart);
		} 
	}
}
//=================================================================//
/*let expr = op_or(
		op_and(
			variable("a"),
			variable("b")
		),
		op_not(
			variable("c")
		)
);

let expr2 = parse("((~(a))|(b))");
let expr3 = parse("(~(a))");
let expr4 = parse("(((a)&(b))|(~(c)))");

console.log(expr3([true, false]));
console.log(build(expr3));
console.log(build(expr));*/

//console.log(cnf("(((a)&(b))|(~(c)))"));
/*
let expr = parse("(~(a))");
console.log(expr([true]));
*/


console.log(cnf("(((0)&(b))|(~(c)))"));




