import { NextMiddleware, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import getUserDataFromReq from './utils/getUserDataFromReq';
import { Method } from 'axios';

// An interface that defines the base configuration for a route
interface BaseConfig {
  path: string;
  checkAsRegex: boolean;
}

// A type that defines the possible values for the 'roles' property
type AvailableRoles = UserRole[] | 'public';

// An interface that defines a general configuration for a route,
// which applies to all methods
interface GeneralConfig extends BaseConfig {
  roles: AvailableRoles;
}

// An interface that defines a configuration for a route that varies by method
interface MethodConfig extends BaseConfig {
  methods: Partial<Record<Method, AvailableRoles>>;
}

// The Config type can be either a GeneralConfig or a MethodConfig
type Config = GeneralConfig | MethodConfig;

const routeConfig: Config[] = [
  // related to About
  {
    path: '/admin/about',
    checkAsRegex: false,
    roles: [UserRole.ADMIN],
  },
  {
    path: '/api/about',
    checkAsRegex: false,
    methods: {
      GET: 'public',
      POST: [UserRole.ADMIN],
      PUT: [UserRole.ADMIN],
      DELETE: [UserRole.ADMIN],
    },
  },
  // related to Countries
  {
    path: '/api/countries',
    checkAsRegex: false,
    methods: {
      GET: 'public',
    },
  },
  // related to Devices
  {
    path: '/api/devices/.*/samples',
    checkAsRegex: true,
    methods: {
      POST: 'public',
    },
  },
  {
    path: '/api/devices/samples',
    checkAsRegex: false,
    methods: {
      POST: 'public',
    },
  },
  {
    path: '/api/devices',
    checkAsRegex: false,
    roles: [UserRole.ADMIN, UserRole.COLLABORATOR],
  },
  {
    path: '/admin/devices',
    checkAsRegex: false,
    roles: [UserRole.ADMIN, UserRole.COLLABORATOR],
  },
  // related to External Samples
  {
    path: '/api/external-samples/confirmation-token',
    checkAsRegex: false,
    roles: [UserRole.ADMIN, UserRole.COLLABORATOR],
  },
  // related to FAQ
  {
    path: '/admin/faq',
    checkAsRegex: false,
    roles: [UserRole.ADMIN],
  },
  {
    path: '/api/faq',
    checkAsRegex: false,
    methods: {
      GET: 'public',
      POST: [UserRole.ADMIN],
      PUT: [UserRole.ADMIN],
      DELETE: [UserRole.ADMIN],
    },
  },
  // related to News
  {
    path: '/admin/news-posts',
    checkAsRegex: false,
    roles: [UserRole.ADMIN],
  },
  {
    path: '/api/news-posts',
    checkAsRegex: false,
    methods: {
      GET: 'public',
      POST: [UserRole.ADMIN],
      PUT: [UserRole.ADMIN],
      DELETE: [UserRole.ADMIN],
    },
  },
  // related to Sampling Points
  {
    path: '/admin/sampling-points',
    checkAsRegex: false,
    roles: [UserRole.ADMIN, UserRole.COLLABORATOR],
  },
  {
    path: '/api/sampling-points',
    checkAsRegex: false,
    methods: {
      GET: 'public',
      POST: [UserRole.ADMIN, UserRole.COLLABORATOR],
      PUT: [UserRole.ADMIN, UserRole.COLLABORATOR],
      DELETE: [UserRole.ADMIN, UserRole.COLLABORATOR],
    },
  },
  // related to Users
  {
    path: '/admin/users',
    checkAsRegex: false,
    roles: [UserRole.ADMIN],
  },
  {
    path: '/api/admin/users',
    checkAsRegex: false,
    roles: [UserRole.ADMIN,  UserRole.COLLABORATOR],
  },
  // related to Changelog
  {
    path: '/admin/changelog',
    checkAsRegex: false,
    roles: [UserRole.ADMIN],
  },
  {
    path: '/api/admin/changes',
    checkAsRegex: false,
    roles: [UserRole.ADMIN],
  },
];

// A function that checks if the user is authorized to access the route
const checkIsAuth = (roles: AvailableRoles, role: UserRole | undefined) => {
  // If the 'roles' value is set to 'public', allow the request to proceed. No availableRoles means public too.
  if (roles === 'public' || !roles.length) {
    return true;
  }

  // If role is undefined, deny the request
  if (!role) {
    return false;
  }

  // If the user's role is not included in the 'roles' array, deny the request
  return roles.includes(role);
};

export const middleware: NextMiddleware = async (req) => {
  // Get the user data from the request
  const userParse = await getUserDataFromReq(req);

  // Get the path of the requested route
  const path = req.nextUrl.pathname;

  // Find the matching configuration object for the path
  const pathConfig = routeConfig.find(
    (config) =>
      (config.checkAsRegex && new RegExp(config.path).test(path)) ||
      (config.checkAsRegex && new RegExp(`${process.env.BASE_URL}/${config.path}`).test(path)) ||
      path.startsWith(config.path) ||
      path.startsWith(`${process.env.BASE_URL}/${config.path}`)
  );

  // If there is no matching configuration object, allow the request to proceed
  if (!pathConfig) {
    return NextResponse.next();
  }

  let isAuthorized = false;

  // Check whether the configuration object has a 'roles' or 'methods' property
  if ('roles' in pathConfig) {
    // If the object has a 'roles' property, check if the user's role is included in the 'roles' array
    // or if the 'roles' value is set to 'public'
    const { roles } = pathConfig;
    isAuthorized = checkIsAuth(roles, userParse?.role);
  } else {
    // If the object has a 'methods' property, retrieve the request method and check if the user's role
    // is included in the 'roles' array for that method or if the 'roles' value for that method is set to 'public'
    const { methods } = pathConfig;
    const method = req.method as Method;
    const roles = methods[method];
    isAuthorized = checkIsAuth(roles ?? [], userParse?.role);
  }

  // If the user is authorized to access the route, allow the request to proceed
  if (isAuthorized) {
    return NextResponse.next();
  }

  // If the user is not authorized to access the route, send a 403 Forbidden response
  // if the request is for an API route, otherwise redirect the user to the home page
  if (path.includes('/api')) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  const destination = req.nextUrl.clone();
  destination.pathname = '/';
  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: destination.toString(),
    },
  });
};
