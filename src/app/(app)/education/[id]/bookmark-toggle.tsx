'use client'

import { useState } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Props {
  articleId: string
  userId: string
  isBookmarked: boolean
}

export function BookmarkToggle({ articleId, userId, isBookmarked: init }: Props) {
  const [bookmarked, setBookmarked] = useState(init)

  async function toggle() {
    const supabase = createClient()
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', userId).eq('article_id', articleId)
      setBookmarked(false)
      toast.success('Закладка удалена')
    } else {
      await supabase.from('bookmarks').insert({ user_id: userId, article_id: articleId })
      setBookmarked(true)
      toast.success('Добавлено в закладки')
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} className={bookmarked ? 'text-[var(--accent)]' : ''}>
      {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
      {bookmarked ? 'В закладках' : 'В закладки'}
    </Button>
  )
}
