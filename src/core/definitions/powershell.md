# powershell Cognitive Mapping

## alert
status: enabled
regex: `(?<![\w$])(?:[tT][hH][rR][oO][wW]|[wW][rR][iI][tT][eE]-[eE][rR][rR][oO][rR])(?![\w$])`
examples: ["==","!=","&&"]
style: {"color": "#ff0055", "fontWeight": "900", "backgroundColor": "rgba(255, 0, 85, 0.15)", "textDecoration": "underline solid #ff0055 2px"}

## logic
status: enabled
regex: `===|!==|==|!=|&&|\|\||\?\?|<=|>=|[<>?:]|!(?!=)|-(?:eq|ne|lt|le|gt|ge|and|or|not)\b`
examples: ["==","!=","&&"]
style: {"color": "#00f2ff", "fontWeight": "bold", "backgroundColor": "rgba(0, 242, 255, 0.1)", "border": "1px solid rgba(0, 242, 255, 0.2)", "borderRadius": "2px"}

## mutation
status: enabled
regex: `\+\+|--|\*\*=|\?\?=|>>=|<<=|[+*/%&|^\-]=|(?<![=!<>])=(?![=>])|(?<![\w$])(?:[sS][eE][tT]-[vV][aA][rR][iI][aA][bB][lL][eE])(?![\w$])`
examples: ["Set-Variable"]
style: {"color": "#ff8c00", "backgroundColor": "rgba(255, 140, 0, 0.08)", "fontWeight": "600"}

## guards
status: enabled
regex: `(?<![\w$])(?:[iI][fF]|[eE][lL][sS][eE][iI][fF]|[eE][lL][sS][eE]|[sS][wW][iI][tT][cC][hH]|[fF][oO][rR][eE][aA][cC][hH]|[fF][oO][rR]|[wW][hH][iI][lL][eE]|[dD][oO]|[uU][nN][tT][iI][lL]|[rR][eE][tT][uU][rR][nN]|[bB][rR][eE][aA][kK]|[cC][oO][nN][tT][iI][nN][uU][eE]|[tT][rR][yY]|[cC][aA][tT][cC][hH]|[fF][iI][nN][aA][lL][lL][yY]|[tT][rR][aA][pP])(?![\w$])`
examples: ["if","elseif","else","switch","foreach","for","while","do","until","return","break","continue"]
style: {"color": "#34d399", "fontWeight": "bold", "backgroundColor": "rgba(52, 211, 153, 0.12)"}

## interface
status: enabled
regex: `(?<![\w$])(?:[fF][uU][nN][cC][tT][iI][oO][nN]|[fF][iI][lL][tT][eE][rR]|[pP][aA][rR][aA][mM])(?![\w$])`
examples: ["function","filter","param"]
style: {"color": "#fbbf24", "fontWeight": "bold", "backgroundColor": "rgba(251, 191, 36, 0.15)", "textDecoration": "underline solid rgba(251, 191, 36, 0.4) 2px"}

## native
status: enabled
regex: `(?<![\w$])(?:[sS][tT][rR][iI][nN][gG]|[iI][nN][tT]|[lL][oO][nN][gG]|[bB][oO][oO][lL]|[dD][oO][uU][bB][lL][eE]|[dD][eE][cC][iI][mM][aA][lL]|[dD][aA][tT][eE][tT][iI][mM][eE]|[hH][aA][sS][hH][tT][aA][bB][lL][eE]|[aA][rR][rR][aA][yY]|[oO][bB][jJ][eE][cC][tT])(?![\w$])`
examples: ["string","int","long","bool","double","decimal","datetime","hashtable","array","object"]
style: {"color": "#38bdf8", "fontWeight": "600", "opacity": 1.0}

## prototype
status: enabled
regex: `(?!)`
examples: ["==","!=","&&"]
style: {"color": "#818cf8", "fontStyle": "italic", "fontWeight": "800"}

## structural
status: enabled
regex: `(?<![\w$])(?:[fF][uU][nN][cC][tT][iI][oO][nN]|[cC][lL][aA][sS][sS]|[eE][nN][uU][mM]|[uU][sS][iI][nN][gG]|[pP][aA][rR][aA][mM])(?![\w$])`
examples: ["function","class","enum","using","param"]
style: {"color": "#f472b6", "fontWeight": "bold", "backgroundColor": "rgba(244, 114, 182, 0.15)", "border": "1px solid #f472b6"}

## anchor
status: enabled
regex: `(?<![\w$])(?:[tT][rR][uU][eE]|[fF][aA][lL][sS][eE]|[nN][uU][lL][lL])(?![\w$])`
examples: ["true","false","null"]
style: {"color": "#ffffff", "backgroundColor": "#3f3f46", "border": "1px solid #52525b", "borderRadius": "3px", "fontWeight": "900"}

## internal
status: enabled
regex: `(\b_[a-zA-Z0-9_]+)`
style: {"color": "#a855f7", "fontStyle": "italic", "opacity": 0.6}





## danger
status: enabled
regex: `\b(?:Remove-Item|Invoke-Expression|Start-Process|Stop-Process|Format-Volume|Clear-Disk)\b`
examples: ["Remove-Item","Invoke-Expression","Start-Process","Format-Volume"]
style: {"color":"#ff4d4d","fontWeight":"bold","textDecoration":"underline"}


## functions
status: enabled
regex: `(?<![\w$])(?!(?:if|for|while|switch|catch|with|assert|return|throw|sizeof|typeof)\b)[A-Za-z_$][\w$]*(?=\s*\()`
examples: ["render()", "calculate(value)"]
style: {"color":"#fbbf24","fontWeight":"600"}
