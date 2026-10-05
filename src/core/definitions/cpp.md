# C++/C Cognitive Mapping

## alert
status: enabled
regex: `\b(throw|error|abort|exit|assert|reject|std::runtime_error|std::exception|std::terminate)\b|(!=)`
style: {"color": "#ff0055", "fontWeight": "900", "backgroundColor": "rgba(255, 0, 85, 0.15)", "textDecoration": "underline solid #ff0055 2px"}

## logic
status: enabled
regex: `==|!=|&&|\|\||<=|>=|[!?:<>]`
style: {"color": "#00f2ff", "fontWeight": "bold", "backgroundColor": "rgba(0, 242, 255, 0.1)", "border": "1px solid rgba(0, 242, 255, 0.2)", "borderRadius": "2px"}

## mutation
status: enabled
regex: `\+\+|--|>>=|<<=|[+*/%&|^\-]=|(?<![=!<>])=(?![=>])`
style: {"color": "#ff8c00", "backgroundColor": "rgba(255, 140, 0, 0.08)", "fontWeight": "600"}

## guards
status: enabled
regex: `\b(if|else|switch|case|default|for|while|do|return|break|continue|goto|try|catch|throw)\b`
style: {"color": "#34d399", "fontWeight": "bold", "backgroundColor": "rgba(52, 211, 153, 0.12)"}

## interface
status: enabled
regex: `\b(struct|union|typedef|using|template|typename|virtual|override|explicit|abstract|interface)\b`
style: {"color": "#fbbf24", "fontWeight": "bold", "backgroundColor": "rgba(251, 191, 36, 0.15)", "textDecoration": "underline solid rgba(251, 191, 36, 0.4) 2px"}

## native
status: enabled
regex: `\b(int|char|float|double|void|size_t|bool|long|short|unsigned|signed|ssize_t|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t|std::string|std::vector|std::map|std::set|std::shared_ptr|std::unique_ptr|std::weak_ptr|std::move|std::forward|std::make_shared|std::make_unique)\b`
style: {"color": "#38bdf8", "fontWeight": "600", "opacity": 1.0}

## prototype
status: enabled
regex: `\b(public|private|protected|friend|inline|operator|const_cast|static_cast|dynamic_cast|reinterpret_cast|new|delete|malloc|free|sizeof|alignof|decltype)\b`
style: {"color": "#818cf8", "fontStyle": "italic", "fontWeight": "800"}

## structural
status: enabled
regex: `\b(class|namespace|extern|static|inline)\b|#[ \t]*(include|define|ifdef|ifndef|endif|else|elif|pragma)\b`
style: {"color": "#f472b6", "fontWeight": "bold", "backgroundColor": "rgba(244, 114, 182, 0.15)", "border": "1px solid #f472b6"}

## anchor
status: enabled
regex: `\b(const|static|constexpr|consteval|constinit|enum|nullptr|true|false|this|NULL)\b`
style: {"color": "#ffffff", "backgroundColor": "#3f3f46", "border": "1px solid #52525b", "borderRadius": "3px", "fontWeight": "900"}

## internal
status: enabled
regex: `(\b_[a-zA-Z0-9_]+)`
style: {"color": "#a855f7", "fontStyle": "italic", "opacity": 0.6}





## danger
status: enabled
regex: `\b(?:reinterpret_cast|const_cast|delete)\b|\b(?:malloc|free|realloc|memcpy|strcpy|sprintf|gets|system|remove|unlink)\b(?=\s*\()`
examples: ["reinterpret_cast","free(ptr)","system(command)","delete"]
style: {"color":"#ff4d4d","fontWeight":"bold","textDecoration":"underline"}


## functions
status: enabled
regex: `(?<![\w$])(?!(?:if|for|while|switch|catch|with|assert|return|throw|sizeof|typeof)\b)[A-Za-z_$][\w$]*(?=\s*\()`
examples: ["render()", "calculate(value)"]
style: {"color":"#fbbf24","fontWeight":"600"}
