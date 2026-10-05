# kotlin Cognitive Mapping

## alert
status: enabled
regex: `(?<![\w$])(?:throw|raise|panic|assert|error|Error|Exception)(?![\w$])`
examples: ["==","!=","&&"]
style: {"color": "#ff0055", "fontWeight": "900", "backgroundColor": "rgba(255, 0, 85, 0.15)", "textDecoration": "underline solid #ff0055 2px"}

## logic
status: enabled
regex: `===|!==|==|!=|&&|\|\||\?\?|<=|>=|[<>?:]|!(?!=)`
examples: ["==","!=","&&"]
style: {"color": "#00f2ff", "fontWeight": "bold", "backgroundColor": "rgba(0, 242, 255, 0.1)", "border": "1px solid rgba(0, 242, 255, 0.2)", "borderRadius": "2px"}

## mutation
status: enabled
regex: `\+\+|--|\*\*=|\?\?=|>>=|<<=|[+*/%&|^\-]=|(?<![=!<>])=(?![=>])|(?<![\w$])(?:var|lateinit)(?![\w$])`
examples: ["var","lateinit"]
style: {"color": "#ff8c00", "backgroundColor": "rgba(255, 140, 0, 0.08)", "fontWeight": "600"}

## guards
status: enabled
regex: `(?<![\w$])(?:if|else|when|for|while|do|return|break|continue|try|catch|finally|throw|suspend)(?![\w$])`
examples: ["if","else","when","for","while","do","return","break","continue","try","catch","finally"]
style: {"color": "#34d399", "fontWeight": "bold", "backgroundColor": "rgba(52, 211, 153, 0.12)"}

## interface
status: enabled
regex: `(?<![\w$])(?:fun|interface|typealias|abstract|override|open)(?![\w$])`
examples: ["fun","interface","typealias","abstract","override","open"]
style: {"color": "#fbbf24", "fontWeight": "bold", "backgroundColor": "rgba(251, 191, 36, 0.15)", "textDecoration": "underline solid rgba(251, 191, 36, 0.4) 2px"}

## native
status: enabled
regex: `(?<![\w$])(?:Int|Long|Short|Byte|Float|Double|Boolean|Char|String|List|Map|Set|Unit|Nothing|Any)(?![\w$])`
examples: ["Int","Long","Short","Byte","Float","Double","Boolean","Char","String","List","Map","Set"]
style: {"color": "#38bdf8", "fontWeight": "600", "opacity": 1.0}

## prototype
status: enabled
regex: `(?<![\w$])(?:this|super|constructor|init)(?![\w$])`
examples: ["this","super","constructor","init"]
style: {"color": "#818cf8", "fontStyle": "italic", "fontWeight": "800"}

## structural
status: enabled
regex: `(?<![\w$])(?:class|object|package|import|enum)(?![\w$])`
examples: ["class","object","package","import","enum"]
style: {"color": "#f472b6", "fontWeight": "bold", "backgroundColor": "rgba(244, 114, 182, 0.15)", "border": "1px solid #f472b6"}

## anchor
status: enabled
regex: `(?<![\w$])(?:val|const|true|false|null)(?![\w$])`
examples: ["val","const","true","false","null"]
style: {"color": "#ffffff", "backgroundColor": "#3f3f46", "border": "1px solid #52525b", "borderRadius": "3px", "fontWeight": "900"}

## internal
status: enabled
regex: `(\b_[a-zA-Z0-9_]+)`
style: {"color": "#a855f7", "fontStyle": "italic", "opacity": 0.6}





## danger
status: enabled
regex: `\b(?:exec|delete|deleteRecursively|exitProcess)\b(?=\s*\()|\bProcessBuilder\b`
examples: ["exec(command)","deleteRecursively()","ProcessBuilder(command)"]
style: {"color":"#ff4d4d","fontWeight":"bold","textDecoration":"underline"}


## functions
status: enabled
regex: `(?<![\w$])(?!(?:if|for|while|switch|catch|with|assert|return|throw|sizeof|typeof)\b)[A-Za-z_$][\w$]*(?=\s*\()`
examples: ["render()", "calculate(value)"]
style: {"color":"#fbbf24","fontWeight":"600"}
