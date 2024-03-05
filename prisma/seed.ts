import {
  PrismaClient,
  WaterBodyType,
  AreaType,
  UserRole,
  UserStatus,
  SampleParameterType,
} from '@prisma/client';
import { BCRYPT_COST } from '../config/server';
import bcrypt from 'bcrypt';
import { prismaClient } from '../server/prisma/client';

const prisma = new PrismaClient();

const emailAdmin = process.env.EMAIL_ADMIN_SEED;
const emailCollaborator = process.env.EMAIL_COLLABORATOR_SEED;
const password = process.env.PASSWORD_SEED;

const hasToCreateAdmin = emailAdmin && password;
const hasToCreateCollaborator = emailCollaborator && password;

const baseUserData = {
  organizationCountry: 'Argentina',
  organizationName: 'AdminOrg',
  organizationRole: 'AdminOrgRole',
  status: UserStatus.ACTIVE,
  createdAt: new Date(),
  telephone: '398473254',
};

async function main() {
  const countries = [ 'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia',
          'Costa Rica', 'Cuba', 'Ecuador', 'El Salvador', 'Guatemala', 'Honduras', 'México',
          'Nicaragua', 'Panamá', 'Paraguay', 'Perú', 'República Dominicana', 'Uruguay', 'Venezuela',
          'Belice', 'Haití', 'Jamaica', 'Puerto Rico', 'Trinidad y Tobago'];

  for (const country of countries) {
    await prisma.country.create({
      data: {
        name: country,
      }
    })
  }

  const mexicoCountry = await prisma.country.findUniqueOrThrow( { where: {name: 'México'} });
  
  await prisma.faq.create({
    data: {
      question: '¿Cómo funciona Delta?',
      answer: `Seleccioná los opciones que quieras encontrar. Después, escribí una ubicación o compartirla desde tu dispositivo.
      La plataforma te mostrará los resultados más cercanos a la dirección que indicaste. En ese momento.`,
    },
  });

  await prisma.about.create({
    data: {
      id: 'about',
      text: `Lorem ipsum dolor sit amet consectetur adipisicing elit. In vitae ad dolorum sequi facilis a! Eveniet impedit at cum, magni illum praesentium, velit minima cupiditate nostrum delectus asperiores adipisci non.Lorem ipsum dolor sit amet consectetur adipisicing elit. In vitae ad dolorum sequi facilis a! Eveniet impedit at cum, magni illum praesentium, velit minima cupiditate nostrum delectus asperiores adipisci non.`,
    },
  });

  if (hasToCreateCollaborator) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

    await prisma.user.create({
      data: {
        email: emailCollaborator,
        password: hashedPassword,
        firstName: 'Collaborator',
        lastName: 'Collaborator',
        role: UserRole.COLLABORATOR,
        ...baseUserData,
        organizationCountry: {
          connect: {
            id: mexicoCountry.id,
          }
        }
      },
    });
  }

  const owner = await prismaClient.user.create({
    data: {
      ...baseUserData,
      email: 'user_example2@mail.com',
      password: await bcrypt.hash('123456', BCRYPT_COST),
      firstName: 'User',
      lastName: 'Example 2',
      role: UserRole.COLLABORATOR,
      status: UserStatus.ACTIVE,
      organizationCountry: {
        connect: {
          id: mexicoCountry.id,
        }
      }
    },
  });

  const samplingPoint = await prisma.samplingPoint.create({
    data: {
      name: 'Test de prueba',
      latitude: -34.62994536,
      longitude: -58.39187918,
      country: 'Argentina',
      waterBodyType: WaterBodyType.LAGUNA,
      areaType: AreaType.RURAL,
      owner: {
        connect: {
          id: owner.id,
        },
      }, 
    },
  });

  const device = await prisma.device.create({
    data: {
      name: 'Módulo de prueba',
      description: 'Este es un módulo de prueba',
      externalId: 'PROMUSAT_TESTLOCAL_4673124',
      components: 'ESP32 / Gravity Analog pH Sensor/ Gravity Analog Electrical Conductivity Sensor / DS18B20',
      samplingPoint: {
        connect: {
          id: samplingPoint.id,
        },
      },
      owner: {
        connect: {
          id: owner.id,
        },
      },
    },
  });

  const sampleParameterTemperatura = await prisma.sampleParameter.create({
    data: {
      name: 'Temperatura del Agua [°Celsius]',
      type: SampleParameterType.FISICA,
      unit: '°C',
    },
  });

  const sampleParameterPh = await prisma.sampleParameter.create({
    data: {
      name: 'pH [Unidades de pH]',
      type: SampleParameterType.QUIMICA,
      unit: '',
    },
  });

  const sampleParameterElectroconductividad =
    await prisma.sampleParameter.create({
      data: {
        name: 'Conductividad [µs/cm]',
        type: SampleParameterType.FISICA,
        unit: 'μS/cm',
      },
    });

  const sample = await prisma.sample.create({
    data: {
      samplingPoint: {
        connect: {
          id: samplingPoint.id,
        },
      },
      device: {
        connect: {
          id: device.id,
        },
      },
      latitude: -34.62994536,
      longitude: -58.39187918,
      takenBy: {
        connect: {
          id: owner.id,
        },
      },
      measurementValues: {
        create: [
          {
            parameter: {
              connect: {
                id: sampleParameterElectroconductividad.id,
              },
            },
            value: 105,
          },
          {
            parameter: {
              connect: {
                id: sampleParameterPh.id,
              },
            },
            value: 5,
          },
          {
            parameter: {
              connect: {
                id: sampleParameterTemperatura.id,
              },
            },
            value: 23,
          },
        ],
      },
    },
  });

  if (hasToCreateAdmin) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

    await prisma.user.create({
      data: {
        email: emailAdmin,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Admin',
        role: UserRole.ADMIN,
        ...baseUserData,
        organizationCountry: {
          connect: {
            id: mexicoCountry.id,
          }
        }
      },
    });
  }

  await prismaClient.user.create({
    data: {
      ...baseUserData,
      email: 'user_example1@mail.com',
      password: await bcrypt.hash('123456', BCRYPT_COST),
      firstName: 'User',
      lastName: 'Example 1',
      role: UserRole.COLLABORATOR,
      status: UserStatus.PENDING,
      organizationCountry: {
        connect: {
          id: mexicoCountry.id,
        }
      }
    },
  });
  await prismaClient.notifyOrder.create({
    data: {
      telephone: "1131747225",
      latitude: -34.62994536,
      longitude: -58.39187918,
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
