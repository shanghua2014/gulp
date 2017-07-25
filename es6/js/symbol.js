"use strict";
let s = Symbol();
console.log(typeof s);

var arr = ['a', 'b', 'c', 'd'];

// for (let a of arr) {
// console.log(a); // a b c d
// }

var a = ({x,y}) => x+y;
a(1,2);
var es6 = new Map();
es6.set('edition', 6);
es6.set('committee', 'TC39');
for (var [name, val] of es6) {
    console.log(name+':'+val);
}

class Person {
    constructor (x,y) {
        this.x = x;
        this.y = y;
    }

    toString () {
        return '('+this.x+', '+this.y+')';
    }
}

var p = new Person('zhang' , 'wang');
p.toString();