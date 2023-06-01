import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiClient } from '../config/axios'
import { COOKIES } from '../config/constants'

interface User {
  transcriptor: {
    id_: number
    name: string
    email: string
    phone: string
    town: string
    token: string
  } | null,
  notif: true | false
  popup: true | false
  loading: boolean
  stats: {
    sounds: number
    passedSounds: number
  }
  statsLoading: boolean
  sound: {
    id_: number,
    ref: string,
    sourceLang: string,
    targetLang: string,
    targetAudioLink: string
  } | null
}

let initialState: User = {
  loading: false,
  statsLoading: false,
  transcriptor: COOKIES.get("transcriptor_info"),
  notif: false,
  popup: false,
  stats: {
    sounds: 0,
    passedSounds: 0
  },
  sound: null
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setTranscriptor: (state, action) => { state.transcriptor = action.payload },
    setNotif: (state, action) => { state.notif = action.payload },
    setPopup: (state, action) => { state.popup = action.payload },
    setStats: (state, action) => { state.stats = action.payload },
    setSound: (state, action) => { state.sound = action.payload },
    setStatsLoading: (state, action) => { state.statsLoading = action.payload },
    setLoading: (state, action) => { state.loading = action.payload }
  }
})

export const logintranscriptor = createAsyncThunk("transcriptor/signin", async (data: object, { dispatch }) => {
  dispatch(setLoading(true))
  ApiClient.post("/transcriptor/login", data)
    .then(({ data }) => {
      COOKIES.set("transcriptor_info", data, { path: "/", sameSite: "strict" })
      COOKIES.set("transcriptor_token", data.token, { sameSite: "strict", path: "/" })
      dispatch(setTranscriptor(data))
      dispatch(setLoading(false))
      window.location.replace("/")
    })
    .catch((err) => {
      dispatch(setLoading(false))
      dispatch(setNotif(true))
      console.log(err);
    })
})

export const getSound = createAsyncThunk("transcriptor/getsound", async (arg: undefined, { dispatch, getState }) => {
  dispatch(setLoading(true))
  let state: any = getState()
  ApiClient.get(`/transcriptor/${state.user.transcriptor?.id_}/getsound`)
    .then(({ data }) => {
      dispatch(setSound(data))
      dispatch(setLoading(false))
    })
    .catch((err) => {
      dispatch(setLoading(false))
      dispatch(setNotif(true))
      console.log(err);
    })
})

export const transcriptSound = createAsyncThunk("transcriptor/transcriptsound", async (transcript: string, { dispatch, getState }) => {
  dispatch(setLoading(true))
  let state: any = getState()
  ApiClient.post(`/transcriptor/${state.user.transcriptor?.id_}/transcriptsound`, { transcript })
    .then(({ data }) => {
      dispatch(getSound())
      dispatch(statsSound())
    })
    .catch((err) => {
      dispatch(setLoading(false))
      dispatch(setNotif(true))
      console.log(err);
    })
})

export const passSound = createAsyncThunk("transcriptor/passsound", async (arg: undefined, { dispatch, getState }) => {
  dispatch(setLoading(true))
  let state: any = getState()
  ApiClient.get(`/transcriptor/${state.user.transcriptor?.id_}/passsound`)
    .then(({ data }) => {
      dispatch(getSound())
      dispatch(statsSound())
    })
    .catch((err) => {
      dispatch(setLoading(false))
      dispatch(setNotif(true))
      console.log(err);
    })
})

export const statsSound = createAsyncThunk("transcriptor/statssound", async (arg: undefined, { dispatch, getState }) => {
  dispatch(setStatsLoading(true))
  let state: any = getState()
  ApiClient.get(`/transcriptor/${state.user.transcriptor?.id_}/statssound`)
    .then(({ data }) => {
      dispatch(setStats(data))
      dispatch(setStatsLoading(false))
    })
    .catch((err) => {
      dispatch(setLoading(false))
      dispatch(setNotif(true))
      console.log(err);
    })
})

export const logouttranscriptor = createAsyncThunk("transcriptor/logout", async (token: string, { dispatch }) => {
  ApiClient.post("/transcriptor/logout", { token })
    .then(() => {
      dispatch(setNotif(false))
      COOKIES.remove("transcriptor_token", { path: "/", sameSite: true, secure: true })
      COOKIES.remove("transcriptor_info", { path: "/", sameSite: true, secure: true })
      window.location.replace("/signin")
    })
    .catch((err) => {
      dispatch(setLoading(false))
      console.log(err);
    })
})

export const { setNotif, setSound, setStatsLoading, setPopup, setStats, setTranscriptor, setLoading } = userSlice.actions
export default userSlice.reducer