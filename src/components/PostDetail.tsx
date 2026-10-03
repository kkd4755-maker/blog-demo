import type { Post } from '../data/samplePosts'
import { getDateParts, splitLeadingQuote } from '../utils/post'

type PostDetailProps = {
  post: Post
  onBack: () => void
}

function PostDetail({ post, onBack }: PostDetailProps) {
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
    </article>
  )
}

export default PostDetail
