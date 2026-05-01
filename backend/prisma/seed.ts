import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Prisma, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

const seedUser = {
  name: "Usuario Demo",
  email: "demo@financy.local",
  password: "123456",
};

async function main() {
  const passwordHash = await bcrypt.hash(seedUser.password, 10);

  const user = await prisma.user.upsert({
    where: { email: seedUser.email },
    update: {
      name: seedUser.name,
      passwordHash,
    },
    create: {
      name: seedUser.name,
      email: seedUser.email,
      passwordHash,
    },
  });

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });

  const categoriesData = [
    {
      name: "Salario",
      description: "Entradas recorrentes",
      icon: "briefcase",
      color: "#1F6E43",
    },
    {
      name: "Freelance",
      description: "Projetos extras",
      icon: "wallet",
      color: "#16A34A",
    },
    {
      name: "Moradia",
      description: "Aluguel e contas da casa",
      icon: "home",
      color: "#CA8A04",
    },
    {
      name: "Alimentacao",
      description: "Mercado e refeicoes",
      icon: "utensils",
      color: "#2563EB",
    },
    {
      name: "Transporte",
      description: "Combustivel e aplicativos",
      icon: "car",
      color: "#9333EA",
    },
    {
      name: "Lazer",
      description: "Cinema, streaming e passeios",
      icon: "gift",
      color: "#DB2777",
    },
  ];

  const createdCategories = await Promise.all(
    categoriesData.map((category) =>
      prisma.category.create({
        data: {
          ...category,
          userId: user.id,
        },
      }),
    ),
  );

  const categoryByName = new Map(
    createdCategories.map((category) => [category.name, category.id]),
  );

  const transactionsData: Array<{
    title: string;
    amount: number;
    type: TransactionType;
    date: string;
    notes?: string;
    categoryName: string;
  }> = [
    {
      title: "Salario mensal",
      amount: 5200,
      type: "INCOME",
      date: "2026-04-05T11:00:00.000Z",
      notes: "Pagamento empresa",
      categoryName: "Salario",
    },
    {
      title: "Projeto landing page",
      amount: 1400,
      type: "INCOME",
      date: "2026-04-12T16:00:00.000Z",
      notes: "Freela cliente A",
      categoryName: "Freelance",
    },
    {
      title: "Aluguel apartamento",
      amount: 1800,
      type: "EXPENSE",
      date: "2026-04-06T14:00:00.000Z",
      notes: "Pagamento via pix",
      categoryName: "Moradia",
    },
    {
      title: "Compra de mercado",
      amount: 430.75,
      type: "EXPENSE",
      date: "2026-04-10T18:30:00.000Z",
      categoryName: "Alimentacao",
    },
    {
      title: "Restaurante",
      amount: 92.4,
      type: "EXPENSE",
      date: "2026-04-17T22:00:00.000Z",
      categoryName: "Alimentacao",
    },
    {
      title: "Combustivel",
      amount: 250,
      type: "EXPENSE",
      date: "2026-04-15T13:00:00.000Z",
      categoryName: "Transporte",
    },
    {
      title: "Cinema",
      amount: 64,
      type: "EXPENSE",
      date: "2026-04-20T20:30:00.000Z",
      categoryName: "Lazer",
    },
    {
      title: "Assinatura streaming",
      amount: 39.9,
      type: "EXPENSE",
      date: "2026-04-25T09:00:00.000Z",
      categoryName: "Lazer",
    },
  ];

  await prisma.transaction.createMany({
    data: transactionsData.map((transaction) => ({
      title: transaction.title,
      amount: new Prisma.Decimal(transaction.amount),
      type: transaction.type,
      date: new Date(transaction.date),
      notes: transaction.notes ?? null,
      userId: user.id,
      categoryId: categoryByName.get(transaction.categoryName) ?? null,
    })),
  });

  const totalIncomes = transactionsData
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenses = transactionsData
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  console.log("Seed finalizado com sucesso.");
  console.log(`Login: ${seedUser.email} / ${seedUser.password}`);
  console.log(`Categorias criadas: ${createdCategories.length}`);
  console.log(`Transacoes criadas: ${transactionsData.length}`);
  console.log(
    `Resumo: entradas ${formatCurrency(totalIncomes)} | saidas ${formatCurrency(totalExpenses)} | saldo ${formatCurrency(totalIncomes - totalExpenses)}`,
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
