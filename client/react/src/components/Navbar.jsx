import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Heading,
  HStack,
  Button,
  Stack,
} from "@chakra-ui/react";
function Navbar() {
  const navigate = useNavigate();

  return (
    <div>
      <Box
        bg="white"
        color="black"
        textAlign="center"
        fontSize="lg"
        fontWeight="bold"
        padding={'15px'}
      >
        <Flex direction="row" justifyContent="space-between">
          <Box marginTop={'5px'}>
            <Button bg={'white'} _hover={{ bg: "white" }} onClick={()=>navigate('/')}>
            <Heading size='lg' fontSize={'20px'} fontFamily={'Bebas Neue'}>Chat App</Heading>
            </Button>
            
          </Box>
          <Box marginTop={'7px'} marginLeft={'60px'}>
            <HStack spacing="24px" fontFamily={'Rajdhani'}>
              <Text fontSize="12px">Features</Text>
              <Text fontSize="12px">Pricing</Text>
              <Text fontSize="12px">FAQ</Text>
              <Text fontSize="12px">About</Text>
              <Text fontSize="12px">Contact</Text>
            </HStack>
          </Box>
          <Box>
            <Stack direction="row" spacing={2}>
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
              <Button
                colorScheme="teal"
                variant="outline"
                onClick={() => navigate("/signup")}
              >
                Start free
              </Button>
            </Stack>
          </Box>
        </Flex>
      </Box>
    </div>
  );
}

export default Navbar;
