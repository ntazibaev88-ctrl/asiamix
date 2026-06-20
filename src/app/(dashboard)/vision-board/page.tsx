'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useT } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/topbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'
import { Plus, Upload, Trash2, Edit2, ImageIcon } from 'lucide-react'
import type { VisionBoardItem } from '@/types'

export default function VisionBoardPage() {
  const t = useT()
  const supabase = createClient()
  const [items, setItems] = useState<VisionBoardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<VisionBoardItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('vision_board_items').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const { data: user } = await supabase.auth.getUser()
    const path = `${user.user?.id}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('vision-board').upload(path, file)
    if (error) {
      toast.error('Суретті жүктеу мүмкін болмады')
    } else {
      const { data: urlData } = supabase.storage.from('vision-board').getPublicUrl(path)
      setImageUrl(urlData.publicUrl)
    }
    setUploading(false)
  }

  const openCreate = () => {
    setEditItem(null); setImageUrl(''); setTitle(''); setDesc('')
    setModalOpen(true)
  }

  const openEdit = (item: VisionBoardItem) => {
    setEditItem(item); setImageUrl(item.image_url); setTitle(item.title ?? ''); setDesc(item.description ?? '')
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!imageUrl) { toast.error('Суретті жүктеңіз'); return }
    setSaving(true)
    const payload = { image_url: imageUrl, title: title || null, description: desc || null, position_x: 0, position_y: 0 }
    const { error } = editItem
      ? await supabase.from('vision_board_items').update(payload).eq('id', editItem.id)
      : await supabase.from('vision_board_items').insert(payload)
    if (error) toast.error(error.message)
    else { toast.success('Сурет сақталды'); setModalOpen(false); load() }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await supabase.from('vision_board_items').delete().eq('id', deleteId)
    toast.success('Сурет жойылды'); setDeleteId(null); load()
  }

  return (
    <div>
      <TopBar title={t.visionBoard.title} />

      <div className="mt-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Арманыңызды суреттермен бейнелеңіз
          </p>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            {t.visionBoard.addImage}
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <ImageIcon className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 font-medium mb-2">{t.visionBoard.noImages}</p>
            <p className="text-sm text-zinc-400 mb-6">{t.visionBoard.startDreaming}</p>
            <Button onClick={openCreate}>
              <Upload className="w-4 h-4" />
              {t.visionBoard.uploadImage}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 cursor-pointer">
                <img
                  src={item.image_url}
                  alt={item.title ?? ''}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {item.title && (
                  <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-sm font-medium truncate">{item.title}</p>
                    {item.description && (
                      <p className="text-white/70 text-xs truncate">{item.description}</p>
                    )}
                  </div>
                )}
                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(item)}
                    className="w-8 h-8 rounded-lg bg-white/90 text-zinc-700 hover:bg-white flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="w-8 h-8 rounded-lg bg-red-500/90 text-white hover:bg-red-500 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add button */}
            <button
              onClick={openCreate}
              className="aspect-square rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-2 text-zinc-400 hover:border-amber-400 hover:text-amber-500 transition-colors"
            >
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">Қосу</span>
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Суретті өзгерту' : t.visionBoard.addImage} size="md">
        <div className="px-6 pb-6 space-y-4">
          {/* Image upload */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">Сурет</label>
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="preview" className="w-full h-48 object-cover rounded-xl" />
                <button
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full h-48 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center gap-3 text-zinc-400 hover:border-amber-400 hover:text-amber-500 transition-colors disabled:opacity-50"
              >
                <Upload className="w-8 h-8" />
                <span className="text-sm">{uploading ? 'Жүктелуде...' : 'Суретті таңдаңыз'}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">Тақырып</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Арманыңыздың атауы..."
              className="w-full h-10 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">Сипаттама</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handleSave} loading={saving}>{t.common.save}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Суретті жою" size="sm">
        <div className="px-6 pb-6">
          <p className="text-sm text-zinc-500 mb-6">Бұл суретті жойғыңыз келе ме?</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>{t.common.cancel}</Button>
            <Button variant="danger" onClick={handleDelete}>{t.common.delete}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
