// app/chat/[id]/page.tsx
import { Chat } from '@/components/chat';
import { fetchChat } from '@/app/actions';

// Define a loader function for server-side data fetching
export async function loader({ params }) {
  const { id } = params;
  const session = await auth(); // Ensure your auth function can be called here

  if (!session?.user) {
    // Redirect if not authenticated
    throw new Response("Unauthorized", { status: 401, headers: { Location: '/sign-in' } });
  }

  const chat = await fetchChat(id, session.user.id);

  if (!chat) {
    // Handle chat not found or no access
    throw new Response("Not Found", { status: 404 });
  }

  return { 
    id: chat.id, 
    initialMessages: chat.messages,
  };
}

export default function ChatPage({ data }) {
  return <Chat id={data.id} initialMessages={data.initialMessages} />;
}
