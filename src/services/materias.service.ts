import { Materia } from '@/types'
import { BaseService } from './base.service'

export class MateriasService extends BaseService {
  static async getMaterias(): Promise<Materia[]> {
    const service = new MateriasService()
    return service.get<Materia[]>('/materias')
  }
}
