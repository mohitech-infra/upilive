import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://gryucxlpgebaeqxagyoa.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyeXVjeGxwZ2ViYWVxeGFneW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2MTE0MTUsImV4cCI6MjA4ODE4NzQxNX0.ZN2HglJeF41WQYntCr7ZR0dT97GH9MNR0Uqd1P1g8aw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { params: { eventsPerSecond: 10 } }
})

export type UserProfile = {
  id: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
  plan_id: string
  plan_expires_at: string | null
  overlay_token: string
  referral_code: string
  referred_by: string | null
  upi_id: string | null
  is_live: boolean
  is_admin: boolean
  is_blocked: boolean
  created_at: string
  tts_enabled?: boolean
  tts_voice?: string
}

export type Plan = {
  id: string
  name: string
  price: number
  period: string
  alerts_per_day: number | null
  templates_count: number
  template_names: string
  color: string
  badge: string | null
}

export type Transaction = {
  id: string
  user_id: string
  overlay_token: string
  donor_name: string
  amount: number
  source: string
  message: string | null
  triggered_at: string
}

export type Template = {
  id: string
  name: string
  description: string | null
  preview_url: string | null
  animation_type: string
  plan_required: string
  is_active: boolean
  sort_order: number
}

export type PaymentScanner = {
  id: string
  name: string
  upi_id: string
  qr_image_url: string
  is_active: boolean
  created_at: string
}

export type PlanPurchase = {
  id: string
  user_id: string
  plan_id: string
  scanner_id: string | null
  amount: number
  utr_number: string
  payment_screenshot_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_note: string | null
  created_at: string
  processed_at: string | null
}

export type Referral = {
  id: string
  referrer_id: string
  referee_id: string
  plan_id: string | null
  commission_amount: number
  status: 'pending' | 'approved' | 'paid'
  created_at: string
  paid_at: string | null
}

export type WithdrawalRequest = {
  id: string
  user_id: string
  amount: number
  upi_id: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  admin_note: string | null
  created_at: string
  processed_at: string | null
}
