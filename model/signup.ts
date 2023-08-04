import {  UserRole, UserStatus } from '@prisma/client';
import * as yup from 'yup';


export const signupSchema = yup
  .object({
    email: yup.string().email().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    telephone: yup.string().required(),
    password: yup.string().min(8).matches(/[a-z]+/).matches(/[A-Z]+/).matches(/\d+/).required(),
  });

export type SignupRequest = yup.InferType<typeof signupRequestSchema>;
export const signupRequestSchema = yup.object({
  id: yup.string().required(),
  email: yup.string().email().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  status: yup.mixed().oneOf(Object.values(UserStatus)).required(),
  organizationName: yup.string(),
  organizationCountry: yup.string().uuid(),
  organizationRole: yup.string(),
  createdAt: yup.date().required(),
  role: yup.mixed().oneOf(Object.values(UserRole)),
});

export type SignupRequests = yup.Asserts<typeof signupRequestsSchema>;
export const signupRequestsSchema = yup.array(signupRequestSchema).required();
