import { createClient } from '@supabase/supabase-js'

// 값은 .env.local 에서 읽는다. 코드에 직접 쓰지 않는다
const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL
const supabaseKey: string | undefined = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

const missing = [
  !supabaseUrl && 'VITE_SUPABASE_URL',
  !supabaseKey && 'VITE_SUPABASE_PUBLISHABLE_KEY',
].filter((name): name is string => Boolean(name))

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    `Supabase 환경 변수가 비어 있습니다: ${missing.join(', ')}. .env.local 에 값을 넣고 개발 서버를 다시 시작하세요.`,
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
