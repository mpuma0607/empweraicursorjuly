"use server"

export async function generateGoalScreenWallpaper(monthlyIncome: number) {
  // Real estate calculation constants
  const AVG_COMMISSION = 9500
  const APPT_CONVERSION = 0.8
  const CONVERSATION_TO_APPT = 0.0008
  const ATTEMPTS_PER_CONVERSATION = 7
  const DAYS_PER_MONTH = 30

  // Calculate daily contacts needed
  const dealsNeeded = monthlyIncome / AVG_COMMISSION
  const appointmentsNeeded = dealsNeeded / APPT_CONVERSION
  const conversationsNeeded = appointmentsNeeded / CONVERSATION_TO_APPT
  const dailyContacts = Math.ceil((conversationsNeeded * ATTEMPTS_PER_CONVERSATION) / DAYS_PER_MONTH)

  return {
    success: true,
    data: {
      monthlyIncome,
      dealsNeeded: Math.ceil(dealsNeeded),
      appointmentsNeeded: Math.ceil(appointmentsNeeded),
      conversationsNeeded: Math.ceil(conversationsNeeded),
      dailyContacts,
    },
  }
}
