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
                      w={"30%"}
                    />

                    <HStack w={'100%'}>
                      <VStack align={"start"} w={'100%'}>
                        <Text>New password</Text>
                        <Input
                          type={"password"}
                          placeholder="Password"
                          marginBottom={"10%"}
                          w={'50%'}
                        />
                      </VStack>

                      <VStack align={"start"} w={'100%'}>
                        
                      </VStack>
                    </HStack>

                    <Text>Email</Text>
                    <Input placeholder={email} />
                  </VStack>

                  <Text>Confirm Email Address</Text>
                  <Input placeholder={email} />