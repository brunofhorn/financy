const graphqlEndpoint = "/graphql";

export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Financy Backend API",
    version: "1.0.0",
    description:
      "Documentacao OpenAPI para a API GraphQL de financas. Use os exemplos de payload para executar as operacoes no endpoint /graphql.",
  },
  servers: [{ url: "http://localhost:3333" }],
  tags: [
    { name: "Infra", description: "Status da aplicacao" },
    { name: "GraphQL", description: "Operacoes via endpoint GraphQL unico" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      GraphQLRequest: {
        type: "object",
        required: ["query"],
        properties: {
          query: { type: "string" },
          variables: {
            type: "object",
            additionalProperties: true,
          },
          operationName: { type: "string", nullable: true },
        },
      },
      GraphQLResponse: {
        type: "object",
        properties: {
          data: { type: "object", additionalProperties: true },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Infra"],
        summary: "Healthcheck da API",
        responses: {
          "200": {
            description: "API online",
            content: {
              "application/json": {
                example: { ok: true },
              },
            },
          },
        },
      },
    },
    [graphqlEndpoint]: {
      post: {
        tags: ["GraphQL"],
        summary: "Endpoint unico do GraphQL",
        description:
          "Execute queries e mutations enviando um payload GraphQL em JSON. Quando a operacao exige autenticacao, envie o token JWT no header Authorization.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/GraphQLRequest" },
              examples: {
                register: {
                  summary: "Cadastro",
                  value: {
                    query:
                      "mutation Register($input: RegisterInput!) { register(input: $input) { token user { id name email } } }",
                    variables: {
                      input: {
                        name: "Ana Silva",
                        email: "ana@email.com",
                        password: "123456",
                      },
                    },
                    operationName: "Register",
                  },
                },
                login: {
                  summary: "Login",
                  value: {
                    query:
                      "mutation Login($input: LoginInput!) { login(input: $input) { token user { id name email } } }",
                    variables: {
                      input: {
                        email: "ana@email.com",
                        password: "123456",
                      },
                    },
                    operationName: "Login",
                  },
                },
                listCategories: {
                  summary: "Listar categorias",
                  value: {
                    query:
                      "query Categories { categories { id name description createdAt updatedAt } }",
                    operationName: "Categories",
                  },
                },
                createCategory: {
                  summary: "Criar categoria",
                  value: {
                    query:
                      "mutation CreateCategory($input: CreateCategoryInput!) { createCategory(input: $input) { id name description } }",
                    variables: {
                      input: {
                        name: "Alimentacao",
                        description: "Gastos com comida",
                      },
                    },
                    operationName: "CreateCategory",
                  },
                },
                listTransactions: {
                  summary: "Listar transacoes",
                  value: {
                    query:
                      "query Transactions { transactions { id title amount type date notes category { id name } } }",
                    operationName: "Transactions",
                  },
                },
                createTransaction: {
                  summary: "Criar transacao",
                  value: {
                    query:
                      "mutation CreateTransaction($input: CreateTransactionInput!) { createTransaction(input: $input) { id title amount type date } }",
                    variables: {
                      input: {
                        title: "Mercado",
                        amount: 120.5,
                        type: "EXPENSE",
                        date: "2026-04-29T10:00:00.000Z",
                        notes: "Compra semanal",
                        categoryId: "cm1234567890abcdef123456",
                      },
                    },
                    operationName: "CreateTransaction",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Resposta GraphQL",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GraphQLResponse" },
              },
            },
          },
        },
      },
    },
  },
} as const;
