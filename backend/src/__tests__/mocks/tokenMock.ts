import { sign } from "jsonwebtoken";

const secretKey: string = "1234sas";
process.env.SECRET_KEY = secretKey;

export const tokenMock = {
  genToken: (id: number, name: string, email: string) => {
    return sign({ id, name, email }, secretKey, {
      expiresIn: process.env.EXPIRES_IN,
      subject: id.toString(),
    });
  },
  invalidSignature: sign({ email: true }, "invalid_signature"),
  jwtMalformed: "12345",
};
