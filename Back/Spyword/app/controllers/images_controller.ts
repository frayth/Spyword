import type { HttpContext } from '@adonisjs/core/http'
import path from 'node:path'
import fs from 'node:fs'
import { getNumberOfAvatars } from '#services/avatar/avatar'
export default class ImagesController {
  async show({ response, params }: HttpContext) {
    const baseURl = `${process.cwd()}`
    //process.env.node_env === 'development' ? `${process.cwd()}` : `${process.cwd()}`// /..
    console.log(baseURl)
    const imageName = params.name
    const folderName = params.folder
    const imagePath = `${baseURl}/public/images/${folderName}/${imageName}`
    console.log(imagePath)
    if (fs.existsSync(imagePath)) {
      response.download(path.resolve(imagePath))
    } else {
      response.status(404).send({ error: 'image not found' })
    }
  }

  async getNumbersOfAvatars({ response }: HttpContext) {
    const avatars = getNumberOfAvatars()
    response.status(200).send(avatars)
  }
}
