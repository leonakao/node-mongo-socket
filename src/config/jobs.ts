import cron from 'node-cron'
import { Job } from '../protocols'
import * as AllJobsObject from '../jobs'

const Jobs: Job[] = Object.keys(AllJobsObject).map(
  key => new AllJobsObject[key](),
)

export default function (): void {
  cron.schedule('*/1 * * * *', () => {
    Jobs.forEach(JobHandler => {
      JobHandler.handle()
    })
  })
}
