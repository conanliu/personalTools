/*
  this is a tool convert spring yaml(.yml) file to properties(.properties) file
*/

var blankCharRegex = /^(\s+)\S/;
var fs = require('fs');

var f = fs.readFileSync('application.yml', 'utf-8')
var lines = f.split('\n');


var prefix = [];
var nl = [];
var prefixBlank;
var hasChild = false;


// test prefix blank
for (var i = 0; i < lines.length; i++) {
    var matches = blankCharRegex.exec(lines[i]);
    if (matches) {
        var prefixBlank = matches[1];
        break;
    }
}


for (var i = 0; i < lines.length; i++) {
	var l = lines[i];

    // pass blank line and comment
    if (l.trim().length === 0) {
        continue;
    } else if (l.trim().startsWith('#')) {
        nl.push(l.trim());
        continue;
    }

    var matches = blankCharRegex.exec(l);
    if (matches) {
        dept = Math.ceil(matches[1].length / prefixBlank.length) + 1;
    } else {
        if (!hasChild && prefix.length > 0) nl.push(prefix.join('.') + ":");
        prefix = [];
        dept = 1;
    }

    if (prefix.length >= dept) {
        if (!hasChild) nl.push(prefix.join('.') + ":");
        while (prefix.length != dept - 1) {
            prefix.pop();
        }
    } 

    var key = l.trim();
    if (key.endsWith(":")) {
        prefix.push(key.replace(":", ''));
        hasChild = false;
    } else {
        if (prefix.length > 0) key = '.' + key;
        nl.push(prefix.join('.') + key);
        hasChild = true;
    }
}

var properties = nl.join('\n');

