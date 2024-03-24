import { createContext, useContext } from 'react';
import { useAssistantsMap } from '../hooks/Assistants'; // updated the path to the hook

// create a type for the context value
type AssistantsMapContextValue = ReturnType<typeof useAssistantsMap> | null;

// create the context
export const AssistantsMapContext = createContext<AssistantsMapContextValue>(null);
export const useAssistantsMapContext = () => useContext(AssistantsMapContext);

// update the default value of the context to null, so we can check if the context has been initialized
// also, use the generic type when creating the context, so TypeScript can infer the type correctly


const contextValue = useAssistantsMapContext();
if (!contextValue) {
  // handle the case where the context has not been initialized
}
