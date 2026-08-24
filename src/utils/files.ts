export const getExtension = (fileName: string | undefined) => {
  if (fileName === undefined) return '';
  const dotIndex = fileName.lastIndexOf('.');
  if (dotIndex === -1) return '';
  return fileName.slice(dotIndex + 1);
};

const fileColorsSvg = {
  file: '#707070',
  archive: '#E6AD00',
  audio: '#82BC3C',
  code: '#884DD3',
  image: '#47B1FF',
  pdf: '#DB111D',
  word: '#0F89DC',
  powerpoint: '#db5d3d',
  excel: '#00A368',
  default: '#000',
};

const fileColorGroups: Record<string, keyof typeof fileColorsSvg> = {
  'image/jpeg': 'image',
  'image/png': 'image',
  jpg: 'image',
  txt: 'file',
  'application/pdf': 'pdf',
  'application/msword': 'word',
  doc: 'word',
  docx: 'word',
  zip: 'archive',
  'application/x-zip-compressed': 'archive',
  'video/avi': 'image',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
  'application/vnd.oasis.opendocument.text': 'word',
  'application/vnd.oasis.opendocument.spreadsheet': 'excel',
};

export const getFileColor = (typeOrExt: string) => {
  const group = fileColorGroups[typeOrExt] || '';
  return fileColorsSvg[group] || fileColorsSvg.default;
};

