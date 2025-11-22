import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Image,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Divider,
  SimpleGrid,
  Badge,
  List,
  ListItem,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';
import backgroundImage from '../assets/background_01.png';
import logo from '../assets/logo_rivia.png';

const MotionBox = motion(Box);

const heroButtons = [
  { label: 'Crochet', action: 'crochet' },
  { label: 'Tapestry', action: 'tapestry' },
];

const translations = {
  es: {
    login: 'Iniciar sesión',
    register: 'Registrarse',
    heroTitle: '¿Qué proyecto vas a tejer hoy?',
    accessTitle: 'Accede o regístrate para continuar',
    email: 'Correo electrónico',
    password: 'Contraseña',
    continueEmail: 'Continuar con email',
    continueGoogle: 'Continuar con Google',
    planTitle: 'Elige tu plan',
    planNote: 'Puedes cambiar tu plan en cualquier momento',
    free: 'Free',
    premium: 'Premium',
    freeFeatures: ['Hasta 10 patrones', 'Grillas hasta 100x100', 'PDF con marca de agua'],
    premiumFeatures: [
      '30 días de prueba gratuita',
      'Patrones ilimitados',
      'Grillas hasta 300x300',
      'PDF sin marca de agua',
      'Organización avanzada',
    ],
    choosePlan: (plan) => `Elegir ${plan}`,
    premiumTrial: '30 días de prueba gratuita',
  },
  en: {
    login: 'Sign in',
    register: 'Sign up',
    heroTitle: 'What project will you weave today?',
    accessTitle: 'Sign in or create an account to continue',
    email: 'Email',
    password: 'Password',
    continueEmail: 'Continue with email',
    continueGoogle: 'Continue with Google',
    planTitle: 'Choose your plan',
    planNote: 'You can switch plans anytime',
    free: 'Free',
    premium: 'Premium',
    freeFeatures: ['Up to 10 patterns', 'Grids up to 100x100', 'PDF with watermark'],
    premiumFeatures: [
      '30-day free trial',
      'Unlimited patterns',
      'Grids up to 300x300',
      'Watermark-free PDF',
      'Advanced organization',
    ],
    choosePlan: (plan) => `Choose ${plan}`,
    premiumTrial: '30-day free trial',
  },
};

function Home() {
  const [showHeaderButtons, setShowHeaderButtons] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [selectedCraft, setSelectedCraft] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState('auth'); // auth | plans
  const [authMethod, setAuthMethod] = useState(null); // email | google
  const [form, setForm] = useState({ email: '', password: '' });
  const [lang, setLang] = useState('es');

  useEffect(() => {
    const locale = navigator.language || navigator.userLanguage || 'es';
    setLang(locale.toLowerCase().startsWith('es') ? 'es' : 'en');
  }, []);

  const t = useMemo(() => translations[lang] || translations.es, [lang]);

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowHeaderButtons(true), 1200);
    const ctaTimer = setTimeout(() => setShowCTA(true), 1500);
    return () => {
      clearTimeout(logoTimer);
      clearTimeout(ctaTimer);
    };
  }, []);

  const openModal = (craft) => {
    setSelectedCraft(craft);
    setStep('auth');
    setIsModalOpen(true);
  };

  const handleContinueEmail = () => {
    if (!form.email || !form.password) return;
    setAuthMethod('email');
    setStep('plans');
  };

  const handleContinueGoogle = () => {
    setAuthMethod('google');
    setStep('plans');
  };

  const handlePlanSelect = (plan) => {
    if (authMethod === 'google') {
      window.location.href = `/auth/google?plan=${plan}&craft=${selectedCraft}`;
      return;
    }
    const target = selectedCraft === 'tapestry' ? '/editor/tapestry' : '/editor/crochet';
    window.location.href = target;
  };

  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      bgImage={`url(${backgroundImage})`}
      bgSize="cover"
      bgPos="center"
    >
      {showHeaderButtons && (
        <HStack position="absolute" top={6} right={6} spacing={3}>
          <Button variant="outline" colorScheme="pink" onClick={() => openModal(selectedCraft || 'tapestry')}>
            {t.login}
          </Button>
          <Button colorScheme="pink" onClick={() => openModal(selectedCraft || 'tapestry')}>
            {t.register}
          </Button>
        </HStack>
      )}

      <Stack align="center" justify="center" minH="100vh" spacing={10}>
        <MotionBox
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: -10 }}
          transition={{ duration: 1 }}
        >
          <Image src={logo} alt="Rivia" boxSize={{ base: '180px', md: '220px' }} />
        </MotionBox>

        {showCTA && (
          <VStack spacing={6} textAlign="center" px={4}>
            <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="bold">
              {t.heroTitle}
            </Text>
            <HStack spacing={4} flexWrap="wrap" justify="center">
              {heroButtons.map((item) => (
                <Button key={item.action} size="lg" colorScheme="pink" onClick={() => openModal(item.action)}>
                  {item.label}
                </Button>
              ))}
            </HStack>
          </VStack>
        )}
      </Stack>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered size="5xl">
        <ModalOverlay />
        <ModalContent maxW="900px" borderRadius="lg">
          <ModalHeader textAlign="center">{step === 'auth' ? t.accessTitle : t.planTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {step === 'auth' && (
              <VStack spacing={4} align="stretch">
                <Input
                  placeholder={t.email}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                <Input
                  placeholder={t.password}
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                />
                <Button colorScheme="pink" onClick={handleContinueEmail}>
                  {t.continueEmail}
                </Button>
                <HStack>
                  <Divider />
                  <Text fontSize="sm" color="gray.500">
                    o
                  </Text>
                  <Divider />
                </HStack>
                <Button
                  variant="outline"
                  colorScheme="pink"
                  leftIcon={<FaGoogle />}
                  onClick={handleContinueGoogle}
                >
                  {t.continueGoogle}
                </Button>
              </VStack>
            )}

            {step === 'plans' && (
              <VStack align="stretch" spacing={5}>
                <Text color="gray.600">{t.planNote}</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box border="1px solid #eee" borderRadius="md" p={4} bg="gray.50">
                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="bold">
                        {t.free}
                      </Text>
                      <Badge colorScheme="green">Free</Badge>
                    </HStack>
                    <List spacing={2} mt={3}>
                      {t.freeFeatures.map((feat) => (
                        <ListItem key={feat}>• {feat}</ListItem>
                      ))}
                    </List>
                    <Button mt={4} variant="outline" colorScheme="pink" onClick={() => handlePlanSelect('free')}>
                      {t.choosePlan(t.free)}
                    </Button>
                  </Box>

                  <Box border="1px solid #ffd7ef" borderRadius="md" p={4} bg="pink.50">
                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="bold">
                        {t.premium}
                      </Text>
                      <Badge colorScheme="pink">{t.premiumTrial}</Badge>
                    </HStack>
                    <List spacing={2} mt={3}>
                      {t.premiumFeatures.map((feat) => (
                        <ListItem key={feat}>• {feat}</ListItem>
                      ))}
                    </List>
                    <Button mt={4} colorScheme="pink" onClick={() => handlePlanSelect('premium')}>
                      {t.choosePlan(t.premium)}
                    </Button>
                  </Box>
                </SimpleGrid>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            {step === 'plans' && (
              <Text fontSize="sm" color="gray.500">
                {selectedCraft === 'crochet' ? 'Crochet' : 'Tapestry'}
              </Text>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Home;
