interface IServant {
  id: string
  masterId: string
  name: string
  profession: string
  seniority: number
  atributes: Atributes
  isInBattle: boolean
  battlePosition: [number, number]
  

}

export default IServant