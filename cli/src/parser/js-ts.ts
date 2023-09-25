import * as peg from "pegjs";

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
  = _ DecoratorDefinition* _ ("export")? _ "class" _ name:Identifier _ "extends"? _ Identifier? _ "{" _ sections:Section* "}" _ { return { name, sections }; }
  
Section
 = Comment / MethodDefinition / DecoratorDefinition / Property

Comment
 = MultiLineComment / SingleLineComment

MultiLineComment
  = _ "/*" (!"*/" .)* "*/" { return { type: "comment", content: text() } }
 
SingleLineComment
 = _ "//" [^\n]* { return { type: "comment", content: text() } }

DecoratorDefinition
  = _ "@" name:Identifier _ params:NestedParenthesesContent _ { return { type: "decorator", name, params }; }

Property
  = _ "private"? _ name:Identifier _ type:PropertyType? _ definition:PropertyDefinition? _ ";"? { return { type: "property", content: text() } }
  
PropertyDefinition
  = _ "=" _ (NestedCurlyBracketsContent / [^;]*) { return text(); }
  
PropertyType
  = ":" _ (NestedCurlyBracketsContent / [^;=]*) { return text(); }

MethodDefinition
  = _ "private"? _ "async"? _ "override"?
  _ name:Identifier
  _ params:NestedParenthesesContent 
  _ body:NestedCurlyBracketsContent
  _ { return { type: "method", name, params, body }; }

Identifier
  = start:[$a-zA-Z_] end:[a-zA-Z0-9_]* { return start + end?.join("") ?? "" }

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

export const JSTSParser = peg.generate(grammar);
