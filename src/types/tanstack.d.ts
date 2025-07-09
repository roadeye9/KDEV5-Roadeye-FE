import '@tanstack/react-query'

interface QueryMeta extends Record<string, unknown> {
  persist?: boolean
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: QueryMeta
    mutationMeta: QueryMeta
  }
}