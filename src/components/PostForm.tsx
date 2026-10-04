import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'

type PostFormProps = {
  onSaved: () => void
  onClose: () => void
}

// Supabase posts 테이블의 insert 정책과 같은 길이 제한
const TITLE_MAX = 100
const AUTHOR_MAX = 30
const CONTENT_MAX = 5000

function PostForm({ onSaved, onClose }: PostFormProps) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    setSavedMessage(null)

    // 공백만 넣은 칸도 빈 칸으로 본다
    const newPost = { title: title.trim(), author: author.trim(), content: content.trim() }
    const emptyFields = [
      !newPost.title && '제목',
      !newPost.author && '닉네임',
      !newPost.content && '내용',
    ].filter((name): name is string => Boolean(name))

    if (emptyFields.length > 0) {
      setErrorMessage(`${emptyFields.join(', ')} 칸이 비어 있습니다.`)
      return
    }

    setSaving(true)
    setErrorMessage(null)
    const { error } = await supabase.from('posts').insert(newPost)
    setSaving(false)

    if (error) {
      setErrorMessage(`글을 저장하지 못했습니다: ${error.message}`)
      return
    }

    setTitle('')
    setAuthor('')
    setContent('')
    setSavedMessage('글을 저장했습니다.')
    onSaved()
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <h2 className="form-heading">새 글 쓰기</h2>
      <label className="form-field">
        <span className="form-label">제목</span>
        <input
          type="text"
          value={title}
          maxLength={TITLE_MAX}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <label className="form-field">
        <span className="form-label">닉네임</span>
        <input
          type="text"
          value={author}
          maxLength={AUTHOR_MAX}
          onChange={(event) => setAuthor(event.target.value)}
        />
      </label>
      <label className="form-field">
        <span className="form-label">내용</span>
        <textarea
          value={content}
          maxLength={CONTENT_MAX}
          rows={10}
          onChange={(event) => setContent(event.target.value)}
        />
      </label>
      {errorMessage && (
        <p className="form-message form-error" role="alert">
          {errorMessage}
        </p>
      )}
      {savedMessage && (
        <p className="form-message" role="status">
          {savedMessage}
        </p>
      )}
      <div className="form-actions">
        <button type="submit" className="save-button" disabled={saving}>
          {saving ? '저장하는 중...' : '저장'}
        </button>
        <button type="button" className="back-button" onClick={onClose}>
          닫기
        </button>
      </div>
    </form>
  )
}

export default PostForm
