export default {
  newMessageNotificationWehHook:
    process.env.SERVICE_API_WEBHOOK_NOTIFICATION || '',
  baseUrl: process.env.SERVICE_API_BASE_URL || '',
}
