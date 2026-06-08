import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../../utils/types/Recoleccion";

const defaultUserProfile: UserProfile = {
  nombre: "",
  telefono: "",
  direccion: "",
  rol: "residente",
  vehiculo: "",
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState: defaultUserProfile,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      Object.assign(state, action.payload);
    },
    resetProfile: () => defaultUserProfile,
  },
});

export const { updateProfile, resetProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;
