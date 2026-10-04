import { useEffect, useState } from 'react'
import PostList from './components/PostList'
import PostDetail from './components/PostDetail'
import PostForm from './components/PostForm'
import type { Post } from './data/samplePosts'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // null 이면 목록, 숫자면 그 id 의 글 상세를 보여준다
  const [selectedId, setSelectedId] = useState<number | null>(null)
  // 목록 화면에서 글쓰기 폼을 펼쳤는지
  const [showForm, setShowForm] = useState(false)
  // 값이 바뀔 때마다 글 목록을 다시 불러온다
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    // 화면이 사라진 뒤에 도착한 응답은 무시한다
    let ignore = false

    async function loadPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, author, created_at')
        // 최신 글이 위로. 작성 시각이 같으면 나중에 들어간 글(id 가 큰 글)이 위로
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .overrideTypes<Post[], { merge: false }>()

      if (ignore) return
      if (error) {
        setErrorMessage(`글을 불러오지 못했습니다: ${error.message}`)
      } else {
        setErrorMessage(null)
        setPosts(data)
      }
      setLoading(false)
    }

    loadPosts()
    return () => {
      ignore = true
    }
  }, [reloadKey])

  const selectedPost = posts.find((post) => post.id === selectedId)

  let content
  if (selectedPost) {
    content = (
      <PostDetail
        post={selectedPost}
        onBack={() => setSelectedId(null)}
        onDeleted={() => {
          setSelectedId(null)
          setReloadKey((key) => key + 1)
        }}
      />
    )
  } else {
    let listContent
    if (loading) {
      listContent = <p className="status-message">불러오는 중...</p>
    } else if (errorMessage) {
      listContent = (
        <p className="status-message" role="alert">
          {errorMessage}
        </p>
      )
    } else if (posts.length === 0) {
      listContent = <p className="status-message">아직 글이 없습니다</p>
    } else {
      listContent = <PostList posts={posts} onSelect={setSelectedId} />
    }

    content = (
      <>
        {showForm ? (
          <PostForm
            onSaved={() => setReloadKey((key) => key + 1)}
            onClose={() => setShowForm(false)}
          />
        ) : (
          <button type="button" className="write-button" onClick={() => setShowForm(true)}>
            글쓰기
          </button>
        )}
        {listContent}
      </>
    )
  }

  return (
    <main>
      <header>
        <h1>책갈피 노트</h1>
        <p>읽은 책의 문장과 생각을 차곡차곡 모아두는 곳</p>
      </header>
      {content}
    </main>
  )
}

export default App
