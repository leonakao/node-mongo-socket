import { MessageDocument } from '@models/Message'
import { UserDocument } from '@models/User'
import ApiConfig from '@config/api'

export async function sendMessageNotification(
  message: MessageDocument,
  to: UserDocument,
): Promise<boolean> {
  const url = ApiConfig.newMessageNotificationWehHook

  // eslint-disable-next-line no-console
  console.log(
    `Sending a message notification (${message._id}) to ${to.name} using ${url}`,
  )

  return Promise.resolve(true)
}
