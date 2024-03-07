// Assuming you have these imports based on your provided code
import { GetServerSideProps } from 'next';
import { auth } from '@/auth';
import { getChat } from '@/app/actions';
import Chat from '@/components/chat';

// ChatPage component definition remains mostly unchanged but is no longer async
const ChatPage = ({ id, initialMessages }) => {
  return <Chat id={id} initialMessages={initialMessages} />;
};

export default ChatPage;

// Define the getServerSideProps function for server-side data fetching
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    return {
      redirect: {
        destination: `/sign-in?next=/chat/${context.params.id}`,
        permanent: false,
      },
    };
  }

  const chat = await getChat(context.params.id, session.user.id);

  // Return 404 not found if the chat doesn't exist or the user doesn't have access
  if (!chat || chat?.userId !== session?.user?.id) {
    return {
      notFound: true,
    };
  }

  // Pass chat ID and messages as props to the page component
  return {
    props: {
      id: chat.id,
      initialMessages: chat.messages,
    },
  };
};
