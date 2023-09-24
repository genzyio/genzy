const grammar = String.raw`
Start
  = _ imports:Import* _ classes:ClassDefinition* _ { return { imports: imports.join(""), classes } }

Import
  = _ (Comment / ESMImportDefinition / CommonJSImportDefinition) _ { return text() }

ESMImportDefinition
 = "import" [^;\"]+ ("\"" / "'") [^\"']* ("\"" / "'") [;]? _ { return text()  }
 
CommonJSImportDefinition
 = ("const" _ [^=]+ _ "=")? _ "require" "(" [^\)]+ ")" [;]? _ { return text() }

ClassDefinition
  = ("export")? _ "class" _ name:Identifier _ "extends"? _ Identifier? _ "{" _ sections:Section* "}" _ { return { name, sections }; }
  
Section
 = Comment / MethodDefinition / Property / N1mblyVariable

Comment
 = MultiLineComment / SingleLineComment

MultiLineComment
  = _ "/*" (!"*/" .)* "*/" { return { type: "comment", content: text() } }
 
SingleLineComment
 = _ "//" [^\n]* { return { type: "comment", content: text() } }

N1mblyVariable 
 = "$nimbly" _ "=" _ value:Value _ {
    return { type: "$n1mbly_var", value: value }
  }
  
Value
  = Object
  / Array
  / String
  / Number
  / Boolean

Object
  = "{" _ "}" { return {}; }
  / "{" head:(_ N1mblyProperty _ ",")* tail:(_ N1mblyProperty _) "}" {
  	return head.concat([tail])
      .map((element) => element[1])
      .reduce((result, [key, value]) => {
        result[key] = value
        return result;
      }, {});
  }
  
N1mblyProperty
  = key:Key _ ":" _ value:Value {
    return [ key, value ];
  }
  
Key
  = _ key:[a-zA-Z0-9$_]+ _ { return key.join("") }

Array
  = "[" _ "]" { return []; }
  / "[" head:(_ Value _ ",")* tail:(_ Value _) "]" {
    return head.concat([tail])
      .map((element) => element[1]);
  }
  
String
  = "\"" string:([^"\\] / Escape)* "\"" {
  	return string.join('');
  }

Escape
  = "\\" character:["\\/bfnrt] {
    switch (character) {
      case '"':
      case '\\':
      case '/':
        return character;
      case 'b': return '\b';
      case 'f': return '\f';
      case 'n': return '\n';
      case 'r': return '\r';
      case 't': return '\t';
    }
  }
  / "\\u" codePoint:([0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]) {
    return String.fromCodePoint(parseInt(codePoint.join(''), 16));
  }

Number
  = "-"? ("0" / ([1-9] [0-9]*)) ("." [0-9]+)? (("e" / "E") ("+" / "-")? [0-9]+)? {
    return parseFloat(text())
  }

Boolean
  = "true" { return true; }
  / "false" { return false; }

Property
  = _ "private"? _ name:Identifier _ type:PropertyType? _ definition:PropertyDefinition? { return { type: "property", content: text() } }
  
PropertyDefinition
  = _ "=" _ (NestedCurlyBracketsContent / [^;]*) _ ";"? { return text(); }
  
PropertyType
  = ":" _ (NestedCurlyBracketsContent / [^;=]*) _ ";"? { return text(); }

MethodDefinition
  = _ "private"? _ "async"? _ "override"?
  _ name:Identifier
  _ params:NestedParenthesesContent 
  _ body:NestedCurlyBracketsContent
  _ { return { type: "method", name, params, body }; }

Identifier
  = start:[a-zA-Z_] end:[a-zA-Z0-9_]* { return start + end?.join("") ?? "" }

MethodContent
  = (NestedCurlyBracketsContent / [^{}]+)* { return text(); }

NestedCurlyBracketsContent
  = "{" _ content:MethodContent _ "}" { return "{" + content + "}"; }
  
ParamsContent
  = (NestedParenthesesContent / [^()]+)* { return text(); }

NestedParenthesesContent
  = "(" _ content:ParamsContent _ ")" _ result:ResultType? { return "(" + content + ")" + (result ?? ""); }

ResultType
 = ":" _ (NestedCurlyBracketsContent / [^{]*) { return text(); }

_ "whitespace"
  = [ \t\r\n]*
`;
