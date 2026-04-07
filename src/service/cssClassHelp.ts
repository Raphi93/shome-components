type ClassObject = Record<string, boolean>;
type ClassArray = Class[];
type Class = string | ClassObject | ClassArray;

export default function getClass(names: Class): string {
  if (typeof names === 'string') {
    return names;
  }

  let out = '';

  if (Array.isArray(names)) {
    for (let i = 0; i < names.length; i++) {
      const temp = getClass(names[i]);
      if (temp !== '') {
        out += (out && ' ') + temp;
      }
    }
  } else {
    for (let k in names) {
      if (names[k]) {
        out += (out && ' ') + k;
      }
    }
  }

  return out;
}
