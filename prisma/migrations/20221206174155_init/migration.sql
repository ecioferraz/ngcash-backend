-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accounts" (
    "id" TEXT NOT NULL,
    "balance" DECIMAL(9,2) NOT NULL DEFAULT 100,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "credited_account_id" TEXT NOT NULL,
    "debited_account_id" TEXT NOT NULL,
    "value" DECIMAL(9,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_account_id_key" ON "Users"("account_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_credited_account_id_fkey" FOREIGN KEY ("credited_account_id") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_debited_account_id_fkey" FOREIGN KEY ("debited_account_id") REFERENCES "Accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
