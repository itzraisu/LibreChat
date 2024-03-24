import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from 'librechat-data-provider';
import type { BatchFile, TFile } from 'librechat-data-provider';
import { useDeleteFilesMutation } from '~/data-provider';
import useFileDeletion from './useFileDeletion';

export interface DeleteFilesContext {
  filesToDeleteMap: Map<string, BatchFile>;
}

export default function useDeleteFilesFromTable(callback?: () => void) {
  const queryClient = useQueryClient();
  const deletionMutation = useDeleteFilesMutation<DeleteFilesContext>({
    onMutate: async (variables) => {
      const { files } = variables;
      if (!files?.length) {
        return { filesToDeleteMap: new Map() };
      }

      const filesToDeleteMap = files.reduce((map, file) => {
        map.set(file.file_id, file);
        return map;
      }, new Map<string, BatchFile>());

      return { filesToDeleteMap };
    },
    onSuccess: (data, variables, context) => {
      console.log('Files deleted');
      const { filesToDeleteMap } = context as DeleteFilesContext;

      queryClient.setQueryData([QueryKeys.files], (oldFiles: TFile[] | undefined) => {
        const { files } = variables;
        return files?.length
          ? oldFiles?.filter((file) => !filesToDeleteMap.has(file.file_id))
          : oldFiles;
      });
      callback?.();
    },
    onError: (error) => {
      console.log('Error deleting files:', error);
      callback?.();
    },
  });

  return useFileDeletion<DeleteFilesContext>({ mutateAsync: deletionMutation.mutateAsync, context: deletionMutation.onMutate.bind(deletionMutation) });
}
