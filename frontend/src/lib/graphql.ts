const DEFAULT_BACKEND_URL = "http://localhost:3333/graphql";

type GraphQLErrorResponse = {
  message: string;
  extensions?: {
    code?: string;
  };
};

type GraphQLResponse<TData> = {
  data?: TData;
  errors?: GraphQLErrorResponse[];
};

export class ApiError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

function getGraphQLEndpoint() {
  const value = import.meta.env.VITE_BACKEND_URL?.trim();

  if (!value) {
    return DEFAULT_BACKEND_URL;
  }

  return value.endsWith("/graphql") ? value : `${value.replace(/\/$/, "")}/graphql`;
}

export async function graphqlRequest<TData, TVariables = unknown>(
  query: string,
  variables?: TVariables,
  token?: string | null,
) {
  const response = await fetch(getGraphQLEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  let payload: GraphQLResponse<TData>;

  try {
    payload = (await response.json()) as GraphQLResponse<TData>;
  } catch {
    throw new ApiError("Nao foi possivel ler a resposta da API.");
  }

  if (!response.ok || payload.errors?.length) {
    const error = payload.errors?.[0];
    throw new ApiError(
      error?.message ?? "Nao foi possivel concluir a operacao.",
      error?.extensions?.code,
    );
  }

  if (!payload.data) {
    throw new ApiError("A API retornou uma resposta vazia.");
  }

  return payload.data;
}

export function getBackendUrlLabel() {
  return getGraphQLEndpoint();
}
