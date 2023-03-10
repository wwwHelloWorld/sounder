import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialStatePlaylist: PlaylistState = {
    playlistTracks: [],
    activeTrack: null,
};

export interface PlaylistTracks {
  id: string;
  name: string;
  size: number;
  source: string;
}

export interface PlaylistState {
    playlistTracks: PlaylistTracks[],
    activeTrack: string,
  }

export const playlistSlice: Slice<PlaylistState> = createSlice({
  name: "playlist",
  initialState: initialStatePlaylist,
  reducers: {
    addTrack(state, action) {
      state.playlistTracks.push({
        id: uuidv4(),
        name: action.payload.name,
        size: action.payload.size,
        source: action.payload.source,
      });
      console.log(action);
    },
    deleteTrack(state, action) {
      state.playlistTracks = state.playlistTracks.filter(
        (el: { id: any; }) => el.id !== action.payload.id
      );
    },
    setActiveTrack(state, action) {
        state.activeTrack = action.payload.id;
    }
  },
});

export const { addTrack, deleteTrack, setActiveTrack } = playlistSlice.actions;
export default playlistSlice.reducer;
