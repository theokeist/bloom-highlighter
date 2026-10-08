function largeFile(lines, language = 'typescript') {
    const blocks = [];
    for (let index = 0; index < Math.ceil(lines / 8); index++) {
        blocks.push(language === 'python' ? [
            `def run_${index}(value):`, '    count = value', '    if count > 0:', '        count += 1',
            '    else:', '        count = 0', '    eval("value")', '    return count'
        ].join('\n') : language === 'dart' ? [
            `int run${index}(int value) {`, '  var count = value;', '  if (count > 0) {', '    count += 1;',
            '  }', '  File("sample").deleteSync();', '  return count;', '}'
        ].join('\n') : [
            `export function run${index}(value: number) {`, '  let count = value;', '  if (count > 0) {', '    count += 1;',
            '  }', '  eval("value");', '  return count;', '}'
        ].join('\n'));
    }
    return blocks.join('\n');
}
module.exports = { largeFile };
