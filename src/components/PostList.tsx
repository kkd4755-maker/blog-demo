import type { Post } from '../data/samplePosts'
import { getDateParts, splitLeadingQuote } from '../utils/post'

type PostListProps = {
  posts: Post[]
  onSelect: (id: number) => void
}

const PREVIEW_LENGTH = 50

function getPreview(content: string): string {
  const text = content.replace(/\s+/g, ' ').trim()
  return text.length > PREVIEW_LENGTH ? `${text.slice(0, PREVIEW_LENGTH)}…` : text
}

function PostList({ posts, onSelect }: PostListProps) {
  return (
    <ul className="post-list">
      {posts.map((post) => {
        const { year, monthDay } = getDateParts(post.created_at)
        const { quote, body } = splitLeadingQuote(post.content)

        return (
          <li key={post.id} className="post-item">
            <h2 className="post-title">
              <button type="button" onClick={() => onSelect(post.id)}>
                {post.title}
              </button>
            </h2>
            <time className="post-date" dateTime={post.created_at}>
              <span className="post-year">{year}</span> <span className="post-day">{monthDay}</span>
            </time>
            {quote && (
              <p className="post-quote">
                <span className="underline">“{quote}”</span>
              </p>
            )}
            <p className="post-preview">{getPreview(body)}</p>
            <p className="post-byline">{post.author} 씀</p>
          </li>
        )
      })}
    </ul>
  )
}

export default PostList
