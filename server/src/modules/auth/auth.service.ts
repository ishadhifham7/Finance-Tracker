import User, { IUser } from "./auth.model";
import { ApiError } from "../../utils/apiError";
import { DecodedToken } from "./auth.types";

export const findOrCreateUser = async (
  payload: DecodedToken,
): Promise<IUser> => {
  const { uid, email, name, picture } = payload;

  if (!email) {
    throw new ApiError(400, "Invalid token: Email missing");
  }

  let user = await User.findOne({ firebaseUid: uid });

  if (!user) {
    user = await User.create({
      firebaseUid: uid,
      email,
      displayName: name,
      photoURL: picture,
    });
  }

  return user;
};
