declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development'
    BOT_TOKEN: string
    DEV_SERVER?: string
  }
}
