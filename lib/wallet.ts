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
  