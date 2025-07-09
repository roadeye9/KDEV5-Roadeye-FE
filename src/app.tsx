import { QueryClient, type OmitKeyof } from '@tanstack/react-query';
import { PersistQueryClientProvider, type PersistQueryClientOptions } from '@tanstack/react-query-persist-client';

import AppRoutes from './routes';
import { createIDBPersister } from './lib/persister';

export const queryClient = new QueryClient();

const persistOptions: OmitKeyof<PersistQueryClientOptions, 'queryClient'> = {
  persister: createIDBPersister(),
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      return query.options.meta?.persist === true;
    },
    shouldDehydrateMutation(mutation) {
      return mutation.options.meta?.persist === true;
    }
  }
}

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
    >
      <AppRoutes />
    </PersistQueryClientProvider>
  );
}

export default App;
