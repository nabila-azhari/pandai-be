import db from '../../config/firebase.config';
import {
  LoginType,
  RegisterType,
  loginSchema,
  registerSchema,
} from './schema';
import { ServiceResponse } from '../../common/models/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../common/utils/envConfig';
import { UserType } from '../../controllers/user/schema';

class AuthService {
  /* =========================
     SIGN IN
     ========================= */
  async signIn(formData: LoginType) {
    // ✅ VALIDASI INPUT
    loginSchema.validateSync(formData);

    const userRef = db.collection('users');

    const snapshot = await userRef
      .where('email', '==', formData.email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return ServiceResponse.failure(
        'User not found',
        null,
        StatusCodes.NOT_FOUND
      );
    }

    const doc = snapshot.docs[0];
    const userData = doc.data() as UserType;

    // ✅ VALIDASI PASSWORD
    const isPasswordValid = bcrypt.compareSync(
      formData.password,
      userData.password
    );

    if (!isPasswordValid) {
      return ServiceResponse.failure(
        'Email and Password is incorrect',
        null,
        StatusCodes.UNAUTHORIZED
      );
    }

    // 🔑 PAYLOAD JWT (MINIMAL & ROLE-AWARE)
    const payload: any = {
      uid: doc.id,
      role: userData.role,
    };

    if (userData.role === 'siswa') {
      payload.nis = userData.nis;
    }

    const token = jwt.sign(payload, env.JWT_SECRET_ACCESS_TOKEN!, {
      expiresIn: '24h',
    });

    return ServiceResponse.success(
      'success',
      {
        token,
        role: userData.role,
      },
      StatusCodes.OK
    );
  }

  /* =========================
     SIGN UP
     ========================= */
  async signUp(formData: RegisterType) {
    // ✅ VALIDASI INPUT
    registerSchema.validateSync(formData);

    const userRef = db.collection('users');

    const duplicate = await userRef
      .where('email', '==', formData.email)
      .limit(1)
      .get();

    if (!duplicate.empty) {
      return ServiceResponse.failure(
        'Email already used',
        null,
        StatusCodes.CONFLICT
      );
    }

    const userId = uuidv4();

    // ⚠️ DEFAULT ROLE = SISWA (ubah kalau perlu)
    const role = formData.role ?? 'siswa';

    const userPayload: any = {
      id: userId,
      fullname: formData.fullname,
      email: formData.email,
      password: bcrypt.hashSync(formData.password, bcrypt.genSaltSync(7)),
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 🔑 NIS HANYA UNTUK SISWA
    if (role === 'siswa') {
      userPayload.nis = formData.nis;
    }

    await userRef.doc(userId).set(userPayload);

    // 🔑 PAYLOAD JWT (SAMA DENGAN SIGN IN)
    const tokenPayload: any = {
      uid: userId,
      role,
    };

    if (role === 'siswa') {
      tokenPayload.nis = formData.nis;
    }

    const token = jwt.sign(tokenPayload, env.JWT_SECRET_ACCESS_TOKEN!, {
      expiresIn: '24h',
    });

    return ServiceResponse.success(
      'success',
      {
        token,
        role,
      },
      StatusCodes.CREATED
    );
  }
}

export default new AuthService();
