import { excelMimeTypes } from 'librechat-data-provider';
import SheetPaths from '~/components/svg/Files/SheetPaths';
import TextPaths from '~/components/svg/Files/TextPaths';
import FilePaths from '~/components/svg/Files/FilePaths';
import CodePaths from '~/components/svg/Files/CodePaths';

export const partialTypes = ['text/x-'];

const textDocument = {
  paths: TextPaths,
  fill: '#FF5588',
  title: 'Document',
};

const spreadsheet = {
  paths: SheetPaths,
  fill: '#10A37F',
  title: 'Spreadsheet',
};

const codeFile = {
  paths: CodePaths,
  fill: '#FF6E3C',
  title: 'Code',
};

export const fileTypes = {
  file: {
    paths: FilePaths,
    fill: '#0000FF',
    title: 'File',
  },
  text: textDocument,
  csv: spreadsheet,
  pdf: textDocument,
  'text/x-': codeFile,
};

export const getFileType = (type = '') => {
  if (fileTypes[type]) {
    return fileTypes[type];
  }

  if (excelMimeTypes.test(type)) {
    return spreadsheet;
  }

  const partialMatch = partialTypes.find((partial) => type.includes(partial));
  if (partialMatch && fileTypes[partialMatch]) {
    return fileTypes[partialMatch];
  }

  const category = type.split('/')[0] || 'text';
  if (fileTypes[category]) {
    return fileTypes[category];
  }

  return fileTypes.file;
};

/**
 * Format a date string to a human readable format
 * @example
 * formatDate('2020-01-01T00:00:00.000Z') // '1 Jan 2020'
 */
export function formatDate(dateString) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const date = new Date(dateString);

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
