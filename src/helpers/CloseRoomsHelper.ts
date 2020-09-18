import Room from '@models/Room'

export async function CloseRoomsHelper(): Promise<void> {
  const conditions = {
    open: true,
    updatedAt: {
      $lte: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
  }
  return Room.updateMany(conditions, {
    open: false,
  })
}
