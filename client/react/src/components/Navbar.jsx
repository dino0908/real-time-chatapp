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
        h="70px"
        bg="white"
        color="black"
        paddingY="2"
        textAlign="center"
        fontSize="lg"
        fontWeight="bold"
      >
        <Flex direction="row" justifyContent="space-between" padding="4">
          <Box w="70px">
            <Button bgColor='#7e93ba' _hover={{ bg: '#7e93ba' }} onClick={() => navigate("/")}>
              <Heading size="xs">Dino's Chat App</Heading>
            </Button>
          </Box>
          <Box>
            <HStack spacing="24px" marginTop={"10px"} marginLeft={"80px"}>
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
