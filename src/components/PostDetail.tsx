import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Post } from '../data/samplePosts'
import { supabase } from '../lib/supabase'
import { getDateParts, splitLeadingQuote } from '../utils/post'

type PostDetailProps = {
  post: Post
  onBack: () => void
  onDeleted: () => void
}

function PostDetail({ post, onBack, onDeleted }: PostDetailProps) {
  const [password, setPassword] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleDelete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (deleting) return
    if (!password) {
      setErrorMessage('글을 쓸 때 정한 비밀번호를 넣어 주세요.')
      return
    }
    if (!window.confirm(`"${post.title}" 글을 지울까요? 지운 글은 되돌릴 수 없습니다.`)) return

    setDeleting(true)
    setErrorMessage(null)
    // 비밀번호가 맞을 때만 Supabase 의 delete_post 함수가 글을 지우고 true 를 돌려준다
    const { data, error } = await supabase.rpc('delete_post', { p_id: post.id, p_password: password })
    setDeleting(false)

    if (error) {
      setErrorMessage(`글을 지우지 못했습니다: ${error.message}`)
      return
    }
    if (data !== true) {
      setErrorMessage('비밀번호가 맞지 않습니다.')
      return
    }
    onDeleted()
  }

  const { year, monthDay } = getDateParts(post.created_at)
  const { quote, body } = splitLeadingQuote(post.content)
  // 빈 줄로 문단을 나누고, 문단 안의 줄바꿈은 <br /> 로 살린다
  const paragraphs = body.split(/\n\s*\n/).filter((paragraph) => paragraph.trim() !== '')

  return (
    <article className="post-detail">
      <button type="button" className="back-button" onClick={onBack}>
        목록으로
      </button>
      <h2 className="detail-title">{post.title}</h2>
      <p className="detail-byline">
        <time dateTime={post.created_at}>
          {year} {monthDay}
        </time>
        <br />
        {post.author} 씀
      </p>
      {quote && (
        <blockquote className="detail-quote">
          <p>
            <span className="underline">“{quote}”</span>
          </p>
        </blockquote>
      )}
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="detail-paragraph">
          {paragraph.split('\n').map((line, lineIndex) => (
            <span key={lineIndex}>
              {lineIndex > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      ))}
      <form className="detail-actions" onSubmit={handleDelete}>
        <label className="form-field">
          <span className="form-label">이 글을 지우려면 비밀번호를 넣으세요</span>
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit" className="delete-button" disabled={deleting}>
          {deleting ? '지우는 중...' : '이 글 지우기'}
        </button>
        {errorMessage && (
          <p className="form-message form-error" role="alert">
            {errorMessage}
          </p>
        )}
      </form>
    </article>
  )
}

export default PostDetail
