import type { HttpContext } from '@adonisjs/core/http'
import path from 'node:path'
import fs from 'node:fs'
export default class ImagesController {
  async show({ response, params }: HttpContext) {
    const imageName = params.name
    const folderName = params.folder
    const imagePath = `${process.cwd()}/public/images/${folderName}/${imageName}`
    console.log('salut', imagePath)
    if (fs.existsSync(imagePath)) {
      response.download(path.resolve(imagePath))
    } else {
      response.status(404).send({ error: 'image not found' })
    }
  }
}
