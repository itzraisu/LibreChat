import { useForm, FormProvider } from 'react-hook-form';
import { createContext, useContext } from 'react';
import { defaultAssistantFormValues } from 'librechat-data-provider';
import type { UseFormReturn } from 'react-hook-form';
import type { AssistantForm } from '~/common';

type AssistantsContextType = UseFormReturn<AssistantForm> | undefined;

export const AssistantsContext = createContext<AssistantsContextType>(undefined);

export function useAssistantsContext() {
  const context = useContext(AssistantsContext);

  if (context === undefined) {
    throw new Error('useAssistantsContext must be used within an AssistantsProvider');
  }

  return context;
}

export default function AssistantsProvider({ children }) {
  const methods = useForm<AssistantForm>({
    defaultValues: defaultAssistantFormValues,
  });

  return <AssistantsContext.Provider value={methods}><FormProvider {...methods}>{children}</FormProvider></AssistantsContext.Provider>;
}
