import "dotenv/config"
import "reflect-metadata"
import App from "./web/application"

const bootstrap = () => {
  new App()
}

bootstrap()
