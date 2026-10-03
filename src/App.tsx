import { useState } from 'react'
import PostList from './components/PostList'
import PostDetail from './components/PostDetail'
import { samplePosts } from './data/samplePosts'
import './App.css'

function App() {
  // null 이면 목록, 숫자면 그 id 의 글 상세를 보여준다
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selectedPost = samplePosts.find((post) => post.id === selectedId)

  return (
    <main>
      <header>
        <h1>책갈피 노트</h1>
        <p>읽은 책의 문장과 생각을 차곡차곡 모아두는 곳</p>
      </header>
      {selectedPost ? (
        <PostDetail post={selectedPost} onBack={() => setSelectedId(null)} />
      ) : (
        <PostList posts={samplePosts} onSelect={setSelectedId} />
      )}
    </main>
  )
}

export default App
