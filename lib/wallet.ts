"use server"
import { sql } from '@vercel/postgres'

export async function AddWallet(address: string) {
  const addWallet = await sql`
        INSERT INTO wallets (address, created_at)
        VALUES (${address}, CURRENT_TIMESTAMP);
    `

  return {
    addWallet
  }
}

export async function GetWallets() {
    const wallets = await sql`
          SELECT * FROM wallets
      `
    return {
        wallets
    }
}

export async function DeleteWallet(id: string) {
    const wallets = await sql`
        DELETE FROM wallets
        WHERE id = ${id}
      `
    return {
        wallets
    }
}
  
export async function GetLatestTransaction() {
  const latest_transaction = await sql`
      SELECT * FROM latest_transaction
    `
  return {
    latest_transaction
  }
}

  
export async function CreateTransaction(time: any) {
  const latest_transaction = await sql`
    INSERT INTO latest_transaction (created_at)
    VALUES (${time});
    `
  return {
    latest_transaction
  }
}


export async function EditTransaction(time: any) {
  const latest_transaction = await sql`
      UPDATE latest_transaction
      SET created_at = ${time}
      WHERE id = 1;
  
    `
  return {
    latest_transaction
  }
}