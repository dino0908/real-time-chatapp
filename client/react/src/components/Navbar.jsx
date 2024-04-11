import React from "react";
import { useNavigate } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Text,
  Heading,
  HStack,
  Button,
  Stack,
  Show,
  Hide,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
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
        padding={"15px"}
      >
        <Flex direction="row" justifyContent="space-between">
          <Box marginTop={"5px"}>
            <Button
              bg={"white"}
              _hover={{ bg: "white" }}
              onClick={() => navigate("/")}
            >
              <Heading
                size="lg"
                fontSize={{ base: "15px", md: "20px" }}
                fontFamily={"Bebas Neue"}
              >
                Chat App
              </Heading>
            </Button>
          </Box>
          <Box marginTop={"17px"}>
            <HStack
              spacing={{ base: "10px", md: "22px" }}
              fontFamily={"Rajdhani"}
              marginLeft={{ base: "-30px", md: "30px" }}
            >
              <Text fontSize={{ base: "12px", md: "19px" }}>Features</Text>
              <Text fontSize={{ base: "12px", md: "19px" }}>Pricing</Text>
              <Text fontSize={{ base: "12px", md: "19px" }}>FAQ</Text>
              <Text fontSize={{ base: "12px", md: "19px" }}>About</Text>
              <Text fontSize={{ base: "12px", md: "19px" }}>Contact</Text>
            </HStack>
          </Box>
          <Hide below="md">
            <Box>
              <Stack direction="row" spacing={{ base: 1, md: 2 }}>
                <Button
                  bgColor={"white"}
                  variant="solid"
                  color={"#0865c2"}
                  _hover={{ color: "black" }}
                  _focus={{ boxShadow: "none" }}
                  _active={{ bgColor: "white", borderColor: "white" }}
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </Button>

                <Button
                  bgColor="#0473e2"
                  color="white"
                  variant="solid"
                  _hover={{ bgColor: "#055bb0" }}
                  onClick={() => navigate("/signup")}
                >
                  Start free
                </Button>
              </Stack>
            </Box>
          </Hide>
          <Show below="md">
            <Box>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="outline"
                />
                <MenuList>
                  <MenuItem onClick={() => navigate("/login")}>
                    Sign in
                  </MenuItem>
                  <MenuItem onClick={() => navigate("/signup")}>
                    Sign up
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Show>
        </Flex>
      </Box>
    </div>
  );
}

export default Navbar;
