import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Center,
  Avatar,
  Button,
  Text,
  Input,
  VStack,
} from "@chakra-ui/react";

import { getUsername, returnUserInfo } from "./firebase";

function Settings() {
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      console.log("Uploading file:", file);
      // Handle the file upload logic here
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await returnUserInfo();
        const uid = response.uid;
        setUserID(uid);
        const username = await getUsername(uid);
        setUsername(username);
        const email = response.email;
        setEmail(email);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Sidebar tab={"settings"}></Sidebar>
      <Box
        position="relative"
        marginLeft={`min(15%, 150px)`}
        h="100vh"
        bgColor="#f0f2f0"
      >
        <Flex flexDir={"row"} h={"100%"} w={"100%"}>
          <Box flex={"30%"} h={"100%"} w={"100%"}>
            <Card
              w="75%"
              h={"50%"}
              minH={"300px"}
              marginTop={"50px"}
              marginLeft={"50px"}
            >
              <CardHeader>
                <Center>
                  <Heading>{username}</Heading>
                </Center>
              </CardHeader>
              <CardBody>
                <Center>
                  <Avatar
                    name="Dan Abrahmov"
                    src="https://bit.ly/dan-abramov"
                    size={"xl"}
                  />
                </Center>
                <Center marginTop={"30px"}>
                  {/* Input for selecting a file */}
                  <Input
                    type="file"
                    accept="image/*" // Specify accepted file types (e.g., images)
                    onChange={handleFileChange}
                    display="none" // Hide the default file input UI
                    id="fileInput" // Add an ID for easier access
                  />

                  {/* Chakra UI Button to trigger file selection */}
                  <Button
                    bgColor="#0473e2"
                    w="200px"
                    color="white"
                    _hover={{ bg: "#0462bf" }}
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    Upload new photo
                  </Button>
                </Center>
              </CardBody>
              <CardFooter>
                <Flex
                  height="100%"
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  flexDir={"row"}
                >
                  <Text>Member since:&nbsp;</Text>
                  <Text fontWeight="bold">1 January 2024</Text>
                </Flex>
              </CardFooter>
            </Card>
          </Box>
          <Box flex={"70%"} h={"100%"}>
            <Card
              w="80%"
              h={"85%"}
              minH={"300px"}
              marginTop={"50px"}
              marginLeft={"50px"}
            >
              <CardHeader>
                <Heading>Edit Profile</Heading>
              </CardHeader>
              <CardBody h={"50%"}>
                <Tabs h={"100%"}>
                  <TabList>
                    <Tab>User Info</Tab>
                    <Tab isDisabled>Billing Information</Tab>
                  </TabList>

                  <TabPanels h={"100%"}>
                    <TabPanel h={"95%"}>
                      <Flex flexDir={"row"} h={"100%"}>
                        <Box flex={"50%"}>
                          <VStack
                            spacing={2}
                            align={"start"}
                            marginTop={"40px"}
                            marginRight={"20px"}
                          >
                            <Text>Username</Text>
                            <Input
                              isReadOnly={true}
                              fontWeight={"bold"}
                              value={username}
                              marginBottom={"10%"}
                            />
                            <Text>New password</Text>
                            <Input
                              type={"password"}
                              placeholder="Password"
                              marginBottom={"10%"}
                            />
                            <Text>Email</Text>
                            <Input placeholder={email} />
                          </VStack>
                        </Box>

                        <Box flex={"50%"}>
                          <VStack
                            spacing={2}
                            align={"start"}
                            marginTop={"40px"}
                          >
                            <Text visibility={"hidden"}>Username</Text>
                            <Input
                              value={username}
                              marginBottom={"10%"}
                              visibility={"hidden"}
                            />
                            <Text>Confirm Password</Text>
                            <Input
                              type={"password"}
                              placeholder="Password"
                              marginBottom={"10%"}
                            />
                            <Text>Confirm Email Address</Text>
                            <Input placeholder={email} />
                          </VStack>
                        </Box>
                      </Flex>
                    </TabPanel>
                    <TabPanel>
                      <Text>Billing information (Not Applicable)</Text>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
              <CardFooter>
                <Button
                  bgColor={"#0473e2"}
                  w={"200px"}
                  color={"white"}
                  _hover={{ bg: "#0462bf" }}
                >
                  Update info
                </Button>
              </CardFooter>
            </Card>
          </Box>
        </Flex>
      </Box>
    </div>
  );
}

export default Settings;
