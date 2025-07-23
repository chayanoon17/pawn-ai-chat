// lib/api.ts
const BASE_URL = 'http://localhost:4000'

async function handleResponse(res: Response) {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  const json = await res.json()
  return json.data
}

export async function getGoldPriceInfo() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/gold-price/info`)
    return await handleResponse(res)
  } catch (error) {
    console.error('Fetch getGoldPriceInfo failed:', error)
    throw error
  }
}

export async function getGoldPriceHistory() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/gold-price/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await handleResponse(res)
  } catch (error) {
    console.error('Fetch getGoldPriceHistory failed:', error)
    throw error
  }
}

export async function getBranchDailyOperationSummary(branchId: number, date: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/branches/daily-operation/summary?branchId=${branchId}&date=${date}`)
    return await handleResponse(res)
  } catch (error) {
    console.error('Fetch getBranchDailyOperationSummary failed:', error)
    throw error
  }
}

export async function getBranchWeeklyOperationSummary(branchId: number, date: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/branches/weekly-operation/summary?branchId=${branchId}&date=${date}`)
    return await handleResponse(res)
  } catch (error) {
    console.error('Fetch getBranchWeeklyOperationSummary failed:', error)
    throw error
  }
}

export async function getTransactionDetailSummary(branchId: number, date: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/contracts/transactions/details?branchId=${branchId}&date=${date}`)
    return await handleResponse(res)
  } catch (error) {
    console.error('Fetch getTransactionSummary failed:', error)
    throw error
  }
}


export async function getTransactionSummary(branchId: number, date: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/contracts/transactions/summary?branchId=${branchId}&date=${date}`)
    return await handleResponse(res)
  } catch (error) {
    console.error('Fetch getTransactionSummary failed:', error)
    throw error
  }
}

export async function syncDailyOperations(date: string, branchIds: number[] = []) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/daily-operations/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, branchIds }),
    })
    return await handleResponse(res)
  } catch (error) {
    console.error('Fetch syncDailyOperations failed:', error)
    throw error
  }
}

export async function chatWithMetaAgent(chat_id: string, question: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/chat-with-meta-agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id, question }),
    })
    return await handleResponse(res)
  } catch (error) {
    console.error('Fetch chatWithMetaAgent failed:', error)
    throw error
  }
}
