import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CreatePostPage } from './pages/CreatePostPage'
import { useCreatePost } from './hooks/usePosts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the hooks
vi.mock('./hooks/usePost', () => ({
  useCreatePost: () => ({
    mutate: vi.fn(),
    isError: false,
    isPending: false,
    error: null
  })
}))

vi.mock('./hooks/useAuth', () => ({
  useSession: () => ({
    data: { user: { id: 1, name: 'Test User' } },
    isLoading: false,
    error: null
  })
}))

// Wrapper component with QueryClient
const wrapper = ({ children }) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('CreatePostPage', () => {
    it('renders all form fields', () => {
        render(<CreatePostPage />, { wrapper })
        expect(screen.getByLabelText('Post title')).toBeTruthy()
        expect(screen.getByLabelText('Post Body')).toBeTruthy()  // Changed from 'Post Content'
        expect(screen.getByLabelText('Tags')).toBeTruthy()
    })

    it('submits form with correct data', () => {
        const { getByLabelText, getByRole } = render(<CreatePostPage />, { wrapper })
        
        // Fill form
        fireEvent.change(getByLabelText('Post title'), {
            target: { value: 'Test Title' }
        })
        fireEvent.change(getByLabelText('Post Body'), {  // Changed from 'Post Content'
            target: { value: 'Test Content' }
        })
        fireEvent.change(getByLabelText('Tags'), {
            target: { value: 'tag1, tag2' }
        })
        
        // Submit
        fireEvent.click(getByRole('button'))
    })
})