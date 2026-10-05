# Python Cognitive Mapping

## alert
status: enabled
regex: `\b(del|raise|assert|exit|quit)\b|(!=)`
style: {"color": "#ff0055", "fontWeight": "900", "backgroundColor": "rgba(255, 0, 85, 0.15)", "textDecoration": "underline solid #ff0055 2px"}

## logic
status: enabled
regex: `\b(and|or|not|in|is|lambda)\b|(==|<=|>=|<|>)`
style: {"color": "#00f2ff", "fontWeight": "bold", "backgroundColor": "rgba(0, 242, 255, 0.1)", "border": "1px solid rgba(0, 242, 255, 0.2)", "borderRadius": "2px"}

## mutation
status: enabled
regex: `\*\*=|//=|>>=|<<=|[+*/%&|^\-]=|:=|(?<![=!<>])=(?![=])|\b(global|nonlocal)\b`
style: {"color": "#ff8c00", "backgroundColor": "rgba(255, 140, 0, 0.08)", "fontWeight": "600"}

## guards
status: enabled
regex: `\b(if|elif|else|for|while|return|yield|try|except|finally|with|as|break|continue|await|async|match|case)\b`
style: {"color": "#34d399", "fontWeight": "bold", "backgroundColor": "rgba(52, 211, 153, 0.12)"}

## interface
status: enabled
regex: `\b(def)\b`
style: {"color": "#fbbf24", "fontWeight": "bold", "backgroundColor": "rgba(251, 191, 36, 0.15)", "textDecoration": "underline solid rgba(251, 191, 36, 0.4) 2px"}

## native
status: enabled
regex: `\b(int|float|str|bool|list|dict|set|tuple|range|enumerate|zip|map|filter|super|print|len|open|sum|max|min|abs|round|sorted|any|all|id|type|isinstance)\b`
style: {"color": "#38bdf8", "fontWeight": "600", "opacity": 1.0}

## prototype
status: enabled
regex: `(__init__|__str__|__repr__|__call__|__getitem__|__setitem__|__iter__|__next__|__enter__|__exit__|__del__|__name__|__file__|__doc__|__package__|__path__)\b`
style: {"color": "#818cf8", "fontStyle": "italic", "fontWeight": "800"}

## structural
status: enabled
regex: `\b(class|import|from)\b`
style: {"color": "#f472b6", "fontWeight": "bold", "backgroundColor": "rgba(244, 114, 182, 0.15)", "border": "1px solid #f472b6"}

## anchor
status: enabled
regex: `\b(None|True|False|self|cls)\b`
style: {"color": "#ffffff", "backgroundColor": "#3f3f46", "border": "1px solid #52525b", "borderRadius": "3px", "fontWeight": "900"}

## internal
status: enabled
regex: `(\b_[a-zA-Z0-9_]+)`
style: {"color": "#a855f7", "fontStyle": "italic", "opacity": 0.6}





## danger
status: enabled
regex: `\b(?:eval|exec|__import__)\b(?=\s*\()|\b(?:os\s*\.\s*(?:system|remove|unlink|rmdir)|shutil\s*\.\s*rmtree|subprocess\s*\.\s*(?:run|Popen|call)|pickle\s*\.\s*loads?)\b(?=\s*\()`
examples: ["eval(code)","os.remove(path)","subprocess.run(command)","pickle.loads(data)"]
style: {"color":"#ff4d4d","fontWeight":"bold","textDecoration":"underline"}


## functions
status: enabled
regex: `(?<![\w$])(?!(?:if|for|while|switch|catch|with|assert|return|throw|sizeof|typeof)\b)[A-Za-z_$][\w$]*(?=\s*\()`
examples: ["render()", "calculate(value)"]
style: {"color":"#fbbf24","fontWeight":"600"}
