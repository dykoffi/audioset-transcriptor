import {
  TextInput,
  PasswordInput,
  Anchor,
  Title,
  Text,
  Container,
  Button,
  LoadingOverlay,
  Stack,
  Loader,
  useMantineTheme,
  Notification,
  Center,
  Group,
  Grid,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AppDispatch, RootState } from '../services/store';
import { logintranscriptor, setNotif } from '../services/userSlice';
import AppFooter from '../components/AppFooter';
import background from "../assets/background.jpg"
import { IconLockOpen } from '@tabler/icons';

export default function Authentication() {

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const dispatch = useDispatch<AppDispatch>()

  const theme = useMantineTheme()
  const loading = useSelector((state: RootState) => state.user.loading)
  const notif = useSelector((state: RootState) => state.user.notif)

  useEffect(() => {
    dispatch(setNotif(false))
  }, [])

  return (
    <Stack className='h-screen w-screen bg-cover ' style={{ backgroundImage: `url(${background})` }}  >
      <Stack className='flex-1 backdrop-blur-md'>
        <Center className='flex-1'>
          <form className='w-1/4 bg-white p-10 backdrop-blur-md opacity-90' onSubmit={form.onSubmit((values) => dispatch(logintranscriptor(values)))}>
            <Stack className='h-full'>
              <Stack className='flex-1'>
                <Title
                  align="center"
                  sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
                >
                  Sign in
                </Title>
                <Stack p={10} mt={10} spacing="md">
                  <TextInput size='md' label="Email" {...form.getInputProps("email")} required />
                  <PasswordInput {...form.getInputProps("password")} size='md' label="Password" required />
                  <Notification hidden={!notif} color="red" onClose={() => { dispatch(setNotif(false)) }}>
                    Identifiants incorrects, veuillez réessayer
                  </Notification>
                </Stack>
              </Stack>
              <Stack px={10}>
                <Button leftIcon={<IconLockOpen />} disabled={loading} type='submit' className='bg-orange-800 hover:bg-orange-900' mt="xl" size='md' >
                  Sign in
                </Button>
              </Stack>
            </Stack>
            <LoadingOverlay loader={<Loader color={"orange.7"} size={"lg"} variant="dots" />} visible={loading} overlayOpacity={0.6} overlayColor={theme.colors.gray[1]} overlayBlur={4} />
          </form>
        </Center>
        <AppFooter />
      </Stack>
    </Stack>
  );
}