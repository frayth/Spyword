import { Subscription, Transmit } from '@adonisjs/transmit-client'

let subscription :null |Subscription = null
export  const transmit = new Transmit({
  baseUrl: 'http://maison.laurisceresoli.fr:5003',
 uidGenerator: () => { return Math.random().toString(36).substring(2,9) }
})

export async function JoinChanel(id:number){
  if(subscription !== null){
   await subscription.delete()
  }
  subscription=transmit.subscription(`game/${id}`)
  await subscription.create()

  subscription.onMessage((message)=>{
    console.log(message)
  })
}


