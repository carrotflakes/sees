
function parse(src) {
  const {values, i} = parseSexps(src, 0, src.length);
  if (i === src.length)
    return values;
  throw new Error('parse error');
}

function parseSexps(src, start, end) {
  let i = start;
  const values = [];
  loop:
  while (i < end) {
    skipWs();
    if (end <= i)
      break;
    switch (src[i]) {
      case '(':
        {
          const {values: vs, i: j} = parseSexps(src, i + 1, end);
          values.push(vs);
          i = j;
        }
        break;
      case ')':
        i += 1;
        break loop;
      default:
        {
          const {atom, i: j} = parseAtom(src, i, end);
          values.push(atom);
          i = j;
        }
        break;
    }
  }

  skipWs();

  return {values, i};

  function skipWs() {
    while (i < end && ['\t', '\n', '\r', ' ', '　'].includes(src[i]))
      i++;
  }
}

function parseAtom(src, start, end) {
  try {
    const {atom, i} = parseSymbol(src, start, end);
    return {atom, i};
  } catch (e) {
  }
  try {
    const {string, i} = parseString(src, start, end);
    return {atom: string, i};
  } catch (e) {
  }
  throw new Error('parse error');
}

function parseSymbol(src, start, end) {
  let i = start;
  while (i < end && !['\t', '\n', '\r', ' ', '　', '(', ')', '"'].includes(src[i]))
    i++;
  if (i === start)
    throw new Error('parse error');
  const symbol = src.substring(start, i);
  const value = isNaN(symbol) ? symbol : +symbol;
  return {atom: value, i};
}

function parseString(src, start, end) {
  if (src[start] !== '"')
    throw new Error('parse error');
  let i = start + 1;
  while (i < end && src[i] !== '"') {
    i++;
    if (src[i] === '\\')
      i++;
  }
  const str = src.substring(start, ++i);
  const string = ['@string', JSON.parse(str)];
  return {string, i};
}


module.exports = parse;
