import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { RegisterPage } from './pages/RegisterPage'
import { AuthGuard } from './components/AuthGuard'
import { PostsLatest } from './pages/PostsLatest'
import { CreatePostPage } from './pages/CreatePostPage'
import { UserPostsPage } from './pages/UserPostsPage'
import { EditPostPage } from './pages/EditPostPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, //1 minute
      gcTime: 1000 * 60 * 60 //1 hour cache/garbage collection time, time until data is garbage collected default
    }
  }
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
        <AuthGuard>
          <HomePage />
        </AuthGuard>
        ),
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/posts/latest',
        element: (
          <AuthGuard>
            <PostsLatest />
          </AuthGuard>
        )
      },
      {
        path: '/posts/new',
        element: (
          <AuthGuard>
            <CreatePostPage />
          </AuthGuard>
        )
      },
      {
        path: '/posts/my',
        element: (
            <AuthGuard>
                <UserPostsPage />
            </AuthGuard>
        )
    },
    {
        path: '/posts/:id/edit',
        element: (
            <AuthGuard>
                <EditPostPage />
            </AuthGuard>
        )
    }
      // {
      //   path: '/posts/new',
      //   element: <CreatePostPage/>
      // },
      // {
      //   path: '/posts/:id/edit',
      //   element: <EditPostPage />,
      // },
      // {
      //   path: '/tags',
      //   element: <TagsPage />
      // },
    ],
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
)
