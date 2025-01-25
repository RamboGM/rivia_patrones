import React, { useState, useEffect, useRef } from 'react';
import { ChakraProvider, Box, Button, Text, VStack, Image, extendTheme } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import logo from './assets/logo_rivia.png';
import './App.css';
import backgroundImage from './assets/background_01.png';

const MotionBox = motion(Box);

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

function App() {
  const [showTextAndButtons, setShowTextAndButtons] = useState(false);
  const [logoPosition, setLogoPosition] = useState(false);
  const [showHeaderButtons, setShowHeaderButtons] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const loginPromptRef = useRef(null);

  useEffect(() => {
    const checkElementsAndAnimate = () => {
      const logoContainer = document.querySelector(".logo-container");
      if (logoContainer) {
        const logoTimer = setTimeout(() => {
          setLogoPosition(true);
        }, 3000);

        const headerTimer = setTimeout(() => {
          setShowHeaderButtons(true);
          setShowTextAndButtons(true);
        }, 4000);

        return () => {
          clearTimeout(logoTimer);
          clearTimeout(headerTimer);
        };
      }
    };
    checkElementsAndAnimate();
  }, []);

  const handleOptionClick = () => {
    setShowTextAndButtons(false);
    setShowLoginPrompt(true);
  };

  // Maneja el clic fuera de la ventana de login para cerrarla
  const handleClickOutside = (event) => {
    if (loginPromptRef.current && !loginPromptRef.current.contains(event.target)) {
      setShowLoginPrompt(false);
      setShowTextAndButtons(true);
    }
  };

  useEffect(() => {
    if (showLoginPrompt) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLoginPrompt]);

  return (
    <ChakraProvider theme={theme}>
      <Box
        className="app-container"
        position="relative"
        minH="100vh"
        style={{
          backgroundImage: `url(${backgroundImage})`, // Configuración del fondo
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {showHeaderButtons && (
          <Box as="header" position="absolute" top={4} right={4} display="flex" gap={4}>
            <Button colorScheme="pink">INICIAR SESIÓN</Button>
            <Button colorScheme="pink" variant="outline">REGISTRARSE</Button>
          </Box>
        )}

        <MotionBox
          className="logo-container"
          animate={logoPosition ? { y: -260, scale: 0.7 } : { y: 0, scale: 1 }}
          transition={{ duration: 1 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH="100vh"
        >
          <Image src={logo} alt="Logo Rivia" boxSize="200px" />
        </MotionBox>

        {showTextAndButtons && !showLoginPrompt && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            textAlign="center"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            <Text fontSize="2xl" mb={4}>¿Qué proyecto vas a tejer hoy?</Text>
            <Box display="flex" gap={4} justifyContent="center">
              <Button colorScheme="pink" onClick={handleOptionClick}>Crochet</Button>
              <Button colorScheme="pink" onClick={handleOptionClick}>Tapestry</Button>
            </Box>
          </MotionBox>
        )}

        {showLoginPrompt && (
          <MotionBox
            ref={loginPromptRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="rgba(255, 255, 255, 0.9)"
            p={6}
            borderRadius="md"
            shadow="lg"
            w="300px"
            textAlign="center"
          >
            <VStack spacing={4}>
              <Text fontSize="lg" fontWeight="bold">Inicia sesión para acceder a todas las funcionalidades</Text>
              <Button colorScheme="pink" size="md" width="full">Ingresar</Button>
              <Text fontSize="sm">¿No tenés cuenta?</Text>
              <Button colorScheme="pink" variant="outline" size="md" width="full">Registrarse</Button>
            </VStack>
          </MotionBox>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default App;
