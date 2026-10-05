# generic Cognitive Mapping

## alert
status: enabled
regex: `!=|\b(throw|throws|raise|panic|assert|error|Error|Exception)\b`
style: {"color": "#ff0055", "fontWeight": "900", "backgroundColor": "rgba(255, 0, 85, 0.15)", "textDecoration": "underline solid #ff0055 2px"}

## logic
status: enabled
regex: `===|!==|==|!=|&&|\|\||\?\?|<=|>=|[<>?:]|!(?!=)|\b(and|or|not|AND|OR|NOT|is|as)\b`
style: {"color": "#00f2ff", "fontWeight": "bold", "backgroundColor": "rgba(0, 242, 255, 0.1)", "border": "1px solid rgba(0, 242, 255, 0.2)", "borderRadius": "2px"}

## mutation
status: enabled
regex: `\+\+|--|\*\*=|\?\?=|>>=|<<=|[+*/%&|^\-]=|(?<![=!<>])=(?![=>])|\b(let|var|mut|set|SET|UPDATE|INSERT|DELETE)\b`
style: {"color": "#ff8c00", "backgroundColor": "rgba(255, 140, 0, 0.08)", "fontWeight": "600"}

## guards
status: enabled
regex: `\b(if|else|elif|unless|return|await|async|try|catch|except|finally|yield|break|continue|for|foreach|while|do|switch|case|match|when|then|end|IF|ELSE|RETURN|CASE|WHEN|END|SELECT|WHERE|JOIN)\b`
style: {"color": "#34d399", "fontWeight": "bold", "backgroundColor": "rgba(52, 211, 153, 0.12)"}

## interface
status: enabled
regex: `\b(interface|trait|protocol|type|typedef|abstract|implements|func|function|fn|def|fun|sub|record|SELECT|FROM)\b`
style: {"color": "#fbbf24", "fontWeight": "bold", "backgroundColor": "rgba(251, 191, 36, 0.15)", "textDecoration": "underline solid rgba(251, 191, 36, 0.4) 2px"}

## native
status: enabled
regex: `\b(Object|String|string|int|float|double|bool|boolean|List|Map|Set|Array|Vector|Option|Result|Future|Task|void|unit|char|str)\b`
style: {"color": "#38bdf8", "fontWeight": "600", "opacity": 1.0}

## prototype
status: enabled
regex: `\b(this|self|super|base|new|extends|with)\b`
style: {"color": "#818cf8", "fontStyle": "italic", "fontWeight": "800"}

## structural
status: enabled
regex: `\b(class|struct|union|namespace|enum|module|package|import|export|include|use|using|require|trait|impl|object|data|CREATE|TABLE)\b`
style: {"color": "#f472b6", "fontWeight": "bold", "backgroundColor": "rgba(244, 114, 182, 0.15)", "border": "1px solid #f472b6"}

## anchor
status: enabled
regex: `\b(const|final|static|readonly|val|immutable)\b`
style: {"color": "#ffffff", "backgroundColor": "#3f3f46", "border": "1px solid #52525b", "borderRadius": "3px", "fontWeight": "900"}

## internal
status: enabled
regex: `(\b_[a-zA-Z0-9_]+)`
style: {"color": "#a855f7", "fontStyle": "italic", "opacity": 0.6}



## functions
status: enabled
regex: `(?<![\w$])(?!(?:if|for|while|switch|catch|with|assert|return|throw|sizeof|typeof)\b)[A-Za-z_$][\w$]*(?=\s*\()`
examples: ["render()", "calculate(value)"]
style: {"color":"#fbbf24","fontWeight":"600"}
