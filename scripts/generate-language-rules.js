// Explicit language vocabularies. Regenerate these Markdown definitions with npm run generate-rules.
const fs = require('node:fs');
const path = require('node:path');
const profile = (guards, structural, contract, native, anchor, mutation, danger, prototype = '') =>
    ({ guards, structural, interface: contract, native, anchor, mutation, danger, prototype });
const profiles = {
    java: profile('if else switch case default for while do return break continue try catch finally synchronized', 'class package import enum record', 'interface implements abstract extends throws', 'boolean byte short int long char float double void String Object List Map Set Optional CompletableFuture', 'final static true false null', '', String.raw`\b(?:Runtime|ProcessBuilder)\b|\b(?:exec|delete|deleteIfExists|exit)\b(?=\s*\()`, 'this super new'),
    csharp: profile('if else switch case default for foreach while do return break continue try catch finally await async yield lock', 'class namespace using enum struct record', 'interface delegate event abstract override virtual implements', 'bool byte char decimal double float int long object short string uint ulong ushort void Task List Dictionary Span', 'const readonly static true false null', 'var', String.raw`\b(?:unsafe|stackalloc|fixed)\b|\b(?:Process\s*\.\s*Start|File\s*\.\s*Delete|Directory\s*\.\s*Delete)\b(?=\s*\()`, 'this base new'),
    go: profile('if else switch case default for return break continue defer go select range', 'package import type struct', 'func interface chan', 'bool byte rune string int int8 int16 int32 int64 uint uint64 float32 float64 complex64 complex128 map slice error', 'const iota nil true false', 'var', String.raw`\b(?:unsafe\s*\.\s*Pointer|syscall\s*\.\s*Syscall)\b|\b(?:os\s*\.\s*(?:Remove|RemoveAll|Exit)|exec\s*\.\s*Command)\b(?=\s*\()`, ''),
    rust: profile('if else match for while loop return break continue async await move', 'struct enum mod use impl union extern', 'fn trait dyn where type', 'bool char str String Vec HashMap HashSet Option Result Box Rc Arc usize isize u8 u16 u32 u64 i8 i16 i32 i64 f32 f64', 'const static true false', 'let mut', String.raw`\bunsafe\b|\b(?:transmute|from_raw_parts|get_unchecked|unwrap_unchecked|remove_file|remove_dir_all)\b(?=\s*\()|\bCommand\s*::\s*new\b(?=\s*\()`, 'self Self'),
    kotlin: profile('if else when for while do return break continue try catch finally throw suspend', 'class object package import enum', 'fun interface typealias abstract override open', 'Int Long Short Byte Float Double Boolean Char String List Map Set Unit Nothing Any', 'val const true false null', 'var lateinit', String.raw`\b(?:exec|delete|deleteRecursively|exitProcess)\b(?=\s*\()|\bProcessBuilder\b`, 'this super constructor init'),
    swift: profile('if else guard switch case default for while repeat return break continue do catch try await async defer', 'class struct enum extension import actor', 'func protocol associatedtype typealias override', 'Int UInt Float Double Bool String Array Dictionary Set Optional Void Any Never', 'let static true false nil', 'var inout', String.raw`\b(?:unsafeBitCast|unsafeDowncast|fatalError|removeItem|withUnsafePointer|withUnsafeMutablePointer)\b(?=\s*\()|\bUnsafe(?:Mutable)?(?:Raw)?Pointer\b`, 'self Self super init deinit'),
    scala: profile('if else match case for while do return try catch finally throw yield', 'class object package import enum given', 'def trait type extension', 'Int Long Float Double Boolean Char String List Map Set Option Either Unit Any Nothing', 'val lazy true false null', 'var', String.raw`\b(?:exec|delete|deleteIfExists|exit|asInstanceOf)\b`, 'this super new'),
    groovy: profile('if else switch case default for while do return break continue try catch finally throw', 'class package import enum', 'def interface trait implements extends', 'String Object List Map Set Integer Boolean BigDecimal Closure', 'final static true false null', '', String.raw`\b(?:execute|exec|delete|deleteDir|evaluate)\b(?=\s*\()`, 'this super new'),
    php: profile('if elseif else switch case default for foreach while do return break continue try catch finally throw yield match', 'class namespace use include include_once require require_once enum', 'function interface trait implements abstract', 'int float string bool array object iterable callable mixed void never', 'const readonly static true false null', '', String.raw`\b(?:eval|exec|system|shell_exec|passthru|unlink|rmdir|unserialize)\b(?=\s*\()`, 'self parent new clone'),
    d: profile('if else switch case default for foreach while do return break continue try catch finally throw scope', 'class struct union enum module import', 'interface template alias delegate function', 'bool byte ubyte short ushort int uint long ulong float double real char wchar dchar string void', 'const immutable static true false null', '', String.raw`\b(?:cast|asm)\b|\b(?:system|remove|free|malloc)\b(?=\s*\()`, 'this super new delete'),
    zig: profile('if else switch for while return break continue try catch defer errdefer async await', 'struct union enum opaque import', 'fn anytype', 'bool u8 u16 u32 u64 i8 i16 i32 i64 usize isize f32 f64 void anyerror', 'const true false null undefined comptime', 'var', String.raw`@(?:ptrCast|intFromPtr|ptrFromInt|bitCast)\b|\b(?:deleteFile|deleteTree|unreachable)\b`, ''),
    solidity: profile('if else for while do return break continue try catch revert require assert', 'contract library import pragma struct enum', 'function interface modifier event error returns', 'uint uint256 int int256 bool address bytes bytes32 string mapping', 'constant immutable true false', '', String.raw`\b(?:selfdestruct|delegatecall|callcode|assembly|tx\s*\.\s*origin)\b`, 'this super new'),
    'cuda-cpp': profile('if else switch case default for while do return break continue', 'class struct namespace enum include define', 'template typename __global__ __device__ __host__', 'int float double char void dim3 float2 float3 float4 uint3 size_t', 'const static constexpr true false', '', String.raw`\b(?:cudaFree|cudaMemcpy|malloc|free|memcpy|atomicExch)\b(?=\s*\()`, 'this new delete'),
    hlsl: profile('if else switch case default for while do return break continue discard', 'struct cbuffer tbuffer', 'in out inout register', 'float float2 float3 float4 float4x4 int uint bool Texture2D SamplerState RWTexture2D', 'const static true false', '', String.raw`\b(?:InterlockedAdd|InterlockedExchange|clip|discard)\b`, ''),
    glsl: profile('if else switch case default for while do return break continue discard', 'struct uniform layout buffer', 'in out inout attribute varying', 'float int uint bool vec2 vec3 vec4 mat2 mat3 mat4 sampler2D samplerCube', 'const true false', '', String.raw`\b(?:imageStore|atomicAdd|atomicExchange|discard)\b`, ''),
    fsharp: profile('if then else match with for while do yield return try finally raise async let use', 'module namespace open type exception', 'member interface abstract override delegate', 'int int64 float float32 bool string char unit list array option seq Map Set', 'let true false None Some', 'mutable', String.raw`\b(?:NativePtr|Unchecked)\b|\b(?:Process\s*\.\s*Start|File\s*\.\s*Delete|failwith)\b`, 'new inherit base'),
    ocaml: profile('if then else match with for while do done try raise let in', 'module open include type exception', 'val fun function method class', 'int float bool string char unit list array option ref', 'let true false None Some', 'mutable', String.raw`\b(?:Obj\s*\.\s*(?:magic|set_field)|Sys\s*\.\s*(?:command|remove)|Unix\s*\.\s*(?:execv|unlink))\b`, 'new inherit'),
    shellscript: profile('if then elif else fi for while until do done case esac return break continue', 'function source export', 'function', '', 'readonly true false', 'local declare', String.raw`(?<![\w-])(?:rm|rmdir|sudo|eval|exec|dd|mkfs|chmod|chown)(?![\w-])`, ''),
    powershell: profile('if elseif else switch foreach for while do until return break continue try catch finally trap', 'function class enum using param', 'function filter param', 'string int long bool double decimal datetime hashtable array object', 'true false null', 'Set-Variable', String.raw`\b(?:Remove-Item|Invoke-Expression|Start-Process|Stop-Process|Format-Volume|Clear-Disk)\b`, ''),
    perl: profile('if elsif else unless for foreach while until return next last redo continue eval', 'package use require sub', 'sub', 'scalar array hash ref undef', 'constant undef', 'my our local state', String.raw`\b(?:eval|system|exec|unlink|rmdir|chmod|chown)\b`, 'bless'),
    r: profile('if else for while repeat return break next tryCatch', 'function library require source', 'function', 'integer numeric double logical character list matrix data.frame factor environment', 'TRUE FALSE NULL NA Inf NaN', '', String.raw`\b(?:system|system2|unlink|file\.remove|eval|parse)\b(?=\s*\()`, ''),
    julia: profile('if elseif else for while return break continue try catch finally begin end do', 'module baremodule using import export struct abstract primitive', 'function macro where', 'Int Int64 Float64 Bool String Vector Matrix Array Dict Set Nothing', 'const true false nothing', 'global local', String.raw`\b(?:unsafe_load|unsafe_store!|unsafe_wrap|ccall|rm|run|eval)\b`, ''),
    elixir: profile('if else unless case cond with for do end try rescue catch after receive fn', 'defmodule import alias require use', 'def defp defmacro defmacrop defprotocol defimpl', 'Map List Tuple String Integer Float Atom Enum Stream', 'true false nil', '', String.raw`\b(?:System\s*\.\s*(?:cmd|shell|halt)|File\s*\.\s*(?:rm|rm_rf)|Code\s*\.\s*eval_string)\b`, ''),
    coffeescript: profile('if then else unless for while until loop return break continue try catch finally switch when await yield', 'class extends import export', '', 'Object Array String Number Boolean Promise Map Set', 'yes no on off true false null undefined', '', String.raw`\b(?:eval|exec|execSync|spawn|unlink|rm)\b(?=\s*\()`, 'super new'),
    lua: profile('if then elseif else end for while do repeat until return break goto', 'function local require', 'function', 'table string number boolean nil coroutine math io os', 'true false nil', 'local', String.raw`\b(?:os\s*\.\s*(?:execute|remove|exit)|io\s*\.\s*popen|load|loadfile|dofile)\b(?=\s*\()`, 'self'),
    sql: profile('SELECT WHERE JOIN ON HAVING GROUP ORDER LIMIT OFFSET CASE WHEN THEN ELSE END BEGIN COMMIT ROLLBACK', 'CREATE TABLE VIEW INDEX SCHEMA ALTER', 'FUNCTION PROCEDURE RETURNS', 'INT INTEGER BIGINT DECIMAL FLOAT DOUBLE BOOLEAN VARCHAR TEXT DATE TIMESTAMP NULL', 'TRUE FALSE NULL', 'UPDATE INSERT DELETE SET', String.raw`(?<!\w)(?:[Dd][Rr][Oo][Pp]|[Tt][Rr][Uu][Nn][Cc][Aa][Tt][Ee]|[Dd][Ee][Ll][Ee][Tt][Ee]|[Uu][Pp][Dd][Aa][Tt][Ee]|[Ee][Xx][Ee][Cc](?:[Uu][Tt][Ee])?)(?!\w)`, ''),
    clojure: profile('if if-not when when-not cond case loop recur doseq for try catch finally throw', 'ns require import def defonce', 'defn defn- defmacro defprotocol deftype defrecord reify', 'String Long Double Boolean PersistentVector PersistentArrayMap', 'true false nil', 'reset! swap! alter ref-set set!', String.raw`(?<![\w-])(?:eval|load-string|shell/sh|delete-file)(?![\w-])`, ''),
    lisp: profile('if cond case when unless loop do dolist dotimes return block catch throw unwind-protect', 'defpackage in-package require provide defvar defparameter', 'defun defmacro defgeneric defmethod defclass', 'integer float string character list array hash-table symbol', 'nil t defconstant', 'setf setq incf decf push pop', String.raw`(?<![\w-])(?:eval|compile|delete-file|run-program|sb-ext:run-program)(?![\w-])`, ''),
    scheme: profile('if cond case when unless do begin let let* letrec call/cc guard', 'define define-library import export include', 'lambda define-syntax syntax-rules', 'number string symbol vector list boolean char', 'true false', 'set! vector-set! string-set!', String.raw`(?<![\w-])(?:eval|load|delete-file|system)(?![\w-])`, ''),
    haskell: profile('if then else case of do let in where guard', 'module import data newtype type deriving', 'class instance forall', 'Int Integer Float Double Bool Char String Maybe Either IO Map Set', 'True False Nothing Just', '', String.raw`\b(?:unsafePerformIO|unsafeCoerce|unsafeInterleaveIO|removeFile|removeDirectoryRecursive|callCommand)\b`, ''),
    erlang: profile('case of end if receive after try catch when begin fun', 'module export import include record define', 'spec callback behaviour fun', 'integer float atom binary list tuple map pid port reference', 'true false undefined', 'put erase', String.raw`\b(?:os\s*:\s*cmd|file\s*:\s*(?:delete|del_dir)|erlang\s*:\s*(?:halt|exit)|binary_to_term)\b`, ''),
    matlab: profile('if elseif else end for parfor while switch case otherwise try catch return break continue', 'function classdef properties methods events enumeration import', 'function methods', 'double single int8 int16 int32 int64 uint8 logical char string cell struct table', 'true false NaN Inf', 'global persistent', String.raw`\b(?:delete|rmdir|system|unix|dos|eval|evalin|assignin)\b(?=\s*\()`, ''),
    c: profile('if else switch case default for while do return break continue goto', 'struct union enum extern include define', 'typedef', 'int char float double void size_t bool long short unsigned signed', 'const static true false NULL', '', String.raw`\b(?:malloc|free|realloc|memcpy|strcpy|sprintf|gets|system|remove|unlink)\b(?=\s*\()`, 'sizeof'),
    'objective-c': profile('if else switch case default for while do return break continue try catch finally', 'interface implementation end protocol import class', 'property synthesize dynamic optional required', 'int char float double void BOOL NSInteger NSUInteger NSString NSArray NSDictionary NSObject', 'const static YES NO nil NULL', '', String.raw`\b(?:malloc|free|memcpy|system|removeItemAtPath|performSelector)\b`, 'self super alloc init'),
    'objective-cpp': profile('if else switch case default for while do return break continue try catch finally', 'class namespace interface implementation end protocol import', 'template typename virtual property synthesize', 'int char float double void bool NSString NSArray NSDictionary NSObject std size_t', 'const static constexpr YES NO nil nullptr', '', String.raw`\b(?:malloc|free|memcpy|system|reinterpret_cast|removeItemAtPath|performSelector)\b`, 'self super this new delete'),
    javascript: profile('if else return await async try catch finally yield break continue for while do switch case default', 'class export import let var', 'function', 'Object Array Map Set Promise Error String Number Boolean Symbol Function Date RegExp JSON Math Reflect Proxy', 'const', '', String.raw`\beval\b(?=\s*\()|\b(?:exec|execSync|spawn|spawnSync|unlink|unlinkSync|rm|rmSync)\b(?=\s*\()|\bdocument\s*\.\s*write\b(?=\s*\()|\b(?:innerHTML|outerHTML)\b(?=\s*=)`, 'prototype __proto__ constructor')
};
const dangerExamples = {
    java: ['Runtime.getRuntime().exec(command)', 'new ProcessBuilder(command)', 'file.delete()'],
    csharp: ['unsafe', 'stackalloc', 'Process.Start(command)', 'File.Delete(path)'],
    go: ['unsafe.Pointer(ptr)', 'os.RemoveAll(path)', 'exec.Command(command)'],
    rust: ['unsafe', 'transmute(value)', 'remove_file(path)', 'Command::new(command)'],
    kotlin: ['exec(command)', 'deleteRecursively()', 'ProcessBuilder(command)'],
    swift: ['unsafeBitCast(value)', 'UnsafePointer', 'removeItem(atPath)', 'fatalError()'],
    scala: ['exec(command)', 'delete(path)', 'asInstanceOf'], groovy: ['execute()', 'evaluate(code)', 'deleteDir()'],
    php: ['eval(code)', 'shell_exec(command)', 'unlink(path)', 'unserialize(data)'],
    d: ['cast', 'asm', 'system(command)', 'free(ptr)'], zig: ['@ptrCast(ptr)', 'deleteTree(path)', 'unreachable'],
    solidity: ['selfdestruct', 'delegatecall', 'assembly', 'tx.origin'],
    'cuda-cpp': ['cudaFree(ptr)', 'cudaMemcpy(dst, src)', 'atomicExch(ptr, value)'],
    hlsl: ['InterlockedAdd', 'InterlockedExchange', 'discard'], glsl: ['imageStore', 'atomicAdd', 'discard'],
    fsharp: ['NativePtr', 'Unchecked', 'File.Delete(path)', 'Process.Start(command)'],
    ocaml: ['Obj.magic value', 'Sys.command command', 'Unix.unlink path'],
    shellscript: ['rm', 'sudo', 'eval', 'dd'], powershell: ['Remove-Item', 'Invoke-Expression', 'Start-Process', 'Format-Volume'],
    perl: ['eval', 'system', 'unlink', 'exec'], r: ['system(command)', 'unlink(path)', 'eval(expr)'],
    julia: ['unsafe_load(ptr)', 'unsafe_store!(ptr)', 'ccall', 'rm(path)'],
    elixir: ['System.cmd(command)', 'File.rm_rf(path)', 'Code.eval_string(code)'],
    coffeescript: ['eval(code)', 'exec(command)', 'unlink(path)'], lua: ['os.execute(command)', 'os.remove(path)', 'load(code)'],
    sql: ['DROP', 'TRUNCATE', 'DELETE', 'UPDATE'], clojure: ['eval', 'load-string', 'shell/sh', 'delete-file'],
    lisp: ['eval', 'delete-file', 'run-program'], scheme: ['eval', 'load', 'delete-file'],
    haskell: ['unsafePerformIO', 'unsafeCoerce', 'removeFile', 'callCommand'], erlang: ['os:cmd(command)', 'file:delete(path)', 'binary_to_term(data)'],
    matlab: ['delete(path)', 'system(command)', 'eval(code)'], c: ['free(ptr)', 'strcpy(dst, src)', 'system(command)'],
    'objective-c': ['free(ptr)', 'performSelector', 'removeItemAtPath'], 'objective-cpp': ['reinterpret_cast', 'performSelector', 'free(ptr)'],
    javascript: ['eval(code)', 'execSync(command)', 'rmSync(path)', 'element.innerHTML = html'],
    typescript: ['eval(code)', 'execSync(command)', 'rmSync(path)', 'element.innerHTML = html'],
    dart: ['Process.run(command)', 'file.delete()', 'Pointer', 'DynamicLibrary'],
    python: ['eval(code)', 'os.remove(path)', 'subprocess.run(command)', 'pickle.loads(data)'],
    ruby: ['eval(code)', 'system(command)', 'unlink(path)'], cpp: ['reinterpret_cast', 'free(ptr)', 'system(command)', 'delete']
};
const escape = word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const words = (text, insensitive = false) => {
    if (!text) return '(?!)';
    const alternatives = text.split(' ').filter(Boolean).map(word => insensitive ?
        [...word].map(char => /[a-z]/i.test(char) ? `[${char.toLowerCase()}${char.toUpperCase()}]` : escape(char)).join('') : escape(word));
    return `(?<![\\w$])(?:${alternatives.join('|')})(?![\\w$])`;
};
const directory = path.join(__dirname, '../src/core/definitions');
const base = fs.readFileSync(path.join(directory, 'typescript.md'), 'utf8');
const operator = String.raw`\+\+|--|\*\*=|\?\?=|>>=|<<=|[+*/%&|^\-]=|(?<![=!<>])=(?![=>])`;
const functional = new Set(['fsharp', 'ocaml', 'haskell', 'clojure', 'lisp', 'scheme', 'elixir', 'erlang']);
for (const [id, p] of Object.entries(profiles)) {
    const insensitive = ['sql', 'powershell'].includes(id);
    const patterns = Object.fromEntries(['guards', 'structural', 'interface', 'native', 'anchor', 'prototype'].map(key => [key, words(p[key], insensitive)]));
    patterns.alert = words(id === 'sql' ? 'RAISE SIGNAL ROLLBACK' : id === 'powershell' ? 'throw Write-Error' : 'throw raise panic assert error Error Exception', insensitive);
    patterns.logic = String.raw`===|!==|==|!=|&&|\|\||\?\?|<=|>=|[<>?:]|!(?!=)`;
    const logicalWords = ['python', 'coffeescript', 'lua', 'elixir', 'julia', 'shellscript', 'sql'].includes(id) ? 'and or not AND OR NOT' : '';
    if (logicalWords) patterns.logic += '|' + words(logicalWords, insensitive);
    patterns.mutation = (functional.has(id) ? String.raw`:=|<-` : id === 'r' ? String.raw`<<-|<-|->>|->|(?<![=!<>])=(?![=>])` : operator) + '|' + words(p.mutation, insensitive);
    if (id === 'go') patterns.mutation += '|:=';
    if (id === 'powershell') patterns.logic += '|' + String.raw`-(?:eq|ne|lt|le|gt|ge|and|or|not)\b`;
    let category = '';
    const markdown = base.replace('# TypeScript/JavaScript Cognitive Mapping', '# ' + id + ' Cognitive Mapping')
        .split('\n').map(line => {
            if (line.startsWith('## ')) category = line.slice(3).trim();
            if (line.startsWith('examples:')) return '';
            if (line.startsWith('regex:') && patterns[category]) {
                const sourceExamples = p[category] ? p[category].split(' ').filter(Boolean) :
                    category === 'mutation' ? functional.has(id) ? [':=', '<-'] : ['+=', '='] : ['==', '!=', '&&'];
                return 'regex: `' + patterns[category] + '`\nexamples: ' + JSON.stringify(sourceExamples.slice(0, 12));
            }
            return line;
        }).join('\n').replace(/\n## danger[\s\S]*$/, '');
    fs.writeFileSync(path.join(directory, id + '.md'), markdown + '\n\n## danger\nstatus: enabled\nregex: `' + p.danger + '`\nexamples: ' + JSON.stringify(dangerExamples[id]) + '\nstyle: {"color":"#ff4d4d","fontWeight":"bold","textDecoration":"underline"}\n');
}
const risks = {
    dart: String.raw`\bProcess\s*\.\s*(?:run|runSync|start)\b(?=\s*\()|\b(?:delete|deleteSync)\b(?=\s*\()|\b(?:Pointer|DynamicLibrary)\b`,
    typescript: profiles.javascript.danger,
    python: String.raw`\b(?:eval|exec|__import__)\b(?=\s*\()|\b(?:os\s*\.\s*(?:system|remove|unlink|rmdir)|shutil\s*\.\s*rmtree|subprocess\s*\.\s*(?:run|Popen|call)|pickle\s*\.\s*loads?)\b(?=\s*\()`,
    ruby: String.raw`\b(?:eval|system|exec|instance_eval|class_eval|unlink|delete|rmdir)\b(?=\s*\()`,
    cpp: String.raw`\b(?:reinterpret_cast|const_cast|delete)\b|\b(?:malloc|free|realloc|memcpy|strcpy|sprintf|gets|system|remove|unlink)\b(?=\s*\()`
};
for (const [id, pattern] of Object.entries(risks)) {
    const file = path.join(directory, id + '.md');
    const source = fs.readFileSync(file, 'utf8').replace(/\n## danger[\s\S]*$/, '');
    fs.writeFileSync(file, source + '\n\n## danger\nstatus: enabled\nregex: `' + pattern + '`\nexamples: ' + JSON.stringify(dangerExamples[id]) + '\nstyle: {"color":"#ff4d4d","fontWeight":"bold","textDecoration":"underline"}\n');
}
for (const filename of fs.readdirSync(directory).filter(file => file.endsWith('.md'))) {
    const file = path.join(directory, filename);
    const source = fs.readFileSync(file, 'utf8').replace(/\n## functions[\s\S]*$/, '');
    // Match only callable names, never their arguments or bodies. Lexical masking runs first.
    const pattern = String.raw`(?<![\w$])(?!(?:if|for|while|switch|catch|with|assert|return|throw|sizeof|typeof)\b)[A-Za-z_$][\w$]*(?=\s*\()`;
    fs.writeFileSync(file, source + '\n\n## functions\nstatus: enabled\nregex: `' + pattern + '`\nexamples: ["render()", "calculate(value)"]\nstyle: {"color":"#fbbf24","fontWeight":"600"}\n');
}
console.log(`Generated ${Object.keys(profiles).length} individual language definitions and function rules.`);
