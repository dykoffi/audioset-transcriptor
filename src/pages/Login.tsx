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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AppDispatch, RootState } from '../services/store';
import { logintranscriptor, setNotif } from '../services/userSlice';
import AppFooter from '../components/AppFooter';

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
    <>
      <Container className='h-screen' size={500} px={20} pt={40}>
        <form className='h-full' onSubmit={form.onSubmit((values) => dispatch(logintranscriptor(values)))}>
          <Stack className='h-full'>
            <Stack className='flex-1'>
              <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
              >
                Sign in
              </Title>
              {/* <Text color="dimmed" size="sm" align="center" mt={5}>
                                Do not have an account yet ?{' '}
                                <Anchor color={"teal.4"} size="sm" onClick={() => navigate("/signup")}>
                                    Create account
                                </Anchor>
                            </Text> */}

              <Stack p={10} mt={10} spacing="md">
                <TextInput size='md' label="Email" {...form.getInputProps("email")} required />
                <PasswordInput {...form.getInputProps("password")} size='md' label="Password" required />
                <Notification hidden={!notif} color="red" onClose={() => { dispatch(setNotif(false)) }}>
                  Identifiants incorrects, veuillez réessayer
                </Notification>
              </Stack>
            </Stack>
            <Stack px={10}>
              <Button disabled={loading} type='submit' variant='outline' color={"teal.4"} mt="xl" size='md' >
                Sign in
              </Button>
            </Stack>
            <AppFooter />
          </Stack>
        </form>

      </Container>
      <LoadingOverlay loader={<Loader color={"teal.4"} size={"lg"} variant="bars" />} visible={loading} overlayOpacity={0.6} overlayColor={theme.colors.gray[1]} overlayBlur={4} />
    </>
  );
}