import { Job } from '../protocols'
import { CloseRoomsHelper } from '../helpers'

export class CloseRoomsJob implements Job {
  handle() {
    CloseRoomsHelper()
  }
}
