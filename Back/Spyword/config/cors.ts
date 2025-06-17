import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,
  origin: [
    'http://maison.laurisceresoli.fr',
    'http://www.spyword.laurisceresoli.fr',
    'http://spyword.laurisceresoli.fr',
    'https://spyword.laurisceresoli.fr',
    'https://www.spyword.laurisceresoli.fr',
    'http://localhost:5173',
  ],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
