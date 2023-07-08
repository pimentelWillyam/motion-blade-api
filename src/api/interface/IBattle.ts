import IServant from './IServant'

interface IBattle {
  id: string
  map: number[][]
  participants: IServant[]
}

export default IBattle