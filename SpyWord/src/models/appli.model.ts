export interface UserInfos {
  name:string|null,
  isConnect:boolean,
}

export interface WindowInfos {
  width:number,
  height:number
}
export type AlertType= 'warning' | 'error' | 'success' |'info'