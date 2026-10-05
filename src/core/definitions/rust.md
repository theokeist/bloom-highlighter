# rust Cognitive Mapping

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
regex: `\+\+|--|\*\*=|\?\?=|>>=|<<=|[+*/%&|^\-]=|(?<![=!<>])=(?![=>])|(?<![\w$])(?:let|mut)(?![\w$])`
examples: ["let","mut"]
style: {"color": "#ff8c00", "backgroundColor": "rgba(255, 140, 0, 0.08)", "fontWeight": "600"}

## guards
status: enabled
regex: `(?<![\w$])(?:if|else|match|for|while|loop|return|break|continue|async|await|move)(?![\w$])`
examples: ["if","else","match","for","while","loop","return","break","continue","async","await","move"]
style: {"color": "#34d399", "fontWeight": "bold", "backgroundColor": "rgba(52, 211, 153, 0.12)"}

## interface
status: enabled
regex: `(?<![\w$])(?:fn|trait|dyn|where|type)(?![\w$])`
examples: ["fn","trait","dyn","where","type"]
style: {"color": "#fbbf24", "fontWeight": "bold", "backgroundColor": "rgba(251, 191, 36, 0.15)", "textDecoration": "underline solid rgba(251, 191, 36, 0.4) 2px"}

## native
status: enabled
regex: `(?<![\w$])(?:bool|char|str|String|Vec|HashMap|HashSet|Option|Result|Box|Rc|Arc|usize|isize|u8|u16|u32|u64|i8|i16|i32|i64|f32|f64)(?![\w$])`
examples: ["bool","char","str","String","Vec","HashMap","HashSet","Option","Result","Box","Rc","Arc"]
style: {"color": "#38bdf8", "fontWeight": "600", "opacity": 1.0}

## prototype
status: enabled
regex: `(?<![\w$])(?:self|Self)(?![\w$])`
examples: ["self","Self"]
style: {"color": "#818cf8", "fontStyle": "italic", "fontWeight": "800"}

## structural
status: enabled
regex: `(?<![\w$])(?:struct|enum|mod|use|impl|union|extern)(?![\w$])`
examples: ["struct","enum","mod","use","impl","union","extern"]
style: {"color": "#f472b6", "fontWeight": "bold", "backgroundColor": "rgba(244, 114, 182, 0.15)", "border": "1px solid #f472b6"}

## anchor
status: enabled
regex: `(?<![\w$])(?:const|static|true|false)(?![\w$])`
examples: ["const","static","true","false"]
style: {"color": "#ffffff", "backgroundColor": "#3f3f46", "border": "1px solid #52525b", "borderRadius": "3px", "fontWeight": "900"}

## internal
status: enabled
regex: `(\b_[a-zA-Z0-9_]+)`
style: {"color": "#a855f7", "fontStyle": "italic", "opacity": 0.6}





## danger
status: enabled
regex: `\bunsafe\b|\b(?:transmute|from_raw_parts|get_unchecked|unwrap_unchecked|remove_file|remove_dir_all)\b(?=\s*\()|\bCommand\s*::\s*new\b(?=\s*\()`
examples: ["unsafe","transmute(value)","remove_file(path)","Command::new(command)"]
style: {"color":"#ff4d4d","fontWeight":"bold","textDecoration":"underline"}


## functions
status: enabled
regex: `(?<![\w$])(?!(?:if|for|while|switch|catch|with|assert|return|throw|sizeof|typeof)\b)[A-Za-z_$][\w$]*(?=\s*\()`
examples: ["render()", "calculate(value)"]
style: {"color":"#fbbf24","fontWeight":"600"}
