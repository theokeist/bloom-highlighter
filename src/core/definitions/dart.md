# dart Cognitive Mapping

## alert
status: enabled
regex: `\b(throw|rethrow|assert|Error|Exception)\b`
style: {"color": "#ff0055", "fontWeight": "900", "backgroundColor": "rgba(255, 0, 85, 0.15)", "textDecoration": "underline solid #ff0055 2px"}

## logic
status: enabled
regex: `==|!=|&&|\|\||\?\?|<=|>=|[<>?:]|!(?!=)|\b(is|as)\b`
style: {"color": "#00f2ff", "fontWeight": "bold", "backgroundColor": "rgba(0, 242, 255, 0.1)", "border": "1px solid rgba(0, 242, 255, 0.2)", "borderRadius": "2px"}

## mutation
status: enabled
regex: `\+\+|--|\?\?=|>>=|<<=|~/=|[+*/%&|^\-]=|(?<![=!<>])=(?![=>])`
style: {"color": "#ff8c00", "backgroundColor": "rgba(255, 140, 0, 0.08)", "fontWeight": "600"}

## guards
status: enabled
regex: `\b(if|else|return|await|async|try|catch|finally|yield|break|continue|for|while|do|switch|case|default|when)\b`
style: {"color": "#34d399", "fontWeight": "bold", "backgroundColor": "rgba(52, 211, 153, 0.12)"}

## interface
status: enabled
regex: `\b(abstract|interface|implements|typedef|factory|Function)\b`
style: {"color": "#fbbf24", "fontWeight": "bold", "backgroundColor": "rgba(251, 191, 36, 0.15)", "textDecoration": "underline solid rgba(251, 191, 36, 0.4) 2px"}

## native
status: enabled
regex: `\b(Object|String|num|int|double|bool|List|Map|Set|Iterable|Future|Stream|Duration|DateTime|Null|Never|void|dynamic)\b`
style: {"color": "#38bdf8", "fontWeight": "600", "opacity": 1.0}

## prototype
status: enabled
regex: `\b(this|super|new|extends|with)\b`
style: {"color": "#818cf8", "fontStyle": "italic", "fontWeight": "800"}

## structural
status: enabled
regex: `\b(class|mixin|extension|enum|import|export|part|library|var|late|static)\b`
style: {"color": "#f472b6", "fontWeight": "bold", "backgroundColor": "rgba(244, 114, 182, 0.15)", "border": "1px solid #f472b6"}

## anchor
status: enabled
regex: `\b(const|final)\b`
style: {"color": "#ffffff", "backgroundColor": "#3f3f46", "border": "1px solid #52525b", "borderRadius": "3px", "fontWeight": "900"}

## internal
status: enabled
regex: `(\b_[a-zA-Z0-9_]+)`
style: {"color": "#a855f7", "fontStyle": "italic", "opacity": 0.6}





## danger
status: enabled
regex: `\bProcess\s*\.\s*(?:run|runSync|start)\b(?=\s*\()|\b(?:delete|deleteSync)\b(?=\s*\()|\b(?:Pointer|DynamicLibrary)\b`
examples: ["Process.run(command)","file.delete()","Pointer","DynamicLibrary"]
style: {"color":"#ff4d4d","fontWeight":"bold","textDecoration":"underline"}


## functions
status: enabled
regex: `(?<![\w$])(?!(?:if|for|while|switch|catch|with|assert|return|throw|sizeof|typeof)\b)[A-Za-z_$][\w$]*(?=\s*\()`
examples: ["render()", "calculate(value)"]
style: {"color":"#fbbf24","fontWeight":"600"}
