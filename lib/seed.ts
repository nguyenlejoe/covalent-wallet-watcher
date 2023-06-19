import { sql } from '@vercel/postgres'

export async function seed() {
  const createTable = await sql`
    CREATE TABLE latest_transaction (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMP
    )
    `

  return {
    createTable
  }
}
