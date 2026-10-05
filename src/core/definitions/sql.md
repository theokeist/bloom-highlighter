# sql Cognitive Mapping

## alert
status: enabled
regex: `(?<![\w$])(?:[rR][aA][iI][sS][eE]|[sS][iI][gG][nN][aA][lL]|[rR][oO][lL][lL][bB][aA][cC][kK])(?![\w$])`
examples: ["==","!=","&&"]
style: {"color": "#ff0055", "fontWeight": "900", "backgroundColor": "rgba(255, 0, 85, 0.15)", "textDecoration": "underline solid #ff0055 2px"}

## logic
status: enabled
regex: `===|!==|==|!=|&&|\|\||\?\?|<=|>=|[<>?:]|!(?!=)|(?<![\w$])(?:[aA][nN][dD]|[oO][rR]|[nN][oO][tT]|[aA][nN][dD]|[oO][rR]|[nN][oO][tT])(?![\w$])`
examples: ["==","!=","&&"]
style: {"color": "#00f2ff", "fontWeight": "bold", "backgroundColor": "rgba(0, 242, 255, 0.1)", "border": "1px solid rgba(0, 242, 255, 0.2)", "borderRadius": "2px"}

## mutation
status: enabled
regex: `\+\+|--|\*\*=|\?\?=|>>=|<<=|[+*/%&|^\-]=|(?<![=!<>])=(?![=>])|(?<![\w$])(?:[uU][pP][dD][aA][tT][eE]|[iI][nN][sS][eE][rR][tT]|[dD][eE][lL][eE][tT][eE]|[sS][eE][tT])(?![\w$])`
examples: ["UPDATE","INSERT","DELETE","SET"]
style: {"color": "#ff8c00", "backgroundColor": "rgba(255, 140, 0, 0.08)", "fontWeight": "600"}

## guards
status: enabled
regex: `(?<![\w$])(?:[sS][eE][lL][eE][cC][tT]|[wW][hH][eE][rR][eE]|[jJ][oO][iI][nN]|[oO][nN]|[hH][aA][vV][iI][nN][gG]|[gG][rR][oO][uU][pP]|[oO][rR][dD][eE][rR]|[lL][iI][mM][iI][tT]|[oO][fF][fF][sS][eE][tT]|[cC][aA][sS][eE]|[wW][hH][eE][nN]|[tT][hH][eE][nN]|[eE][lL][sS][eE]|[eE][nN][dD]|[bB][eE][gG][iI][nN]|[cC][oO][mM][mM][iI][tT]|[rR][oO][lL][lL][bB][aA][cC][kK])(?![\w$])`
examples: ["SELECT","WHERE","JOIN","ON","HAVING","GROUP","ORDER","LIMIT","OFFSET","CASE","WHEN","THEN"]
style: {"color": "#34d399", "fontWeight": "bold", "backgroundColor": "rgba(52, 211, 153, 0.12)"}

## interface
status: enabled
regex: `(?<![\w$])(?:[fF][uU][nN][cC][tT][iI][oO][nN]|[pP][rR][oO][cC][eE][dD][uU][rR][eE]|[rR][eE][tT][uU][rR][nN][sS])(?![\w$])`
examples: ["FUNCTION","PROCEDURE","RETURNS"]
style: {"color": "#fbbf24", "fontWeight": "bold", "backgroundColor": "rgba(251, 191, 36, 0.15)", "textDecoration": "underline solid rgba(251, 191, 36, 0.4) 2px"}

## native
status: enabled
regex: `(?<![\w$])(?:[iI][nN][tT]|[iI][nN][tT][eE][gG][eE][rR]|[bB][iI][gG][iI][nN][tT]|[dD][eE][cC][iI][mM][aA][lL]|[fF][lL][oO][aA][tT]|[dD][oO][uU][bB][lL][eE]|[bB][oO][oO][lL][eE][aA][nN]|[vV][aA][rR][cC][hH][aA][rR]|[tT][eE][xX][tT]|[dD][aA][tT][eE]|[tT][iI][mM][eE][sS][tT][aA][mM][pP]|[nN][uU][lL][lL])(?![\w$])`
examples: ["INT","INTEGER","BIGINT","DECIMAL","FLOAT","DOUBLE","BOOLEAN","VARCHAR","TEXT","DATE","TIMESTAMP","NULL"]
style: {"color": "#38bdf8", "fontWeight": "600", "opacity": 1.0}

## prototype
status: enabled
regex: `(?!)`
examples: ["==","!=","&&"]
style: {"color": "#818cf8", "fontStyle": "italic", "fontWeight": "800"}

## structural
status: enabled
regex: `(?<![\w$])(?:[cC][rR][eE][aA][tT][eE]|[tT][aA][bB][lL][eE]|[vV][iI][eE][wW]|[iI][nN][dD][eE][xX]|[sS][cC][hH][eE][mM][aA]|[aA][lL][tT][eE][rR])(?![\w$])`
examples: ["CREATE","TABLE","VIEW","INDEX","SCHEMA","ALTER"]
style: {"color": "#f472b6", "fontWeight": "bold", "backgroundColor": "rgba(244, 114, 182, 0.15)", "border": "1px solid #f472b6"}

## anchor
status: enabled
regex: `(?<![\w$])(?:[tT][rR][uU][eE]|[fF][aA][lL][sS][eE]|[nN][uU][lL][lL])(?![\w$])`
examples: ["TRUE","FALSE","NULL"]
style: {"color": "#ffffff", "backgroundColor": "#3f3f46", "border": "1px solid #52525b", "borderRadius": "3px", "fontWeight": "900"}

## internal
status: enabled
regex: `(\b_[a-zA-Z0-9_]+)`
style: {"color": "#a855f7", "fontStyle": "italic", "opacity": 0.6}





## danger
status: enabled
regex: `(?<!\w)(?:[Dd][Rr][Oo][Pp]|[Tt][Rr][Uu][Nn][Cc][Aa][Tt][Ee]|[Dd][Ee][Ll][Ee][Tt][Ee]|[Uu][Pp][Dd][Aa][Tt][Ee]|[Ee][Xx][Ee][Cc](?:[Uu][Tt][Ee])?)(?!\w)`
examples: ["DROP","TRUNCATE","DELETE","UPDATE"]
style: {"color":"#ff4d4d","fontWeight":"bold","textDecoration":"underline"}


## functions
status: enabled
regex: `(?<![\w$])(?!(?:if|for|while|switch|catch|with|assert|return|throw|sizeof|typeof)\b)[A-Za-z_$][\w$]*(?=\s*\()`
examples: ["render()", "calculate(value)"]
style: {"color":"#fbbf24","fontWeight":"600"}
