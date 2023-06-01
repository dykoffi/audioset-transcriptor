import { ActionIcon, Avatar, Badge, Button, Center, Code, Container, Group, Header, Loader, Menu, Skeleton, Stack, Text, Textarea, Tooltip, createStyles } from "@mantine/core";
import { IconArrowUp, IconChecks, IconChevronRight, IconChevronsRight, IconDatabase, IconLogout, IconTiltShift, IconVolume } from "@tabler/icons";
import { RootState, store } from "../services/store";
import { getSound, logouttranscriptor, passSound, statsSound, transcriptSound } from "../services/userSlice";
import { HOMECONF } from "../config/constants";
import logo from "../assets/logodata354.jpeg";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import AppFooter from "../components/AppFooter";

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
          <Badge p={15} color="green">Audios transcris : {user.stats.sounds}  </Badge>
          <Badge p={15} color="red">Audios passés : {user.stats.passedSounds}</Badge>

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

export default function Transcription() {

  const user = useSelector((state: RootState) => state.user);
  const [audio, setAudio] = useState(new Audio())
  const [audioListen, setAudioListen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("")
  const [shift, setShift] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    store.dispatch(getSound())
    store.dispatch(statsSound())
  }, [])

  useEffect(() => {
    setAudio(new Audio(user.sound?.targetAudioLink))
    setAudioListen(false)
    new Audio(user.sound?.targetAudioLink).addEventListener("ended", () => {
      console.log(audio.duration);
    })
  }, [user.sound])

  useEffect(() => {
    // Set up event listeners for play and ended events
    const handlePlay = () => setIsPlaying(true);
    const handleEnded = () => { setIsPlaying(false), setAudioListen(true) };

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
            <Skeleton visible={user.loading} >
              {
                user.sound === null ?
                  <Text className="opacity-50" weight={"bold"} align="center" size={50} color="red">
                    Aucun audio disponible
                  </Text>
                  :
                  <Text weight={"bold"} align="center" size={50} color="dimmed">
                    {user.sound?.sourceLang}
                  </Text>
              }
            </Skeleton>

          </Container>
          <Button
            onClick={() => audio.play()}
            disabled={isPlaying || user.sound === null || user.loading}
            className="bg-blue-100" variant="light" size="lg"
            leftIcon={isPlaying ? <Loader color="blue.3" size={"xs"} variant="bars" /> : <IconVolume size="1rem" />}>
            Ecouter la version dioula
          </Button>
          <Container size={800} className="w-full" p={20}>
            <Textarea
              placeholder={audioListen ? "Transcription" : "Ecoutez l'audio avant de transcrire svp"}
              className="text-5xl"
              ref={textareaRef}
              size="lg"
              value={transcript}
              disabled={!audioListen}
              autosize
              minRows={3}
              onChange={(ev) => { setTranscript(ev.target.value) }}
            />
          </Container>
          <Container p={20}>
            <Group>
              <Button disabled={!audioListen} color="blue" className={shift ? "bg-blue-500" : "bg-white text-blue-900"} size="xl" onClick={() => {
                setShift(!shift)
                textareaRef.current?.focus()
              }} >Shift <IconArrowUp /></Button>
              <Button disabled={!audioListen} onClick={() => {
                setTranscript(transcript + (!shift ? "ɛ" : "Ɛ"))
                textareaRef.current?.focus()
              }} size="xl" variant="outline">{!shift ? "ɛ" : "Ɛ"}</Button>
              <Button disabled={!audioListen} onClick={() => {
                setTranscript(transcript + (!shift ? "ɔ" : "Ɔ"))
                textareaRef.current?.focus()
              }} size="xl" variant="outline">{!shift ? "ɔ" : "Ɔ"}</Button>
              <Button disabled={!audioListen} onClick={() => {
                setTranscript(transcript + (!shift ? "ŋ" : "Ŋ"))
                textareaRef.current?.focus()
              }} size="xl" variant="outline">{!shift ? "ŋ" : "Ŋ"}</Button>
              <Button disabled={!audioListen} onClick={() => {
                setTranscript(transcript + (!shift ? "ɲ" : "Ɲ"))
                textareaRef.current?.focus()
              }} size="xl" variant="outline">{!shift ? "ɲ" : "Ɲ"}</Button>
            </Group>
          </Container>
          <Container p={20}>
            <Group>
              <Button disabled={transcript.trim().length === 0} onClick={() => {
                store.dispatch(transcriptSound(transcript))
                setTranscript("")
              }} variant="outline" color="green" size="md" leftIcon={<IconChecks size="1rem" />}>
                Valider la Transcription
              </Button>
              <Button onClick={() => {
                store.dispatch(passSound())
              }}
                disabled={!audioListen} variant="outline" color="gray" size="md" rightIcon={<IconChevronsRight size="1rem" />}>
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