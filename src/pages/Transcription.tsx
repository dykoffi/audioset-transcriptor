import { ActionIcon, Avatar, Badge, Button, Center, Code, Container, Group, Header, Menu, Stack, Text, Textarea, Tooltip, createStyles } from "@mantine/core";
import { IconChecks, IconChevronRight, IconChevronsRight, IconDatabase, IconLogout, IconVolume } from "@tabler/icons";
import { RootState, store } from "../services/store";
import { getSound, logouttranscriptor } from "../services/userSlice";
import { HOMECONF } from "../config/constants";
import logo from "../assets/logodata354.jpeg";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";

const useStyles = createStyles((theme) => ({
  footer: {
    justifyContent: "center",
    alignItems: "center",
    borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
  },

  inner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flexDirection: "column",
    marginLeft: 0,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
  },
}))

const AppHeader = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <Header height={HOMECONF.HEADER_HEIGHT} p={"sm"} className="items-center justify-center" >
      <Group position="apart">
        <Group>
          <Avatar radius={"md"} src={logo} alt="Data354 Logo" />
          <Text weight={700} size="md" color="dimmed">
            KOUMANKAN Transcription
          </Text>
        </Group>
        <Group position="center">
          <Badge p={15} color="green">Audios transcris : 257  </Badge>
          <Badge p={15} color="red">Audios passés : 21</Badge>

        </Group>
        <Group>
          <Code>
            {String(user?.transcriptor?.email || "")}
          </Code>
          <Menu>
            <Menu.Target>
              <ActionIcon>
                {" "}
                <Avatar
                  radius={"md"}
                  alt="User picture"
                />{" "}
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                color="red"
                onClick={() => {
                  store.dispatch(logouttranscriptor(user?.transcriptor?.token || ""));
                }}
                icon={<IconLogout size={14} />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Header>
  );
};

const AppFooter = () => {
  const { classes } = useStyles();
  return (
    <Group className={classes.footer}>
      <Stack className={classes.inner}>
        <Text size="xs" color="dimmed">
          <br />
          {`Designed & built by Data354, 2023 CIV 🇨🇮`}
          <br />
          {`All rights reserved`}
        </Text>
      </Stack>
    </Group>
  );
};

export default function Transcription() {

  const user = useSelector((state: RootState) => state.user);
  const [audio, setAudio] = useState(new Audio())
  const [audioListen, setAudioListen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    store.dispatch(getSound())
  }, [])

  useEffect(() => {
    setAudio(new Audio(user.sound?.targetAudioLink))
    setAudioListen(false)
  }, [user.sound])

  useEffect(() => {
    // Set up event listeners for play and ended events
    const handlePlay = () => setIsPlaying(true);
    const handleEnded = () => setIsPlaying(false);

    // Add event listeners to the audio element
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('ended', handleEnded);

    // Clean up the event listeners when the audio element is updated or the component is unmounted
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('ended', handleEnded);
    }
  }, [audio]);


  return <Stack className='h-screen w-screen'>
    <Stack justify="flex-start" className='h-full w-full' spacing="xs">
      <AppHeader />
      <Stack className='flex-1' px={20}>
        <Stack className="flex-1 flex items-center justify-center">
          <Container className="flex-1 flex items-center" size={800}>
            <Text weight={"bold"} align="center" size={50} color="dimmed">
              {user.sound?.sourceLang}
            </Text>

          </Container>
          <Button onClick={() => {
            audio.play().then(function () {
              setAudioListen(true)
            })
          }} disabled={isPlaying} className="bg-blue-100" variant="light" size="lg" leftIcon={<IconVolume size="1rem" />}>
            Ecouter la version dioula
          </Button>
          <Container size={800} className="w-full" p={20}>
            <Tooltip position="bottom-end" label="Veuillez écouter l'audio avant de transcrire">
              <Textarea
                placeholder="Transcription"
                className="text-5xl"
                size="lg"
                disabled={!audioListen}
                // variant="filled"
                autosize
                minRows={3}
              />
            </Tooltip>
          </Container>
          <Container p={20}>
            <Group>
              <Button onClick={() => {

              }} variant="outline" color="green" size="md" leftIcon={<IconChecks size="1rem" />}>
                Valider la Transcription
              </Button>
              <Button disabled={!audioListen} variant="outline" color="gray" size="md" rightIcon={<IconChevronsRight size="1rem" />}>
                Passer à un autre
              </Button>
            </Group>
          </Container>
        </Stack>
      </Stack>
      <AppFooter />
    </Stack>
  </Stack>
}