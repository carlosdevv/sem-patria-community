import prismadb from '@/lib/prismadb'
import { User } from '@clerk/nextjs/server'

export const createUserInDB = async (user: User) => {
  const whiteList = process.env.USERS_WHITELIST?.split(',')

  try {
    const existsUser = await prismadb.user.findUnique({
      where: {
        id: user.id
      }
    })

    if (existsUser) return

    const newUser = await prismadb.user.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName + ' ' + user.lastName,
        username: user.username || '',
        isAdmin: (user.username && whiteList?.includes(user.username)) || false
      }
    })

    if (!newUser)
      throw new Error('Something went wrong while creating the user')

    return
  } catch (error) {
    console.error(error)
    throw new Error('Something went wrong ')
  }
}
