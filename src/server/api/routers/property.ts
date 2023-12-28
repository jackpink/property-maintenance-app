
import axios from "axios";
import { z } from "zod";
import { env } from "../../../env.mjs";

import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";

type IComponentName = {
  text: string
}

type IAddressComponent = {
  componentType: string,
  componentName: IComponentName
}

interface IGoogleApiData {
  result: IGoogleApiResult
}

interface IGoogleApiResult {
  address: IGoogleApiAddress
}

interface IGoogleApiAddress {
  addressComponents: IAddressComponent[]
}

const googleAPINameMappings = {
  "subpremise": "apartment",
  "street_number" : "streetNumber",
  "route": "street",
  "country": "country",
  "locality": "suburb",
  "administrative_area_level_1": "state",
  "postal_code": "postcode"
}

function isKeyOfObject<T extends object>(key:string |number |symbol, object: T) : key is keyof T {
  return key in object;
}

export const propertyRouter = createTRPCRouter({
  
  getAll: publicProcedure
  .input(z.object({ state: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.property.findMany({
      where: {
        state: input.state
      }
    });
  }),
 
  getPropertiesWithJobs: publicProcedure
  .input(z.object({ user: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.property.findMany({
      include: {
        jobs: true
      },
      where: {
        jobs: {
          some: {
            tradeUserId: input.user
          }
        }
      }
    })
  }),
  getPropertiesForTradeUser: publicProcedure
  .input(z.object({ user: z.string() }))
  .query( async ({ ctx, input }) => {
    const propertiesWithJobsByTradeuser = await ctx.prisma.property.findMany({
      select: {
        jobs: {
          where: {
            tradeUserId: input.user,
          },
          orderBy: {
            date: 'desc'
          }
        },
        apartment: true,
        streetNumber: true,
        street: true,
        suburb: true,
        postcode: true,
        state: true,
        country: true,
        id: true,
        createdAt: true,
        
      }
    });
    const relevantProperties = propertiesWithJobsByTradeuser.filter((property) => {
      return property.jobs.length > 0;
    })
    return relevantProperties;
  }),
  getPropertiesForHomeownerUser: privateProcedure
  .input(z.object({ user: z.string() }))
  .query( async ({ ctx, input }) => {
    const properties = await ctx.prisma.property.findMany({
      where: {
        homeownerUserId: input.user,
        
      },
      include: {
        jobs: true
      }
    });
    
    return properties;
  }),
  getPropertiesForTradeUserRawSQL : publicProcedure
  .input(z.object( {user: z.string() }))
  .query(({ ctx, input }) => {
    const props = ctx.prisma.$queryRaw`SELECT * from Property INNER JOIN Job ON Property.id=Job.propertyId WHERE tradeUserId=${input.user}`;
    return props
  }),
  getPropertyForUser: privateProcedure
  .input(z.object({ id: z.string() }))
  .query( async ({ ctx, input }) => {
    const property =  ctx.prisma.property.findUniqueOrThrow({
      include: {
        levels: {
          include: {
            rooms: true
          }
        }
      }, where: {
        id: input.id
      }
    });
    return property
  }),
  createRoomForLevel: privateProcedure
  .input(z.object({label: z.string(), levelId: z.string()}))
  .mutation(async ({ ctx, input }) => {

    const room = await ctx.prisma.room.create({
      data: {
        label: input.label,
        levelId: input.levelId
      }
    })
    return room;
  }),
  createLevelForProperty: privateProcedure
  .input(z.object({label: z.string(), propertyId: z.string()}))
  .mutation(async ({ ctx, input }) => {

    const level = await ctx.prisma.level.create({
      data: {
        label: input.label,
        propertyId: input.propertyId
      }
    })
    return level;
  }),
  updateLevelLabel: privateProcedure
  .input(z.object({levelId: z.string(), newLabel: z.string()}))
  .mutation( async ({ ctx, input }) => {

    const newLevel = await ctx.prisma.level.update({
      where: {
        id: input.levelId,
      },
      data: {
        label: input.newLabel,
      },
    })
    return newLevel.label
  }),
  updateRoomLabel: privateProcedure
  .input(z.object({roomId: z.string(), newLabel: z.string()}))
  .mutation( async ({ ctx, input }) => {

    const newRoom = await ctx.prisma.room.update({
      where: {
        id: input.roomId,
      },
      data: {
        label: input.newLabel,
      },
    })
    return newRoom;
  }),
  addressValidation: privateProcedure
  .input(z.object({ addressSearchString: z.string()}))
  .mutation( async ({ input }) => {
    const client = axios.create();
    const googleAddressValidationEndpoint = "https://addressvalidation.googleapis.com/v1:validateAddress?key=" +env.GOOGLE_MAPS_API_KEY;
    const requestBody = {
      "address": {
        "regionCode" : "AU",
        "addressLines": [input.addressSearchString]
      }
    }
    const response = await client.post(googleAddressValidationEndpoint, requestBody)
    const AddressObj: IAddress = {
      apartment: null,
      streetNumber: "",
      street: "",
      suburb: "",
      postcode: "",
      state: "",
      country: "",
    }


    const returnData = response.data as IGoogleApiData
    const addressComponents = returnData.result.address.addressComponents;

    for (const addressComponent of addressComponents) {
      const componentType = addressComponent.componentType
      // check that the componentType is corect
      if (isKeyOfObject(componentType, googleAPINameMappings)){
        const field = googleAPINameMappings[componentType]
        const value = addressComponent.componentName.text;
        if (isKeyOfObject(field, AddressObj)) AddressObj[field] = value
      }
    }
    return AddressObj;
  }),
  checkAddressStatus: privateProcedure
  .input(z.object({ apartment: z.string().nullable(), streetNumber: z.string(), street: z.string(), postcode: z.string(), suburb: z.string(), state: z.string(), country: z.string()}))
  .query(async ({ctx, input}) => {
    // Need to check if address exists in system
    const result = await ctx.prisma.property.findMany({
      where:
      {
        apartment: input.apartment,
        streetNumber: input.streetNumber,
        street: input.street,
        suburb: input.suburb,
        postcode: input.postcode,
        state: input.state,
        country: input.country
      }
    });
    // if result has none, return []
    // if result has one or more return with homeowner status
    console.log(result);
    return result;
  }),
  createPropertyForHomeownerUser: privateProcedure
  .input(z.object({ apartment: z.string().nullable(), streetNumber: z.string(), street: z.string(), postcode: z.string(), suburb: z.string(), state: z.string(), country: z.string()}))
  .mutation(async ({ctx, input}) => {
    const property = await ctx.prisma.property.create({
      data: {
        apartment: input.apartment,
        streetNumber: input.streetNumber,
        street: input.street,
        suburb: input.suburb,
        postcode: input.postcode,
        state: input.state,
        country: input.country,
        homeownerUserId: ctx.currentUser
      }
    });
    return property;
  }),
  updateProperty: privateProcedure
  .input(z.object({ id: z.string(), type: z.string().optional(), roomInfo: z.object({ bedrooms: z.number(), bathrooms: z.number(), carSpaces: z.number()}).optional(), landSize: z.number().optional(), floorSize: z.number().optional(), height: z.number().optional(), wallType: z.string().optional()}))
  .mutation(async ({ctx, input}) => {
    if (input.type) {
      const property = await ctx.prisma.property.update({
        where: {
          id: input.id
        },
        data: {
          type: input.type
        }
      });
      return property;
    } else if (input.roomInfo) {
      const property = await ctx.prisma.property.update({
        where: {
          id: input.id
        },
        data: {
          bedrooms: input.roomInfo.bedrooms,
          bathrooms: input.roomInfo.bathrooms,
          carSpaces: input.roomInfo.carSpaces
        }
      });
      return property;
    } else if (input.landSize) {
      const property = await ctx.prisma.property.update({
        where: {
          id: input.id
        },
        data: {
          landSize: input.landSize
        }
      });
      return property;
    } else if (input.floorSize) {
      const property = await ctx.prisma.property.update({
        where: {
          id: input.id
        },
        data: {
          floorSize: input.floorSize
        }
      });
      return property;
    }   else if (input.height) {
      const property = await ctx.prisma.property.update({
        where: {
          id: input.id
        },
        data: {
          height: input.height
        }
      });
      return property;
    } else if (input.wallType) {
      const property = await ctx.prisma.property.update({
        where: {
          id: input.id
        },
        data: {
          wallType: input.wallType
        }
      });
      return property;
    }
  }),
  getRoom: privateProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ctx, input}) => {
    const room = await ctx.prisma.room.findUnique({
      where: {
        id: input.id
      }
    });
    return room;
  }),
  updateRoom: privateProcedure
  .input(z.object({ id: z.string(), label: z.string().optional()}))
  .mutation(async ({ctx, input}) => {
    const room = await ctx.prisma.room.update({
      where: {
        id: input.id
      },
      data: {
        label: input.label
      }
    });
    return room;
  }),
  getHistoryForRoom: privateProcedure
  .input(z.object({ roomId: z.string() }))
  .query(async ({ctx, input}) => {
    
    return null;
  }),
});
