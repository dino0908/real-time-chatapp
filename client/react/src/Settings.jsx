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
} from "@chakra-ui/react";

import { getUsername, returnUserInfo } from "./firebase";

function Settings() {
  const [username, setUsername] = useState("");
  const [userID, setUserID] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await returnUserInfo();
        const uid = response.uid;
        setUserID(uid);
        const username = await getUsername(uid);
        setUsername(username);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Sidebar tab={"settings"}></Sidebar>
      <Box position="relative" marginLeft="100px" h="100vh" bgColor="#f0f2f0">
        <Flex flexDir={"row"} h={"100%"}>
          <Box flex={"30%"} h={"100%"}>
            <Card
              minW={"250px"}
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
                  <Button
                    bgColor={"#0473e2"}
                    w={"200px"}
                    color={"white"}
                    _hover={{ bg: "#0462bf" }}
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
              minW={"500px"}
              w="80%"
              h={"85%"}
              minH={"300px"}
              marginTop={"50px"}
              marginLeft={"50px"}
            >
              <CardHeader>
                <Heading>Edit Profile</Heading>
              </CardHeader>
              <CardBody h={'50%'}>
                <Tabs h={'100%'}>
                  <TabList>
                    <Tab>User Info</Tab>
                    <Tab isDisabled>Billing Information</Tab>
                  </TabList>

                  <TabPanels h={'100%'}>
                    <TabPanel h={'95%'}>
                      stuff
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
