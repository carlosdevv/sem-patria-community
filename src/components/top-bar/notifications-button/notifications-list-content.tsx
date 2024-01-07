'use client'
import DetailsModal from '@/components/modals/details-modal'
import DetailsModalContent from '@/components/modals/details-modal/details-modal-content'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotifications } from '@/hooks/notifications/use-notifications'
import { type Category, type Course } from '@prisma/client'
import { formatDistance, subDays } from 'date-fns'
import { useMemo, useState } from 'react'

type NotificationTypes = 'course' | 'category'

export type NotificationProps = {
  type: NotificationTypes
  courseProps?: Course
  categoryProps?: Category
}

const NotificationsListContent = () => {
  const { notifications, isLoadingNotifications } = useNotifications()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationProps>()

  const formattedCourses = useMemo(() => {
    if (!notifications) return []
    return notifications?.courses.map(course => ({
      ...course,
      type: 'course'
    }))
  }, [notifications])

  const formattedCategories = useMemo(() => {
    if (!notifications) return []
    return notifications?.categories.map(category => ({
      ...category,
      type: 'category'
    }))
  }, [notifications])

  const allNotifications = useMemo(() => {
    if (!notifications) return []

    return [...formattedCourses, ...formattedCategories]
  }, [formattedCategories, formattedCourses, notifications])

  const onSelectNotification = (id: string, type: NotificationTypes) => {
    if (type === 'course') {
      const selectedCourse = formattedCourses.find(course => course.id === id)
      const props = {
        type,
        courseProps: selectedCourse
      }

      setSelectedNotification(props)
    }

    if (type === 'category') {
      const selectedCategory = formattedCategories.find(
        category => category.id === id
      )
      const props = {
        type,
        categoryProps: selectedCategory
      }
      setSelectedNotification(props)
    }

    setIsOpen(true)
  }

  if (isLoadingNotifications) {
    return (
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Skeleton className="w-full h-[20px] rounded-md" />
          <Skeleton className="w-full h-[20px] rounded-md" />
          <Skeleton className="w-full h-[20px] rounded-md" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <DetailsModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <DetailsModalContent content={selectedNotification} />
      </DetailsModal>
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            {allNotifications.length} Content Pending Approval
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-6">
          {allNotifications.map(notification => (
            <div
              key={notification.id}
              className="grid grid-cols-[25px_1fr_0.5fr] items-start last:mb-0 last:pb-0"
            >
              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {notification.name.charAt(0).toUpperCase() +
                    notification.name.slice(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDistance(
                    subDays(new Date(notification.createdAt), 0),
                    new Date(),
                    { addSuffix: true }
                  )}
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  onSelectNotification(
                    notification.id,
                    notification.type as NotificationTypes
                  )
                }}
              >
                Review
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  )
}

export default NotificationsListContent
