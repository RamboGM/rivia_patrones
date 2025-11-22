import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Spinner, Center } from '@chakra-ui/react';
import Home from './pages/Home.jsx';
import EditorTapestry from './pages/EditorTapestry.jsx';
import EditorCrochet from './pages/EditorCrochet.jsx';
import MyAccount from './pages/MyAccount.jsx';
import useUserStore from './store/useUserStore.js';
import { getCurrentUser } from './api/auth.js';

function App() {
  const { setUser, clearUser, loading, setLoading } = useUserStore();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const current = await getCurrentUser();
        if (current) {
          setUser(current);
        } else {
          clearUser();
        }
      } catch (err) {
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [setUser, clearUser, setLoading]);

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
    <BrowserRouter>
      <Box minH="100vh">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Navigate to="/editor/tapestry" replace />} />
          <Route path="/editor/tapestry" element={<EditorTapestry />} />
          <Route path="/editor/crochet" element={<EditorCrochet />} />
          <Route path="/cuenta" element={<MyAccount />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
