# Ruby Cognitive Mapping

## alert
status: enabled
regex: `\b(raise|fail|throw|error|abort|exit)\b|(!=)`
style: {"color": "#ff0055", "fontWeight": "900", "backgroundColor": "rgba(255, 0, 85, 0.15)", "textDecoration": "underline solid #ff0055 2px"}

## logic
status: enabled
regex: `\b(and|or|not)\b|===|==|!=|<=|>=|&&|\|\||!(?!=)|[<>]`
style: {"color": "#00f2ff", "fontWeight": "bold", "backgroundColor": "rgba(0, 242, 255, 0.1)", "border": "1px solid rgba(0, 242, 255, 0.2)", "borderRadius": "2px"}

## mutation
status: enabled
regex: `\*\*=|&&=|\|\|=|>>=|<<=|[+*/%&|^\-]=|(?<![=!<>])=(?![=~>])|\b(attr_accessor|attr_writer)\b`
style: {"color": "#ff8c00", "backgroundColor": "rgba(255, 140, 0, 0.08)", "fontWeight": "600"}

## guards
status: enabled
regex: `\b(if|unless|else|elsif|case|when|then|return|yield|break|next|redo|retry|begin|rescue|ensure|end|do|while|until|for)\b`
style: {"color": "#34d399", "fontWeight": "bold", "backgroundColor": "rgba(52, 211, 153, 0.12)"}

## interface
status: enabled
regex: `\b(def|include|extend|prepend|attr_reader|attr_writer|attr_accessor)\b`
style: {"color": "#fbbf24", "fontWeight": "bold", "backgroundColor": "rgba(251, 191, 36, 0.15)", "textDecoration": "underline solid rgba(251, 191, 36, 0.4) 2px"}

## native
status: enabled
regex: `\b(Object|Module|Class|Kernel|String|Integer|Float|Array|Hash|Symbol|Range|Enumerable|Enumerator|Numeric|StandardError|Exception|JSON|Math)\b`
style: {"color": "#38bdf8", "fontWeight": "600", "opacity": 1.0}

## prototype
status: enabled
regex: `\b(new|initialize|method_missing|respond_to|respond_to_missing|ancestors|superclass|class_eval|instance_eval|singleton_class)\b`
style: {"color": "#818cf8", "fontStyle": "italic", "fontWeight": "800"}

## structural
status: enabled
regex: `\b(class|module|require|require_relative|load|autoload)\b`
style: {"color": "#f472b6", "fontWeight": "bold", "backgroundColor": "rgba(244, 114, 182, 0.15)", "border": "1px solid #f472b6"}

## anchor
status: enabled
regex: `\b(nil|true|false|self|class|module|def)\b`
style: {"color": "#ffffff", "backgroundColor": "#3f3f46", "border": "1px solid #52525b", "borderRadius": "3px", "fontWeight": "900"}

## internal
status: enabled
regex: `(?<!\w)@@?[a-zA-Z_][a-zA-Z0-9_]*|\b_[a-zA-Z0-9_]+`
style: {"color": "#a855f7", "fontStyle": "italic", "opacity": 0.6}





## danger
status: enabled
regex: `\b(?:eval|system|exec|instance_eval|class_eval|unlink|delete|rmdir)\b(?=\s*\()`
examples: ["eval(code)","system(command)","unlink(path)"]
style: {"color":"#ff4d4d","fontWeight":"bold","textDecoration":"underline"}


## functions
status: enabled
regex: `(?<![\w$])(?!(?:if|for|while|switch|catch|with|assert|return|throw|sizeof|typeof)\b)[A-Za-z_$][\w$]*(?=\s*\()`
examples: ["render()", "calculate(value)"]
style: {"color":"#fbbf24","fontWeight":"600"}
