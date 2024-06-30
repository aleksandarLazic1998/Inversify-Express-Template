declare global {
  namespace NodeJS {
    interface IProcessEnv {
      NODE_ENV: string
      PORT: string
    }
  }
}

export {}
