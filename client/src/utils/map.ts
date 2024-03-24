import type { TFile, Assistant } from 'librechat-data-provider';

/** Maps Files by `file_id` for quick lookup */
export function mapFiles(files: TFile[]): Record<string, TFile> {
  return files.reduce((fileMap, file) => {
    fileMap[file.file_id] = file;
    return fileMap;
  }, {});
}

/** Maps Assistants by `id` for quick lookup */
export function mapAssistants(assistants: Assistant[]): Record<string, Assistant> {
  return assistants.reduce((assistantMap, assistant) => {
    assistantMap[assistant.id] = assistant;
    return assistantMap;
  }, {});
}
